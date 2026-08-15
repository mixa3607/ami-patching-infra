# AMI AST2500 videocap driver

This source is derived from AMI's public
`ami-megarac/OSSW-v12-update-3.00-K3` repository at commit
`204a605eec62915453dc32c1ef1c3048b713c65b`.

The Docker build compiles it against the checksum-pinned Linux 3.14.17 source
and the tracked AMI/AST2500 kernel patch set. `helper-src/helper.h` declares
the interfaces exported by the BMC's loaded `helper` module.
