# IMB760 BIOS extraction analysis

## Scope

This is a structural analysis only. No PE/TE, DXE, PEI, SMM, ACM, or ME
executable was decompiled or modified.

Input: `../IMB760_BIOS.bin`

- Size: `0x02000000` (32 MiB)
- SHA-256: `9d4447d4cb9a095a0caa5ca7ecd14645af8936ee43a33071b7394c5f1fb9a961`
- Parser: UEFIExtract NE alpha 72 (2025-06-16), `all` mode
- Extracted tree size: approximately 316 MiB

The full parser inventory is in `IMB760_BIOS.bin.report.txt`; the 400 known
FFS GUID-to-name mappings are in `IMB760_BIOS.bin.guids.csv`.

## SPI layout

| Region | Offset | Size | Notes |
| --- | ---: | ---: | --- |
| Intel descriptor | `0x000000` | `0x001000` | Flash descriptor and access matrix |
| GbE | `0x001000` | `0x002000` | Integrated Ethernet configuration |
| Intel ME | `0x003000` | `0xFD5000` | Intel ME/IFWI 4.4.3.263 |
| PTT | `0xFD8000` | `0x018000` | Platform Trust Technology region |
| DevExp1 | `0xFF0000` | `0x010000` | Empty (`0xFF`) |
| BIOS | `0x1000000` | `0x1000000` | UEFI firmware, NVRAM, microcode and PEI |

The descriptor permits host BIOS and GbE read/write access, while ME and
descriptor regions are unavailable to the host according to its access table.
The VSCC table contains an unknown JEDEC ID `0x9D7F7A`; this is a parser
warning about the table entry, not a verified flash-chip identification.

## Intel ME and platform security

- ME firmware and FITC version: `4.4.3.263`.
- The two boot partitions contain redundant BPDT/CPD content, including ROM
  Boot Extensions, PMC, Bring Up (FTPR), OEM Key Manifest and Debug Tokens.
- FTPR manifest: Intel vendor `0x8086`, dated `2020-12-11`, version
  `4.4.3.263`, security version number 1, RSA modulus size 256 bytes.
- UEFIExtract found an Intel Startup ACM at SPI offset `0x01AC0000`, physical
  address `0xFFAC0000`; ACM SVN is 3, SE SVN is 8, date `2020-12-17`.
- The FIT table is at physical address `0xFFDD9B80`. It references the ACM and
  three microcode entries.
- The image includes a 96 KiB PTT region and both `TPMPERBIOSFLAGS` NVAR
  variables. The UEFI volume also contains TPM 2.0, TCG, storage-security and
  TPM rollback-clear modules.
- OEM Key Manifest partitions are present in both ME boot partitions.

The extractor reported that an apparent FIT candidate was not referenced by
the final VTF, then identified the real FIT above. It also found a startup
ACM without a parsed Key Manifest. These are format/parser findings, not proof
that Boot Guard, ACM validation, or measured boot is disabled.

## BIOS firmware volumes

| SPI offset | Size | Format | Role |
| ---: | ---: | --- | --- |
| `0x1000000` | `0x080000` | FFSv2 | First NVAR store, GUID `FA4974FC-...` |
| `0x1080000` | `0x080000` | FFSv2 | Second NVAR store, GUID `FA4974FC-...` |
| `0x1110000` | `0x9AF000` | FFSv3 | Main DXE/SMM volume, GUID `4F1C52D3-...` |
| `0x1B00000` | `0x100000` | FFSv2 | Intel microcode volume, GUID `39DAA42C-...` |
| `0x1C00000` | `0x400000` | FFSv2 | PEI/recovery volume, GUID `61C0F511-...` |

All five parsed FV headers have valid checksums and valid block maps. The
main FFSv3 volume contains a nested FFSv2 image that holds the bulk of the
AMI DXE and SMM modules. The two NVAR stores are populated independently and
hold equivalent classes of setup and boot state; their presence is consistent
with redundant variable storage.

## NVRAM and setup state

Both NVAR volumes include at least these relevant variables:

- `Setup`, `ServerSetup`, `IntelSetup`, `SocketIioConfig`,
  `SocketMemoryConfig`, `SocketProcessorCoreConfig`,
  `SocketCommonRcConfig`, and `SocketPowerManagementConfig`.
- `BootOrder`, `Boot0001` through populated `Boot000D` entries, console I/O
  variables, and legacy device ordering variables.
- `SecureBootSetup`, `NetworkStackVar`, `TPMPERBIOSFLAGS`,
  `AMITCGPPIVAR`, `TcgInternalSyncFlag`, and `DeploymentModeNv`.
- Memory, RAS, SMBIOS, ME and terminal-redirection configuration variables.

