#ifndef AMI_ABI_H
#define AMI_ABI_H

#include <stddef.h>
#include <stdint.h>
#include <sys/ioctl.h>

#define PACKED __attribute__((packed))

/* AST videocap userspace ABI.  This must remain a 32-bit ARM build. */
struct astcap_ioctl {
	int32_t opcode;
	int32_t error;
	uint32_t size;
	void *ptr;
	uint8_t reserved[2];
};

#define ASTCAP_MAGIC 'a'
#define ASTCAP_IOCCMD _IOWR(ASTCAP_MAGIC, 0, struct astcap_ioctl)
#define ASTCAP_IOCTL_START_CAPTURE _IOW(ASTCAP_MAGIC, 1, int)
#define ASTCAP_IOCTL_STOP_CAPTURE _IOW(ASTCAP_MAGIC, 2, int)
#define ASTCAP_IOCTL_GET_VIDEO _IOR(ASTCAP_MAGIC, 3, int)
#define ASTCAP_IOCTL_SUCCESS _IOR(ASTCAP_MAGIC, 10, int)
#define ASTCAP_IOCTL_NO_VIDEO_CHANGE _IOR(ASTCAP_MAGIC, 12, int)
#define ASTCAP_IOCTL_BLANK_SCREEN _IOR(ASTCAP_MAGIC, 13, int)

#define ASTCAP_HEADER_SIZE (16U * 1024U)
#define ASTCAP_COMPRESS_SIZE (4U * 1024U * 1024U)
#define ASTCAP_MAP_SIZE (ASTCAP_HEADER_SIZE + ASTCAP_COMPRESS_SIZE)

struct astcap_tile_info {
	uint8_t pos_x;
	uint8_t pos_y;
	uint32_t width;
	uint32_t height;
	uint32_t compressed_size;
} PACKED;

struct astcap_video_header {
	uint16_t engine_version;
	uint16_t header_len;
	uint16_t source_x;
	uint16_t source_y;
	uint16_t source_depth;
	uint16_t source_refresh;
	uint8_t source_mode;
	uint16_t destination_x;
	uint16_t destination_y;
	uint16_t destination_depth;
	uint16_t destination_refresh;
	uint8_t destination_mode;
	uint32_t frame_start_code;
	uint32_t frame_number;
	uint16_t frame_hsize;
	uint16_t frame_vsize;
	uint32_t frame_reserved[2];
	uint8_t compression_mode;
	uint8_t jpeg_scale_factor;
	uint8_t jpeg_table_selector;
	uint8_t jpeg_yuv_mapping;
	uint8_t sharp_mode;
	uint8_t advance_table_selector;
	uint8_t advance_scale_factor;
	uint32_t number_of_mb;
	uint8_t rc4_enable;
	uint8_t rc4_reset;
	uint8_t mode_420;
	uint8_t down_scaling_method;
	uint8_t differential_setting;
	uint16_t analog_differential_threshold;
	uint16_t digital_differential_threshold;
	uint8_t external_signal_enable;
	uint8_t auto_mode;
	uint8_t vq_mode;
	uint32_t source_frame_size;
	uint32_t compress_size;
	uint32_t hdebug;
	uint32_t vdebug;
	uint8_t input_signal;
	uint16_t cursor_x;
	uint16_t cursor_y;
} PACKED;

/* AMI iUSB userspace ABI. */
struct iusb_header {
	uint8_t signature[8];
	uint8_t major;
	uint8_t minor;
	uint8_t header_len;
	uint8_t header_checksum;
	uint32_t data_packet_len;
	uint8_t server_caps;
	uint8_t device_type;
	uint8_t protocol;
	uint8_t direction;
	uint8_t device_no;
	uint8_t interface_no;
	uint8_t client_data;
	uint8_t instance;
	uint32_t sequence_no;
	uint32_t key;
} PACKED;

