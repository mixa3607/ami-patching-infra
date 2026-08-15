#define _GNU_SOURCE
#include "ami_abi.h"

#include <arpa/inet.h>
#include <errno.h>
#include <fcntl.h>
#include <getopt.h>
#include <netinet/in.h>
#include <pthread.h>
#include <signal.h>
#include <stdarg.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <strings.h>
#include <sys/mman.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <sys/time.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

#define HTTP_BUFFER_SIZE 8192
#define MAX_CLIENTS 32
#define IUSB_BUFFER_SIZE 16384
#define QUEUE_FULL_WARNING 100
#define ADVISERD_GLOBAL_BASE ((off_t)0x27588)
#define ADVISERD_MOUSE_ADDRESS (ADVISERD_GLOBAL_BASE + 24)
#define ADVISERD_KEYBOARD_ADDRESS (ADVISERD_GLOBAL_BASE + 36)
#define ADVISERD_TERM_WAIT_MS 5000
#define ADVISERD_KILL_WAIT_MS 5000
#define ADOPT_FILE_SIZE (2U * sizeof(struct iusb_request_release))
#define WS_MAX_FRAME (1024U * 1024U)
#define RFB_MAX_CUT_TEXT (1024U * 1024U)
#define RFB_MAX_PASTE (16U * 1024U)
#define VIDEO_MAX_WIDTH 1920U
#define VIDEO_MAX_HEIGHT 1200U
#define FRAME_CACHE_MAX_BYTES (8U * 1024U * 1024U)
#define FRAME_CACHE_MAX_COUNT 64U

struct capture_frame {
	uint8_t *jpeg;
	size_t jpeg_size;
	uint16_t framebuffer_width;
	uint16_t framebuffer_height;
	uint16_t x;
	uint16_t y;
	uint16_t width;
	uint16_t height;
	uint64_t generation;
	uint64_t sequence;
	bool full;
};

struct cached_frame {
	struct capture_frame frame;
	struct cached_frame *next;
};

struct server_state {
	int video_fd;
	uint8_t *video_map;
	int usb_fd;
	struct iusb_request_release keyboard;
	struct iusb_request_release mouse;
	bool keyboard_reserved;
	bool mouse_reserved;
	bool input_enabled;
	uint32_t sequence;
	uint16_t mouse_x;
	uint16_t mouse_y;
	uint16_t video_width;
	uint16_t video_height;
	bool video_online;
	bool video_force_pending;
	bool power_known;
	bool power_on;
	uint64_t video_generation;
	time_t last_video_restart;
	uint64_t frame_sequence;
	struct cached_frame *frame_cache_head;
	struct cached_frame *frame_cache_tail;
	size_t frame_cache_bytes;
	unsigned frame_cache_count;
	const char *jpeg_quality_path;
	unsigned jpeg_quality;
	const char *power_helper;
	char authorization[256];
	pthread_mutex_t video_lock;
	pthread_mutex_t usb_lock;
	pthread_mutex_t clients_lock;
	pthread_mutex_t power_lock;
	pthread_cond_t clients_done;
	unsigned clients;
	int web_root_fd;
};

static struct server_state state = {
	.video_fd = -1,
	.video_map = MAP_FAILED,
	.usb_fd = -1,
	.web_root_fd = -1,
	.sequence = 1,
	.mouse_x = 16384,
	.mouse_y = 16384,
	.video_width = 1024,
	.video_height = 768,
	.video_lock = PTHREAD_MUTEX_INITIALIZER,
	.usb_lock = PTHREAD_MUTEX_INITIALIZER,
	.clients_lock = PTHREAD_MUTEX_INITIALIZER,
	.power_lock = PTHREAD_MUTEX_INITIALIZER,
	.clients_done = PTHREAD_COND_INITIALIZER,
};
static volatile sig_atomic_t stopping;
static int listen_fd = -1;

static const char index_html[] =
"<!doctype html><html><head><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'>"
"<title>AMI KVM</title><style>html,body{margin:0;height:100%;background:#111;color:#ddd;font:14px sans-serif}"
"body{display:grid;place-items:center;overflow:hidden}#screen{max-width:100vw;max-height:100vh;outline:none;image-rendering:auto}"
"#status{position:fixed;left:8px;top:8px;padding:5px 8px;background:#000b;border-radius:3px;pointer-events:none}</style></head>"
"<body><img id=screen tabindex=0 alt='BMC video'><div id=status>connecting</div><script>"
"const img=document.getElementById('screen'),status=document.getElementById('status');let oldUrl='',mods=0,buttons=0,pendingMouse=null,mouseBusy=false,keyChain=Promise.resolve();"
"const held=new Set();const codes={Escape:0x29,Digit1:0x1e,Digit2:0x1f,Digit3:0x20,Digit4:0x21,Digit5:0x22,Digit6:0x23,Digit7:0x24,Digit8:0x25,Digit9:0x26,Digit0:0x27,Minus:0x2d,Equal:0x2e,Backspace:0x2a,Tab:0x2b,Space:0x2c,Enter:0x28,BracketLeft:0x2f,BracketRight:0x30,Backslash:0x31,Semicolon:0x33,Quote:0x34,Backquote:0x35,Comma:0x36,Period:0x37,Slash:0x38,CapsLock:0x39,F1:0x3a,F2:0x3b,F3:0x3c,F4:0x3d,F5:0x3e,F6:0x3f,F7:0x40,F8:0x41,F9:0x42,F10:0x43,F11:0x44,F12:0x45,PrintScreen:0x46,ScrollLock:0x47,Pause:0x48,Insert:0x49,Home:0x4a,PageUp:0x4b,Delete:0x4c,End:0x4d,PageDown:0x4e,ArrowRight:0x4f,ArrowLeft:0x50,ArrowDown:0x51,ArrowUp:0x52,NumLock:0x53,NumpadDivide:0x54,NumpadMultiply:0x55,NumpadSubtract:0x56,NumpadAdd:0x57,NumpadEnter:0x58,Numpad1:0x59,Numpad2:0x5a,Numpad3:0x5b,Numpad4:0x5c,Numpad5:0x5d,Numpad6:0x5e,Numpad7:0x5f,Numpad8:0x60,Numpad9:0x61,Numpad0:0x62,NumpadDecimal:0x63,IntlBackslash:0x64,ContextMenu:0x65};"
"for(let i=0;i<26;i++)codes['Key'+String.fromCharCode(65+i)]=4+i;"
"const modCodes={ControlLeft:1,ShiftLeft:2,AltLeft:4,MetaLeft:8,ControlRight:16,ShiftRight:32,AltRight:64,MetaRight:128};"
"function report(){const b=new Uint8Array(8);b[0]=mods;let i=2;for(const k of held){if(i<8)b[i++]=k}keyChain=keyChain.then(()=>fetch('/input/keyboard',{method:'POST',body:b,cache:'no-store'})).catch(()=>{})}"
"function key(e,down){if(modCodes[e.code]){if(down)mods|=modCodes[e.code];else mods&=~modCodes[e.code]}else if(codes[e.code]){if(down){if(held.size<6)held.add(codes[e.code])}else held.delete(codes[e.code])}else return;e.preventDefault();if(!e.repeat)report()}"
"addEventListener('keydown',e=>key(e,true));addEventListener('keyup',e=>key(e,false));"
"function mouse(e,wheel=0){const r=img.getBoundingClientRect();if(!r.width||!r.height)return;const x=Math.max(0,Math.min(r.width-1,e.clientX-r.left));const y=Math.max(0,Math.min(r.height-1,e.clientY-r.top));pendingMouse=`x=${x|0}&y=${y|0}&width=${r.width|0}&height=${r.height|0}&buttons=${buttons}&wheel=${wheel}`}"
"setInterval(async()=>{if(pendingMouse!==null&&!mouseBusy){mouseBusy=true;const b=pendingMouse;pendingMouse=null;try{await fetch('/input/mouse',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b,cache:'no-store'})}catch(e){}mouseBusy=false}},16);"
"img.onmousemove=e=>mouse(e);img.onmousedown=e=>{buttons=e.buttons;mouse(e);img.focus();e.preventDefault()};img.onmouseup=e=>{buttons=e.buttons;mouse(e);e.preventDefault()};img.onwheel=e=>{mouse(e,Math.max(-127,Math.min(127,Math.sign(e.deltaY))));e.preventDefault()};img.oncontextmenu=e=>e.preventDefault();"
"function release(){mods=buttons=0;held.clear();const z=new Uint8Array(8);navigator.sendBeacon('/input/keyboard',z);navigator.sendBeacon('/input/mouse','x=0&y=0&width=1&height=1&buttons=0&wheel=0')}"
"addEventListener('blur',()=>{release();report()});addEventListener('pagehide',release);"
"async function frames(){while(true){try{const r=await fetch('/frame.jpg?t='+Date.now(),{cache:'no-store'});if(!r.ok)throw Error(r.status);const b=await r.blob(),u=URL.createObjectURL(b);img.src=u;if(oldUrl)URL.revokeObjectURL(oldUrl);oldUrl=u;status.textContent='connected'}catch(e){status.textContent='video unavailable';await new Promise(r=>setTimeout(r,500))}}}img.focus();frames();"
"</script></body></html>";

static void log_message(const char *format, ...)
{
	va_list args;
	va_start(args, format);
	vfprintf(stderr, format, args);
	fputc('\n', stderr);
	va_end(args);
}

static int write_all_fd(int fd, const void *buffer, size_t length)
{
	const uint8_t *data = buffer;
	while (length != 0) {
		ssize_t done = write(fd, data, length);
		if (done < 0) {
			if (errno == EINTR)
				continue;
			return -1;
		}
		data += done;
		length -= (size_t)done;
	}
	return 0;
}

static int send_all(int fd, const void *buffer, size_t length)
{
	const uint8_t *data = buffer;
	while (length != 0) {
		ssize_t done = send(fd, data, length, MSG_NOSIGNAL);
		if (done < 0) {
			if (errno == EINTR)
				continue;
			return -1;
		}
		data += done;
		length -= (size_t)done;
	}
	return 0;
}

static void send_response(int fd, int status, const char *reason, const char *type,
	const void *body, size_t length)
{
	char header[512];
	int size = snprintf(header, sizeof(header),
		"HTTP/1.1 %d %s\r\nContent-Type: %s\r\nContent-Length: %lu\r\n"
		"Cache-Control: no-store, no-cache, must-revalidate\r\nConnection: close\r\n"
		"X-Content-Type-Options: nosniff\r\n\r\n",
		status, reason, type, (unsigned long)length);
	if (size > 0 && (size_t)size < sizeof(header) && send_all(fd, header, (size_t)size) == 0 && length != 0)
		send_all(fd, body, length);
}

static void serve_kvm_status(int fd)
{
	char body[96];
	bool video_online;
	bool input_enabled;
	int length;

	pthread_mutex_lock(&state.video_lock);
	video_online = state.video_online;
	pthread_mutex_unlock(&state.video_lock);
	input_enabled = state.input_enabled;
	length = snprintf(body, sizeof(body), "{\"video\":\"%s\",\"input\":\"%s\"}\n",
		video_online ? "active" : "unavailable", input_enabled ? "enabled" : "disabled");
	if (length < 0 || (size_t)length >= sizeof(body))
		send_response(fd, 500, "Internal Server Error", "text/plain", "status failed\n", 14);
	else
		send_response(fd, 200, "OK", "application/json", body, (size_t)length);
}

static int write_unsigned_setting(const char *path, unsigned value)
{
	char text[16];
	int fd = open(path, O_WRONLY);
	int result;
	int length;
	if (fd < 0)
		return -1;
	length = snprintf(text, sizeof(text), "%u\n", value);
	if (length < 0 || (size_t)length >= sizeof(text)) {
		close(fd);
		errno = EINVAL;
		return -1;
	}
	result = write_all_fd(fd, text, (size_t)length);
	if (close(fd) < 0 && result == 0)
		result = -1;
	return result;
}

