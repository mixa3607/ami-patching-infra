# IMB760 MegaRAC SP Mod

## For Users

Build a ready-to-flash IMB760 BMC image with:

- a configurable BMC MAC address from `eth-mac.txt`;
- a visible release suffix from `version.txt`;
- SSH shell access through the `bak2shell` patch;
- native browser KVM at `http://BMC-IP:8080/novnc/vnc.html?autoconnect=1&path=/websockify&resize=scale`.

### Quick Start

1. Set the MAC address in `eth-mac.txt` and the two-digit release suffix in
   `version.txt`.
2. Build the final image with Docker:

   ```sh
   ./build-docker.sh
   ```

   The image is written to `build/<git-tag-or-short-sha>/`.

3. Flash `build/<git-tag-or-short-sha>/IMB760_BMC_mixa3607_mod-<version>-<git-tag-or-short-sha>.bin` using the established BMC
   recovery procedure. Do not interrupt power while SPI flash is being written.
4. Open the stock BMC UI at `http://BMC-IP/`, SSH as `sysadmin`, or open native
   KVM at the URL above. Native KVM Basic Auth defaults to `admin:admin`; use it
   only on a management network.

The Docker build compiles native KVM from the included source and exports only
the final 32 MiB image.

## Build Details

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

`80_payload-slot-a.bin` is the generic CramFS payload slot. It starts at
`0x016d0000`, is 8 MiB, and is erased in the baseline image. It is mounted
early in boot at `/var/payload`; any payload directory listed in
`payloads.list` is enabled and may provide a stage-aware `init.sh`
(`mount` / `adviserd`).

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

### Payload image

The payload mode also includes `bak2shell`, patches root CramFS with the
generic payload bootstrap (`payload-loop` + `payload-bootstrap`, early rcS
mount, adviserd hook), writes the payload slot CramFS to slot A, and configures
native-KVM Basic Auth as `admin:admin`.

```sh
scripts/build-mac-version-image.sh --payload \
  work/payload-root.cramfs work/payload-slot.cramfs \
  work/IMB760_BMC_payload.bin
```

## Docker Build

Docker downloads checksum-pinned UEFI mod tools and upstream Linux `3.14.17`,
applies the tracked AMI/AST2500 patch set, and builds the vendored JPEG-enabled
`videocap.ko` source against the resulting `3.14.17-ami` tree. The artifact
stage exports only the final image:

```sh
./build-docker.sh
```

Set `REPO_GIT_REF` to choose the `build/<version>` directory name explicitly.
