#!/usr/bin/env node
"use strict";

// Copies the bundled skill into the user's Claude Code skills directory.
// Run with:  npx obsidian-notes-skill
const fs = require("fs");
const path = require("path");
const os = require("os");

const src = path.join(__dirname, "..", "skills", "obsidian-notes-skill");
const destRoot = path.join(os.homedir(), ".claude", "skills");
const dest = path.join(destRoot, "obsidian-notes-skill");

if (!fs.existsSync(src)) {
  console.error(`error: bundled skill not found at ${src}`);
  process.exit(1);
}

fs.mkdirSync(destRoot, { recursive: true });
fs.cpSync(src, dest, { recursive: true });

console.log(`Installed obsidian-notes-skill -> ${dest}`);
console.log("Restart Claude Code. First use runs the setup wizard.");
console.log("Config is saved to ~/.claude/obsidian-notes-vault-config.yaml");
