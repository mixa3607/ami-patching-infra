#include "firmware.h"

#include <algorithm>
#include <cctype>
#include <cstdio>
#include <stdexcept>

#include "filesystem.h"

std::string lowerString(std::string value)
{
    std::transform(value.begin(), value.end(), value.begin(),
        [](unsigned char c) { return (char)std::tolower(c); });
    return value;
}

std::string localString(const UString &value) { return std::string(value.toLocal8Bit()); }

std::string hexValue(unsigned value, unsigned width)
{
    char buffer[20];
    if (width)
        std::snprintf(buffer, sizeof(buffer), "0x%0*X", width, value);
    else
        std::snprintf(buffer, sizeof(buffer), "0x%X", value);
    return buffer;
}

unsigned nodeSize(const FirmwareNode &node)
{
    return node.headerSize + node.bodySize + node.tailSize;
}

static std::string makeId(const std::string &kind, unsigned offset, unsigned size)
{
    return lowerString(kind) + ":" + hexValue(offset, 8) + ":" + hexValue(size);
}

static std::string collect(TreeModel *model, const UModelIndex &index,
                           const std::string &parent, std::vector<FirmwareNode> &nodes)
{
    FirmwareNode node;
    node.kind = lowerString(localString(itemTypeToUString(model->type(index))));
    node.type = model->type(index);
    node.subtypeValue = model->subtype(index);
    node.subtype = lowerString(localString(itemSubtypeToUString(node.type, node.subtypeValue)));
    node.name = localString(model->name(index));
    node.offset = model->base(index);
    node.headerSize = model->header(index).size();
    node.bodySize = model->body(index).size();
    node.tailSize = model->tail(index).size();
    node.id = makeId(node.kind, node.offset, nodeSize(node));
    node.parent = parent;
    node.index = index;
    nodes.push_back(node);
    const std::size_t nodePosition = nodes.size() - 1;
    for (int i = 0; i < model->rowCount(index); ++i) {
        const std::string child = collect(model, model->index(i, 0, index), node.id, nodes);
        nodes[nodePosition].children.push_back(child);
    }
    return node.id;
}

void FirmwareImage::parse(const std::string &path)
{
    if (!readFileIntoBuffer(getAbsPath(UString(path.c_str())), data))
        throw std::runtime_error("cannot read input image: " + path);
    FfsParser parser(&model);
    USTATUS status = parser.parse(data);
    if (status)
        throw std::runtime_error("parser failed with status " + std::to_string((unsigned)status));
    nodes.clear();
    if (model.rowCount() > 0) {
        std::string root = collect(&model, model.index(0, 0), "", nodes);
        (void)root;
    }
}
