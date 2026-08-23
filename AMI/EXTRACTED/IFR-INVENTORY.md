# Complete IFR Inventory

## Method

All 398 `PE32 image section` candidates in the extracted BIOS region were
rebuilt as section header plus body and scanned with IFRExtractor-RS 1.6.0 in
verbose mode. All 60 raw sections were scanned separately. No TE image
sections were present. Raw sections contained no additional IFR packages.

Results are retained next to their exact source PE32 section as
`*.uefi.ifr.txt`. This preserves the firmware-file and section ancestry needed
for a later replacement. The scan found 17 English IFR packages, 17 formsets,
and 392 `Form` opcodes. An individual PE32 may provide several HII packages,
which is why VROC, Intel NIC, NVMe and ReFlash each have multiple entries.

The five setup forms already copied under `../IFR/` remain the convenient
patching inputs. This inventory is the exhaustive raw scan result, including
all other discovered forms.

## Discovered formsets

| Source file | IFR package(s) | Formset GUID | Title | Notes |
| --- | --- | --- | --- | --- |
| `Setup` | `0.0.en-US.uefi.ifr.txt` | `7B59104A-C00D-4158-87FF-F04D6396A915` | Setup | Main Aptio menus: Advanced, Chipset, Security, Boot, Save & Exit |
| `Platform` | `0.0.en-US.uefi.ifr.txt` | `EC87D643-EBA4-4BB5-A1E5-3F3E36B20DA9` | Platform Configuration | Platform, PFR, RAS and boot controls |
| `SocketSetup` | `0.0.en-US.uefi.ifr.txt` | `516D5A04-C0D5-4657-B908-E4FB1D935EF0` | Socket Configuration | CPU, UPI, IIO, VT-d, VMD and retimer controls |
| `FpgaSocketSetup` | `0.0.en-US.uefi.ifr.txt` | `22819110-7F6F-4852-B4BB-13A770149B0C` | FPGA Configuration | FPGA settings |
| `ServerMgmtSetup` | `0.0.en-US.uefi.ifr.txt` | `01239999-FC0E-4B6E-9E79-D54D5DB6CD20` | Server Mgmt | BMC network/users, SEL, watchdog and self-test log |
| `Ip4Dxe` | `0.0.en-US.uefi.ifr.txt` | `9B942747-154E-4D29-A436-BF7100C8B53B` | IPv4 Network Configuration | UEFI IPv4 network parameters |
| `HttpBootDxe` | `0.0.en-US.uefi.ifr.txt` | `4D20583A-7765-4E7A-8A67-DCDE74EE3EC5` | HTTP Boot Configuration | HTTP Boot parameters |
| `PciOutOfResourceSetupPage` | `0.0.en-US.uefi.ifr.txt` | `932D37B0-0D4A-11E0-81E0-0800200C9A66` | PCI Resource ERROR | Error UI only |
| `ReFlash` | `0.0.en-US.uefi.ifr.txt` | `80E1202E-2697-4264-9CC9-80762C3E5863` | Select Storage Device | Firmware-update storage selection |
| `ReFlash` | `0.1.en-US.uefi.ifr.txt` | `80E1202E-2697-4264-9CC9-80762C3E5863` | Recovery | Firmware recovery UI |
| `117828F1-DA7D-4BC1-8B58-9A954FED5121` | `0.0.en-US.uefi.ifr.txt` | `87FAC017-7B83-47B9-840B-4228A8AA3BB0` | Non-RAID | VROC error/disabled view |
| `117828F1-DA7D-4BC1-8B58-9A954FED5121` | `0.1.en-US.uefi.ifr.txt` | `87FAC017-7B83-47B9-840B-4228A8AA3BB0` | Intel(R) Virtual RAID on CPU | VROC volume and disk management |
| `217828C1-DA75-5BC1-7B58-91954FED0101` | `0.0.en-US.uefi.ifr.txt` | `E9603D31-DD7B-4BF9-A389-61D6D105691B` | NVME SSD | NVMe information |
| `217828C1-DA75-5BC1-7B58-91954FED0101` | `1.0.en-US.uefi.ifr.txt` | `475FEC41-03E7-4914-ABFC-2F5A0590F26C` | Intel PCIe NVMe SSD | Intel PCIe NVMe SSD information |
| `4953F720-006D-41F5-990D-0AC7742ABB61` | `0.0.en-US.uefi.ifr.txt` | `77F2EA2F-4312-4569-85C4-583ACD8DB7E2` | Intel PRO/1000 Network Connection | Gigabit NIC configuration |
| `5B895602-9882-4FD4-AD18-EAC968FC1664` | `0.0.en-US.uefi.ifr.txt` | `25FD9F0B-A3EF-4788-A40C-81849D178A6C` | Intel PRO/1000 Network Connection | NIC, FCoE and iSCSI configuration |
| `5B895602-9882-4FD4-AD18-EAC968FC1664` | `1.0.en-US.uefi.ifr.txt` | `25FD9F0B-A3EF-4788-A40C-81849D178A6C` | Intel PRO/1000 Network Connection | NIC firmware and port information |

## Location pattern

All results reside below:

`IMB760_BIOS.bin.dump/5 BIOS region/3 4F1C52D3-D824-4D2A-A2F0-EC40C23C5916/0 9E21FD93-9C72-4C15-8C4B-E77F1DB2D792/0 EE4E5898-3914-4259-9D6E-DC7BD79403CF/1 Volume image section/0 5C60F367-A505-419A-859E-2A4FF6CA6FE5/<source>/1 PE32 image section/`

The three GUID-named sources use their listed GUID directory instead of a
human-readable module name. `5B895602-...` is below an additional compressed
section. File paths are the authority if a GUID or UI name is ambiguous.
