'use strict';
const fs = require('fs');
const path = require('path');

const SKIP = new Set(['node_modules', '.next', '.git']);

function walk(root) {
  const entries = fs.readdirSync(root, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(root, ent.name);
    if (ent.isDirectory()) {
      if (SKIP.has(ent.name)) continue;
      walk(full);
      continue;
    }
    if (!/\.(ts|tsx|js|mjs)$/.test(ent.name)) continue;
    const buf = fs.readFileSync(full);
    if (buf.length < 4 || buf[0] !== 0xff || buf[1] !== 0xfe) continue;
    const text = buf.subarray(2).toString('utf16le');
    fs.writeFileSync(full, text, 'utf8');
    process.stdout.write(`utf8: ${full}\n`);
  }
}

walk(path.join(__dirname, '..'));
