#ifndef UEFITOOL_OE_CLI_MANIFEST_H
#define UEFITOOL_OE_CLI_MANIFEST_H

#include <string>
#include <vector>

struct Replacement {
    std::string name;
    std::string guid;
    std::string subtype;
    std::string input;
    std::string mode;
};

std::vector<Replacement> readManifest(const std::string &path);

#endif
