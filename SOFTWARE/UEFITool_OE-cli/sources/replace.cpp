#include "replace.h"

#include <stdexcept>
#include <vector>

#include <QFile>
#include <QFileInfo>
#include <QTemporaryFile>

#include "ffs.h"
#include "ffsengine.h"
#include "types.h"

static std::string normalized(std::string value)
{
    std::string result;
    bool separator = false;
    for (std::size_t i = 0; i < value.size(); ++i) {
        char character = value[i];
        if (character >= 'A' && character <= 'Z') character = character - 'A' + 'a';
        if (character == ' ' || character == '_' || character == '-') separator = !result.empty();
        else { if (separator) result += ' '; result += character; separator = false; }
    }
    return result;
}

static bool matchingSubtype(const std::string &actual, const std::string &selected)
{
    const std::string normalizedActual = normalized(actual);
    const std::string normalizedSelected = normalized(selected);
    if (normalizedActual == normalizedSelected) return true;
    return normalizedSelected == "ui" && normalizedActual == "user interface";
}

static std::string temporaryPath(const std::string &outputPath)
{
    const QFileInfo output(QString::fromStdString(outputPath));
    QTemporaryFile file(output.absolutePath() + "/.uefitool-oe-cli-XXXXXX");
    if (!file.open()) throw std::runtime_error("cannot create temporary output beside: " + outputPath);
    file.setAutoRemove(false);
    return file.fileName().toStdString();
}

static std::string resultDescription(UINT8 result)
{
    switch (result) {
    case ERR_NOTHING_TO_PATCH: return "no matching object was found";
    case ERR_NOT_IMPLEMENTED: return "Old Engine does not support this operation for the selected object";
    case ERR_INVALID_FILE: return "invalid or corrupted firmware image";
    case ERR_INVALID_SECTION: return "invalid section input";
    case ERR_INVALID_PARAMETER: return "invalid operation parameters";
    case ERR_BUFFER_TOO_SMALL: return "input is too small to contain its declared object type";
    case ERR_FILE_READ: return "cannot read input";
    case ERR_FILE_WRITE: return "cannot write output";
    default: return "Old Engine error " + std::to_string(result);
    }
}

static QByteArray readFile(const std::string &path)
{
    QFile file(QString::fromStdString(path));
    if (!file.open(QFile::ReadOnly)) throw std::runtime_error("cannot read: " + path);
    return file.readAll();
}

static bool matchesVolumeGuid(TreeModel *model, const QModelIndex &index, const std::string &guid)
{
    if (normalized(model->name(index).toStdString()) == normalized(guid)) return true;

    const QByteArray header = model->header(index);
    if (header.size() < static_cast<int>(sizeof(EFI_FIRMWARE_VOLUME_HEADER))) return false;
    const EFI_FIRMWARE_VOLUME_HEADER *volume = reinterpret_cast<const EFI_FIRMWARE_VOLUME_HEADER *>(header.constData());
    if (volume->Revision <= 1 || volume->ExtHeaderOffset == 0
        || header.size() < volume->ExtHeaderOffset + static_cast<int>(sizeof(EFI_FIRMWARE_VOLUME_EXT_HEADER))) return false;
    const EFI_FIRMWARE_VOLUME_EXT_HEADER *extended = reinterpret_cast<const EFI_FIRMWARE_VOLUME_EXT_HEADER *>(header.constData() + volume->ExtHeaderOffset);
    return normalized(guidToQString(extended->FvName).toStdString()) == normalized(guid);
}

static bool matchesSegment(TreeModel *model, const QModelIndex &index, const PathSegment &segment)
{
    UINT8 expectedType = Types::Root;
    if (segment.kind == "region") expectedType = Types::Region;
    else if (segment.kind == "volume") expectedType = Types::Volume;
    else if (segment.kind == "file") expectedType = Types::File;
    else if (segment.kind == "section") expectedType = Types::Section;
    if (model->type(index) != expectedType) return false;

    if (!segment.subtype.empty()
        && !matchingSubtype(itemSubtypeToQString(model->type(index), model->subtype(index)).toStdString(), segment.subtype))
        return false;

    if (!segment.guid.empty()) {
        if (segment.kind == "volume" && !matchesVolumeGuid(model, index, segment.guid)) return false;
        if (segment.kind == "file" && normalized(model->name(index).toStdString()) != normalized(segment.guid)) return false;
    }
    return true;
}

static void findDescendants(TreeModel *model, const QModelIndex &parent, const PathSegment &segment,
                            std::vector<QModelIndex> &matches)
{
    for (int row = 0; row < model->rowCount(parent); ++row) {
        const QModelIndex child = model->index(row, 0, parent);
        // Old Engine keeps removed nodes in the model until reconstruction.
        if (model->action(child) == Actions::Remove) continue;
        if (matchesSegment(model, child, segment)) matches.push_back(child);
        findDescendants(model, child, segment, matches);
    }
}

static void findKind(TreeModel *model, const QModelIndex &parent, UINT8 type, std::vector<QModelIndex> &matches)
{
    for (int row = 0; row < model->rowCount(parent); ++row) {
        const QModelIndex child = model->index(row, 0, parent);
        if (model->action(child) == Actions::Remove) continue;
        if (model->type(child) == type) matches.push_back(child);
        findKind(model, child, type, matches);
    }
}

