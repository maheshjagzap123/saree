import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Container from '../ui/Container'

// Guards routes. `admin` requires an admin role; otherwise just requires a signed-in user.
export default function ProtectedRoute({ children, admin = false }) {
  const { isAuthed, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <Container className="py-24 text-center">
        <p className="text-muted">Loading…</p>
      </Container>
    )
  }

  if (!isAuthed) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (admin && !isAdmin) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-3xl">Admins only</h1>
        <p className="mt-3 text-muted">This area is restricted to store administrators.</p>
      </Container>
    )
  }

  return children
}
