# syntax=docker/dockerfile:1.7
FROM ubuntu:24.04 AS build

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        git \
        imagemagick \
        fontconfig \
        fonts-dejavu-core \
        jq \
        nodejs \
        python3 \
        libqt5core5t64 \
        libdouble-conversion3 \
        libglib2.0-0t64 \
        libicu74 \
        libpcre2-16-0 \
        libpcre2-8-0 \
        libzstd1 \
        zlib1g \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# ImageMagick needs an explicit font inside minimal containers
ENV FONT_NAME=DejaVu-Sans

# Contexts: AMI/ is the default (.), SOFTWARE/ and MCODES/ are passed via
# --build-context sw=../SOFTWARE --build-context mc=../MCODES by build-docker.sh
COPY . /workspace/AMI/
COPY --from=sw / /workspace/SOFTWARE/
COPY --from=mc / /workspace/MCODES/

# Version is passed explicitly; env.sh falls back to git tag/sha if unset.
ARG REPO_GIT_REF=build

RUN chmod +x /workspace/AMI/build-ver.sh \
              /workspace/AMI/env.sh \
              /workspace/SOFTWARE/UEFITool_0.28.0/UEFIReplace \
              /workspace/SOFTWARE/UEFITool_NE_A72_win64/uefiextract \
              /workspace/SOFTWARE/UEFITool_NE_A72_win64/uefifind \
              /workspace/SOFTWARE/UEFITool_NE_A72_win64/uefitool \
              /workspace/SOFTWARE/IFRExtractor-RS_v1.6.0/ifrextractor \
              /workspace/SOFTWARE/uefi-mod-tools_v1.3.0/uefi-mod-tools \
    && cd /workspace/AMI \
    && REPO_GIT_REF="$REPO_GIT_REF" ./build-ver.sh

FROM scratch AS artifact
COPY --from=build /workspace/AMI/build-*/IMB760_BIOS_AMI_mixa3607_mod-*.rom /
