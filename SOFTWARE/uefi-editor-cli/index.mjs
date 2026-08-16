#!/usr/bin/env node
// UEFI-Editor CLI — apply data.json modifications back to UEFI IFR files
// without the browser. Mirrors scripts.ts (parseData/downloadModifiedFiles).
//
// Commands:
//   sct       <orig setup .sct> + <data.json>      -> patched setup .sct
//   setupdata <orig setupdata .bin> + <data.json>* -> patched setupdata .bin
//   amitse    <orig AMITSE .sct>  + <data.json>*   -> patched AMITSE .sct
//   verify    <orig setup/amitse/setupdata> + <data.json> -> hash check
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const PROG = "uefi-editor-cli";

function usage() {
  console.log(`UEFI-Editor CLI — reproduce the browser "UEFI files" export headlessly.

Usage:
  ${PROG} sct --setup <orig setup.sct> --data <data.json> -o <out.sct>
  ${PROG} setupdata --setupdata <orig.bin> [--data <data.json> ...] -o <out.bin>
  ${PROG} amitse --amitse <orig.amitse.sct> [--data <data.json> ...] -o <out.sct>
  ${PROG} verify --setup <orig.sct> --amitse <orig.amitse> --setupdata <orig.bin> --data <data.json>

Each --data is applied in order, so overlapping setupdata/amitse changes from
several IFR dirs accumulate on a single orig file.

verify compares data.json.hashes against the SHA-256 of the given originals,
catching a desync between data.json and the extracted .sct files.`);
}

function fail(msg) { console.error(`${PROG}: ${msg}`); process.exit(1); }

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--help" || a === "-h") { usage(); process.exit(0); }
    const m = /^--([a-z-]+)$/.exec(a) || /^-([a-z])$/.exec(a);
    if (!m) fail(`unexpected argument: ${a}`);
    const key = m[1];
    if (i + 1 >= argv.length) fail(`missing value for ${a}`);
    const value = argv[++i];
    if (key === "data") (args.data ??= []).push(value);
    else args[key] = value;
  }
  return args;
}

// ---- port of scripts.ts helpers ----
function offsetToIndex(offset) { return parseInt(offset, 16) * 2; }
function replaceAt(string, index, length, replacement) {
  return string.slice(0, index) + replacement + string.slice(index + length);
}
function decToHexString(decimal) { return `0x${decimal.toString(16).toUpperCase()}`; }
function toHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((x) => x.toString(16).toUpperCase().padStart(2, "0"))
    .join("");
}
function fromHex(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) arr[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  return arr;
}
function sha256(buffer) {
  return crypto.createHash("sha256").update(new Uint8Array(buffer)).digest("hex");
}
function loadData(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    fail(`cannot parse ${file}: ${e.message}`);
  }
}

// Unsuppress items in the setup sct: move the 29 02 terminator from the end of
// each inactive SuppressIf scope to its start (same trick as the browser).
export function patchSetupSct(origBuffer, datas) {
  let hex = toHex(origBuffer);
  const log = [];

  for (const data of datas) {
    const suppressions = JSON.parse(JSON.stringify(data.suppressions));
    for (const suppression of suppressions) {
      if (suppression.active) continue;
      const endIndex = offsetToIndex(suppression.end);
      if (hex.slice(endIndex, endIndex + 4) !== "2902") {
        throw new Error(
          `expected 2902 at end of suppression ${suppression.offset}; ` +
            `data.json does not match this setup .sct`
        );
      }
      hex = replaceAt(hex, endIndex, 4, "");
      hex = replaceAt(hex, offsetToIndex(suppression.start), 0, "2902");

      for (const s of suppressions) {
        if (s.offset === suppression.offset) continue;
        if (parseInt(suppression.start, 16) < parseInt(s.start, 16) && parseInt(s.start, 16) < parseInt(suppression.end, 16)) {
          s.start = decToHexString((offsetToIndex(s.start) + 8) / 2);
        }
        if (parseInt(suppression.start, 16) < parseInt(s.end, 16) && parseInt(s.end, 16) < parseInt(suppression.end, 16)) {
          s.end = decToHexString((offsetToIndex(s.end) + 8) / 2);
        }
      }

      log.push(`Unsuppressed ${suppression.offset}`);
    }
  }

  return { buffer: Buffer.from(fromHex(hex)), log };
}

// Rewrite menu formIds in the AMITSE sct.
export function patchAmitseSct(origBuffer, datas) {
  let hex = toHex(origBuffer);
  const log = [];
  for (const data of datas) {
    for (const entry of data.menu) {
      const padded = entry.formId.split("x")[1].padStart(4, "0");
      const newValue = padded.slice(2) + padded.slice(0, 2);
      const index = offsetToIndex(entry.offset);
      const oldValue = hex.slice(index, index + 4);
      if (newValue !== oldValue) {
        hex = replaceAt(hex, index, 4, newValue);
        log.push(`FormId at ${entry.offset}: ${oldValue} -> ${newValue} (${entry.name})`);
      }
    }
  }
  return { buffer: Buffer.from(fromHex(hex)), log };
}

