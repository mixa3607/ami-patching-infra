#ifndef UEFITOOL_CLI_MANIFEST_H
#define UEFITOOL_CLI_MANIFEST_H
#include <string>
#include <vector>
#include <nlohmann/json.hpp>
struct Extraction { nlohmann::json source; std::string path; std::string outputMode; };
std::vector<Extraction> readManifest(const std::string &path);
#endif