static int video_command(int32_t opcode, struct astcap_ioctl *request)
{
	memset(request, 0, sizeof(*request));
	request->opcode = opcode;
	if (ioctl(state.video_fd, ASTCAP_IOCCMD, request) < 0)
		return -1;
	if (request->error != (int32_t)ASTCAP_IOCTL_SUCCESS) {
		errno = request->error == (int32_t)ASTCAP_IOCTL_BLANK_SCREEN ? ENODATA : EAGAIN;
		return -1;
	}
	return 0;
}

static int start_video_capture_locked(void)
{
	struct astcap_ioctl request;
	if (video_command(ASTCAP_IOCTL_START_CAPTURE, &request) < 0)
		return -1;
	state.video_generation++;
	state.video_force_pending = true;
	state.last_video_restart = time(NULL);
	if (state.jpeg_quality_path != NULL &&
	    write_unsigned_setting(state.jpeg_quality_path, state.jpeg_quality) < 0)
		log_message("warning: cannot set JPEG table selector through %s: %s",
			state.jpeg_quality_path, strerror(errno));
	return 0;
}

static void free_capture_frame(struct capture_frame *frame)
{
	free(frame->jpeg);
	memset(frame, 0, sizeof(*frame));
}

static int capture_jpeg_locked(struct capture_frame *frame, bool force_full)
{
	struct astcap_tile_info tile = {0};
	struct astcap_video_header video_header;
	struct astcap_ioctl request;
	const uint8_t *jpeg;
	size_t size;
	unsigned block_size;
	unsigned x;
	unsigned y;
	int append_eoi = 0;
	uint8_t *copy = NULL;
	bool expected_full;
	int result = -1;

	memset(frame, 0, sizeof(*frame));
	if (state.power_known && !state.power_on) {
		errno = ENODATA;
		return -1;
	}
	if (force_full && !state.video_force_pending && start_video_capture_locked() < 0)
		goto out;
	if (!force_full && !state.video_online && time(NULL) != state.last_video_restart &&
	    start_video_capture_locked() < 0)
		goto out;
	expected_full = state.video_force_pending;
	memset(&request, 0, sizeof(request));
	request.opcode = ASTCAP_IOCTL_GET_VIDEO;
	request.ptr = &tile;
	if (ioctl(state.video_fd, ASTCAP_IOCCMD, &request) < 0)
		goto out;
	if (request.error != (int32_t)ASTCAP_IOCTL_SUCCESS) {
		if (request.error == (int32_t)ASTCAP_IOCTL_BLANK_SCREEN)
			errno = ENODATA;
		else if (request.error == (int32_t)ASTCAP_IOCTL_NO_VIDEO_CHANGE)
			errno = EALREADY;
		else
			errno = EAGAIN;
		state.video_online = request.error == (int32_t)ASTCAP_IOCTL_NO_VIDEO_CHANGE;
		goto out;
	}
	memcpy(&video_header, state.video_map, sizeof(video_header));
	size = request.size;
	jpeg = state.video_map + ASTCAP_HEADER_SIZE;
	if (size < 4 || size > ASTCAP_COMPRESS_SIZE || tile.compressed_size != size ||
	    jpeg[0] != 0xff || jpeg[1] != 0xd8 || video_header.source_x == 0 ||
	    video_header.source_y == 0 || video_header.source_x > VIDEO_MAX_WIDTH ||
	    video_header.source_y > VIDEO_MAX_HEIGHT || tile.width == 0 || tile.height == 0 ||
	    tile.width > UINT16_MAX || tile.height > UINT16_MAX) {
		errno = EPROTO;
		goto out;
	}
	block_size = video_header.mode_420 ? 16U : 8U;
	x = (unsigned)tile.pos_x * block_size;
	y = (unsigned)tile.pos_y * block_size;
	if (x >= video_header.source_x || y >= video_header.source_y ||
	    tile.width > video_header.source_x - x || tile.height > video_header.source_y - y) {
		errno = EPROTO;
		goto out;
	}
	if (jpeg[size - 2] != 0xff || jpeg[size - 1] != 0xd9) {
		size_t i;
		for (i = size; i >= 2; --i) {
			if (jpeg[i - 2] == 0xff && jpeg[i - 1] == 0xd9) {
				size = i;
				break;
			}
		}
		if (i < 2)
			append_eoi = 1;
	}
	copy = malloc(size + (append_eoi ? 2 : 0));
	if (copy == NULL)
		goto out;
	memcpy(copy, jpeg, size);
	if (append_eoi) {
		copy[size++] = 0xff;
		copy[size++] = 0xd9;
	}
	frame->jpeg = copy;
	frame->jpeg_size = size;
	frame->framebuffer_width = video_header.source_x;
	frame->framebuffer_height = video_header.source_y;
	frame->x = (uint16_t)x;
	frame->y = (uint16_t)y;
	frame->width = (uint16_t)tile.width;
	frame->height = (uint16_t)tile.height;
	frame->generation = state.video_generation;
	frame->full = expected_full || (x == 0 && y == 0 &&
		tile.width == video_header.source_x && tile.height == video_header.source_y);
	state.video_width = video_header.source_x;
	state.video_height = video_header.source_y;
	state.video_online = true;
	state.video_force_pending = false;
	result = 0;
out:
	return result;
}

static int clone_capture_frame(struct capture_frame *destination, const struct capture_frame *source)
{
	*destination = *source;
	destination->jpeg = malloc(source->jpeg_size);
	if (destination->jpeg == NULL) {
		memset(destination, 0, sizeof(*destination));
		return -1;
	}
	memcpy(destination->jpeg, source->jpeg, source->jpeg_size);
	return 0;
}

static void evict_cached_frame_locked(void)
{
	struct cached_frame *cached = state.frame_cache_head;
	if (cached == NULL)
		return;
	state.frame_cache_head = cached->next;
	if (state.frame_cache_head == NULL)
		state.frame_cache_tail = NULL;
	state.frame_cache_bytes -= cached->frame.jpeg_size;
	state.frame_cache_count--;
	free_capture_frame(&cached->frame);
	free(cached);
}

static int cache_capture_frame_locked(struct capture_frame *frame)
{
	struct cached_frame *cached = calloc(1, sizeof(*cached));
	frame->sequence = ++state.frame_sequence;
	if (cached == NULL || clone_capture_frame(&cached->frame, frame) < 0) {
		free(cached);
		return -1;
	}
	if (state.frame_cache_tail == NULL)
		state.frame_cache_head = cached;
	else
		state.frame_cache_tail->next = cached;
	state.frame_cache_tail = cached;
	state.frame_cache_bytes += frame->jpeg_size;
	state.frame_cache_count++;
	while (state.frame_cache_head != state.frame_cache_tail &&
	       (state.frame_cache_bytes > FRAME_CACHE_MAX_BYTES ||
	        state.frame_cache_count > FRAME_CACHE_MAX_COUNT))
		evict_cached_frame_locked();
	return 0;
}

static struct cached_frame *find_cached_frame_locked(uint64_t after_sequence, bool require_full)
{
	struct cached_frame *cached;
	struct cached_frame *full = NULL;
	if (after_sequence == 0) {
		for (cached = state.frame_cache_head; cached != NULL; cached = cached->next)
			if (cached->frame.full)
				full = cached;
		return full;
	}
	for (cached = state.frame_cache_head; cached != NULL; cached = cached->next) {
		if (cached->frame.sequence == after_sequence + 1 && !require_full)
			return cached;
		if (cached->frame.sequence > after_sequence && cached->frame.full && full == NULL)
			full = cached;
	}
	return full;
}

static int capture_for_client(struct capture_frame *frame, uint64_t after_sequence, bool require_full)
{
	struct cached_frame *cached;
	bool force_capture = require_full || after_sequence == 0;
	int result;
	pthread_mutex_lock(&state.video_lock);
	cached = find_cached_frame_locked(after_sequence, require_full);
	if (cached != NULL) {
		result = clone_capture_frame(frame, &cached->frame);
		pthread_mutex_unlock(&state.video_lock);
		return result;
	}
	if (state.frame_cache_tail != NULL && state.frame_cache_tail->frame.sequence > after_sequence)
		force_capture = true;
	result = capture_jpeg_locked(frame, force_capture);
	if (result == 0 && cache_capture_frame_locked(frame) < 0) {
		log_message("warning: cannot cache captured frame");
		state.video_online = false;
	}
	pthread_mutex_unlock(&state.video_lock);
	return result;
}

static int capture_fresh_frame(struct capture_frame *frame)
{
	int result;
	pthread_mutex_lock(&state.video_lock);
	result = capture_jpeg_locked(frame, true);
	if (result == 0 && cache_capture_frame_locked(frame) < 0) {
		log_message("warning: cannot cache captured frame");
		state.video_online = false;
	}
	pthread_mutex_unlock(&state.video_lock);
	return result;
}

static uint8_t iusb_checksum(const struct iusb_header *header)
{
	const uint8_t *bytes = (const uint8_t *)header;
	uint8_t sum = 0;
	size_t i;
	for (i = 0; i < sizeof(*header); ++i)
		sum = (uint8_t)(sum + bytes[i]);
	return (uint8_t)(0U - sum);
}

static void form_hid_header(struct iusb_header *header,
	const struct iusb_request_release *reservation, uint8_t protocol, uint32_t payload_length)
{
	memset(header, 0, sizeof(*header));
	memcpy(header->signature, "IUSB    ", 8);
	header->major = 1;
	header->header_len = sizeof(*header);
	header->data_packet_len = payload_length;
	header->device_type = reservation->device.device_type;
	header->protocol = protocol;
	header->direction = IUSB_FROM_REMOTE;
	header->device_no = reservation->device.device_no;
	header->interface_no = reservation->device.interface_no;
	header->instance = reservation->device.instance;
	header->sequence_no = state.sequence++;
	header->key = reservation->key;
	header->header_checksum = iusb_checksum(header);
}

static int send_keyboard_locked(const uint8_t report[8])
{
	uint8_t packet[sizeof(struct iusb_hid_packet) + 8];
	struct iusb_hid_packet *hid = (struct iusb_hid_packet *)packet;
	int result;
	memset(packet, 0, sizeof(packet));
	form_hid_header(&hid->header, &state.keyboard, IUSB_PROTOCOL_KEYBOARD_DATA, 9);
	hid->data_length = 8;
	memcpy(hid->data, report, 8);
	result = ioctl(state.usb_fd, USB_KEYBD_DATA, packet);
	if (result == QUEUE_FULL_WARNING) {
		errno = EBUSY;
		return -1;
	}
	return result < 0 ? -1 : 0;
}

static int send_keyboard_retry_locked(const uint8_t report[8])
{
	struct timespec pause = {.tv_sec = 0, .tv_nsec = 2000000L};
	unsigned attempt;
	for (attempt = 0; attempt < 20; ++attempt) {
		if (send_keyboard_locked(report) == 0)
			return 0;
		if (errno != EBUSY)
			return -1;
		nanosleep(&pause, NULL);
	}
	errno = EBUSY;
	return -1;
}

