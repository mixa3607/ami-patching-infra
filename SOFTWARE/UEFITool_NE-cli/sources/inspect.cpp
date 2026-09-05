#include "inspect.h"

#include <map>

static bool isPathKind(const FirmwareNode &node)
{
    return node.kind == "region" || node.kind == "volume" || node.kind == "file" || node.kind == "section";
}

static nlohmann::json pathSelector(const FirmwareNode &node)
{
    nlohmann::json selector = {{"kind", node.kind}};
    if (node.kind == "region" || node.kind == "section") selector["subtype"] = node.subtype;
    else if (node.kind == "volume") selector["fsGuid"] = node.name;
    else if (node.kind == "file") selector["guid"] = node.name;
    return selector;
}

static bool matchesPathSelector(const FirmwareNode &node, const nlohmann::json &selector)
{
    if (node.kind != selector.at("kind").get<std::string>()) return false;
    if (selector.contains("subtype") && node.subtype != selector.at("subtype").get<std::string>()) return false;
    if (selector.contains("guid") && lowerString(node.name) != lowerString(selector.at("guid").get<std::string>())) return false;
    if (selector.contains("fsGuid") && lowerString(node.name) != lowerString(selector.at("fsGuid").get<std::string>())) return false;
    return true;
}

typedef std::map<std::string, const FirmwareNode *> NodeIndex;
typedef std::map<std::string, std::vector<const FirmwareNode *> > DescendantIndex;

static void buildPathIndexes(const std::vector<FirmwareNode> &nodes, NodeIndex &nodesById,
                             DescendantIndex &descendantsByParent)
{
    for (std::vector<FirmwareNode>::const_iterator it = nodes.begin(); it != nodes.end(); ++it)
        nodesById[it->id] = &*it;

    for (std::vector<FirmwareNode>::const_iterator it = nodes.begin(); it != nodes.end(); ++it) {
        std::string parent = it->parent;
        while (!parent.empty()) {
            descendantsByParent[parent].push_back(&*it);
            NodeIndex::const_iterator parentNode = nodesById.find(parent);
            if (parentNode == nodesById.end()) break;
            parent = parentNode->second->parent;
        }
    }
}

static nlohmann::json pathFor(const FirmwareNode &target, const NodeIndex &nodesById,
                              const DescendantIndex &descendantsByParent)
{
    if (target.kind == "image") return nlohmann::json();

    std::vector<const FirmwareNode *> chain;
    const FirmwareNode *current = &target;
    while (current->kind != "image") {
        if (!isPathKind(*current)) return nlohmann::json();
        chain.push_back(current);
        NodeIndex::const_iterator parent = nodesById.find(current->parent);
        if (parent == nodesById.end()) return nlohmann::json();
        current = parent->second;
    }

    nlohmann::json path = nlohmann::json::array();
    std::string parent = current->id;
    for (std::vector<const FirmwareNode *>::reverse_iterator it = chain.rbegin(); it != chain.rend(); ++it) {
        nlohmann::json selector = pathSelector(**it);
        unsigned count = 0;
        unsigned selectedIndex = 0;
        DescendantIndex::const_iterator candidates = descendantsByParent.find(parent);
        if (candidates == descendantsByParent.end()) return nlohmann::json();
        for (std::vector<const FirmwareNode *>::const_iterator candidate = candidates->second.begin(); candidate != candidates->second.end(); ++candidate) {
            if (matchesPathSelector(**candidate, selector)) {
                if ((*candidate)->id == (*it)->id) selectedIndex = count;
                ++count;
            }
        }
        if (count != 1) selector["index"] = selectedIndex;
        path.push_back(selector);
        parent = (*it)->id;
    }
    return path;
}

nlohmann::json inspectJson(const FirmwareImage &image, bool addPaths)
{
    nlohmann::json result = {{"schema_version", 2}, {"input_size", image.data.size()},
                             {"roots", nlohmann::json::array()}, {"entities", nlohmann::json::object()}};
    NodeIndex nodesById;
    DescendantIndex descendantsByParent;
    if (addPaths) buildPathIndexes(image.nodes, nodesById, descendantsByParent);
    for (std::vector<FirmwareNode>::const_iterator it = image.nodes.begin(); it != image.nodes.end(); ++it) {
        const FirmwareNode &n = *it;
        nlohmann::json value = {{"kind", n.kind}, {"type", n.type}, {"type_hex", hexValue(n.type, 2)},
            {"subtype", n.subtype}, {"subtype_value", n.subtypeValue},
            {"subtype_hex", hexValue(n.subtypeValue, 2)}, {"name", n.name},
            {"offset", n.offset}, {"offset_hex", hexValue(n.offset, 8)}, {"size", nodeSize(n)},
            {"size_hex", hexValue(nodeSize(n))}, {"header_size", n.headerSize},
            {"body_size", n.bodySize}, {"tail_size", n.tailSize}, {"children", n.children}};
        if (n.kind == "file" || n.kind == "volume") value["guid"] = n.name;
        if (addPaths) {
            const nlohmann::json path = pathFor(n, nodesById, descendantsByParent);
            if (!path.is_null()) value["path"] = path;
        }
        if (!n.parent.empty()) value["parent"] = n.parent;
        else result["roots"].push_back(n.id);
        result["entities"][n.id] = value;
    }
    return result;
}
