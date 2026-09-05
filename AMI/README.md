# Ami Aptio BIOS patching infra (configured for Axiomtek IMB760)

Features:
- auto patch logo images
- auto patch DMI/SMBios table
- auto patch IFR sections from versioned clean inputs and patch JSON
- auto inject microcodes + FIT
- auto compile and inject custom BIOS State Lab bridge binary

## Flow

- Extract board-local IFR sources with `./01.extract-ifr.sh` when updating the
  base BIOS dump.
- Edit form patches under `boards/imb760/ifr/`.
- Run `python3 build.py` to create checkpoints for DMI, logos, IFR, microcodes,
  and the BIOS State Lab bridge under `build/<version>/`.
- Flash the final ROM from `build/<version>/`.

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
