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

static std::string manifestInputPath(const std::string &manifestPath, const std::string &input,
                                     const std::string &inputDir)
{
    const QFileInfo inputInfo(QString::fromStdString(input));
    if (inputInfo.isAbsolute()) return input;
    if (!inputDir.empty())
        return QDir(QString::fromStdString(inputDir)).absoluteFilePath(QString::fromStdString(input)).toStdString();
    return QDir(QFileInfo(QString::fromStdString(manifestPath)).absolutePath())
        .absoluteFilePath(QString::fromStdString(input)).toStdString();
}

static std::string requiredString(const json &value, const char *field, std::size_t index)
{
    if (!value.contains(field) || !value.at(field).is_string() || value.at(field).get<std::string>().empty())
        throw std::runtime_error("operation " + std::to_string(index) + " needs non-empty string " + field);
    return value.at(field).get<std::string>();
}

static PathSegment readPathSegment(const json &value, std::size_t operationIndex, std::size_t segmentIndex)
{
    if (!value.is_object())
        throw std::runtime_error("operation " + std::to_string(operationIndex) + " path segment " + std::to_string(segmentIndex) + " must be an object");

    PathSegment segment;
    segment.kind = lowerString(requiredString(value, "kind", operationIndex));
    segment.subtype = value.value("subtype", "");
    segment.guid = value.value("guid", value.value("fsGuid", ""));
    segment.hasIndex = value.contains("index");
    segment.index = 0;
    if (segment.hasIndex) {
        if (!value["index"].is_number_integer() || value["index"].get<long long>() < 0)
            throw std::runtime_error("operation " + std::to_string(operationIndex) + " path segment " + std::to_string(segmentIndex) + " index must be a non-negative integer");
        segment.index = value["index"].get<unsigned>();
    }
    if (segment.kind != "region" && segment.kind != "volume" && segment.kind != "file" && segment.kind != "section")
        throw std::runtime_error("operation " + std::to_string(operationIndex) + " path segment " + std::to_string(segmentIndex) + " has unsupported kind: " + segment.kind);
    if (segment.kind == "region" || segment.kind == "section") {
        if (segment.subtype.empty())
            throw std::runtime_error("operation " + std::to_string(operationIndex) + " path segment " + std::to_string(segmentIndex) + " needs subtype");
    }
    if (segment.kind == "volume" || segment.kind == "file") {
        if (segment.guid.empty())
            throw std::runtime_error("operation " + std::to_string(operationIndex) + " path segment " + std::to_string(segmentIndex) + " needs " + (segment.kind == "volume" ? "fsGuid" : "guid"));
    }
    return segment;
}

std::vector<Operation> readManifest(const std::string &path, const std::string &inputDir)
{
    json document;
    const std::string extension = lowerString(path.substr(path.find_last_of('.') + 1));
    if (extension == "yaml" || extension == "yml") document = yamlJson(YAML::LoadFile(path));
    else { std::ifstream input(path.c_str()); if (!input) throw std::runtime_error("cannot open manifest: " + path); input >> document; }

    if (!document.is_object() || document.value("schema_version", 0) != 1
        || !document.contains("operations") || !document["operations"].is_array()
        || document["operations"].empty())
        throw std::runtime_error("manifest must contain schema_version: 1 and a non-empty operations array");

    std::vector<Operation> result;
    for (std::size_t index = 0; index < document["operations"].size(); ++index) {
        const json &value = document["operations"][index];
        if (!value.is_object()) throw std::runtime_error("operation " + std::to_string(index) + " must be an object");
        Operation item;
        item.name = value.value("name", "");
        item.action = requiredString(value, "action", index);
        if (item.action != "replace" && item.action != "delete" && item.action != "insert")
            throw std::runtime_error("operation " + std::to_string(index) + " action must be replace, delete, or insert");
        if (!value.contains("path") || !value["path"].is_array() || value["path"].empty())
            throw std::runtime_error("operation " + std::to_string(index) + " needs a non-empty path array");
        for (std::size_t segment = 0; segment < value["path"].size(); ++segment)
            item.path.push_back(readPathSegment(value["path"][segment], index, segment));
        if (item.action == "delete") {
            if (value.contains("input") || value.contains("inputMode") || value.contains("position"))
                throw std::runtime_error("delete operation " + std::to_string(index) + " only accepts name, action, and path");
        }
        else {
            item.input = manifestInputPath(path, requiredString(value, "input", index), inputDir);
            item.inputMode = value.value("inputMode", "body");
            if (item.inputMode != "body" && item.inputMode != "section" && item.inputMode != "file")
                throw std::runtime_error("operation " + std::to_string(index) + " inputMode must be body, section, or file");
            if (!QFileInfo(QString::fromStdString(item.input)).isFile())
                throw std::runtime_error("operation " + std::to_string(index) + " input is not a file: " + item.input);
        }
        if (item.action == "insert") {
            item.position = value.value("position", "append");
            if (item.position != "append" && item.position != "prepend" && item.position != "before" && item.position != "after")
                throw std::runtime_error("insert operation " + std::to_string(index) + " position must be append, prepend, before, or after");
            if (item.inputMode == "body")
                throw std::runtime_error("insert operation " + std::to_string(index) + " inputMode must be section or file");
        }
        result.push_back(item);
    }
    return result;
}