Their existence records capability/default state in this dump; it does not by
itself establish the currently selected policy after a system boot.

## Firmware interface and controllable setup

The main UI payload is AMI Aptio (`AMITSE`) and has external setup data:

| Component | GUID | Reported size |
| --- | --- | ---: |
| AMITSE | `B1DA0ADF-4F77-4070-A88E-BFFE1C60529A` | `0x291B9` |
| AMITSESetupData | `FE612B72-203C-47B1-8560-A66D946EB371` | `0x11FC0` |
| ServerMgmtSetup | `1B08A1DB-F91A-4FA1-A911-255C417F1CF7` | `0x1CC7A` |
| SocketSetup | `6B6FD380-2C55-42C6-98BF-CBBC5A9AA666` | `0x97B76` |
| FpgaSocketSetup | `BCEA6548-E204-4486-8F2A-36E13C7838CE` | `0x183E` |

Existing clean IFR material under `../IFR/` covers `Setup`, `Platform`,
`ServerMgmtSetup`, `SocketSetup`, and `FpgaSocketSetup`. It was kept as-is.
The IFR exposes top-level Advanced, Chipset, Security, Boot and Save & Exit
forms, TPM/security-device controls, Secure Boot setup/custom-key actions,
network boot, console redirection, watchdog policy, memory/RAS controls and
large socket/platform configuration forms. `Platform_ifr.txt` also exposes
PFR SVN fields for PCH and BMC; this establishes platform support, not the
provisioned state of an attached BMC/CPLD.

## Boot, storage, networking and BMC integration

Identified by file type/name in the parser report:

- UEFI and legacy boot: CSM, NVMe DXE/SMM/INT13, AHCI, SATA RSTe, USB, PXE,
  HTTP/HTTP Boot and a network-stack setup screen.
- Firmware updates: `ReFlash`, `ReFlashSmm`, `SmiFlash`, flash-driver SMM,
  capsule runtime and BIOS Guard services are present.
- BMC integration: AST2500 secure PEI init, BMC IPv4/IPv6 LAN configuration,
  IPMI DXE/SMM initialization, BMC event log modules, watchdog setup and
  serial redirection are present.
- Reliability/server features: WHEA/ERST, MCA/error injection, NVDIMM,
  memory health, RAS, SMBIOS/DMI editing, ACPI and large socket configuration
  support are present.

Presence of the modules does not prove that a network protocol, BMC feature,
or runtime update path is enabled in the active setup profile.

## Intel microcode

| CPU signature | Platform ID | Revision | Date | Size | FIT physical address |
| --- | ---: | ---: | --- | ---: | ---: |
| `0x000606A4` | `0x87` | `0x0B000280` | 2020-08-17 | `0x42800` | `0xFFB00090` |
| `0x000606A5` | `0x87` | `0x0C0002F0` | 2021-03-08 | `0x45400` | `0xFFB42890` |
| `0x000606A6` | `0x87` | `0x0D0002B1` | 2021-05-13 | `0x46000` | `0xFFB87C90` |

All three parsed microcode checksums are valid. Their CPUID family/model is
`06/6A`, consistent with Intel Ice Lake server generation; CPU support should
still be confirmed against the board's actual processor stepping.

## Notable SMM and security modules

The main DXE volume contains PiSmmCore and modules for variable storage,
flash, SPI, reflash, SMM lockbox, SMI variable handling, SMM communication,
CPU SMM, TPM/TCG storage security, TPM rollback clearing, HECI, BMC/IPMI,
NVMe, WHEA/ERST, RAS, error injection, BIOS Guard and platform secure
variables. This confirms a broad privileged SMM attack surface, as expected
for an AMI server firmware image. No vulnerability claim follows from module
names alone.

## Artifacts

- `IMB760_BIOS.bin` is a symlink to the unmodified source image.
- `IMB760_BIOS.bin.dump/` is the complete UEFIExtract `all` tree. Each node
  has `header.bin`, `body.bin` where applicable, and `info.txt` metadata.
- `IMB760_BIOS.bin.report.txt` is the canonical structural listing with
  offsets, sizes, CRC32 values and recognized module names.
- `IMB760_BIOS.bin.guids.csv` maps recognized firmware-file GUIDs to names.
- `IFR-INVENTORY.md` indexes all 17 IFR packages recovered by a scan of every
  PE32 and raw section in the BIOS region.

## Tool limitation

The bundled MCExtractor 1.103.0 cannot run in this non-interactive Linux
environment because its Colorama OSC title handler dereferences a null
`winterm`, even with `-skip`. UEFIExtract independently parsed all three
microcodes and their checksums, FIT locations, ACM and ME containers, so no
binary was modified to work around that host-side tool defect.
