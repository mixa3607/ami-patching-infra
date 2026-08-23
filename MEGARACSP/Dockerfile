# syntax=docker/dockerfile:1.7
FROM ubuntu:24.04 AS build

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        bc \
        bison \
        build-essential \
        flex \
        fakeroot \
        file \
        gcc-arm-linux-gnueabi \
        jq \
        libicu74 \
        libc6-dev-armel-cross \
        make \
        mtd-utils \
        python3-pip \
        unzip \
        util-linux \
        wget \
    && python3 -m pip install --break-system-packages --no-cache-dir jefferson \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

RUN mkdir -p /workspace/SOFTWARE/uefi-mod-tools_v1.3.0 \
    && wget -q -O /tmp/uefi-mod-tools.zip \
        https://github.com/mixa3607/uefi-mod-tools/releases/download/v1.3.0/uefi-mod-tools_linux-x64_prebuild.zip \
    && test "$(sha256sum /tmp/uefi-mod-tools.zip | cut -d ' ' -f 1)" = \
        3c6bcd375b4b2324d60659a5c6e509dad236b8a4271148b4a0e960714b93b00b \
    && unzip -q /tmp/uefi-mod-tools.zip -d /workspace/SOFTWARE/uefi-mod-tools_v1.3.0 \
    && chmod +x /workspace/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools

COPY kernel/patches/ami-ast2500.patch /tmp/kernel-patches/

RUN wget -q -O /tmp/linux-3.14.17.tar.xz https://cdn.kernel.org/pub/linux/kernel/v3.x/linux-3.14.17.tar.xz \
    && test "$(sha256sum /tmp/linux-3.14.17.tar.xz | cut -d ' ' -f 1)" = \
        b644c3cd147e758922e8eb05b2a82edd4c36b9622dd2f5526d73f7d0f8d489b6 \
    && tar -xf /tmp/linux-3.14.17.tar.xz -C /workspace \
    && mv /workspace/linux-3.14.17 /workspace/linux \
    && patch -d /workspace/linux -p3 < /tmp/kernel-patches/ami-ast2500.patch \
    && make -C /workspace/linux ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- ast2500evb_defconfig \
    && make -C /workspace/linux ARCH=arm CROSS_COMPILE=arm-linux-gnueabi- modules_prepare

COPY IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin partitions.json /workspace/MEGARACSP/

RUN mkdir -p /workspace/MEGARACSP/work \
    && /workspace/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools bin split \
        --input /workspace/MEGARACSP/IMB760_BMC_mixa3607_F8CC6E033B82_zero-boot.bin \
        --table /workspace/MEGARACSP/partitions.json \
        --output /tmp/partitions \
    && fsck.cramfs --extract=/tmp/root /tmp/partitions/50_root.cramfs

COPY native-kvm/videocap-src/ /workspace/MEGARACSP/native-kvm/videocap-src/

RUN make -C /workspace/linux M=/workspace/MEGARACSP/native-kvm/videocap-src ARCH=arm \
        CROSS_COMPILE=arm-linux-gnueabi- clean \
    && make -C /workspace/linux M=/workspace/MEGARACSP/native-kvm/videocap-src ARCH=arm \
        CROSS_COMPILE=arm-linux-gnueabi- modules

COPY native-kvm/ /workspace/MEGARACSP/native-kvm/

RUN make -C /workspace/MEGARACSP/native-kvm ami-kvm-server native-kvm-loop \
    && /workspace/MEGARACSP/native-kvm/scripts/build-root-cramfs.sh \
        /tmp/partitions/50_root.cramfs \
        /workspace/MEGARACSP/native-kvm/build/native-kvm-loop \
        /workspace/MEGARACSP/work/native-kvm-root.cramfs \
        --drop-legacy-zoneinfo

COPY eth-mac.txt version.txt /workspace/MEGARACSP/
COPY scripts/ /workspace/MEGARACSP/scripts/

RUN /workspace/MEGARACSP/native-kvm/scripts/build-cramfs.sh \
        /workspace/MEGARACSP/native-kvm/videocap-src/videocap.ko \
        /workspace/MEGARACSP/work/native-kvm-slot-a.bin \
    && /workspace/MEGARACSP/scripts/build-mac-version-image.sh --native-kvm \
        /workspace/MEGARACSP/work/native-kvm-root.cramfs \
        /workspace/MEGARACSP/work/native-kvm-slot-a.bin \
        /workspace/MEGARACSP/work/IMB760_BMC_native-kvm-final.bin

FROM scratch AS artifact
COPY --from=build /workspace/MEGARACSP/work/IMB760_BMC_native-kvm-final.bin /
