# Memory OC auto-recovery — записки по граблям

Всё, что выяснено по ходу мода Axiomtek IMB760 (AMI Aptio V / Whitley / Ice Lake-SP)
для задачи «при неудачном оверклоке памяти плата сама откатывается».

## Цель

- Оверклок памяти → MRC не может обучить → плата висела **до картинки** (мёртвый halt).
- Хотим: плата сама ресетится, а после N неудачных бутов откатывает переменные
  к последнему удачному состоянию.
- Обязательно: откат к **предыдущему успешному состоянию переменных**, не к дефолтам.

## ГЛАВНЫЙ ГРАБЛИ №1 — дефолты не применяются на валидном varstore

**Симптом:** меняли setupdata (AMITSESetupData), файл «external defaults» (AF516361),
IFR-флаги — после прошивки, F9 и CMOS clear значение не менялось.

**Причина (найдено субагентом):** прошиваемый ROM — это **полный дамп флешки**,
в котором уже лежит **заполненный NVAR varstore** (SPI `0x1000000` / `0x1080000`,
два банка FA4974FC). AMI читает живые переменные **прямо из стора**. А источники
«дефолтов» (setupdata / AF516361 / IFR) применяются **только если переменная в
сторе ОТСУТСТВУЕТ** (или битая). Стор валиден → дефолты никто не читает.

Дополнительно:
- **F9 «Restore Defaults»** читает `StdDefaults` — это **переменная внутри того же
  стора** (снапшот дефолтов). Править надо её копию в сторе.
- **CMOS clear джампером** чистит RTC/CMOS, но **не стирает SPI-varstore**.
- Проверено: живые 731 байт `SocketMemoryConfig` **байт-в-байт** = записи в сторе.
- `AMITSESetupData` (setupdata) на самом деле **вообще не содержит** данных
  `SocketMemoryConfig`/`ServerSetup` — его патч был no-op (уехал в пустоту).

**Вывод:** для изменения «дефолта»/текущего значения правь **сам NVAR store**
(оба банка + StdDefaults). Остальные источники — defense-in-depth, они сработают
только если стор когда-нибудь пересоздастся.

## Источники значений (по важности)

| Источник | GUID / расположение | Когда используется |
|---|---|---|
| **NVAR store (живые переменные)** | SPI `0x1000000`/`0x1080000`, банки FA4974FC + StdDefaults | Всегда, на каждом буте. **Это то, что реально читает MRC.** |
| NVRAM external defaults (PEI) | файл `AF516361-B4C5-436E-A7E3-A149A31B1461` в PEI-томе | Только когда переменной нет (NvramPei) |
| NVRAM external defaults (DXE) | файл `9221315B-30BB-46B5-813E-1B1BF4712BD3` (LZMA-сжат) | Только когда переменной нет (NvramDxe/Smm) |
| IFR OneOfOption Default/`5B`-флаги | в `.sct` формсетов | Только F9/AMITSE |
| setupdata (AMITSESetupData) | секция `FE612B72-…` | по факту для этих var — нет |

## Патчимые поля

| Поле | Var (GUID) | оффсет | старое | новое |
|---|---|---|---|---|
| Halt on mem Training Error | SocketMemoryConfig `98CF19ED-…` | 0xC8 | 0x01 Enable | **0x00 Disable** |
| FRB-2 Timer Policy | ServerSetup `01239999-…` | 0x19 | 0x00 Do Nothing | **0x03 Power Cycle** |
| Memory Boot Health Check | MemBootHealthConfig `ACD56900-…` | 0x01 | 0x02 Disable | **0x00 Auto** |
| Boot option filter | Setup `EC87D643-…` | 0xEF | 0x00 UEFI+Legacy | **0x02 UEFI only** |

## Инструменты (в `custom-binaries/bios-state-rollback/`)

- **`nvar-defaults-editor.py`** — dump/patch файла external defaults **AF516361**
  (не стор!). `patch --rom X --out Y --set NAME:OFF=BYTE,…`.
  Осторожно: имя `Setup` в нём неоднозначно (2 записи) — для него `patch` падает.
- **`patch-nvar-store.py`** — патчит **NVAR store** (оба банка + StdDefaults) —
  ГЛАВНЫЙ механизм. Все оффсеты проверены, чексуммы не трогает (в сторе
  «data checksum» = фиксированный `0xAA`, не реальный CRC).
