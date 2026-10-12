// Cart + wishlist sync for signed-in users.
//
// Guests keep their cart/wishlist in localStorage (handled by StoreContext). Once a user
// signs in we (a) ensure they have a `carts`/`wishlists` row, (b) merge any guest items
// they had locally into the server, then (c) treat Supabase as the source of truth so the
// bag and wishlist follow them across devices.
//
// Every table here is protected by owner-scoped RLS (see migration_cart_wishlist_sync.sql),
// so these calls only ever touch the current user's own rows.

import { supabase, isSupabaseConfigured } from '../lib/supabase'

// ---------- Row resolution (one cart / one wishlist per user) ----------

// Return the id of the user's wishlist, creating it if needed.
async function getWishlistId(userId) {
  const existing = await supabase
    .from('wishlists')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (existing.data?.id) return existing.data.id

  const created = await supabase
    .from('wishlists')
    .upsert({ user_id: userId }, { onConflict: 'user_id' })
    .select('id')
    .single()
  if (created.error) throw created.error
  return created.data.id
}

// Return the id of the user's cart, creating it if needed.
async function getCartId(userId) {
  const existing = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()
  if (existing.data?.id) return existing.data.id

  const created = await supabase
    .from('carts')
    .upsert({ user_id: userId }, { onConflict: 'user_id' })
    .select('id')
    .single()
  if (created.error) throw created.error
  return created.data.id
}

// ---------- Wishlist ----------

// Load the user's wishlist as an array of product ids.
export async function loadWishlist(userId) {
  if (!isSupabaseConfigured || !userId) return null
  const wishlistId = await getWishlistId(userId)
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('product_id')
    .eq('wishlist_id', wishlistId)
  if (error) throw error
  return (data || []).map((r) => r.product_id)
}

export async function addWishlistItem(userId, productId) {
  if (!isSupabaseConfigured || !userId) return
  const wishlistId = await getWishlistId(userId)
  const { error } = await supabase
    .from('wishlist_items')
    .upsert({ wishlist_id: wishlistId, product_id: productId }, { onConflict: 'wishlist_id,product_id' })
  if (error) throw error
}

export async function removeWishlistItem(userId, productId) {
  if (!isSupabaseConfigured || !userId) return
  const wishlistId = await getWishlistId(userId)
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('wishlist_id', wishlistId)
    .eq('product_id', productId)
  if (error) throw error
}

// Merge a set of local (guest) product ids into the server wishlist, then return the
// combined list. Used once right after sign-in.
export async function mergeWishlist(userId, localIds = []) {
  if (!isSupabaseConfigured || !userId) return localIds
  const wishlistId = await getWishlistId(userId)
  if (localIds.length) {
    const rows = localIds.map((product_id) => ({ wishlist_id: wishlistId, product_id }))
    const { error } = await supabase
      .from('wishlist_items')
      .upsert(rows, { onConflict: 'wishlist_id,product_id' })
    if (error) throw error
  }
  return loadWishlist(userId)
}

// ---------- Cart ----------

// Load the user's cart. Returns an array of line items in the UI shape
// ({ id, name, slug, price, image, qty }) by joining the product.
export async function loadCart(userId) {
  if (!isSupabaseConfigured || !userId) return null
  const cartId = await getCartId(userId)
  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity, product_id, products:product_id ( id, name, slug, price, product_images ( url, position, is_primary ) )')
    .eq('cart_id', cartId)
  if (error) throw error
  return (data || [])
    .filter((r) => r.products) // drop items whose product was deleted
    .map((r) => {
      const imgs = Array.isArray(r.products.product_images)
        ? [...r.products.product_images].sort(
            (a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.position - b.position
          )
        : []
      return {
        id: r.products.id,
        name: r.products.name,
        slug: r.products.slug,
        price: Number(r.products.price),
        image: imgs[0]?.url,
        qty: r.quantity,
      }
    })
}

export async function setCartItem(userId, productId, quantity) {
  if (!isSupabaseConfigured || !userId) return
  const cartId = await getCartId(userId)
  if (quantity <= 0) return removeCartItem(userId, productId)
  const { error } = await supabase
    .from('cart_items')
    .upsert({ cart_id: cartId, product_id: productId, quantity }, { onConflict: 'cart_id,product_id' })
  if (error) throw error
}

export async function removeCartItem(userId, productId) {
  if (!isSupabaseConfigured || !userId) return
  const cartId = await getCartId(userId)
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('cart_id', cartId)
    .eq('product_id', productId)
  if (error) throw error
}

export async function clearCart(userId) {
  if (!isSupabaseConfigured || !userId) return
  const cartId = await getCartId(userId)
  const { error } = await supabase.from('cart_items').delete().eq('cart_id', cartId)
  if (error) throw error
}

// Merge local (guest) cart lines into the server cart, summing quantities for products
// already present, then return the combined cart. Used once right after sign-in.
export async function mergeCart(userId, localLines = []) {
  if (!isSupabaseConfigured || !userId) return localLines
  const cartId = await getCartId(userId)
  if (localLines.length) {
    // Read existing quantities so we can sum rather than overwrite.
    const { data: existing, error: readErr } = await supabase
      .from('cart_items')
      .select('product_id, quantity')
      .eq('cart_id', cartId)
    if (readErr) throw readErr
    const byId = new Map((existing || []).map((r) => [r.product_id, r.quantity]))
    const rows = localLines.map((l) => ({
      cart_id: cartId,
      product_id: l.id,
      quantity: (byId.get(l.id) || 0) + (l.qty || 1),
    }))
    const { error } = await supabase
      .from('cart_items')
      .upsert(rows, { onConflict: 'cart_id,product_id' })
    if (error) throw error
  }
  return loadCart(userId)
}
