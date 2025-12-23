```
| Path                                                        | Type     | SuppressIf                        |
|-------------------------------------------------------------|----------|-----------------------------------|
| - Platform Configuration:                                   | Menu     |                                   |
|   - Fake Varstore Item                                      | OneOf    | [🟢0x1593C]                       |
|   - C002d                                                   | Numeric  |                                   |
|   - Platform Over Clocking Support                          | CheckBox | [🟢0x1597F]                       |
|   - Anti Flash Wearout Supported                            | CheckBox | [🟢0x159A1]                       |
|   - Bios Guard Supported                                    | CheckBox | [🟢0x159C3]                       |
|   - PCH Configuration:                                      | Ref      |                                   |
|     - Gbe Region Valid                                      | OneOf    | [🟢0x16790]                       |
|     - PCH Stepping                                          | Numeric  | [🟢0x16790]                       |
|     - PCH Devices:                                          | Ref      | [🟢0x167CA]                       |
|       - DeepSx Power Policies                               | OneOf    | [🟢0x168B9]                       |
|       - GP27 Wake From DeepSx                               | OneOf    | [🟢0x168F2]                       |
|       - Serial IRQ Mode                                     | OneOf    | [🟢0x1691D]                       |
|       - External SSC Enable - CK420                         | OneOf    | [🟢0x16948]                       |
|       - PCH state after G3                                  | OneOf    | [🟢0x16973]                       |
|       - Port 80h Redirection                                | OneOf    | [🟢0x169A5]                       |
|       - PCH Cross Throttling                                | OneOf    | [🟢0x169D0]                       |
|       - IO-APIC 24-119 RTE                                  | OneOf    | [🟢0x169FB]                       |
|       - Pcie Pll SSC                                        | OneOf    | [🟢0x16A26]                       |
|       - Pcie Pll SSC                                        | OneOf    | [🟢0x16A26]                       |
|     - PCI Express Configuration:                            | Ref      |                                   |
|       - PCI Delay Optimization                              | OneOf    | [🟢0x18A3D]                       |
|       - Compliance Test Mode                                | OneOf    | [🟢0x18A3D]                       |
|       - PCI-E ASPM Support (Global)                         | OneOf    |                                   |
|       - CTO for Uplink x16                                  | OneOf    | [🟢0x18AAA]                       |
|       - CTO for Uplink x8                                   | OneOf    | [🟢0x18AAA]                       |
|       - MPL for Uplink x16                                  | OneOf    | [🟢0x18AAA]                       |
|       - MPL for Uplink x8                                   | OneOf    | [🟢0x18AAA]                       |
|       - PCIE Clock Gating                                   | OneOf    | [🟢0x18AAA]                       |
|       - PCH DMI ASPM                                        | OneOf    | [🟢0x18AAA]                       |
|       - DMI Link Extended Synch Control                     | OneOf    | [🟢0x18AAA]                       |
|       - Stop and Scream                                     | OneOf    | [🟢0x18AAA, 🟢0x18BE6]            |
|       - Expanded SPI TPM Transaction Length Enable          | OneOf    | [🟢0x18AAA]                       |
|       - PCIE Port assigned to LAN                           | Numeric  | [🟢0x18AAA]                       |
|       - Subtractive Decode                                  | OneOf    |                                   |
|       -   Subtractive Decode Port#                          | Numeric  | [🟢0x18C84]                       |
|       - PCIe Root Port Function Swapping                    | OneOf    |                                   |
|       - Max Read Request Size                               | OneOf    | [🟢0x18CE1]                       |
|       - PCI Express Root Port 1:                            | Ref      | [🟢0x18D28, 🟢0x18D30]            |
|         - PCI Express Root Port 1                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x19659, 🟢0x19661]            |
|         - L1 Substates                                      | OneOf    | [🟢0x19659]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x19659]                       |
|         - ACS                                               | OneOf    | [🟢0x19659]                       |
|         -   URR                                             | OneOf    | [🟢0x19659]                       |
|         -   FER                                             | OneOf    | [🟢0x19659]                       |
|         -   NFER                                            | OneOf    | [🟢0x19659]                       |
|         -   CER                                             | OneOf    | [🟢0x19659]                       |
|         -   SEFE                                            | OneOf    | [🟢0x19659]                       |
|         -   SENFE                                           | OneOf    | [🟢0x19659]                       |
|         -   SECE                                            | OneOf    | [🟢0x19659]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x19659]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x19659]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x19659]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x19659]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x19659]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x19659]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x19659]                       |
|         - PCH PCIE1 LTR                                     | OneOf    | [🟢0x19659]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x19659, 🟢0x19952]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x19659, 🟢0x19952, 🟢0x19982] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x19659, 🟢0x19952, 🟢0x19982] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x19659, 🟢0x19952]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x19659, 🟢0x19952, 🟢0x19A19] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x19659, 🟢0x19952, 🟢0x19A19] |
|       - PCI Express Root Port 2:                            | Ref      | [🟢0x18D28, 🟢0x18D49]            |
|         - PCI Express Root Port 2                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x19AA4, 🟢0x19AAC]            |
|         - L1 Substates                                      | OneOf    | [🟢0x19AA4]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x19AA4]                       |
|         - ACS                                               | OneOf    | [🟢0x19AA4]                       |
|         -   URR                                             | OneOf    | [🟢0x19AA4]                       |
|         -   FER                                             | OneOf    | [🟢0x19AA4]                       |
|         -   NFER                                            | OneOf    | [🟢0x19AA4]                       |
|         -   CER                                             | OneOf    | [🟢0x19AA4]                       |
|         -   SEFE                                            | OneOf    | [🟢0x19AA4]                       |
|         -   SENFE                                           | OneOf    | [🟢0x19AA4]                       |
|         -   SECE                                            | OneOf    | [🟢0x19AA4]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x19AA4]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x19AA4]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x19AA4]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x19AA4]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x19AA4]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x19AA4]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x19AA4]                       |
|         - PCH PCIE2 LTR                                     | OneOf    | [🟢0x19AA4]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x19AA4, 🟢0x19D9D]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x19AA4, 🟢0x19D9D, 🟢0x19DCD] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x19AA4, 🟢0x19D9D, 🟢0x19DCD] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x19AA4, 🟢0x19D9D]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x19AA4, 🟢0x19D9D, 🟢0x19E64] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x19AA4, 🟢0x19D9D, 🟢0x19E64] |
|       - PCI Express Root Port 3:                            | Ref      | [🟢0x18D28, 🟢0x18D6E]            |
|         - PCI Express Root Port 3                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x19EEF, 🟢0x19EF7]            |
|         - L1 Substates                                      | OneOf    | [🟢0x19EEF]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x19EEF]                       |
|         - ACS                                               | OneOf    | [🟢0x19EEF]                       |
|         -   URR                                             | OneOf    | [🟢0x19EEF]                       |
|         -   FER                                             | OneOf    | [🟢0x19EEF]                       |
|         -   NFER                                            | OneOf    | [🟢0x19EEF]                       |
|         -   CER                                             | OneOf    | [🟢0x19EEF]                       |
|         -   SEFE                                            | OneOf    | [🟢0x19EEF]                       |
|         -   SENFE                                           | OneOf    | [🟢0x19EEF]                       |
|         -   SECE                                            | OneOf    | [🟢0x19EEF]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x19EEF]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x19EEF]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x19EEF]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x19EEF]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x19EEF]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x19EEF]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x19EEF]                       |
|         - PCH PCIE3 LTR                                     | OneOf    | [🟢0x19EEF]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x19EEF, 🟢0x1A1E8]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x19EEF, 🟢0x1A1E8, 🟢0x1A218] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x19EEF, 🟢0x1A1E8, 🟢0x1A218] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x19EEF, 🟢0x1A1E8]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x19EEF, 🟢0x1A1E8, 🟢0x1A2AF] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x19EEF, 🟢0x1A1E8, 🟢0x1A2AF] |
|       - PCI Express Root Port 4:                            | Ref      | [🟢0x18D28, 🟢0x18D91]            |
|         - PCI Express Root Port 4                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1A33A, 🟢0x1A342]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1A33A]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1A33A]                       |
|         - ACS                                               | OneOf    | [🟢0x1A33A]                       |
|         -   URR                                             | OneOf    | [🟢0x1A33A]                       |
|         -   FER                                             | OneOf    | [🟢0x1A33A]                       |
|         -   NFER                                            | OneOf    | [🟢0x1A33A]                       |
|         -   CER                                             | OneOf    | [🟢0x1A33A]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1A33A]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1A33A]                       |
|         -   SECE                                            | OneOf    | [🟢0x1A33A]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1A33A]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1A33A]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1A33A]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1A33A]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1A33A]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1A33A]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1A33A]                       |
|         - PCH PCIE4 LTR                                     | OneOf    | [🟢0x1A33A]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1A33A, 🟢0x1A633]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1A33A, 🟢0x1A633, 🟢0x1A663] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1A33A, 🟢0x1A633, 🟢0x1A663] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1A33A, 🟢0x1A633]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1A33A, 🟢0x1A633, 🟢0x1A6FA] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1A33A, 🟢0x1A633, 🟢0x1A6FA] |
|       - PCI Express Root Port 5:                            | Ref      | [🟢0x18DBE]                       |
|         - PCI Express Root Port 5                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1A785, 🟢0x1A78D]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1A785]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1A785]                       |
|         - ACS                                               | OneOf    | [🟢0x1A785]                       |
|         -   URR                                             | OneOf    | [🟢0x1A785]                       |
|         -   FER                                             | OneOf    | [🟢0x1A785]                       |
|         -   NFER                                            | OneOf    | [🟢0x1A785]                       |
|         -   CER                                             | OneOf    | [🟢0x1A785]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1A785]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1A785]                       |
|         -   SECE                                            | OneOf    | [🟢0x1A785]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1A785]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1A785]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1A785]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1A785]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1A785]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1A785]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1A785]                       |
|         - PCH PCIE5 LTR                                     | OneOf    | [🟢0x1A785]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1A785, 🟢0x1AA7E]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1A785, 🟢0x1AA7E, 🟢0x1AAAE] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1A785, 🟢0x1AA7E, 🟢0x1AAAE] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1A785, 🟢0x1AA7E]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1A785, 🟢0x1AA7E, 🟢0x1AB45] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1A785, 🟢0x1AA7E, 🟢0x1AB45] |
|       - PCI Express Root Port 6:                            | Ref      | [🟢0x18DD7, 🟢0x18DDF]            |
|         - PCI Express Root Port 6                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1ABD0, 🟢0x1ABD8]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1ABD0]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1ABD0]                       |
|         - ACS                                               | OneOf    | [🟢0x1ABD0]                       |
|         -   URR                                             | OneOf    | [🟢0x1ABD0]                       |
|         -   FER                                             | OneOf    | [🟢0x1ABD0]                       |
|         -   NFER                                            | OneOf    | [🟢0x1ABD0]                       |
|         -   CER                                             | OneOf    | [🟢0x1ABD0]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1ABD0]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1ABD0]                       |
|         -   SECE                                            | OneOf    | [🟢0x1ABD0]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1ABD0]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1ABD0]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1ABD0]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1ABD0]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1ABD0]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1ABD0]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1ABD0]                       |
|         - PCH PCIE6 LTR                                     | OneOf    | [🟢0x1ABD0]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1ABD0, 🟢0x1AEC9]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1ABD0, 🟢0x1AEC9, 🟢0x1AEF9] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1ABD0, 🟢0x1AEC9, 🟢0x1AEF9] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1ABD0, 🟢0x1AEC9]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1ABD0, 🟢0x1AEC9, 🟢0x1AF90] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1ABD0, 🟢0x1AEC9, 🟢0x1AF90] |
|       - PCI Express Root Port 7:                            | Ref      | [🟢0x18DD7, 🟢0x18E04]            |
|         - PCI Express Root Port 7                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1B01B, 🟢0x1B023]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1B01B]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1B01B]                       |
|         - ACS                                               | OneOf    | [🟢0x1B01B]                       |
|         -   URR                                             | OneOf    | [🟢0x1B01B]                       |
|         -   FER                                             | OneOf    | [🟢0x1B01B]                       |
|         -   NFER                                            | OneOf    | [🟢0x1B01B]                       |
|         -   CER                                             | OneOf    | [🟢0x1B01B]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1B01B]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1B01B]                       |
|         -   SECE                                            | OneOf    | [🟢0x1B01B]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1B01B]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1B01B]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1B01B]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1B01B]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1B01B]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1B01B]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1B01B]                       |
|         - PCH PCIE7 LTR                                     | OneOf    | [🟢0x1B01B]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1B01B, 🟢0x1B314]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1B01B, 🟢0x1B314, 🟢0x1B344] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1B01B, 🟢0x1B314, 🟢0x1B344] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1B01B, 🟢0x1B314]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1B01B, 🟢0x1B314, 🟢0x1B3DB] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1B01B, 🟢0x1B314, 🟢0x1B3DB] |
|       - PCI Express Root Port 8:                            | Ref      | [🟢0x18DD7, 🟢0x18E27]            |
|         - PCI Express Root Port 8                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1B466, 🟢0x1B46E]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1B466]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1B466]                       |
|         - ACS                                               | OneOf    | [🟢0x1B466]                       |
|         -   URR                                             | OneOf    | [🟢0x1B466]                       |
|         -   FER                                             | OneOf    | [🟢0x1B466]                       |
|         -   NFER                                            | OneOf    | [🟢0x1B466]                       |
|         -   CER                                             | OneOf    | [🟢0x1B466]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1B466]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1B466]                       |
|         -   SECE                                            | OneOf    | [🟢0x1B466]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1B466]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1B466]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1B466]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1B466]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1B466]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1B466]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1B466]                       |
|         - PCH PCIE8 LTR                                     | OneOf    | [🟢0x1B466]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1B466, 🟢0x1B75F]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1B466, 🟢0x1B75F, 🟢0x1B78F] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1B466, 🟢0x1B75F, 🟢0x1B78F] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1B466, 🟢0x1B75F]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1B466, 🟢0x1B75F, 🟢0x1B826] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1B466, 🟢0x1B75F, 🟢0x1B826] |
|       - PCI Express Root Port 9:                            | Ref      | [🟢0x18DD7, 🟢0x18E52]            |
|         - PCI Express Root Port 9                           | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1B8B1, 🟢0x1B8B9]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1B8B1]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1B8B1]                       |
|         - ACS                                               | OneOf    | [🟢0x1B8B1]                       |
|         -   URR                                             | OneOf    | [🟢0x1B8B1]                       |
|         -   FER                                             | OneOf    | [🟢0x1B8B1]                       |
|         -   NFER                                            | OneOf    | [🟢0x1B8B1]                       |
|         -   CER                                             | OneOf    | [🟢0x1B8B1]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1B8B1]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1B8B1]                       |
|         -   SECE                                            | OneOf    | [🟢0x1B8B1]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1B8B1]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1B8B1]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1B8B1]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1B8B1]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1B8B1]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1B8B1]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1B8B1]                       |
|         - PCH PCIE9 LTR                                     | OneOf    | [🟢0x1B8B1]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1B8B1, 🟢0x1BBAA]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1B8B1, 🟢0x1BBAA, 🟢0x1BBDA] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1B8B1, 🟢0x1BBAA, 🟢0x1BBDA] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1B8B1, 🟢0x1BBAA]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1B8B1, 🟢0x1BBAA, 🟢0x1BC71] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1B8B1, 🟢0x1BBAA, 🟢0x1BC71] |
|       - PCI Express Root Port 10:                           | Ref      | [🟢0x18DD7, 🟢0x18E6B]            |
|         - PCI Express Root Port 10                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1BCFC, 🟢0x1BD04]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1BCFC]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1BCFC]                       |
|         - ACS                                               | OneOf    | [🟢0x1BCFC]                       |
|         -   URR                                             | OneOf    | [🟢0x1BCFC]                       |
|         -   FER                                             | OneOf    | [🟢0x1BCFC]                       |
|         -   NFER                                            | OneOf    | [🟢0x1BCFC]                       |
|         -   CER                                             | OneOf    | [🟢0x1BCFC]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1BCFC]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1BCFC]                       |
|         -   SECE                                            | OneOf    | [🟢0x1BCFC]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1BCFC]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1BCFC]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1BCFC]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1BCFC]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1BCFC]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1BCFC]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1BCFC]                       |
|         - PCH PCIE10 LTR                                    | OneOf    | [🟢0x1BCFC]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1BCFC, 🟢0x1BFF5]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1BCFC, 🟢0x1BFF5, 🟢0x1C025] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1BCFC, 🟢0x1BFF5, 🟢0x1C025] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1BCFC, 🟢0x1BFF5]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1BCFC, 🟢0x1BFF5, 🟢0x1C0BC] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1BCFC, 🟢0x1BFF5, 🟢0x1C0BC] |
|       - PCI Express Root Port 11:                           | Ref      | [🟢0x18DD7, 🟢0x18E90]            |
|         - PCI Express Root Port 11                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1C147, 🟢0x1C14F]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1C147]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1C147]                       |
|         - ACS                                               | OneOf    | [🟢0x1C147]                       |
|         -   URR                                             | OneOf    | [🟢0x1C147]                       |
|         -   FER                                             | OneOf    | [🟢0x1C147]                       |
|         -   NFER                                            | OneOf    | [🟢0x1C147]                       |
|         -   CER                                             | OneOf    | [🟢0x1C147]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1C147]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1C147]                       |
|         -   SECE                                            | OneOf    | [🟢0x1C147]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1C147]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1C147]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1C147]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1C147]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1C147]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1C147]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1C147]                       |
|         - PCH PCIE11 LTR                                    | OneOf    | [🟢0x1C147]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1C147, 🟢0x1C440]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1C147, 🟢0x1C440, 🟢0x1C470] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1C147, 🟢0x1C440, 🟢0x1C470] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1C147, 🟢0x1C440]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1C147, 🟢0x1C440, 🟢0x1C507] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1C147, 🟢0x1C440, 🟢0x1C507] |
|       - PCI Express Root Port 12:                           | Ref      | [🟢0x18DD7, 🟢0x18EB3]            |
|         - PCI Express Root Port 12                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1C592, 🟢0x1C59A]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1C592]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1C592]                       |
|         - ACS                                               | OneOf    | [🟢0x1C592]                       |
|         -   URR                                             | OneOf    | [🟢0x1C592]                       |
|         -   FER                                             | OneOf    | [🟢0x1C592]                       |
|         -   NFER                                            | OneOf    | [🟢0x1C592]                       |
|         -   CER                                             | OneOf    | [🟢0x1C592]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1C592]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1C592]                       |
|         -   SECE                                            | OneOf    | [🟢0x1C592]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1C592]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1C592]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1C592]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1C592]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1C592]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1C592]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1C592]                       |
|         - PCH PCIE12 LTR                                    | OneOf    | [🟢0x1C592]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1C592, 🟢0x1C88B]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1C592, 🟢0x1C88B, 🟢0x1C8BB] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1C592, 🟢0x1C88B, 🟢0x1C8BB] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1C592, 🟢0x1C88B]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1C592, 🟢0x1C88B, 🟢0x1C952] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1C592, 🟢0x1C88B, 🟢0x1C952] |
|       - PCI Express Root Port 13:                           | Ref      | [🟢0x18DD7, 🟢0x18EDE]            |
|         - PCI Express Root Port 13                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1C9DD, 🟢0x1C9E5]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1C9DD]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1C9DD]                       |
|         - ACS                                               | OneOf    | [🟢0x1C9DD]                       |
|         -   URR                                             | OneOf    | [🟢0x1C9DD]                       |
|         -   FER                                             | OneOf    | [🟢0x1C9DD]                       |
|         -   NFER                                            | OneOf    | [🟢0x1C9DD]                       |
|         -   CER                                             | OneOf    | [🟢0x1C9DD]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1C9DD]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1C9DD]                       |
|         -   SECE                                            | OneOf    | [🟢0x1C9DD]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1C9DD]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1C9DD]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1C9DD]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1C9DD]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1C9DD]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1C9DD]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1C9DD]                       |
|         - PCH PCIE13 LTR                                    | OneOf    | [🟢0x1C9DD]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1C9DD, 🟢0x1CCD6]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1C9DD, 🟢0x1CCD6, 🟢0x1CD06] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1C9DD, 🟢0x1CCD6, 🟢0x1CD06] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1C9DD, 🟢0x1CCD6]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1C9DD, 🟢0x1CCD6, 🟢0x1CD9D] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1C9DD, 🟢0x1CCD6, 🟢0x1CD9D] |
|       - PCI Express Root Port 14:                           | Ref      | [🟢0x18DD7, 🟢0x18EF7]            |
|         - PCI Express Root Port 14                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1CE28, 🟢0x1CE30]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1CE28]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1CE28]                       |
|         - ACS                                               | OneOf    | [🟢0x1CE28]                       |
|         -   URR                                             | OneOf    | [🟢0x1CE28]                       |
|         -   FER                                             | OneOf    | [🟢0x1CE28]                       |
|         -   NFER                                            | OneOf    | [🟢0x1CE28]                       |
|         -   CER                                             | OneOf    | [🟢0x1CE28]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1CE28]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1CE28]                       |
|         -   SECE                                            | OneOf    | [🟢0x1CE28]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1CE28]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1CE28]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1CE28]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1CE28]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1CE28]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1CE28]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1CE28]                       |
|         - PCH PCIE14 LTR                                    | OneOf    | [🟢0x1CE28]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1CE28, 🟢0x1D121]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1CE28, 🟢0x1D121, 🟢0x1D151] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1CE28, 🟢0x1D121, 🟢0x1D151] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1CE28, 🟢0x1D121]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1CE28, 🟢0x1D121, 🟢0x1D1E8] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1CE28, 🟢0x1D121, 🟢0x1D1E8] |
|       - PCI Express Root Port 15:                           | Ref      | [🟢0x18DD7, 🟢0x18F1C]            |
|         - PCI Express Root Port 15                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1D273, 🟢0x1D27B]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1D273]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1D273]                       |
|         - ACS                                               | OneOf    | [🟢0x1D273]                       |
|         -   URR                                             | OneOf    | [🟢0x1D273]                       |
|         -   FER                                             | OneOf    | [🟢0x1D273]                       |
|         -   NFER                                            | OneOf    | [🟢0x1D273]                       |
|         -   CER                                             | OneOf    | [🟢0x1D273]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1D273]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1D273]                       |
|         -   SECE                                            | OneOf    | [🟢0x1D273]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1D273]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1D273]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1D273]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1D273]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1D273]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1D273]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1D273]                       |
|         - PCH PCIE15 LTR                                    | OneOf    | [🟢0x1D273]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1D273, 🟢0x1D56C]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1D273, 🟢0x1D56C, 🟢0x1D59C] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1D273, 🟢0x1D56C, 🟢0x1D59C] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1D273, 🟢0x1D56C]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1D273, 🟢0x1D56C, 🟢0x1D633] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1D273, 🟢0x1D56C, 🟢0x1D633] |
|       - PCI Express Root Port 16:                           | Ref      | [🟢0x18DD7, 🟢0x18F3F]            |
|         - PCI Express Root Port 16                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1D6BE, 🟢0x1D6C6]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1D6BE]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1D6BE]                       |
|         - ACS                                               | OneOf    | [🟢0x1D6BE]                       |
|         -   URR                                             | OneOf    | [🟢0x1D6BE]                       |
|         -   FER                                             | OneOf    | [🟢0x1D6BE]                       |
|         -   NFER                                            | OneOf    | [🟢0x1D6BE]                       |
|         -   CER                                             | OneOf    | [🟢0x1D6BE]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1D6BE]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1D6BE]                       |
|         -   SECE                                            | OneOf    | [🟢0x1D6BE]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1D6BE]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1D6BE]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1D6BE]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1D6BE]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1D6BE]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1D6BE]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1D6BE]                       |
|         - PCH PCIE16 LTR                                    | OneOf    | [🟢0x1D6BE]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1D6BE, 🟢0x1D9B7]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1D6BE, 🟢0x1D9B7, 🟢0x1D9E7] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1D6BE, 🟢0x1D9B7, 🟢0x1D9E7] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1D6BE, 🟢0x1D9B7]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1D6BE, 🟢0x1D9B7, 🟢0x1DA7E] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1D6BE, 🟢0x1D9B7, 🟢0x1DA7E] |
|       - PCI Express Root Port 17:                           | Ref      | [🟢0x18DD7, 🟢0x18F6A]            |
|         - PCI Express Root Port 17                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1DB09, 🟢0x1DB11]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1DB09]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1DB09]                       |
|         - ACS                                               | OneOf    | [🟢0x1DB09]                       |
|         -   URR                                             | OneOf    | [🟢0x1DB09]                       |
|         -   FER                                             | OneOf    | [🟢0x1DB09]                       |
|         -   NFER                                            | OneOf    | [🟢0x1DB09]                       |
|         -   CER                                             | OneOf    | [🟢0x1DB09]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1DB09]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1DB09]                       |
|         -   SECE                                            | OneOf    | [🟢0x1DB09]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1DB09]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1DB09]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1DB09]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1DB09]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1DB09]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1DB09]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1DB09]                       |
|         - PCH PCIE17 LTR                                    | OneOf    | [🟢0x1DB09]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1DB09, 🟢0x1DE02]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1DB09, 🟢0x1DE02, 🟢0x1DE32] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1DB09, 🟢0x1DE02, 🟢0x1DE32] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1DB09, 🟢0x1DE02]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1DB09, 🟢0x1DE02, 🟢0x1DEC9] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1DB09, 🟢0x1DE02, 🟢0x1DEC9] |
|       - PCI Express Root Port 18:                           | Ref      | [🟢0x18DD7, 🟢0x18F83]            |
|         - PCI Express Root Port 18                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1DF54, 🟢0x1DF5C]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1DF54]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1DF54]                       |
|         - ACS                                               | OneOf    | [🟢0x1DF54]                       |
|         -   URR                                             | OneOf    | [🟢0x1DF54]                       |
|         -   FER                                             | OneOf    | [🟢0x1DF54]                       |
|         -   NFER                                            | OneOf    | [🟢0x1DF54]                       |
|         -   CER                                             | OneOf    | [🟢0x1DF54]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1DF54]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1DF54]                       |
|         -   SECE                                            | OneOf    | [🟢0x1DF54]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1DF54]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1DF54]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1DF54]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1DF54]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1DF54]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1DF54]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1DF54]                       |
|         - PCH PCIE18 LTR                                    | OneOf    | [🟢0x1DF54]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1DF54, 🟢0x1E24D]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1DF54, 🟢0x1E24D, 🟢0x1E27D] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1DF54, 🟢0x1E24D, 🟢0x1E27D] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1DF54, 🟢0x1E24D]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1DF54, 🟢0x1E24D, 🟢0x1E314] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1DF54, 🟢0x1E24D, 🟢0x1E314] |
|       - PCI Express Root Port 19:                           | Ref      | [🟢0x18DD7, 🟢0x18FA8]            |
|         - PCI Express Root Port 19                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1E39F, 🟢0x1E3A7]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1E39F]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1E39F]                       |
|         - ACS                                               | OneOf    | [🟢0x1E39F]                       |
|         -   URR                                             | OneOf    | [🟢0x1E39F]                       |
|         -   FER                                             | OneOf    | [🟢0x1E39F]                       |
|         -   NFER                                            | OneOf    | [🟢0x1E39F]                       |
|         -   CER                                             | OneOf    | [🟢0x1E39F]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1E39F]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1E39F]                       |
|         -   SECE                                            | OneOf    | [🟢0x1E39F]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1E39F]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1E39F]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1E39F]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1E39F]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1E39F]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1E39F]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1E39F]                       |
|         - PCH PCIE19 LTR                                    | OneOf    | [🟢0x1E39F]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1E39F, 🟢0x1E698]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1E39F, 🟢0x1E698, 🟢0x1E6C8] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1E39F, 🟢0x1E698, 🟢0x1E6C8] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1E39F, 🟢0x1E698]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1E39F, 🟢0x1E698, 🟢0x1E75F] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1E39F, 🟢0x1E698, 🟢0x1E75F] |
|       - PCI Express Root Port 20:                           | Ref      | [🟢0x18DD7, 🟢0x18FCB]            |
|         - PCI Express Root Port 20                          | CheckBox |                                   |
|         - PCIE ASPM                                         | OneOf    | [🟢0x1E7EA, 🟢0x1E7F2]            |
|         - L1 Substates                                      | OneOf    | [🟢0x1E7EA]                       |
|         - Gen3 Eq Phase3 Method                             | OneOf    | [🟢0x1E7EA]                       |
|         - ACS                                               | OneOf    | [🟢0x1E7EA]                       |
|         -   URR                                             | OneOf    | [🟢0x1E7EA]                       |
|         -   FER                                             | OneOf    | [🟢0x1E7EA]                       |
|         -   NFER                                            | OneOf    | [🟢0x1E7EA]                       |
|         -   CER                                             | OneOf    | [🟢0x1E7EA]                       |
|         -   SEFE                                            | OneOf    | [🟢0x1E7EA]                       |
|         -   SENFE                                           | OneOf    | [🟢0x1E7EA]                       |
|         -   SECE                                            | OneOf    | [🟢0x1E7EA]                       |
|         -   PME SCI                                         | OneOf    | [🟢0x1E7EA]                       |
|         -   Hot Plug                                        | OneOf    | [🟢0x1E7EA]                       |
|         -   Advanced Error Reporting                        | OneOf    | [🟢0x1E7EA]                       |
|         - PCIe Speed                                        | OneOf    | [🟢0x1E7EA]                       |
|         - PCIE Lane Topology                                | OneOf    | [🟢0x1E7EA]                       |
|         - Max Payload Size                                  | OneOf    | [🟢0x1E7EA]                       |
|         - Compl. Timeout                                    | OneOf    | [🟢0x1E7EA]                       |
|         - PCH PCIE20 LTR                                    | OneOf    | [🟢0x1E7EA]                       |
|         -   Snoop Latency Override                          | OneOf    | [🟢0x1E7EA, 🟢0x1EAE3]            |
|         -     Snoop Latency Value                           | Numeric  | [🟢0x1E7EA, 🟢0x1EAE3, 🟢0x1EB13] |
|         -     Snoop Latency Multiplier                      | OneOf    | [🟢0x1E7EA, 🟢0x1EAE3, 🟢0x1EB13] |
|         -   Non Snoop Latency Override                      | OneOf    | [🟢0x1E7EA, 🟢0x1EAE3]            |
|         -     Non Snoop Latency Value                       | Numeric  | [🟢0x1E7EA, 🟢0x1EAE3, 🟢0x1EBAA] |
|         -     Non Snoop Latency Multiplier                  | OneOf    | [🟢0x1E7EA, 🟢0x1EAE3, 🟢0x1EBAA] |
|     - PCH SATA Configuration:                               | Ref      |                                   |
|       - SATA Controller                                     | OneOf    |                                   |
|       - Configure SATA as                                   | OneOf    | [🟢0x17240]                       |
|       - SATA test mode                                      | OneOf    | [🟢0x17240, 🟢0x17269]            |
|       - SATA RSTe Boot Info                                 | OneOf    | [🟢0x17296, 🟢0x1729E]            |
|       - SATA Mode options:                                  | Ref      | [🟢0x172CF]                       |
|         - SATA HDD Unlock                                   | OneOf    |                                   |
|         - SATA Led locate                                   | OneOf    |                                   |
|         - RAID 0                                            | OneOf    | [🟢0x17FAA]                       |
|         - RAID 1                                            | OneOf    | [🟢0x17FAA]                       |
|         - RAID 10                                           | OneOf    | [🟢0x17FAA]                       |
|         - RAID 5                                            | OneOf    | [🟢0x17FAA]                       |
|         - Intel Rapid Recovery Technology                   | OneOf    | [🟢0x17FAA]                       |
|         - RAID Option ROM  UI banner                        | OneOf    | [🟢0x17FAA]                       |
|         - IRRT Only on ESATA                                | OneOf    | [🟢0x17FAA]                       |
|         - Smart Response Technology                         | OneOf    | [🟢0x17FAA]                       |
|         - RAID OROM prompt delay                            | OneOf    | [🟢0x17FAA]                       |
|       - Support Aggressive Link Power Management            | OneOf    | [🟢0x172CF]                       |
|       - Alternate Device ID on RAID                         | OneOf    | [🟢0x17309]                       |
|       - Load EFI Driver for RAID                            | OneOf    | [🟢0x17309]                       |
|       - NVRAM CYCLE ROUTER 0 ENABLE                         | OneOf    | [🟢0x17359]                       |
|       - NVRAM CR0 PCIE Root Port Number                     | OneOf    | [🟢0x17359]                       |
|       - NVRAM CYCLE ROUTER 1 ENABLE                         | OneOf    | [🟢0x1742A]                       |
|       - NVRAM CR1 PCIE Root Port Number                     | OneOf    | [🟢0x1742A]                       |
|       - NVRAM CYCLE ROUTER 2 ENABLE                         | OneOf    | [🟢0x174FB]                       |
|       - NVRAM CR2 PCIE Root Port Number                     | OneOf    | [🟢0x174FB]                       |
|       -   Port 1                                            | OneOf    | [🟢0x175E5]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    | [🟢0x17633]                       |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x17633]                       |
|       -   Spin Up Device                                    | OneOf    | [🟢0x17633]                       |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    | [🟢0x176C1]                       |
|       -   Port 2                                            | OneOf    | [🟢0x17711]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    | [🟢0x1775F]                       |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x1775F]                       |
|       -   Spin Up Device                                    | OneOf    | [🟢0x1775F]                       |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    | [🟢0x177ED]                       |
|       -   Port 3                                            | OneOf    | [🟢0x1783D]                       |
|       - SATA Port 2 DevSlp                                  | OneOf    | [🟢0x1783D, 🟢0x17868]            |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    | [🟢0x178B6]                       |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x178B6]                       |
|       -   Spin Up Device                                    | OneOf    | [🟢0x178B6]                       |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    | [🟢0x17944]                       |
|       -   Port 4                                            | OneOf    | [🟢0x17994]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    | [🟢0x179E2]                       |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x179E2]                       |
|       -   Spin Up Device                                    | OneOf    | [🟢0x179E2]                       |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    | [🟢0x17A70]                       |
|       -   Port 5                                            | OneOf    | [🟢0x17AC0]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    | [🟢0x17B0E]                       |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x17B0E]                       |
|       -   Spin Up Device                                    | OneOf    | [🟢0x17B0E]                       |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    | [🟢0x17B9C]                       |
|       -   Port 6                                            | OneOf    | [🟢0x17BEC]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x17C3A]                       |
|       -   Configure as eSATA                                | OneOf    | [🟢0x17C3A]                       |
|       -   Spin Up Device                                    | OneOf    | [🟢0x17C3A]                       |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    | [🟢0x17CC8]                       |
|       -   Port 7                                            | OneOf    | [🟢0x17D18]                       |
|       -   Hot Plug                                          | OneOf    | [🟢0x17D45]                       |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x17D70]                       |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|       -   Port 8                                            | OneOf    | [🟢0x17E44]                       |
|       -   Hot Plug                                          | OneOf    | [🟢0x17E71]                       |
|       -   Mechanical Presence Switch                        | OneOf    | [🟢0x17E9C]                       |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   SATA Device Type                                  | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|     - PCH sSATA Configuration:                              | Ref      | [🟢0x16801]                       |
|       - sSATA Controller                                    | OneOf    |                                   |
|       - Configure sSATA as                                  | OneOf    | [🟢0x18133]                       |
|       - SATA test mode                                      | OneOf    | [🟢0x18133]                       |
|       - sSATA RSTe Boot Info                                | OneOf    | [🟢0x1817F, 🟢0x18187]            |
|       - SATA Mode options:                                  | Ref      |                                   |
|         - SATA HDD Unlock                                   | OneOf    |                                   |
|         - SATA Led locate                                   | OneOf    |                                   |
|         - RAID 0                                            | OneOf    | [🟢0x18839]                       |
|         - RAID 1                                            | OneOf    | [🟢0x18839]                       |
|         - RAID 10                                           | OneOf    | [🟢0x18839]                       |
|         - RAID 5                                            | OneOf    | [🟢0x18839]                       |
|         - Intel Rapid Recovery Technology                   | OneOf    | [🟢0x18839]                       |
|         - RAID Option ROM  UI banner                        | OneOf    | [🟢0x18839]                       |
|         - IRRT Only on ESATA                                | OneOf    | [🟢0x18839]                       |
|         - Smart Response Technology                         | OneOf    | [🟢0x18839]                       |
|         - RAID OROM prompt delay                            | OneOf    | [🟢0x18839]                       |
|       - Support Aggressive Link Power Management            | OneOf    |                                   |
|       - Alternate Device ID on RAID                         | OneOf    | [🟢0x181E8]                       |
|       - Load EFI Driver for RAID                            | OneOf    | [🟢0x181E8]                       |
|       -   Port 1                                            | OneOf    | [🟢0x18249]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   sSATA Device Type                                 | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|       -   Port 2                                            | OneOf    | [🟢0x18338]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   sSATA Device Type                                 | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|       -   Port 3                                            | OneOf    | [🟢0x18427]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   sSATA Device Type                                 | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|       -   Port 4                                            | OneOf    | [🟢0x18516]                       |
|       -   Hot Plug                                          | OneOf    |                                   |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   sSATA Device Type                                 | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|       -   Port 5                                            | OneOf    | [🟢0x18605]                       |
|       -   Hot Plug                                          | OneOf    | [🟢0x18632]                       |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   sSATA Device Type                                 | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|       -   Port 6                                            | OneOf    | [🟢0x186FE]                       |
|       -   Hot Plug                                          | OneOf    | [🟢0x1872B]                       |
|       -   Configure as eSATA                                | OneOf    |                                   |
|       -   Spin Up Device                                    | OneOf    |                                   |
|       -   sSATA Device Type                                 | OneOf    |                                   |
|       - SATA Topology                                       | OneOf    |                                   |
|     - USB Configuration:                                    | Ref      | [🟢0x1681A]                       |
|       - USB Precondition                                    | OneOf    | [🟢0x16B35]                       |
|       - XHCI Manual Mode                                    | OneOf    | [🟢0x16B35]                       |
|       - Trunk Clock Gating (BTCG)                           | OneOf    | [🟢0x16B81]                       |
|       - Enable USB 3.0 pins                                 | OneOf    | [🟢0x16BBE]                       |
|       - USB 3.0 pin #1                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #2                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #3                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #4                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #5                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #6                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #7                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #8                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #9                                      | OneOf    | [🟢0x16BF4]                       |
|       - USB 3.0 pin #10                                     | OneOf    | [🟢0x16BF4]                       |
|       - USB Per-Connector Disable                           | OneOf    |                                   |
|       - USB HS Physical Connector #0 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #1 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #2 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #3 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #4 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #5 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #6 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #7 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #8 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #9 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #10 Disable               | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #11 Disable               | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #12 Disable               | OneOf    | [🟢0x16D7B]                       |
|       - USB HS Physical Connector #13 Disable               | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #0 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #1 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #2 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #3 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #4 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #5 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #6 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #7 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #8 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - USB SS Physical Connector #9 Disable                | OneOf    | [🟢0x16D7B]                       |
|       - XHCI Idle L1                                        | OneOf    | [🟢0x1709D]                       |
|       - USB XHCI MSI Disable WA                             | OneOf    | [🟢0x1709D]                       |
|       - XHCI Over Current Pins                              | OneOf    | [🟢0x1709D]                       |
|       - XHCI Wake On Usb Enable                             | OneOf    | [🟢0x1709D]                       |
|       - Place XHCI BAR below 4GB                            | OneOf    | [🟢0x1709D]                       |
|     - Azalia Configuration:                                 | Ref      | [🟢0x16833]                       |
|       - Azalia                                              | OneOf    |                                   |
|       -  HDA-Link Codec Select                              | OneOf    | [🟢0x17185, 🟢0x1718D]            |
|       -   Azalia PME Enable                                 | OneOf    | [🟢0x17185, 🟢0x1718D]            |
|       - Virtual Channel for HD Audio                        | OneOf    | [🟢0x17185, 🟢0x1718D]            |
|     - Networking:                                           | Ref      | [🟢0x1684C, 🟢0x16854]            |
|       - PCH Internal LAN                                    | OneOf    | [🟢0x18986]                       |
|       -   Wake on LAN                                       | OneOf    | [🟢0x189AD]                       |
|       -   SLP_LAN# Low on DC Power                          | OneOf    | [🟢0x189AD]                       |
|       - K1 off                                              | OneOf    | [🟢0x189AD]                       |
|     - Platform Thermal Configuration:                       | Ref      | [🟢0x1684C]                       |
|       - PCH Thermal Device                                  | OneOf    |                                   |
|     - ADR Configuration:                                    | Ref      | [🟢0x1684C]                       |
|       - Enable/Disable ADR                                  | OneOf    | [🟢0x1EC65]                       |
|       - ADR GPIO                                            | OneOf    | [🟢0x1EC97]                       |
|       - Host Partition Reset ADR Enable                     | OneOf    | [🟢0x1EC97]                       |
|       - Enable/Disable ADR Timer                            | OneOf    | [🟢0x1EC97]                       |
|       - SYS_PWROK Failure ADR Enable                        | OneOf    | [🟢0x1EC97, 🟢0x1ED1E]            |
|       - Over-Clocking WDT ADR Enable                        | OneOf    | [🟢0x1EC97, 🟢0x1ED1E]            |
|       - CPU Thermal WDT ADR Enable                          | OneOf    | [🟢0x1EC97, 🟢0x1ED1E]            |
|       - PMC Parity Error ADR Enable                         | OneOf    | [🟢0x1EC97, 🟢0x1ED1E]            |
|       - ADR timer expire time                               | OneOf    | [🟢0x1EC97, 🟢0x1EDC8]            |
|       - ADR timer multiplier                                | OneOf    | [🟢0x1EC97, 🟢0x1EDC8]            |
|     - PCH DFX Configuration:                                | Ref      | [🟢0x1684C]                       |
|       - Reveal PCH P2SB device                              | OneOf    |                                   |
|       - Unlock PCH P2SB                                     | OneOf    |                                   |
|     - PCH DWR Configuration:                                | Ref      | [🟢0x1684C]                       |
|       - <empty>                                             | Numeric  | [🟢0x1EE7D]                       |
|       - Dirty Warm Reset                                    | OneOf    |                                   |
|       - Dirty Warm Reset Stall                              | OneOf    |                                   |
|       - BMC RootPort                                        | OneOf    |                                   |
|       -  Host Reset Timeout                                 | OneOf    |                                   |
|       -  ME FW Watchdog Timer                               | OneOf    |                                   |
|       -  IE FW Watchdog Timer                               | OneOf    |                                   |
|       - ME Reset Prep Done                                  | OneOf    |                                   |
|       - IE Reset Prep Done                                  | OneOf    |                                   |
|   - OverClocking Feature:                                   | Ref      | [🟢0x159F4, 🟢0x159FC]            |
|     - OverClocking Feature                                  | OneOf    |                                   |
|     - Filter Pll                                            | OneOf    | [🟢0x212AD]                       |
|     - Processor:                                            | Ref      | [🟢0x212AD]                       |
|       - Core Max OC Ratio                                   | Numeric  |                                   |
|       - Core Voltage Mode                                   | OneOf    |                                   |
|       - Core Voltage Override                               | Numeric  | [🟢0x2135C]                       |
|       - Core Extra Turbo Voltage                            | Numeric  | [🟢0x2138A]                       |
|       - Core Voltage Offset                                 | Numeric  |                                   |
|       -   Offset Prefix                                     | OneOf    |                                   |
|     - CLR/Ring:                                             | Ref      | [🟢0x212AD]                       |
|       - CLR Max OC Ratio                                    | Numeric  |                                   |
|       - CLR Voltage Mode                                    | OneOf    |                                   |
|       - CLR Voltage Override                                | Numeric  | [🟢0x21445]                       |
|       - CLR Extra Turbo Voltage                             | Numeric  | [🟢0x21473]                       |
|       - CLR Voltage Offset                                  | Numeric  |                                   |
|       -   Offset Prefix                                     | OneOf    |                                   |
|     - Uncore:                                               | Ref      | [🟢0x212AD]                       |
|       - Uncore Voltage Offset                               | Numeric  |                                   |
|       -   Offset Prefix                                     | OneOf    |                                   |
|       - IOA Voltage Offset                                  | Numeric  |                                   |
|       -   Offset Prefix                                     | OneOf    |                                   |
|       - IOD Voltage Offset                                  | Numeric  |                                   |
|       -   Offset Prefix                                     | OneOf    |                                   |
|       - VccIo Voltage Control                               | OneOf    |                                   |
|     - SVID/FIVR:                                            | Ref      | [🟢0x212AD]                       |
|       - SVID Support                                        | OneOf    |                                   |
|       - SVID Voltage Override                               | Numeric  | [🟢0x217B9]                       |
|       - CPU VCCin Voltage Level                             | Numeric  |                                   |
|       - FIVR Faults                                         | OneOf    |                                   |
|       - FIVR Efficiency Management                          | OneOf    |                                   |
|   - Miscellaneous Configuration:                            | Ref      | [🟢0x15A17]                       |
|     - Application Profile Configuration                     | OneOf    |                                   |
|     - KCS Access Control Policy                             | OneOf    |                                   |
|     - Max Page Table Size Select                            | OneOf    | [🟢0x15BB7]                       |
|     - Reset Platform on Memory Map Change                   | CheckBox |                                   |
|     - Wake On Lan Support                                   | OneOf    |                                   |
|     - Breakpoint Type                                       | OneOf    |                                   |
|     - Force Setup                                           | CheckBox | [🟢0x15C4C]                       |
|     - PFR Supported                                         | OneOf    |                                   |
|     - CPLD RoT Release Version                              | Numeric  | [🟢0x15C8F]                       |
|     - CPLD RoT SVN                                          | Numeric  | [🟢0x15CBE]                       |
|     - PCH PFR Active SVN                                    | Numeric  | [🟢0x15CED]                       |
|     - PCH PFM Active Major Version                          | Numeric  | [🟢0x15D1C]                       |
|     - PCH PFM Active Minor Version                          | Numeric  | [🟢0x15D4B]                       |
|     - BMC PFR Active SVN                                    | Numeric  | [🟢0x15D7A]                       |
|     - BMC PFM Active Major Version                          | Numeric  | [🟢0x15DA9]                       |
|     - BMC PFM Active Minor Version                          | Numeric  | [🟢0x15DD8]                       |
|     - PCH PFR Recovery SVN                                  | Numeric  | [🟢0x15E07]                       |
|     - PCH PFM Recovery Major Version                        | Numeric  | [🟢0x15E36]                       |
|     - PCH PFM Recovery Minor Version                        | Numeric  | [🟢0x15E65]                       |
|     - BMC PFR Recovery SVN                                  | Numeric  | [🟢0x15E94]                       |
|     - BMC PFM Recovery Major Version                        | Numeric  | [🟢0x15EC3]                       |
|     - BMC PFM Recovery Minor Version                        | Numeric  | [🟢0x15EF2]                       |
|     - PFR Status: Locked                                    | OneOf    | [🟢0x15F21]                       |
|     - PFR Status: Provisioned                               | OneOf    | [🟢0x15F52]                       |
|     - PFR Status: PIT Level-1 Protection Enabled            | OneOf    | [🟢0x15F83]                       |
|     - PFR Status: PIT Level-2 Protection Enabled            | OneOf    | [🟢0x15FB4]                       |
|     - PFR Lock                                              | OneOf    | [🟢0x15FE5]                       |
|     - PFR Provision                                         | OneOf    | [🟢0x16024]                       |
|     - PFR UnProvision                                       | OneOf    | [🟢0x16063]                       |
|     - PFR PIT Level-1 Protection                            | OneOf    | [🟢0x160A2]                       |
|     - PFR PIT Level-2 Protection                            | OneOf    | [🟢0x160E9]                       |
|     - BIOS Guard                                            | CheckBox |                                   |
|     - Populate BiG Directory                                | CheckBox | [🟢0x1616E, 🟢0x16172]            |
|     - Flash Wear Out Protection                             | CheckBox | [🟢0x1619A, 🟢0x1619E]            |
|     - Xml Cli Support                                       | OneOf    |                                   |
|     - Skip XML Compression                                  | OneOf    |                                   |
|     - Publish Setup page Pointer                            | OneOf    |                                   |
|     - Advanced Debug Function                               | OneOf    |                                   |
|     - BIOS Serial Port Baud Rate                            | OneOf    |                                   |
|     - Serial Debug Message Level                            | OneOf    | [🟢0x16281]                       |
|     - Trace Messages                                        | OneOf    | [🟢0x162C4]                       |
|     - Training Messages                                     | OneOf    | [🟢0x162F2]                       |
|     - Active Video                                          | OneOf    |                                   |
|     - PS2 Port Swap                                         | OneOf    |                                   |
|     - NumLock                                               | OneOf    |                                   |
|     - Wake On Lan from S5                                   | OneOf    |                                   |
|     - Boot to Network                                       | OneOf    |                                   |
|     - ARI Support                                           | OneOf    |                                   |
|     - ARI Forward                                           | OneOf    |                                   |
|     - SR-IOV Support                                        | OneOf    | [🟢0x16407, 🟢0x1640B]            |
|     - SR-IOV SystemPageSize                                 | OneOf    | [🟢0x16407]                       |
|     - MR-IOV Support                                        | OneOf    | [🟢0x16407]                       |
|     - RTC Wake system from S4/S5                            | OneOf    |                                   |
|     -   Wake up hour                                        | Numeric  | [🟢0x164C1]                       |
|     -   Wake up minute                                      | Numeric  | [🟢0x164C1]                       |
|     -   Wake up second                                      | Numeric  | [🟢0x164C1]                       |
|     - Firmware Configuration                                | OneOf    |                                   |
|     - Storage OPROM Suppression                             | OneOf    | [🟢0x16549]                       |
|     - RSA Support                                           | OneOf    | [🟢0x16570]                       |
|   - Workstation ME Configuration:                           | Ref      | [🟢0x15A30, 🟢0x15A38]            |
|     - ME Firmware Type                                      | Numeric  | [🟢0x20580, 🟢0x205C9]            |
|     - Delayed Authentication Mode (DAM)                     | OneOf    | [🟢0x20580]                       |
|     - Core Bios Done Message                                | OneOf    | [🟢0x20580]                       |
|   - Server ME Configuration:                                | Ref      | [🟢0x15A57, 🟢0x15A5F]            |
|     - ME Firmware Type                                      | Numeric  | [🟢0x208CC, 🟢0x20905]            |
|     - ME PTT Supported                                      | CheckBox | [🟢0x208CC, 🟢0x2092A]            |
|     - PTT Support                                           | OneOf    | [🟢0x208CC]                       |
|     - Suppress PTT Commands                                 | OneOf    | [🟢0x208CC]                       |
|     - Altitude                                              | Numeric  | [🟢0x208CC]                       |
|     - MCTP Bus Owner                                        | Numeric  | [🟢0x208CC]                       |
|     -   PSU #1                                              | Numeric  | [🟢0x208CC, 🟢0x20A53]            |
|     -   PSU #2                                              | Numeric  | [🟢0x208CC, 🟢0x20A53]            |
|     -   PSU #3                                              | Numeric  | [🟢0x208CC, 🟢0x20A53]            |
|     -   PSU #4                                              | Numeric  | [🟢0x208CC, 🟢0x20A53]            |
|   - Server ME Debug Configuration:                          | Ref      | [🟢0x15A7E, 🟢0x15A86]            |
|     - Server ME General Configuration:                      | Ref      | [🟢0x208CC]                       |
|       - ME Initialization Complete Timeout                  | Numeric  | [🟢0x208CC]                       |
|       - Enable HSIO Messaging                               | OneOf    | [🟢0x208CC]                       |
|       - DRAM Init Done Enable                               | CheckBox | [🟢0x208CC]                       |
|       -   DRAM Initialization Status                        | OneOf    | [🟢0x208CC]                       |
|       - Host Reset Warning                                  | CheckBox | [🟢0x208CC]                       |
|       - Pre-DramInitDone ME Reset                           | CheckBox | [🟢0x208CC]                       |
|       - HMRFPO_LOCK Message                                 | OneOf    | [🟢0x208CC]                       |
|       - HMRFPO_ENABLE Message                               | OneOf    | [🟢0x208CC]                       |
|       - END_OF_POST Message                                 | OneOf    | [🟢0x208CC]                       |
|       - REGION_SELECT Message                               | OneOf    | [🟢0x208CC]                       |
|       - WATCHDOG_CONTROL Message                            | OneOf    | [🟢0x208CC]                       |
|       - CF9 global reset promotion                          | OneOf    | [🟢0x208CC]                       |
|       - Global Reset Lock                                   | OneOf    | [🟢0x208CC]                       |
|       - HECI-1 Enable                                       | OneOf    | [🟢0x208CC]                       |
|       - HECI-2 Enable                                       | OneOf    | [🟢0x208CC]                       |
|       - HECI-3 Enable                                       | OneOf    | [🟢0x208CC]                       |
|       - IDEr Enable                                         | OneOf    | [🟢0x208CC]                       |
|       - KT Enable                                           | OneOf    | [🟢0x208CC]                       |
|       - HECI-1 Hide in ME                                   | OneOf    | [🟢0x208CC]                       |
|       - HECI-2 Hide in ME                                   | OneOf    | [🟢0x208CC]                       |
|       - HECI-3 Hide in ME                                   | OneOf    | [🟢0x208CC]                       |
|       - D0I3 Setting for HECI Disable                       | OneOf    | [🟢0x208CC]                       |
|       - Break RTC Configuration                             | CheckBox | [🟢0x208CC]                       |
|       - Core Bios Done Message                              | OneOf    | [🟢0x208CC]                       |
|       - Delayed Authentication Mode (DAM) Override          | CheckBox | [🟢0x208CC]                       |
|       - Delayed Authentication Mode (DAM)                   | OneOf    | [🟢0x208CC]                       |
|       - Enable HECI Dump                                    | OneOf    | [🟢0x208CC]                       |
|     - NM Configuration:                                     | Ref      | [🟢0x208CC]                       |
|       - Boot Mode Override                                  | CheckBox | [🟢0x208CC]                       |
|       -   Boot Mode                                         | OneOf    | [🟢0x208CC]                       |
|       - Cores Disable Override                              | CheckBox | [🟢0x208CC]                       |
|       -   Cores To Disable                                  | Numeric  | [🟢0x208CC]                       |
|       - Power Measurement Override                          | CheckBox | [🟢0x208CC]                       |
|       -   Power Measurement                                 | OneOf    | [🟢0x208CC]                       |
|       - Hardware Change Override                            | CheckBox | [🟢0x208CC]                       |
|       -   Hardware Changed                                  | OneOf    | [🟢0x208CC]                       |
|       - PTU Load Override                                   | CheckBox | [🟢0x208CC]                       |
|     - ME UEFI FW Health Status                              | Ref      | [🟢0x208CC]                       |
|   - ME DFX Debug Configuration:                             | Ref      | [🟢0x15AA5, 🟢0x15AAD]            |
|     - ME DFX General Configuration:                         | Ref      | [🟢0x210F4]                       |
|       - Enable HSIO Messaging                               | OneOf    | [🟢0x210F4]                       |
|       - DRAM Init Done Enable                               | CheckBox | [🟢0x210F4]                       |
|       -   DRAM Initialization Status                        | OneOf    | [🟢0x210F4]                       |
|       - HECI-1 Enable                                       | OneOf    | [🟢0x210F4]                       |
|       - HECI-2 Enable                                       | OneOf    | [🟢0x210F4]                       |
|       - HECI-3 Enable                                       | OneOf    | [🟢0x210F4]                       |
|       - IDEr Enable                                         | OneOf    | [🟢0x210F4]                       |
|       - KT Enable                                           | OneOf    | [🟢0x210F4]                       |
|       - Enable HECI Dump                                    | OneOf    | [🟢0x210F4]                       |
|   - Runtime Error Logging:                                  | Ref      | [🟢0x15ACC]                       |
|     - System Errors                                         | OneOf    |                                   |
|     - S/W Error Injection Support                           | OneOf    | [🟢0x1F066]                       |
|     - RAS Log Level                                         | OneOf    |                                   |
|     - System Memory Poison                                  | OneOf    | [🟢0x1F0C0]                       |
|     - Viral Status                                          | OneOf    |                                   |
|     - Clear Viral Status                                    | OneOf    | [🟢0x1F14A]                       |
|     - Cloak Devhide registers from being accessible from OS | OneOf    |                                   |
|     - System Cloaking                                       | OneOf    | [🟢0x1F1B2]                       |
|     - UboxToPcuMca Enabling                                 | OneOf    | [🟢0x1F1E7]                       |
|     - FatalErrDebugHalt                                     | OneOf    | [🟢0x1F218]                       |
|     - Mca Bank Warm Boot Clear Errors                       | OneOf    |                                   |
|     - Shutdown Suppression                                  | OneOf    | [🟢0x1F264]                       |
|     - eMCA Settings:                                        | Ref      |                                   |
|       - EMCA Logging Support                                | OneOf    |                                   |
|       - LMCE Support                                        | OneOf    | [🟢0x1F3F4]                       |
|       - Ignore OS EMCA Opt-in                               | OneOf    | [🟢0x1F42D]                       |
|       - EMCA CMCI-SMI Morphing                              | OneOf    | [🟢0x1F458]                       |
|       - EMCA CMCI-SMI Threshold                             | Numeric  | [🟢0x1F458, 🟢0x1F481]            |
|       - CSMI Dynamic Disable                                | OneOf    | [🟢0x1F458, 🟢0x1F4AF]            |
|       - EMCA MCE-SMI Enable                                 | OneOf    | [🟢0x1F4E0]                       |
|       - Corrected Error eLog                                | OneOf    | [🟢0x1F50B]                       |
|       - Memory Error eLog                                   | OneOf    | [🟢0x1F536]                       |
|       - Processor Error eLog                                | OneOf    | [🟢0x1F561]                       |
|       - Opportunistic Spare Core                            | OneOf    | [🟢0x1F58C, 🟢0x1F5A6]            |
|       - Ubox Error Mask                                     | OneOf    | [🟢0x1F5D3]                       |
|     - Whea Settings:                                        | Ref      |                                   |
|       - WHEA Support                                        | OneOf    |                                   |
|       - Whea Log Memory Error                               | OneOf    | [🟢0x1F639]                       |
|       - Whea Log Processor Error                            | OneOf    | [🟢0x1F664]                       |
|       - Whea Log PCI Error                                  | OneOf    | [🟢0x1F68F]                       |
|     - Error Injection Settings:                             | Ref      |                                   |
|       - Mca Bank Error Injection Support                    | OneOf    | [🟢0x1F6D4]                       |
|       - PMem Error Injection                                | OneOf    |                                   |
|       - WHEA Error Injection Support                        | OneOf    |                                   |
|       - WHEA Error Injection 5.0 Extension                  | OneOf    | [🟢0x1F745]                       |
|       - Whea PCIE Error Injection Support                   | OneOf    | [🟢0x1F770]                       |
|       - Whea PCIe Error Injection Action Table              | OneOf    | [🟢0x1F79B]                       |
|       - SGX Memory Error Injection Support                  | OneOf    | [🟢0x1F7C6]                       |
|     - UPI Error Enabling:                                   | Ref      | [🟢0x1F2F3]                       |
|       - SMI UPI Lane Failover                               | OneOf    | [🟢0x1F80B]                       |
|     - Memory Error Enabling:                                | Ref      |                                   |
|       - Memory Error                                        | OneOf    |                                   |
|       - Memory Corrected Error                              | OneOf    | [🟢0x1F877]                       |
|       - Spare Interrupt                                     | OneOf    | [🟢0x1F8A2, 🟢0x1F8AA]            |
|       - PMem CTLR Errors                                    | OneOf    | [🟢0x1F8E5]                       |
|       - PMem CTLR Low Priority Error Signaling              | OneOf    | [🟢0x1F8E5]                       |
|       - PMem CTLR High Priority Error Signaling             | OneOf    | [🟢0x1F8E5]                       |
|       - Set PMem Address Range Scrub                        | OneOf    | [🟢0x1F8E5]                       |
|       - Set PMem Host Alert Policy for Patrol Scrub         | OneOf    | [🟢0x1F8E5]                       |
|       - Enable Reporting SPA to OS                          | OneOf    | [🟢0x1F8E5]                       |
|       - PMem UNC Poison                                     | OneOf    | [🟢0x1F8E5]                       |
|       - PMem Host Alert Policy                              | OneOf    | [🟢0x1F8E5, 🟢0x1F9E2]            |
|       - Set PMem Host Alert Policy for DPA Error            | OneOf    | [🟢0x1F8E5]                       |
|     - IIO Error Enabling:                                   | Ref      |                                   |
|       - IIO/PCH Global Error Support                        | OneOf    | [🟢0x1FA5F]                       |
|       - Os Native AER Support                               | OneOf    | [🟢0x1FA94]                       |
|       - IIO MCA Support                                     | OneOf    | [🟢0x1FABF]                       |
|       - Clear PCC for IIO Non-Fatal Error                   | OneOf    | [🟢0x1FAF8, 🟢0x1FB00]            |
|       - IIO Error Pin0 Enable                               | OneOf    | [🟢0x1FB2D]                       |
|       - IIO Error Pin1 Enable                               | OneOf    | [🟢0x1FB2D, 🟢0x1FB56]            |
|       - IIO Error Pin2 Enable                               | OneOf    | [🟢0x1FB2D, 🟢0x1FB56]            |
|       - IIO OOB Mode                                        | OneOf    | [🟢0x1FBA4]                       |
|       - IIO Error Registers Clear                           | OneOf    | [🟢0x1FBCF]                       |
|       - IIO LER Support                                     | OneOf    | [🟢0x1FBFA]                       |
|       - LER MA Error Logging                                | OneOf    | [🟢0x1FC69, 🟢0x1FC71]            |
|       - IIO eDPC Support                                    | OneOf    | [🟢0x1FC9E, 🟢0x1FCB8]            |
|       - IIO eDPC Interrupt                                  | OneOf    | [🟢0x1FC9E, 🟢0x1FCFE]            |
|       - IIO eDPC ERR_COR Message                            | OneOf    | [🟢0x1FC9E, 🟢0x1FD33]            |
|       - IIO Coherent Interface Error                        | OneOf    | [🟢0x1FD6A]                       |
|       - IIO IRP0 protocol parity error                      | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 protocol qt overflow underflow error       | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 protocol rcvd unexprsp                     | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 csr acc 32b unaligned                      | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 wrcache uncecccs0 error                    | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 wrcache uncecccs1 error                    | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 protocol rcvd poison error                 | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 wrcache correcccs0 error                   | OneOf    | [🟢0x1FD95]                       |
|       - IIO IRP0 wrcache correcccs1 error                   | OneOf    | [🟢0x1FD95]                       |
|       - IIO Misc. Error                                     | OneOf    | [🟢0x1FED2]                       |
|       - IIO Vtd Error                                       | OneOf    | [🟢0x1FEFD]                       |
|       - IIO Dma Error                                       | OneOf    | [🟢0x1FF28]                       |
|       - IIO Dmi Error                                       | OneOf    | [🟢0x1FF28]                       |
|       - PCIE Error                                          | OneOf    | [🟢0x1FF74]                       |
|       - IIO PCIE Additional Corrected Error                 | OneOf    | [🟢0x1FF9F]                       |
|       - IIO PCIE Additional Uncorrected Error               | OneOf    | [🟢0x1FFCA]                       |
|       - IIO PCIE Additional Received Completion With UR     | OneOf    | [🟢0x1FFF5]                       |
|       - IIO PCIE AER Spec Compliant                         | OneOf    | [🟢0x20020]                       |
|       - ITC/OTC CA/MA Errors                                | OneOf    | [🟢0x2004B, 🟢0x20065]            |
|       - PSF UR Error                                        | OneOf    | [🟢0x2004B, 🟢0x20090]            |
|       - PMSB Router Parity Error                            | OneOf    | [🟢0x2004B, 🟢0x200BB]            |
|     - PCIe Error Enabling:                                  | Ref      |                                   |
|       - Corrected Error                                     | OneOf    |                                   |
|       - Uncorrected Error                                   | OneOf    |                                   |
|       - Fatal Error Enable                                  | OneOf    |                                   |
|       - PCIE Corrected Error Threshold Counter              | OneOf    | [🟢0x2016E]                       |
|       - PCIE Corrected Error Threshold                      | Numeric  | [🟢0x20199]                       |
|       - PCIe Corrected Error Limit Check                    | OneOf    | [🟢0x201D1]                       |
|       - PCIe Corrected Error Limit                          | Numeric  | [🟢0x201D1]                       |
|       - PCIE AER Corrected Errors                           | OneOf    |                                   |
|       - PCIE AER NonFatal Error                             | OneOf    |                                   |
|       - PCIE AER Fatal Error                                | OneOf    |                                   |
|       - PCIE AER Advisory Nonfatal Error                    | OneOf    |                                   |
|       - PCIE Unsupported Request Error                      | OneOf    |                                   |
|       - PCIE Surprise Link Down Error                       | OneOf    |                                   |
|       - Assert NMI on SERR                                  | OneOf    |                                   |
|       - Assert NMI on PERR                                  | OneOf    |                                   |
|       - Expected BER                                        | Numeric  | [🟢0x20346]                       |
|       - Time Window (Gen1/2)                                | Numeric  | [🟢0x20346]                       |
|       - Time Window (Gen3/4)                                | Numeric  | [🟢0x20346]                       |
|       - Error Threshold (Gen1/2)                            | Numeric  | [🟢0x20346]                       |
|       - Error Threshold (Gen3/4)                            | Numeric  | [🟢0x20346]                       |
|       - Gen3/4 Re-Equalization                              | OneOf    | [🟢0x20346]                       |
|       - Gen2 Link Degradation                               | OneOf    | [🟢0x20346]                       |
|       - Gen3 Link Degradation                               | OneOf    | [🟢0x20346]                       |
|       - Gen4 Link Degradation                               | OneOf    | [🟢0x20346]                       |
|     - Error Control Setting:                                | Ref      |                                   |
|       - Patrol Scrub Error Reporting                        | OneOf    | [🟢0x204EB]                       |
|       - 2LM Correctable Error Logging in m2mem              | OneOf    | [🟢0x20520]                       |
|       - Latch First Corrected Error in KTI                  | OneOf    | [🟢0x20520]                       |
|   - Reserve Memory:                                         | Ref      | [🟢0x15ACC]                       |
|     - Reserve Memory Range                                  | CheckBox |                                   |
|     - Start Address                                         | Numeric  |                                   |
|     - Reserve TAGEC Memory                                  | OneOf    |                                   |
```
