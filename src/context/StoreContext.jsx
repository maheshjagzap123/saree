import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useAuth } from './AuthContext'
import * as sync from '../services/syncService'

// Cart + wishlist state.
//
// Guests: state lives in localStorage so it survives refreshes.
// Signed-in users: state is synced to Supabase (`carts`/`cart_items`, `wishlists`/
// `wishlist_items`) so the bag and wishlist follow them across devices. On sign-in any
// guest items are merged into the server copy, then the server becomes the source of
// truth. Local state is still updated optimistically for a snappy UI; server writes run
// in the background and are reconciled on the next load.
//
// NOTE: add-to-bag and wishlist both require sign-in (see useCartAction/useWishlistAction),
// so writes to the server only ever happen for an authenticated user.

const StoreContext = createContext(null)

const CART_KEY = 'vastraa.cart'
const WISH_KEY = 'vastraa.wishlist'
const COMPARE_KEY = 'vastraa.compare'
const COMPARE_MAX = 3

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const existing = state.find((i) => i.id === action.product.id)
      if (existing) {
        return state.map((i) =>
          i.id === action.product.id ? { ...i, qty: i.qty + (action.qty || 1) } : i
        )
      }
      return [
        ...state,
        {
          id: action.product.id,
          name: action.product.name,
          slug: action.product.slug,
          price: action.product.price,
          image: action.product.images?.[0],
          qty: action.qty || 1,
        },
      ]
    }
    case 'remove':
      return state.filter((i) => i.id !== action.id)
    case 'setQty':
      return state
        .map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i))
        .filter((i) => i.qty > 0)
    case 'clear':
      return []
    case 'replace':
      return Array.isArray(action.items) ? action.items : []
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const { user } = useAuth()
  const userId = user?.id || null

  const [cart, dispatch] = useReducer(cartReducer, [], () => load(CART_KEY, []))
  const [wishlist, setWishlist] = useState(() => load(WISH_KEY, []))
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [compare, setCompare] = useState(() => load(COMPARE_KEY, []))
  const [syncing, setSyncing] = useState(false)

  // Tracks which user the in-memory state belongs to, so we only merge-on-login once
  // per sign-in and know when to clear on sign-out.
  const syncedUserRef = useRef(null)

  // Persist to localStorage. For signed-in users this is a convenience cache; the server
  // is authoritative and re-hydrates on the next login.
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist))
  }, [wishlist])
  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare))
  }, [compare])

  // ---------- Sync with Supabase on auth changes ----------
  useEffect(() => {
    let active = true

    async function onSignIn() {
      setSyncing(true)
      try {
        // Merge whatever the guest had locally, then adopt the server state.
        const localCart = load(CART_KEY, [])
        const localWish = load(WISH_KEY, [])
        const [serverCart, serverWish] = await Promise.all([
          sync.mergeCart(userId, localCart),
          sync.mergeWishlist(userId, localWish),
        ])
        if (!active) return
        if (serverCart) dispatch({ type: 'replace', items: serverCart })
        if (serverWish) setWishlist(serverWish)
        syncedUserRef.current = userId
      } catch (e) {
        if (import.meta.env.DEV) console.warn('[StoreContext] sign-in sync failed:', e.message)
        // Keep local state; it will be retried on the next sign-in.
        syncedUserRef.current = userId
      } finally {
        if (active) setSyncing(false)
      }
    }

    function onSignOut() {
      // Clear in-memory bag/wishlist so one account's items don't linger for the next
      // visitor on a shared device. (Compare is not account-bound; leave it.)
      dispatch({ type: 'clear' })
      setWishlist([])
      syncedUserRef.current = null
    }

    if (userId) {
      if (syncedUserRef.current !== userId) onSignIn()
    } else if (syncedUserRef.current) {
      onSignOut()
    }

    return () => {
      active = false
    }
  }, [userId])

  // Fire-and-forget server write for authed users; log (don't throw) on failure so the
  // optimistic UI stays responsive. The next sign-in reconciles any drift.
  function mirror(fn) {
    if (!userId) return
    Promise.resolve()
      .then(fn)
      .catch((e) => {
        if (import.meta.env.DEV) console.warn('[StoreContext] server sync failed:', e.message)
      })
  }

  const value = useMemo(() => {
    const cartCount = cart.reduce((n, i) => n + i.qty, 0)
    const cartSubtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

    return {
      // cart
      cart,
      cartCount,
      cartSubtotal,
      cartOpen,
      setCartOpen,
      syncing,
      addToCart: (product, qty) => {
        dispatch({ type: 'add', product, qty })
        setCartOpen(true)
        // Compute the new quantity for this product so the server mirrors the summed total.
        const current = cart.find((i) => i.id === product.id)?.qty || 0
        mirror(() => sync.setCartItem(userId, product.id, current + (qty || 1)))
      },
      removeFromCart: (id) => {
        dispatch({ type: 'remove', id })
        mirror(() => sync.removeCartItem(userId, id))
      },
      setQty: (id, qty) => {
        const next = Math.max(1, qty)
        dispatch({ type: 'setQty', id, qty: next })
        mirror(() => sync.setCartItem(userId, id, next))
      },
      clearCart: () => {
        dispatch({ type: 'clear' })
        mirror(() => sync.clearCart(userId))
      },
      // wishlist
      wishlist,
      wishCount: wishlist.length,
      isWished: (id) => wishlist.includes(id),
      toggleWish: (id) =>
        setWishlist((w) => {
          const has = w.includes(id)
          mirror(() => (has ? sync.removeWishlistItem(userId, id) : sync.addWishlistItem(userId, id)))
          return has ? w.filter((x) => x !== id) : [...w, id]
        }),
      // quick view
      quickView,
      openQuickView: (product) => setQuickView(product),
      closeQuickView: () => setQuickView(null),
      // compare (stores product slugs, max 3)
      compare,
      compareCount: compare.length,
      compareMax: COMPARE_MAX,
      inCompare: (slug) => compare.includes(slug),
      toggleCompare: (slug) =>
        setCompare((c) => {
          if (c.includes(slug)) return c.filter((s) => s !== slug)
          if (c.length >= COMPARE_MAX) return c // ignore beyond max
          return [...c, slug]
        }),
      removeCompare: (slug) => setCompare((c) => c.filter((s) => s !== slug)),
      clearCompare: () => setCompare([]),
    }
  }, [cart, wishlist, cartOpen, quickView, compare, syncing, userId])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
