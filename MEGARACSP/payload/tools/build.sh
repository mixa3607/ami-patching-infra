#!/bin/sh
# Materialize the payload/tools directory: build static busybox + bash and
# stage the login-shell wrapper and bashrc.
#
#   build.sh BUSYBOX_SRC BASH_SRC OUTPUT_DIR
#
# OUTPUT_DIR is the staged payload/tools tree that build-payload-slot.sh
# packs into the slot. busybox applet symlinks are created at runtime by
# login-shell into /var/applets (the slot CramFS is read-only).
set -eu

usage()
{
	printf 'Usage: %s BUSYBOX_SRC BASH_SRC OUTPUT_DIR\n' "$0" >&2
	exit 2
}

[ "$#" -eq 3 ] || usage
busybox_src=$1
bash_src=$2
out=$3
self=$(CDPATH= cd "$(dirname "$0")" && pwd)

[ -d "$busybox_src" ] || { printf 'busybox source missing: %s\n' "$busybox_src" >&2; exit 1; }
[ -d "$bash_src" ] || { printf 'bash source missing: %s\n' "$bash_src" >&2; exit 1; }
[ ! -e "$out" ] || { printf 'output already exists: %s\n' "$out" >&2; exit 1; }
mkdir -p "$out/etc"

cp "$self/login-shell" "$out/login-shell"
cp "$self/etc/bashrc" "$out/etc/bashrc"

# --- busybox ---
make -C "$busybox_src" distclean >/dev/null 2>&1 || true
cp "$self/busybox.config" "$busybox_src/.config"
make -C "$busybox_src" CROSS_COMPILE=arm-linux-gnueabi- -j"$(nproc)" >/dev/null
cp "$busybox_src/busybox" "$out/busybox"

# --- bash ---
make -C "$bash_src" distclean >/dev/null 2>&1 || true
(
	cd "$bash_src"
	./configure --host=arm-linux-gnueabi --enable-static-link \
		--without-bash-malloc --disable-nls --disable-profiling >/dev/null 2>&1
)
make -C "$bash_src" -j"$(nproc)" >/dev/null
cp "$bash_src/bash" "$out/bash"

arm-linux-gnueabi-strip "$out/busybox" "$out/bash"
chmod 755 "$out/busybox" "$out/bash" "$out/login-shell"

printf 'tools: busybox=%s bash=%s\n' "$(wc -c < "$out/busybox")" "$(wc -c < "$out/bash")"