// Patch accessLevel/failsafe/optimal values in the setupdata bin.
export function patchSetupdata(origBuffer, datas) {
  let hex = toHex(origBuffer);
  const log = [];
  for (const data of datas) {
    for (const form of data.forms) {
      for (const child of form.children) {
        if (!(child.offsets && child.accessLevel && child.failsafe && child.optimal)) continue;

        const accessLevelIndex = offsetToIndex(child.offsets.accessLevel);
        const newAccessLevel = child.accessLevel.padStart(2, "0");
        const oldAccessLevel = hex.slice(accessLevelIndex, accessLevelIndex + 2);
        if (oldAccessLevel !== newAccessLevel) {
          hex = replaceAt(hex, accessLevelIndex, 2, newAccessLevel);
          log.push(`${child.name} | Q${child.questionId}: Access Level ${oldAccessLevel} -> ${newAccessLevel}`);
        }

        const failsafeIndex = offsetToIndex(child.offsets.failsafe);
        const newFailsafe = child.failsafe.padStart(2, "0");
        const oldFailsafe = hex.slice(failsafeIndex, failsafeIndex + 2);
        if (oldFailsafe !== newFailsafe) {
          hex = replaceAt(hex, failsafeIndex, 2, newFailsafe);
          log.push(`${child.name} | Q${child.questionId}: Failsafe ${oldFailsafe} -> ${newFailsafe}`);
        }

        const optimalIndex = offsetToIndex(child.offsets.optimal);
        const newOptimal = child.optimal.padStart(2, "0");
        const oldOptimal = hex.slice(optimalIndex, optimalIndex + 2);
        if (oldOptimal !== newOptimal) {
          hex = replaceAt(hex, optimalIndex, 2, newOptimal);
          log.push(`${child.name} | Q${child.questionId}: Optimal ${oldOptimal} -> ${newOptimal}`);
        }
      }
    }
  }
  return { buffer: Buffer.from(fromHex(hex)), log };
}

function requireFile(key, args) {
  if (!args[key]) fail(`missing --${key}`);
  if (!fs.existsSync(args[key])) fail(`not found: ${args[key]}`);
  return args[key];
}

function cmdSct(args) {
  const setup = requireFile("setup", args);
  const out = args.o ?? fail("missing -o");
  const datas = (args.data ?? []).map(loadData);
  if (!datas.length) fail("need at least one --data");
  const res = patchSetupSct(fs.readFileSync(setup), datas);
  fs.writeFileSync(out, res.buffer);
  console.log(`${out} (${res.log.length} change(s))`);
  for (const line of res.log) console.log(`  ${line}`);
}

function cmdSetupdata(args) {
  const setupdata = requireFile("setupdata", args);
  const out = args.o ?? fail("missing -o");
  const datas = (args.data ?? []).map(loadData);
  if (!datas.length) fail("need at least one --data");
  const res = patchSetupdata(fs.readFileSync(setupdata), datas);
  fs.writeFileSync(out, res.buffer);
  console.log(`${out} (${res.log.length} change(s))`);
  for (const line of res.log) console.log(`  ${line}`);
}

function cmdAmitse(args) {
  const amitse = requireFile("amitse", args);
  const out = args.o ?? fail("missing -o");
  const datas = (args.data ?? []).map(loadData);
  if (!datas.length) fail("need at least one --data");
  const res = patchAmitseSct(fs.readFileSync(amitse), datas);
  fs.writeFileSync(out, res.buffer);
  console.log(`${out} (${res.log.length} change(s))`);
  for (const line of res.log) console.log(`  ${line}`);
}

function cmdVerify(args) {
  const setup = requireFile("setup", args);
  const amitse = requireFile("amitse", args);
  const setupdata = requireFile("setupdata", args);
  const datas = (args.data ?? []).map(loadData);
  if (!datas.length) fail("need at least one --data");
  const data = datas[0];
  const hashes = data.hashes ?? {};
  const checks = [
    ["setupSct", setup, hashes.setupSct],
    ["amitseSct", amitse, hashes.amitseSct],
    ["setupdataBin", setupdata, hashes.setupdataBin],
  ];
  let bad = 0;
  for (const [name, file, expected] of checks) {
    if (!expected) { console.log(`${name}: no hash in data.json (skip)`); continue; }
    // the browser hashes the hex-string form of each file, not the raw bytes
    const actual = sha256(Buffer.from(toHex(fs.readFileSync(file)), "utf8"));
    if (actual === expected) {
      console.log(`${name}: OK  ${path.basename(file)}`);
    } else {
      console.log(`${name}: MISMATCH  ${path.basename(file)}\n  expected ${expected}\n  actual   ${actual}`);
      bad++;
    }
  }
  if (bad) fail(`${bad} file(s) do not match data.json hashes — re-extract or regenerate data.json`);
  console.log("All hashes match.");
}

const cmd = process.argv[2];
if (cmd === "--help" || cmd === "-h" || !cmd) { usage(); process.exit(cmd ? 0 : 1); }
const handlers = { sct: cmdSct, setupdata: cmdSetupdata, amitse: cmdAmitse, verify: cmdVerify };
const handler = handlers[cmd];
if (!handler) fail(`unknown command: ${cmd}`);
handler(parseArgs(process.argv.slice(3)));
