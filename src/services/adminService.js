// Admin data access: product/collection/category CRUD, image upload to Storage, orders.
// All writes require an admin role (enforced by RLS). The frontend also gates the UI.

import { supabase } from '../lib/supabase'
import { slugify } from '../utils/format'

const BUCKET = 'product-images'

// ---------- Dashboard ----------
export async function getDashboardStats() {
  const [products, collections, orders] = await Promise.all([
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('collections').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('total', { count: 'exact' }),
  ])
  const revenue = (orders.data || []).reduce((sum, o) => sum + Number(o.total || 0), 0)
  const orderCount = orders.count ?? 0
  return {
    products: products.count ?? 0,
    collections: collections.count ?? 0,
    orders: orderCount,
    revenue,
    avgOrderValue: orderCount ? revenue / orderCount : 0,
  }
}

// Daily revenue + order counts over the last `days` days (for trend charts).
export async function getSalesSeries(days = 14) {
  const since = new Date()
  since.setDate(since.getDate() - (days - 1))
  since.setHours(0, 0, 0, 0)

  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .gte('created_at', since.toISOString())
  if (error) throw error

  // Build a zero-filled bucket per day.
  const buckets = []
  for (let i = 0; i < days; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    buckets.push({ date: d, label: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }), revenue: 0, orders: 0 })
  }
  ;(data || []).forEach((o) => {
    const d = new Date(o.created_at)
    const idx = Math.floor((d - since) / 86400000)
    if (idx >= 0 && idx < buckets.length) {
      buckets[idx].revenue += Number(o.total || 0)
      buckets[idx].orders += 1
    }
  })
  return buckets
}

// Top products by quantity sold (from order_items).
export async function getTopProducts(limit = 5) {
  const { data, error } = await supabase.from('order_items').select('name, quantity, price')
  if (error) throw error
  const map = new Map()
  ;(data || []).forEach((it) => {
    const cur = map.get(it.name) || { name: it.name, qty: 0, revenue: 0 }
    cur.qty += it.quantity
    cur.revenue += Number(it.price) * it.quantity
    map.set(it.name, cur)
  })
  return [...map.values()].sort((a, b) => b.qty - a.qty).slice(0, limit)
}

// ---------- Products ----------
export async function adminListProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, sku, price, stock_quantity, status, is_featured, is_bestseller, is_new, collection_id, product_images(url, is_primary)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function adminGetProduct(id) {
  const { data, error } = await supabase
    .from('products')
    .select('*, product_images(id, url, position, is_primary, image_type, alt_text, display_order)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function adminSaveProduct(form) {
  const payload = {
    name: form.name,
    slug: form.slug || slugify(form.name),
    sku: form.sku || null,
    description: form.description || null,
    short_description: form.short_description || null,
    price: Number(form.price) || 0,
    compare_at_price: form.compare_at_price ? Number(form.compare_at_price) : null,
    stock_quantity: Number(form.stock_quantity) || 0,
    collection_id: form.collection_id || null,
    category_id: form.category_id || null,
    fabric: form.fabric || null,
    color: form.color || null,
    weave_type: form.weave_type || null,
    border_type: form.border_type || null,
    motif: form.motif || null,
    occasion: form.occasion || null,
    saree_length: form.saree_length || null,
    saree_width: form.saree_width || null,
    blouse_included: form.blouse_included ?? true,
    status: form.status || 'draft',
    is_featured: form.is_featured ?? false,
    is_bestseller: form.is_bestseller ?? false,
    is_new: form.is_new ?? false,
    is_exclusive: form.is_exclusive ?? false,
    // Editorial fields
    product_story: form.product_story || null,
    craft_story: form.craft_story || null,
    styling_notes: form.styling_notes || null,
    occasion_notes: form.occasion_notes || null,
    care_instructions: form.care_instructions || null,
    // SEO
    seo_title: form.seo_title || null,
    seo_description: form.seo_description || null,
    og_image: form.og_image || null,
    updated_at: new Date().toISOString(),
  }

  if (form.id) {
    const { data, error } = await supabase.from('products').update(payload).eq('id', form.id).select().single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase.from('products').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) throw error
}

// ---------- Product images (Storage) ----------
export async function uploadProductImage(productId, file) {
  const ext = file.name.split('.').pop()
  const path = `${productId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (upErr) throw upErr
  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path)

  // Determine next position + whether this is the first (primary) image.
  const { data: existing } = await supabase.from('product_images').select('id').eq('product_id', productId)
  const isPrimary = !existing || existing.length === 0

  const { data, error } = await supabase
    .from('product_images')
    .insert({ product_id: productId, url: pub.publicUrl, position: existing?.length || 0, is_primary: isPrimary })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProductImage(imageId) {
  const { error } = await supabase.from('product_images').delete().eq('id', imageId)
  if (error) throw error
}

export async function setPrimaryImage(productId, imageId) {
  await supabase.from('product_images').update({ is_primary: false }).eq('product_id', productId)
  const { error } = await supabase.from('product_images').update({ is_primary: true }).eq('id', imageId)
  if (error) throw error
}

// Update image metadata (alt text, image type).
export async function updateProductImage(imageId, patch) {
  const { data, error } = await supabase.from('product_images').update(patch).eq('id', imageId).select().single()
  if (error) throw error
  return data
}

// Persist a new ordering: writes display_order + position for each image id in order.
export async function reorderProductImages(orderedIds) {
  await Promise.all(
    orderedIds.map((id, idx) =>
      supabase.from('product_images').update({ display_order: idx, position: idx }).eq('id', id)
    )
  )
}

// ---------- Collections ----------
export async function adminListCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('id, name, slug, description, cover_image, status')
    .order('name')
  if (error) throw error
  return data
}

export async function adminSaveCollection(form) {
  const payload = {
    name: form.name,
    slug: form.slug || slugify(form.name),
    description: form.description || null,
    cover_image: form.cover_image || null,
    status: form.status || 'published',
  }
  if (form.id) {
    const { data, error } = await supabase.from('collections').update(payload).eq('id', form.id).select().single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase.from('collections').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteCollection(id) {
  const { error } = await supabase.from('collections').delete().eq('id', id)
  if (error) throw error
}

// ---------- Categories ----------
export async function adminListCategories() {
  const { data, error } = await supabase.from('categories').select('id, name, slug').order('name')
  if (error) throw error
  return data
}

export async function adminSaveCategory(form) {
  const payload = { name: form.name, slug: form.slug || slugify(form.name), description: form.description || null }
  if (form.id) {
    const { data, error } = await supabase.from('categories').update(payload).eq('id', form.id).select().single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase.from('categories').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function adminDeleteCategory(id) {
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) throw error
}

// ---------- Orders ----------
export async function adminListOrders() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at, shipping_address, tracking_number')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function adminGetOrder(id) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

export async function adminUpdateOrder(id, patch) {
  const { data, error } = await supabase.from('orders').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}
