// Downloads the Unsplash-licensed images listed in scripts/assets.json into public/images.
// Re-run with `node scripts/download-assets.mjs` (skips files that already exist).
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const assets = JSON.parse(await readFile(path.join(root, 'scripts/assets.json'), 'utf8'));
let failed = 0;
for (const a of assets) {
  const dest = path.join(root, 'public/images', a.file);
  try { await access(dest); continue; } catch {}
  await mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(`https://images.unsplash.com/${a.id}?w=${a.w}&q=80&fm=jpg&fit=max`);
  if (!res.ok) { console.error('FAILED', a.file, res.status); failed++; continue; }
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log('saved', a.file);
}
process.exit(failed ? 1 : 0);
