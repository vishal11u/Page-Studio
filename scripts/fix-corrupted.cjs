'use strict';
const fs = require('fs');
const path = require('path');

const SKIP = new Set(['node_modules', '.next', '.git']);

function repair(file) {
  const buf = fs.readFileSync(file);
  if (buf.length < 4) return;
  // If it's UTF-16 LE with BOM (FF FE)
  if (buf[0] === 0xff && buf[1] === 0xfe) {
    const text = buf.subarray(2).toString('utf16le');
    fs.writeFileSync(file, text, 'utf8');
    console.log(`Repaired (UTF-16 BOM): ${file}`);
    return;
  }
  // Heuristic: If it has lots of null bytes, it might be corrupted UTF-16 without BOM or just bad encoding
  // Check if every second byte is a null byte (common in ASCII stored as UTF-16LE)
  let nulls = 0;
  for (let i = 1; i < Math.min(buf.length, 100); i += 2) {
    if (buf[i] === 0) nulls++;
  }
  if (nulls > 20) {
    const text = buf.toString('utf16le').replace(/\0/g, '');
    fs.writeFileSync(file, text, 'utf8');
    console.log(`Repaired (Heuristic): ${file}`);
  }
}

function walk(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(root, ent.name);
    if (ent.isDirectory()) {
      if (SKIP.has(ent.name)) continue;
      walk(full);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs|cjs|json)$/.test(ent.name)) continue;
    repair(full);
  }
}

walk(path.join(__dirname, '..'));
