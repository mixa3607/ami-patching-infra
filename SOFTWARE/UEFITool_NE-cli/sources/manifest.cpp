#include "manifest.h"
#include "firmware.h"
#include <cstdlib>
#include <fstream>
#include <stdexcept>
#include <yaml-cpp/yaml.h>

using json = nlohmann::json;

static json yamlJson(const YAML::Node &node)
{
    if (node.IsNull()) return nullptr;
    if (node.IsSequence()) { json a = json::array(); for (std::size_t i = 0; i < node.size(); ++i) a.push_back(yamlJson(node[i])); return a; }
    if (node.IsMap()) { json o = json::object(); for (YAML::const_iterator i = node.begin(); i != node.end(); ++i) o[i->first.as<std::string>()] = yamlJson(i->second); return o; }
    const std::string value = node.as<std::string>();
    if (value == "true") return true;
    if (value == "false") return false;
    char *end = 0; long number = std::strtol(value.c_str(), &end, 0);
    if (end && *end == '\0') return number;
    return value;
}

std::vector<Extraction> readManifest(const std::string &path)
{
    json document;
    if (lowerString(path.substr(path.find_last_of('.') + 1)) == "yaml" || lowerString(path.substr(path.find_last_of('.') + 1)) == "yml")
        document = yamlJson(YAML::LoadFile(path));
    else { std::ifstream input(path.c_str()); if (!input) throw std::runtime_error("cannot open manifest: " + path); input >> document; }
    if (!document.is_object() || document.value("schema_version", 0) != 1
        || !document.contains("outputs") || !document["outputs"].is_array()
        || document["outputs"].empty())
        throw std::runtime_error("manifest must contain schema_version: 1 and a non-empty outputs array");
    std::vector<Extraction> result;
    for (json::const_iterator i = document["outputs"].begin(); i != document["outputs"].end(); ++i) {
        if (!i->is_object() || !i->contains("path") || !i->contains("output"))
            throw std::runtime_error("each output needs path and output");
        if (!(*i)["path"].is_array() || (*i)["path"].empty())
            throw std::runtime_error("path must be a non-empty array");
        Extraction item;
        for (json::const_iterator segment = (*i)["path"].begin(); segment != (*i)["path"].end(); ++segment) {
            if (!segment->is_object() || !segment->contains("kind") || !segment->at("kind").is_string())
                throw std::runtime_error("each path segment needs a string kind");
            PathSegment value;
            value.kind = lowerString(segment->at("kind").get<std::string>());
            if (value.kind == "section" && segment->contains("type"))
                throw std::runtime_error("section selectors use string subtype from inspect, not type");
            if (value.kind == "section" && (!segment->contains("subtype") || !segment->at("subtype").is_string()))
                throw std::runtime_error("section selectors need string subtype from inspect");
            value.selector = *segment;
            value.selector.erase("kind");
            item.path.push_back(value);
        }
        item.output = (*i)["output"].get<std::string>();
        item.outputMode = i->value("outputMode", "body");
        if (item.outputMode != "body" && item.outputMode != "section") throw std::runtime_error("outputMode must be body or section");
        result.push_back(item);
    }
    return result;
}
