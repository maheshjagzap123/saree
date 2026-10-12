// Optimize the bundled saree images: resize + convert the large source PNGs in
// src/Images to WebP in src/Images/optimized. images.js imports the WebP versions so the
// JS bundle ships light assets instead of 2.5-3.5 MB PNGs.
//
// Re-runnable: skips a WebP that is already newer than its source. Usage:
//   node scripts/optimize-images.mjs
import { readdirSync, mkdirSync, statSync, existsSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import sharp from 'sharp'

const SRC_DIR = 'src/Images'
const OUT_DIR = 'src/Images/optimized'
const MAX_WIDTH = 1600 // hero is the largest consumer; nothing needs more
const QUALITY = 82

mkdirSync(OUT_DIR, { recursive: true })

const pngs = readdirSync(SRC_DIR).filter((f) => extname(f).toLowerCase() === '.png')
let totalIn = 0
let totalOut = 0
let done = 0

for (const file of pngs) {
  const inPath = join(SRC_DIR, file)
  const outPath = join(OUT_DIR, basename(file, '.png') + '.webp')

  const inStat = statSync(inPath)
  totalIn += inStat.size

  // Skip if an up-to-date webp already exists.
  if (existsSync(outPath) && statSync(outPath).mtimeMs >= inStat.mtimeMs) {
    totalOut += statSync(outPath).size
    continue
  }

  await sharp(inPath)
    .rotate() // respect EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath)

  totalOut += statSync(outPath).size
  done++
}

const mb = (b) => (b / 1024 / 1024).toFixed(1)
console.log(`[optimize-images] processed ${done} new / ${pngs.length} total`)
console.log(`[optimize-images] source PNGs: ${mb(totalIn)} MB  ->  WebP: ${mb(totalOut)} MB  (${Math.round((1 - totalOut / totalIn) * 100)}% smaller)`)
