CROSS_COMPILE ?= arm-linux-gnueabi-
CC := $(CROSS_COMPILE)gcc
CFLAGS ?= -Os -std=c11 -Wall -Wextra -Werror
LDFLAGS ?= -static
FIRMWARE_ROOT ?= ../partitions/50_root

BUILD_DIR := build
PROGRAMS := ast2500-jpeg-capture iusb-hid-diag ami-kvm-server ami-power-helper native-kvm-loop
BINARIES := $(addprefix $(BUILD_DIR)/,$(PROGRAMS))

.PHONY: all clean check

all: $(BINARIES)

$(BUILD_DIR):
	mkdir -p $@

$(BUILD_DIR)/ast2500-jpeg-capture: ast2500-jpeg-capture.c ami_abi.h | $(BUILD_DIR)
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ ast2500-jpeg-capture.c

$(BUILD_DIR)/iusb-hid-diag: iusb-hid-diag.c ami_abi.h | $(BUILD_DIR)
	$(CC) $(CFLAGS) $(LDFLAGS) -o $@ iusb-hid-diag.c

$(BUILD_DIR)/ami-kvm-server: ami-kvm-server.c ami_abi.h | $(BUILD_DIR)
	$(CC) $(CFLAGS) -pthread $(LDFLAGS) -o $@ ami-kvm-server.c

$(BUILD_DIR)/native-kvm-loop: native-kvm-loop.c native-kvm-loop-start.S | $(BUILD_DIR)
	$(CC) $(CFLAGS) -ffreestanding -fno-builtin -fno-stack-protector -fno-unwind-tables \
		-fno-asynchronous-unwind-tables -nostdlib -static -s -Wl,-e,_start -o $@ \
		native-kvm-loop-start.S native-kvm-loop.c

$(BUILD_DIR)/ami-power-helper: ami-power-helper.c ami-power-helper-start.S | $(BUILD_DIR)
	$(CC) $(CFLAGS) -fno-stack-protector -fno-builtin -fPIC -c -o $(BUILD_DIR)/ami-power-helper.o ami-power-helper.c
	$(CC) -fPIC -c -o $(BUILD_DIR)/ami-power-helper-start.o ami-power-helper-start.S
	$(CROSS_COMPILE)ld -o $@ -e _start -dynamic-linker /lib/ld-linux.so.3 \
		--allow-shlib-undefined -rpath /usr/local/lib:/usr/lib:/lib \
		-L$(FIRMWARE_ROOT)/usr/local/lib \
		$(BUILD_DIR)/ami-power-helper-start.o $(BUILD_DIR)/ami-power-helper.o -l:libipmi.so.3.53.0

check: all
	file $(BINARIES)
	sh -n run-ami-kvm-with-videocap.sh
	sh -n scripts/build-bundle.sh scripts/build-cramfs.sh scripts/build-root-cramfs.sh scripts/native-kvm-root-bootstrap.sh scripts/verify-manifest.sh

clean:
	rm -rf $(BUILD_DIR)
