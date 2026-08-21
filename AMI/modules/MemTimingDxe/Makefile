CC = clang
LLD = lld-link
PYTHON = python3

CFLAGS = -target x86_64-unknown-windows \
         -ffreestanding \
         -fno-stack-protector \
         -fshort-wchar \
         -mno-red-zone \
         -Wall \
         -Wextra \
         -O2 \
         -I.

LDFLAGS = -subsystem:efi_boot_service_driver \
          -entry:MemTimingDxeEntry \
          -nodefaultlib \
          -safeseh:no

all: MemTimingDxe.ffs

MemTimingDxe.obj: MemTimingDxe.c MemTimingDxe.h UefiBase.h
	$(CC) $(CFLAGS) -c MemTimingDxe.c -o MemTimingDxe.obj

MemTimingDxe.efi: MemTimingDxe.obj
	$(LLD) $(LDFLAGS) -out:MemTimingDxe.efi MemTimingDxe.obj

MemTimingDxe.ffs: MemTimingDxe.efi pack_ffs.py
	$(PYTHON) pack_ffs.py MemTimingDxe.efi MemTimingDxe.ffs

clean:
	rm -f *.obj *.efi *.ffs *.bin

.PHONY: all clean
