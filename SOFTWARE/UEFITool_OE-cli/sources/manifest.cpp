#include "manifest.h"

#include <cstdlib>
#include <fstream>
#include <stdexcept>

#include <QDir>
#include <QFileInfo>
#include <nlohmann/json.hpp>
#include <yaml-cpp/yaml.h>

using json = nlohmann::json;

static json yamlJson(const YAML::Node &node)
{
    if (node.IsNull()) return nullptr;
    if (node.IsSequence()) { json value = json::array(); for (std::size_t i = 0; i < node.size(); ++i) value.push_back(yamlJson(node[i])); return value; }
    if (node.IsMap()) { json value = json::object(); for (YAML::const_iterator i = node.begin(); i != node.end(); ++i) value[i->first.as<std::string>()] = yamlJson(i->second); return value; }
    const std::string value = node.as<std::string>();
    char *end = 0;
    const long number = std::strtol(value.c_str(), &end, 0);
    if (end && *end == '\0') return number;
    return value;
}

static std::string lowerString(std::string value)
{
    for (std::size_t i = 0; i < value.size(); ++i)
        if (value[i] >= 'A' && value[i] <= 'Z') value[i] = value[i] - 'A' + 'a';
    return value;
}

static std::string manifestInputPath(const std::string &manifestPath, const std::string &input)
{
    const QFileInfo inputInfo(QString::fromStdString(input));
    if (inputInfo.isAbsolute()) return input;
    return QDir(QFileInfo(QString::fromStdString(manifestPath)).absolutePath())
        .absoluteFilePath(QString::fromStdString(input)).toStdString();
}

static std::string requiredString(const json &value, const char *field, std::size_t index)
{
    if (!value.contains(field) || !value.at(field).is_string() || value.at(field).get<std::string>().empty())
        throw std::runtime_error("replacement " + std::to_string(index) + " needs non-empty string " + field);
    return value.at(field).get<std::string>();
}

std::vector<Replacement> readManifest(const std::string &path)
{
    json document;
    const std::string extension = lowerString(path.substr(path.find_last_of('.') + 1));
    if (extension == "yaml" || extension == "yml") document = yamlJson(YAML::LoadFile(path));
    else { std::ifstream input(path.c_str()); if (!input) throw std::runtime_error("cannot open manifest: " + path); input >> document; }

    if (!document.is_object() || document.value("schema_version", 0) != 1
        || !document.contains("replacements") || !document["replacements"].is_array()
        || document["replacements"].empty())
        throw std::runtime_error("manifest must contain schema_version: 1 and a non-empty replacements array");

    std::vector<Replacement> result;
    for (std::size_t index = 0; index < document["replacements"].size(); ++index) {
        const json &value = document["replacements"][index];
        if (!value.is_object()) throw std::runtime_error("replacement " + std::to_string(index) + " must be an object");
        Replacement item;
        item.name = value.value("name", "");
        item.guid = requiredString(value, "guid", index);
        item.subtype = requiredString(value, "subtype", index);
        item.input = manifestInputPath(path, requiredString(value, "input", index));
        item.mode = value.value("mode", "body");
        if (item.mode != "body" && item.mode != "as_is")
            throw std::runtime_error("replacement " + std::to_string(index) + " mode must be body or as_is");
        if (!QFileInfo(QString::fromStdString(item.input)).isFile())
            throw std::runtime_error("replacement " + std::to_string(index) + " input is not a file: " + item.input);
        result.push_back(item);
    }
    return result;
}
