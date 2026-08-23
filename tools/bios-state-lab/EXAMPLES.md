# BIOS State Lab: Practical Guide

This is the working flow for the IMB760 write bridge. Run commands on the
target Linux host as root, or prefix them with `sudo`. The bridge only writes
the 11 allowlisted AMI setup variables and applies a request during the next
boot.

## 1. Build the IFR Registry

Run this once after extracting the BIOS, and again after changing IFR inputs:

```sh
python3 bios_state_lab.py build-registry ../../AMI/EXTRACTED registry.json
```

The registry maps an IFR question to the exact varstore, byte offset, width,
conditions, and, for `OneOf` questions, its value-to-label table.

## 2. Read Current Setup Values

The original AMI setup variables are boot-service-only. Read them through the
runtime bridge instead:

```sh
sudo python3 bios_state_lab.py snapshot bridge-raw.json
python3 bios_state_lab.py bridge-state bridge-raw.json ami-setup.json
python3 bios_state_lab.py values registry.json ami-setup.json values.json
```

`values.json` is the file to inspect before editing. Each item has a stable
`key`, a numeric `value`, its binary storage position, and for `OneOf`, the
available `options` and `selected_option` label.

For example, the tested host exported Memory Frequency as:

```json
{
  "prompt": "Memory Frequency",
  "value": 13,
  "selected_option": { "label": "2400", "value": 13 },
  "storage": {
    "name": "SocketMemoryConfig",
    "guid": "98cf19ed-4109-4681-b79d-9196757c7824",
    "offset": 227,
    "width": 1
  }
}
```

The corresponding IFR options include `0 = Auto`, `13 = 2400`, `18 = 3000`,
and `19 = 3200`. Use the numeric option value in a profile, never the display
label.

## 3. Edit a Profile

Create `memory-2400.json`. Copy the full `key` for Memory Frequency from
`values.json`; the key below is from this IMB760 BIOS build.

```json
{
  "changes": [
    {
      "key": "IMB760_BIOS.bin.dump/5 BIOS region/3 4F1C52D3-D824-4D2A-A2F0-EC40C23C5916/0 9E21FD93-9C72-4C15-8C4B-E77F1DB2D792/0 EE4E5898-3914-4259-9D6E-DC7BD79403CF/1 Volume image section/0 5C60F367-A505-419A-859E-2A4FF6CA6FE5/78 SocketSetup/1 PE32 image section/0.0.en-US.uefi.ifr.txt:516d5a04-c0d5-4657-b908-e4fb1d935ef0:0x1180:SocketMemoryConfig:0xe3",
      "value": 13
    }
  ]
}
```

Before queuing it, make a review-only copy of the target state:

```sh
python3 bios_state_lab.py apply-profile \
  registry.json ami-setup.json memory-2400.json desired-ami-setup.json
```

The command refuses values outside the exact IFR `OneOfOption` list. Do not
use `--unsafe` for normal experiments.

## 4. Queue the Change and Reboot

Build a short bridge request from the profile and write it to efivarfs:

```sh
python3 bios_state_lab.py make-request \
  registry.json memory-2400.json memory-2400-request.json
sudo python3 bios_state_lab.py restore memory-2400-request.json
sudo systemctl reboot
```

The request contains only the changed byte range. For the example above that
is `SocketMemoryConfig[0xe3] = 0x0d`, not a full variable overwrite.

## 5. Confirm the Firmware Accepted It

After Linux returns, capture and decode both the bridge result and the new
values:

```sh
sudo python3 bios_state_lab.py snapshot after.json
python3 bios_state_lab.py bridge-result after.json result.json
python3 bios_state_lab.py bridge-state after.json after-ami-setup.json
python3 bios_state_lab.py values registry.json after-ami-setup.json after-values.json
```

Success requires both checks:

```json
// result.json
{ "overall_status": 0, "entries": [{ "request_index": 0, "status": 0 }] }
```

```json
// the Memory Frequency item in after-values.json
{ "value": 13, "selected_option": { "label": "2400", "value": 13 } }
```

An EFI success result means the firmware accepted the variable write. The
second snapshot verifies that it persisted through POST. Hardware limits or
firmware callbacks can still affect the effective operating frequency.

## 6. Roll Back

Use the previous selected numeric value in a new profile. For example, the
tested pre-change value was `3000`, which is option value `18`:

```json
{
  "changes": [
    {
      "key": "<copy the same key from values.json>",
      "value": 18
    }
  ]
}
```

Build, restore, reboot, and verify it with the commands in sections 4 and 5.
Always preserve the `before` and `after` JSON snapshots for an experiment.
