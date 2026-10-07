import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'

// Local cart + wishlist state. Persists to localStorage for guests.
// Later: sync to Supabase `carts`/`cart_items` and `wishlists` for logged-in users.

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
    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () => load(CART_KEY, []))
  const [wishlist, setWishlist] = useState(() => load(WISH_KEY, []))
  const [cartOpen, setCartOpen] = useState(false)
  const [quickView, setQuickView] = useState(null)
  const [compare, setCompare] = useState(() => load(COMPARE_KEY, []))

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem(WISH_KEY, JSON.stringify(wishlist))
  }, [wishlist])
  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compare))
  }, [compare])

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
      addToCart: (product, qty) => {
        dispatch({ type: 'add', product, qty })
        setCartOpen(true)
      },
      removeFromCart: (id) => dispatch({ type: 'remove', id }),
      setQty: (id, qty) => dispatch({ type: 'setQty', id, qty }),
      clearCart: () => dispatch({ type: 'clear' }),
      // wishlist
      wishlist,
      wishCount: wishlist.length,
      isWished: (id) => wishlist.includes(id),
      toggleWish: (id) =>
        setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
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
  }, [cart, wishlist, cartOpen, quickView, compare])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
