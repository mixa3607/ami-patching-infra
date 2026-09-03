#include "replace.h"

#include <map>
#include <stdexcept>

#include <QFile>
#include <QFileInfo>
#include <QTemporaryFile>
#include <QUuid>

#include "ffs.h"
#include "ffsengine.h"

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

static UINT8 sectionType(const std::string &subtype)
{
    static const std::map<std::string, UINT8> types = {
        {"compressed", EFI_SECTION_COMPRESSION},
        {"guid defined", EFI_SECTION_GUID_DEFINED},
        {"disposable", EFI_SECTION_DISPOSABLE},
        {"pe32 image", EFI_SECTION_PE32},
        {"pic image", EFI_SECTION_PIC},
        {"te image", EFI_SECTION_TE},
        {"dxe dependency", EFI_SECTION_DXE_DEPEX},
        {"version", EFI_SECTION_VERSION},
        {"ui", EFI_SECTION_USER_INTERFACE},
        {"16 bit image", EFI_SECTION_COMPATIBILITY16},
        {"volume image", EFI_SECTION_FIRMWARE_VOLUME_IMAGE},
        {"freeform subtype guid", EFI_SECTION_FREEFORM_SUBTYPE_GUID},
        {"raw", EFI_SECTION_RAW},
        {"pei dependency", EFI_SECTION_PEI_DEPEX},
        {"mm dependency", EFI_SECTION_SMM_DEPEX}
    };
    const std::map<std::string, UINT8>::const_iterator value = types.find(normalized(subtype));
    if (value == types.end()) throw std::runtime_error("unsupported section subtype from inspect: " + subtype);
    return value->second;
}

static QByteArray guidBytes(const std::string &value)
{
    const QUuid guid(QString::fromStdString(value));
    if (guid.isNull()) throw std::runtime_error("invalid GUID: " + value);
    return QByteArray::fromRawData(reinterpret_cast<const char *>(&guid.data1), sizeof(EFI_GUID));
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
    case ERR_NOTHING_TO_PATCH: return "no matching section was replaced";
    case ERR_NOT_IMPLEMENTED: return "Old Engine cannot replace this section body";
    case ERR_INVALID_FILE: return "invalid or corrupted firmware image";
    case ERR_INVALID_SECTION: return "invalid replacement section";
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

static UINT8 replaceOne(FfsEngine &engine, TreeModel *model, const QModelIndex &index,
                        const QByteArray &guid, UINT8 section, const QByteArray &contents, UINT8 mode)
{
    if (!model || !index.isValid()) return ERR_INVALID_PARAMETER;
    bool patched = false;
    if (model->subtype(index) == section) {
        QModelIndex fileIndex = index;
        if (model->type(index) != Types::File) fileIndex = model->findParentOfType(index, Types::File);
        QByteArray fileGuid = model->header(fileIndex).left(sizeof(EFI_GUID));
        bool guidMatch = fileGuid == guid;
        if (!guidMatch && section == EFI_SECTION_FREEFORM_SUBTYPE_GUID)
            guidMatch = model->header(index).mid(sizeof(UINT32), sizeof(EFI_GUID)) == guid;
        if (guidMatch && model->action(index) != Actions::Replace) {
            const UINT8 result = engine.replace(index, contents, mode);
            if (result != ERR_SUCCESS) return result;
            return ERR_SUCCESS;
        }
    }
    for (int i = 0; i < model->rowCount(index); ++i) {
        const UINT8 result = replaceOne(engine, model, index.child(i, 0), guid, section, contents, mode);
        if (result == ERR_SUCCESS) return ERR_SUCCESS;
        if (result != ERR_NOTHING_TO_PATCH) return result;
        patched = patched || result == ERR_SUCCESS;
    }
    return patched ? ERR_SUCCESS : ERR_NOTHING_TO_PATCH;
}

void applyReplacements(const std::string &imagePath, const std::vector<Replacement> &items,
                       const std::string &outputPath)
{
    const QFileInfo image(QString::fromStdString(imagePath));
    const QFileInfo output(QString::fromStdString(outputPath));
    if (!image.isFile()) throw std::runtime_error("input image is not a file: " + imagePath);
    if (output.exists()) throw std::runtime_error("output already exists: " + outputPath);

    const QByteArray imageData = readFile(image.absoluteFilePath().toStdString());
    FfsEngine engine;
    TreeModel *model = engine.treeModel();
    UINT8 result = engine.parseImageFile(imageData);
    if (result != ERR_SUCCESS) throw std::runtime_error("cannot parse input: " + resultDescription(result));

    for (std::vector<Replacement>::const_iterator item = items.begin(); item != items.end(); ++item) {
        result = replaceOne(engine, model, model->index(0, 0), guidBytes(item->guid), sectionType(item->subtype),
            readFile(item->input), item->mode == "as_is" ? REPLACE_MODE_AS_IS : REPLACE_MODE_BODY);
        if (result != ERR_SUCCESS) {
            throw std::runtime_error("replacement " + (item->name.empty() ? item->guid : item->name)
                + " failed: " + resultDescription(result));
        }
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
