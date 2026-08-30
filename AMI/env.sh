function git_get_current_tag {
  if [ "$1" != "" ]; then pushd "$1" > /dev/null; fi
  git tag --points-at HEAD | sed 's|+||g'
  if [ "$1" != "" ]; then popd > /dev/null; fi
}

function git_get_current_sha {
  if [ "$1" != "" ]; then pushd "$1" > /dev/null; fi
  git rev-parse --short HEAD
  if [ "$1" != "" ]; then popd > /dev/null; fi
}

if [ "$REPO_GIT_REF" == "" ]; then
  REPO_GIT_REF="$(git_get_current_tag)"
fi
if [ "$REPO_GIT_REF" == "" ]; then
  REPO_GIT_REF="$(git_get_current_sha)"
fi

if [ "$REPO_GIT_REF" == "" ]; then
  PATCH_VERSION="v$(date +%Y%m%d%H%M%S)"
else
  PATCH_VERSION=$REPO_GIT_REF
fi


BASE_DUMP="boards/imb760/base/IMB760_BIOS.bin"
PATCHED_DUMP="IMB760_BIOS_AMI_mixa3607_mod-$PATCH_VERSION.rom"
SOURCES_DIR="$PWD"
BOARD_DIR="$SOURCES_DIR/boards/imb760"
BUILD_DIR="$PWD/build/$PATCH_VERSION"
TOOLS_DIR="$PWD/../SOFTWARE"

NODE_BIN="$(ls /home/mixa3607/.nvm/versions/node/*/bin/node 2>/dev/null | tail -1)"
if [ -f "$NODE_BIN" ]; then
  export PATH="$(dirname "$NODE_BIN"):$PATH"
fi

uefireplace="$TOOLS_DIR/UEFITool_0.28.0/UEFIReplace"
uefimodtools="$TOOLS_DIR/uefi-mod-tools_v1.3.0/uefi-mod-tools"
uefieditorcli="node $TOOLS_DIR/uefi-editor-cli/index.mjs"
