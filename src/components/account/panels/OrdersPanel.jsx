import { Link } from 'react-router-dom'
import Button from '../../ui/Button'
import Img from '../../ui/Img'
import { useAuth } from '../../../context/AuthContext'
import { listMyOrders } from '../../../services/orderService'
import { useAsync } from '../../../hooks/useAsync'
import { formatPrice } from '../../../utils/format'
import { STATUS_LABELS } from '../../../constants/orders'
import { Skeleton } from '../../ui/Skeleton'

const statusTone = {
  placed: 'bg-gold/15 text-gold-antique',
  confirmed: 'bg-purple/10 text-purple',
  processing: 'bg-gold/15 text-gold-antique',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-wine/10 text-wine',
}

export default function OrdersPanel() {
  const { user } = useAuth()
  const { data: orders, loading } = useAsync(() => listMyOrders(user?.id), [user?.id], [])

  return (
    <div className="border border-beige bg-ivory p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-light">My orders</h2>
      <p className="mt-1 text-sm text-muted">Track and review your order requests.</p>

      {loading ? (
        <div className="mt-8 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : (orders || []).length === 0 ? (
        <div className="mt-8">
          <p className="text-muted">You haven't placed any orders yet.</p>
          <Button to="/shop" className="mt-6">Explore the Collection</Button>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={o.id} className="border border-beige">
              {/* Order header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-beige bg-cream/50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{o.order_number}</span>
                  <span className="text-xs text-muted">{new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded px-2 py-0.5 text-[11px] uppercase tracking-wide ${statusTone[o.status] || 'bg-cream text-charcoal'}`}>
                    {STATUS_LABELS[o.status] || o.status}
                  </span>
                  <span className="text-sm font-medium">{formatPrice(o.total)}</span>
                </div>
              </div>

              {/* Saree items */}
              <ul className="divide-y divide-beige">
                {(o.items || []).map((it, i) => {
                  const inner = (
                    <>
                      <div className="h-16 w-14 shrink-0 overflow-hidden bg-cream">
                        <Img src={it.image} alt={it.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-serif text-base font-light group-hover:text-wine">{it.name}</p>
                        <p className="text-xs text-muted">Qty {it.quantity}</p>
                      </div>
                      {it.slug && <span className="shrink-0 text-xs uppercase tracking-wide text-wine">View saree →</span>}
                    </>
                  )
                  return (
                    <li key={i} className="px-4 py-3">
                      {it.slug ? (
                        <Link to={`/products/${it.slug}`} className="group flex items-center gap-4">{inner}</Link>
                      ) : (
                        <div className="flex items-center gap-4">{inner}</div>
                      )}
                    </li>
                  )
                })}
                {(o.items || []).length === 0 && (
                  <li className="px-4 py-3 text-sm text-muted">Items unavailable.</li>
                )}
              </ul>

              {/* Footer action */}
              <div className="border-t border-beige px-4 py-3 text-right">
                <Link to={`/account/orders/${o.id}`} className="text-sm text-wine hover:underline">View order details →</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
