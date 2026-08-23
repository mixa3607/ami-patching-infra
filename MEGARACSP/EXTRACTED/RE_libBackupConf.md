# libBackupConf.so.2.13.0 — восстановленный код

Декомпиляция AMI BMC `libBackupConf.so.2.13.0` (ARM32, OpenSSL 1.0.0).
Имена функций/переменных уже применены в IDA-базе (GUI-сессия).

## Формат бэкап-файла (`conf.bak`)

```
$$$Version=1$
$$$CheckSumKeyIndex=1$
[$$$/conf/ncml.conf]            <- секция: путь файла
$$$DataLength=1873$             <- длина содержимого
<содержимое файла ...>
[$$$/conf/next.conf]            <- повторяется
$$$DataLength=N$
<содержимое>
<40 hex символов SHA1>          <- в самом конце
```

Секция `localtime` особый случай: содержит **не содержимое**, а текст симлинка
(`ln -s <target> /conf/localtime` выполняется при восстановлении через `system()`).

## Схема подписи (SHA1) — суть хака

Ключ: `CheckSumKeyIndex` из заголовка выбирает секретный ключ-суффикс.

```
sha1 = SHA1( весь файл + "\nKEY=" + secret_key )
```

**В сам бэкап-файл строка KEY не записывается** — она только добавляется
во временный `/tmp/conf.bak` при подписи/проверке:

- `sign_backup_file_with_sha1`: 1) `append_key_line_to_file` дописывает `\nKEY=<key>`
  в `/tmp/conf.bak`; 2) `sha1_of_first_n_bytes` считает SHA1 всего файла;
  3) копирует первые `st_size` байт (БЕЗ KEY) + 40 hex символов хэша в выходной файл.
- `verify_backup_file_integrity`: 1) `read_last_40_bytes_as_hash` вырезает последние
  40 hex символов; 2) `append_key_line_to_file` снова дописывает `\nKEY=<key>` во
  временную копию; 3) пересчитывает SHA1 и сравнивает строки через `memcmp`.
  Совпало → `" FILE IS VALID "`, нет → `" FILE IS INVALID "`.

Проверок путей/прав/наличия в whitelist НЕТ. `restore_conf_from_backup` просто
проходит по секциям и пишет файлы через `fopen(путь, "wb")` → абуз: в бэкап можно
подложить любой файл (например `/conf/default_sh`), подписав его правильным SHA1.

## Секретные ключи (`get_checksum_key_by_index`)

| Index | Ключ          |
|-------|---------------|
| 0     | `megarac`     |
| 1     | `megaracsp`   |
| 2     | `megaracsp2`  |
| 3     | `megaracspx`  |
| 4     | `megarac1`    |
| 5     | `magarac2`    |  <- опечатка в прошивке (magarac, не megarac)
| 6     | `megarac3`    |
| 7     | `megarac4`    |
| 8     | `megarac5`    |
| 9     | `megarac6`    |

## Карта секций (selector в backup_cfg_list-AMI.ini)

| Bit | selector | Файлы |
|-----|----------|-------|
| 0   | 0        | activedir.conf, openLdapGroup.conf, nsswitch.conf, pam_withunix, pam_wounix, passwd, shadow, ldap.conf, radius*.conf, radiuspriv.ini |
| 1   | 1        | dns.conf, hostname, hostname.conf, vlaninterfaces, vlansetting.conf, bond.conf, interfaces, hosts, resolv*, ncml.conf, ... |
| 2   | 2        | BMC%d/IPMIConfig.dat (IPMI, флашится через FlushIPMIConfigsToINI) |
| 3   | 3        | ntp.conf, ntp.stat, adjtime, localtime |
| 4   | 4        | vmedia.conf, adviserd.conf, autorecord.conf, stunnel.conf, rmedia.conf, singleport.conf |
| 5   | 5        | syslog.conf, rotate.conf, rsyslog.conf |
| 6   | 6        | snmp_users.conf, snmpcfg.conf |

`backupflag` — битовая маска, какая секция каким selector'ом копируется.

## Структура записи списка бэкапа

```c
typedef struct backup_cfg_entry {
    unsigned char selector;      // какой сектор (0..6)
    char configfile[64];         // путь к файлу
    unsigned char backupflag;    // битовая маска
} backup_cfg_entry_t;            // 66 байт
```

## Шифрование конфигов (вторичная ветка)

Файлы `/conf/BMC%d/UserEncPswd.ini` считаются "encrypted" (`is_user_encpswd_file`).
Для них `encrypt_conf_section`/`decrypt_conf_section`:

```
$$$IsEncrypted=1$
$$$DecryptKeyIndex=0$
$$$DataLength=<N>$
$$$Data=
<Base64(AES-256-CBC блок) ... по 255 байт → 344 символа>
```

- `generate_aes_keys` — 10 детерминированных ключей через
  `EVP_BytesToKey(AES-256-CBC, SHA1, salt=NULL, count=14)`
  от ротации строки `"0123456789abcdef"` (ключ №0 от `"0123456789abcdef\0"`).
- IV — константа (rodata 0x77c8), общая.
- Индекс ключа берётся из `$$$DecryptKeyIndex=N$`.

## Ссылки

- Wiki (bak2shell hack): https://arkprojects.space/wiki/hardware/modding-and-hacks/megarac-sp/bak2shell%20hack
- Ключевые адреса в IDA: sign_backup_file_with_sha1=0x59A8,
  verify_backup_file_integrity=0x5E54, get_checksum_key_by_index=0x2EAC,
  restore_conf_from_backup=0x719C, extract_file_from_backup=0x4908.
