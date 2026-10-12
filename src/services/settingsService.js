// Public read of admin-editable site settings (site_settings key/value table).
//
// The storefront reads these at startup to drive the announcement bar, homepage hero and
// store/contact details. site_settings has a public-read RLS policy, so the anon key can
// fetch them. If Supabase isn't configured or the fetch fails, callers fall back to the
// static defaults in src/data/content.js.

import { supabase, isSupabaseConfigured } from '../lib/supabase'

const KEYS = ['store', 'announcement', 'homepage']

export async function getSiteSettings() {
  if (!isSupabaseConfigured) return {}
  try {
    const { data, error } = await supabase.from('site_settings').select('key, value').in('key', KEYS)
    if (error) throw error
    const out = {}
    ;(data || []).forEach((r) => { out[r.key] = r.value })
    return out
  } catch (e) {
    if (import.meta.env.DEV) console.warn('[settingsService] getSiteSettings fell back to defaults:', e.message)
    return {}
  }
}
