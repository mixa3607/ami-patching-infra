CC = clang
LD = lld-link

BUILD_DIR = build
TARGET = $(BUILD_DIR)/memtimings.efi

CFLAGS = -target x86_64-unknown-windows -ffreestanding -fno-stack-protector -fshort-wchar -mno-red-zone -Wall -Wextra -O2 -I.
LDFLAGS = -subsystem:efi_application -entry:UefiMain -nodefaultlib -safeseh:no

all: $(TARGET)

$(TARGET): $(BUILD_DIR)/MemTimingsApp.obj
	$(LD) $(LDFLAGS) -out:$@ $^
	@echo "Built $@"

$(BUILD_DIR)/MemTimingsApp.obj: MemTimingsApp.c MemTimingsApp.h | $(BUILD_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

$(BUILD_DIR):
	mkdir -p $@

clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean
