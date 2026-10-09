// Product + collection data access.
//
// When Supabase is configured (and the tables have data) these read from the database.
// Otherwise — or if a query errors/returns nothing — they fall back to the local mock
// data so the site always renders. This lets the UI work before the DB is seeded.

import { supabase, isSupabaseConfigured } from '../lib/supabase'
import {
  products as mockProducts,
  getProduct as mockGetProduct,
  getProductsByCollection as mockByCollection,
  searchProducts as mockSearch,
} from '../data/products'
import {
  collections as mockCollections,
  getCollection as mockGetCollection,
} from '../data/collections'

// Map a Supabase product row (+ joined images/collection) to the UI product shape.
function mapProduct(row) {
  if (!row) return null
  const images = Array.isArray(row.product_images)
    ? [...row.product_images]
        .sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.position - b.position)
        .map((i) => i.url)
    : row.images || []
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    price: Number(row.price),
    compare_at_price: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    short_description: row.short_description,
    description: row.description,
    product_story: row.product_story,
    craft_story: row.craft_story,
    styling_notes: row.styling_notes,
    occasion_notes: row.occasion_notes,
    care_instructions: row.care_instructions,
    category: row.categories?.name || row.category || 'Paithani',
    collection: row.collections?.slug || row.collection || null,
    color: row.color,
    fabric: row.fabric,
    weave_type: row.weave_type,
    border_type: row.border_type,
    motif: row.motif,
    occasion: typeof row.occasion === 'string' ? row.occasion.split(',').map((s) => s.trim()) : row.occasion || [],
    saree_length: row.saree_length,
    saree_width: row.saree_width,
    blouse_included: row.blouse_included,
    stock_quantity: row.stock_quantity ?? 0,
    status: row.status,
    is_featured: row.is_featured,
    is_bestseller: row.is_bestseller,
    is_new: row.is_new,
    images: images.length ? images : [`https://picsum.photos/seed/vp-${row.slug || row.id}/900/1200`],
  }
}

const PRODUCT_SELECT =
  'id, name, slug, sku, price, compare_at_price, short_description, description, product_story, craft_story, styling_notes, occasion_notes, care_instructions, color, fabric, weave_type, border_type, motif, occasion, saree_length, saree_width, blouse_included, stock_quantity, status, is_featured, is_bestseller, is_new, collections:collection_id ( slug, name ), categories:category_id ( name ), product_images ( url, position, is_primary )'

export async function listProducts() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('status', 'published')
      if (error) throw error
      if (data && data.length) return data.map(mapProduct)
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[productService] listProducts fell back to mock:', e.message)
    }
  }
  return mockProducts
}

export async function getProduct(slug) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_SELECT)
        .eq('slug', slug)
        .maybeSingle()
      if (error) throw error
      if (data) return mapProduct(data)
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[productService] getProduct fell back to mock:', e.message)
    }
  }
  return mockGetProduct(slug)
}

export async function getProductsByCollection(slug) {
  const all = await listProducts()
  const fromAll = all.filter((p) => p.collection === slug)
  if (fromAll.length) return fromAll
  return mockByCollection(slug)
}

export async function searchProducts(query) {
  const all = await listProducts()
  const q = String(query || '').trim().toLowerCase()
  if (!q) return []
  const terms = q.split(/\s+/)
  const results = all.filter((p) => {
    const hay = [p.name, p.sku, p.collection, p.category, p.color, p.motif, p.weave_type, p.border_type]
      .join(' ')
      .toLowerCase()
    return terms.every((t) => hay.includes(t))
  })
  return results.length ? results : mockSearch(query)
}

// ---------- Collections ----------
function mapCollection(row) {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline || '',
    description: row.description || '',
    image: row.cover_image || row.image || '',
  }
}

export async function listCollections() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('slug, name, description, cover_image, status')
        .eq('status', 'published')
      if (error) throw error
      if (data && data.length) return data.map(mapCollection)
    } catch (e) {
      if (import.meta.env.DEV) console.warn('[productService] listCollections fell back to mock:', e.message)
    }
  }
  return mockCollections
}

export async function getCollection(slug) {
  const all = await listCollections()
  return all.find((c) => c.slug === slug) || mockGetCollection(slug)
}
