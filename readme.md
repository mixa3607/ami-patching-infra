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

## IMB760
### Known issue
- Пункты в сервер менеджмент открыть можно через снятие флагов + изменение доступа до 0x05 но
  - Пункты без имён
  - Они не работают, а часть приводит к залипанию биоса
- Пункты в `Advanced` можно открыть можно через снятие флагов + изменение доступа до 0x05 но
  - Пункты без имён, ориентировка на [menu table](./IFR/Setup/data.md)

### Статус по меню
- ✅ - работает как задумано
- ❌ - не работает
- ❓ - есть вопросы

` `

- Socket Configuration
  - Unicore Configuration
    - Unicore General Configuration
      - ✅ Unicore status
      - ✅ Link Frequency Select
  - Memory Configuration
    - ✅ Memory Frequency | но не оверклок частоты (оно и понятно)
    - ✅ Memory Topology