- **`patch-ifr-defaults.py`** — правит IFR-флаги Default/MfgDefault в `.sct`
  (после unsuppression). Таргеты: SocketSetup, ServerMgmtSetup, Setup.
  Находит OneOf по сигнатуре (questionid+varstore+varoffset), устойчив к сдвигам.
- **`genfw_fixup.py`** — уплощает lld-link IA32 PEI-образ в raw==virtual (нужно
  для UEFIReplace — см. грабли №2).
- **`BiosStateRollbackPei.c` / `BiosStateRollbackDxe.c`** — rollback-модули.

## ГРАБЛИ №2 — UEFIReplace не может ребейзнуть обычный lld-link PEI-образ

`UEFIReplace 0.28.0` (old_engine) при замене PE32-секции делает **rebase**: читает
`.reloc` DataDirectory VirtualAddress **как файловое смещение** (предполагает
плоский XIP-layout raw==virtual). lld-link даёт raw≠virt → «rebase failed» или
зависание. **Решение:** `genfw_fixup.py` перекладывает секции так, что
`PointerToRawData == VirtualAddress`, RVA и SizeOfHeaders не трогает.
Проверено: после инъекции меняются только ImageBase + фиксапы на дельту.

## ГРАБЛИ №3 — выбор «жертвенного» модуля в FV

Замена PE32 у модуля **в середине тома** заставляет UEFIReplace пересобрать том и
**переребейзнуть все модули после него** (сдвиг +rebаse) — лишний риск.
Выбирай модуль **в конце тома** (рост уходит в свободное место, ничего не
сдвигается). Для PEI-тома жертва: `OememPei` (последний PEIM), его depex
заменяется на ранний `{01F34D25-…}` чтобы диспатчиться до MRC.
Для DXE-тома жертва: `UsbOcUpdateDxeNeonCityEPRP` (Neon City, мёртв на IMB760).

## ГРАБЛИ №4 — диспатч pre-memory модуля

PEI-диспетчер сканирует FV по порядку; модули с неудовлетворённым depex ждут.
MRC (`UncoreInitPeim`, позиция 13) ждёт `EFI_PEI_READ_ONLY_VARIABLE2_PPI`
(его ставит `NvramPei`). Модуль с **ранним depex** (один PPI `{01F34D25-…}`)
диспатчится на 1-м проходе, notify на ReadOnlyVar2 срабатывает сразу, а MRC —
только на 2-м проходе. Так pre-memory код успевает до MRC даже с поздней позиции.

## Сборка и прошивка

```sh
cd AMI
./build-ver.sh                # полный образ (дефолты+стор+bridge+rollback)
WITHOUT_ROLLBACK=1 ./build-ver.sh   # lite: без rollback-модулей (если full висит)
# итог: build/<sha>/IMB760_BIOS_AMI_mixa3607_mod-<sha>.rom
```
Порядок в `build-ver.sh`: DMI → лого → IFR (setupdata + .sct + IFR-флаги) →
микрокоды → FIT → bridge → rollback → NVAR-стор.

## Верификация (после прошивки)

```sh
# с хоста: прочитать сериализованные setup-вары (мост пишет их в RT-переменную)
cat /sys/firmware/efi/efivars/BiosStateLabState-3f143cec-91e2-4b9a-90f3-ce93556a1d42
# распарсить: SMC[0xC8]=00, ServerSetup[0x19]=03, Setup[0xEF]=02
# НО setup-вары (NV|BS) в efivarfs не видны — только через мост/скрипт.
```
Проверь версию BIOS (`/sys/class/dmi/id/bios_version`) — там зашит SHA коммита.

## POST-коды (порт 0x80)

PEI watchdog: `0xE0` диспатч, `0xE1` var-service, `0xE2` откат.
DXE: `0xE3` запуск, `0xE4` коммит отката, `0xE5` снапшот.

## Текущее состояние

- ✅ **lite** (без rollback-модулей): грузится, дефолты + Boot Filter в сторе встали.
- ❌ **full** (с rollback-модулями): зависает в позднем DXE на POST `0xF7`.
  Причина не найдена — модули отработали (E0-E5 видны), висит уже после них.
  Следующий шаг: изолировать DXE-инъекцию (main FV), либо откат на чистом
  runtime-SetVariable вместо тени PPI.
