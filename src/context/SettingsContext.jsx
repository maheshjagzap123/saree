import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getSiteSettings } from '../services/settingsService'
import { announcement as defaultAnnouncement, store as defaultStore, hero as defaultHero } from '../data/content'

// Provides admin-editable site settings (announcement bar, store details, homepage hero)
// to the storefront. Loads once from site_settings (public read) and falls back to the
// static defaults in src/data/content.js so content always renders immediately.

const SettingsContext = createContext(null)

// Shape the static defaults into the same keys the admin editor writes.
const FALLBACK = {
  announcement: { enabled: true, text: defaultAnnouncement },
  store: {
    name: defaultStore.name,
    email: defaultStore.email,
    phone: defaultStore.phone,
    whatsapp: import.meta.env.VITE_WHATSAPP_NUMBER || '917588174528',
    address: defaultStore.address,
    hours: defaultStore.hours,
    instagram: '',
    facebook: '',
    free_shipping_threshold: 10000,
  },
  homepage: {
    hero_eyebrow: defaultHero.eyebrow,
    hero_title: defaultHero.titleLines.join(' '),
    hero_subtitle: defaultHero.copy,
    cta_label: defaultHero.primaryCta.label,
    cta_link: defaultHero.primaryCta.to,
  },
}

export function SettingsProvider({ children }) {
  const [server, setServer] = useState({})

  useEffect(() => {
    let active = true
    getSiteSettings().then((s) => { if (active) setServer(s || {}) })
    return () => { active = false }
  }, [])

  const value = useMemo(() => {
    // Merge server values over fallbacks per key (server wins where present).
    const announcement = { ...FALLBACK.announcement, ...(server.announcement || {}) }
    const store = { ...FALLBACK.store, ...(server.store || {}) }
    const homepage = { ...FALLBACK.homepage, ...(server.homepage || {}) }
    return { announcement, store, homepage }
  }, [server])

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
