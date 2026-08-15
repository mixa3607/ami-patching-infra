#include "ami_abi.h"

#include <errno.h>
#include <fcntl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/mman.h>
#include <unistd.h>

#define DEFAULT_VIDEO_DEVICE "/dev/videocap"
#define DEFAULT_JPEG_MODE "/proc/ractrends/videocap/jpeg_enable"

static int write_all(int fd, const uint8_t *data, size_t length)
{
	while (length != 0) {
		ssize_t written = write(fd, data, length);

		if (written < 0) {
			if (errno == EINTR)
				continue;
			return -1;
		}
		data += written;
		length -= (size_t)written;
	}
	return 0;
}

static int set_jpeg_mode(const char *path)
{
	static const char mode[] = "2\n";
	int fd = open(path, O_WRONLY);

	if (fd < 0)
		return -1;
	if (write_all(fd, (const uint8_t *)mode, sizeof(mode) - 1) < 0) {
		int saved = errno;
		close(fd);
		errno = saved;
		return -1;
	}
	return close(fd);
}

int main(int argc, char **argv)
{
	const char *output = argc > 1 ? argv[1] : "capture.jpg";
	const char *video_device = argc > 2 ? argv[2] : DEFAULT_VIDEO_DEVICE;
	const char *mode_path = argc > 3 ? argv[3] : DEFAULT_JPEG_MODE;
	struct astcap_tile_info tile = {0};
	struct astcap_ioctl request = {0};
	struct astcap_video_header header;
	uint8_t *mapping = MAP_FAILED;
	const uint8_t *jpeg;
	static const uint8_t eoi[] = {0xff, 0xd9};
	size_t jpeg_size;
	int append_eoi = 0;
	int video_fd = -1;
	int output_fd = -1;
	int result = EXIT_FAILURE;

	if (argc > 4) {
		fprintf(stderr, "usage: %s [output.jpg [/dev/videocap [/proc/videocap/jpeg_enable]]]\n", argv[0]);
		return EXIT_FAILURE;
	}
	if (set_jpeg_mode(mode_path) < 0) {
		fprintf(stderr, "cannot set %s to mode 2: %s\n", mode_path, strerror(errno));
		return EXIT_FAILURE;
	}

	video_fd = open(video_device, O_RDONLY | O_SYNC);
	if (video_fd < 0) {
		fprintf(stderr, "cannot open %s: %s\n", video_device, strerror(errno));
		goto out;
	}
	mapping = mmap(NULL, ASTCAP_MAP_SIZE, PROT_READ, MAP_SHARED, video_fd, 0);
	if (mapping == MAP_FAILED) {
		fprintf(stderr, "cannot mmap %s: %s\n", video_device, strerror(errno));
		goto out;
	}

	request.opcode = ASTCAP_IOCTL_START_CAPTURE;
	if (ioctl(video_fd, ASTCAP_IOCCMD, &request) < 0) {
		fprintf(stderr, "START_CAPTURE ioctl failed: %s\n", strerror(errno));
		goto out;
	}
	if (request.error != (int32_t)ASTCAP_IOCTL_SUCCESS) {
		fprintf(stderr, "START_CAPTURE driver error 0x%08x\n", (unsigned)request.error);
		goto out;
	}

	memset(&request, 0, sizeof(request));
	request.opcode = ASTCAP_IOCTL_GET_VIDEO;
	request.ptr = &tile;
	if (ioctl(video_fd, ASTCAP_IOCCMD, &request) < 0) {
		fprintf(stderr, "GET_VIDEO failed: %s\n", strerror(errno));
		goto out;
	}
	if (request.error == (int32_t)ASTCAP_IOCTL_BLANK_SCREEN) {
		fprintf(stderr, "GET_VIDEO reports blank/no input signal\n");
		goto out;
	}
	if (request.error == (int32_t)ASTCAP_IOCTL_NO_VIDEO_CHANGE) {
		fprintf(stderr, "GET_VIDEO reports no changed frame\n");
		goto out;
	}
	if (request.error != (int32_t)ASTCAP_IOCTL_SUCCESS) {
		fprintf(stderr, "GET_VIDEO driver error 0x%08x\n", (unsigned)request.error);
		goto out;
	}

	memcpy(&header, mapping, sizeof(header));
	jpeg = mapping + ASTCAP_HEADER_SIZE;
	jpeg_size = request.size;
	if (jpeg_size == 0 || jpeg_size > ASTCAP_COMPRESS_SIZE ||
	    tile.compressed_size != jpeg_size) {
		fprintf(stderr, "invalid sizes: ioctl=%lu tile=%lu maximum=%u\n",
			(unsigned long)jpeg_size, (unsigned long)tile.compressed_size,
			ASTCAP_COMPRESS_SIZE);
		goto out;
	}
	if (jpeg_size < 4 || jpeg[0] != 0xff || jpeg[1] != 0xd8) {
		fprintf(stderr, "hardware stream lacks JPEG SOI (first bytes %02x %02x)\n",
			jpeg_size > 0 ? jpeg[0] : 0, jpeg_size > 1 ? jpeg[1] : 0);
		goto out;
	}
	if (jpeg[jpeg_size - 2] != 0xff || jpeg[jpeg_size - 1] != 0xd9) {
		size_t i;
		for (i = jpeg_size; i >= 2; --i) {
			if (jpeg[i - 2] == 0xff && jpeg[i - 1] == 0xd9) {
				jpeg_size = i;
				break;
			}
		}
		if (i < 2) {
			fprintf(stderr, "hardware stream lacks JPEG EOI; appending marker\n");
			append_eoi = 1;
		}
	}

	output_fd = open(output, O_WRONLY | O_CREAT | O_TRUNC, 0644);
	if (output_fd < 0 || write_all(output_fd, jpeg, jpeg_size) < 0) {
		fprintf(stderr, "cannot write %s: %s\n", output, strerror(errno));
		goto out;
	}
	if (append_eoi && write_all(output_fd, eoi, sizeof(eoi)) < 0) {
		fprintf(stderr, "cannot append JPEG EOI to %s: %s\n", output, strerror(errno));
		goto out;
	}
	jpeg_size += append_eoi ? 2 : 0;
	if (close(output_fd) < 0) {
		output_fd = -1;
		fprintf(stderr, "cannot close %s: %s\n", output, strerror(errno));
		goto out;
	}
	output_fd = -1;
	printf("saved %lu-byte JPEG %ux%u to %s (tile %u,%u %lux%lu, table %u, 420=%u)\n",
		(unsigned long)jpeg_size, header.source_x, header.source_y, output,
		tile.pos_x, tile.pos_y, (unsigned long)tile.width, (unsigned long)tile.height,
		header.jpeg_table_selector, header.mode_420);
	result = EXIT_SUCCESS;

out:
	if (output_fd >= 0)
		close(output_fd);
	if (mapping != MAP_FAILED)
		munmap(mapping, ASTCAP_MAP_SIZE);
	if (video_fd >= 0)
		close(video_fd);
	return result;
}
