#ifndef UEFITOOL_OE_CLI_REPLACE_H
#define UEFITOOL_OE_CLI_REPLACE_H

#include <string>
#include <vector>

#include "manifest.h"

void applyReplacements(const std::string &imagePath, const std::vector<Replacement> &items,
                       const std::string &outputPath);

#endif
