import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Creates an order + its items for the current user. No payment: the order is recorded
// as 'placed' (pay later / cash on delivery / enquiry).
export async function createOrder({ userId, items, address, subtotal, shipping = 0 }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  const total = subtotal + shipping

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      status: 'placed',
      subtotal,
      shipping,
      total,
      shipping_address: address,
    })
    .select()
    .single()
  if (error) throw error

  const orderItems = items.map((i) => ({
    order_id: order.id,
    product_id: i.id,
    name: i.name,
    price: i.price,
    quantity: i.qty,
  }))
  const { error: itemsErr } = await supabase.from('order_items').insert(orderItems)
  if (itemsErr) throw itemsErr

  return order
}

export async function listMyOrders(userId) {
  if (!isSupabaseConfigured || !userId) return []
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, status, total, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getMyOrder(id) {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data
}

// ---------- Addresses ----------
export async function listAddresses(userId) {
  if (!isSupabaseConfigured || !userId) return []
  const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId)
  if (error) throw error
  return data
}

export async function saveAddress(userId, addr) {
  const payload = { ...addr, user_id: userId }
  if (addr.id) {
    const { data, error } = await supabase.from('addresses').update(payload).eq('id', addr.id).select().single()
    if (error) throw error
    return data
  }
  const { data, error } = await supabase.from('addresses').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function deleteAddress(id) {
  const { error } = await supabase.from('addresses').delete().eq('id', id)
  if (error) throw error
}

// ---------- Profile ----------
export async function updateProfile(userId, patch) {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', userId).select().single()
  if (error) throw error
  return data
}
