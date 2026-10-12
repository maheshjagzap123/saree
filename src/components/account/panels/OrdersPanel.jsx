import { Link } from 'react-router-dom'
import Button from '../../ui/Button'
import { useAuth } from '../../../context/AuthContext'
import { listMyOrders } from '../../../services/orderService'
import { useAsync } from '../../../hooks/useAsync'
import { formatPrice } from '../../../utils/format'
import { STATUS_LABELS } from '../../../constants/orders'
import { Skeleton } from '../../ui/Skeleton'

export default function OrdersPanel() {
  const { user } = useAuth()
  const { data: orders, loading } = useAsync(() => listMyOrders(user?.id), [user?.id], [])

  return (
    <div className="border border-beige bg-ivory p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-light">My orders</h2>
      <p className="mt-1 text-sm text-muted">Track and review your order requests.</p>

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
        </div>
      ) : (orders || []).length === 0 ? (
        <div className="mt-8">
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Button to="/shop" className="mt-6">Explore the Collection</Button>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-beige border-y border-beige">
          {orders.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
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
    </div>
  )
}
