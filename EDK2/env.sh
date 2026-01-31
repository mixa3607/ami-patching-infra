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


BASE_DUMP="IMB760_EDK2_BIOS.bin"
PATCHED_DUMP="IMB760_BIOS_EDK2_mixa3607_mod-$PATCH_VERSION.rom"
SOURCES_DIR="$PWD"
BUILD_DIR="$PWD/build-$PATCH_VERSION"
TOOLS_DIR="$PWD/../SOFTWARE"

uefireplace="$TOOLS_DIR/UEFITool_0.28.0/UEFIReplace"
uefimodtools="$TOOLS_DIR/uefi-mod-tools_v1.3.0/uefi-mod-tools"
