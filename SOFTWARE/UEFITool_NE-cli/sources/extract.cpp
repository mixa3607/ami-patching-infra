#include "extract.h"
#include <cerrno>
#include <fstream>
#include <stdexcept>
#include <sys/stat.h>

static std::string selectorName(std::string value)
{
    value = lowerString(value);
    std::string normalized;
    bool separator = false;
    for (std::size_t i = 0; i < value.size(); ++i) {
        if (value[i] == '-' || value[i] == '_' || value[i] == ' ') {
            separator = !normalized.empty();
        }
        else {
            if (separator) normalized += ' ';
            normalized += value[i];
            separator = false;
        }
    }
    return normalized;
}

static bool equals(const FirmwareNode &n, const std::string &kind, const nlohmann::json &selector)
{
    if (n.kind != kind || !selector.is_object()) return false;
    if (selector.contains("subtype") && selector["subtype"].is_string()
        && selectorName(n.subtype) != selectorName(selector["subtype"].get<std::string>())) return false;
    if (selector.contains("type") && selector["type"].is_number()) {
        const unsigned selectedType = selector["type"].get<unsigned>();
        if (n.type != selectedType) return false;
    }
    if (selector.contains("guid") && lowerString(n.name) != lowerString(selector["guid"].get<std::string>())) return false;
    if (selector.contains("fsGuid") && lowerString(n.name) != lowerString(selector["fsGuid"].get<std::string>())) return false;
    return true;
}

static bool below(const FirmwareNode &node, const std::string &ancestor,
                  const std::vector<FirmwareNode> &nodes)
{
    std::string parent = node.parent;
    while (!parent.empty()) {
        if (parent == ancestor) return true;
        std::string next;
        for (std::vector<FirmwareNode>::const_iterator i = nodes.begin(); i != nodes.end(); ++i)
            if (i->id == parent) { next = i->parent; break; }
        parent = next;
    }
    return false;
}

static void makeDirectory(const std::string &path)
{
    std::string current;
    for (std::size_t p = 0; p <= path.size(); ++p) if (p == path.size() || path[p] == '/') {
        current = path.substr(0, p); if (!current.empty() && mkdir(current.c_str(), 0755) && errno != EEXIST) throw std::runtime_error("cannot create output directory: " + current);
    }
}

void extractManifest(const FirmwareImage &image, const std::vector<Extraction> &items, const std::string &outputDir)
{
    makeDirectory(outputDir);
    for (std::vector<Extraction>::const_iterator item = items.begin(); item != items.end(); ++item) {
        std::string parent;
        for (std::vector<FirmwareNode>::const_iterator n = image.nodes.begin(); n != image.nodes.end(); ++n)
            if (n->kind == "image") { parent = n->id; break; }
        const FirmwareNode *match = 0;
        for (std::vector<PathSegment>::const_iterator segment = item->path.begin(); segment != item->path.end(); ++segment) {
            std::vector<const FirmwareNode *> found;
            for (std::vector<FirmwareNode>::const_iterator n = image.nodes.begin(); n != image.nodes.end(); ++n) {
                const bool parentMatch = n->parent == parent || below(*n, parent, image.nodes);
                if (parentMatch && equals(*n, segment->kind, segment->selector)) found.push_back(&*n);
            }
            if (segment->selector.contains("index")) { unsigned index = segment->selector["index"].get<unsigned>(); if (index >= found.size()) found.clear(); else { const FirmwareNode *chosen = found[index]; found.clear(); found.push_back(chosen); } }
            if (found.size() != 1) throw std::runtime_error("path segment " + segment->kind + " resolved to " + std::to_string(found.size()) + " nodes");
            match = found[0]; parent = match->id;
        }
        if (item->output.empty() || item->output[0] == '/' || item->output.find("..") != std::string::npos || item->output.find('\\') != std::string::npos)
            throw std::runtime_error("output path must be relative and cannot contain .. or backslashes: " + item->output);
        std::string destination = outputDir + "/" + item->output;
        std::size_t slash = destination.find_last_of('/'); if (slash != std::string::npos) makeDirectory(destination.substr(0, slash));
        UByteArray bytes = image.model.body(match->index);
        if (item->outputMode == "section") bytes = image.model.header(match->index) + bytes;
        std::ofstream output(destination.c_str(), std::ios::binary); if (!output) throw std::runtime_error("cannot open output: " + destination);
        output.write(bytes.constData(), bytes.size());
        if (!output) throw std::runtime_error("cannot write output: " + destination);
    }
}
