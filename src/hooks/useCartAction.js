import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// Add-to-Bag requires sign-in (same policy as wishlist). Guests are redirected to login
// and returned afterward. Signed-in users add to the cart with feedback.
export function useCartAction() {
  const { addToCart } = useStore()
  const { isAuthed } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  return {
    isAuthed,
    addToCart: (product, qty = 1) => {
      if (!isAuthed) {
        notify('Please sign in to add items to your bag', 'error')
        navigate('/login', { state: { from: location.pathname + location.search } })
        return false
      }
      addToCart(product, qty)
      notify(`${product.name} added to your bag`)
      return true
    },
  }
}
