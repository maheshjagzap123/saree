// Tracks recently viewed product slugs in localStorage (guest-friendly, no login needed).
const KEY = 'vastraa.recentlyViewed'
const MAX = 8

export function recordRecentlyViewed(slug) {
  if (!slug) return
  try {
    const list = getRecentlyViewed()
    const next = [slug, ...list.filter((s) => s !== slug)].slice(0, MAX)
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* ignore storage errors */
  }
}

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
