# BIOS State Lab

Experimental Linux-first toolkit for Axiomtek IMB760 BIOS research. It treats
the setup UI as a view over UEFI variables, not as the configuration API.

## Goals

- rebuild a parameter registry from *new* verbose IFR extraction results;
- snapshot and restore EFI variables without modifying raw SPI NVAR stores;
- show values and statically-evaluable UI state (`hidden`, `grayed`,
  `disabled`, `invalid`) from IFR conditions;
- make direct variable experiments repeatable, diffable, and reversible.

The tool deliberately does not promise that a writable variable takes effect.
Firmware callbacks, hardware discovery, and SMM may replace values during the
next POST. A useful experiment is therefore: snapshot, write, reboot, snapshot,
and diff.

## Host capability check

The IMB760 Linux host was checked on 2026-08-24:

- `/sys/firmware/efi/efivars` is mounted as read-write `efivarfs`;
- 60 EFI variables were readable;
- a temporary variable was created, read back, and deleted successfully.

`efivarfs` marked the newly created arbitrary variable immutable. Removal
required `chattr -i` first. This is a kernel-side accidental-deletion guard,
not firmware write protection. `write` and `restore` clear that flag when it is
present. Both commands require root.

The checked host is **not currently running the AMI BIOS image in this
repository**: its 60 variables do not include the AMI `Setup`, `ServerSetup`,
`IntelSetup`, `PchSetup`, or `Socket*` varstores. A generic EFI-variable write
proves the Linux UEFI runtime path works, but does not prove access to AMI setup
variables. `state` emits `coverage.missing_varstores` instead of pretending
that absent setup variables are disabled settings.

## IFR source of truth

Use the complete `AMI/EXTRACTED` tree, not just `AMI/IFR`. The extraction has
all 17 verbose IFR files recorded in `AMI/EXTRACTED/IFR-INVENTORY.md`, including
the five main setup formsets and network/storage/reflash formsets.

```sh
python3 bios_state_lab.py build-registry \
  ../../AMI/EXTRACTED registry.json
```

The generated registry includes the SHA-256 of every source IFR file. Re-run
this command after extracting another BIOS; do not reuse a registry with a
different IFR set.

## Linux workflow

Run these on the target host as root (or via `sudo`):

```sh
python3 bios_state_lab.py snapshot before.json
python3 bios_state_lab.py state registry.json before.json > before-state.json

# `data-hex` is variable payload only, excluding efivarfs' four attribute bytes.
python3 bios_state_lab.py write \
  --name ServerSetup \
  --guid 01239999-fc0e-4b6e-9e79-d54d5db6cd20 \
  --data-hex 0000000000000000000000000000000000000000000000000000000000000000

python3 bios_state_lab.py snapshot after-write.json
python3 bios_state_lab.py restore before.json
```

After flashing the read-only bridge and rebooting, decode its runtime variable
into a normal snapshot before evaluating IFR state:

```sh
python3 bios_state_lab.py snapshot bridge-raw.json
python3 bios_state_lab.py bridge-state bridge-raw.json ami-setup.json
python3 bios_state_lab.py state registry.json ami-setup.json > ami-state.json
```

`restore` restores variables that exist in the snapshot. It intentionally does
not delete variables absent from the snapshot. `write` reuses the existing EFI
attributes unless `--attrs` is supplied.

## State model

The evaluator implements the common static IFR predicates: `True`, `False`,
`EqIdVal`, `EqIdValList`, `And`, `Or`, and `Not`. Conditions it cannot evaluate
from a variable snapshot are `unknown`; they are never silently treated as
false. Full support for `Get`, `QuestionRef*`, firmware callbacks, dynamic
options, and hardware-derived state remains planned.

Each question has independent flags. A setting can be writable while hidden;
it can also be visible but grayed, or accepted by `SetVariable` yet ineffective
after POST.

## Making AMI setup variables visible to Linux

The AMI IFR declares its main setup varstores with attributes `0x3`
(`NON_VOLATILE | BOOTSERVICE_ACCESS`), without `RUNTIME_ACCESS` (`0x4`). If
the active AMI firmware preserves those attributes, Linux cannot enumerate or
write them after ExitBootServices even though the variables are stored in NVAR.

For this experimental board, a BIOS patch is an acceptable next step. Do not
assume a DXE driver can safely upgrade an existing variable from `0x3` to `0x7`:
firmware can reject `SetVariable` calls whose attributes differ from those of
the existing variable. Full direct runtime access requires changing the
original variable creation/recreation path, then recreating each selected
variable with `NV | BS | RT` (`0x7`).

The more reliable first patch is `BiosStateLabBridgeDxe`: at boot it reads an
allowlisted set of boot-service-only setup variables, publishes their complete
payloads in one runtime-readable state variable, and consumes a runtime
request variable on the next boot. Linux writes a request; the bridge applies
it before ExitBootServices and publishes the resulting state. This costs one
reboot, which is already required for most setup settings, but does not depend
on mutating attributes of AMI's existing variables. Do not expose Secure Boot
keys, password variables, or arbitrary variable writes through either design.

## Plan

1. Expand the IFR expression evaluator and generate an unlock frontier by
   simulating allowed controller values.
2. Add profiles which change selected fields inside a variable while retaining
   all other bytes from a snapshot.
3. Add BMC orchestration for reboot, POST-code capture, virtual-media EFI
   recovery, and experiment records.
4. Compare calculated UI state with SOL/KVM observations and record callback
   behaviour per BIOS build.

This project is intended for an experimental platform. Raw NVAR/SPI editing is
out of scope because it bypasses the firmware variable driver and its redundant
stores/garbage collection.
