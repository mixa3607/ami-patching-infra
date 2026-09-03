#ifndef UEFITOOL_CLI_FIRMWARE_H
#define UEFITOOL_CLI_FIRMWARE_H

#include <string>
#include <vector>

#include "ffsparser.h"

struct FirmwareNode {
    std::string id;
    std::string kind;
    std::string subtype;
    std::string name;
    unsigned type;
    unsigned subtypeValue;
    unsigned offset;
    unsigned headerSize;
    unsigned bodySize;
    unsigned tailSize;
    std::string parent;
    UModelIndex index;
    std::vector<std::string> children;
};

class FirmwareImage {
public:
    UByteArray data;
    TreeModel model;
    std::vector<FirmwareNode> nodes;

    void parse(const std::string &path);
};

std::string lowerString(std::string value);
std::string hexValue(unsigned value, unsigned width = 0);
std::string localString(const UString &value);
unsigned nodeSize(const FirmwareNode &node);

#endif
