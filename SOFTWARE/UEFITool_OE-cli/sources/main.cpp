#include <iostream>
#include <stdexcept>

#include <QCoreApplication>
#include <CLI/CLI.hpp>

#include "manifest.h"
#include "replace.h"

int main(int argc, char **argv)
{
    QCoreApplication qtApplication(argc, argv);
    CLI::App app{"Old Engine firmware replacement CLI"};
    app.require_subcommand(1);

    std::string imagePath;
    std::string manifestPath;
    std::string outputPath;
    CLI::App *replace = app.add_subcommand("replace", "Apply manifest replacements to an output image");
    replace->add_option("image", imagePath, "Input UEFI/SPI image")->required()->check(CLI::ExistingFile);
    replace->add_option("manifest", manifestPath, "JSON or YAML replacement manifest")->required()->check(CLI::ExistingFile);
    replace->add_option("output", outputPath, "New output image path")->required();

    CLI11_PARSE(app, argc, argv);
    try {
        applyReplacements(imagePath, readManifest(manifestPath), outputPath);
    } catch (const std::exception &error) {
        std::cerr << "error: " << error.what() << '\n';
        return 2;
    }
    return 0;
}
