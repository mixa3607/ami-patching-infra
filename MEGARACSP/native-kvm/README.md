# AST2500 native KVM prototype

The two diagnostics are narrow ABI probes for this firmware tree. They do not
inject keyboard or mouse reports or reconfigure USB devices.

`ami-kvm-server` is a browser KVM replacement. It
serves an embedded legacy page, captures hardware JPEG rectangles, and accepts
boot-keyboard and absolute-mouse reports. With `--web-root`, it also serves the
vendored noVNC client and exposes a same-origin RFB 3.8 WebSocket endpoint. The
server remains a single static binary. The optional `ami-power-helper` is a
small dynamic executable that uses this firmware's vendor `libipmi` local UDS
session for chassis status and power operations.

Use `--auth-file` with a root-only file containing one `username:password` line
to require HTTP Basic Auth for both noVNC assets and the RFB WebSocket. This does
not encrypt traffic; bind to a management-only address and add HTTPS before
exposing the service outside that network.

`ast2500-jpeg-capture` writes `2` to the JPEG mode proc node, opens and maps
`/dev/videocap`, issues `START_CAPTURE` and one `GET_VIDEO`, validates the
hardware stream, appends the EOI marker omitted by this AST2500 implementation,
and saves a complete JPEG. The 16 KiB mmap prefix is the driver header/JPEG-table
region; compressed data starts at offset `0x4000`.

`iusb-hid-diag` lists configured iUSB interfaces, finds free exclusive keyboard
and mouse interfaces, requests them, prints their authentication keys, and then
immediately releases them in reverse order. Do not run it concurrently with the
firmware KVM/VNC service because that service normally owns these interfaces.

Build:

```sh
make
```

For normal reservation, run on the target only after stopping `adviserd` and
every vendor KVM/VNC process. They must not run concurrently because the video
engine and iUSB HID interfaces are global resources.

```sh
./ami-kvm-server
./ami-kvm-server --bind 192.0.2.10 --port 8080
./ami-kvm-server --web-root vendor
./ami-kvm-server --web-root vendor --auth-file /conf/native-kvm.users
```

Video-only mode does not open `/dev/usb`, reserve HID interfaces, or switch the
host mouse descriptor:

```sh
./ami-kvm-server --no-input
```

Options:

```text
--bind IPv4             listen address (default 0.0.0.0)
--port PORT             listen port (default 8080)
--web-root PATH         redirect / to noVNC and serve PATH/novnc
--auth-file PATH        root-only username:password file for HTTP Basic Auth
--video-device PATH     video character device (default /dev/videocap)
--usb-device PATH       iUSB character device (default /dev/usb)
--jpeg-mode-path PATH   JPEG mode proc node (default /proc/ractrends/videocap/jpeg_enable)
--jpeg-quality-path PATH JPEG table selector proc node
--jpeg-quality 0..11    hardware JPEG table selector (default 7)
--power-helper PATH     enable status, power HTTP API, and RFB XVP controls
--adopt-adviserd PID    inherit this exact IMB760 adviserd's HID records
--adopt-file PATH       inherit records from an exact 18-byte binary file
--no-input              serve video without touching iUSB
```

The RFB path starts capture once and then uses differential JPEG tiles. A new
viewer, resolution change, or another consumer forcing a keyframe starts a new
generation so clients never apply deltas to the wrong base image. Static-screen
polls return an empty framebuffer update, while blank video is retried without
disconnecting the RFB session. noVNC is configured for one-second automatic
reconnect after a BMC/service restart.

Standard RFB `ClientCutText` is implemented as paced US-keyboard typing because
there is no guest clipboard agent. Text is limited to 16 KiB per paste; CRLF is
normalized, Latin-1 characters outside ASCII become `?`, and unsupported control
characters are skipped. Repeated key-down messages for an already-held key are
ignored, preventing duplicate iUSB reports from browser autorepeat.

Native KVM is currently deployed without a power helper. noVNC provides video and
keyboard/mouse only; it does not expose host power controls.

### IMB760 power stack

The BMC's stock `IPMIMain` service must remain running. It owns sensor polling,
LAN IPMI, and the stock web power-control path. Native KVM does not pause, signal,
or otherwise modify `IPMIMain`.

