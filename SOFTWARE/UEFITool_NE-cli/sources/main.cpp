#include <fstream>
#include <iostream>
#include <stdexcept>

#include <CLI/CLI.hpp>
#include "extract.h"
#include "inspect.h"

static void writeJson(const nlohmann::json &value, const std::string &path, bool pretty)
{
    std::ostream *out = &std::cout;
    std::ofstream file;
    if (!path.empty() && path != "-") { file.open(path.c_str()); if (!file) throw std::runtime_error("cannot open output: " + path); out = &file; }
    *out << (pretty ? value.dump(2) : value.dump()) << '\n';
}

int main(int argc, char **argv)
{
    CLI::App app{"UEFI firmware inspection and binary extraction CLI"};
    app.require_subcommand(1);
    std::string imagePath, inspectOutput, manifestPath, outputDir;
    bool pretty = false, addPaths = false;
    CLI::App *inspect = app.add_subcommand("inspect", "Parse an image and export its normalized tree");
    inspect->add_option("image", imagePath, "Input UEFI/SPI image")->required()->check(CLI::ExistingFile);
    inspect->add_option("-o,--output", inspectOutput, "Write JSON to this file; use - for stdout");
    inspect->add_flag("--pretty", pretty, "Pretty-print JSON");
    inspect->add_flag("--add-paths", addPaths, "Add extract/apply-compatible paths to supported entities");
    CLI::App *extract = app.add_subcommand("extract", "Extract binary sections selected by a manifest");
    extract->add_option("image", imagePath, "Input UEFI/SPI image")->required()->check(CLI::ExistingFile);
    extract->add_option("manifest", manifestPath, "JSON or YAML extraction manifest")->required()->check(CLI::ExistingFile);
    extract->add_option("output-dir", outputDir, "Output directory")->required();
    CLI11_PARSE(app, argc, argv);
    try {
        FirmwareImage firmware;
        firmware.parse(imagePath);
        if (*inspect) writeJson(inspectJson(firmware, addPaths), inspectOutput, pretty);
        else extractManifest(firmware, readManifest(manifestPath), outputDir);
    } catch (const std::exception &error) {
        std::cerr << "error: " << error.what() << '\n';
        return 2;
    }
    return 0;
}
