# Native KVM Backlog

## P0

- [ ] Bind native KVM to the management network and add HTTPS before exposing it outside the management VLAN.

## Complete

- [x] Deploy `/conf/native-kvm.users` with mode `0600` and enable Basic Auth.

## P1

- [x] Add clipboard size, replacement/skipped-character, and HID delivery status.
- [x] Add a POST-code history panel with raw snoop history and known AMI decode labels.

## P2

- [ ] Add connection state, frame rate, and JPEG-size indicators.
- [ ] Add a link to the stock BMC Firmware Update UI. Do not reimplement upload or flashing.

## Known Bugs

- [ ] Host-off I2C failures can deadlock `IPMIMain` and all BMC power-control paths. Native KVM power controls are deliberately disabled until the vendor driver/sensor lifecycle is fixed.
- [ ] A BMC restart may require manual `adviserd` recovery before native KVM can adopt its HID reservation records.