static int send_mouse_locked(uint8_t buttons, uint16_t x, uint16_t y, int8_t wheel)
{
	uint8_t packet[sizeof(struct iusb_hid_packet) + sizeof(struct iusb_absolute_mouse_report)];
	struct iusb_hid_packet *hid = (struct iusb_hid_packet *)packet;
	struct iusb_absolute_mouse_report report;
	int result;
	memset(packet, 0, sizeof(packet));
	form_hid_header(&hid->header, &state.mouse, IUSB_PROTOCOL_MOUSE_DATA, 7);
	hid->data_length = sizeof(report);
	report.buttons = buttons & 7;
	report.x = x;
	report.y = y;
	report.wheel = wheel;
	memcpy(hid->data, &report, sizeof(report));
	result = ioctl(state.usb_fd, USB_MOUSE_DATA, packet);
	if (result == QUEUE_FULL_WARNING) {
		errno = EBUSY;
		return -1;
	}
	if (result >= 0) {
		state.mouse_x = x;
		state.mouse_y = y;
	}
	return result < 0 ? -1 : 0;
}

static int reserve_interface(uint8_t type, struct iusb_request_release *reservation)
{
	uint8_t *buffer = calloc(1, IUSB_BUFFER_SIZE);
	struct iusb_free_device_info *free_info;
	int result = -1;
	if (buffer == NULL)
		return -1;
	free_info = (struct iusb_free_device_info *)buffer;
	free_info->device_type = type;
	free_info->lock_type = IUSB_LOCK_EXCLUSIVE;
	if (ioctl(state.usb_fd, USB_GET_INTERFACES, buffer) < 0 || free_info->list.count == 0) {
		errno = EBUSY;
		goto out;
	}
	memset(reservation, 0, sizeof(*reservation));
	memcpy(&reservation->device, &free_info->list.devices[0], sizeof(reservation->device));
	if (ioctl(state.usb_fd, USB_REQ_INTERFACE, reservation) < 0)
		goto out;
	result = 0;
out:
	free(buffer);
	return result;
}

static int read_process_identity(pid_t pid, unsigned long long *start_time, char *process_state)
{
	char path[64];
	char buffer[1024];
	char *position;
	char *token;
	char *saveptr = NULL;
	ssize_t length;
	int fd;
	unsigned field = 3;

	snprintf(path, sizeof(path), "/proc/%ld/stat", (long)pid);
	fd = open(path, O_RDONLY);
	if (fd < 0)
		return -1;
	length = read(fd, buffer, sizeof(buffer) - 1);
	close(fd);
	if (length <= 0) {
		errno = ESRCH;
		return -1;
	}
	buffer[length] = '\0';
	position = strrchr(buffer, ')');
	if (position == NULL || position[1] != ' ') {
		errno = EPROTO;
		return -1;
	}
	token = strtok_r(position + 2, " ", &saveptr);
	while (token != NULL) {
		if (field == 3 && process_state != NULL)
			*process_state = token[0];
		if (field == 22) {
			char *end;
			errno = 0;
			*start_time = strtoull(token, &end, 10);
			if (errno != 0 || *end != '\0') {
				errno = EPROTO;
				return -1;
			}
			return 0;
		}
		field++;
		token = strtok_r(NULL, " ", &saveptr);
	}
	errno = EPROTO;
	return -1;
}

static int verify_adviserd_executable(pid_t pid)
{
	char path[64];
	char executable[512];
	const char *name;
	ssize_t length;
	snprintf(path, sizeof(path), "/proc/%ld/exe", (long)pid);
	length = readlink(path, executable, sizeof(executable) - 1);
	if (length < 0)
		return -1;
	executable[length] = '\0';
	name = strrchr(executable, '/');
	name = name == NULL ? executable : name + 1;
	if (strcmp(name, "adviserd") != 0) {
		log_message("PID %ld executable is %s, not adviserd", (long)pid, executable);
		errno = EINVAL;
		return -1;
	}
	return 0;
}

static int process_is_original(pid_t pid, unsigned long long expected_start_time)
{
	unsigned long long current_start_time;
	char process_state = '\0';
	if (read_process_identity(pid, &current_start_time, &process_state) < 0)
		return 0;
	return current_start_time == expected_start_time && process_state != 'Z';
}

static int wait_for_process_exit(pid_t pid, unsigned long long start_time, unsigned timeout_ms)
{
	struct timespec pause = {.tv_sec = 0, .tv_nsec = 100000000L};
	unsigned waited = 0;
	while (waited < timeout_ms) {
		if (!process_is_original(pid, start_time))
			return 0;
		nanosleep(&pause, NULL);
		waited += 100;
	}
	errno = ETIMEDOUT;
	return -1;
}

static int stop_adviserd(pid_t pid, unsigned long long start_time)
{
	if (!process_is_original(pid, start_time)) {
		errno = ESRCH;
		return -1;
	}
	log_message("sending SIGTERM to adviserd PID %ld", (long)pid);
	if (kill(pid, SIGTERM) < 0)
		return -1;
	if (wait_for_process_exit(pid, start_time, ADVISERD_TERM_WAIT_MS) == 0)
		return 0;
	if (!process_is_original(pid, start_time))
		return 0;
	log_message("adviserd PID %ld did not exit after %u ms; sending SIGKILL",
		(long)pid, ADVISERD_TERM_WAIT_MS);
	if (kill(pid, SIGKILL) < 0)
		return -1;
	return wait_for_process_exit(pid, start_time, ADVISERD_KILL_WAIT_MS);
}

static int read_exact_at(int fd, void *buffer, size_t length, off_t offset)
{
	uint8_t *bytes = buffer;
	while (length != 0) {
		ssize_t count = pread(fd, bytes, length, offset);
		if (count < 0) {
			if (errno == EINTR)
				continue;
			return -1;
		}
		if (count == 0) {
			errno = EIO;
			return -1;
		}
		bytes += count;
		offset += count;
		length -= (size_t)count;
	}
	return 0;
}

static int validate_adopted_interface(const struct iusb_request_release *record,
	uint8_t expected_type, const char *name)
{
	const struct iusb_device_info *device = &record->device;
	if (device->device_type != expected_type || device->lock_type != IUSB_LOCK_EXCLUSIVE ||
	    device->device_no > 15 || device->interface_no > 7 || device->instance > 7 ||
	    record->key == 0) {
		log_message("invalid adopted %s record: type=0x%02x dev=%u if=%u lock=%u instance=%u key=0x%08lx",
			name, device->device_type, device->device_no, device->interface_no,
			device->lock_type, device->instance, (unsigned long)record->key);
		errno = EPROTO;
		return -1;
	}
	return 0;
}

static int validate_adopted_pair(const struct iusb_request_release *mouse,
	const struct iusb_request_release *keyboard)
{
	if (validate_adopted_interface(mouse, IUSB_DEVICE_MOUSE, "mouse") < 0 ||
	    validate_adopted_interface(keyboard, IUSB_DEVICE_KEYBOARD, "keyboard") < 0)
		return -1;
	if (mouse->device.device_no != keyboard->device.device_no ||
	    mouse->device.interface_no == keyboard->device.interface_no) {
		log_message("adopted keyboard and mouse device/interface pairing is inconsistent");
		errno = EPROTO;
		return -1;
	}
	return 0;
}

static void install_adopted_records(const struct iusb_request_release *mouse,
	const struct iusb_request_release *keyboard)
{
	state.mouse = *mouse;
	state.keyboard = *keyboard;
	state.mouse_reserved = true;
	state.keyboard_reserved = true;
	log_message("adopted HID keys: keyboard dev=%u if=%u key=0x%08lx; mouse dev=%u if=%u key=0x%08lx",
		state.keyboard.device.device_no, state.keyboard.device.interface_no,
		(unsigned long)state.keyboard.key, state.mouse.device.device_no,
		state.mouse.device.interface_no, (unsigned long)state.mouse.key);
}

static int configure_absolute_mouse(void)
{
	struct iusb_ioctl_data mode;
	memset(&mode, 0, sizeof(mode));
	mode.device = state.mouse.device;
	mode.key = state.mouse.key;
	return ioctl(state.usb_fd, MOUSE_REL_TO_ABS, &mode);
}

static int enable_usb_upstream(void)
{
	return ioctl(state.usb_fd, USB_ENABLE_ALL_DEVICE, NULL);
}

static int adopt_file_input(const char *path, const char *usb_device)
{
	struct iusb_request_release records[2];
	struct stat metadata;
	int fd;

	fd = open(path, O_RDONLY | O_NOFOLLOW);
	if (fd < 0)
		return -1;
	if (fstat(fd, &metadata) < 0)
		goto fail;
	if (!S_ISREG(metadata.st_mode) || metadata.st_size != (off_t)ADOPT_FILE_SIZE ||
	    (metadata.st_mode & 0777) != 0600 || metadata.st_uid != geteuid()) {
		log_message("adoption file must be an owned, mode-600 regular file of exactly %u bytes",
			(unsigned)ADOPT_FILE_SIZE);
		errno = EPERM;
		goto fail;
	}
	if (read_exact_at(fd, &records[0], sizeof(records[0]), 0) < 0 ||
	    read_exact_at(fd, &records[1], sizeof(records[1]), sizeof(records[0])) < 0)
		goto fail;
	close(fd);
	if (validate_adopted_pair(&records[0], &records[1]) < 0)
		return -1;
	state.usb_fd = open(usb_device, O_RDWR);
	if (state.usb_fd < 0)
		return -1;
	install_adopted_records(&records[0], &records[1]);
	if (enable_usb_upstream() < 0 || configure_absolute_mouse() < 0)
		return -1;
	return 0;
fail:
	close(fd);
	return -1;
}

static int adopt_adviserd_input(pid_t pid, const char *usb_device)
{
	struct iusb_request_release mouse;
	struct iusb_request_release keyboard;
	char path[64];
	unsigned long long start_time;
	unsigned long long current_start_time;
	int memory_fd = -1;
	int result = -1;

	if (verify_adviserd_executable(pid) < 0 ||
	    read_process_identity(pid, &start_time, NULL) < 0)
		return -1;
	snprintf(path, sizeof(path), "/proc/%ld/mem", (long)pid);
	memory_fd = open(path, O_RDONLY);
	if (memory_fd < 0)
		return -1;
	if (read_exact_at(memory_fd, &mouse, sizeof(mouse), ADVISERD_MOUSE_ADDRESS) < 0 ||
	    read_exact_at(memory_fd, &keyboard, sizeof(keyboard), ADVISERD_KEYBOARD_ADDRESS) < 0)
		goto out;
	if (validate_adopted_pair(&mouse, &keyboard) < 0)
		goto out;
	state.usb_fd = open(usb_device, O_RDWR);
	if (state.usb_fd < 0)
		goto out;
	if (verify_adviserd_executable(pid) < 0 ||
	    read_process_identity(pid, &current_start_time, NULL) < 0 ||
	    current_start_time != start_time) {
		errno = ESRCH;
		goto out;
	}
	if (stop_adviserd(pid, start_time) < 0)
		goto out;
	install_adopted_records(&mouse, &keyboard);
	if (enable_usb_upstream() < 0 || configure_absolute_mouse() < 0)
		goto out;
	result = 0;
out:
	if (memory_fd >= 0)
		close(memory_fd);
	if (result < 0 && state.usb_fd >= 0) {
		close(state.usb_fd);
		state.usb_fd = -1;
	}
	return result;
}

static int initialize_input(const char *device)
{
	state.usb_fd = open(device, O_RDWR);
	if (state.usb_fd < 0)
		return -1;
	if (enable_usb_upstream() < 0)
		return -1;
	if (reserve_interface(IUSB_DEVICE_KEYBOARD, &state.keyboard) < 0)
		return -1;
	state.keyboard_reserved = true;
	if (reserve_interface(IUSB_DEVICE_MOUSE, &state.mouse) < 0)
		return -1;
	state.mouse_reserved = true;
	if (configure_absolute_mouse() < 0)
		return -1;
	log_message("iUSB keyboard dev=%u if=%u key=0x%08lx; mouse dev=%u if=%u key=0x%08lx",
		state.keyboard.device.device_no, state.keyboard.device.interface_no,
		(unsigned long)state.keyboard.key, state.mouse.device.device_no,
		state.mouse.device.interface_no, (unsigned long)state.mouse.key);
	return 0;
}

