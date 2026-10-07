import { useLocation, Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'

export default function OrderSuccess() {
  const { state } = useLocation()
  const order = state?.order

  return (
    <>
      <Seo title="Order Confirmed" description="Thank you for your order." />
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span className="eyebrow">Thank You</span>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Your order is confirmed</h1>
        {order?.order_number && (
          <p className="mt-4 text-muted">
            Order <span className="font-medium text-charcoal">{order.order_number}</span> has been placed.
            We'll be in touch to confirm the details.
          </p>
        )}
        <p className="mt-2 max-w-md text-sm text-muted">
          No payment was taken online — we'll arrange payment on delivery or over WhatsApp.
        </p>
        <div className="mt-8 flex gap-4">
          <Button to="/account/orders">View My Orders</Button>
          <Button to="/shop" variant="outline">Continue Shopping</Button>
        </div>
        <Link to="/" className="mt-6 text-sm text-muted hover:text-wine">Back to home</Link>
      </Container>
    </>
  )
}
