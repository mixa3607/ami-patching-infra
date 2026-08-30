#!/usr/bin/env python3
"""Migrate the legacy UEFI-Editor JSON changes removed in b2d6436."""

import json
import subprocess
import sys
import tempfile
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
IFR_DIR = BASE_DIR / "IFR"
TOOLS = BASE_DIR.parent / "SOFTWARE" / "uefi-mod-tools" / "uefi-mod-tools"
LEGACY_TREE = "b2d6436^"
EDITABLE_FIELDS = ("accessLevel", "failsafe", "optimal")


def git_json(path: str) -> dict:
    result = subprocess.run(
        ["git", "show", f"{LEGACY_TREE}:AMI/IFR/{path}"],
        check=True,
        cwd=BASE_DIR.parent,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def walk_questions(value: object):
    if isinstance(value, dict):
        if "questionId" in value and isinstance(value.get("offsets"), dict) and "accessLevel" in value["offsets"]:
            yield value
        for child in value.values():
            yield from walk_questions(child)
    elif isinstance(value, list):
        for child in value:
            yield from walk_questions(child)


def hex_value(value: str) -> int:
    return int(value, 16)


def question_map(document: dict) -> dict[int, dict]:
    result = {}
    for question in walk_questions(document["forms"]):
        offset = hex_value(question["offsets"]["accessLevel"])
        if offset in result:
            raise ValueError(f"duplicate legacy access-level offset 0x{offset:X}")
        result[offset] = question
    return result


def changed_questions(original: dict, edited: dict) -> list[dict]:
    original_by_offset = question_map(original)
    edited_by_offset = question_map(edited)
    if original_by_offset.keys() != edited_by_offset.keys():
        raise ValueError("legacy JSON changed its question set")

    changes = []
    for offset, old in original_by_offset.items():
        new = edited_by_offset[offset]
        if old["type"] != new["type"] or old["questionId"] != new["questionId"]:
            raise ValueError(f"legacy question identity changed at 0x{offset:X}")
        unsupported = set(old).symmetric_difference(new)
        unsupported.update(
            key for key in set(old).intersection(new)
            if key not in EDITABLE_FIELDS and old[key] != new[key]
        )
        if unsupported:
            raise ValueError(f"unsupported question changes at 0x{offset:X}: {sorted(unsupported)}")
        if any(old[field] != new[field] for field in EDITABLE_FIELDS):
            changes.append(new)
    return changes


def disabled_suppressions(original: dict, edited: dict) -> list[int]:
    old = {hex_value(item["offset"]): item for item in original["suppressions"]}
    new = {hex_value(item["offset"]): item for item in edited["suppressions"]}
    if old.keys() != new.keys():
        raise ValueError("legacy JSON changed its suppression set")

    offsets = []
    for offset, before in old.items():
        after = new[offset]
        if {key: value for key, value in before.items() if key != "active"} != \
           {key: value for key, value in after.items() if key != "active"}:
            raise ValueError(f"unsupported suppression changes at 0x{offset:X}")
        if before["active"] and not after["active"]:
            offsets.append(offset)
        elif before["active"] != after["active"]:
            raise ValueError(f"unsupported suppression activation at 0x{offset:X}")
    return offsets


def extract_setupdata_questions(form: dict, temporary: Path) -> dict[int, dict]:
    ifr = IFR_DIR / form["ifrJson"]
    output = temporary / f"{form['name']}.setupdata.json"
    subprocess.run(
        [str(TOOLS), "uefi", "ifr-setupdata-extract", "--input", str(IFR_DIR / "SetupData.bin"),
         "--ifr", str(ifr), "--output", str(output)],
        check=True,
    )
    extracted = json.loads(output.read_text())
    result = {}
    for question in extracted["questions"]:
        offset = hex_value(question["beginAddress"]) + 0x10
        if offset in result:
            raise ValueError(f"{form['name']}: duplicate SetupData access-level offset 0x{offset:X}")
        result[offset] = question
    return result


def write_json(path: Path, value: dict) -> None:
    path.write_text(json.dumps(value, indent=2) + "\n")


def main() -> None:
    if not TOOLS.is_file():
        raise FileNotFoundError(f"uefi-mod-tools not found: {TOOLS}")
    manifest = json.loads(
        subprocess.run(["yq", "-o=json", str(IFR_DIR / "sections.yaml")], check=True,
                       capture_output=True, text=True).stdout
    )
    forms = [section for section in manifest["sections"] if section.get("ifrJson")]
    with tempfile.TemporaryDirectory(prefix="ifr-patch-migration-") as temporary_name:
        temporary = Path(temporary_name)
        for form in forms:
            name = form["name"]
            original = git_json(f"{name}/orig/data.json")
            edited = git_json(f"{name}/data.json")
            extracted = extract_setupdata_questions(form, temporary)
            setupdata_patches = {}

            for legacy in changed_questions(original, edited):
                offset = hex_value(legacy["offsets"]["accessLevel"])
                patch = extracted.get(offset)
                if patch is None:
                    raise ValueError(f"{name}: no SetupData record at 0x{offset:X}")
                question = patch["question"]
                for field in EDITABLE_FIELDS:
                    question[field] = hex_value(legacy[field])
                previous = setupdata_patches.setdefault(offset, patch)
                if previous != patch:
                    raise ValueError(f"{name}: conflicting SetupData edits at 0x{offset:X}")

            form_directory = IFR_DIR / Path(form["output"]).parent
            write_json(form_directory / "SetupData.patch.json", {
                "version": 1,
                "questions": [setupdata_patches[offset] for offset in sorted(setupdata_patches)],
            })
            sct_patch = {
                "version": 1,
                "suppressIfPatches": [
                    {"disable": True, "offset": offset}
                    for offset in disabled_suppressions(original, edited)
                ],
            }
            write_json(IFR_DIR / Path(form["output"]).with_suffix(".sct.patch.json"), sct_patch)


if __name__ == "__main__":
    try:
        main()
    except (FileNotFoundError, subprocess.CalledProcessError, TypeError, ValueError, KeyError) as error:
        raise SystemExit(f"error: {error}")
