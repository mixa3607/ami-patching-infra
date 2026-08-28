/*
 * dio - I2C SMBus byte tool for the IMB760 Digital I/O PCA9554PW.
 *
 * Freestanding static ARM EABI executable, no libc. Talks to the PCA9554 on
 * the shared PCH SMBus (BMC i2c-0, 7-bit address 0x22).
 *
 *   dio r <bus> <addr> [reg]      read one byte register
 *   dio w <bus> <addr> <reg> <val>  write one byte register
 */
typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

typedef union { u8 byte; u16 word; u8 block[34]; } smbus_data;
typedef struct { u8 read_write; u8 command; u32 size; smbus_data *data; } smbus_ioctl_data;

#define SYS_close 6
#define SYS_write 4
#define SYS_ioctl 54
#define O_RDWR 2
#define I2C_SLAVE 0x0703
#define I2C_SMBUS 0x0720
#define I2C_SMBUS_READ 1
#define I2C_SMBUS_WRITE 0
#define I2C_SMBUS_BYTE_DATA 2

static long sc(long n, long a, long b, long c)
{
	register long r0 __asm__("r0") = a;
	register long r1 __asm__("r1") = b;
	register long r2 __asm__("r2") = c;
	register long r7 __asm__("r7") = n;
	__asm__ volatile("svc 0" : "+r"(r0) : "r"(r1), "r"(r2), "r"(r7) : "memory");
	return r0;
}

static void put(const char *s)
{
	long n = 0;
	while (s[n]) n++;
	sc(SYS_write, 1, (long)s, n);
}

static void puthex(u32 v)
{
	char b[11];
	int i;
	b[0] = '0'; b[1] = 'x';
	for (i = 0; i < 8; i++) {
		int d = (v >> (28 - 4 * i)) & 0xf;
		b[2 + i] = d < 10 ? '0' + d : 'a' + d - 10;
	}
	b[10] = 0;
	put(b);
}

static long atol_h(const char *s)
{
	long v = 0;
	if (s[0] == '0' && (s[1] == 'x' || s[1] == 'X')) s += 2;
	for (; *s; s++) {
		char c = *s;
		int d;
		if (c >= '0' && c <= '9') d = c - '0';
		else if (c >= 'a' && c <= 'f') d = c - 'a' + 10;
		else if (c >= 'A' && c <= 'F') d = c - 'A' + 10;
		else break;
		v = v * 16 + d;
	}
	return v;
}

int main(int argc, char **argv)
{
	smbus_ioctl_data a;
	smbus_data d;
	int fd;
	if (argc < 4) {
		put("dio r <bus> <addr> [reg] | dio w <bus> <addr> <reg> <val>\n");
		return 1;
	}
	fd = sc(5, (long)argv[2], O_RDWR, 0);
	if (fd < 0) { put("open fail\n"); return 1; }
	if (sc(SYS_ioctl, fd, I2C_SLAVE, atol_h(argv[3])) < 0) { put("slave fail\n"); return 1; }
	if (argv[1][0] == 'r') {
		a.read_write = I2C_SMBUS_READ;
		a.command = (u8)(argc > 4 ? atol_h(argv[4]) : 0);
		a.size = I2C_SMBUS_BYTE_DATA;
		a.data = &d;
		if (sc(SYS_ioctl, fd, I2C_SMBUS, (long)&a) < 0) { put("read fail\n"); return 1; }
		puthex(d.byte);
		put("\n");
	} else {
		if (argc < 6) { put("dio w <bus> <addr> <reg> <val>\n"); return 1; }
		a.read_write = I2C_SMBUS_WRITE;
		a.command = (u8)atol_h(argv[4]);
		a.size = I2C_SMBUS_BYTE_DATA;
		d.byte = (u8)atol_h(argv[5]);
		a.data = &d;
		if (sc(SYS_ioctl, fd, I2C_SMBUS, (long)&a) < 0) { put("write fail\n"); return 1; }
		put("ok\n");
	}
	sc(SYS_close, fd, 0, 0);
	return 0;
}

__attribute__((naked)) void _start(void)
{
	__asm__ volatile(
		"ldr r0, [sp]\n"
		"add r1, sp, #4\n"
		"bl main\n"
		"mov r7, #1\n"
		"svc 0\n");
}
