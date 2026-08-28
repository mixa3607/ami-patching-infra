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

RUN wget -q -O /tmp/busybox.tar.bz2 https://busybox.net/downloads/busybox-1.36.1.tar.bz2 \
    && test "$(sha256sum /tmp/busybox.tar.bz2 | cut -d ' ' -f 1)" = \
        b8cc24c9574d809e7279c3be349795c5d5ceb6fdf19ca709f80cde50e47de314 \
    && tar -xjf /tmp/busybox.tar.bz2 -C /workspace \
    && mv /workspace/busybox-1.36.1 /workspace/busybox-src \
    && wget -q -O /tmp/bash.tar.gz https://ftp.gnu.org/gnu/bash/bash-5.3.tar.gz \
    && test "$(sha256sum /tmp/bash.tar.gz | cut -d ' ' -f 1)" = \
        0d5cd86965f869a26cf64f4b71be7b96f90a3ba8b3d74e27e8e9d9d5550f31ba \
    && tar -xzf /tmp/bash.tar.gz -C /workspace \
    && mv /workspace/bash-5.3 /workspace/bash-src

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
        --output /tmp/partitions

COPY native-kvm/videocap-src/ /workspace/MEGARACSP/native-kvm/videocap-src/

RUN make -C /workspace/linux M=/workspace/MEGARACSP/native-kvm/videocap-src ARCH=arm \
        CROSS_COMPILE=arm-linux-gnueabi- clean \
    && make -C /workspace/linux M=/workspace/MEGARACSP/native-kvm/videocap-src ARCH=arm \
        CROSS_COMPILE=arm-linux-gnueabi- modules

COPY native-kvm/ /workspace/MEGARACSP/native-kvm/
COPY scripts/ /workspace/MEGARACSP/scripts/
COPY payload/ /workspace/MEGARACSP/payload/

RUN /workspace/MEGARACSP/payload/tools/build.sh \
        /workspace/busybox-src /workspace/bash-src \
        /workspace/MEGARACSP/work/payloads/tools

RUN make -C /workspace/MEGARACSP/native-kvm ami-kvm-server \
    && arm-linux-gnueabi-gcc -Os -ffreestanding -fno-builtin -fno-stack-protector \
        -fno-unwind-tables -fno-asynchronous-unwind-tables -nostdlib -static -s \
        -Wl,-e,_start -o /tmp/payload-loop \
        /workspace/MEGARACSP/scripts/payload-loop-start.S \
        /workspace/MEGARACSP/scripts/payload-loop.c \
    && arm-linux-gnueabi-gcc -Os -ffreestanding -fno-stack-protector -nostdlib -static -s \
        -Wl,-e,_start -o /tmp/dio \
        /workspace/MEGARACSP/payload/dio/dio.c

RUN mkdir -p /workspace/MEGARACSP/work/payloads/native-kvm/vendor /workspace/MEGARACSP/work/payloads/dio \
    && cp /workspace/MEGARACSP/payload/native-kvm/init.sh \
        /workspace/MEGARACSP/work/payloads/native-kvm/init.sh \
    && cp /workspace/MEGARACSP/native-kvm/build/ami-kvm-server \
        /workspace/MEGARACSP/work/payloads/native-kvm/ami-kvm-server \
    && cp /workspace/MEGARACSP/native-kvm/run-ami-kvm-with-videocap.sh \
        /workspace/MEGARACSP/work/payloads/native-kvm/run-ami-kvm-with-videocap.sh \
    && cp /workspace/MEGARACSP/native-kvm/videocap-src/videocap.ko \
        /workspace/MEGARACSP/work/payloads/native-kvm/videocap.ko \
    && cp -R /workspace/MEGARACSP/native-kvm/vendor/novnc \
        /workspace/MEGARACSP/work/payloads/native-kvm/vendor/novnc \
    && cp /workspace/MEGARACSP/payload/dio/dio.c \
        /workspace/MEGARACSP/payload/dio/dio.sh \
        /workspace/MEGARACSP/payload/dio/README.md \
        /workspace/MEGARACSP/work/payloads/dio/ \
    && cp /tmp/dio /workspace/MEGARACSP/work/payloads/dio/dio \
    && chmod 755 /workspace/MEGARACSP/work/payloads/native-kvm/init.sh \
        /workspace/MEGARACSP/work/payloads/native-kvm/ami-kvm-server \
        /workspace/MEGARACSP/work/payloads/native-kvm/run-ami-kvm-with-videocap.sh \
        /workspace/MEGARACSP/work/payloads/dio/dio \
        /workspace/MEGARACSP/work/payloads/dio/dio.sh

RUN /workspace/MEGARACSP/scripts/build-payload-slot.sh \
        /workspace/MEGARACSP/work/payload-slot.cramfs \
        /workspace/MEGARACSP/work/payloads/native-kvm \
        /workspace/MEGARACSP/work/payloads/dio \
        /workspace/MEGARACSP/work/payloads/tools \
    && /workspace/MEGARACSP/scripts/build-root-cramfs.sh \
        /tmp/partitions/50_root.cramfs \
        /tmp/payload-loop \
        /workspace/MEGARACSP/scripts/payload-bootstrap.sh \
        /workspace/MEGARACSP/work/payload-root.cramfs \
        --drop-legacy-zoneinfo

COPY eth-mac*.txt version.txt /workspace/MEGARACSP/

RUN /workspace/MEGARACSP/scripts/build-mac-version-image.sh --payload \
        /workspace/MEGARACSP/work/payload-root.cramfs \
        /workspace/MEGARACSP/work/payload-slot.cramfs \
        /workspace/MEGARACSP/work/IMB760_BMC_payload-final.bin

FROM scratch AS artifact
COPY --from=build /workspace/MEGARACSP/work/IMB760_BMC_payload-final.bin /