## Live adviserd handoff

The `--adopt-adviserd PID` path is specific to the verified, fixed-address
IMB760 `adviserd` ELF. Its global base is `0x27588`; packed mouse and keyboard
`IUSB_REQ_REL_DEVICE_INFO` records are read from `0x275a0` and `0x275ac`.
Each record is nine bytes (`DevInfo[5]`, then a little-endian key), with three
bytes of alignment between records.

```sh
./ami-kvm-server --adopt-adviserd "$(cat /var/run/Adviserd.pid)"
```

Before signaling anything, the server:

1. Requires `/proc/PID/exe` to have basename `adviserd`.
2. Records the process start time to guard against PID reuse.
3. Reads both records through `/proc/PID/mem` with exact-length `pread` calls.
4. Requires mouse type `0x31`, keyboard type `0x30`, exclusive lock `1`,
   nonzero keys, plausible device/interface/instance values, one shared device,
   and distinct interfaces.
5. Opens `/dev/usb` without issuing `USB_GET_INTERFACES` or
   `USB_REQ_INTERFACE`.
6. Rechecks executable identity and process start time, sends `SIGTERM`, waits
   five seconds, then sends `SIGKILL` and waits another five seconds if needed.

The inherited records are used for authenticated input and are released with
`USB_REL_INTERFACE` during normal server shutdown. After adoption, the server
enables the AST2500 vHub upstream connection and sets absolute mouse mode; the
vendor driver deliberately disconnects and reconnects the HID USB gadget so a
host started after `adviserd` was stopped can enumerate it.

Do not use these fixed addresses with another firmware build, PIE executable,
or replacement `adviserd`. Reading `/proc/PID/mem` normally requires root and
may also be restricted by kernel ptrace policy.

### Adoption file format

`--adopt-file PATH` supports handoff across a video-module swap without relying
on the broken assumption that killing adviserd frees iUSB `Used`. The file is
exactly 18 bytes with no header, padding, newline, or trailing data:

```text
offset  size  contents
0       9     packed mouse IUSB_REQ_REL_DEVICE_INFO
9       9     packed keyboard IUSB_REQ_REL_DEVICE_INFO
```

Each record contains `DeviceType`, `DevNo`, `IfNum`, `LockType`, and `Instance`
as five bytes, followed immediately by a four-byte little-endian key. For the
validated live sample, the complete file is:

```text
31 03 01 01 00 48 38 0d bf 30 03 00 01 00 34 38 0d bf
```

The server opens the file with `O_NOFOLLOW`, requires a regular file owned by
the server UID, requires no group/other permission bits, and requires an exact
size of 18 bytes. It applies the same strict record and pairing validation as
live adoption before opening `/dev/usb`. It does not issue
`USB_GET_INTERFACES` or `USB_REQ_INTERFACE`.

The server requests one exclusive type `0x30` keyboard and one exclusive type
`0x31` mouse interface. It changes the mouse descriptor to absolute mode, which
causes the vendor HID driver to disconnect and reconnect the virtual USB device.
On `SIGINT` or `SIGTERM`, it waits for active HTTP/WebSocket requests, sends all-release
reports, releases mouse then keyboard, issues `STOP_CAPTURE`, and exits.

## Video module swap wrapper

`run-ami-kvm-with-videocap.sh` provides a separate recovery-oriented workflow
for replacing the loaded stock module with a custom JPEG-enabled module. Tests
on this firmware show that killing adviserd and even reloading HID do not clear
the kernel iUSB `Used` flags, so normal post-kill reservation cannot work.

The corrected wrapper sequence is:

1. Require a running adviserd and create a new adoption file under `umask 077`.
2. Before any signal, use BusyBox-compatible `dd` reads from
   `/proc/PID/mem`: nine bytes at decimal address `161184` (`0x275a0`) and nine
   bytes at `161196` (`0x275ac`). Both writes share one retained file descriptor,
   producing the exact 18-byte format above.
3. Verify the file is 18 bytes and mode 600.
4. Stop adviserd and wait with TERM/KILL fallback.
5. Unload stock `videocap`, load the custom module, and start
   `ami-kvm-server --adopt-file PATH`. No reservation ioctl is attempted.
