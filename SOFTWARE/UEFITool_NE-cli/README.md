# UEFITool CLI

Small read-only CLI around the parser from `UEFITool_NE_A72_win64`.
The upstream UEFIExtract sources are used as libraries and are not modified.
Command-line parsing uses CLI11 and JSON serialization uses nlohmann/json.

## Requirements

- Linux or WSL
- CMake 3.16 or newer
- GCC or Clang with C++11 support
- zlib development package
- network access on the first configure, to download pinned CLI11 and nlohmann/json

On Debian/Ubuntu:

```bash
sudo apt update
sudo apt install build-essential cmake zlib1g-dev
```

## Build From Scratch

From the repository root:

```bash
cd SOFTWARE/UEFITool_NE-cli
./build.sh
```

The build output is:

```text
SOFTWARE/UEFITool_NE-cli/uefitool-cli
```

To use another build directory or compiler:

```bash
BUILD_DIR=/tmp/uefitool-cli-build CXX=clang++ ./build.sh
```

To select the build parallelism:

```bash
JOBS=4 ./build.sh
```

Equivalent commands without the script:

```bash
cmake -S SOFTWARE/UEFITool_NE-cli/sources \
  -B SOFTWARE/UEFITool_NE-cli/.build \
  -DCMAKE_BUILD_TYPE=Release
cmake --build SOFTWARE/UEFITool_NE-cli/.build --parallel 2
```

## Inspect

```bash
SOFTWARE/UEFITool_NE-cli/uefitool-cli inspect IMAGE
```

Pretty JSON to stdout:

```bash
SOFTWARE/UEFITool_NE-cli/uefitool-cli \
  inspect AMI/boards/imb760/base/IMB760_BIOS.bin \
  --pretty
```

Write JSON to a file:

```bash
SOFTWARE/UEFITool_NE-cli/uefitool-cli \
  inspect AMI/boards/imb760/base/IMB760_BIOS.bin \
  --pretty \
  --output /tmp/imb760.inspect.json
```

The command is read-only and never modifies the input image.

## JSON Shape

The output is a normalized tree:

```json
{
  "schema_version": 1,
  "input_size": 33554432,
  "roots": ["image:0x00000000:0x02000000"],
  "entities": {
    "volume:0x01000000:0x80000": {
      "kind": "volume",
      "subtype": "nvram",
      "name": "FA4974FC-AF1D-4E5D-BDC5-DACD6D27BAEC",
      "offset": 16777216,
      "offset_hex": "0x01000000",
      "size": 524288,
      "size_hex": "0x80000",
      "parent": "region:0x01000000:0x01000000",
      "children": []
    }
  }
}
```

Every parsed `TreeModel` node becomes an entity. `parent` and `children`
contain entity IDs rather than duplicated nested objects. Offsets are absolute
file offsets, obtained through `TreeModel::base()`.

Entity IDs have this form:

```text
<lowercase-kind>:<absolute-offset>:<size>
```

For example:

```text
volume:0x01000000:0x80000
```

## IMB760 Check

```bash
SOFTWARE/UEFITool_NE-cli/uefitool-cli \
  inspect AMI/boards/imb760/base/IMB760_BIOS.bin \
  --output /tmp/imb760.inspect.json

python3 -m json.tool /tmp/imb760.inspect.json >/dev/null
```

The parser should identify the two NVRAM volumes at:

```text
0x01000000 size 0x80000
0x01080000 size 0x80000
```

## Exit Codes

```text
0  success
1  invalid command line
2  input/output file error
3  parser error
```
