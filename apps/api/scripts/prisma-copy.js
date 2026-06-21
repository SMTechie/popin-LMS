const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..', '..');
const src = path.join(root, 'node_modules', '.prisma', 'client');
const dst = path.join(root, 'node_modules', '@prisma', 'client', '.prisma', 'client');

if (!fs.existsSync(src)) {
  console.warn('[prisma-copy] Source not found:', src);
  process.exit(0);
}

fs.mkdirSync(dst, { recursive: true });
fs.cpSync(src, dst, { recursive: true, force: true });
console.log('[prisma-copy] Prisma client copied to', dst);
