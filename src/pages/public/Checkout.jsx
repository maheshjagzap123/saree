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

// Order Request flow (no online payment): Details → Review → submit.
// Preferred contact method + order notes are stored inside the shipping_address jsonb,
// so no schema change is needed.
export default function Checkout() {
  const { cart, cartSubtotal, clearCart } = useStore()
  const { user, displayName } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('details')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    full_name: displayName !== 'there' ? displayName : '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postal_code: '',
    contact_method: 'WhatsApp',
    notes: '',
  })

  const set = (k) => (e) => setForm((a) => ({ ...a, [k]: e.target.value }))

  if (cart.length === 0) {
    return (
      <Container className="py-20 text-center">
        <h1 className="font-serif text-3xl font-light">Your bag is empty</h1>
        <Button to="/shop" className="mt-6">Explore the Collection</Button>
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
        address: form, // includes contact_method + notes in the jsonb
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

  const detailsValid =
    form.full_name && form.phone && form.line1 && form.city && form.state && form.postal_code

  return (
    <>
      <Seo title="Order Request" description="Submit your order request and our team will confirm availability and contact you." />
      <Container className="py-14">
        <span className="eyebrow">No online payment required</span>
        <h1 className="mt-2 font-serif text-4xl font-light">Order Request</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          Submit your order request and our team will confirm availability and contact you to
          arrange delivery and payment.
        </p>

        <ol className="mt-6 flex gap-6 text-sm text-muted">
          <li className={step === 'details' ? 'text-wine' : ''}>1. Your Details</li>
          <li className={step === 'review' ? 'text-wine' : ''}>2. Review</li>
          <li>3. Request Sent</li>
        </ol>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_340px]">
          <div>
            {step === 'details' && (
              <form onSubmit={(e) => { e.preventDefault(); setStep('review') }} className="grid gap-4 sm:grid-cols-2">
                <input className={input} placeholder="Full name" value={form.full_name} onChange={set('full_name')} required />
                <input className={input} placeholder="Phone" value={form.phone} onChange={set('phone')} required />
                <input className={`${input} sm:col-span-2`} placeholder="Address line 1" value={form.line1} onChange={set('line1')} required />
                <input className={`${input} sm:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2} onChange={set('line2')} />
                <input className={input} placeholder="City" value={form.city} onChange={set('city')} required />
                <input className={input} placeholder="State" value={form.state} onChange={set('state')} required />
                <input className={input} placeholder="PIN code" value={form.postal_code} onChange={set('postal_code')} required />
                <label className="block">
                  <span className="eyebrow mb-1 block">Preferred contact</span>
                  <select className={input} value={form.contact_method} onChange={set('contact_method')}>
                    <option>WhatsApp</option>
                    <option>Phone call</option>
                    <option>Email</option>
                  </select>
                </label>
                <textarea className={`${input} sm:col-span-2`} rows={3} placeholder="Order notes (optional) — blouse stitching, delivery timing, questions…" value={form.notes} onChange={set('notes')} />
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={!detailsValid}>Continue to Review</Button>
                </div>
              </form>
            )}

            {step === 'review' && (
              <div>
                <h2 className="font-serif text-xl font-light">Review your request</h2>
                <div className="mt-4 border border-beige p-5 text-sm">
                  <p className="font-medium">{form.full_name}</p>
                  <p className="text-muted">
                    {form.line1}{form.line2 ? `, ${form.line2}` : ''}, {form.city}, {form.state} {form.postal_code}
                  </p>
                  <p className="text-muted">{form.phone}</p>
                  <p className="mt-2 text-muted">Preferred contact: {form.contact_method}</p>
                  {form.notes && <p className="mt-2 text-muted">Notes: {form.notes}</p>}
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
                  No payment is taken now. We'll confirm availability and arrange payment on
                  delivery or over your preferred channel.
                </p>

                {error && <p className="mt-4 border border-wine/30 bg-wine/5 p-3 text-sm text-wine">{error}</p>}

                <div className="mt-6 flex gap-3">
                  <Button onClick={placeOrder} disabled={placing}>{placing ? 'Sending…' : 'Submit Order Request'}</Button>
                  <Button variant="outline" onClick={() => setStep('details')}>Back</Button>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit border border-beige p-6">
            <h2 className="font-serif text-xl font-light">Summary</h2>
            <div className="mt-4 flex justify-between text-sm"><span className="text-muted">Subtotal</span><span>{formatPrice(cartSubtotal)}</span></div>
            <div className="mt-2 flex justify-between text-sm"><span className="text-muted">Shipping</span><span>Confirmed on request</span></div>
            <hr className="my-4 border-beige" />
            <div className="flex justify-between font-serif text-lg"><span>Estimated</span><span>{formatPrice(cartSubtotal)}</span></div>
          </aside>
        </div>
      </Container>
    </>
  )
}
