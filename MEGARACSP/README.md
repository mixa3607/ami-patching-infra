# MegaRAC SP Mod Workspace

Baseline image: `IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin`

SHA-256: `aa8ae3bf892d18689e9ba7d0089a3abc5b413671aa6673a438f7dbf08df2e68c`

This is the immutable 32 MiB AST2500 SPI base. `partitions.json` names only
known patchable regions. All gaps remain in the baseline image and are retained
by `bin combine`.

Split the baseline:

```sh
../SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools bin split \
  --input IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin \
  --table partitions.json --output partitions
```

Build a patched image by injecting selected files from `partitions`:

```sh
../SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools bin combine \
  --input IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin \
  --table partitions.json --partitions partitions --output patched.bin
```

`80_native-kvm-slot-a.bin` is the only native KVM payload slot. It starts at
`0x016d0000`, is 4 MiB, and is erased in the baseline image.

## MAC and version test image

Set the desired two-digit release in `version.txt` and the MAC address in
`eth-mac.txt`. Build an image that modifies only the U-Boot environment and the
fixed-size 157-byte firmware-info record:

```sh
scripts/build-mac-version-image.sh work/IMB760_BMC_mac-version.bin
```

The builder verifies both `ethaddr` variables, the firmware-info record, and
every unchanged named partition before writing the result. It does not flash a
BMC.

Add `--bak2shell` to also replace `/conf/default_sh` with `/bin/sh` in the
main, backup, and failsafe JFFS2 partitions:

```sh
scripts/build-mac-version-image.sh --bak2shell work/IMB760_BMC_mac-version-shell.bin
```
