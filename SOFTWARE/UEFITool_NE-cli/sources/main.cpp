#include <algorithm>
#include <cctype>
#include <cstdio>
#include <fstream>
#include <iostream>
#include <stdexcept>
#include <string>
#include <vector>

#include <CLI/CLI.hpp>
#include <nlohmann/json.hpp>

#include "ffsparser.h"
#include "filesystem.h"
#include "types.h"

using json = nlohmann::json;

struct Entity {
    std::string id;
    std::string kind;
    std::string subtype;
    std::string name;
    UINT32 offset = 0;
    UINT32 size = 0;
    std::string parent;
    std::vector<std::string> children;
};

static std::string lower(std::string value)
{
    std::transform(value.begin(), value.end(), value.begin(),
        [](unsigned char c) { return (char)std::tolower(c); });
    return value;
}

static std::string local8(const UString &value)
{
    return std::string(value.toLocal8Bit());
}

static std::string hexValue(UINT32 value, unsigned width = 0)
{
    char buffer[16];
    if (width)
        std::snprintf(buffer, sizeof(buffer), "0x%0*X", width, value);
    else
        std::snprintf(buffer, sizeof(buffer), "0x%X", value);
    return buffer;
}

static UINT32 entitySize(const TreeModel *model, const UModelIndex &index)
{
    return (UINT32)(model->header(index).size()
        + model->body(index).size() + model->tail(index).size());
}

static std::string entityId(const std::string &kind, UINT32 offset, UINT32 size)
{
    return lower(kind) + ":" + hexValue(offset, 8) + ":" + hexValue(size);
}

static std::string collectTree(const TreeModel *model, const UModelIndex &index,
                               const std::string &parent,
                               std::vector<Entity> &entities)
{
    const std::string kind = local8(itemTypeToUString(model->type(index)));
    Entity entity;
    entity.kind = lower(kind);
    entity.subtype = lower(local8(itemSubtypeToUString(model->type(index), model->subtype(index))));
    entity.name = local8(model->name(index));
    entity.offset = model->base(index);
    entity.size = entitySize(model, index);
    entity.id = entityId(kind, entity.offset, entity.size);
    entity.parent = parent;

    for (int i = 0; i < model->rowCount(index); ++i)
        entity.children.push_back(collectTree(model, model->index(i, 0, index), entity.id, entities));

    entities.push_back(entity);
    return entity.id;
}

static json entityJson(const Entity &entity)
{
    json result = {
        {"kind", entity.kind},
        {"subtype", entity.subtype},
        {"name", entity.name},
        {"offset", entity.offset},
        {"offset_hex", hexValue(entity.offset, 8)},
        {"size", entity.size},
        {"size_hex", hexValue(entity.size)},
        {"children", entity.children}
    };
    if (!entity.parent.empty())
        result["parent"] = entity.parent;
    return result;
}

static json inspectImage(const std::string &input)
{
    UByteArray buffer;
    if (!readFileIntoBuffer(getAbsPath(UString(input.c_str())), buffer))
        throw std::runtime_error("cannot read input image: " + input);

    TreeModel model;
    FfsParser parser(&model);
    const USTATUS status = parser.parse(buffer);
    if (status)
        throw std::runtime_error("parser failed with status " + std::to_string((UINT32)status));

    std::vector<Entity> entities;
    const std::string root = collectTree(&model, model.index(0, 0), "", entities);
    std::reverse(entities.begin(), entities.end());

    json result = {
        {"schema_version", 1},
        {"input_size", buffer.size()},
        {"roots", {root}},
        {"entities", json::object()}
    };
    for (const Entity &entity : entities)
        result["entities"][entity.id] = entityJson(entity);
    return result;
}

int main(int argc, char **argv)
{
    CLI::App app{"Read-only inspection CLI for UEFI images"};
    app.require_subcommand(1);

    std::string input;
    std::string output;
    bool pretty = false;
    CLI::App *inspect = app.add_subcommand("inspect", "Parse an image and export its normalized tree");
    inspect->add_option("image", input, "Input UEFI/SPI image")->required()->check(CLI::ExistingFile);
    inspect->add_option("-o,--output", output, "Write JSON to this file instead of stdout");
    inspect->add_flag("--pretty", pretty, "Pretty-print JSON");

    CLI11_PARSE(app, argc, argv);

    try {
        json result = inspectImage(input);
        std::ostream *stream = &std::cout;
        std::ofstream file;
        if (!output.empty()) {
            file.open(output);
            if (!file)
                throw std::runtime_error("cannot open output file: " + output);
            stream = &file;
        }
        *stream << (pretty ? result.dump(2) : result.dump()) << '\n';
    } catch (const std::exception &error) {
        std::cerr << "error: " << error.what() << '\n';
        return 2;
    }
    return 0;
}
