import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const source = process.argv[2] ?? path.join(root, 'assets', 'icon-512-source.png');
const assetsDir = path.join(root, 'assets');

const targets = [
  { file: 'icon-512.png', size: 512 },
  { file: 'icon.png', size: 1024 },
  { file: 'adaptive-icon.png', size: 1024 },
  { file: 'splash-icon.png', size: 1024 },
  { file: 'favicon.png', size: 48 },
];

async function main() {
  const meta = await sharp(source).metadata();
  console.log(`Source: ${source} (${meta.width}x${meta.height}, ${fs.statSync(source).size} bytes)`);

  for (const { file, size } of targets) {
    const out = path.join(assetsDir, file);
    await sharp(source)
      .resize(size, size, { fit: 'cover', position: 'centre' })
      .png({ compressionLevel: 9, palette: file === 'favicon.png' })
      .toFile(out);
    const stat = fs.statSync(out);
    console.log(`Wrote ${file}: ${size}x${size}, ${stat.size} bytes`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
