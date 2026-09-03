#ifndef UEFITOOL_CLI_MANIFEST_H
#define UEFITOOL_CLI_MANIFEST_H
#include <string>
#include <vector>
#include <nlohmann/json.hpp>

struct PathSegment {
    std::string kind;
    nlohmann::json selector;
};

struct Extraction {
    std::vector<PathSegment> path;
    std::string output;
    std::string outputMode;
};

std::vector<Extraction> readManifest(const std::string &path);
#endif
