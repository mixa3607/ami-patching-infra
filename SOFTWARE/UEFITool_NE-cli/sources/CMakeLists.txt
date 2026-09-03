cmake_minimum_required(VERSION 3.16)

project(uefitool-cli LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

set(UEFIToolSources "${CMAKE_CURRENT_SOURCE_DIR}/../../UEFITool_NE_A72_win64/sources")
set(UEFIToolCommon "${UEFIToolSources}/common")

set(COMMON_SOURCES
    "${UEFIToolCommon}/guiddatabase.cpp"
    "${UEFIToolCommon}/types.cpp"
    "${UEFIToolCommon}/descriptor.cpp"
    "${UEFIToolCommon}/filesystem.cpp"
    "${UEFIToolCommon}/ffs.cpp"
    "${UEFIToolCommon}/nvram.cpp"
    "${UEFIToolCommon}/nvramparser.cpp"
    "${UEFIToolCommon}/meparser.cpp"
    "${UEFIToolCommon}/fitparser.cpp"
    "${UEFIToolCommon}/ffsparser.cpp"
    "${UEFIToolCommon}/ffsreport.cpp"
    "${UEFIToolCommon}/peimage.cpp"
    "${UEFIToolCommon}/treeitem.cpp"
    "${UEFIToolCommon}/treemodel.cpp"
    "${UEFIToolCommon}/utility.cpp"
    "${UEFIToolCommon}/ustring.cpp"
    "${UEFIToolCommon}/generated/ami_nvar.cpp"
    "${UEFIToolCommon}/generated/apple_sysf.cpp"
    "${UEFIToolCommon}/generated/dell_dvar.cpp"
    "${UEFIToolCommon}/generated/edk2_vss.cpp"
    "${UEFIToolCommon}/generated/edk2_vss2.cpp"
    "${UEFIToolCommon}/generated/edk2_ftw.cpp"
    "${UEFIToolCommon}/generated/insyde_fdc.cpp"
    "${UEFIToolCommon}/generated/insyde_fdm.cpp"
    "${UEFIToolCommon}/generated/ms_slic_marker.cpp"
    "${UEFIToolCommon}/generated/ms_slic_pubkey.cpp"
    "${UEFIToolCommon}/generated/phoenix_flm.cpp"
    "${UEFIToolCommon}/generated/phoenix_evsa.cpp"
    "${UEFIToolCommon}/generated/intel_acbp_v1.cpp"
    "${UEFIToolCommon}/generated/intel_acbp_v2.cpp"
    "${UEFIToolCommon}/generated/intel_keym_v1.cpp"
    "${UEFIToolCommon}/generated/intel_keym_v2.cpp"
    "${UEFIToolCommon}/generated/intel_acm.cpp"
    "${UEFIToolCommon}/kaitai/kaitaistream.cpp"
    "${UEFIToolCommon}/digest/sha1.c"
    "${UEFIToolCommon}/digest/sha256.c"
    "${UEFIToolCommon}/digest/sha512.c"
    "${UEFIToolCommon}/digest/sm3.c"
    "${UEFIToolCommon}/LZMA/LzmaDecompress.c"
    "${UEFIToolCommon}/LZMA/SDK/C/Bra86.c"
    "${UEFIToolCommon}/LZMA/SDK/C/LzmaDec.c"
    "${UEFIToolCommon}/Tiano/EfiTianoDecompress.c"
    "${UEFIToolCommon}/bstrlib/bstrlib.c"
    "${UEFIToolCommon}/bstrlib/bstrwrap.cpp"
)

find_package(ZLIB REQUIRED)

include(FetchContent)
FetchContent_Declare(CLI11
    URL https://github.com/CLIUtils/CLI11/archive/refs/tags/v2.4.2.tar.gz
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
FetchContent_Declare(nlohmann_json
    URL https://github.com/nlohmann/json/archive/refs/tags/v3.11.3.tar.gz
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
FetchContent_MakeAvailable(CLI11 nlohmann_json)

add_executable(uefitool-cli main.cpp ${COMMON_SOURCES})
target_include_directories(uefitool-cli PRIVATE "${UEFIToolCommon}")
target_compile_definitions(uefitool-cli PRIVATE
    U_ENABLE_NVRAM_PARSING_SUPPORT
    U_ENABLE_ME_PARSING_SUPPORT
    U_ENABLE_FIT_PARSING_SUPPORT
    U_ENABLE_GUID_DATABASE_SUPPORT
)
target_link_libraries(uefitool-cli PRIVATE
    ZLIB::ZLIB
    CLI11::CLI11
    nlohmann_json::nlohmann_json
)
