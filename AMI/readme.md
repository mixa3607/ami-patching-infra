# Ami Aptio BIOS patching infra (configured for Axiomtek IMB760)

Features:
- auto patch logo images
- auto patch DMI/SMBios table
- auto pack IFR sections (patched from clean data via `uefi-editor-cli`)
- auto inject microcodes + FIT

## Flow

- Dump bios with programmer or other way
- Run `./extract-ifr-sections.sh [DUMP]` that pulls all clean IFR sections
  (setup `.sct`, AMITSE, setupdata, IFR txt) out of the dump into `IFR/`
- Prepare IFR sections [./IFR](./IFR)
- Make changes with UEFI-Editor (or edit `data.json` directly)
- Run `render-ifr-state.sh` that builds `data.md` file with menu state in each IFR/*/ directory
- Run `build-ver.sh` that applies all changes to source BIOS file:
  - patches each `IFR/*/orig/*.sct` + shared setupdata/AMITSE from `data.json`
    using `SOFTWARE/uefi-editor-cli` (no browser required)
  - injects the patched sections with UEFIReplace
- Flash build/XXXXX/*.rom BIOS

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