static int parse_number(const char *body, const char *name, long *value)
{
	const char *position = body;
	size_t name_length = strlen(name);
	while ((position = strstr(position, name)) != NULL) {
		char *end;
		if ((position == body || position[-1] == '&') && position[name_length] == '=') {
			errno = 0;
			*value = strtol(position + name_length + 1, &end, 10);
			return errno == 0 && (end[0] == '&' || end[0] == '\0') ? 0 : -1;
		}
		position += name_length;
	}
	return -1;
}

static int handle_mouse(const char *body)
{
	long x, y, width, height, buttons, wheel;
	uint16_t scaled_x;
	uint16_t scaled_y;
	if (parse_number(body, "x", &x) < 0 || parse_number(body, "y", &y) < 0 ||
	    parse_number(body, "width", &width) < 0 || parse_number(body, "height", &height) < 0 ||
	    parse_number(body, "buttons", &buttons) < 0 || parse_number(body, "wheel", &wheel) < 0 ||
	    width < 1 || height < 1 || buttons < 0 || buttons > 7 || wheel < -127 || wheel > 127)
		return -1;
	if (x < 0) x = 0;
	if (y < 0) y = 0;
	if (x >= width) x = width - 1;
	if (y >= height) y = height - 1;
	scaled_x = width == 1 ? 0 : (uint16_t)((x * 32767L) / (width - 1));
	scaled_y = height == 1 ? 0 : (uint16_t)((y * 32767L) / (height - 1));
	pthread_mutex_lock(&state.usb_lock);
	if (send_mouse_locked((uint8_t)buttons, scaled_x, scaled_y, (int8_t)wheel) < 0) {
		pthread_mutex_unlock(&state.usb_lock);
		return -1;
	}
	pthread_mutex_unlock(&state.usb_lock);
	return 0;
}

static size_t content_length(const char *headers)
{
	const char *line = headers;
	while ((line = strchr(line, '\n')) != NULL) {
		line++;
		if (strncasecmp(line, "Content-Length:", 15) == 0) {
			char *end;
			unsigned long value = strtoul(line + 15, &end, 10);
			if (end != line + 15 && value <= HTTP_BUFFER_SIZE)
				return (size_t)value;
		}
	}
	return 0;
}

static int run_power_helper(const char *action, char *output, size_t output_size)
{
	int pipe_fds[2] = {-1, -1};
	pid_t pid;
	int status;
	size_t used = 0;
	int result = -1;
	if (state.power_helper == NULL) {
		errno = ENOSYS;
		return -1;
	}
	if (output != NULL && (output_size < 2 || pipe(pipe_fds) < 0))
		return -1;
	pthread_mutex_lock(&state.power_lock);
	pid = fork();
	if (pid == 0) {
		if (output != NULL) {
			close(pipe_fds[0]);
			if (dup2(pipe_fds[1], STDOUT_FILENO) < 0)
				_exit(126);
			close(pipe_fds[1]);
		}
		execl(state.power_helper, state.power_helper, action, (char *)NULL);
		_exit(127);
	}
	if (pid < 0)
		goto out;
	if (output != NULL) {
		ssize_t count;
		close(pipe_fds[1]);
		pipe_fds[1] = -1;
		while (used + 1 < output_size &&
		       (count = read(pipe_fds[0], output + used, output_size - used - 1)) > 0)
			used += (size_t)count;
		output[used] = '\0';
	}
	while (waitpid(pid, &status, 0) < 0) {
		if (errno != EINTR)
			goto out;
	}
	if (WIFEXITED(status) && WEXITSTATUS(status) == 0)
		result = 0;
	else
		errno = EIO;
out:
	if (pipe_fds[0] >= 0)
		close(pipe_fds[0]);
	if (pipe_fds[1] >= 0)
		close(pipe_fds[1]);
	pthread_mutex_unlock(&state.power_lock);
	return result;
}

static int refresh_power_status(bool *power_on)
{
	char status_text[16];
	bool on;
	if (run_power_helper("status", status_text, sizeof(status_text)) < 0)
		return -1;
	if (strcmp(status_text, "on\n") == 0)
		on = true;
	else if (strcmp(status_text, "off\n") == 0)
		on = false;
	else {
		errno = EPROTO;
		return -1;
	}
	pthread_mutex_lock(&state.video_lock);
	if (!state.power_known || state.power_on != on) {
		state.video_online = false;
		state.video_force_pending = false;
		state.last_video_restart = 0;
	}
	state.power_known = true;
	state.power_on = on;
	pthread_mutex_unlock(&state.video_lock);
	*power_on = on;
	return 0;
}

struct sha1_context {
	uint32_t state[5];
	uint64_t length;
	uint8_t block[64];
	size_t used;
};

struct websocket {
	int fd;
	uint64_t remaining;
	uint8_t mask[4];
	unsigned mask_offset;
	bool fragmented;
};

struct rfb_client {
	struct websocket ws;
	uint16_t width;
	uint16_t height;
	uint64_t frame_sequence;
	bool tight;
	bool desktop_size;
	bool xvp;
	uint8_t keyboard[8];
	uint8_t buttons;
};

static uint32_t rotate_left(uint32_t value, unsigned count)
{
	return (value << count) | (value >> (32U - count));
}

static void sha1_transform(struct sha1_context *context, const uint8_t block[64])
{
	uint32_t words[80];
	uint32_t a, b, c, d, e;
	unsigned i;
	for (i = 0; i < 16; ++i)
		words[i] = ((uint32_t)block[i * 4] << 24) | ((uint32_t)block[i * 4 + 1] << 16) |
			((uint32_t)block[i * 4 + 2] << 8) | block[i * 4 + 3];
	for (; i < 80; ++i)
		words[i] = rotate_left(words[i - 3] ^ words[i - 8] ^ words[i - 14] ^ words[i - 16], 1);
	a = context->state[0]; b = context->state[1]; c = context->state[2];
	d = context->state[3]; e = context->state[4];
	for (i = 0; i < 80; ++i) {
		uint32_t function;
		uint32_t constant;
		uint32_t temporary;
		if (i < 20) { function = (b & c) | ((~b) & d); constant = 0x5a827999U; }
		else if (i < 40) { function = b ^ c ^ d; constant = 0x6ed9eba1U; }
		else if (i < 60) { function = (b & c) | (b & d) | (c & d); constant = 0x8f1bbcdcU; }
		else { function = b ^ c ^ d; constant = 0xca62c1d6U; }
		temporary = rotate_left(a, 5) + function + e + constant + words[i];
		e = d; d = c; c = rotate_left(b, 30); b = a; a = temporary;
	}
	context->state[0] += a; context->state[1] += b; context->state[2] += c;
	context->state[3] += d; context->state[4] += e;
}

static void sha1_update(struct sha1_context *context, const void *input, size_t length)
{
	const uint8_t *bytes = input;
	context->length += (uint64_t)length * 8U;
	while (length != 0) {
		size_t count = sizeof(context->block) - context->used;
		if (count > length)
			count = length;
		memcpy(context->block + context->used, bytes, count);
		context->used += count;
		bytes += count;
		length -= count;
		if (context->used == sizeof(context->block)) {
			sha1_transform(context, context->block);
			context->used = 0;
		}
	}
}

static void sha1_digest(const void *input, size_t length, uint8_t digest[20])
{
	struct sha1_context context = {
		.state = {0x67452301U, 0xefcdab89U, 0x98badcfeU, 0x10325476U, 0xc3d2e1f0U}
	};
	uint64_t bit_length;
	unsigned i;
	sha1_update(&context, input, length);
	bit_length = context.length;
	context.block[context.used++] = 0x80;
	if (context.used > 56) {
		memset(context.block + context.used, 0, sizeof(context.block) - context.used);
		sha1_transform(&context, context.block);
		context.used = 0;
	}
	memset(context.block + context.used, 0, 56 - context.used);
	for (i = 0; i < 8; ++i)
		context.block[63 - i] = (uint8_t)(bit_length >> (i * 8));
	sha1_transform(&context, context.block);
	for (i = 0; i < 20; ++i)
		digest[i] = (uint8_t)(context.state[i / 4] >> (24 - (i % 4) * 8));
}

