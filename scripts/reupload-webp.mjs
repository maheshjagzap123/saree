// Re-upload optimized WebP product/collection images to Supabase Storage and point the DB
// at them, replacing the heavy PNGs that the live product grid currently downloads
// (~3.3 MB each). Non-destructive: original PNGs stay in the bucket, so this is reversible
// by swapping the .webp URLs back to .png.
//
// For each optimized WebP in src/Images/optimized, upload to catalog/<safe-name>.webp and
// update any product_images.url / collections.cover_image whose PNG path matches.
import { readFileSync, readdirSync } from 'node:fs'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)] })
)

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
const BUCKET = 'product-images'

const { error: authErr } = await sb.auth.signInWithPassword({
  email: 'admin@vastraa.com', password: 'Admin@12345',
})
if (authErr) { console.error('ADMIN LOGIN FAILED:', authErr.message); process.exit(1) }
console.log('signed in as admin')

// Same safe-name transform the original upload used (on the .png name), then .webp.
const safeBase = (fileNoExt) => 'catalog/' + fileNoExt.replace(/\s+/g, '-').toLowerCase()

const dir = new URL('../src/Images/optimized/', import.meta.url)
const webps = readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.webp'))

// Map pngPath -> webpUrl for the DB update step.
const pngToWebp = {}

for (const file of webps) {
  const noExt = file.replace(/\.webp$/i, '')
  const base = safeBase(noExt)
  const webpPath = base + '.webp'
  const pngPath = base + '.png'

  const bytes = readFileSync(new URL(file, dir))
  const { error } = await sb.storage.from(BUCKET).upload(webpPath, bytes, {
    contentType: 'image/webp', upsert: true,
  })
  if (error) { console.log('upload failed', file, error.message); continue }
  const { data: pub } = sb.storage.from(BUCKET).getPublicUrl(webpPath)
  const { data: pubPng } = sb.storage.from(BUCKET).getPublicUrl(pngPath)
  pngToWebp[pubPng.publicUrl] = pub.publicUrl
}
console.log(`uploaded ${Object.keys(pngToWebp).length} webp images`)

// DB writes via pooler.
const client = new pg.Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432,
  user: `postgres.${process.env.PROJECT_REF}`, password: process.env.PGPASSWORD,
  database: 'postgres', ssl: { rejectUnauthorized: false },
})
await client.connect()

// Generic swap: for every product_images / collections row ending in .png, set .webp
// (only when we actually uploaded a matching webp).
const piRows = await client.query('select id, url from product_images')
let piUpdated = 0
for (const r of piRows.rows) {
  const webp = pngToWebp[r.url] || (r.url.endsWith('.png') ? r.url.replace(/\.png$/, '.webp') : null)
  if (webp && webp !== r.url) {
    await client.query('update product_images set url=$1 where id=$2', [webp, r.id])
    piUpdated++
  }
}

const colRows = await client.query('select id, cover_image from collections where cover_image is not null')
let colUpdated = 0
for (const r of colRows.rows) {
  const webp = pngToWebp[r.cover_image] || (r.cover_image.endsWith('.png') ? r.cover_image.replace(/\.png$/, '.webp') : null)
  if (webp && webp !== r.cover_image) {
    await client.query('update collections set cover_image=$1 where id=$2', [webp, r.id])
    colUpdated++
  }
}

console.log(`DB updated: ${piUpdated} product_images, ${colUpdated} collection covers`)
await client.end()
console.log('DONE')
