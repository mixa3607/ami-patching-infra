#!/usr/bin/env python3
"""Flip AMI IFR default markers in a generated setup .sct.

After the .sct is generated (uefieditor-cli sct --data), moves the
Default / MfgDefault markers so 'Restore Defaults' (F9) selects the values
patched into the external defaults and setupdata:

  SocketSetup_setup.sct
    HaltOnMemTrainError (Q 0x1186):  Disable becomes Default, Enable loses it
    MemBootHealthConfig (Q 0x1506):  Auto     becomes Default, Disable loses it
  ServerMgmtSetup_setup.sct
    FRB-2 Timer Policy  (Q 0x0006):  DefaultId 0x0/0x1 values -> 3 (Power Cycle)
  Setup_setup.sct
    Boot option filter  (Q 0x012A):  UEFI only becomes Default, UEFI+Legacy loses it

Operates on the already-unsuppressed .sct (i.e. after `uefieditor-cli sct`),
locating each OneOf by its questionid+varstoreid+varoffset signature so the
patch is robust to offset shifts from unsuppression.

Usage: patch-ifr-defaults.py SCT [SocketSetup|ServerMgmtSetup|Setup]
"""

import sys

OPTION_DEFAULT = 0x10
OPTION_DEFAULT_MFG = 0x20


def find_oneof(data, question_id, var_store, var_offset):
    """Return the OneOf opcode offset for the given question/var signature."""
    sig = bytes([question_id & 0xFF, question_id >> 8,
                 var_store & 0xFF, var_store >> 8,
                 var_offset & 0xFF, var_offset >> 8])
    pos = 0
    while True:
        pos = data.find(sig, pos)
        if pos < 0:
            return -1
        # The OneOf opcode is 6 bytes before the signature: 05 <len> <str2> <help2>
        start = pos - 6
        if start >= 0 and data[start] == 0x05:
            return start
        pos += 1


def oneof_options_end(data, start):
    """Return the byte just past the OneOf's fixed header (options follow there).
    OneOf = 05 <len> <str2> <help2> <qid> <vid> <voff> <flags2> <min> <max> <step>
    = 17 bytes when len is 0x11. If the length byte is unusual, fall back to 17."""
    length = data[start + 1]
    header = 17
    if 0x11 <= length <= 0x40:
        header = length
    return start + header


def patch_oneof_option_flags(data, question_id, var_store, var_offset, make_default, clear_default):
    """Within the OneOf, flip default flags so `make_default` is the default and
    `clear_default` is not. Both are (value, stringid) tuples, stringid optional."""
    start = find_oneof(data, question_id, var_store, var_offset)
    if start < 0:
        raise SystemExit('OneOf Q0x%X not found' % question_id)
    begin = oneof_options_end(data, start)
    made = cleared = 0
    pos = begin
    # iterate the option opcodes (0x09) following the OneOf header; skip any
    # EFI_IFR_DEFAULT (5B 06) opcodes that sit between the header and options
    while pos + 6 < len(data):
        if data[pos] == 0x09 and data[pos + 1] == 0x07:
            # 09 07 <stringid2> <flags1> <type1> <value1>
            opt_value = data[pos + 6]
            flags_off = pos + 4
            if (opt_value, ) == (make_default[0], ):
                if make_default[1] is None or data[pos + 2:pos + 4] == bytes([make_default[1] & 0xFF, make_default[1] >> 8]):
                    data[flags_off] |= OPTION_DEFAULT | OPTION_DEFAULT_MFG
                    made += 1
            if (opt_value, ) == (clear_default[0], ):
                if clear_default[1] is None or data[pos + 2:pos + 4] == bytes([clear_default[1] & 0xFF, clear_default[1] >> 8]):
                    data[flags_off] &= ~(OPTION_DEFAULT | OPTION_DEFAULT_MFG)
                    cleared += 1
            pos += data[pos + 1]
        elif data[pos] == 0x5B and data[pos + 1] == 0x06:
            pos += 6
        else:
            # stop at the first non-option opcode (End 0x29 / etc.)
            break
    return made, cleared


def patch_frb2_policy(data):
    """FRB-2 Timer Policy uses EFI_IFR_DEFAULT (5B 06) opcodes directly after its
    options. Change both DefaultId 0x0 and 0x1 values to 3 (Power Cycle)."""
    start = find_oneof(data, 0x0006, 0x0001, 0x0019)
    if start < 0:
        raise SystemExit('FRB-2 Policy OneOf not found')
    pos = oneof_options_end(data, start)
    patched = 0
    while pos + 6 < len(data):
        if data[pos] == 0x09 and data[pos + 1] == 0x07:
            pos += data[pos + 1]          # skip the option
            continue
        if data[pos] == 0x5B and data[pos + 1] == 0x06:
            data[pos + 5] = 0x03
            patched += 1
            pos += 6
            continue
        break                             # End 0x29 / anything else
    return patched


def main():
    if len(sys.argv) != 3:
        raise SystemExit('usage: patch-ifr-defaults.py SCT [SocketSetup|ServerMgmtSetup]')
    path, which = sys.argv[1], sys.argv[2]
    data = bytearray(open(path, 'rb').read())

    if which == 'SocketSetup':
        # Halt on mem Training Error: Q0x1186, varstore 0x4, offset 0xC8
        m, c = patch_oneof_option_flags(data, 0x1186, 0x0004, 0x00C8,
                                        make_default=(0, 0x0116), clear_default=(1, 0x0845))
        print('HaltOnMemTrainError: made-default=%d cleared-default=%d' % (m, c))
        # Memory Boot Health Check: Q0x1506, varstore 0x7, offset 0x1
        m2, c2 = patch_oneof_option_flags(data, 0x1506, 0x0007, 0x0001,
                                          make_default=(0, 0x0844), clear_default=(2, 0x0116))
        print('MemBootHealthCheck:  made-default=%d cleared-default=%d' % (m2, c2))
        if not (m and c and m2 and c2):
            raise SystemExit('SocketSetup patch incomplete')
    elif which == 'ServerMgmtSetup':
        n = patch_frb2_policy(data)
        print('FRB-2 Policy defaults set to Power Cycle: %d opcode(s)' % n)
        if n < 2:
            raise SystemExit('ServerMgmtSetup patch incomplete')
    elif which == 'Setup':
        # Boot option filter: Q0x12A, varstore 0x1, offset 0xEF
        m, c = patch_oneof_option_flags(data, 0x012A, 0x0001, 0x00EF,
                                        make_default=(2, 0x038B), clear_default=(0, 0x0389))
        print('Boot option filter: made-default=%d cleared-default=%d' % (m, c))
        if not (m and c):
            raise SystemExit('Setup patch incomplete')
    else:
        raise SystemExit('unknown target %s' % which)

    open(path, 'wb').write(data)


if __name__ == '__main__':
    main()
