#include "ami_abi.h"

#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>

#define IUSB_BUFFER_SIZE 16384U
#define MAX_RESERVATIONS 32U

static void print_device(const char *prefix, const struct iusb_device_info *device)
{
	printf("%s type=0x%02x dev=%u interface=%u lock=0x%02x instance=%u\n",
		prefix, device->device_type, device->device_no, device->interface_no,
		device->lock_type, device->instance);
}

static size_t bounded_count(uint8_t count, size_t prefix)
{
	size_t capacity = (IUSB_BUFFER_SIZE - prefix) / sizeof(struct iusb_device_info);
	return count < capacity ? count : capacity;
}

int main(int argc, char **argv)
{
	const char *device_path = argc > 1 ? argv[1] : "/dev/usb";
	struct iusb_request_release reservations[MAX_RESERVATIONS];
	uint8_t *buffer = NULL;
	size_t reservation_count = 0;
	int fd = -1;
	int result = EXIT_FAILURE;
	unsigned type_index;
	static const uint8_t hid_types[] = {IUSB_DEVICE_KEYBOARD, IUSB_DEVICE_MOUSE};

	if (argc > 2) {
		fprintf(stderr, "usage: %s [/dev/usb]\n", argv[0]);
		return EXIT_FAILURE;
	}
	buffer = calloc(1, IUSB_BUFFER_SIZE);
	if (buffer == NULL) {
		perror("calloc");
		goto out;
	}
	fd = open(device_path, O_RDWR);
	if (fd < 0) {
		fprintf(stderr, "cannot open %s: %s\n", device_path, strerror(errno));
		goto out;
	}

	if (ioctl(fd, USB_GET_IUSB_DEVICES, buffer) < 0) {
		fprintf(stderr, "USB_GET_IUSB_DEVICES failed: %s\n", strerror(errno));
		goto out;
	} else {
		struct iusb_device_list *list = (struct iusb_device_list *)buffer;
		size_t count = bounded_count(list->count, sizeof(list->header) + 1);
		size_t i;

		printf("configured iUSB interfaces: reported=%u parsed=%lu\n",
			list->count, (unsigned long)count);
		for (i = 0; i < count; ++i)
			print_device("  configured", &list->devices[i]);
	}

	for (type_index = 0; type_index < sizeof(hid_types); ++type_index) {
		struct iusb_free_device_info *free_info;
		size_t count;
		size_t i;

		memset(buffer, 0, IUSB_BUFFER_SIZE);
		free_info = (struct iusb_free_device_info *)buffer;
		free_info->device_type = hid_types[type_index];
		free_info->lock_type = IUSB_LOCK_EXCLUSIVE;
		if (ioctl(fd, USB_GET_INTERFACES, buffer) < 0) {
			fprintf(stderr, "no free exclusive type 0x%02x interface: %s\n",
				hid_types[type_index], strerror(errno));
			continue;
		}
		count = bounded_count(free_info->list.count,
			2 + sizeof(free_info->list.header) + 1);
		printf("free type 0x%02x interfaces: reported=%u parsed=%lu\n",
			hid_types[type_index], free_info->list.count, (unsigned long)count);
		for (i = 0; i < count; ++i) {
			struct iusb_request_release request;

			print_device("  candidate", &free_info->list.devices[i]);
			if (reservation_count == MAX_RESERVATIONS) {
				fprintf(stderr, "reservation capacity reached\n");
				goto release;
			}
			memset(&request, 0, sizeof(request));
			memcpy(&request.device, &free_info->list.devices[i], sizeof(request.device));
			if (ioctl(fd, USB_REQ_INTERFACE, &request) < 0) {
				fprintf(stderr, "  request failed: %s\n", strerror(errno));
				continue;
			}
			reservations[reservation_count++] = request;
			printf("  reserved dev=%u interface=%u key=0x%08lx\n",
				request.device.device_no, request.device.interface_no,
				(unsigned long)request.key);
		}
	}
	result = EXIT_SUCCESS;

release:
	while (reservation_count != 0) {
		struct iusb_request_release *request = &reservations[--reservation_count];
		if (ioctl(fd, USB_REL_INTERFACE, request) < 0) {
			fprintf(stderr, "release dev=%u interface=%u key=0x%08lx failed: %s\n",
				request->device.device_no, request->device.interface_no,
				(unsigned long)request->key, strerror(errno));
			result = EXIT_FAILURE;
		} else {
			printf("released dev=%u interface=%u key=0x%08lx\n",
				request->device.device_no, request->device.interface_no,
				(unsigned long)request->key);
		}
	}
out:
	if (fd >= 0)
		close(fd);
	free(buffer);
	return result;
}
