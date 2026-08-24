CC = clang
LD = lld-link
PY = python3

BUILD_DIR = build

DXE_TARGET = $(BUILD_DIR)/BiosStateRollbackDxe.efi
PEI_TARGET = $(BUILD_DIR)/BiosStateRollbackPei.efi
PEI_FLAT_TARGET = $(BUILD_DIR)/BiosStateRollbackPei.flat.efi

DXE_CFLAGS = -target x86_64-unknown-windows -ffreestanding -fno-builtin -fno-stack-protector -fshort-wchar -mno-red-zone -Wall -Wextra -Werror -Os -DDEBUG_POST
DXE_LDFLAGS = -subsystem:efi_runtime_driver -entry:RollbackDxeEntry -nodefaultlib -safeseh:no

# IA32 PEI module: EFIAPI is cdecl on i386 (matching the VS2015-built PEI Core),
# so the exported entry symbol is decorated with a leading underscore. After
# linking, genfw_fixup.py flattens the image to raw==virtual (the layout
# UEFIReplace's rebase requires).
PEI_CFLAGS = -target i686-pc-windows-msvc -ffreestanding -fno-builtin -fno-stack-protector -fshort-wchar -Wall -Wextra -Werror -Os -DIA32 -DDEBUG_POST
PEI_LDFLAGS = -subsystem:efi_boot_service_driver -entry:RollbackPeiEntry -nodefaultlib -safeseh:no

all: $(DXE_TARGET) $(PEI_FLAT_TARGET)

$(DXE_TARGET): $(BUILD_DIR)/BiosStateRollbackDxe.obj | $(BUILD_DIR)
	$(LD) $(DXE_LDFLAGS) -out:$@ $^

$(BUILD_DIR)/BiosStateRollbackDxe.obj: BiosStateRollbackDxe.c rollback.h | $(BUILD_DIR)
	$(CC) $(DXE_CFLAGS) -c $< -o $@

$(PEI_TARGET): $(BUILD_DIR)/BiosStateRollbackPei.obj | $(BUILD_DIR)
	$(LD) $(PEI_LDFLAGS) -out:$@ $^

$(PEI_FLAT_TARGET): $(PEI_TARGET)
	$(PY) genfw_fixup.py $< $@

$(BUILD_DIR)/BiosStateRollbackPei.obj: BiosStateRollbackPei.c rollback.h | $(BUILD_DIR)
	$(CC) $(PEI_CFLAGS) -c $< -o $@

$(BUILD_DIR):
	mkdir -p $@

clean:
	rm -rf $(BUILD_DIR)

.PHONY: all clean
