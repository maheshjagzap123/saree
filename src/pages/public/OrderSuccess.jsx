import { useLocation, Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'

const steps = [
  'Order received',
  'Availability confirmed',
  'Preparing your saree',
  'Packed',
  'Dispatched',
  'Delivered',
]

export default function OrderSuccess() {
  const { state } = useLocation()
  const order = state?.order

  return (
    <>
      <Seo title="Order Request Received" description="Thank you — your order request has been received." />
      <Container className="py-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Thank You</span>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            Your order request has been received
          </h1>
          {order?.order_number && (
            <p className="mt-4 text-muted">
              Reference <span className="font-medium text-charcoal">{order.order_number}</span>.
              Our team will confirm availability and contact you shortly.
            </p>
          )}
          <p className="mt-2 text-sm text-muted">
            No payment was taken online — we'll arrange payment on delivery or over your
            preferred channel.
          </p>
        </div>

        {/* Timeline */}
        <ol className="mx-auto mt-12 flex max-w-3xl flex-wrap justify-center gap-x-8 gap-y-4">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-sm">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${i === 0 ? 'bg-wine text-ivory' : 'border border-beige text-muted'}`}>
                {i === 0 ? '✓' : i + 1}
              </span>
              <span className={i === 0 ? 'text-charcoal' : 'text-muted'}>{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center gap-4">
          <Button to="/account/orders">View My Orders</Button>
          <Button to="/shop" variant="outline">Continue Shopping</Button>
        </div>
      </Container>
    </>
  )
}
