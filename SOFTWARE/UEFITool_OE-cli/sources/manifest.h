#ifndef UEFITOOL_OE_CLI_MANIFEST_H
#define UEFITOOL_OE_CLI_MANIFEST_H

#include <string>
#include <vector>

struct PathSegment {
    std::string kind;
    std::string subtype;
    std::string guid;
    bool hasIndex;
    unsigned index;
};

struct Operation {
    std::string name;
    std::string action;
    std::vector<PathSegment> path;
    std::string input;
    std::string inputMode;
    std::string position;
};

std::vector<Operation> readManifest(const std::string &path, const std::string &inputDir);

#endif
