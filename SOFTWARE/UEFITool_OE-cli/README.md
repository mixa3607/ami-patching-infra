# UEFITool Old Engine CLI

`uefitool-oe-cli` is a small manifest wrapper around the editing engine from
`UEFITool_0.28.0`. It replaces, deletes, and inserts firmware objects without
modifying the upstream source tree.

Use `UEFITool_NE-cli inspect` and `extract` for inspection and extraction. Use
this tool only to write a new firmware image after editing an extracted object.

## Build

Requirements: CMake 3.16+, a C++11 compiler, Qt 5 Core development files, and
network access on the first configure for pinned CLI11, nlohmann/json, and
yaml-cpp.

```bash
cd SOFTWARE/UEFITool_OE-cli
./build.sh
```

The generated executable is `SOFTWARE/UEFITool_OE-cli/uefitool-oe-cli`.

## Apply Operations

```bash
uefitool-oe-cli apply [--input-dir DIRECTORY] IMAGE MANIFEST.yaml OUTPUT_IMAGE
```

`OUTPUT_IMAGE` must not exist. All operations are applied to one Old Engine tree
and reconstructed once; the output is created only after every operation
succeeds. Relative `input` paths are resolved from the manifest directory. Pass
`--input-dir DIRECTORY` to resolve every relative `input` from a different base
directory instead; absolute input paths are unchanged.

```yaml
schema_version: 1

operations:
  - name: Setup
    action: replace
    path:
      - kind: region
        subtype: bios
      - kind: volume
        fsGuid: 5C60F367-A505-419A-859E-2A4FF6CA6FE5
      - kind: file
        guid: 899407D7-99FE-43D8-9A21-79EC328CAC21
        subtype: dxe_driver
      - kind: section
        subtype: pe32 image
    input: Setup/Setup_setup.sct
    inputMode: section
```

`path` uses the same selector structure as `UEFITool_NE-cli extract`. Each
segment must resolve to exactly one object unless it has `index`, which selects a
zero-based result from the matching objects. `subtype` uses the text emitted by
`UEFITool_NE-cli inspect`. The common section values are:

```text
compressed
guid defined
disposable
pe32 image
pic image
te image
dxe dependency
version
ui
16 bit image
volume image
freeform subtype guid
raw
pei dependency
mm dependency
```

`replace` accepts `inputMode: body`, `section`, or `file`. `body` replaces the
selected object's body. `section` replaces a section including its header and
must target a section. `file` replaces an FFS file including its header and must
target a file. Use `section` for an artifact extracted with
`UEFITool_NE-cli extract` and `outputMode: section`.

`delete` has no input fields and removes the object selected by `path`:

```yaml
  - name: Remove unused driver
    action: delete
    path:
      - kind: region
        subtype: bios
      - kind: volume
        fsGuid: 5C60F367-A505-419A-859E-2A4FF6CA6FE5
      - kind: file
        guid: 01234567-89AB-CDEF-0123-456789ABCDEF
```

`insert` accepts a complete FFS file (`inputMode: file`) into a volume, or a
complete section (`inputMode: section`) into a file or section. `position` is
`append` (default), `prepend`, `before`, or `after`. For `append` and `prepend`,
`path` identifies the destination container. For `before` and `after`, it
identifies the neighbouring object.

```yaml
  - name: Add a raw section after Setup PE32
    action: insert
    path:
      - kind: region
        subtype: bios
      - kind: volume
        fsGuid: 5C60F367-A505-419A-859E-2A4FF6CA6FE5
      - kind: file
        guid: 899407D7-99FE-43D8-9A21-79EC328CAC21
      - kind: section
        subtype: pe32 image
    input: Setup/extra.sct
    inputMode: section
    position: after
```