static void base64_encode(const uint8_t *input, size_t length, char *output)
{
	static const char alphabet[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	size_t i;
	size_t out = 0;
	for (i = 0; i < length; i += 3) {
		uint32_t value = (uint32_t)input[i] << 16;
		value |= i + 1 < length ? (uint32_t)input[i + 1] << 8 : 0;
		value |= i + 2 < length ? input[i + 2] : 0;
		output[out++] = alphabet[(value >> 18) & 63];
		output[out++] = alphabet[(value >> 12) & 63];
		output[out++] = i + 1 < length ? alphabet[(value >> 6) & 63] : '=';
		output[out++] = i + 2 < length ? alphabet[value & 63] : '=';
	}
	output[out] = '\0';
}

static int load_auth_file(const char *path)
{
	char line[128];
	char encoded[192];
	char *separator;
	struct stat metadata;
	FILE *file;
	if (stat(path, &metadata) < 0 || !S_ISREG(metadata.st_mode) ||
	    (metadata.st_mode & 0077) != 0)
		return -1;
	file = fopen(path, "r");
	if (file == NULL || fgets(line, sizeof(line), file) == NULL) {
		if (file != NULL) fclose(file);
		return -1;
	}
	fclose(file);
	line[strcspn(line, "\r\n")] = '\0';
	separator = strchr(line, ':');
	if (separator == NULL || separator == line || separator[1] == '\0' ||
	    strchr(separator + 1, ':') != NULL)
		return -1;
	base64_encode((const uint8_t *)line, strlen(line), encoded);
	return snprintf(state.authorization, sizeof(state.authorization), "Basic %s", encoded) <
		(int)sizeof(state.authorization) ? 0 : -1;
}

static int header_value(const char *headers, const char *name, char *value, size_t value_size)
{
	const char *line = strstr(headers, "\r\n");
	size_t name_length = strlen(name);
	if (line == NULL)
		return -1;
	line += 2;
	while (line[0] != '\r' || line[1] != '\n') {
		const char *end = strstr(line, "\r\n");
		const char *start;
		size_t length;
		if (end == NULL)
			return -1;
		if ((size_t)(end - line) > name_length && line[name_length] == ':' &&
		    strncasecmp(line, name, name_length) == 0) {
			start = line + name_length + 1;
			while (start < end && (*start == ' ' || *start == '\t'))
				start++;
			while (end > start && (end[-1] == ' ' || end[-1] == '\t'))
				end--;
			length = (size_t)(end - start);
			if (length + 1 > value_size)
				return -1;
			memcpy(value, start, length);
			value[length] = '\0';
			return 0;
		}
		line = end + 2;
	}
	return -1;
}

static bool request_authorized(const char *headers)
{
	char authorization[256];
	size_t expected_length;
	size_t actual_length;
	unsigned difference = 0;
	size_t i;
	if (state.authorization[0] == '\0')
		return true;
	if (header_value(headers, "Authorization", authorization, sizeof(authorization)) < 0)
		return false;
	expected_length = strlen(state.authorization);
	actual_length = strlen(authorization);
	if (actual_length != expected_length)
		return false;
	for (i = 0; i < expected_length; ++i)
		difference |= (unsigned)(authorization[i] ^ state.authorization[i]);
	return difference == 0;
}

static bool header_has_token(const char *value, const char *wanted)
{
	while (*value != '\0') {
		const char *end;
		while (*value == ' ' || *value == '\t' || *value == ',')
			value++;
		end = strchr(value, ',');
		if (end == NULL)
			end = value + strlen(value);
		while (end > value && (end[-1] == ' ' || end[-1] == '\t'))
			end--;
		if ((size_t)(end - value) == strlen(wanted) && strncasecmp(value, wanted, strlen(wanted)) == 0)
			return true;
		value = *end == ',' ? end + 1 : end;
	}
	return false;
}

static bool websocket_key_valid(const char *key)
{
	static const char alphabet[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
	size_t i;
	const char *last;
	if (strlen(key) != 24 || key[22] != '=' || key[23] != '=')
		return false;
	for (i = 0; i < 22; ++i)
		if (strchr(alphabet, key[i]) == NULL)
			return false;
	last = strchr(alphabet, key[21]);
	return last != NULL && ((unsigned)(last - alphabet) & 15U) == 0;
}

static int websocket_handshake(int fd, const char *headers)
{
	static const char guid[] = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
	char upgrade[64], connection[128], version[16], key[128], combined[192], accept[32];
	uint8_t digest[20];
	char response[256];
	int length;
	if (header_value(headers, "Upgrade", upgrade, sizeof(upgrade)) < 0 ||
	    header_value(headers, "Connection", connection, sizeof(connection)) < 0 ||
	    header_value(headers, "Sec-WebSocket-Version", version, sizeof(version)) < 0 ||
	    header_value(headers, "Sec-WebSocket-Key", key, sizeof(key)) < 0 ||
	    !header_has_token(upgrade, "websocket") || !header_has_token(connection, "Upgrade") ||
	    strcmp(version, "13") != 0 || !websocket_key_valid(key))
		return -1;
	length = snprintf(combined, sizeof(combined), "%s%s", key, guid);
	if (length < 0 || (size_t)length >= sizeof(combined))
		return -1;
	sha1_digest(combined, (size_t)length, digest);
	base64_encode(digest, sizeof(digest), accept);
	length = snprintf(response, sizeof(response),
		"HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\n"
		"Connection: Upgrade\r\nSec-WebSocket-Accept: %s\r\n\r\n", accept);
	return length > 0 && (size_t)length < sizeof(response) ? send_all(fd, response, (size_t)length) : -1;
}

static int websocket_send(struct websocket *ws, uint8_t opcode, const void *data, size_t length)
{
	uint8_t header[10];
	size_t header_length;
	header[0] = (uint8_t)(0x80U | opcode);
	if (length < 126) {
		header[1] = (uint8_t)length;
		header_length = 2;
	} else if (length <= UINT16_MAX) {
		header[1] = 126;
		header[2] = (uint8_t)(length >> 8);
		header[3] = (uint8_t)length;
		header_length = 4;
	} else {
		uint64_t value = length;
		unsigned i;
		header[1] = 127;
		for (i = 0; i < 8; ++i)
			header[9 - i] = (uint8_t)(value >> (i * 8));
		header_length = 10;
	}
	if (send_all(ws->fd, header, header_length) < 0)
		return -1;
	return length == 0 ? 0 : send_all(ws->fd, data, length);
}

static int websocket_recv_raw(struct websocket *ws, void *buffer, size_t length)
{
	uint8_t *bytes = buffer;
	while (length != 0) {
		ssize_t count = recv(ws->fd, bytes, length, 0);
		if (count == 0)
			return -1;
		if (count < 0) {
			if (errno == EINTR)
				continue;
			if ((errno == EAGAIN || errno == EWOULDBLOCK) && !stopping)
				continue;
			return -1;
		}
		bytes += count;
		length -= (size_t)count;
	}
	return 0;
}

static int websocket_next_data(struct websocket *ws)
{
	for (;;) {
		uint8_t header[2], extended[8], control[125];
		uint64_t length;
		uint8_t opcode;
		bool final;
		unsigned i;
		if (websocket_recv_raw(ws, header, sizeof(header)) < 0 || (header[0] & 0x70U) != 0 ||
		    (header[1] & 0x80U) == 0)
			return -1;
		final = (header[0] & 0x80U) != 0;
		opcode = header[0] & 0x0fU;
		length = header[1] & 0x7fU;
		if (length == 126) {
			if (websocket_recv_raw(ws, extended, 2) < 0)
				return -1;
			length = ((uint64_t)extended[0] << 8) | extended[1];
		} else if (length == 127) {
			if (websocket_recv_raw(ws, extended, 8) < 0 || (extended[0] & 0x80U) != 0)
				return -1;
			length = 0;
			for (i = 0; i < 8; ++i)
				length = (length << 8) | extended[i];
		}
		if (length > WS_MAX_FRAME || websocket_recv_raw(ws, ws->mask, sizeof(ws->mask)) < 0)
			return -1;
		ws->mask_offset = 0;
		if ((opcode & 8U) != 0) {
			if (!final || length > sizeof(control))
				return -1;
			if (websocket_recv_raw(ws, control, (size_t)length) < 0)
				return -1;
			for (i = 0; i < length; ++i)
				control[i] ^= ws->mask[i & 3U];
			if (opcode == 8) {
				websocket_send(ws, 8, control, (size_t)length);
				return -1;
			}
			if (opcode == 9 && websocket_send(ws, 10, control, (size_t)length) < 0)
				return -1;
			if (opcode != 9 && opcode != 10)
				return -1;
			continue;
		}
		if (opcode == 2) {
			if (ws->fragmented)
				return -1;
			ws->fragmented = !final;
		} else if (opcode == 0) {
			if (!ws->fragmented)
				return -1;
			if (final)
				ws->fragmented = false;
		} else {
			return -1;
		}
		ws->remaining = length;
		if (length != 0)
			return 0;
	}
}

static int websocket_read(struct websocket *ws, void *buffer, size_t length)
{
	uint8_t *bytes = buffer;
	while (length != 0) {
		size_t count;
		size_t i;
		if (ws->remaining == 0 && websocket_next_data(ws) < 0)
			return -1;
		count = ws->remaining < length ? (size_t)ws->remaining : length;
		if (websocket_recv_raw(ws, bytes, count) < 0)
			return -1;
		for (i = 0; i < count; ++i)
			bytes[i] ^= ws->mask[(ws->mask_offset + i) & 3U];
		ws->mask_offset = (ws->mask_offset + (unsigned)count) & 3U;
		ws->remaining -= count;
		bytes += count;
		length -= count;
	}
	return 0;
}

static uint16_t read_be16(const uint8_t *bytes)
{
	return (uint16_t)(((uint16_t)bytes[0] << 8) | bytes[1]);
}

static uint32_t read_be32(const uint8_t *bytes)
{
	return ((uint32_t)bytes[0] << 24) | ((uint32_t)bytes[1] << 16) |
		((uint32_t)bytes[2] << 8) | bytes[3];
}

static void put_be16(uint8_t *bytes, uint16_t value)
{
	bytes[0] = (uint8_t)(value >> 8);
	bytes[1] = (uint8_t)value;
}

static void put_be32(uint8_t *bytes, uint32_t value)
{
	bytes[0] = (uint8_t)(value >> 24);
	bytes[1] = (uint8_t)(value >> 16);
	bytes[2] = (uint8_t)(value >> 8);
	bytes[3] = (uint8_t)value;
}

static int rfb_send(struct rfb_client *client, const void *data, size_t length)
{
	return websocket_send(&client->ws, 2, data, length);
}

static int rfb_send_xvp(struct rfb_client *client, uint8_t operation)
{
	uint8_t message[4] = {250, 0, 1, operation};
	return rfb_send(client, message, sizeof(message));
}

static int rfb_xvp_operation(struct rfb_client *client, uint8_t operation)
{
	const char *action;
	if (!client->xvp)
		return -1;
	switch (operation) {
	case 2: action = "soft"; break;
	case 3: action = "cycle"; break;
	case 4: return rfb_send_xvp(client, 0);
	default: return -1;
	}
	if (run_power_helper(action, NULL, 0) < 0)
		return rfb_send_xvp(client, 0);
	return 0;
}

static uint8_t keysym_to_hid(uint32_t keysym, uint8_t *modifier)
{
	static const uint8_t punctuation[128] = {
		[' '] = 0x2c, ['-'] = 0x2d, ['_'] = 0x2d, ['='] = 0x2e, ['+'] = 0x2e,
		['['] = 0x2f, ['{'] = 0x2f, [']'] = 0x30, ['}'] = 0x30, ['\\'] = 0x31,
		['|'] = 0x31, [';'] = 0x33, [':'] = 0x33, ['\''] = 0x34, ['"'] = 0x34,
		['`'] = 0x35, ['~'] = 0x35, [','] = 0x36, ['<'] = 0x36, ['.'] = 0x37,
		['>'] = 0x37, ['/'] = 0x38, ['?'] = 0x38, ['!'] = 0x1e, ['@'] = 0x1f,
		['#'] = 0x20, ['$'] = 0x21, ['%'] = 0x22, ['^'] = 0x23, ['&'] = 0x24,
		['*'] = 0x25, ['('] = 0x26, [')'] = 0x27
	};
	*modifier = 0;
	if ((keysym >= 'a' && keysym <= 'z') || (keysym >= 'A' && keysym <= 'Z'))
		return (uint8_t)(4 + ((keysym | 0x20U) - 'a'));
	if (keysym >= '1' && keysym <= '9')
		return (uint8_t)(0x1e + keysym - '1');
	if (keysym == '0')
		return 0x27;
	if (keysym < 128 && punctuation[keysym] != 0)
		return punctuation[keysym];
	switch (keysym) {
	case 0xff0d: return 0x28; case 0xff1b: return 0x29; case 0xff08: return 0x2a;
	case 0xff09: return 0x2b; case 0xffff: return 0x4c; case 0xff50: return 0x4a;
	case 0xff51: return 0x50; case 0xff52: return 0x52; case 0xff53: return 0x4f;
	case 0xff54: return 0x51; case 0xff55: return 0x4b; case 0xff56: return 0x4e;
	case 0xff57: return 0x4d; case 0xff63: return 0x49; case 0xff13: return 0x48;
	case 0xff14: return 0x47; case 0xff7f: return 0x53; case 0xffe5: return 0x39;
	case 0xffe1: *modifier = 0x02; return 0; case 0xffe2: *modifier = 0x20; return 0;
	case 0xffe3: *modifier = 0x01; return 0; case 0xffe4: *modifier = 0x10; return 0;
	case 0xffe7: *modifier = 0x08; return 0; case 0xffe8: *modifier = 0x80; return 0;
	case 0xffe9: *modifier = 0x04; return 0; case 0xffea: *modifier = 0x40; return 0;
	case 0xff8d: return 0x58; case 0xffaa: return 0x55; case 0xffab: return 0x57;
	case 0xffad: return 0x56; case 0xffaf: return 0x54; case 0xffae: return 0x63;
	case 0xffb0: return 0x62; case 0xffb1: return 0x59; case 0xffb2: return 0x5a;
	case 0xffb3: return 0x5b; case 0xffb4: return 0x5c; case 0xffb5: return 0x5d;
	case 0xffb6: return 0x5e; case 0xffb7: return 0x5f; case 0xffb8: return 0x60;
	case 0xffb9: return 0x61;
	default:
		if (keysym >= 0xffbe && keysym <= 0xffc9)
			return (uint8_t)(0x3a + keysym - 0xffbe);
		return 0;
	}
}

static void rfb_key_event(struct rfb_client *client, bool down, uint32_t keysym)
{
	uint8_t modifier;
	uint8_t usage = keysym_to_hid(keysym, &modifier);
	unsigned i;
	bool changed = false;
	if (!state.input_enabled || (usage == 0 && modifier == 0))
		return;
	if (modifier != 0) {
		uint8_t previous = client->keyboard[0];
		if (down) client->keyboard[0] |= modifier;
		else client->keyboard[0] &= (uint8_t)~modifier;
		changed = previous != client->keyboard[0];
	} else if (down) {
		for (i = 2; i < 8; ++i) {
			if (client->keyboard[i] == usage)
				break;
			if (client->keyboard[i] == 0) {
				client->keyboard[i] = usage;
				changed = true;
				break;
			}
		}
	} else {
		for (i = 2; i < 8; ++i)
			if (client->keyboard[i] == usage) {
				client->keyboard[i] = 0;
				changed = true;
			}
	}
	if (!changed)
		return;
	pthread_mutex_lock(&state.usb_lock);
	send_keyboard_retry_locked(client->keyboard);
	pthread_mutex_unlock(&state.usb_lock);
}

static uint8_t ascii_to_hid(uint8_t character, uint8_t *modifier)
{
	static const char shifted[] = "!@#$%^&*()_+{}|:\"~<>?";
	uint8_t usage;
	if (character == '\r' || character == '\n') {
		*modifier = 0;
		return 0x28;
	}
	if (character == '\t') {
		*modifier = 0;
		return 0x2b;
	}
	usage = keysym_to_hid(character, modifier);
	if ((character >= 'A' && character <= 'Z') || strchr(shifted, character) != NULL)
		*modifier = 0x02;
	return usage;
}

static void rfb_paste_text(struct rfb_client *client, const uint8_t *text, size_t length)
{
	uint8_t released[8] = {0};
	uint8_t report[8] = {0};
	struct timespec pace = {.tv_sec = 0, .tv_nsec = 8000000L};
	size_t i;
	if (!state.input_enabled)
		return;
	pthread_mutex_lock(&state.usb_lock);
	send_keyboard_retry_locked(released);
	for (i = 0; i < length && !stopping; ++i) {
		uint8_t modifier;
		uint8_t usage;
		if (text[i] == '\r' && i + 1 < length && text[i + 1] == '\n')
			i++;
		usage = ascii_to_hid(text[i] < 128 ? text[i] : '?', &modifier);
		if (usage == 0)
			continue;
		memset(report, 0, sizeof(report));
		report[0] = modifier;
		report[2] = usage;
		if (send_keyboard_retry_locked(report) < 0 ||
		    send_keyboard_retry_locked(released) < 0)
			break;
		nanosleep(&pace, NULL);
	}
	send_keyboard_retry_locked(client->keyboard);
	pthread_mutex_unlock(&state.usb_lock);
}

static void rfb_pointer_event(struct rfb_client *client, uint8_t mask, uint16_t x, uint16_t y)
{
	uint8_t buttons = (mask & 1U) | ((mask & 4U) >> 1) | ((mask & 2U) << 1);
	int wheel = 0;
	uint16_t scaled_x, scaled_y;
	if (!state.input_enabled)
		return;
	if ((mask & 8U) != 0) wheel++;
	if ((mask & 16U) != 0) wheel--;
	if (x >= client->width) x = client->width - 1;
	if (y >= client->height) y = client->height - 1;
	scaled_x = client->width <= 1 ? 0 : (uint16_t)(((uint32_t)x * 32767U) / (client->width - 1));
	scaled_y = client->height <= 1 ? 0 : (uint16_t)(((uint32_t)y * 32767U) / (client->height - 1));
	client->buttons = buttons;
	pthread_mutex_lock(&state.usb_lock);
	send_mouse_locked(buttons, scaled_x, scaled_y, (int8_t)wheel);
	pthread_mutex_unlock(&state.usb_lock);
}

static size_t tight_length(uint8_t output[3], size_t length)
{
	output[0] = (uint8_t)(length & 0x7fU);
	if (length < 128)
		return 1;
	output[0] |= 0x80;
	output[1] = (uint8_t)((length >> 7) & 0x7fU);
	if (length < 16384)
		return 2;
	output[1] |= 0x80;
	output[2] = (uint8_t)(length >> 14);
	return 3;
}

static int rfb_framebuffer_update(struct rfb_client *client, bool force_full)
{
	struct capture_frame frame;
	uint8_t header[4 + 12 * 2 + 4];
	uint8_t compact[3];
	size_t offset = 4;
	size_t compact_size;
	bool resized;
	if (!client->tight)
		return 0;
	if (capture_for_client(&frame, client->frame_sequence, force_full) < 0) {
		static const uint8_t empty_update[4] = {0, 0, 0, 0};
		struct timespec pause = {
			.tv_sec = 0,
			.tv_nsec = errno == ENODATA ? 250000000L : 50000000L,
		};
		nanosleep(&pause, NULL);
		return rfb_send(client, empty_update, sizeof(empty_update));
	}
	if (frame.jpeg_size > 0x3fffffU) {
		free_capture_frame(&frame);
		return 0;
	}
	resized = frame.framebuffer_width != client->width || frame.framebuffer_height != client->height;
	if (resized && !client->desktop_size) {
		free_capture_frame(&frame);
		return -1;
	}
	memset(header, 0, sizeof(header));
	put_be16(header + 2, resized ? 2 : 1);
	if (resized) {
		put_be16(header + offset + 4, frame.framebuffer_width);
		put_be16(header + offset + 6, frame.framebuffer_height);
		put_be32(header + offset + 8, (uint32_t)-223);
		offset += 12;
		client->width = frame.framebuffer_width;
		client->height = frame.framebuffer_height;
	}
	put_be16(header + offset, frame.x);
	put_be16(header + offset + 2, frame.y);
	put_be16(header + offset + 4, frame.width);
	put_be16(header + offset + 6, frame.height);
	put_be32(header + offset + 8, 7);
	offset += 12;
	header[offset++] = 0x90;
	compact_size = tight_length(compact, frame.jpeg_size);
	memcpy(header + offset, compact, compact_size);
	offset += compact_size;
	if (rfb_send(client, header, offset) < 0 || rfb_send(client, frame.jpeg, frame.jpeg_size) < 0) {
		free_capture_frame(&frame);
		return -1;
	}
	client->frame_sequence = frame.sequence;
	free_capture_frame(&frame);
	return 0;
}

static int rfb_server_init(struct rfb_client *client)
{
	static const char name[] = "AMI native KVM";
	uint8_t message[24 + sizeof(name) - 1];
	uint16_t width = 1024, height = 768;
	pthread_mutex_lock(&state.video_lock);
	width = state.video_width;
	height = state.video_height;
	pthread_mutex_unlock(&state.video_lock);
	if (width == 0 || height == 0) { width = 1024; height = 768; }
	client->width = width;
	client->height = height;
	memset(message, 0, sizeof(message));
	put_be16(message, width);
	put_be16(message + 2, height);
	message[4] = 32; message[5] = 24; message[6] = 0; message[7] = 1;
	put_be16(message + 8, 255); put_be16(message + 10, 255); put_be16(message + 12, 255);
	message[14] = 16; message[15] = 8; message[16] = 0;
	put_be32(message + 20, sizeof(name) - 1);
	memcpy(message + 24, name, sizeof(name) - 1);
	return rfb_send(client, message, sizeof(message));
}

static void rfb_release_input(struct rfb_client *client)
{
	uint8_t released[8] = {0};
	if (!state.input_enabled)
		return;
	pthread_mutex_lock(&state.usb_lock);
	send_keyboard_locked(released);
	send_mouse_locked(0, state.mouse_x, state.mouse_y, 0);
	pthread_mutex_unlock(&state.usb_lock);
	memset(client->keyboard, 0, sizeof(client->keyboard));
	client->buttons = 0;
}

static int rfb_session(int fd)
{
	struct rfb_client client = {.ws = {.fd = fd}};
	uint8_t buffer[20];
	static const char version[] = "RFB 003.008\n";
	static const uint8_t security[] = {1, 1};
	static const uint8_t security_result[] = {0, 0, 0, 0};
	if (rfb_send(&client, version, sizeof(version) - 1) < 0 ||
	    websocket_read(&client.ws, buffer, 12) < 0 || memcmp(buffer, version, 12) != 0 ||
	    rfb_send(&client, security, sizeof(security)) < 0 ||
	    websocket_read(&client.ws, buffer, 1) < 0 || buffer[0] != 1 ||
	    rfb_send(&client, security_result, sizeof(security_result)) < 0 ||
	    websocket_read(&client.ws, buffer, 1) < 0 || rfb_server_init(&client) < 0)
		goto fail;
	while (!stopping && websocket_read(&client.ws, buffer, 1) == 0) {
		switch (buffer[0]) {
		case 0:
			if (websocket_read(&client.ws, buffer, 19) < 0) goto fail;
			break;
		case 2: {
			uint16_t count;
			unsigned i;
			bool supports_xvp = false;
			if (websocket_read(&client.ws, buffer, 3) < 0) goto fail;
			count = read_be16(buffer + 1);
			if (count > 4096) goto fail;
			client.tight = false;
			client.desktop_size = false;
			for (i = 0; i < count; ++i) {
				uint32_t encoding;
				if (websocket_read(&client.ws, buffer, 4) < 0) goto fail;
				encoding = read_be32(buffer);
				if (encoding == 7) client.tight = true;
				if (encoding == (uint32_t)-223) client.desktop_size = true;
				if (encoding == (uint32_t)-309) supports_xvp = true;
			}
			if (supports_xvp && state.power_helper != NULL && !client.xvp) {
				client.xvp = true;
				if (rfb_send_xvp(&client, 1) < 0) goto fail;
			}
			break;
		}
		case 3:
			if (websocket_read(&client.ws, buffer, 9) < 0 ||
			    rfb_framebuffer_update(&client, buffer[0] == 0) < 0)
				goto fail;
			break;
		case 4:
			if (websocket_read(&client.ws, buffer, 7) < 0) goto fail;
			rfb_key_event(&client, buffer[0] != 0, read_be32(buffer + 3));
			break;
		case 5:
			if (websocket_read(&client.ws, buffer, 5) < 0) goto fail;
			rfb_pointer_event(&client, buffer[0], read_be16(buffer + 1), read_be16(buffer + 3));
			break;
		case 6: {
			uint32_t length;
			uint8_t *text = NULL;
			if (websocket_read(&client.ws, buffer, 7) < 0) goto fail;
			length = read_be32(buffer + 3);
			if (length > RFB_MAX_CUT_TEXT) goto fail;
			if (length <= RFB_MAX_PASTE && length != 0) {
				text = malloc(length);
				if (text == NULL || websocket_read(&client.ws, text, length) < 0) {
					free(text);
					goto fail;
				}
				rfb_paste_text(&client, text, length);
				free(text);
			} else {
				while (length != 0) {
					size_t count = length < sizeof(buffer) ? length : sizeof(buffer);
					if (websocket_read(&client.ws, buffer, count) < 0) goto fail;
					length -= (uint32_t)count;
				}
			}
			break;
		}
		case 250:
			if (websocket_read(&client.ws, buffer, 3) < 0 || buffer[0] != 0 ||
			    buffer[1] != 1 || rfb_xvp_operation(&client, buffer[2]) < 0)
				goto fail;
			break;
		default:
			goto fail;
		}
	}
fail:
	rfb_release_input(&client);
	return -1;
}

static const char *mime_type(const char *path)
{
	const char *extension = strrchr(path, '.');
	if (extension == NULL) return "application/octet-stream";
	if (strcmp(extension, ".html") == 0) return "text/html; charset=utf-8";
	if (strcmp(extension, ".js") == 0) return "text/javascript; charset=utf-8";
	if (strcmp(extension, ".css") == 0) return "text/css; charset=utf-8";
	if (strcmp(extension, ".json") == 0) return "application/json";
	if (strcmp(extension, ".svg") == 0) return "image/svg+xml";
	if (strcmp(extension, ".png") == 0) return "image/png";
	if (strcmp(extension, ".gif") == 0) return "image/gif";
	if (strcmp(extension, ".ico") == 0) return "image/x-icon";
	if (strcmp(extension, ".woff") == 0) return "font/woff";
	if (strcmp(extension, ".woff2") == 0) return "font/woff2";
	if (strcmp(extension, ".mp3") == 0) return "audio/mpeg";
	return "application/octet-stream";
}

static int open_web_file(const char *request_path, char *clean_path, size_t clean_size)
{
	const char *relative = request_path + 7;
	const char *query = strchr(relative, '?');
	size_t length = query == NULL ? strlen(relative) : (size_t)(query - relative);
	char *component;
	char *next;
	int directory;
	int result = -1;
	if (strncmp(request_path, "/novnc/", 7) != 0 || length == 0 || length >= clean_size ||
	    memchr(relative, '%', length) != NULL || memchr(relative, '\\', length) != NULL ||
	    memchr(relative, '#', length) != NULL)
		return -1;
	memcpy(clean_path, relative, length);
	clean_path[length] = '\0';
	directory = dup(state.web_root_fd);
	if (directory < 0)
		return -1;
	component = clean_path;
	for (;;) {
		int opened;
		next = strchr(component, '/');
		if (next != NULL)
			*next = '\0';
		if (component[0] == '\0' || strcmp(component, ".") == 0 || strcmp(component, "..") == 0)
			goto out;
		opened = openat(directory, component, O_RDONLY | O_NOFOLLOW |
			(next == NULL ? 0 : O_DIRECTORY));
		if (opened < 0)
			goto out;
		close(directory);
		directory = opened;
		if (next == NULL) {
			struct stat metadata;
			if (fstat(directory, &metadata) == 0 && S_ISREG(metadata.st_mode)) {
				result = directory;
				directory = -1;
			}
			break;
		}
		*next = '/';
		component = next + 1;
	}
out:
	if (directory >= 0)
		close(directory);
	return result;
}

static void serve_web_file(int client_fd, const char *request_path)
{
	char clean_path[256];
	char header[512];
	uint8_t buffer[8192];
	struct stat metadata;
	int file_fd = open_web_file(request_path, clean_path, sizeof(clean_path));
	int length;
	if (file_fd < 0 || fstat(file_fd, &metadata) < 0 || metadata.st_size < 0) {
		if (file_fd >= 0) close(file_fd);
		send_response(client_fd, 404, "Not Found", "text/plain", "not found\n", 10);
		return;
	}
	length = snprintf(header, sizeof(header),
		"HTTP/1.1 200 OK\r\nContent-Type: %s\r\nContent-Length: %llu\r\n"
		"Cache-Control: no-cache\r\nConnection: close\r\nX-Content-Type-Options: nosniff\r\n\r\n",
		mime_type(clean_path), (unsigned long long)metadata.st_size);
	if (length > 0 && (size_t)length < sizeof(header) && send_all(client_fd, header, (size_t)length) == 0) {
		for (;;) {
			ssize_t count = read(file_fd, buffer, sizeof(buffer));
			if (count <= 0 || send_all(client_fd, buffer, (size_t)count) < 0)
				break;
		}
	}
	close(file_fd);
}

static void send_unauthorized(int fd)
{
	static const char response[] =
		"HTTP/1.1 401 Unauthorized\r\nWWW-Authenticate: Basic realm=\"Native KVM\"\r\n"
		"Content-Length: 0\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n";
	send_all(fd, response, sizeof(response) - 1);
}

static int read_post_codes(char *output, size_t output_size)
{
	int pipe_fd[2];
	pid_t child;
	ssize_t count;
	size_t used = 0;
	if (output_size == 0 || pipe(pipe_fd) < 0)
		return -1;
	child = fork();
	if (child < 0) {
		close(pipe_fd[0]);
		close(pipe_fd[1]);
		return -1;
	}
	if (child == 0) {
		dup2(pipe_fd[1], STDOUT_FILENO);
		close(pipe_fd[0]);
		close(pipe_fd[1]);
		execl("/usr/local/bin/bioscode", "bioscode", "0", (char *)NULL);
		_exit(127);
	}
	close(pipe_fd[1]);
	while (used + 1 < output_size && (count = read(pipe_fd[0], output + used, output_size - used - 1)) > 0)
		used += (size_t)count;
	close(pipe_fd[0]);
	waitpid(child, NULL, 0);
	output[used] = '\0';
	return used == 0 ? -1 : 0;
}

static void *client_thread(void *argument)
{
	int fd = (int)(intptr_t)argument;
	char request[HTTP_BUFFER_SIZE + 1];
	char method[8] = {0};
	char path[256] = {0};
	char *header_end = NULL;
	char *body;
	size_t used = 0;
	size_t body_length;
	struct timeval timeout = {.tv_sec = 5, .tv_usec = 0};

	setsockopt(fd, SOL_SOCKET, SO_RCVTIMEO, &timeout, sizeof(timeout));
	while (used < HTTP_BUFFER_SIZE) {
		ssize_t received = recv(fd, request + used, HTTP_BUFFER_SIZE - used, 0);
		if (received <= 0)
			goto done;
		used += (size_t)received;
		request[used] = '\0';
		header_end = strstr(request, "\r\n\r\n");
		if (header_end != NULL)
			break;
	}
	if (header_end == NULL || sscanf(request, "%7s %255s", method, path) != 2) {
		send_response(fd, 400, "Bad Request", "text/plain", "bad request\n", 12);
		goto done;
	}
	if (!request_authorized(request)) {
		send_unauthorized(fd);
		goto done;
	}
	body = header_end + 4;
	body_length = content_length(request);
	while ((size_t)(request + used - body) < body_length && used < HTTP_BUFFER_SIZE) {
		ssize_t received = recv(fd, request + used, HTTP_BUFFER_SIZE - used, 0);
		if (received <= 0)
			goto done;
		used += (size_t)received;
	}
	if ((size_t)(request + used - body) < body_length) {
		send_response(fd, 400, "Bad Request", "text/plain", "short body\n", 11);
		goto done;
	}
	request[used] = '\0';
	if (strcmp(method, "GET") == 0 && strcmp(path, "/") == 0) {
		if (state.web_root_fd >= 0) {
			static const char redirect[] =
				"HTTP/1.1 302 Found\r\nLocation: /novnc/vnc.html?autoconnect=1&path=/websockify&resize=scale\r\n"
				"Content-Length: 0\r\nCache-Control: no-store\r\nConnection: close\r\n\r\n";
			send_all(fd, redirect, sizeof(redirect) - 1);
		} else {
			send_response(fd, 200, "OK", "text/html; charset=utf-8", index_html, sizeof(index_html) - 1);
		}
	} else if (strcmp(method, "GET") == 0 && strcmp(path, "/websockify") == 0) {
		if (websocket_handshake(fd, request) < 0)
			send_response(fd, 400, "Bad Request", "text/plain", "invalid websocket upgrade\n", 26);
		else
			rfb_session(fd);
	} else if (strcmp(method, "GET") == 0 && state.web_root_fd >= 0 &&
		   strncmp(path, "/novnc/", 7) == 0) {
		serve_web_file(fd, path);
	} else if (strcmp(method, "GET") == 0 && strcmp(path, "/host/status") == 0) {
		bool power_on;
		if (refresh_power_status(&power_on) < 0)
			send_response(fd, 503, "Service Unavailable", "application/json",
				"{\"power\":\"unknown\"}\n", 20);
		else if (power_on)
			send_response(fd, 200, "OK", "application/json", "{\"power\":\"on\"}\n", 15);
		else
			send_response(fd, 200, "OK", "application/json", "{\"power\":\"off\"}\n", 16);
	} else if (strcmp(method, "POST") == 0 && strcmp(path, "/host/power") == 0) {
		const char *action = NULL;
		if (body_length == 2 && memcmp(body, "on", 2) == 0) action = "on";
		if (body_length == 3 && memcmp(body, "off", 3) == 0) action = "off";
		if (body_length == 5 && memcmp(body, "cycle", 5) == 0) action = "cycle";
		if (action == NULL)
			send_response(fd, 400, "Bad Request", "text/plain", "invalid power action\n", 21);
		else if (run_power_helper(action, NULL, 0) < 0)
			send_response(fd, 503, "Service Unavailable", "text/plain", "power action failed\n", 20);
		else
			send_response(fd, 204, "No Content", "text/plain", NULL, 0);
	} else if (strcmp(method, "GET") == 0 && strcmp(path, "/post-codes") == 0) {
		char post_codes[8192];
		if (read_post_codes(post_codes, sizeof(post_codes)) < 0)
			send_response(fd, 503, "Service Unavailable", "text/plain", "POST codes unavailable\n", 23);
		else
			send_response(fd, 200, "OK", "text/plain; charset=utf-8", post_codes, strlen(post_codes));
	} else if (strcmp(method, "GET") == 0 && strcmp(path, "/kvm/status") == 0) {
		serve_kvm_status(fd);
	} else if (strcmp(method, "GET") == 0 && strncmp(path, "/frame.jpg", 10) == 0) {
		struct capture_frame frame;
		if (capture_fresh_frame(&frame) < 0)
			send_response(fd, 503, "Service Unavailable", "text/plain", "capture unavailable\n", 20);
		else {
			send_response(fd, 200, "OK", "image/jpeg", frame.jpeg, frame.jpeg_size);
			free_capture_frame(&frame);
		}
	} else if (strcmp(method, "POST") == 0 && strcmp(path, "/input/keyboard") == 0) {
		if (!state.input_enabled)
			send_response(fd, 503, "Service Unavailable", "text/plain", "input disabled\n", 15);
		else if (body_length != 8)
			send_response(fd, 400, "Bad Request", "text/plain", "expected 8 bytes\n", 17);
		else {
			pthread_mutex_lock(&state.usb_lock);
			if (send_keyboard_locked((const uint8_t *)body) < 0)
				send_response(fd, 503, "Service Unavailable", "text/plain", "input failed\n", 13);
			else
				send_response(fd, 204, "No Content", "text/plain", NULL, 0);
			pthread_mutex_unlock(&state.usb_lock);
		}
	} else if (strcmp(method, "POST") == 0 && strcmp(path, "/input/mouse") == 0) {
		if (!state.input_enabled)
			send_response(fd, 503, "Service Unavailable", "text/plain", "input disabled\n", 15);
		else {
			body[body_length] = '\0';
			if (handle_mouse(body) < 0)
				send_response(fd, 400, "Bad Request", "text/plain", "invalid mouse input\n", 20);
			else
				send_response(fd, 204, "No Content", "text/plain", NULL, 0);
		}
	} else {
		send_response(fd, 404, "Not Found", "text/plain", "not found\n", 10);
	}
done:
	close(fd);
	pthread_mutex_lock(&state.clients_lock);
	state.clients--;
	pthread_cond_signal(&state.clients_done);
	pthread_mutex_unlock(&state.clients_lock);
	return NULL;
}

static void release_resources(void)
{
	struct astcap_ioctl request;
	while (state.frame_cache_head != NULL)
		evict_cached_frame_locked();
	if (state.input_enabled && state.usb_fd >= 0) {
		uint8_t released[8] = {0};
		pthread_mutex_lock(&state.usb_lock);
		if (state.keyboard_reserved)
			send_keyboard_locked(released);
		if (state.mouse_reserved)
			send_mouse_locked(0, state.mouse_x, state.mouse_y, 0);
		pthread_mutex_unlock(&state.usb_lock);
	}
	if (state.mouse_reserved) {
		if (ioctl(state.usb_fd, USB_REL_INTERFACE, &state.mouse) < 0)
			log_message("warning: failed to release mouse interface: %s", strerror(errno));
		state.mouse_reserved = false;
	}
	if (state.keyboard_reserved) {
		if (ioctl(state.usb_fd, USB_REL_INTERFACE, &state.keyboard) < 0)
			log_message("warning: failed to release keyboard interface: %s", strerror(errno));
		state.keyboard_reserved = false;
	}
	if (state.usb_fd >= 0)
		close(state.usb_fd);
	if (state.video_fd >= 0) {
		memset(&request, 0, sizeof(request));
		request.opcode = ASTCAP_IOCTL_STOP_CAPTURE;
		if (ioctl(state.video_fd, ASTCAP_IOCCMD, &request) < 0)
			log_message("warning: STOP_CAPTURE failed: %s", strerror(errno));
	}
	if (state.video_map != MAP_FAILED)
		munmap(state.video_map, ASTCAP_MAP_SIZE);
	if (state.video_fd >= 0)
		close(state.video_fd);
	if (state.web_root_fd >= 0)
		close(state.web_root_fd);
}

static void signal_handler(int signal_number)
{
	(void)signal_number;
	stopping = 1;
	if (listen_fd >= 0)
		close(listen_fd);
}

static void usage(const char *program)
{
	fprintf(stderr, "usage: %s [--bind IPv4] [--port PORT] [--web-root PATH] [--video-device PATH] "
		"[--usb-device PATH] [--jpeg-mode-path PATH] [--jpeg-quality 0..11] "
		"[--auth-file PATH] [--power-helper PATH] [--adopt-adviserd PID | --adopt-file PATH] "
		"[--no-input]\n", program);
}

int main(int argc, char **argv)
{
	const char *bind_address = "0.0.0.0";
	const char *video_device = "/dev/videocap";
	const char *usb_device = "/dev/usb";
	const char *jpeg_mode_path = "/proc/ractrends/videocap/jpeg_enable";
	const char *jpeg_quality_path = "/proc/sys/ractrends/videocap/JPEGTableSelector";
	const char *adopt_file = NULL;
	const char *web_root = NULL;
	const char *auth_file = NULL;
	const char *power_helper = NULL;
	unsigned long port = 8080;
	unsigned long adopt_pid_value = 0;
	unsigned long jpeg_quality = 7;
	bool no_input = false;
	struct sockaddr_in address;
	struct sigaction action;
	int option;
	int enabled = 1;
	static const struct option options[] = {
		{"bind", required_argument, NULL, 'b'}, {"port", required_argument, NULL, 'p'},
		{"video-device", required_argument, NULL, 'v'}, {"usb-device", required_argument, NULL, 'u'},
		{"jpeg-mode-path", required_argument, NULL, 'j'}, {"no-input", no_argument, NULL, 'n'},
		{"jpeg-quality-path", required_argument, NULL, 'q'},
		{"jpeg-quality", required_argument, NULL, 'Q'},
		{"adopt-adviserd", required_argument, NULL, 'a'},
		{"adopt-file", required_argument, NULL, 'f'},
		{"web-root", required_argument, NULL, 'w'},
		{"auth-file", required_argument, NULL, 'A'},
		{"power-helper", required_argument, NULL, 'P'},
		{"help", no_argument, NULL, 'h'}, {NULL, 0, NULL, 0}
	};

	while ((option = getopt_long(argc, argv, "b:p:v:u:j:q:Q:a:f:w:A:P:nh", options, NULL)) != -1) {
		switch (option) {
		case 'b': bind_address = optarg; break;
		case 'p': {
			char *end;
			port = strtoul(optarg, &end, 10);
			if (*end != '\0' || port == 0 || port > 65535) { usage(argv[0]); return EXIT_FAILURE; }
			break;
		}
		case 'v': video_device = optarg; break;
		case 'u': usb_device = optarg; break;
		case 'j': jpeg_mode_path = optarg; break;
		case 'q': jpeg_quality_path = optarg; break;
		case 'Q': {
			char *end;
			jpeg_quality = strtoul(optarg, &end, 10);
			if (*end != '\0' || jpeg_quality > 11) { usage(argv[0]); return EXIT_FAILURE; }
			break;
		}
		case 'a': {
			char *end;
			adopt_pid_value = strtoul(optarg, &end, 10);
			if (*end != '\0' || adopt_pid_value == 0 || adopt_pid_value > 0x7fffffffUL) {
				usage(argv[0]);
				return EXIT_FAILURE;
			}
			break;
		}
		case 'f':
			if (adopt_file != NULL) {
				usage(argv[0]);
				return EXIT_FAILURE;
			}
			adopt_file = optarg;
			break;
		case 'w': web_root = optarg; break;
		case 'A': auth_file = optarg; break;
		case 'P': power_helper = optarg; break;
		case 'n': no_input = true; break;
		case 'h': usage(argv[0]); return EXIT_SUCCESS;
		default: usage(argv[0]); return EXIT_FAILURE;
		}
	}
	if (optind != argc) { usage(argv[0]); return EXIT_FAILURE; }
	if ((no_input && (adopt_pid_value != 0 || adopt_file != NULL)) ||
	    (adopt_pid_value != 0 && adopt_file != NULL)) {
		log_message("--no-input, --adopt-adviserd, and --adopt-file are mutually exclusive input modes");
		return EXIT_FAILURE;
	}
	if (web_root != NULL) {
		char path[1024];
		int length = snprintf(path, sizeof(path), "%s/novnc", web_root);
		if (length < 0 || (size_t)length >= sizeof(path) ||
		    (state.web_root_fd = open(path, O_RDONLY | O_DIRECTORY | O_NOFOLLOW)) < 0) {
			log_message("cannot open noVNC web root %s/novnc: %s", web_root,
				length < 0 || (size_t)length >= sizeof(path) ? "path too long" : strerror(errno));
			return EXIT_FAILURE;
		}
	}
	if (auth_file != NULL && load_auth_file(auth_file) < 0) {
		log_message("cannot load root-only Basic Auth file %s", auth_file);
		return EXIT_FAILURE;
	}
	if (power_helper != NULL && access(power_helper, X_OK) < 0) {
		log_message("power helper is not executable: %s", power_helper);
		return EXIT_FAILURE;
	}
	state.power_helper = power_helper;
	if (state.power_helper != NULL) {
		bool initial_power_on;
		if (refresh_power_status(&initial_power_on) < 0)
			log_message("warning: cannot read initial host power status: %s", strerror(errno));
	}
	if (state.authorization[0] == '\0')
		log_message("SECURITY WARNING: ami-kvm-server has no authentication and accepts input from any reachable client");
	if (state.power_helper != NULL)
		log_message("SECURITY WARNING: unauthenticated clients can also control host power");
	log_message("adviserd and the vendor KVM/VNC service MUST NOT run concurrently with this server");
	if (adopt_pid_value != 0) {
		if (adopt_adviserd_input((pid_t)adopt_pid_value, usb_device) < 0) {
			log_message("cannot adopt adviserd PID %lu: %s", adopt_pid_value, strerror(errno));
			release_resources();
			return EXIT_FAILURE;
		}
		state.input_enabled = true;
	} else if (adopt_file != NULL) {
		if (adopt_file_input(adopt_file, usb_device) < 0) {
			log_message("cannot adopt HID records from %s: %s", adopt_file, strerror(errno));
			release_resources();
			return EXIT_FAILURE;
		}
		state.input_enabled = true;
	}
	if (write_unsigned_setting(jpeg_mode_path, 2) < 0) {
		log_message("cannot enable JPEG mode through %s: %s", jpeg_mode_path, strerror(errno));
		release_resources();
		return EXIT_FAILURE;
	}
	state.video_fd = open(video_device, O_RDONLY | O_SYNC);
	if (state.video_fd < 0) {
		log_message("cannot open %s: %s", video_device, strerror(errno));
		release_resources();
		return EXIT_FAILURE;
	}
	state.video_map = mmap(NULL, ASTCAP_MAP_SIZE, PROT_READ, MAP_SHARED, state.video_fd, 0);
	if (state.video_map == MAP_FAILED) {
		log_message("cannot mmap %s: %s", video_device, strerror(errno));
		release_resources();
		return EXIT_FAILURE;
	}
	state.jpeg_quality_path = jpeg_quality_path;
	state.jpeg_quality = (unsigned)jpeg_quality;
	pthread_mutex_lock(&state.video_lock);
	if ((!state.power_known || state.power_on) && start_video_capture_locked() < 0) {
		pthread_mutex_unlock(&state.video_lock);
		log_message("cannot start persistent video capture: %s", strerror(errno));
		release_resources();
		return EXIT_FAILURE;
	}
	pthread_mutex_unlock(&state.video_lock);
	if (!no_input && adopt_pid_value == 0 && adopt_file == NULL) {
		if (initialize_input(usb_device) < 0) {
			log_message("cannot reserve/configure iUSB HID interfaces: %s", strerror(errno));
			release_resources();
			return EXIT_FAILURE;
		}
		state.input_enabled = true;
	} else if (no_input) {
		log_message("input disabled: /dev/usb will not be opened");
	} else {
		log_message("input enabled with inherited iUSB reservation records");
	}

	signal(SIGPIPE, SIG_IGN);
	memset(&action, 0, sizeof(action));
	action.sa_handler = signal_handler;
	sigemptyset(&action.sa_mask);
	sigaction(SIGINT, &action, NULL);
	sigaction(SIGTERM, &action, NULL);
	listen_fd = socket(AF_INET, SOCK_STREAM, 0);
	if (listen_fd < 0 || setsockopt(listen_fd, SOL_SOCKET, SO_REUSEADDR, &enabled, sizeof(enabled)) < 0) {
		log_message("cannot create listening socket: %s", strerror(errno));
		release_resources();
		return EXIT_FAILURE;
	}
	memset(&address, 0, sizeof(address));
	address.sin_family = AF_INET;
	address.sin_port = htons((uint16_t)port);
	if (inet_pton(AF_INET, bind_address, &address.sin_addr) != 1) {
		log_message("invalid IPv4 bind address: %s", bind_address);
		close(listen_fd);
		release_resources();
		return EXIT_FAILURE;
	}
	if (bind(listen_fd, (struct sockaddr *)&address, sizeof(address)) < 0 || listen(listen_fd, 16) < 0) {
		log_message("cannot listen on %s:%lu: %s", bind_address, port, strerror(errno));
		close(listen_fd);
		release_resources();
		return EXIT_FAILURE;
	}
	log_message("listening on http://%s:%lu/", bind_address, port);
	while (!stopping) {
		int client = accept(listen_fd, NULL, NULL);
		pthread_t thread;
		if (client < 0) {
			if (errno == EINTR || stopping)
				continue;
			log_message("accept failed: %s", strerror(errno));
			break;
		}
		pthread_mutex_lock(&state.clients_lock);
		if (state.clients >= MAX_CLIENTS) {
			pthread_mutex_unlock(&state.clients_lock);
			send_response(client, 503, "Service Unavailable", "text/plain", "busy\n", 5);
			close(client);
			continue;
		}
		state.clients++;
		pthread_mutex_unlock(&state.clients_lock);
		if (pthread_create(&thread, NULL, client_thread, (void *)(intptr_t)client) != 0) {
			close(client);
			pthread_mutex_lock(&state.clients_lock);
			state.clients--;
			pthread_mutex_unlock(&state.clients_lock);
			continue;
		}
		pthread_detach(thread);
	}
	listen_fd = -1;
	pthread_mutex_lock(&state.clients_lock);
	while (state.clients != 0)
		pthread_cond_wait(&state.clients_done, &state.clients_lock);
	pthread_mutex_unlock(&state.clients_lock);
	release_resources();
	log_message("ami-kvm-server stopped cleanly");
	return EXIT_SUCCESS;
}
