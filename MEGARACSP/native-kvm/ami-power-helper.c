#include <stddef.h>
#include <stdint.h>

typedef uint16_t ipmi_result;

extern ipmi_result LIBIPMI_Create_IPMI_Local_Session(void *session, char *username,
	char *password, uint8_t *privilege, void *reserved, uint8_t authenticate, unsigned timeout);
extern ipmi_result LIBIPMI_CloseSession(void *session);
extern ipmi_result LIBIPMI_HL_GetChassisStatus(void *session, unsigned retries, void *status);
extern ipmi_result LIBIPMI_HL_PowerOff(void *session, unsigned retries);
extern ipmi_result LIBIPMI_HL_PowerUp(void *session, unsigned retries);
extern ipmi_result LIBIPMI_HL_PowerCycle(void *session, unsigned retries);
extern ipmi_result LIBIPMI_HL_HardReset(void *session, unsigned retries);
extern ipmi_result LIBIPMI_HL_SoftOff(void *session, unsigned retries);

static uint32_t session_storage[1024];
static char empty_string[] = "";

static size_t string_length(const char *text)
{
	size_t length = 0;
	while (text[length] != '\0')
		length++;
	return length;
}

static int string_equal(const char *left, const char *right)
{
	while (*left == *right && *left != '\0') {
		left++;
		right++;
	}
	return *left == *right;
}

static void write_stdout(const char *text)
{
	register long r0 __asm__("r0") = 1;
	register const char *r1 __asm__("r1") = text;
	register size_t r2 __asm__("r2") = string_length(text);
	register long r7 __asm__("r7") = 4;
	__asm__ volatile("svc #0" : "+r"(r0) : "r"(r1), "r"(r2), "r"(r7) : "memory");
}

int power_main(int argc, char **argv)
{
	uint8_t privilege = 4;
	uint8_t chassis_status[8] = {0};
	ipmi_result result;
	if (argc != 2)
		return 2;
	result = LIBIPMI_Create_IPMI_Local_Session(session_storage, empty_string, empty_string,
		&privilege, NULL, 1, 5);
	if (result != 0)
		return 3;
	if (string_equal(argv[1], "status")) {
		result = LIBIPMI_HL_GetChassisStatus(session_storage, 2, chassis_status);
		if (result == 0)
			write_stdout(chassis_status[0] != 0 ? "on\n" : "off\n");
	} else if (string_equal(argv[1], "on")) {
		result = LIBIPMI_HL_PowerUp(session_storage, 2);
	} else if (string_equal(argv[1], "off")) {
		result = LIBIPMI_HL_PowerOff(session_storage, 2);
	} else if (string_equal(argv[1], "soft")) {
		result = LIBIPMI_HL_SoftOff(session_storage, 2);
	} else if (string_equal(argv[1], "cycle")) {
		result = LIBIPMI_HL_PowerCycle(session_storage, 2);
	} else {
		result = 1;
	}
	LIBIPMI_CloseSession(session_storage);
	return result == 0 ? 0 : 4;
}
