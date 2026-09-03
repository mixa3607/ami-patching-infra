#ifndef UEFITOOL_CLI_EXTRACT_H
#define UEFITOOL_CLI_EXTRACT_H
#include "firmware.h"
#include "manifest.h"
void extractManifest(const FirmwareImage &image, const std::vector<Extraction> &items, const std::string &outputDir);
#endif
