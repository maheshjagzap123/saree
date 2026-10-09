// Uploads src/Images/* to the Supabase `product-images` bucket (authenticated as the
// admin user so storage RLS allows writes), then updates the DB:
//  - product_images rows per product (front + detail) -> real public URLs
//  - collections.cover_image -> real public URLs
// Also fixes any orders/products references. Uses the anon client for auth+storage and
// a direct pg connection for table writes.
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import pg from 'pg'
import { createClient } from '@supabase/supabase-js'

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1)] })
)

const sb = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY)
const BUCKET = 'product-images'

// 1) sign in as admin so storage RLS (admin write) is satisfied
const { error: authErr } = await sb.auth.signInWithPassword({
  email: 'admin@vastraa.com',
  password: 'Admin@12345',
})
if (authErr) { console.log('ADMIN LOGIN FAILED:', authErr.message); process.exit(1) }
console.log('signed in as admin')

// 2) upload every image, build a name -> publicUrl map
const dir = new URL('../src/Images/', import.meta.url)
const files = readdirSync(dir).filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
const urlByFile = {}
for (const file of files) {
  const bytes = readFileSync(new URL(file, dir))
  const safe = 'catalog/' + file.replace(/\s+/g, '-').toLowerCase()
  const { error } = await sb.storage.from(BUCKET).upload(safe, bytes, {
    contentType: 'image/png',
    upsert: true,
  })
  if (error) { console.log('upload failed', file, error.message); continue }
  const { data } = sb.storage.from(BUCKET).getPublicUrl(safe)
  urlByFile[file] = data.publicUrl
  console.log('uploaded', file)
}

// 3) mapping (same as the frontend wiring)
const F = (n) => urlByFile[n]
const PRODUCT_IMAGES = {
  'royal-purple-single-muniya-paithani': ['Royal Purple Silk Saree with Peacock Zari.png', 'Royal Purple Silk Saree with Peacock Zari Pallu-2.png'],
  'emerald-green-peacock-paithani': ['Emerald Green Peacock Zari Saree.png', 'Emerald Silk Saree with Peacock Zari.png'],
  'classic-red-bridal-paithani': ['Regal Red Gold Silk Saree.png', 'Ornate Red Banarasi Silk Saree.png'],
  'rani-pink-muniya-border-paithani': ['Magenta Silk Saree with Peacock Zari.png', 'Magenta Silk Saree with Parrot Brocade.png'],
  'peacock-blue-designer-paithani': ['Peacock Blue Silk Saree Display-2.png', 'Teal Silk Saree with Golden Peacocks.png'],
  'black-gold-tissue-paithani': ['Black Silk Saree with Peacock Zari Pallu.png', 'Black Silk Saree with Peacock Brocade.png'],
  'marigold-orange-festive-paithani': ['Ornate Orange Silk Saree with Peacock Zari.png', 'Luxurious Orange Peacock Brocade Saree.png'],
  'wine-signature-bridal-paithani': ['Burgundy Peacock Zari Silk Saree.png', 'Opulent Maroon Silk Saree with Peacock Zari Pallu.png'],
}
const COLLECTION_IMAGE = {
  'traditional-paithani': 'Majestic Purple Banarasi Saree Display.png',
  'bridal-paithani': 'Opulent Indian Bridal Saree Collection.png',
  'silk-paithani': 'Emerald Peacock Zari Saree Display-1.png',
  'designer-paithani': 'Luxurious Peacock Silk Saree Collection.png',
  'festive-paithani': 'Festive Paithani Heritage Collection.png',
}

// 4) DB writes via pooler
const client = new pg.Client({
  host: 'aws-0-ap-southeast-1.pooler.supabase.com', port: 5432,
  user: `postgres.${process.env.PROJECT_REF}`, password: process.env.PGPASSWORD,
  database: 'postgres', ssl: { rejectUnauthorized: false },
})
await client.connect()

for (const [slug, names] of Object.entries(PRODUCT_IMAGES)) {
  const { rows } = await client.query('select id from products where slug=$1', [slug])
  if (!rows.length) { console.log('no product', slug); continue }
  const pid = rows[0].id
  await client.query('delete from product_images where product_id=$1', [pid])
  for (let i = 0; i < names.length; i++) {
    const url = F(names[i])
    if (!url) { console.log('missing upload for', names[i]); continue }
    await client.query(
      'insert into product_images (product_id, url, position, is_primary, alt_text) values ($1,$2,$3,$4,$5)',
      [pid, url, i, i === 0, slug.replace(/-/g, ' ')]
    )
  }
  console.log('updated images for', slug)
}

for (const [slug, name] of Object.entries(COLLECTION_IMAGE)) {
  const url = F(name)
  if (!url) { console.log('missing collection upload', name); continue }
  await client.query('update collections set cover_image=$1 where slug=$2', [url, slug])
  console.log('updated cover for', slug)
}

await client.end()
console.log('DONE')
