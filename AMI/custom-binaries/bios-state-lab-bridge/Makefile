CC = clang
LD = lld-link

BUILD_DIR = build
TARGET = $(BUILD_DIR)/BiosStateLabBridge.efi
CFLAGS = -target x86_64-unknown-windows -ffreestanding -fno-builtin -fno-stack-protector -fshort-wchar -mno-red-zone -Wall -Wextra -Werror -Os
LDFLAGS = -subsystem:efi_runtime_driver -entry:BridgeEntry -nodefaultlib -safeseh:no

all: $(TARGET)

$(TARGET): $(BUILD_DIR)/BiosStateLabBridge.obj | $(BUILD_DIR)
	$(LD) $(LDFLAGS) -out:$@ $^

$(BUILD_DIR)/BiosStateLabBridge.obj: BiosStateLabBridge.c bridge.h | $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD_DIR):
	mkdir -p $@

clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean
