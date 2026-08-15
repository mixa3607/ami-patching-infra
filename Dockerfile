# syntax=docker/dockerfile:1.7
FROM ubuntu:24.04 AS build

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        fakeroot \
        file \
        gcc-arm-linux-gnueabi \
        jq \
        libicu74 \
        libc6-dev-armel-cross \
        make \
        mtd-utils \
        python3-pip \
        util-linux \
    && python3 -m pip install --break-system-packages --no-cache-dir jefferson \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
COPY MEGARACSP/ /workspace/MEGARACSP/
COPY --from=soft uefi-mod-tools_v1.3.0/ /workspace/SOFTWARE/uefi-mod-tools_v1.3.0/
COPY --from=videocap videocap.ko /workspace/videocap.ko

RUN chmod +x /workspace/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools \
    && mkdir -p /workspace/MEGARACSP/work \
    && /workspace/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools bin split \
        --input /workspace/MEGARACSP/IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin \
        --table /workspace/MEGARACSP/partitions.json \
        --output /tmp/partitions \
    && fsck.cramfs --extract=/tmp/root /tmp/partitions/50_root.cramfs \
    && make -C /workspace/MEGARACSP/native-kvm ami-kvm-server native-kvm-loop \
    && /workspace/MEGARACSP/native-kvm/scripts/build-root-cramfs.sh \
        /tmp/partitions/50_root.cramfs \
        /workspace/MEGARACSP/native-kvm/native-kvm-loop \
        /workspace/MEGARACSP/work/native-kvm-root.cramfs \
        --drop-legacy-zoneinfo \
    && test "$(sha256sum /workspace/videocap.ko | cut -d ' ' -f 1)" = \
        4a47bf2f5f27b9e50fbb1e1f6e7813c6de104e734c5bb9403427162f3c43091e \
    && /workspace/MEGARACSP/native-kvm/scripts/build-cramfs.sh \
        /workspace/videocap.ko \
        /workspace/MEGARACSP/work/native-kvm-slot-a.bin \
    && /workspace/MEGARACSP/scripts/build-mac-version-image.sh --native-kvm \
        /workspace/MEGARACSP/work/native-kvm-root.cramfs \
        /workspace/MEGARACSP/work/native-kvm-slot-a.bin \
        /workspace/MEGARACSP/work/IMB760_BMC_native-kvm-final.bin

FROM scratch AS artifact
COPY --from=build /workspace/MEGARACSP/work/IMB760_BMC_native-kvm-final.bin /
