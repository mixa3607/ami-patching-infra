# EXTRACTED — IMB760 BMC firmware partition research tree

Read-only research extraction of the IMB760 MegaRAC SP baseline
(`IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin`). Do not repack.

Each subdirectory corresponds to one `partitions.json` partition:

| Dir | Partition | Format | Contents |
|-----|-----------|--------|----------|
| `01_uboot` | U-Boot | raw | `01_uboot.bin` |
| `02_uboot-env` | U-Boot env | JSON + raw | `env.json`, `02_uboot-env.bin` |
| `20_conf-main` | primary writable config | JFFS2 | unpacked tree (196 files) |
| `30_conf-backup` | backup writable config | JFFS2 | unpacked tree (196 files) |
| `40_conf-failsafe` | failsafe writable config | JFFS2 | unpacked tree (83 files) |
| `50_root` | root CramFS | CramFS | full rootfs (1480 files) |
| `60_uimage` | Linux kernel | uImage | `60_uimage.bin`, `kernel.bin` (zImage), `kernel-decompressed.bin` |
| `70_web-data` | MegaRAC web UI | CramFS | full web root (708 files, `.gz` archives already decompressed) |
| `80_native-kvm-slot-a` | native KVM slot A | raw | `80_native-kvm-slot-a.bin` (0xFF-erased in baseline) |
| `90_firmware-info` | firmware info | text | `firmware-info.txt` |

## How each partition was transformed

Run from `MEGARACSP/` with the split partitions in `partitions/`.

```sh
# 01_uboot — raw U-Boot binary, copied as-is
cp partitions/01_uboot.bin EXTRACTED/01_uboot/01_uboot.bin

# 02_uboot-env — U-Boot env parsed to JSON
uefi-mod-tools uboot env-read \
  --input partitions/02_uboot-env.bin --output EXTRACTED/02_uboot-env/env.json
cp partitions/02_uboot-env.bin EXTRACTED/02_uboot-env/02_uboot-env.bin

# 20/30/40_conf-* — JFFS2 config trees unpacked with jefferson
jefferson --dest EXTRACTED/20_conf-main partitions/20_conf-main.bin
jefferson --dest EXTRACTED/30_conf-backup partitions/30_conf-backup.bin
jefferson --dest EXTRACTED/40_conf-failsafe partitions/40_conf-failsafe.bin

# 50_root — root CramFS unpacked with fsck.cramfs
fsck.cramfs --extract=EXTRACTED/50_root partitions/50_root.cramfs

# 60_uimage — uImage payload: raw header, zImage, and decompressed kernel
cp partitions/60_uimage.bin EXTRACTED/60_uimage/60_uimage.bin
dumpimage -T kernel -p 0 -o EXTRACTED/60_uimage/kernel.bin partitions/60_uimage.bin
# kernel.bin is a gzip-compressed ARM zImage (gzip stream at offset 0x429F):
dd if=EXTRACTED/60_uimage/kernel.bin bs=1 skip=17055 of=/tmp/kernel.gz
gunzip -c /tmp/kernel.gz > EXTRACTED/60_uimage/kernel-decompressed.bin

# 70_web-data — MegaRAC web UI CramFS unpacked, then all .gz archives
# decompressed in place (429 files) and the archives dropped:
fsck.cramfs --extract=EXTRACTED/70_web-data partitions/70_web-data.cramfs
find EXTRACTED/70_web-data -name '*.gz' -print |
  while IFS= read -r f; do
    gzip -dc "$f" > "${f%.gz}" && rm -f "$f"
  done

# 80_native-kvm-slot-a — raw erased slot, copied as-is
cp partitions/80_native-kvm-slot-a.bin EXTRACTED/80_native-kvm-slot-a/80_native-kvm-slot-a.bin

# 90_firmware-info — plain text record, copied as-is
cp partitions/90_firmware-info.bin EXTRACTED/90_firmware-info/firmware-info.txt
```

The `.gz` decompression relied on the stored original name: `gzip -t` validated
all 429 archives, and each stored name matched `<file>.gz` minus the extension.