6. On EXIT/HUP/INT/TERM, terminate and wait for the server so it sends release
   reports and `USB_REL_INTERFACE`, restore stock `videocap`, remove the key
   file, and restart adviserd. Adviserd can then reserve the cleared interfaces.

Defaults and an example override:

```sh
AMI_KVM_SERVER=/tmp/ami-kvm-server \
CUSTOM_VIDEOCAP_KO=/tmp/videocap-jpeg.ko \
STOCK_VIDEOCAP_KO=/lib/modules/generic/misc/videocap.ko \
ADVISER_INIT=/etc/init.d/adviserd.sh \
./run-ami-kvm-with-videocap.sh --bind 0.0.0.0 --port 8080
```

Additional configurable environment variables are `ADVISER_PIDFILE`,
`ADOPT_FILE` (default `/var/run/ami-kvm-adopt.$$`), `MODULE_NAME`, and
`STOP_TIMEOUT`. The wrapper uses noclobber creation, requires root, and removes
the adoption file from its cleanup trap.

Safe target-side smoke tests (stop the existing KVM/VNC service first):

```sh
./ast2500-jpeg-capture /tmp/capture.jpg
./iusb-hid-diag /dev/usb
```

For images that expose the proc node outside `ractrends`, pass the exact
alternate path without changing the binary:

```sh
./ast2500-jpeg-capture /tmp/capture.jpg /dev/videocap /proc/videocap/jpeg_enable
./ami-kvm-server --jpeg-mode-path /proc/videocap/jpeg_enable
```

The binaries are statically linked ARM EABI executables by default. If the
installed cross libc cannot link statically, use `make LDFLAGS=` and deploy the
matching runtime loader/libc with the binaries.

## Payload packaging

native-kvm is packaged as one payload in the generic CramFS slot
(`80_payload-slot-a.bin`, mounted at `/var/payload`). The Docker build
materializes this payload directory (`init.sh`, `ami-kvm-server`, the module
swap wrapper, `videocap.ko`, `vendor/novnc`) and packs it into the slot with
the generic bundler:

```sh
scripts/build-payload-slot.sh out/payload-slot.cramfs out/payloads/native-kvm out/payloads/dio
```

The slot root carries `verify-manifest.sh`, `payloads.list`, `provenance`, and
`manifest.*` files. At boot the generic `payload-bootstrap` mounts the slot
early and runs each payload's `init.sh` for the `mount` stage (rcS) and the
`adviserd` stage (adviserd hook, where native-kvm performs its HID handoff).


## Known limitations

- Multiple browser clients share one keyboard and mouse state and can conflict.
- Browser key capture depends on `KeyboardEvent.code`; browser/OS-reserved key
  combinations may never reach the page.
- Blur and `pagehide` release reports are best effort. A crashed browser can
  leave keys held until another report or server shutdown sends all-release.
- JPEG capture and proc capture mode are global. The previous capture mode
  cannot be restored because this driver does not return it from the proc read.
- The HTTP/WebSocket implementation is intentionally small: no TLS,
  authentication, range requests, permessage-deflate, or persistent HTTP
  connections. RFB offers only the unauthenticated `None` security type and
  requires the client's Tight encoding support for framebuffer updates.
- A resolution change is sent only to RFB clients that advertised DesktopSize.
  Other clients stop receiving frames until the hardware resolution again
  matches their advertised framebuffer.
- Mouse absolute-mode switching temporarily disconnects the virtual USB HID
  device from the host. The vendor driver then waits about one second.
- Direct live adoption cannot detect a vendor cleanup path that silently
  releases its interfaces while handling `SIGTERM`; subsequent input ioctls
  will then fail. The verified wrapper workflow preserves the records across
  termination and depends on the observed persistent `Used` behavior.
- The module wrapper cannot guarantee recovery from kernel crashes, power loss,
  an unkillable process, or a module whose unload callback hangs.
- Bootstrap depends on BusyBox `losetup`, `mount`, `pidof`, and
  `start-stop-daemon`, plus free `/dev/loop0` through `/dev/loop7`. The offline
  updater additionally requires `flash_erase`, `dd`, `diff`, `od`, and `sum`.
- Only numeric IPv4 bind addresses are accepted.
