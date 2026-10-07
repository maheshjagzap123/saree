import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Email+password auth. No email verification flow in the UI: on signup we immediately
// try to sign in, which works when "Confirm email" is disabled in the Supabase dashboard.

export async function signUp({ email, password, fullName }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || '' } },
  })
  if (error) throw error
  // Immediately sign in (requires email confirmation to be OFF).
  return signIn({ email, password })
}

export async function signIn({ email, password }) {
  if (!isSupabaseConfigured) throw new Error('Supabase is not configured.')
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) {
    if (/email not confirmed/i.test(error.message)) {
      throw new Error(
        'This account needs email confirmation, which is currently enabled. Ask the site owner to disable "Confirm email" in Supabase, then try again.'
      )
    }
    throw error
  }
  return data
}

export async function signOut() {
  if (!isSupabaseConfigured) return
  await supabase.auth.signOut()
}

export async function getSession() {
  if (!isSupabaseConfigured) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function getProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, phone, role')
    .eq('id', userId)
    .maybeSingle()
  return data
}
