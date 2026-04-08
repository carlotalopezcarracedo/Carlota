import sharp from 'sharp';
import { readdir } from 'fs/promises';
import { extname, basename, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');
const MAX_WIDTH = 1200;
const QUALITY = 80;

const files = await readdir(PUBLIC_DIR);

const pngFiles = files.filter(f =>
  ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase())
);
const gifFiles = files.filter(f => extname(f).toLowerCase() === '.gif');

for (const file of pngFiles) {
  const input = join(PUBLIC_DIR, file);
  const outputName = basename(file, extname(file)) + '.webp';
  const output = join(PUBLIC_DIR, outputName);
  await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
  console.log(`✓ ${file} → ${outputName}`);
}

for (const file of gifFiles) {
  const input = join(PUBLIC_DIR, file);
  const outputName = basename(file, '.gif') + '.webp';
  const output = join(PUBLIC_DIR, outputName);
  await sharp(input, { pages: 1 })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);
  console.log(`✓ ${file} → ${outputName} (primer frame)`);
}

console.log('\n✅ Optimización completada.');
