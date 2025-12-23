# IFR data
Required structure:
```
├── *_setupdata_*_body.bin # setupdata body from UEFITool
├── *_AMITSE_*.sct         # AMITSE raw file from UEFITool
├── [<name>]  # any name / repeat
│   ├── <guid>.guid       # section guid from UEFITool
│   ├── <name>_setup.sct  # PE32 image section body from UEFITool  / All changes must be applied to it
│   ├── data.json         # data.json from UEFI-Editor / All changes must be applied to it
│   └── orig
│       ├── <name>_setup.sct       # section guid from UEFITool / orig
│       ├── <name>_setup.*.ifr.txt # ifr data from guid from IFRExtractor-RS
│       └── data.json              # data.json from UEFI-Editor / orig
```
