#include <iostream>
#include <stdexcept>

#include <QCoreApplication>
#include <CLI/CLI.hpp>

#include "manifest.h"
#include "replace.h"

int main(int argc, char **argv)
{
    QCoreApplication qtApplication(argc, argv);
    CLI::App app{"Old Engine firmware editing CLI"};
    app.require_subcommand(1);

    std::string imagePath;
    std::string manifestPath;
    std::string outputPath;
    std::string inputDir;
    CLI::App *apply = app.add_subcommand("apply", "Apply manifest operations to an output image");
    apply->add_option("image", imagePath, "Input UEFI/SPI image")->required()->check(CLI::ExistingFile);
    apply->add_option("manifest", manifestPath, "JSON or YAML operations manifest")->required()->check(CLI::ExistingFile);
    apply->add_option("output", outputPath, "New output image path")->required();
    apply->add_option("--input-dir", inputDir, "Base directory for relative input paths")->check(CLI::ExistingDirectory);

    CLI11_PARSE(app, argc, argv);
    try {
        applyOperations(imagePath, readManifest(manifestPath, inputDir), outputPath);
    } catch (const std::exception &error) {
        std::cerr << "error: " << error.what() << '\n';
        return 2;
    }
    return 0;
}
