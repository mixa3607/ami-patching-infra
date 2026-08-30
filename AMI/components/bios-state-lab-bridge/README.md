# BiosStateLabBridgeDxe

Read-only first-stage DXE bridge. At DXE dispatch it serializes the known AMI
setup variables into `BiosStateLabState-3f143cec-91e2-4b9a-90f3-ce93556a1d42`
with runtime attributes `0x7`.

The state payload is a little-endian `BSLSTATE` header followed by entries:
`EFI_GUID`, attributes, UTF-16 name byte length, payload byte length, EFI
status, UTF-16 name, payload. Failed reads are retained with their EFI status.

The bridge accepts `BiosStateLabRequest` under the same vendor GUID. A request
contains only allowlisted `(GUID, UTF-16 variable name, offset, bytes)` changes.
At DXE dispatch it reads the complete original variable, applies the range,
writes it back with its original attributes, publishes `BiosStateLabResult`,
then deletes the request. The result contains one EFI status per request entry.

Build and inject a ROM with:

```sh
../../build-bridge.sh ../../IMB760_BIOS.bin bridge.rom
```

The builder replaces the PE32 section of `AmiRedFishApi`
(`D4395796-6F4C-4C6B-B9D1-92DAA7199A84`) with the bridge. The current BMC has
no Redfish service, so this removes an unused firmware API rather than a POST
or recovery feature. It is not a standalone UEFI Shell app.
UEFIReplace warns that an unrelated non-empty pad-file changes when this FV is
rewritten; flash only using the established recovery-capable procedure.
