import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useStore } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
import { createOrder } from '../../services/orderService'
import { formatPrice } from '../../utils/format'

const input = 'w-full border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine'

// Checkout: Contact + Address → Review → place order. No payment (pay on delivery / enquiry).
export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useStore()
  const { user, displayName } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('details') // details | review
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [addr, setAddr] = useState({
    full_name: displayName !== 'there' ? displayName : '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
  })

  const set = (k) => (e) => setAddr((a) => ({ ...a, [k]: e.target.value }))

  if (cart.length === 0 && step !== 'done') {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-serif text-3xl">Your bag is empty</h1>
        <Button to="/shop" className="mt-6">Explore Collection</Button>
      </Container>
    )
  }

  async function placeOrder() {
    setError('')
    setPlacing(true)
    try {
      const order = await createOrder({
        userId: user.id,
        items: cart,
        address: addr,
        subtotal: cartSubtotal,
        shipping: 0,
      })
      clearCart()
      navigate('/order-success', { state: { order } })
    } catch (e) {
      setError(e.message)
    } finally {
      setPlacing(false)
    }
  }

  const detailsValid = addr.full_name && addr.phone && addr.line1 && addr.city && addr.state && addr.postal_code

  return (
    <>
      <Seo title="Checkout" description="Complete your order." />
      <Container className="py-14">
        <h1 className="font-serif text-4xl">Checkout</h1>
        <ol className="mt-4 flex gap-6 text-sm text-muted">
          <li className={step === 'details' ? 'text-wine' : ''}>1. Details</li>
          <li className={step === 'review' ? 'text-wine' : ''}>2. Review</li>
          <li>3. Order</li>
        </ol>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_340px]">
          <div>
            {step === 'details' && (
              <form
                onSubmit={(e) => { e.preventDefault(); setStep('review') }}
                className="grid gap-4 sm:grid-cols-2"
              >
                <input className={input} placeholder="Full name" value={addr.full_name} onChange={set('full_name')} required />
                <input className={input} placeholder="Phone" value={addr.phone} onChange={set('phone')} required />
                <input className={`${input} sm:col-span-2`} placeholder="Address line 1" value={addr.line1} onChange={set('line1')} required />
                <input className={`${input} sm:col-span-2`} placeholder="Address line 2 (optional)" value={addr.line2} onChange={set('line2')} />
                <input className={input} placeholder="City" value={addr.city} onChange={set('city')} required />
                <input className={input} placeholder="State" value={addr.state} onChange={set('state')} required />
                <input className={input} placeholder="PIN code" value={addr.postal_code} onChange={set('postal_code')} required />
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={!detailsValid}>Continue to Review</Button>
                </div>
              </form>
            )}

            {step === 'review' && (
              <div>
                <h2 className="font-serif text-xl">Review your order</h2>
                <div className="mt-4 border border-beige p-5 text-sm">
                  <p className="font-medium">{addr.full_name}</p>
                  <p className="text-muted">
                    {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.postal_code}
                  </p>
                  <p className="text-muted">{addr.phone}</p>
                </div>

                <ul className="mt-6 divide-y divide-beige border-y border-beige">
                  {cart.map((it) => (
                    <li key={it.id} className="flex items-center gap-4 py-4">
                      <img src={it.image} alt="" className="h-20 w-16 object-cover" />
                      <div className="flex-1 text-sm">
                        <p className="font-medium">{it.name}</p>
                        <p className="text-muted">Qty {it.qty}</p>
                      </div>
                      <span className="text-sm">{formatPrice(it.price * it.qty)}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-4 text-sm text-muted">
                  No online payment required — we'll confirm your order and arrange payment on delivery or over WhatsApp.
                </p>

                {error && <p className="mt-4 border border-wine/30 bg-wine/5 p-3 text-sm text-wine">{error}</p>}

                <div className="mt-6 flex gap-3">
                  <Button onClick={placeOrder} disabled={placing}>{placing ? 'Placing…' : 'Place Order'}</Button>
                  <Button variant="outline" onClick={() => setStep('details')}>Back</Button>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit border border-beige p-6">
            <h2 className="font-serif text-xl">Order Summary</h2>
            <div className="mt-4 flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted">Shipping</span><span>Free</span></div>
            <hr className="my-4 border-beige" />
            <div className="flex justify-between font-serif text-lg"><span>Total</span><span>{formatPrice(cartSubtotal)}</span></div>
          </aside>
        </div>
      </Container>
    </>
  )
}
