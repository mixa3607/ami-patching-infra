# UEFITool Old Engine CLI

`uefitool-oe-cli` is a small manifest wrapper around the replacement engine from
`UEFITool_0.28.0`. It only supports replacement. Its upstream source tree is not
modified.

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

## Replace

```bash
uefitool-oe-cli replace IMAGE MANIFEST.yaml OUTPUT_IMAGE
```

`OUTPUT_IMAGE` must not exist. All replacements are applied to one Old Engine
tree and reconstructed once; the output is created only after every replacement
succeeds. Relative `input` paths are resolved from the manifest directory.

```yaml
schema_version: 1

replacements:
  - name: Setup
    guid: 899407D7-99FE-43D8-9A21-79EC328CAC21
    subtype: pe32 image
    input: Setup/Setup_setup.sct
    mode: as_is
```

`subtype` uses the text emitted by `UEFITool_NE-cli inspect`. Supported values:

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

`mode: body` replaces only the target section body. `mode: as_is` replaces the
whole section, including its header; use it for an artifact extracted with
`UEFITool_NE-cli extract` and `outputMode: section`.

Old Engine locates a target by GUID and section subtype and replaces the first
match. It cannot consume NE semantic paths. For `freeform subtype guid`, the
GUID may match either the parent FFS file GUID or the GUID embedded in the
freeform section, matching upstream `UEFIReplace` behaviour.
