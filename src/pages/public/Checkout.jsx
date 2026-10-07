import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useStore } from '../../context/StoreContext'
import { formatPrice } from '../../utils/format'

// Checkout is scaffolded as a visual placeholder. The real flow (Contact → Address →
// Delivery → Payment → Review → Order) with Supabase order creation and payment comes in
// Phase 6 — see docs/05-roadmap-phases.md.
const steps = ['Contact', 'Address', 'Delivery', 'Payment', 'Review']

export default function Checkout() {
  const { cart, cartSubtotal } = useStore()

  return (
    <>
      <Seo title="Checkout" description="Secure checkout." />
      <Container className="py-14">
        <h1 className="font-serif text-4xl">Checkout</h1>

        <ol className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          {steps.map((s, i) => (
            <li key={s} className={i === 0 ? 'text-wine' : ''}>
              {i + 1}. {s}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_340px]">
          <div className="border border-beige bg-cream p-8">
            <p className="text-muted">
              The full checkout experience is part of the next build phase. For now, you can
              review your bag, and reach us on WhatsApp to complete a purchase or enquiry.
            </p>
            <Button to="/cart" variant="outline" className="mt-6">Back to Bag</Button>
          </div>

          <aside className="h-fit border border-beige p-6">
            <h2 className="font-serif text-xl">Order Summary</h2>
            <p className="mt-3 text-sm text-muted">{cart.length} item(s)</p>
            <hr className="my-4 border-beige" />
            <div className="flex justify-between font-serif text-lg">
              <span>Subtotal</span>
              <span>{formatPrice(cartSubtotal)}</span>
            </div>
          </aside>
        </div>
      </Container>
    </>
  )
}
