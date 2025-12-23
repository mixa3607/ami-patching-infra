```
| Path                                           | Type    | SuppressIf             |
|------------------------------------------------|---------|------------------------|
| - Server Mgmt:                                 | Menu    |                        |
|   - BMC Support                                | OneOf   |                        |
|   - IPMI Interface Type                        | OneOf   | [🟢0x166E0, 🟢0x166E4] |
|   - Wait For BMC                               | OneOf   | [🟢0x16790, 🟢0x16794] |
|   - FRB-2 Timer                                | OneOf   | [🟢0x167D7, 🟢0x167DB] |
|   - FRB-2 Timer timeout                        | Numeric | [🟢0x167D7, 🟢0x1681C] |
|   - FRB-2 Timer Policy                         | OneOf   | [🟢0x167D7, 🟢0x16859] |
|   - OS Watchdog Timer                          | OneOf   | [🟢0x167D7, 🟢0x168B2] |
|   - OS Wtd Timer Timeout                       | Numeric | [🟢0x167D7, 🟢0x168F3] |
|   - OS Wtd Timer Policy                        | OneOf   | [🟢0x167D7, 🟢0x16930] |
|   - Serial Mux                                 | OneOf   | [🟢0x1698B, 🟢0x1698F] |
|   - System Event Log:                          | Ref     | [🟢0x169D2, 🟢0x169D6] |
|     - SEL Components                           | OneOf   | [🟢0x16ADD]            |
|     - Erase SEL                                | OneOf   |                        |
|     - When SEL is Full                         | OneOf   |                        |
|     - Log EFI Status Codes                     | OneOf   |                        |
|   - Bmc self test log:                         | Ref     | [🟢0x16A03, 🟢0x16A07] |
|     - Erase Log                                | OneOf   |                        |
|     - When log is full                         | OneOf   |                        |
|   - BMC network configuration:                 | Ref     | [🟢0x16A2C]            |
|     - <empty>                                  | Numeric | [🟢0x16D84]            |
|     - Configuration Address source             | OneOf   |                        |
|     - Station IP address                       | String  | [🟢0x16DF3]            |
|     - Subnet mask                              | String  | [🟢0x16DF3]            |
|     - Router IP address                        | String  | [🟢0x16DF3]            |
|     - Router MAC address                       | String  | [🟢0x16DF3]            |
|     - IPv6 Support                             | OneOf   | [🟢0x16F02]            |
|     - Configuration Address source             | OneOf   | [🟢0x16F58]            |
|     - Station IPv6 address                     | String  | [🟢0x16F58, 🟢0x16FA1] |
|     - Prefix Length                            | Numeric | [🟢0x16F58, 🟢0x16FA1] |
|     - Configuration Router Lan1 Address source | OneOf   | [🟢0x16F58]            |
|     - IPv6 Router1 IP Address                  | String  | [🟢0x16F58, 🟢0x17087] |
|     - IPv6 Router1 Prefix Length Lan1          | Numeric | [🟢0x16F58, 🟢0x17087] |
|     - IPv6 Router1 Prefix Value Lan1           | String  | [🟢0x16F58, 🟢0x17087] |
|   - View System Event Log                      | Ref     | [🟢0x16A4F, 🟢0x16A53] |
|   - BMC User Settings:                         | Ref     | [🟢0x16A78, 🟢0x16A7C] |
|     - Add User:                                | Ref     |                        |
|       - User Name                              | String  |                        |
|       - User Access                            | OneOf   |                        |
|       - Channel No                             | Numeric |                        |
|       - User Privilege Limit                   | OneOf   |                        |
|     - Delete User:                             | Ref     |                        |
|       - User Name                              | String  |                        |
|     - Change User Settings:                    | Ref     |                        |
|       - User Name                              | String  |                        |
|       - User Access                            | OneOf   |                        |
|       - Channel No                             | Numeric |                        |
|       - User Privilege Limit                   | OneOf   |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
|       - <empty>                                | Numeric |                        |
```
