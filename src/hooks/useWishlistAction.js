import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

// Wishlist requires sign-in (Option A). Guests clicking the heart are redirected to login
// and returned to the page they were on. Signed-in users toggle normally.
export function useWishlistAction() {
  const { isWished, toggleWish } = useStore()
  const { isAuthed } = useAuth()
  const { notify } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  function requireAuth() {
    notify('Please sign in to use your wishlist', 'error')
    navigate('/login', { state: { from: location.pathname + location.search } })
  }

  return {
    isAuthed,
    isWished,
    toggleWish: (id) => {
      if (!isAuthed) {
        requireAuth()
        return false
      }
      const wasWished = isWished(id)
      toggleWish(id)
      notify(wasWished ? 'Removed from wishlist' : 'Saved to wishlist')
      return true
    },
  }
}
