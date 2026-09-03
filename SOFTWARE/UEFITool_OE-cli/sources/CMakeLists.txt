cmake_minimum_required(VERSION 3.16)

project(uefitool-oe-cli LANGUAGES C CXX)

set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)
set(CMAKE_AUTOMOC ON)

set(OLD_SOURCES "${CMAKE_CURRENT_SOURCE_DIR}/../../UEFITool_0.28.0/sources")

find_package(Qt5 REQUIRED COMPONENTS Core)

include(FetchContent)
FetchContent_Declare(CLI11
    URL https://github.com/CLIUtils/CLI11/archive/refs/tags/v2.4.2.tar.gz
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
FetchContent_Declare(nlohmann_json
    URL https://github.com/nlohmann/json/archive/refs/tags/v3.11.3.tar.gz
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
FetchContent_Declare(yaml_cpp
    URL https://github.com/jbeder/yaml-cpp/archive/refs/tags/0.8.0.tar.gz
    DOWNLOAD_EXTRACT_TIMESTAMP TRUE)
set(YAML_CPP_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(YAML_CPP_BUILD_TOOLS OFF CACHE BOOL "" FORCE)
FetchContent_MakeAvailable(CLI11 nlohmann_json yaml_cpp)

add_executable(uefitool-oe-cli
    main.cpp
    manifest.cpp
    replace.cpp
    "${OLD_SOURCES}/types.cpp"
    "${OLD_SOURCES}/descriptor.cpp"
    "${OLD_SOURCES}/ffs.cpp"
    "${OLD_SOURCES}/ffsengine.cpp"
    "${OLD_SOURCES}/peimage.cpp"
    "${OLD_SOURCES}/treeitem.cpp"
    "${OLD_SOURCES}/treemodel.cpp"
    "${OLD_SOURCES}/LZMA/LzmaCompress.c"
    "${OLD_SOURCES}/LZMA/LzmaDecompress.c"
    "${OLD_SOURCES}/LZMA/SDK/C/LzFind.c"
    "${OLD_SOURCES}/LZMA/SDK/C/LzmaDec.c"
    "${OLD_SOURCES}/LZMA/SDK/C/LzmaEnc.c"
    "${OLD_SOURCES}/LZMA/SDK/C/Bra86.c"
    "${OLD_SOURCES}/Tiano/EfiTianoDecompress.c"
    "${OLD_SOURCES}/Tiano/EfiTianoCompress.c"
    "${OLD_SOURCES}/Tiano/EfiTianoCompressLegacy.c"
)
target_include_directories(uefitool-oe-cli PRIVATE "${OLD_SOURCES}" "${OLD_SOURCES}/UEFIReplace")
target_compile_definitions(uefitool-oe-cli PRIVATE _CONSOLE)
target_link_libraries(uefitool-oe-cli PRIVATE
    Qt5::Core
    CLI11::CLI11
    nlohmann_json::nlohmann_json
    yaml-cpp::yaml-cpp
)
