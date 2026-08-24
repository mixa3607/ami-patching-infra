#!/usr/bin/env python3
"""Rewrite a clang/lld-link IA32 PE/COFF image into the layout EDK2 GenFw
produces for PEI modules: every section's PointerToRawData equals its
VirtualAddress (raw == virt) and the section table / SizeOfImage are updated
accordingly.

UEFIReplace's rebase pass can only fix up images in this layout; a default
lld-link image (raw offsets packed at 0x200/0x400/..., virtual at 0x1000/
0x2000/...) makes it fail with "executable section rebase failed".

Usage: genfw_fixup.py INPUT.efi OUTPUT.efi [FIRST_RVA_HEX]
"""

import struct
import sys


def round_up(value, alignment):
    return (value + alignment - 1) & ~(alignment - 1)


def main():
    src = sys.argv[1]
    dst = sys.argv[2]
    first_rva = int(sys.argv[3], 16) if len(sys.argv) > 3 else 0x220

    data = bytearray(open(src, 'rb').read())
    e_lfanew = struct.unpack_from('<I', data, 0x3C)[0]
    pe = e_lfanew + 4
    machine = struct.unpack_from('<H', data, pe)[0]
    num_sections = struct.unpack_from('<H', data, pe + 2)[0]
    size_opt = struct.unpack_from('<H', data, pe + 16)[0]
    assert machine == 0x14C, 'IA32 PE expected'
    opt = pe + 20
    magic = struct.unpack_from('<H', data, opt)[0]
    assert magic == 0x10B, 'PE32 optional header expected'

    # Locate section table.
    section_table = pe + 20 + size_opt

    # Collect sections: (name, VirtualSize, VirtualAddress, SizeOfRawData, PointerToRawData)
    sections = []
    for i in range(num_sections):
        s = section_table + i * 40
        name = bytes(data[s:s+8]).rstrip(b'\x00')
        vsize, vaddr, rsize, rptr = struct.unpack_from('<IIII', data, s + 8)
        sections.append([name, vsize, vaddr, rsize, rptr, rptr, rsize])  # + original raw ptr/size

    # Keep the original virtual addresses and the header size (the .reloc
    # blocks reference the RVAs, so they must stay), but make
    # PointerToRawData == VirtualAddress so the raw file maps 1:1 to the
    # in-memory image (the layout UEFIReplace's rebase expects). BSS spans
    # (VirtualSize > stored raw) are materialised as zero bytes in the file.
    size_of_image = 0
    for section in sections:
        name, vsize, vaddr, rsize, rptr, old_rptr, old_rsize = section
        span = round_up(vsize, 0x20)
        section[3] = span   # SizeOfRawData
        section[4] = vaddr  # PointerToRawData == VirtualAddress
        end = vaddr + span
        if end > size_of_image:
            size_of_image = end

    size_of_headers = struct.unpack_from('<I', data, opt + 0x3C)[0]
    out = bytearray(size_of_headers)
    out[:size_of_headers] = data[:size_of_headers]

    for name, vsize, vaddr, rsize, rptr, old_rptr, old_rsize in sections:
        old_data = bytes(data[old_rptr:old_rptr + old_rsize]) if old_rptr < len(data) else b''
        span = round_up(vsize, 0x20)
        content = old_data[:span]
        if len(content) < span:
            content += b'\x00' * (span - len(content))
        if vaddr + span > len(out):
            out.extend(b'\x00' * (vaddr + span - len(out)))
        out[vaddr:vaddr + span] = content

    # Update PE/COFF and optional header fields.
    struct.pack_into('<I', out, opt + 0x38, size_of_image)   # SizeOfImage
    struct.pack_into('<I', out, opt + 0x3C, size_of_headers) # SizeOfHeaders
    for i in range(num_sections):
        s = section_table + i * 40
        name, vsize, vaddr, rsize, rptr, old_rptr, old_rsize = sections[i]
        struct.pack_into('<IIII', out, s + 8, vsize, vaddr, rsize, rptr)

    open(dst, 'wb').write(out)
    print(f'genfw_fixup: {src} -> {dst} ({len(out)} bytes, first RVA 0x{sections[0][2]:x}')


if __name__ == '__main__':
    main()
