// Build-time sitemap generator for Vastraa Paithani.
//
// Writes public/sitemap.xml so Cloudflare Pages serves it statically (and the dev server
// too). Static routes are listed below; dynamic product/collection slugs come from
// Supabase when reachable, falling back to the mock data slugs parsed from src/data so a
// sitemap is always produced even offline. Journal + craft slugs are parsed from
// src/data/content.js.
//
// Runs automatically before `npm run build` (prebuild). The base URL comes from
// VITE_SITE_URL (set it to your production origin, e.g. https://vastraapaithani.pages.dev).

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// ---------- Load env (.env is optional in CI; real env vars win) ----------
function loadEnv() {
  const out = { ...process.env }
  const envPath = join(root, '.env')
  if (existsSync(envPath)) {
    for (const line of readFileSync(envPath, 'utf8').split('\n')) {
      const t = line.trim()
      if (!t || t.startsWith('#')) continue
      const i = t.indexOf('=')
      if (i === -1) continue
      const k = t.slice(0, i)
      if (out[k] === undefined) out[k] = t.slice(i + 1)
    }
  }
  return out
}
const env = loadEnv()

const SITE_URL = (env.VITE_SITE_URL || 'https://vastraapaithani.pages.dev').replace(/\/$/, '')

// ---------- Static, indexable routes (mirrors robots.txt / App.jsx) ----------
// changefreq/priority are advisory hints for crawlers.
const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/shop', changefreq: 'daily', priority: '0.9' },
  { path: '/collections', changefreq: 'weekly', priority: '0.8' },
  { path: '/craft', changefreq: 'monthly', priority: '0.6' },
  { path: '/find', changefreq: 'monthly', priority: '0.6' },
  { path: '/journal', changefreq: 'weekly', priority: '0.6' },
  { path: '/store', changefreq: 'monthly', priority: '0.5' },
  { path: '/about', changefreq: 'yearly', priority: '0.4' },
  { path: '/contact', changefreq: 'yearly', priority: '0.4' },
  { path: '/faq', changefreq: 'yearly', priority: '0.3' },
  { path: '/shipping', changefreq: 'yearly', priority: '0.3' },
  { path: '/returns', changefreq: 'yearly', priority: '0.3' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.2' },
  { path: '/terms', changefreq: 'yearly', priority: '0.2' },
]

// ---------- Parse slugs from a source file (no module import; avoids asset imports) ----------
// Returns slug strings found inside a given `export const <name> = [ ... ]` block.
function parseSlugsFromArray(source, exportName) {
  const re = new RegExp(`export const ${exportName}\\s*=\\s*\\[([\\s\\S]*?)\\n\\]`, 'm')
  const m = source.match(re)
  if (!m) return []
  const slugRe = /slug:\s*['"]([^'"]+)['"]/g
  const slugs = []
  let s
  while ((s = slugRe.exec(m[1]))) slugs.push(s[1])
  return slugs
}

function readStaticData() {
  const contentPath = join(root, 'src', 'data', 'content.js')
  const productsPath = join(root, 'src', 'data', 'products.js')
  const collectionsPath = join(root, 'src', 'data', 'collections.js')

  const content = existsSync(contentPath) ? readFileSync(contentPath, 'utf8') : ''
  const products = existsSync(productsPath) ? readFileSync(productsPath, 'utf8') : ''
  const collections = existsSync(collectionsPath) ? readFileSync(collectionsPath, 'utf8') : ''

  return {
    journal: parseSlugsFromArray(content, 'journal'),
    craft: parseSlugsFromArray(content, 'craftLibrary'),
    // Mock product/collection slugs (fallback when Supabase is unreachable).
    mockProducts: (products.match(/slug:\s*['"]([^'"]+)['"]/g) || []).map((x) =>
      x.replace(/slug:\s*['"]|['"]/g, '')
    ),
    mockCollections: (collections.match(/slug:\s*['"]([^'"]+)['"]/g) || []).map((x) =>
      x.replace(/slug:\s*['"]|['"]/g, '')
    ),
  }
}

// ---------- Live product/collection slugs from Supabase (best-effort) ----------
async function fetchLiveSlugs() {
  const url = env.VITE_SUPABASE_URL
  const key = env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) return null
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(url, key)
    const [p, c] = await Promise.all([
      supabase.from('products').select('slug').eq('status', 'published'),
      supabase.from('collections').select('slug').eq('status', 'published'),
    ])
    if (p.error || c.error) throw p.error || c.error
    const products = (p.data || []).map((r) => r.slug).filter(Boolean)
    const collections = (c.data || []).map((r) => r.slug).filter(Boolean)
    if (!products.length && !collections.length) return null
    return { products, collections }
  } catch (e) {
    console.warn('[sitemap] Supabase unreachable, using mock slugs:', e.message)
    return null
  }
}

function xmlEscape(s) {
  return String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]))
}

function urlEntry({ path, changefreq, priority, lastmod }) {
  const loc = `${SITE_URL}${path}`
  return [
    '  <url>',
    `    <loc>${xmlEscape(loc)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    priority ? `    <priority>${priority}</priority>` : null,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n')
}

async function main() {
  const data = readStaticData()
  const live = await fetchLiveSlugs()

  const productSlugs = live?.products?.length ? live.products : data.mockProducts
  const collectionSlugs = live?.collections?.length ? live.collections : data.mockCollections

  const today = new Date().toISOString().slice(0, 10)

  const routes = [
    ...staticRoutes.map((r) => ({ ...r, lastmod: today })),
    ...collectionSlugs.map((slug) => ({ path: `/collections/${slug}`, changefreq: 'weekly', priority: '0.7', lastmod: today })),
    ...productSlugs.map((slug) => ({ path: `/products/${slug}`, changefreq: 'weekly', priority: '0.8', lastmod: today })),
    ...data.craft.map((slug) => ({ path: `/craft/${slug}`, changefreq: 'monthly', priority: '0.5', lastmod: today })),
    ...data.journal.map((slug) => ({ path: `/journal/${slug}`, changefreq: 'monthly', priority: '0.5', lastmod: today })),
  ]

  // De-dupe by path.
  const seen = new Set()
  const unique = routes.filter((r) => (seen.has(r.path) ? false : (seen.add(r.path), true)))

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...unique.map(urlEntry),
    '</urlset>',
    '',
  ].join('\n')

  const outPath = join(root, 'public', 'sitemap.xml')
  writeFileSync(outPath, xml, 'utf8')
  console.log(
    `[sitemap] wrote ${unique.length} urls to public/sitemap.xml (base ${SITE_URL}, ${live ? 'live' : 'mock'} catalog)`
  )
}

main().catch((e) => {
  console.error('[sitemap] failed:', e.message)
  process.exit(1)
})
