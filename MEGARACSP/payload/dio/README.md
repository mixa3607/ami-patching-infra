# dio payload

Control of the IMB760 Digital I/O header from the BMC.

The PCA9554PW sits on the PCH SMBus, which is shared with the BMC
(`i2c-0`), so the BMC can drive it even when the host is off.

After the payload slot is mounted the tool is available at
`/var/payload/dio/`.

```sh
/var/payload/dio/dio.sh status                 # out=.. in=.. cfg=..
/var/payload/dio/dio.sh on 0x05                # GPIO0+GPIO2 (pins 1,5)
/var/payload/dio/dio.sh pulse 0x01 2           # GPIO0 high 2s then low
/var/payload/dio/dio.sh off                    # all outputs low
/var/payload/dio/dio.sh reset                  # back to stock (all inputs)
```

Direct access:

```sh
/var/payload/dio/dio r /dev/i2c-0 0x22 0   # input port register
/var/payload/dio/dio w /dev/i2c-0 0x22 1 0x0f  # output port register
```

Header pinout (10-pin, 5V logic, GND = pin 10):

| Pin | Signal | GPIO | Dir | Pin | Signal | GPIO | Dir |
| --- | ------ | ---- | --- | --- | ------ | ---- | --- |
| 1   | DIO1   | GPIO0| out | 2   | DIO8   | GPIO7| in  |
| 3   | DIO2   | GPIO1| out | 4   | DIO7   | GPIO6| in  |
| 5   | DIO3   | GPIO2| out | 6   | DIO6   | GPIO5| in  |
| 7   | DIO4   | GPIO3| out | 8   | DIO5   | GPIO4| in  |
| 9   | NC     | —    | —    | 10  | GND    | —   | —   |

Registers (command byte): `0`=input port, `1`=output port, `2`=polarity,
`3`=config (0=out, 1=in).
