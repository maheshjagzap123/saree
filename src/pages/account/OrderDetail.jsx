import { useParams, Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { getMyOrder } from '../../services/orderService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { TRACKING_STEPS, STATUS_LABELS } from '../../constants/orders'

export default function OrderDetail() {
  const { id } = useParams()
  const { data: order, loading } = useAsync(() => getMyOrder(id), [id])

  if (loading) {
    return <Container className="py-24 text-center"><p className="text-muted">Loading…</p></Container>
  }
  if (!order) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-3xl">Order not found</h1>
        <Button to="/account/orders" className="mt-6">Back to Orders</Button>
      </Container>
    )
  }

  const cancelled = order.status === 'cancelled'
  const currentIdx = TRACKING_STEPS.indexOf(order.status)

  return (
    <>
      <Seo title={`Order ${order.order_number}`} description="Order details and tracking." />
      <Container className="py-14">
        <Link to="/account/orders" className="text-sm text-muted hover:text-wine">← All orders</Link>
        <h1 className="mt-2 font-serif text-4xl">{order.order_number}</h1>
        <p className="mt-1 text-sm text-muted">Placed {new Date(order.created_at).toLocaleString()}</p>

        {/* Tracking timeline */}
        {cancelled ? (
          <p className="mt-8 inline-block border border-wine/30 bg-wine/5 px-4 py-2 text-sm text-wine">
            This order was cancelled.
          </p>
        ) : (
          <ol className="mt-8 flex flex-wrap gap-6">
            {TRACKING_STEPS.map((s, i) => {
              const done = i <= currentIdx
              return (
                <li key={s} className="flex items-center gap-2 text-sm">
                  <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${done ? 'bg-wine text-ivory' : 'border border-beige text-muted'}`}>
                    {done ? '✓' : i + 1}
                  </span>
                  <span className={done ? 'text-charcoal' : 'text-muted'}>{STATUS_LABELS[s]}</span>
                </li>
              )
            })}
          </ol>
        )}

        {order.tracking_number && (
          <p className="mt-4 text-sm">Tracking number: <span className="font-medium">{order.tracking_number}</span></p>
        )}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-serif text-xl">Items</h2>
            <ul className="mt-4 divide-y divide-beige border-y border-beige">
              {(order.order_items || []).map((it) => (
                <li key={it.id} className="flex items-center justify-between py-4 text-sm">
                  <span>{it.name} × {it.quantity}</span>
                  <span>{formatPrice(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit border border-beige p-6 text-sm">
            <h2 className="font-serif text-xl">Summary</h2>
            <div className="mt-4 flex justify-between"><span className="text-muted">Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="mt-2 flex justify-between"><span className="text-muted">Shipping</span><span>{order.shipping ? formatPrice(order.shipping) : 'Free'}</span></div>
            <hr className="my-3 border-beige" />
            <div className="flex justify-between font-serif text-lg"><span>Total</span><span>{formatPrice(order.total)}</span></div>

            {order.shipping_address && (
              <>
                <h3 className="eyebrow mt-6">Delivery address</h3>
                <p className="mt-1 text-muted">
                  {order.shipping_address.full_name}<br />
                  {order.shipping_address.line1}, {order.shipping_address.city}<br />
                  {order.shipping_address.state} {order.shipping_address.postal_code}
                </p>
              </>
            )}
          </aside>
        </div>
      </Container>
    </>
  )
}
