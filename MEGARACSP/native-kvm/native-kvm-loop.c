#include <linux/loop.h>
#include <stdint.h>

#define O_RDONLY 0
#define O_RDWR 2
#define SYS_EXIT 1
#define SYS_OPEN 5
#define SYS_CLOSE 6
#define SYS_IOCTL 54

static long syscall3(long number, long first, long second, long third)
{
	register long r0 __asm__("r0") = first;
	register long r1 __asm__("r1") = second;
	register long r2 __asm__("r2") = third;
	register long r7 __asm__("r7") = number;
	__asm__ volatile ("svc 0" : "+r"(r0) : "r"(r1), "r"(r2), "r"(r7) : "memory");
	return r0;
}

static int strings_equal(const char *first, const char *second)
{
	while (*first == *second) {
		if (*first == '\0') return 1;
		first++;
		second++;
	}
	return 0;
}

static int parse_offset(const char *text, uint64_t *offset)
{
	uint64_t value = 0;
	unsigned base = 10;
	if (*text == '0' && (text[1] == 'x' || text[1] == 'X')) {
		base = 16;
		text += 2;
	}
	if (*text == '\0') return -1;
	while (*text != '\0') {
		unsigned digit;
		if (*text >= '0' && *text <= '9') digit = (unsigned)(*text - '0');
		else if (*text >= 'a' && *text <= 'f') digit = (unsigned)(*text - 'a') + 10;
		else if (*text >= 'A' && *text <= 'F') digit = (unsigned)(*text - 'A') + 10;
		else return -1;
		if (digit >= base) return -1;
		value = value * base + digit;
		text++;
	}
	*offset = value;
	return 0;
}

int loop_main(unsigned long *stack)
{
	int argc = (int)stack[0];
	char **argv = (char **)(stack + 1);
	long loop_fd;
	if (argc == 3 && strings_equal(argv[1], "-d")) {
		loop_fd = syscall3(SYS_OPEN, (long)argv[2], O_RDWR, 0);
		if (loop_fd < 0 || syscall3(SYS_IOCTL, loop_fd, LOOP_CLR_FD, 0) < 0) return 1;
		syscall3(SYS_CLOSE, loop_fd, 0, 0);
		return 0;
	}
	if (argc != 4) return 2;

	uint64_t offset;
	long backing_fd;
	struct loop_info64 info;
	unsigned char *byte = (unsigned char *)&info;
	unsigned i;
	if (parse_offset(argv[3], &offset) < 0) return 2;
	backing_fd = syscall3(SYS_OPEN, (long)argv[2], O_RDONLY, 0);
	loop_fd = syscall3(SYS_OPEN, (long)argv[1], O_RDWR, 0);
	if (backing_fd < 0 || loop_fd < 0) return 1;
	if (syscall3(SYS_IOCTL, loop_fd, LOOP_SET_FD, backing_fd) < 0) return 1;
	for (i = 0; i < sizeof(info); i++) byte[i] = 0;
	info.lo_offset = offset;
	info.lo_flags = LO_FLAGS_READ_ONLY;
	for (i = 0; argv[2][i] != '\0' && i + 1 < LO_NAME_SIZE; i++) info.lo_file_name[i] = argv[2][i];
	if (syscall3(SYS_IOCTL, loop_fd, LOOP_SET_STATUS64, (long)&info) < 0) {
		syscall3(SYS_IOCTL, loop_fd, LOOP_CLR_FD, 0);
		return 1;
	}
	syscall3(SYS_CLOSE, backing_fd, 0, 0);
	syscall3(SYS_CLOSE, loop_fd, 0, 0);
	return 0;
}
