import { Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { listMyOrders } from '../../services/orderService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { STATUS_LABELS } from '../../constants/orders'

export default function Orders() {
  const { user } = useAuth()
  const { data: orders, loading } = useAsync(() => listMyOrders(user?.id), [user?.id], [])

  return (
    <>
      <Seo title="My Orders" description="Your order history." />
      <Container className="py-14">
        <h1 className="font-serif text-4xl">My Orders</h1>

        {loading ? (
          <p className="mt-8 text-muted">Loading…</p>
        ) : (orders || []).length === 0 ? (
          <div className="mt-10">
            <p className="text-muted">You haven't placed any orders yet.</p>
            <Button to="/shop" className="mt-6">Explore Collection</Button>
          </div>
        ) : (
          <ul className="mt-8 divide-y divide-beige border-y border-beige">
            {orders.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <p className="font-medium">{o.order_number}</p>
                  <p className="text-xs text-muted">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <span className="text-sm">{formatPrice(o.total)}</span>
                <span className="text-xs uppercase tracking-wide text-muted">{STATUS_LABELS[o.status] || o.status}</span>
                <Link to={`/account/orders/${o.id}`} className="text-sm text-wine hover:underline">View Order</Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}
