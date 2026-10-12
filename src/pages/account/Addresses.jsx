import { useState, useEffect } from 'react'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { listAddresses, saveAddress, deleteAddress } from '../../services/orderService'
import { useAsync } from '../../hooks/useAsync'
import PhoneField from '../../components/ui/PhoneField'
import { isValidPhone, sanitizePin, isValidPin, sanitizePhone } from '../../utils/validation'
import { useGeolocation } from '../../hooks/useGeolocation'

const input = 'w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine'
const EMPTY = { full_name: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', latitude: null, longitude: null }

export default function Addresses() {
  const { user } = useAuth()
  const [key, setKey] = useState(0)
  const { data: addresses, loading } = useAsync(() => listAddresses(user?.id), [user?.id, key], [])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const geo = useGeolocation()

  // When geolocation resolves, store the coordinates on the form.
  useEffect(() => {
    if (geo.coords) {
      setForm((f) => ({ ...f, latitude: geo.coords.latitude, longitude: geo.coords.longitude }))
    }
  }, [geo.coords])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save(e) {
    e.preventDefault()
    setError('')
    if (!isValidPhone(form.phone)) {
      setError('Enter a valid 10-digit mobile number (starting 6–9).')
      return
    }
    if (!isValidPin(form.postal_code)) {
      setError('Enter a valid 6-digit PIN code.')
      return
    }
    try {
      // Store phone with +91 prefix for records.
      await saveAddress(user.id, { ...form, phone: `+91 ${sanitizePhone(form.phone)}` })
      setForm(EMPTY)
      setKey((k) => k + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this address?')) return
    await deleteAddress(id)
    setKey((k) => k + 1)
  }

  return (
    <>
      <Seo title="Addresses" description="Manage your delivery addresses." />
      <Container className="py-14">
        <h1 className="font-serif text-4xl">Addresses</h1>

        <form onSubmit={save} className="mt-6 grid gap-4 border border-beige bg-cream p-5 sm:grid-cols-2">
          <input className={input} placeholder="Full name" value={form.full_name} onChange={set('full_name')} required />
          <PhoneField
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <input className={`${input} sm:col-span-2`} placeholder="Address line 1" value={form.line1} onChange={set('line1')} required />
          <input className={`${input} sm:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2} onChange={set('line2')} />
          <input className={input} placeholder="City" value={form.city} onChange={set('city')} required />
          <input className={input} placeholder="State" value={form.state} onChange={set('state')} required />
          <input className={input} placeholder="PIN code" inputMode="numeric" value={form.postal_code} onChange={(e) => setForm((f) => ({ ...f, postal_code: sanitizePin(e.target.value) }))} required />

          {/* Current location */}
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button
              type="button"
              onClick={geo.capture}
              className="border border-charcoal/40 px-4 py-2 text-sm hover:border-wine hover:text-wine"
            >
              {geo.status === 'loading' ? 'Getting location…' : 'Use my current location'}
            </button>
            {form.latitude != null && (
              <span className="text-xs text-green-700">
                Location saved ({form.latitude.toFixed(4)}, {form.longitude.toFixed(4)})
              </span>
            )}
            {geo.status === 'error' && <span className="text-xs text-wine">{geo.error}</span>}
          </div>

          <div className="sm:col-span-2">
            <Button type="submit" size="sm">{form.id ? 'Update' : 'Add'} Address</Button>
            {form.id && <button type="button" onClick={() => setForm(EMPTY)} className="ml-3 text-sm text-muted">Cancel</button>}
          </div>
          {error && <p className="sm:col-span-2 text-sm text-wine">{error}</p>}
        </form>

        {loading ? (
          <p className="mt-6 text-muted">Loading…</p>
        ) : (addresses || []).length === 0 ? (
          <p className="mt-6 text-muted">No saved addresses yet.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {addresses.map((a) => (
              <li key={a.id} className="border border-beige p-5 text-sm">
                <p className="font-medium">{a.full_name}</p>
                <p className="text-muted">{a.line1}{a.line2 ? `, ${a.line2}` : ''}</p>
                <p className="text-muted">{a.city}, {a.state} {a.postal_code}</p>
                <p className="text-muted">{a.phone}</p>
                <div className="mt-3 flex gap-4">
                  <button onClick={() => setForm({ ...EMPTY, ...a, phone: sanitizePhone(a.phone) })} className="text-wine hover:underline">Edit</button>
                  <button onClick={() => remove(a.id)} className="text-muted hover:text-wine">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  )
}
