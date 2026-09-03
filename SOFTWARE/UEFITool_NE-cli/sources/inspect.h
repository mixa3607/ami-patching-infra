#ifndef UEFITOOL_CLI_INSPECT_H
#define UEFITOOL_CLI_INSPECT_H
#include <nlohmann/json.hpp>
#include "firmware.h"
nlohmann::json inspectJson(const FirmwareImage &image);
#endif
