import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import * as auth from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load the profile (role) for a user id.
  async function loadProfile(userId) {
    const p = await auth.getProfile(userId)
    setProfile(p)
  }

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }
    let active = true

    auth.getSession().then((session) => {
      if (!active) return
      const u = session?.user ?? null
      setUser(u)
      if (u) loadProfile(u.id)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) loadProfile(u.id)
      else setProfile(null)
    })

    return () => {
      active = false
      sub?.subscription?.unsubscribe()
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthed: Boolean(user),
      isAdmin: profile?.role === 'admin',
      displayName: profile?.full_name || user?.email?.split('@')[0] || 'there',
      async signUp(args) {
        const res = await auth.signUp(args)
        return res
      },
      async signIn(args) {
        const res = await auth.signIn(args)
        return res
      },
      async signOut() {
        await auth.signOut()
        setUser(null)
        setProfile(null)
      },
    }),
    [user, profile, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
