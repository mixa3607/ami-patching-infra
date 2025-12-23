# Ami Aptio BIOS patching infra (configured for Axiomtek IMB760)

Features:
- auto patch logo images
- auto patch DMI/SMBios table
- auto pack IFR sections

## Flow
- Dump bios with programmer or other way
- Extract logo images with UEFITool [./LOGO](./LOGO)
- Extract DMI table section with UEFITool [./DMI](./DMI)
- Prepare IFR sections [./IFR](./IFR)
- Make changes with UEFI-Editor
- Run `render-ifr-state.sh` that build `data.md` file with menu state in each IFR/*/ directory
- Run `build-ver.sh` that apply all changes to source BIOS file
- Flash build-XXXXX/*.rom BIOS