struct iusb_device_info {
	uint8_t device_type;
	uint8_t device_no;
	uint8_t interface_no;
	uint8_t lock_type;
	uint8_t instance;
} PACKED;

struct iusb_device_list {
	struct iusb_header header;
	uint8_t count;
	struct iusb_device_info devices[1];
} PACKED;

struct iusb_free_device_info {
	uint8_t device_type;
	uint8_t lock_type;
	struct iusb_device_list list;
} PACKED;

struct iusb_request_release {
	struct iusb_device_info device;
	uint32_t key;
} PACKED;

struct iusb_ioctl_data {
	uint32_t key;
	struct iusb_device_info device;
	uint8_t data;
} PACKED;

struct iusb_hid_packet {
	struct iusb_header header;
	uint8_t data_length;
	uint8_t data[];
} PACKED;

struct iusb_absolute_mouse_report {
	uint8_t buttons;
	uint16_t x;
	uint16_t y;
	int8_t wheel;
} PACKED;

#define IUSB_DEVICE_KEYBOARD 0x30
#define IUSB_DEVICE_MOUSE 0x31
#define IUSB_LOCK_EXCLUSIVE 0x01
#define IUSB_PROTOCOL_KEYBOARD_DATA 0x10
#define IUSB_PROTOCOL_MOUSE_DATA 0x20
#define IUSB_FROM_REMOTE 0x80

/* The vendor driver deliberately uses 0x3fff instead of sizeof(arg). */
#define USB_GET_IUSB_DEVICES _IOC(_IOC_READ, 'U', 0x00, 0x3fff)
#define USB_GET_INTERFACES _IOC(_IOC_READ, 'U', 0xf1, 0x3fff)
#define USB_REQ_INTERFACE _IOC(_IOC_READ, 'U', 0xf2, 0x3fff)
#define USB_REL_INTERFACE _IOC(_IOC_WRITE, 'U', 0xf3, 0x3fff)
#define USB_ENABLE_ALL_DEVICE _IOC(_IOC_WRITE, 'U', 0xf5, 0x3fff)
#define USB_KEYBD_DATA _IOC(_IOC_WRITE, 'U', 0x11, 0x3fff)
#define USB_MOUSE_DATA _IOC(_IOC_WRITE, 'U', 0x21, 0x3fff)
#define MOUSE_REL_TO_ABS _IOC(_IOC_WRITE, 'U', 0x23, 0x3fff)

_Static_assert(sizeof(void *) == 4, "AMI ABI requires a 32-bit userspace build");
_Static_assert(sizeof(struct astcap_ioctl) == 20, "unexpected ASTCap_Ioctl ABI");
_Static_assert(sizeof(struct astcap_tile_info) == 14, "unexpected tile ABI");
_Static_assert(sizeof(struct astcap_video_header) == 86, "unexpected video header ABI");
_Static_assert(sizeof(struct iusb_header) == 32, "unexpected IUSB_HEADER ABI");
_Static_assert(sizeof(struct iusb_device_info) == 5, "unexpected IUSB_DEVICE_INFO ABI");
_Static_assert(sizeof(struct iusb_request_release) == 9, "unexpected request ABI");
_Static_assert(offsetof(struct iusb_request_release, key) == 5, "unexpected request key offset");
_Static_assert(sizeof(struct iusb_ioctl_data) == 10, "unexpected ioctl data ABI");
_Static_assert(offsetof(struct iusb_ioctl_data, key) == 0, "unexpected ioctl key offset");
_Static_assert(offsetof(struct iusb_ioctl_data, device) == 4, "unexpected ioctl device offset");
_Static_assert(offsetof(struct iusb_ioctl_data, data) == 9, "unexpected ioctl data offset");
_Static_assert(sizeof(struct iusb_hid_packet) == 33, "unexpected HID packet ABI");
_Static_assert(sizeof(struct iusb_absolute_mouse_report) == 6, "unexpected mouse report ABI");

#endif
