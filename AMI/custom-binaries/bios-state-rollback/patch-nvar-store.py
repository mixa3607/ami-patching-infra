#!/usr/bin/env python3
"""Patch the flashed NVAR variable store (the authoritative source of the
live setup variables) so the reset-not-hang values are already in NVRAM on
the very first boot after flashing.

The ROM image ships with a populated NVAR store at SPI 0x1000000 (bank 0) and
0x1080000 (bank 1), plus an embedded StdDefaults variable. AMI only consults
the external-defaults / setupdata / IFR sources when a variable is *missing*,
so on a valid store none of those ever applies - patching the store is the
only way the values reach the MRC on boot.

Targets (offsets verified against the IFR var offsets; each entry patched in
both banks and in StdDefaults so a CMOS clear / F9 cannot revert it):
  SocketMemoryConfig  data[0xC8] Halt on mem Training Error  01 -> 00 (Disable)
  ServerSetup         data[0x19] FRB-2 Timer Policy          00 -> 03 (Power Cycle)
  MemBootHealthConfig data[0x01] Memory Boot Health Check    02 -> 00 (Auto)

Usage: patch-nvar-store.py IN.rom OUT.rom
"""

import sys

SMC_0xC8 = [
    0x100C0E9, 0x100C3CE, 0x100C6B3, 0x1002807,   # bank0 live + StdDefaults
    0x108AD7F, 0x108B064, 0x108B349, 0x1082807,   # bank1 live + StdDefaults
]
SERVER_0x19 = [
    0x100A454, 0x100A6C2, 0x1003D1D, 0x100EAD7, 0x100ED45, 0x10003A8,
    0x108A4E8, 0x108A756, 0x108D76D, 0x108D9DB, 0x1083D41, 0x108DDA6, 0x10803A8,
]
MBHC_0x01 = [
    0x100C8E6, 0x1002D9D,   # bank0 live + StdDefaults
    0x108B57C, 0x1082D9D,   # bank1 live + StdDefaults
]


def apply(data, offsets, old, new, label):
    n = 0
    for off in offsets:
        if data[off] != old:
            raise SystemExit('%s: offset 0x%X = 0x%02X, expected 0x%02X (layout changed?)'
                             % (label, off, data[off], old))
    for off in offsets:
        data[off] = new
        n += 1
    print('%s: %d byte(s) 0x%02X -> 0x%02X' % (label, n, old, new))
    return n


def main():
    if len(sys.argv) != 3:
        raise SystemExit('usage: patch-nvar-store.py IN.rom OUT.rom')
    src, dst = sys.argv[1], sys.argv[2]
    data = bytearray(open(src, 'rb').read())
    total = 0
    total += apply(data, SMC_0xC8, 0x01, 0x00, 'HaltOnMemTrainError')
    total += apply(data, SERVER_0x19, 0x00, 0x03, 'FRB-2 Policy')
    total += apply(data, MBHC_0x01, 0x02, 0x00, 'MemBootHealthCheck')
    open(dst, 'wb').write(data)
    print('patched %d bytes -> %s' % (total, dst))


if __name__ == '__main__':
    main()