static QModelIndex resolvePath(TreeModel *model, const std::vector<PathSegment> &path)
{
    QModelIndex parent;
    for (std::vector<PathSegment>::const_iterator segment = path.begin(); segment != path.end(); ++segment) {
        std::vector<QModelIndex> matches;
        findDescendants(model, parent, *segment, matches);
        if (segment->hasIndex) {
            if (segment->index >= matches.size()) matches.clear();
            else {
                const QModelIndex selected = matches[segment->index];
                matches.clear();
                matches.push_back(selected);
            }
        }
        if (matches.size() != 1) {
            UINT8 type = segment->kind == "region" ? Types::Region : segment->kind == "volume" ? Types::Volume
                : segment->kind == "file" ? Types::File : Types::Section;
            std::vector<QModelIndex> candidates;
            findKind(model, parent, type, candidates);
            std::string names;
            for (std::size_t i = 0; i < candidates.size() && i < 5; ++i) {
                if (!names.empty()) names += ", ";
                names += model->name(candidates[i]).toStdString();
            }
            throw std::runtime_error("path segment " + segment->kind + " resolved to " + std::to_string(matches.size())
                + " objects; candidates: " + names);
        }
        parent = matches[0];
    }
    return parent;
}

static std::string operationName(const Operation &item, std::size_t index)
{
    return item.name.empty() ? std::to_string(index) : item.name;
}

static UINT8 replaceOne(FfsEngine &engine, TreeModel *model, const QModelIndex &target, const Operation &item)
{
    UINT8 mode = REPLACE_MODE_BODY;
    if (item.inputMode == "section") {
        if (model->type(target) != Types::Section) return ERR_INVALID_PARAMETER;
        mode = REPLACE_MODE_AS_IS;
    }
    else if (item.inputMode == "file") {
        if (model->type(target) != Types::File) return ERR_INVALID_PARAMETER;
        mode = REPLACE_MODE_AS_IS;
    }
    return engine.replace(target, readFile(item.input), mode);
}

static UINT8 insertOne(FfsEngine &engine, TreeModel *model, const QModelIndex &target, const Operation &item)
{
    UINT8 mode = CREATE_MODE_APPEND;
    if (item.position == "prepend") mode = CREATE_MODE_PREPEND;
    else if (item.position == "before") mode = CREATE_MODE_BEFORE;
    else if (item.position == "after") mode = CREATE_MODE_AFTER;

    const QModelIndex container = (mode == CREATE_MODE_BEFORE || mode == CREATE_MODE_AFTER) ? target.parent() : target;
    if (!container.isValid()) return ERR_INVALID_PARAMETER;
    if (model->type(container) == Types::Volume && item.inputMode != "file") return ERR_INVALID_PARAMETER;
    if ((model->type(container) == Types::File || model->type(container) == Types::Section) && item.inputMode != "section") return ERR_INVALID_PARAMETER;
    if (model->type(container) != Types::Volume && model->type(container) != Types::File && model->type(container) != Types::Section)
        return ERR_NOT_IMPLEMENTED;
    return engine.insert(target, readFile(item.input), mode);
}

void applyOperations(const std::string &imagePath, const std::vector<Operation> &items, const std::string &outputPath)
{
    const QFileInfo image(QString::fromStdString(imagePath));
    const QFileInfo output(QString::fromStdString(outputPath));
    if (!image.isFile()) throw std::runtime_error("input image is not a file: " + imagePath);
    if (output.exists()) throw std::runtime_error("output already exists: " + outputPath);

    FfsEngine engine;
    TreeModel *model = engine.treeModel();
    UINT8 result = engine.parseImageFile(readFile(image.absoluteFilePath().toStdString()));
    if (result != ERR_SUCCESS) throw std::runtime_error("cannot parse input: " + resultDescription(result));

    for (std::size_t index = 0; index < items.size(); ++index) {
        const Operation &item = items[index];
        const QModelIndex target = resolvePath(model, item.path);
        if (item.action == "replace") result = replaceOne(engine, model, target, item);
        else if (item.action == "delete") result = engine.remove(target);
        else result = insertOne(engine, model, target, item);
        if (result != ERR_SUCCESS)
            throw std::runtime_error("operation " + operationName(item, index) + " failed: " + resultDescription(result));
    }

    QByteArray reconstructed;
    result = engine.reconstructImageFile(reconstructed);
    if (result != ERR_SUCCESS) throw std::runtime_error("cannot reconstruct output: " + resultDescription(result));

    const std::string temporary = temporaryPath(output.absoluteFilePath().toStdString());
    QFile destination(QString::fromStdString(temporary));
    if (!destination.open(QFile::WriteOnly) || destination.write(reconstructed) != reconstructed.size()) {
        QFile::remove(QString::fromStdString(temporary));
        throw std::runtime_error("cannot write temporary output");
    }
    destination.close();
    if (!QFile::rename(QString::fromStdString(temporary), output.absoluteFilePath())) {
        QFile::remove(QString::fromStdString(temporary));
        throw std::runtime_error("cannot move completed output to: " + outputPath);
    }
}
