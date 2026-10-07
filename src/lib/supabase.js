// Supabase client stub.
//
// The app currently runs on mock/local data (see src/data). This client is wired and
// ready: when VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env, `supabase`
// becomes a real client. Until then it is null and services fall back to mock data.
//
// SECURITY: only the anon (public) key belongs in the frontend. Never ship the
// service-role key here.

import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    '[Vastraa] Supabase not configured — running on mock data. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect.'
  )
}
