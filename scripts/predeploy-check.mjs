import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const MAX_IMAGE_BYTES = 200 * 1024;
const ALLOWED_IMAGE_EXTS = new Set(['.webp', '.avif', '.svg']);
const SECRET_PATTERNS = ['ACCESS_TOKEN', 'SERVER_KEY', 'SECRET'];

let hasFailure = false;

function walkFiles(dirPath) {
  const results = [];
  if (!fs.existsSync(dirPath)) {
    return results;
  }
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

function isDemoFile(filePath, content) {
  const baseName = path.basename(filePath).toLowerCase();
  if (baseName.startsWith('demo-')) {
    return true;
  }
  return content.includes('[DEMO]') && !content.includes('TODO:');
}

console.log('=== Pre-deploy Check (Cross-Platform Node.js) ===');
console.log(`Workspace: ${ROOT_DIR}\n`);

// 1. Check TODO markers in src/ and public/ (excluding DEMO files)
const todoFindings = [];
for (const folder of ['src', 'public']) {
  const files = walkFiles(path.join(ROOT_DIR, folder));
  for (const filePath of files) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.ts', '.astro', '.js', '.mjs', '.json', '.svg', '.html', '.txt'].includes(ext)) {
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf8');
    if (isDemoFile(filePath, content)) {
      continue;
    }
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (
        !/^\s*\*/.test(line) &&
        /\bTODO[:_\s]/.test(line) &&
        !line.includes("startsWith('TODO')") &&
        !line.includes("includes('TODO')")
      ) {
        todoFindings.push(`${path.relative(ROOT_DIR, filePath)}:${index + 1}`);
      }
    });
  }
}

if (todoFindings.length > 0) {
  hasFailure = true;
  console.log(`[GAGAL] 1. Penanda TODO ditemukan (${todoFindings.length} lokasi):`);
  todoFindings.slice(0, 10).forEach((loc) => console.log(`        - ${loc}`));
  if (todoFindings.length > 10) {
    console.log(`        ... dan ${todoFindings.length - 10} lokasi lainnya`);
  }
} else {
  console.log('[OK]    1. Tidak ada penanda TODO di src/ dan public/ (non-demo)');
}

// 2. Run Astro build and scan dist/ for leaked secrets
const astroPkgPath = path.join(ROOT_DIR, 'node_modules', 'astro', 'package.json');
const astroPkg = JSON.parse(fs.readFileSync(astroPkgPath, 'utf8'));
const binRel = typeof astroPkg.bin === 'string' ? astroPkg.bin : astroPkg.bin?.astro;
const astroBin = path.resolve(path.dirname(astroPkgPath), binRel);
const buildResult = spawnSync(process.execPath, [astroBin, 'build'], {
  cwd: ROOT_DIR,
  encoding: 'utf8',
});

if (buildResult.status !== 0) {
  hasFailure = true;
  console.log('[GAGAL] 2. Build Astro gagal:');
  console.log(buildResult.stderr || buildResult.stdout);
} else {
  const distFiles = walkFiles(path.join(ROOT_DIR, 'dist'));
  const secretHits = [];
  for (const filePath of distFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    for (const pattern of SECRET_PATTERNS) {
      if (content.includes(pattern)) {
        secretHits.push(`${path.relative(ROOT_DIR, filePath)} (${pattern})`);
      }
    }
  }

  if (secretHits.length > 0) {
    hasFailure = true;
    console.log(`[GAGAL] 2. Terdeteksi potensi kunci rahasia di dist/:`);
    secretHits.forEach((hit) => console.log(`        - ${hit}`));
  } else {
    console.log('[OK]    2. Build selesai & tidak ada ACCESS_TOKEN / SERVER_KEY / SECRET di dist/');
  }
}

// 3 & 4. Check image size (<= 200 KB) and format (WebP / AVIF / SVG) in public/images/
const imagesDir = path.join(ROOT_DIR, 'public', 'images');
const imageFiles = walkFiles(imagesDir);
const oversizedImages = [];
const invalidFormatImages = [];

for (const imgPath of imageFiles) {
  const stat = fs.statSync(imgPath);
  const rel = path.relative(ROOT_DIR, imgPath);
  if (stat.size > MAX_IMAGE_BYTES) {
    oversizedImages.push(`${rel} (${Math.round(stat.size / 1024)} KB)`);
  }
  const ext = path.extname(imgPath).toLowerCase();
  if (!ALLOWED_IMAGE_EXTS.has(ext)) {
    invalidFormatImages.push(`${rel} (${ext || 'tanpa ekstensi'})`);
  }
}

if (oversizedImages.length > 0) {
  hasFailure = true;
  console.log('[GAGAL] 3. Gambar melebihi 200 KB:');
  oversizedImages.forEach((item) => console.log(`        - ${item}`));
} else {
  console.log(`[OK]    3. Semua gambar di public/images/ <= 200 KB (${imageFiles.length} file diperiksa)`);
}

if (invalidFormatImages.length > 0) {
  hasFailure = true;
  console.log('[GAGAL] 4. Format gambar bukan WebP/AVIF/SVG:');
  invalidFormatImages.forEach((item) => console.log(`        - ${item}`));
} else {
  console.log('[OK]    4. Semua gambar di public/images/ berformat WebP/AVIF/SVG');
}

console.log('');
if (hasFailure) {
  console.log('=== Pre-deploy Check: GAGAL (perbaiki item bertanda [GAGAL] di atas) ===');
  process.exit(1);
}

console.log('=== Pre-deploy Check: LULUS ===');
