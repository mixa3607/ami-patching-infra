# Memory OC auto-recovery — записки по граблям

Всё, что выяснено по ходу мода Axiomtek IMB760 (AMI Aptio V / Whitley / Ice Lake-SP)
для задачи «при неудачном оверклоке памяти плата сама откатывается».

> Этот вариант использует **затирание NVAR store** (см. раздел «Инструменты»):
> вместо правки байтов заполненного стора регион стирается (0xFF), и прошивка
> при первом старте пересобирает его из патченых external defaults (AF516361).

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
два зеркальных банка, FvLength `0x80000` каждый). AMI читает живые переменные
**прямо из стора**. А источники «дефолтов» (setupdata / AF516361 / IFR) применяются
**только если переменная в сторе ОТСУТСТВУЕТ** (или битая). Стор валиден → дефолты
никто не читает.

Дополнительно:
- **F9 «Restore Defaults»** читает `StdDefaults` — это **переменная внутри того же
  стора** (снапшот дефолтов). Править надо её копию в сторе.
- **CMOS clear джампером** чистит RTC/CMOS, но **не стирает SPI-varstore**.
- Проверено: живые 731 байт `SocketMemoryConfig` **байт-в-байт** = записи в сторе.
- `AMITSESetupData` (setupdata) на самом деле **вообще не содержит** данных
  `SocketMemoryConfig`/`ServerSetup` — его патч был no-op (уехал в пустоту).

**Вывод:** чтобы новые значения реально применились, надо либо править **сам NVAR
store**, либо **стереть его** и дать firmware пересобрать из патченого AF516361.

## Источники значений (по важности)

| Источник | GUID / расположение | Когда используется |
|---|---|---|
| **NVAR store (живые переменные)** | SPI `0x1000000`/`0x1080000`, зеркальные банки + StdDefaults | Всегда, на каждом буте. **Это то, что реально читает MRC.** |
| NVRAM external defaults (PEI) | файл `AF516361-B4C5-436E-A7E3-A149A31B1461` в PEI-томе | Только когда переменной нет (NvramPei). **Становится источником после затирания стора.** |
| IFR OneOfOption Default/`5B`-флаги | в `.sct` формсетов | Только F9/AMITSE |
| setupdata (AMITSESetupData) | секция `FE612B72-…` | по факту для этих var — нет |

DXE-файла external defaults `9221315B-…` в этом образе **нет** — источник один (AF516361).

## Патчимые поля

| Поле | Var (GUID) | оффсет | старое | новое |
|---|---|---|---|---|
| Halt on mem Training Error | SocketMemoryConfig `98CF19ED-…` | 0xC8 | 0x01 Enable | **0x00 Disable** |
| FRB-2 Timer Policy | ServerSetup `01239999-…` | 0x19 | 0x00 Do Nothing | **0x03 Power Cycle** |
| Memory Boot Health Check | MemBootHealthConfig `ACD56900-…` | 0x01 | 0x02 Disable | **0x00 Auto** |
| Boot option filter | Setup `EC87D643-…` | 0xEF | 0x00 UEFI+Legacy | **0x02 UEFI only** |

## Инструменты (в `custom-binaries/bios-state-rollback/`)

- **`nvar-store-erase.py`** — **ГЛАВНЫЙ механизм этого варианта.** Находит NVAR-банки
  структурно (скан `_FVH` + FFS2 GUID + валидная цепочка `NVAR` на `+0x90`), стирает
  весь контур (0xFF) — оба банка и FTW scratch внутри региона. Опция `--keep-headers`
  оставляет 72-байтные FV-заголовки (пустой валидный FV). Никаких хардкод-оффсетов:
  если вендор сдвинет регион, скрипт найдёт его заново.
- **`nvar-defaults-editor.py`** — dump/patch файла external defaults **AF516361**.
  `patch --rom X --out Y --set NAME:OFF=BYTE,…`. Осторожно: имя `Setup` в нём
  неоднозначно (2 записи) — для него `patch` падает.
