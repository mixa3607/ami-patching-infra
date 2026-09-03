#include "inspect.h"

nlohmann::json inspectJson(const FirmwareImage &image)
{
    nlohmann::json result = {{"schema_version", 2}, {"input_size", image.data.size()},
                             {"roots", nlohmann::json::array()}, {"entities", nlohmann::json::object()}};
    for (std::vector<FirmwareNode>::const_iterator it = image.nodes.begin(); it != image.nodes.end(); ++it) {
        const FirmwareNode &n = *it;
        nlohmann::json value = {{"kind", n.kind}, {"type", n.type}, {"type_hex", hexValue(n.type, 2)},
            {"subtype", n.subtype}, {"subtype_value", n.subtypeValue},
            {"subtype_hex", hexValue(n.subtypeValue, 2)}, {"name", n.name},
            {"offset", n.offset}, {"offset_hex", hexValue(n.offset, 8)}, {"size", nodeSize(n)},
            {"size_hex", hexValue(nodeSize(n))}, {"header_size", n.headerSize},
            {"body_size", n.bodySize}, {"tail_size", n.tailSize}, {"children", n.children}};
        if (n.kind == "file" || n.kind == "volume") value["guid"] = n.name;
        if (!n.parent.empty()) value["parent"] = n.parent;
        else result["roots"].push_back(n.id);
        result["entities"][n.id] = value;
    }
    return result;
}
