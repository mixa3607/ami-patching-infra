# IFR Extractor

`extract.cs` extracts the UEFI sections declared in an explicit YAML manifest.
It does not inspect UI names, scan for a BIOS image, or call another repository
script.

Run it from `AMI/`:

```sh
../SOFTWARE/ifr-extractor/extract.cs \
  --uefi-dump IMB760_BIOS.bin \
  --manifest IFR/sections.yaml \
  --output-dir IFR
```

The tool needs .NET SDK 10 or later. `#:package` directives restore
`System.CommandLine` and `YamlDotNet` automatically. By default it locates the
repository `SOFTWARE/` directory from the current directory or manifest path,
then uses `UEFITool_NE_A72_win64/uefiextract` and
`IFRExtractor-RS-structured/ifrextractor`. Override either path when needed:

```sh
../SOFTWARE/ifr-extractor/extract.cs \
  --uefi-dump IMB760_BIOS.bin \
  --manifest IFR/sections.yaml \
  --output-dir IFR \
  --uefi-extract /path/to/uefiextract \
  --ifr-extractor /path/to/ifrextractor
```

## Manifest

Each `sections` entry has these required fields:

```yaml
version: 1
sections:
  - name: Setup
    output: Setup/Setup_setup.sct
    fileGuid: 899407D7-99FE-43D8-9A21-79EC328CAC21
    sectionType: 0x10
    outputMode: section
    expectedCount: 1
    ifrJson: Setup/Setup_setup.sct.0.0.uefi.ifr.json
```

- `fileGuid` is the FFS file GUID passed to `UEFIExtract`.
- `sectionType` is the UEFI section type, for example `0x10` for PE32 and
  `0x18` for freeform subtype GUID.
- `outputMode: section` writes PE32 `header.bin + body.bin`; `body` writes only
  `body.bin`.
- `expectedCount` is currently required to be `1`. The extractor fails if
  UEFIExtract reports a different number of matching binary outputs.
- `ifrJson` is optional. When present, its value is the exact path, relative to
  `--output-dir`, that `ifrextractor <output> json` must create. A stale result
  is deleted before invocation and absence of the exact file is an error.

The tool executes headers and bodies in separate UEFIExtract calls because NE
alpha 72 does not accept the same file GUID twice in one address-targeted call.
On an external-tool failure it prints the fully quoted command and both stdout
and stderr.
