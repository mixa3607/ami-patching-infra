#!/usr/bin/env python3
import sys, struct, uuid

def calculate_checksum8(data: bytes) -> int:
    return (-sum(data)) & 0xFF

def calculate_checksum16(data: bytes) -> int:
    s = 0
    for i in range(0, len(data), 2):
        if i + 1 < len(data):
            val = data[i] | (data[i+1] << 8)
        else:
            val = data[i]
        s = (s + val) & 0xFFFF
    return (-s) & 0xFFFF

def build_section(sec_type: int, payload: bytes) -> bytes:
    # EFI_COMMON_SECTION_HEADER (3 bytes size + 1 byte type)
    sec_len = len(payload) + 4
    if sec_len > 0xFFFFFF:
        raise ValueError("Section too large")
    hdr = struct.pack("<I", (sec_len & 0xFFFFFF) | (sec_type << 24))
    return hdr + payload

def main():
    if len(sys.argv) < 3:
        print(f"Usage: {sys.argv[0]} <input.efi> <output.ffs>")
        sys.exit(1)

    efi_path = sys.argv[1]
    ffs_path = sys.argv[2]

    with open(efi_path, "rb") as f:
        pe32_data = f.read()

    # 1. PE32 Section (0x10)
    sec_pe32 = build_section(0x10, pe32_data)

    # 2. DXE Depex Section (0x13)
    # Opcode: gEfiHiiDatabaseProtocolGuid (EF9C6E3D-DC8A-41D1-B502-1109CD80B217) AND TRUE
    hii_db_guid = bytes.fromhex("3D6E9CEF8ADC41D1B5021109CD80B217") # LE
    # Depex: BEFORE / PUSH GUID / END
    # Simple always-true depex or HII DB
    # Opcode 0x02 = PUSH GUID, 0x08 = END
    depex_payload = b"\x02" + hii_db_guid + b"\x08"
    sec_depex = build_section(0x13, depex_payload)

    # 3. UI Section (0x15): "MemTimingDxe" in UTF-16LE null terminated
    ui_str = "MemTimingDxe\0".encode("utf-16le")
    sec_ui = build_section(0x15, ui_str)

    # Combine sections
    sections_data = sec_depex + sec_pe32 + sec_ui

    # Align total FFS size to 8 bytes
    total_ffs_size = 24 + len(sections_data)
    padding = (8 - (total_ffs_size % 8)) % 8
    sections_data += b"\x00" * padding
    total_ffs_size += padding

    # EFI_FFS_FILE_HEADER (24 bytes)
    # FileGuid: A81729F4-38B1-4D90-A873-18274B63ED21
    file_guid = uuid.UUID("A81729F4-38B1-4D90-A873-18274B63ED21").bytes_le
    
    file_type = 0x07 # EFI_FV_FILETYPE_DRIVER
    attributes = 0x00
    size_bytes = struct.pack("<I", total_ffs_size)[:3] # 3-byte size
    state = 0x07 # EFI_FILE_HEADER_CONSTRUCTION | EFI_FILE_HEADER_VALID | EFI_FILE_DATA_VALID

    # First calculate header checksum with Checksum.Header = 0, Checksum.File = 0
    # Checksum field is 2 bytes: (HeaderChecksum, FileChecksum)
    hdr_partial = file_guid + b"\x00\x00" + bytes([file_type, attributes]) + size_bytes + bytes([state])
    hdr_checksum = calculate_checksum8(hdr_partial)
    
    # File checksum: for non-zero attributes, calculate or 0xAA (EFI_TEST_CHECKSUM)
    file_checksum = 0xAA # EFI_TEST_CHECKSUM

    full_header = file_guid + bytes([hdr_checksum, file_checksum, file_type, attributes]) + size_bytes + bytes([state])

    ffs_data = full_header + sections_data
    with open(ffs_path, "wb") as f:
        f.write(ffs_data)

    print(f"Generated {ffs_path} (Size: {len(ffs_data)} bytes, GUID: A81729F4-38B1-4D90-A873-18274B63ED21)")

if __name__ == "__main__":
    main()
