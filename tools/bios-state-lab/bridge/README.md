# BiosStateLabBridgeDxe

Read-only first-stage DXE bridge. At DXE dispatch it serializes the known AMI
setup variables into `BiosStateLabState-3f143cec-91e2-4b9a-90f3-ce93556a1d42`
with runtime attributes `0x7`.

The state payload is a little-endian `BSLSTATE` header followed by entries:
`EFI_GUID`, attributes, UTF-16 name byte length, payload byte length, EFI
status, UTF-16 name, payload. Failed reads are retained with their EFI status.

This milestone has no request variable and cannot modify setup state. It is
safe to use as the first flashed bridge image because its only persistent write
is its own runtime state variable.

Build with `make`. The resulting EFI image must replace the PE32 section of a
selected nonessential DXE driver; it is not a standalone UEFI Shell app.
