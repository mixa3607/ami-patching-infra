CC = clang
LD = lld-link

CFLAGS = -target x86_64-unknown-windows -ffreestanding -fno-stack-protector -fshort-wchar -mno-red-zone -Wall -Wextra -O2 -I.
LDFLAGS = -subsystem:efi_application -entry:UefiMain -nodefaultlib -safeseh:no

TARGET = memtimings.efi

all: $(TARGET)

$(TARGET): MemTimingsApp.obj
	$(LD) $(LDFLAGS) -out:$@ $^
	@echo "Built $@"

MemTimingsApp.obj: MemTimingsApp.c MemTimingsApp.h
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -f *.obj *.efi

.PHONY: all clean
