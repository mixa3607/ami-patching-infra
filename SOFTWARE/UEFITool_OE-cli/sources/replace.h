#ifndef UEFITOOL_OE_CLI_REPLACE_H
#define UEFITOOL_OE_CLI_REPLACE_H

#include <string>
#include <vector>

#include "manifest.h"

void applyOperations(const std::string &imagePath, const std::vector<Operation> &items,
                     const std::string &outputPath);

#endif
