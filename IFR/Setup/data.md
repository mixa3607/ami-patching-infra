```
| Path                                             | Type     | SuppressIf                        |
|--------------------------------------------------|----------|-----------------------------------|
| - Main:                                          | Menu     |                                   |
|   - System Language                              | OneOf    | [🟢0x146B8]                       |
| - Advanced:                                      | Menu     |                                   |
|   - Trusted Computing:                           | Ref      | [🟢0x14738, 🟢0x14740]            |
|     -   Security Device Support                  | OneOf    | [🟢0x14959]                       |
|     -   TPM State                                | OneOf    | [🟢0x1498E]                       |
|     - Pending operation                          | OneOf    | [🟢0x149CD]                       |
|     -   Security Device Support                  | OneOf    | [🟢0x14A1E]                       |
|     -   TCM State                                | OneOf    | [🟢0x14A53]                       |
|     - Pending operation                          | OneOf    | [🟢0x14A92]                       |
|     -   Device Select                            | OneOf    | [🟢0x14AE3]                       |
|   - Trusted Computing:                           | Ref      | [🟢0x14738, 🟢0x14763]            |
|     -   Security Device Support                  | OneOf    |                                   |
|     -   SHA-1 PCR Bank                           | OneOf    | [🟢0x14CDA]                       |
|     -   SHA256 PCR Bank                          | OneOf    | [🟢0x14D1B]                       |
|     -   SHA384 PCR Bank                          | OneOf    | [🟢0x14D5C]                       |
|     -   SHA512 PCR Bank                          | OneOf    | [🟢0x14D9D]                       |
|     -   SM3_256 PCR Bank                         | OneOf    | [🟢0x14DDE]                       |
|     -   Pending operation                        | OneOf    | [🟢0x14E2A]                       |
|     -   Platform Hierarchy                       | OneOf    | [🟢0x14E2A]                       |
|     -   Storage Hierarchy                        | OneOf    | [🟢0x14E2A]                       |
|     -   Endorsement Hierarchy                    | OneOf    | [🟢0x14E2A]                       |
|     -   TPM 2.0 UEFI Spec Version                | OneOf    | [🟢0x14E2A]                       |
|     -   Physical Presence Spec Version           | OneOf    | [🟢0x14E2A]                       |
|     -   TPM 2.0 InterfaceType                    | OneOf    | [🟢0x14EFA]                       |
|     -   Device Select                            | OneOf    | [🟢0x14F2B]                       |
|     -   Disable Block Sid                        | OneOf    | [🟢0x14F5D]                       |
|   - Trusted Computing:                           | Ref      | [🟢0x14738, 🟢0x14786]            |
|     -   Security Device Support                  | OneOf    |                                   |
|     -   Disable Block Sid                        | OneOf    | [🟢0x14915]                       |
|   - ACPI Settings:                               | Ref      | [🔘0x147A1]                       |
|     - Enable ACPI Auto Configuration             | CheckBox |                                   |
|   - AST2500SEC Super IO Configuration:           | Ref      |                                   |
|     - Serial Port 1 Configuration:               | Ref      | [🟢0x15007]                       |
|       - Serial Port                              | CheckBox |                                   |
|       - Change Settings                          | OneOf    | [🟢0x1507E, 🟢0x15086]            |
|     - Serial Port 2 Configuration:               | Ref      | [🟢0x15020]                       |
|       - Serial Port                              | CheckBox |                                   |
|       - Change Settings                          | OneOf    | [🟢0x15122, 🟢0x1512A]            |
|   - NCT7802Y HW Monitor:                         | Ref      |                                   |
|     - NCT7802Y Smart Fan Configuration:          | Ref      |                                   |
|       - NCT7802Y Smart Fan1 Config               | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x152C4]                       |
|       - T1                                       | Numeric  | [🟢0x152EB]                       |
|       - F1                                       | Numeric  | [🟢0x15312]                       |
|       - T2                                       | Numeric  | [🟢0x15339]                       |
|       - F2                                       | Numeric  | [🟢0x15360]                       |
|       - T3                                       | Numeric  | [🟢0x15387]                       |
|       - F3                                       | Numeric  | [🟢0x153AE]                       |
|       - T4                                       | Numeric  | [🟢0x153D5]                       |
|       - F4                                       | Numeric  | [🟢0x153FC]                       |
|       - Critical Temperature                     | Numeric  | [🟢0x15423]                       |
|       - NCT7802Y Smart Fan2 Config               | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15474]                       |
|       - T1                                       | Numeric  | [🟢0x1549B]                       |
|       - F1                                       | Numeric  | [🟢0x154C2]                       |
|       - T2                                       | Numeric  | [🟢0x154E9]                       |
|       - F2                                       | Numeric  | [🟢0x15510]                       |
|       - T3                                       | Numeric  | [🟢0x15537]                       |
|       - F3                                       | Numeric  | [🟢0x1555E]                       |
|       - T4                                       | Numeric  | [🟢0x15585]                       |
|       - F4                                       | Numeric  | [🟢0x155AC]                       |
|       - Temp2 TRCritical                         | Numeric  | [🟢0x155D3]                       |
|       - NCT7802Y Smart Fan3 Config               | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15624]                       |
|       - T1                                       | Numeric  | [🟢0x1564B]                       |
|       - F1                                       | Numeric  | [🟢0x15672]                       |
|       - T2                                       | Numeric  | [🟢0x15699]                       |
|       - F2                                       | Numeric  | [🟢0x156C0]                       |
|       - T3                                       | Numeric  | [🟢0x156E7]                       |
|       - F3                                       | Numeric  | [🟢0x1570E]                       |
|       - T4                                       | Numeric  | [🟢0x15735]                       |
|       - F4                                       | Numeric  | [🟢0x1575C]                       |
|       - Temp3 TRCritical                         | Numeric  | [🟢0x15783]                       |
|   - NCT7802YSEC HW Monitor:                      | Ref      |                                   |
|     - NCT7802YSEC Smart Fan Configuration:       | Ref      |                                   |
|       - NCT7802YSEC Smart Fan4 Config            | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x158ED]                       |
|       - T1                                       | Numeric  | [🟢0x15914]                       |
|       - F1                                       | Numeric  | [🟢0x1593B]                       |
|       - T2                                       | Numeric  | [🟢0x15962]                       |
|       - F2                                       | Numeric  | [🟢0x15989]                       |
|       - T3                                       | Numeric  | [🟢0x159B0]                       |
|       - F3                                       | Numeric  | [🟢0x159D7]                       |
|       - T4                                       | Numeric  | [🟢0x159FE]                       |
|       - F4                                       | Numeric  | [🟢0x15A25]                       |
|       - Critical Temperature                     | Numeric  | [🟢0x15A4C]                       |
|       - NCT7802YSEC Smart Fan5 Config            | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15A9D]                       |
|       - T1                                       | Numeric  | [🟢0x15AC4]                       |
|       - F1                                       | Numeric  | [🟢0x15AEB]                       |
|       - T2                                       | Numeric  | [🟢0x15B12]                       |
|       - F2                                       | Numeric  | [🟢0x15B39]                       |
|       - T3                                       | Numeric  | [🟢0x15B60]                       |
|       - F3                                       | Numeric  | [🟢0x15B87]                       |
|       - T4                                       | Numeric  | [🟢0x15BAE]                       |
|       - F4                                       | Numeric  | [🟢0x15BD5]                       |
|       - Temp2 TRCritical                         | Numeric  | [🟢0x15BFC]                       |
|       - NCT7802YSEC Smart Fan6 Config            | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15C4D]                       |
|       - T1                                       | Numeric  | [🟢0x15C74]                       |
|       - F1                                       | Numeric  | [🟢0x15C9B]                       |
|       - T2                                       | Numeric  | [🟢0x15CC2]                       |
|       - F2                                       | Numeric  | [🟢0x15CE9]                       |
|       - T3                                       | Numeric  | [🟢0x15D10]                       |
|       - F3                                       | Numeric  | [🟢0x15D37]                       |
|       - T4                                       | Numeric  | [🟢0x15D5E]                       |
|       - F4                                       | Numeric  | [🟢0x15D85]                       |
|       - Temp3 TRCritical                         | Numeric  | [🟢0x15DAC]                       |
|   - F81803 Super IO Configuration:               | Ref      |                                   |
|     - Serial Port 1 Configuration:               | Ref      | [🟢0x15DF5]                       |
|       - Serial Port                              | CheckBox |                                   |
|       - Change Settings                          | OneOf    | [🟢0x15E5F]                       |
|       - Mode setting                             | OneOf    |                                   |
|       - Terminator                               | CheckBox | [🟢0x15EDA]                       |
|   - Hardware Monitor:                            | Ref      |                                   |
|     - Smart Fan Configuration:                   | Ref      |                                   |
|       - CPU1 Type                                | OneOf    |                                   |
|       - CPU1 Mode Select                         | OneOf    |                                   |
|       - CPU1 Temp Select                         | OneOf    | [🟢0x16024]                       |
|       - CPU1 Boundary 1 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Boundary 2 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Boundary 3 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Boundary 4 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Highest Speed                       | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 1                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 2                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 3                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 4                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 RPM Speed                           | Numeric  | [🟢0x1613A, 🟢0x1614C]            |
|       - CPU1 duty cycle                          | Numeric  | [🟢0x1613A, 🟢0x16173]            |
|       - CPU2 Type                                | OneOf    |                                   |
|       - CPU2 Mode Select                         | OneOf    |                                   |
|       - CPU2 Temp Select                         | OneOf    | [🟢0x161F1]                       |
|       - CPU2 Boundary 1 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Boundary 2 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Boundary 3 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Boundary 4 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Highest Speed                       | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 1                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 2                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 3                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 4                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 RPM Speed                           | Numeric  | [🟢0x16307, 🟢0x16319]            |
|       - CPU2 duty cycle                          | Numeric  | [🟢0x16307, 🟢0x16340]            |
|     - Smart Fan Function                         | OneOf    |                                   |
|   - UEFI Variables Protection:                   | Ref      | [🔘0x14805]                       |
|     - Password protection of Runtime Variables   | OneOf    |                                   |
|   - Serial Port Console Redirection:             | Ref      |                                   |
|     - Console Redirection                        | CheckBox | [🟢0x163C6]                       |
|     - Console Redirection Settings:              | Ref      | [🟢0x163FB]                       |
|       - Terminal Type                            | OneOf    |                                   |
|       - Bits per second                          | OneOf    |                                   |
|       - Data Bits                                | OneOf    |                                   |
|       - Parity                                   | OneOf    |                                   |
|       - Stop Bits                                | OneOf    |                                   |
|       - Flow Control                             | OneOf    |                                   |
|       - VT-UTF8 Combo Key Support                | CheckBox |                                   |
|       - Recorder Mode                            | CheckBox |                                   |
|       - Resolution 100x31                        | CheckBox |                                   |
|       - Putty KeyPad                             | OneOf    |                                   |
|     - Legacy Console Redirection Settings:       | Ref      |                                   |
|       - Redirection COM Port                     | OneOf    |                                   |
|       - Resolution                               | OneOf    |                                   |
|       - Redirect After POST                      | OneOf    |                                   |
|       - Remote OS Install                        | CheckBox |                                   |
|     - Console Redirection EMS                    | CheckBox |                                   |
|     - Console Redirection Settings:              | Ref      |                                   |
|       - Out-of-Band Mgmt Port                    | OneOf    |                                   |
|       - Terminal Type EMS                        | OneOf    |                                   |
|       - Bits per second EMS                      | OneOf    |                                   |
|       - Flow Control EMS                         | OneOf    |                                   |
|   - SIO Common Setting:                          | Ref      | [🔘0x1482D]                       |
|     - Lock Legacy Resources                      | CheckBox |                                   |
|   - PCI Subsystem Settings:                      | Ref      |                                   |
|     - PCI Latency Timer                          | OneOf    | [🟢0x16DB4]                       |
|     - PCI-X Latency Timer                        | OneOf    | [🟢0x16E25]                       |
|     - VGA Palette Snoop                          | OneOf    | [🟢0x16E96]                       |
|     - PERR# Generation                           | OneOf    | [🟢0x16EE9]                       |
|     - SERR# Generation                           | OneOf    | [🟢0x16F3C]                       |
|     - Above 4G Decoding                          | OneOf    | [🟢0x16F8F]                       |
|     - SR-IOV Support                             | OneOf    | [🟢0x16FE2]                       |
|     - BME DMA Mitigation                         | OneOf    | [🟢0x17035]                       |
|     - Don't Reset VC-TC Mapping                  | OneOf    | [🟢0x17088]                       |
|     - PCI Express Settings:                      | Ref      | [🟢0x170E4, 🟢0x170FE]            |
|       - Relaxed Ordering                         | OneOf    |                                   |
|       - Extended Tag                             | OneOf    |                                   |
|       - No Snoop                                 | OneOf    |                                   |
|       - Maximum Payload                          | OneOf    |                                   |
|       - Maximum Read Request                     | OneOf    |                                   |
|       - ASPM Support                             | OneOf    |                                   |
|       - Extended Synch                           | OneOf    |                                   |
|       - Link Training Retry                      | OneOf    |                                   |
|       - Link Training Timeout (uS)               | Numeric  |                                   |
|       - Unpopulated Links                        | OneOf    |                                   |
|       - Restore PCIE Registers                   | OneOf    | [🟢0x17415]                       |
|     - PCI Express GEN 2 Settings:                | Ref      | [🟢0x1713E, 🟢0x17158]            |
|       - Completion Timeout                       | OneOf    |                                   |
|       - ARI Forwarding                           | OneOf    |                                   |
|       - AtomicOp Requester Enable                | OneOf    |                                   |
|       - AtomicOp Egress Blocking                 | OneOf    |                                   |
|       - IDO Request Enable                       | OneOf    |                                   |
|       - IDO Completion Enable                    | OneOf    |                                   |
|       - LTR Mechanism Enable                     | OneOf    |                                   |
|       - End-End TLP Prefix Blocking              | OneOf    |                                   |
|       - Target Link Speed                        | OneOf    |                                   |
|       - Clock Power Management                   | OneOf    |                                   |
|       - Compliance SOS                           | OneOf    |                                   |
|       - Hardware Autonomous Width                | OneOf    |                                   |
|       - Hardware Autonomous Speed                | OneOf    |                                   |
|   - USB Configuration:                           | Ref      |                                   |
|     - USB Support                                | OneOf    | [🟢0x177B2]                       |
|     - Legacy USB Support                         | OneOf    | [🟢0x177E7]                       |
|     - USB 2.0 Controller Mode                    | OneOf    | [🟢0x17823]                       |
|     - XHCI Legacy Support                        | OneOf    | [🟢0x17854]                       |
|     - XHCI Hand-off                              | OneOf    | [🟢0x17885]                       |
|     - EHCI Hand-off                              | OneOf    | [🟢0x178D0]                       |
|     - USB Mass Storage Driver Support            | OneOf    | [🟢0x1790F]                       |
|     - Port 60/64 Emulation                       | OneOf    | [🟢0x17966]                       |
|     - USB transfer time-out                      | OneOf    | [🟢0x179B8]                       |
|     - Device reset time-out                      | OneOf    | [🟢0x17A1D]                       |
|     - Device power-up delay                      | OneOf    |                                   |
|     - Device power-up delay in seconds           | Numeric  | [🟢0x17ACF]                       |
|     - N/A                                        | OneOf    | [🟢0x17B49]                       |
|     - N/A                                        | OneOf    | [🟢0x17BA7]                       |
|     - N/A                                        | OneOf    | [🟢0x17C05]                       |
|     - N/A                                        | OneOf    | [🟢0x17C63]                       |
|     - N/A                                        | OneOf    | [🟢0x17CC1]                       |
|     - N/A                                        | OneOf    | [🟢0x17D1F]                       |
|     - N/A                                        | OneOf    | [🟢0x17D7D]                       |
|     - N/A                                        | OneOf    | [🟢0x17DDB]                       |
|     - N/A                                        | OneOf    | [🟢0x17E39]                       |
|     - N/A                                        | OneOf    | [🟢0x17E97]                       |
|     - N/A                                        | OneOf    | [🟢0x17EF5]                       |
|     - N/A                                        | OneOf    | [🟢0x17F53]                       |
|     - N/A                                        | OneOf    | [🟢0x17FB1]                       |
|     - N/A                                        | OneOf    | [🟢0x1800F]                       |
|     - N/A                                        | OneOf    | [🟢0x1806D]                       |
|     - N/A                                        | OneOf    | [🟢0x180CB]                       |
|     - N/A                                        | OneOf    | [🟢0x18129]                       |
|     - N/A                                        | OneOf    | [🟢0x18187]                       |
|     - N/A                                        | OneOf    | [🟢0x181E5]                       |
|     - N/A                                        | OneOf    | [🟢0x18243]                       |
|     - N/A                                        | OneOf    | [🟢0x182A1]                       |
|     - N/A                                        | OneOf    | [🟢0x182FF]                       |
|     - N/A                                        | OneOf    | [🟢0x1835D]                       |
|     - N/A                                        | OneOf    | [🟢0x183BB]                       |
|     - N/A                                        | OneOf    | [🟢0x18419]                       |
|     - N/A                                        | OneOf    | [🟢0x18477]                       |
|     - N/A                                        | OneOf    | [🟢0x184D5]                       |
|     - N/A                                        | OneOf    | [🟢0x18533]                       |
|     - N/A                                        | OneOf    | [🟢0x18591]                       |
|     - N/A                                        | OneOf    | [🟢0x185EF]                       |
|     - N/A                                        | OneOf    | [🟢0x1864D]                       |
|     - N/A                                        | OneOf    | [🟢0x186AB]                       |
|   - Network Stack Configuration:                 | Ref      |                                   |
|     - Network Stack                              | OneOf    |                                   |
|     - IPv4 PXE Support                           | OneOf    | [🟢0x18767]                       |
|     - IPv4 HTTP Support                          | OneOf    | [🟢0x18767]                       |
|     - IPv6 PXE Support                           | OneOf    | [🟢0x187CB]                       |
|     - IPv6 HTTP Support                          | OneOf    | [🟢0x187CB]                       |
|     -  PXE LAN Port                              | OneOf    |                                   |
|     - PXE boot wait time                         | Numeric  | [🟢0x1885C]                       |
|     - Media detect count                         | Numeric  | [🟢0x18885]                       |
|   - CSM Configuration:                           | Ref      |                                   |
|     - CSM Support                                | OneOf    | [🟢0x188C8]                       |
|     - GateA20 Active                             | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Option ROM Messages                        | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x18940] |
|     - INT19 Trap Response                        | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Boot option filter                         | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Network                                    | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x189F2] |
|     -  PXE LAN Port                              | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x18A30] |
|     - Storage                                    | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Video                                      | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Other PCI devices                          | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|   - NVMe Configuration                           | Ref      | [🟢0x14882]                       |
| - Security:                                      | Menu     |                                   |
|   - Secure Boot:                                 | Ref      | [🟢0x18D43]                       |
|     - Secure Boot                                | OneOf    |                                   |
|     - Secure Boot Mode                           | OneOf    |                                   |
| - Boot:                                          | Menu     |                                   |
|   - Setup Prompt Timeout                         | Numeric  |                                   |
|   - Bootup NumLock State                         | OneOf    |                                   |
|   - Quiet Boot                                   | CheckBox |                                   |
|   - Boot Option #%d                              | OneOf    | [🟢0x1916D]                       |
|   - Driver Option #%d                            | OneOf    | [🟢0x191CB]                       |
|   - Optimized Boot                               | OneOf    |                                   |
|   - New Boot Option Policy                       | OneOf    | [🟢0x19224]                       |
|   - <empty>:                                     | Ref      | [🟢0x19265]                       |
|     - Boot Option #%d                            | OneOf    | [🟢0x19288]                       |
| - Save & Exit                                    | Menu     |                                   |
| - Setup:                                         | Menu     |                                   |
|   - Main:                                        | Ref      |                                   |
|     - System Language                            | OneOf    | [🟢0x146B8]                       |
|   - Advanced:                                    | Ref      |                                   |
|     - Trusted Computing:                         | Ref      | [🟢0x14738, 🟢0x14740]            |
|       -   Security Device Support                | OneOf    | [🟢0x14959]                       |
|       -   TPM State                              | OneOf    | [🟢0x1498E]                       |
|       - Pending operation                        | OneOf    | [🟢0x149CD]                       |
|       -   Security Device Support                | OneOf    | [🟢0x14A1E]                       |
|       -   TCM State                              | OneOf    | [🟢0x14A53]                       |
|       - Pending operation                        | OneOf    | [🟢0x14A92]                       |
|       -   Device Select                          | OneOf    | [🟢0x14AE3]                       |
|     - Trusted Computing:                         | Ref      | [🟢0x14738, 🟢0x14763]            |
|       -   Security Device Support                | OneOf    |                                   |
|       -   SHA-1 PCR Bank                         | OneOf    | [🟢0x14CDA]                       |
|       -   SHA256 PCR Bank                        | OneOf    | [🟢0x14D1B]                       |
|       -   SHA384 PCR Bank                        | OneOf    | [🟢0x14D5C]                       |
|       -   SHA512 PCR Bank                        | OneOf    | [🟢0x14D9D]                       |
|       -   SM3_256 PCR Bank                       | OneOf    | [🟢0x14DDE]                       |
|       -   Pending operation                      | OneOf    | [🟢0x14E2A]                       |
|       -   Platform Hierarchy                     | OneOf    | [🟢0x14E2A]                       |
|       -   Storage Hierarchy                      | OneOf    | [🟢0x14E2A]                       |
|       -   Endorsement Hierarchy                  | OneOf    | [🟢0x14E2A]                       |
|       -   TPM 2.0 UEFI Spec Version              | OneOf    | [🟢0x14E2A]                       |
|       -   Physical Presence Spec Version         | OneOf    | [🟢0x14E2A]                       |
|       -   TPM 2.0 InterfaceType                  | OneOf    | [🟢0x14EFA]                       |
|       -   Device Select                          | OneOf    | [🟢0x14F2B]                       |
|       -   Disable Block Sid                      | OneOf    | [🟢0x14F5D]                       |
|     - Trusted Computing:                         | Ref      | [🟢0x14738, 🟢0x14786]            |
|       -   Security Device Support                | OneOf    |                                   |
|       -   Disable Block Sid                      | OneOf    | [🟢0x14915]                       |
|     - ACPI Settings:                             | Ref      | [🔘0x147A1]                       |
|       - Enable ACPI Auto Configuration           | CheckBox |                                   |
|     - AST2500SEC Super IO Configuration:         | Ref      |                                   |
|       - Serial Port 1 Configuration:             | Ref      | [🟢0x15007]                       |
|         - Serial Port                            | CheckBox |                                   |
|         - Change Settings                        | OneOf    | [🟢0x1507E, 🟢0x15086]            |
|       - Serial Port 2 Configuration:             | Ref      | [🟢0x15020]                       |
|         - Serial Port                            | CheckBox |                                   |
|         - Change Settings                        | OneOf    | [🟢0x15122, 🟢0x1512A]            |
|     - NCT7802Y HW Monitor:                       | Ref      |                                   |
|       - NCT7802Y Smart Fan Configuration:        | Ref      |                                   |
|         - NCT7802Y Smart Fan1 Config             | OneOf    |                                   |
|         - PWM fan output in manual mode          | Numeric  | [🟢0x152C4]                       |
|         - T1                                     | Numeric  | [🟢0x152EB]                       |
|         - F1                                     | Numeric  | [🟢0x15312]                       |
|         - T2                                     | Numeric  | [🟢0x15339]                       |
|         - F2                                     | Numeric  | [🟢0x15360]                       |
|         - T3                                     | Numeric  | [🟢0x15387]                       |
|         - F3                                     | Numeric  | [🟢0x153AE]                       |
|         - T4                                     | Numeric  | [🟢0x153D5]                       |
|         - F4                                     | Numeric  | [🟢0x153FC]                       |
|         - Critical Temperature                   | Numeric  | [🟢0x15423]                       |
|         - NCT7802Y Smart Fan2 Config             | OneOf    |                                   |
|         - PWM fan output in manual mode          | Numeric  | [🟢0x15474]                       |
|         - T1                                     | Numeric  | [🟢0x1549B]                       |
|         - F1                                     | Numeric  | [🟢0x154C2]                       |
|         - T2                                     | Numeric  | [🟢0x154E9]                       |
|         - F2                                     | Numeric  | [🟢0x15510]                       |
|         - T3                                     | Numeric  | [🟢0x15537]                       |
|         - F3                                     | Numeric  | [🟢0x1555E]                       |
|         - T4                                     | Numeric  | [🟢0x15585]                       |
|         - F4                                     | Numeric  | [🟢0x155AC]                       |
|         - Temp2 TRCritical                       | Numeric  | [🟢0x155D3]                       |
|         - NCT7802Y Smart Fan3 Config             | OneOf    |                                   |
|         - PWM fan output in manual mode          | Numeric  | [🟢0x15624]                       |
|         - T1                                     | Numeric  | [🟢0x1564B]                       |
|         - F1                                     | Numeric  | [🟢0x15672]                       |
|         - T2                                     | Numeric  | [🟢0x15699]                       |
|         - F2                                     | Numeric  | [🟢0x156C0]                       |
|         - T3                                     | Numeric  | [🟢0x156E7]                       |
|         - F3                                     | Numeric  | [🟢0x1570E]                       |
|         - T4                                     | Numeric  | [🟢0x15735]                       |
|         - F4                                     | Numeric  | [🟢0x1575C]                       |
|         - Temp3 TRCritical                       | Numeric  | [🟢0x15783]                       |
|     - NCT7802YSEC HW Monitor:                    | Ref      |                                   |
|       - NCT7802YSEC Smart Fan Configuration:     | Ref      |                                   |
|         - NCT7802YSEC Smart Fan4 Config          | OneOf    |                                   |
|         - PWM fan output in manual mode          | Numeric  | [🟢0x158ED]                       |
|         - T1                                     | Numeric  | [🟢0x15914]                       |
|         - F1                                     | Numeric  | [🟢0x1593B]                       |
|         - T2                                     | Numeric  | [🟢0x15962]                       |
|         - F2                                     | Numeric  | [🟢0x15989]                       |
|         - T3                                     | Numeric  | [🟢0x159B0]                       |
|         - F3                                     | Numeric  | [🟢0x159D7]                       |
|         - T4                                     | Numeric  | [🟢0x159FE]                       |
|         - F4                                     | Numeric  | [🟢0x15A25]                       |
|         - Critical Temperature                   | Numeric  | [🟢0x15A4C]                       |
|         - NCT7802YSEC Smart Fan5 Config          | OneOf    |                                   |
|         - PWM fan output in manual mode          | Numeric  | [🟢0x15A9D]                       |
|         - T1                                     | Numeric  | [🟢0x15AC4]                       |
|         - F1                                     | Numeric  | [🟢0x15AEB]                       |
|         - T2                                     | Numeric  | [🟢0x15B12]                       |
|         - F2                                     | Numeric  | [🟢0x15B39]                       |
|         - T3                                     | Numeric  | [🟢0x15B60]                       |
|         - F3                                     | Numeric  | [🟢0x15B87]                       |
|         - T4                                     | Numeric  | [🟢0x15BAE]                       |
|         - F4                                     | Numeric  | [🟢0x15BD5]                       |
|         - Temp2 TRCritical                       | Numeric  | [🟢0x15BFC]                       |
|         - NCT7802YSEC Smart Fan6 Config          | OneOf    |                                   |
|         - PWM fan output in manual mode          | Numeric  | [🟢0x15C4D]                       |
|         - T1                                     | Numeric  | [🟢0x15C74]                       |
|         - F1                                     | Numeric  | [🟢0x15C9B]                       |
|         - T2                                     | Numeric  | [🟢0x15CC2]                       |
|         - F2                                     | Numeric  | [🟢0x15CE9]                       |
|         - T3                                     | Numeric  | [🟢0x15D10]                       |
|         - F3                                     | Numeric  | [🟢0x15D37]                       |
|         - T4                                     | Numeric  | [🟢0x15D5E]                       |
|         - F4                                     | Numeric  | [🟢0x15D85]                       |
|         - Temp3 TRCritical                       | Numeric  | [🟢0x15DAC]                       |
|     - F81803 Super IO Configuration:             | Ref      |                                   |
|       - Serial Port 1 Configuration:             | Ref      | [🟢0x15DF5]                       |
|         - Serial Port                            | CheckBox |                                   |
|         - Change Settings                        | OneOf    | [🟢0x15E5F]                       |
|         - Mode setting                           | OneOf    |                                   |
|         - Terminator                             | CheckBox | [🟢0x15EDA]                       |
|     - Hardware Monitor:                          | Ref      |                                   |
|       - Smart Fan Configuration:                 | Ref      |                                   |
|         - CPU1 Type                              | OneOf    |                                   |
|         - CPU1 Mode Select                       | OneOf    |                                   |
|         - CPU1 Temp Select                       | OneOf    | [🟢0x16024]                       |
|         - CPU1 Boundary 1 temperature            | Numeric  | [🟢0x16024]                       |
|         - CPU1 Boundary 2 temperature            | Numeric  | [🟢0x16024]                       |
|         - CPU1 Boundary 3 temperature            | Numeric  | [🟢0x16024]                       |
|         - CPU1 Boundary 4 temperature            | Numeric  | [🟢0x16024]                       |
|         - CPU1 Highest Speed                     | Numeric  | [🟢0x16024]                       |
|         - CPU1 Expect Speed 1                    | Numeric  | [🟢0x16024]                       |
|         - CPU1 Expect Speed 2                    | Numeric  | [🟢0x16024]                       |
|         - CPU1 Expect Speed 3                    | Numeric  | [🟢0x16024]                       |
|         - CPU1 Expect Speed 4                    | Numeric  | [🟢0x16024]                       |
|         - CPU1 RPM Speed                         | Numeric  | [🟢0x1613A, 🟢0x1614C]            |
|         - CPU1 duty cycle                        | Numeric  | [🟢0x1613A, 🟢0x16173]            |
|         - CPU2 Type                              | OneOf    |                                   |
|         - CPU2 Mode Select                       | OneOf    |                                   |
|         - CPU2 Temp Select                       | OneOf    | [🟢0x161F1]                       |
|         - CPU2 Boundary 1 temperature            | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Boundary 2 temperature            | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Boundary 3 temperature            | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Boundary 4 temperature            | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Highest Speed                     | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Expect Speed 1                    | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Expect Speed 2                    | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Expect Speed 3                    | Numeric  | [🟢0x161F1]                       |
|         - CPU2 Expect Speed 4                    | Numeric  | [🟢0x161F1]                       |
|         - CPU2 RPM Speed                         | Numeric  | [🟢0x16307, 🟢0x16319]            |
|         - CPU2 duty cycle                        | Numeric  | [🟢0x16307, 🟢0x16340]            |
|       - Smart Fan Function                       | OneOf    |                                   |
|     - UEFI Variables Protection:                 | Ref      | [🔘0x14805]                       |
|       - Password protection of Runtime Variables | OneOf    |                                   |
|     - Serial Port Console Redirection:           | Ref      |                                   |
|       - Console Redirection                      | CheckBox | [🟢0x163C6]                       |
|       - Console Redirection Settings:            | Ref      | [🟢0x163FB]                       |
|         - Terminal Type                          | OneOf    |                                   |
|         - Bits per second                        | OneOf    |                                   |
|         - Data Bits                              | OneOf    |                                   |
|         - Parity                                 | OneOf    |                                   |
|         - Stop Bits                              | OneOf    |                                   |
|         - Flow Control                           | OneOf    |                                   |
|         - VT-UTF8 Combo Key Support              | CheckBox |                                   |
|         - Recorder Mode                          | CheckBox |                                   |
|         - Resolution 100x31                      | CheckBox |                                   |
|         - Putty KeyPad                           | OneOf    |                                   |
|       - Legacy Console Redirection Settings:     | Ref      |                                   |
|         - Redirection COM Port                   | OneOf    |                                   |
|         - Resolution                             | OneOf    |                                   |
|         - Redirect After POST                    | OneOf    |                                   |
|         - Remote OS Install                      | CheckBox |                                   |
|       - Console Redirection EMS                  | CheckBox |                                   |
|       - Console Redirection Settings:            | Ref      |                                   |
|         - Out-of-Band Mgmt Port                  | OneOf    |                                   |
|         - Terminal Type EMS                      | OneOf    |                                   |
|         - Bits per second EMS                    | OneOf    |                                   |
|         - Flow Control EMS                       | OneOf    |                                   |
|     - SIO Common Setting:                        | Ref      | [🔘0x1482D]                       |
|       - Lock Legacy Resources                    | CheckBox |                                   |
|     - PCI Subsystem Settings:                    | Ref      |                                   |
|       - PCI Latency Timer                        | OneOf    | [🟢0x16DB4]                       |
|       - PCI-X Latency Timer                      | OneOf    | [🟢0x16E25]                       |
|       - VGA Palette Snoop                        | OneOf    | [🟢0x16E96]                       |
|       - PERR# Generation                         | OneOf    | [🟢0x16EE9]                       |
|       - SERR# Generation                         | OneOf    | [🟢0x16F3C]                       |
|       - Above 4G Decoding                        | OneOf    | [🟢0x16F8F]                       |
|       - SR-IOV Support                           | OneOf    | [🟢0x16FE2]                       |
|       - BME DMA Mitigation                       | OneOf    | [🟢0x17035]                       |
|       - Don't Reset VC-TC Mapping                | OneOf    | [🟢0x17088]                       |
|       - PCI Express Settings:                    | Ref      | [🟢0x170E4, 🟢0x170FE]            |
|         - Relaxed Ordering                       | OneOf    |                                   |
|         - Extended Tag                           | OneOf    |                                   |
|         - No Snoop                               | OneOf    |                                   |
|         - Maximum Payload                        | OneOf    |                                   |
|         - Maximum Read Request                   | OneOf    |                                   |
|         - ASPM Support                           | OneOf    |                                   |
|         - Extended Synch                         | OneOf    |                                   |
|         - Link Training Retry                    | OneOf    |                                   |
|         - Link Training Timeout (uS)             | Numeric  |                                   |
|         - Unpopulated Links                      | OneOf    |                                   |
|         - Restore PCIE Registers                 | OneOf    | [🟢0x17415]                       |
|       - PCI Express GEN 2 Settings:              | Ref      | [🟢0x1713E, 🟢0x17158]            |
|         - Completion Timeout                     | OneOf    |                                   |
|         - ARI Forwarding                         | OneOf    |                                   |
|         - AtomicOp Requester Enable              | OneOf    |                                   |
|         - AtomicOp Egress Blocking               | OneOf    |                                   |
|         - IDO Request Enable                     | OneOf    |                                   |
|         - IDO Completion Enable                  | OneOf    |                                   |
|         - LTR Mechanism Enable                   | OneOf    |                                   |
|         - End-End TLP Prefix Blocking            | OneOf    |                                   |
|         - Target Link Speed                      | OneOf    |                                   |
|         - Clock Power Management                 | OneOf    |                                   |
|         - Compliance SOS                         | OneOf    |                                   |
|         - Hardware Autonomous Width              | OneOf    |                                   |
|         - Hardware Autonomous Speed              | OneOf    |                                   |
|     - USB Configuration:                         | Ref      |                                   |
|       - USB Support                              | OneOf    | [🟢0x177B2]                       |
|       - Legacy USB Support                       | OneOf    | [🟢0x177E7]                       |
|       - USB 2.0 Controller Mode                  | OneOf    | [🟢0x17823]                       |
|       - XHCI Legacy Support                      | OneOf    | [🟢0x17854]                       |
|       - XHCI Hand-off                            | OneOf    | [🟢0x17885]                       |
|       - EHCI Hand-off                            | OneOf    | [🟢0x178D0]                       |
|       - USB Mass Storage Driver Support          | OneOf    | [🟢0x1790F]                       |
|       - Port 60/64 Emulation                     | OneOf    | [🟢0x17966]                       |
|       - USB transfer time-out                    | OneOf    | [🟢0x179B8]                       |
|       - Device reset time-out                    | OneOf    | [🟢0x17A1D]                       |
|       - Device power-up delay                    | OneOf    |                                   |
|       - Device power-up delay in seconds         | Numeric  | [🟢0x17ACF]                       |
|       - N/A                                      | OneOf    | [🟢0x17B49]                       |
|       - N/A                                      | OneOf    | [🟢0x17BA7]                       |
|       - N/A                                      | OneOf    | [🟢0x17C05]                       |
|       - N/A                                      | OneOf    | [🟢0x17C63]                       |
|       - N/A                                      | OneOf    | [🟢0x17CC1]                       |
|       - N/A                                      | OneOf    | [🟢0x17D1F]                       |
|       - N/A                                      | OneOf    | [🟢0x17D7D]                       |
|       - N/A                                      | OneOf    | [🟢0x17DDB]                       |
|       - N/A                                      | OneOf    | [🟢0x17E39]                       |
|       - N/A                                      | OneOf    | [🟢0x17E97]                       |
|       - N/A                                      | OneOf    | [🟢0x17EF5]                       |
|       - N/A                                      | OneOf    | [🟢0x17F53]                       |
|       - N/A                                      | OneOf    | [🟢0x17FB1]                       |
|       - N/A                                      | OneOf    | [🟢0x1800F]                       |
|       - N/A                                      | OneOf    | [🟢0x1806D]                       |
|       - N/A                                      | OneOf    | [🟢0x180CB]                       |
|       - N/A                                      | OneOf    | [🟢0x18129]                       |
|       - N/A                                      | OneOf    | [🟢0x18187]                       |
|       - N/A                                      | OneOf    | [🟢0x181E5]                       |
|       - N/A                                      | OneOf    | [🟢0x18243]                       |
|       - N/A                                      | OneOf    | [🟢0x182A1]                       |
|       - N/A                                      | OneOf    | [🟢0x182FF]                       |
|       - N/A                                      | OneOf    | [🟢0x1835D]                       |
|       - N/A                                      | OneOf    | [🟢0x183BB]                       |
|       - N/A                                      | OneOf    | [🟢0x18419]                       |
|       - N/A                                      | OneOf    | [🟢0x18477]                       |
|       - N/A                                      | OneOf    | [🟢0x184D5]                       |
|       - N/A                                      | OneOf    | [🟢0x18533]                       |
|       - N/A                                      | OneOf    | [🟢0x18591]                       |
|       - N/A                                      | OneOf    | [🟢0x185EF]                       |
|       - N/A                                      | OneOf    | [🟢0x1864D]                       |
|       - N/A                                      | OneOf    | [🟢0x186AB]                       |
|     - Network Stack Configuration:               | Ref      |                                   |
|       - Network Stack                            | OneOf    |                                   |
|       - IPv4 PXE Support                         | OneOf    | [🟢0x18767]                       |
|       - IPv4 HTTP Support                        | OneOf    | [🟢0x18767]                       |
|       - IPv6 PXE Support                         | OneOf    | [🟢0x187CB]                       |
|       - IPv6 HTTP Support                        | OneOf    | [🟢0x187CB]                       |
|       -  PXE LAN Port                            | OneOf    |                                   |
|       - PXE boot wait time                       | Numeric  | [🟢0x1885C]                       |
|       - Media detect count                       | Numeric  | [🟢0x18885]                       |
|     - CSM Configuration:                         | Ref      |                                   |
|       - CSM Support                              | OneOf    | [🟢0x188C8]                       |
|       - GateA20 Active                           | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|       - Option ROM Messages                      | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x18940] |
|       - INT19 Trap Response                      | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|       - Boot option filter                       | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|       - Network                                  | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x189F2] |
|       -  PXE LAN Port                            | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x18A30] |
|       - Storage                                  | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|       - Video                                    | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|       - Other PCI devices                        | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - NVMe Configuration                         | Ref      | [🟢0x14882]                       |
|   - Chipset                                      | Ref      | [🟢0x14598]                       |
|   - Security:                                    | Ref      |                                   |
|     - Secure Boot:                               | Ref      | [🟢0x18D43]                       |
|       - Secure Boot                              | OneOf    |                                   |
|       - Secure Boot Mode                         | OneOf    |                                   |
|   - Boot:                                        | Ref      |                                   |
|     - Setup Prompt Timeout                       | Numeric  |                                   |
|     - Bootup NumLock State                       | OneOf    |                                   |
|     - Quiet Boot                                 | CheckBox |                                   |
|     - Boot Option #%d                            | OneOf    | [🟢0x1916D]                       |
|     - Driver Option #%d                          | OneOf    | [🟢0x191CB]                       |
|     - Optimized Boot                             | OneOf    |                                   |
|     - New Boot Option Policy                     | OneOf    | [🟢0x19224]                       |
|     - <empty>:                                   | Ref      | [🟢0x19265]                       |
|       - Boot Option #%d                          | OneOf    | [🟢0x19288]                       |
|   - Save & Exit                                  | Ref      |                                   |
| - Main:                                          | Menu     |                                   |
|   - System Language                              | OneOf    | [🟢0x146B8]                       |
| - Advanced:                                      | Menu     |                                   |
|   - Trusted Computing:                           | Ref      | [🟢0x14738, 🟢0x14740]            |
|     -   Security Device Support                  | OneOf    | [🟢0x14959]                       |
|     -   TPM State                                | OneOf    | [🟢0x1498E]                       |
|     - Pending operation                          | OneOf    | [🟢0x149CD]                       |
|     -   Security Device Support                  | OneOf    | [🟢0x14A1E]                       |
|     -   TCM State                                | OneOf    | [🟢0x14A53]                       |
|     - Pending operation                          | OneOf    | [🟢0x14A92]                       |
|     -   Device Select                            | OneOf    | [🟢0x14AE3]                       |
|   - Trusted Computing:                           | Ref      | [🟢0x14738, 🟢0x14763]            |
|     -   Security Device Support                  | OneOf    |                                   |
|     -   SHA-1 PCR Bank                           | OneOf    | [🟢0x14CDA]                       |
|     -   SHA256 PCR Bank                          | OneOf    | [🟢0x14D1B]                       |
|     -   SHA384 PCR Bank                          | OneOf    | [🟢0x14D5C]                       |
|     -   SHA512 PCR Bank                          | OneOf    | [🟢0x14D9D]                       |
|     -   SM3_256 PCR Bank                         | OneOf    | [🟢0x14DDE]                       |
|     -   Pending operation                        | OneOf    | [🟢0x14E2A]                       |
|     -   Platform Hierarchy                       | OneOf    | [🟢0x14E2A]                       |
|     -   Storage Hierarchy                        | OneOf    | [🟢0x14E2A]                       |
|     -   Endorsement Hierarchy                    | OneOf    | [🟢0x14E2A]                       |
|     -   TPM 2.0 UEFI Spec Version                | OneOf    | [🟢0x14E2A]                       |
|     -   Physical Presence Spec Version           | OneOf    | [🟢0x14E2A]                       |
|     -   TPM 2.0 InterfaceType                    | OneOf    | [🟢0x14EFA]                       |
|     -   Device Select                            | OneOf    | [🟢0x14F2B]                       |
|     -   Disable Block Sid                        | OneOf    | [🟢0x14F5D]                       |
|   - Trusted Computing:                           | Ref      | [🟢0x14738, 🟢0x14786]            |
|     -   Security Device Support                  | OneOf    |                                   |
|     -   Disable Block Sid                        | OneOf    | [🟢0x14915]                       |
|   - ACPI Settings:                               | Ref      | [🔘0x147A1]                       |
|     - Enable ACPI Auto Configuration             | CheckBox |                                   |
|   - AST2500SEC Super IO Configuration:           | Ref      |                                   |
|     - Serial Port 1 Configuration:               | Ref      | [🟢0x15007]                       |
|       - Serial Port                              | CheckBox |                                   |
|       - Change Settings                          | OneOf    | [🟢0x1507E, 🟢0x15086]            |
|     - Serial Port 2 Configuration:               | Ref      | [🟢0x15020]                       |
|       - Serial Port                              | CheckBox |                                   |
|       - Change Settings                          | OneOf    | [🟢0x15122, 🟢0x1512A]            |
|   - NCT7802Y HW Monitor:                         | Ref      |                                   |
|     - NCT7802Y Smart Fan Configuration:          | Ref      |                                   |
|       - NCT7802Y Smart Fan1 Config               | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x152C4]                       |
|       - T1                                       | Numeric  | [🟢0x152EB]                       |
|       - F1                                       | Numeric  | [🟢0x15312]                       |
|       - T2                                       | Numeric  | [🟢0x15339]                       |
|       - F2                                       | Numeric  | [🟢0x15360]                       |
|       - T3                                       | Numeric  | [🟢0x15387]                       |
|       - F3                                       | Numeric  | [🟢0x153AE]                       |
|       - T4                                       | Numeric  | [🟢0x153D5]                       |
|       - F4                                       | Numeric  | [🟢0x153FC]                       |
|       - Critical Temperature                     | Numeric  | [🟢0x15423]                       |
|       - NCT7802Y Smart Fan2 Config               | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15474]                       |
|       - T1                                       | Numeric  | [🟢0x1549B]                       |
|       - F1                                       | Numeric  | [🟢0x154C2]                       |
|       - T2                                       | Numeric  | [🟢0x154E9]                       |
|       - F2                                       | Numeric  | [🟢0x15510]                       |
|       - T3                                       | Numeric  | [🟢0x15537]                       |
|       - F3                                       | Numeric  | [🟢0x1555E]                       |
|       - T4                                       | Numeric  | [🟢0x15585]                       |
|       - F4                                       | Numeric  | [🟢0x155AC]                       |
|       - Temp2 TRCritical                         | Numeric  | [🟢0x155D3]                       |
|       - NCT7802Y Smart Fan3 Config               | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15624]                       |
|       - T1                                       | Numeric  | [🟢0x1564B]                       |
|       - F1                                       | Numeric  | [🟢0x15672]                       |
|       - T2                                       | Numeric  | [🟢0x15699]                       |
|       - F2                                       | Numeric  | [🟢0x156C0]                       |
|       - T3                                       | Numeric  | [🟢0x156E7]                       |
|       - F3                                       | Numeric  | [🟢0x1570E]                       |
|       - T4                                       | Numeric  | [🟢0x15735]                       |
|       - F4                                       | Numeric  | [🟢0x1575C]                       |
|       - Temp3 TRCritical                         | Numeric  | [🟢0x15783]                       |
|   - NCT7802YSEC HW Monitor:                      | Ref      |                                   |
|     - NCT7802YSEC Smart Fan Configuration:       | Ref      |                                   |
|       - NCT7802YSEC Smart Fan4 Config            | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x158ED]                       |
|       - T1                                       | Numeric  | [🟢0x15914]                       |
|       - F1                                       | Numeric  | [🟢0x1593B]                       |
|       - T2                                       | Numeric  | [🟢0x15962]                       |
|       - F2                                       | Numeric  | [🟢0x15989]                       |
|       - T3                                       | Numeric  | [🟢0x159B0]                       |
|       - F3                                       | Numeric  | [🟢0x159D7]                       |
|       - T4                                       | Numeric  | [🟢0x159FE]                       |
|       - F4                                       | Numeric  | [🟢0x15A25]                       |
|       - Critical Temperature                     | Numeric  | [🟢0x15A4C]                       |
|       - NCT7802YSEC Smart Fan5 Config            | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15A9D]                       |
|       - T1                                       | Numeric  | [🟢0x15AC4]                       |
|       - F1                                       | Numeric  | [🟢0x15AEB]                       |
|       - T2                                       | Numeric  | [🟢0x15B12]                       |
|       - F2                                       | Numeric  | [🟢0x15B39]                       |
|       - T3                                       | Numeric  | [🟢0x15B60]                       |
|       - F3                                       | Numeric  | [🟢0x15B87]                       |
|       - T4                                       | Numeric  | [🟢0x15BAE]                       |
|       - F4                                       | Numeric  | [🟢0x15BD5]                       |
|       - Temp2 TRCritical                         | Numeric  | [🟢0x15BFC]                       |
|       - NCT7802YSEC Smart Fan6 Config            | OneOf    |                                   |
|       - PWM fan output in manual mode            | Numeric  | [🟢0x15C4D]                       |
|       - T1                                       | Numeric  | [🟢0x15C74]                       |
|       - F1                                       | Numeric  | [🟢0x15C9B]                       |
|       - T2                                       | Numeric  | [🟢0x15CC2]                       |
|       - F2                                       | Numeric  | [🟢0x15CE9]                       |
|       - T3                                       | Numeric  | [🟢0x15D10]                       |
|       - F3                                       | Numeric  | [🟢0x15D37]                       |
|       - T4                                       | Numeric  | [🟢0x15D5E]                       |
|       - F4                                       | Numeric  | [🟢0x15D85]                       |
|       - Temp3 TRCritical                         | Numeric  | [🟢0x15DAC]                       |
|   - F81803 Super IO Configuration:               | Ref      |                                   |
|     - Serial Port 1 Configuration:               | Ref      | [🟢0x15DF5]                       |
|       - Serial Port                              | CheckBox |                                   |
|       - Change Settings                          | OneOf    | [🟢0x15E5F]                       |
|       - Mode setting                             | OneOf    |                                   |
|       - Terminator                               | CheckBox | [🟢0x15EDA]                       |
|   - Hardware Monitor:                            | Ref      |                                   |
|     - Smart Fan Configuration:                   | Ref      |                                   |
|       - CPU1 Type                                | OneOf    |                                   |
|       - CPU1 Mode Select                         | OneOf    |                                   |
|       - CPU1 Temp Select                         | OneOf    | [🟢0x16024]                       |
|       - CPU1 Boundary 1 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Boundary 2 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Boundary 3 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Boundary 4 temperature              | Numeric  | [🟢0x16024]                       |
|       - CPU1 Highest Speed                       | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 1                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 2                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 3                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 Expect Speed 4                      | Numeric  | [🟢0x16024]                       |
|       - CPU1 RPM Speed                           | Numeric  | [🟢0x1613A, 🟢0x1614C]            |
|       - CPU1 duty cycle                          | Numeric  | [🟢0x1613A, 🟢0x16173]            |
|       - CPU2 Type                                | OneOf    |                                   |
|       - CPU2 Mode Select                         | OneOf    |                                   |
|       - CPU2 Temp Select                         | OneOf    | [🟢0x161F1]                       |
|       - CPU2 Boundary 1 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Boundary 2 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Boundary 3 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Boundary 4 temperature              | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Highest Speed                       | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 1                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 2                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 3                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 Expect Speed 4                      | Numeric  | [🟢0x161F1]                       |
|       - CPU2 RPM Speed                           | Numeric  | [🟢0x16307, 🟢0x16319]            |
|       - CPU2 duty cycle                          | Numeric  | [🟢0x16307, 🟢0x16340]            |
|     - Smart Fan Function                         | OneOf    |                                   |
|   - UEFI Variables Protection:                   | Ref      | [🔘0x14805]                       |
|     - Password protection of Runtime Variables   | OneOf    |                                   |
|   - Serial Port Console Redirection:             | Ref      |                                   |
|     - Console Redirection                        | CheckBox | [🟢0x163C6]                       |
|     - Console Redirection Settings:              | Ref      | [🟢0x163FB]                       |
|       - Terminal Type                            | OneOf    |                                   |
|       - Bits per second                          | OneOf    |                                   |
|       - Data Bits                                | OneOf    |                                   |
|       - Parity                                   | OneOf    |                                   |
|       - Stop Bits                                | OneOf    |                                   |
|       - Flow Control                             | OneOf    |                                   |
|       - VT-UTF8 Combo Key Support                | CheckBox |                                   |
|       - Recorder Mode                            | CheckBox |                                   |
|       - Resolution 100x31                        | CheckBox |                                   |
|       - Putty KeyPad                             | OneOf    |                                   |
|     - Legacy Console Redirection Settings:       | Ref      |                                   |
|       - Redirection COM Port                     | OneOf    |                                   |
|       - Resolution                               | OneOf    |                                   |
|       - Redirect After POST                      | OneOf    |                                   |
|       - Remote OS Install                        | CheckBox |                                   |
|     - Console Redirection EMS                    | CheckBox |                                   |
|     - Console Redirection Settings:              | Ref      |                                   |
|       - Out-of-Band Mgmt Port                    | OneOf    |                                   |
|       - Terminal Type EMS                        | OneOf    |                                   |
|       - Bits per second EMS                      | OneOf    |                                   |
|       - Flow Control EMS                         | OneOf    |                                   |
|   - SIO Common Setting:                          | Ref      | [🔘0x1482D]                       |
|     - Lock Legacy Resources                      | CheckBox |                                   |
|   - PCI Subsystem Settings:                      | Ref      |                                   |
|     - PCI Latency Timer                          | OneOf    | [🟢0x16DB4]                       |
|     - PCI-X Latency Timer                        | OneOf    | [🟢0x16E25]                       |
|     - VGA Palette Snoop                          | OneOf    | [🟢0x16E96]                       |
|     - PERR# Generation                           | OneOf    | [🟢0x16EE9]                       |
|     - SERR# Generation                           | OneOf    | [🟢0x16F3C]                       |
|     - Above 4G Decoding                          | OneOf    | [🟢0x16F8F]                       |
|     - SR-IOV Support                             | OneOf    | [🟢0x16FE2]                       |
|     - BME DMA Mitigation                         | OneOf    | [🟢0x17035]                       |
|     - Don't Reset VC-TC Mapping                  | OneOf    | [🟢0x17088]                       |
|     - PCI Express Settings:                      | Ref      | [🟢0x170E4, 🟢0x170FE]            |
|       - Relaxed Ordering                         | OneOf    |                                   |
|       - Extended Tag                             | OneOf    |                                   |
|       - No Snoop                                 | OneOf    |                                   |
|       - Maximum Payload                          | OneOf    |                                   |
|       - Maximum Read Request                     | OneOf    |                                   |
|       - ASPM Support                             | OneOf    |                                   |
|       - Extended Synch                           | OneOf    |                                   |
|       - Link Training Retry                      | OneOf    |                                   |
|       - Link Training Timeout (uS)               | Numeric  |                                   |
|       - Unpopulated Links                        | OneOf    |                                   |
|       - Restore PCIE Registers                   | OneOf    | [🟢0x17415]                       |
|     - PCI Express GEN 2 Settings:                | Ref      | [🟢0x1713E, 🟢0x17158]            |
|       - Completion Timeout                       | OneOf    |                                   |
|       - ARI Forwarding                           | OneOf    |                                   |
|       - AtomicOp Requester Enable                | OneOf    |                                   |
|       - AtomicOp Egress Blocking                 | OneOf    |                                   |
|       - IDO Request Enable                       | OneOf    |                                   |
|       - IDO Completion Enable                    | OneOf    |                                   |
|       - LTR Mechanism Enable                     | OneOf    |                                   |
|       - End-End TLP Prefix Blocking              | OneOf    |                                   |
|       - Target Link Speed                        | OneOf    |                                   |
|       - Clock Power Management                   | OneOf    |                                   |
|       - Compliance SOS                           | OneOf    |                                   |
|       - Hardware Autonomous Width                | OneOf    |                                   |
|       - Hardware Autonomous Speed                | OneOf    |                                   |
|   - USB Configuration:                           | Ref      |                                   |
|     - USB Support                                | OneOf    | [🟢0x177B2]                       |
|     - Legacy USB Support                         | OneOf    | [🟢0x177E7]                       |
|     - USB 2.0 Controller Mode                    | OneOf    | [🟢0x17823]                       |
|     - XHCI Legacy Support                        | OneOf    | [🟢0x17854]                       |
|     - XHCI Hand-off                              | OneOf    | [🟢0x17885]                       |
|     - EHCI Hand-off                              | OneOf    | [🟢0x178D0]                       |
|     - USB Mass Storage Driver Support            | OneOf    | [🟢0x1790F]                       |
|     - Port 60/64 Emulation                       | OneOf    | [🟢0x17966]                       |
|     - USB transfer time-out                      | OneOf    | [🟢0x179B8]                       |
|     - Device reset time-out                      | OneOf    | [🟢0x17A1D]                       |
|     - Device power-up delay                      | OneOf    |                                   |
|     - Device power-up delay in seconds           | Numeric  | [🟢0x17ACF]                       |
|     - N/A                                        | OneOf    | [🟢0x17B49]                       |
|     - N/A                                        | OneOf    | [🟢0x17BA7]                       |
|     - N/A                                        | OneOf    | [🟢0x17C05]                       |
|     - N/A                                        | OneOf    | [🟢0x17C63]                       |
|     - N/A                                        | OneOf    | [🟢0x17CC1]                       |
|     - N/A                                        | OneOf    | [🟢0x17D1F]                       |
|     - N/A                                        | OneOf    | [🟢0x17D7D]                       |
|     - N/A                                        | OneOf    | [🟢0x17DDB]                       |
|     - N/A                                        | OneOf    | [🟢0x17E39]                       |
|     - N/A                                        | OneOf    | [🟢0x17E97]                       |
|     - N/A                                        | OneOf    | [🟢0x17EF5]                       |
|     - N/A                                        | OneOf    | [🟢0x17F53]                       |
|     - N/A                                        | OneOf    | [🟢0x17FB1]                       |
|     - N/A                                        | OneOf    | [🟢0x1800F]                       |
|     - N/A                                        | OneOf    | [🟢0x1806D]                       |
|     - N/A                                        | OneOf    | [🟢0x180CB]                       |
|     - N/A                                        | OneOf    | [🟢0x18129]                       |
|     - N/A                                        | OneOf    | [🟢0x18187]                       |
|     - N/A                                        | OneOf    | [🟢0x181E5]                       |
|     - N/A                                        | OneOf    | [🟢0x18243]                       |
|     - N/A                                        | OneOf    | [🟢0x182A1]                       |
|     - N/A                                        | OneOf    | [🟢0x182FF]                       |
|     - N/A                                        | OneOf    | [🟢0x1835D]                       |
|     - N/A                                        | OneOf    | [🟢0x183BB]                       |
|     - N/A                                        | OneOf    | [🟢0x18419]                       |
|     - N/A                                        | OneOf    | [🟢0x18477]                       |
|     - N/A                                        | OneOf    | [🟢0x184D5]                       |
|     - N/A                                        | OneOf    | [🟢0x18533]                       |
|     - N/A                                        | OneOf    | [🟢0x18591]                       |
|     - N/A                                        | OneOf    | [🟢0x185EF]                       |
|     - N/A                                        | OneOf    | [🟢0x1864D]                       |
|     - N/A                                        | OneOf    | [🟢0x186AB]                       |
|   - Network Stack Configuration:                 | Ref      |                                   |
|     - Network Stack                              | OneOf    |                                   |
|     - IPv4 PXE Support                           | OneOf    | [🟢0x18767]                       |
|     - IPv4 HTTP Support                          | OneOf    | [🟢0x18767]                       |
|     - IPv6 PXE Support                           | OneOf    | [🟢0x187CB]                       |
|     - IPv6 HTTP Support                          | OneOf    | [🟢0x187CB]                       |
|     -  PXE LAN Port                              | OneOf    |                                   |
|     - PXE boot wait time                         | Numeric  | [🟢0x1885C]                       |
|     - Media detect count                         | Numeric  | [🟢0x18885]                       |
|   - CSM Configuration:                           | Ref      |                                   |
|     - CSM Support                                | OneOf    | [🟢0x188C8]                       |
|     - GateA20 Active                             | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Option ROM Messages                        | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x18940] |
|     - INT19 Trap Response                        | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Boot option filter                         | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Network                                    | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x189F2] |
|     -  PXE LAN Port                              | OneOf    | [🟢0x188C8, 🟢0x188FD, 🟢0x18A30] |
|     - Storage                                    | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Video                                      | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|     - Other PCI devices                          | OneOf    | [🟢0x188C8, 🟢0x188FD]            |
|   - NVMe Configuration                           | Ref      | [🟢0x14882]                       |
| - Security:                                      | Menu     |                                   |
|   - Secure Boot:                                 | Ref      | [🟢0x18D43]                       |
|     - Secure Boot                                | OneOf    |                                   |
|     - Secure Boot Mode                           | OneOf    |                                   |
| - Boot:                                          | Menu     |                                   |
|   - Setup Prompt Timeout                         | Numeric  |                                   |
|   - Bootup NumLock State                         | OneOf    |                                   |
|   - Quiet Boot                                   | CheckBox |                                   |
|   - Boot Option #%d                              | OneOf    | [🟢0x1916D]                       |
|   - Driver Option #%d                            | OneOf    | [🟢0x191CB]                       |
|   - Optimized Boot                               | OneOf    |                                   |
|   - New Boot Option Policy                       | OneOf    | [🟢0x19224]                       |
|   - <empty>:                                     | Ref      | [🟢0x19265]                       |
|     - Boot Option #%d                            | OneOf    | [🟢0x19288]                       |
| - Save & Exit                                    | Menu     |                                   |
```