- **`patch-ifr-defaults.py`** — правит IFR-флаги Default/MfgDefault в `.sct`
  (после unsuppression). Таргеты: SocketSetup, ServerMgmtSetup, Setup.
  Находит OneOf по сигнатуре (questionid+varstore+varoffset), устойчив к сдвигам.

## Что даёт затирание стора

- Первый старт: NvramPei не находит стор → строит его в RAM из **патченого
  AF516361** → MRC на этом же буте читает уже новые значения → стор пишется в SPI.
- `StdDefaults` в пересобранном сторе тоже из AF516361 → **F9/CMOS-clear дают
  патченые значения**.
- Побочное: переменные, которых нет в AF516361 (BootOrder/Boot####, DriverOrder,
  SMBIOS-таблицы, runtime-счётчики), пересоздаются из дефолтов на первом буте —
  порядок загрузки может сброситься. Для тестборды обычно некритично.

## Сборка и прошивка

```sh
cd AMI
./build-ver.sh     # полный образ (DMI → лого → IFR → mcodes/FIT → bridge →
                   #  AF516361 defaults → затирание NVAR store)
# итог: build/<sha>/IMB760_BIOS_AMI_mixa3607_mod-<sha>.rom
```

Порядок в `build-ver.sh`: DMI → лого → IFR (setupdata + .sct + IFR-флаги) →
микрокоды → FIT → bridge → `patch_nvar_defaults` (AF516361) → `patch_erase_nvar_store`.

## Верификация образа (до прошивки)

```sh
# 1. AF516361 внешние дефолты заплатены
python3 custom-binaries/bios-state-rollback/nvar-defaults-editor.py \
  dump --rom build/<sha>/IMB760_BIOS_AMI_mixa3607_mod-<sha>.rom --offsets 0xC8,0x19,0x01
#    SocketMemoryConfig[0xC8]=0x00, ServerSetup[0x19]=0x03, MemBootHealthConfig[0x01]=0x00

# 2. NVAR store затёрт (0xFF) — регион 0x1000000..0x1100000
python3 custom-binaries/bios-state-rollback/nvar-store-erase.py \
  build/<sha>/IMB760_BIOS_AMI_mixa3607_mod-<sha>.rom /tmp/out.rom   # должен пройти sanity

# 3. IFR default-флаги в .sct (F9) — см. лог сборки:
#    HaltOnMemTrainError made-default=1 cleared-default=1
#    MemBootHealthCheck  made-default=1 cleared-default=1
#    FRB-2 Policy defaults set to Power Cycle: 2 opcode(s)
#    Boot option filter  made-default=1 cleared-default=1
```

## Верификация (после прошивки)

```sh
# с хоста: сериализованные setup-вары мост пишет в RT-переменную
cat /sys/firmware/efi/efivars/BiosStateLabState-3f143cec-91e2-4b9a-90f3-ce93556a1d42
# распарсить: SMC[0xC8]=00, ServerSetup[0x19]=03, Setup[0xEF]=02
# НО setup-вары (NV|BS) в efivarfs не видны — только через мост/скрипт.
```
Проверь версию BIOS (`/sys/class/dmi/id/bios_version`) — там зашит SHA коммита.

## Риски затирания (надо проверить на железе)

- Поведение NvramPei/NvramSmm при полностью стёртом регионе: ожидается
  «нет переменных → пересборка из дефолтов», но конкретика зависит от платы
  (возможно сообщение «BIOS settings reset» или медленный первый буте).
- Если firmware ждёт валидный FV-заголовок стора — использовать `--keep-headers`.
- FTW-механизм может попытаться восстановить банк из парного/scratch —
  поэтому стирается весь контур обоих банков разом.

## Текущее состояние

- ✅ Сборка проходит, образ валиден (размер не меняется, sanity-check затирания проходит).
- ✅ AF516361 патчится, IFR default-флаги встают, затирание применяется.
- ⏳ На железе не прошивалось — первая прошивка только recovery-методом.
