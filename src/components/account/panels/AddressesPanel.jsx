import { useState, useEffect } from 'react'
import Button from '../../ui/Button'
import PhoneField from '../../ui/PhoneField'
import { Skeleton } from '../../ui/Skeleton'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import { listAddresses, saveAddress, deleteAddress } from '../../../services/orderService'
import { useAsync } from '../../../hooks/useAsync'
import { useGeolocation } from '../../../hooks/useGeolocation'
import { isValidPhone, sanitizePin, isValidPin, sanitizePhone } from '../../../utils/validation'

const input = 'w-full border border-beige bg-white px-3.5 py-2.5 text-sm focus:border-wine focus:outline-none'
const EMPTY = { full_name: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', latitude: null, longitude: null }

export default function AddressesPanel() {
  const { user } = useAuth()
  const { notify } = useToast()
  const [key, setKey] = useState(0)
  const { data: addresses, loading } = useAsync(() => listAddresses(user?.id), [user?.id, key], [])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const geo = useGeolocation()

  useEffect(() => {
    if (geo.coords) setForm((f) => ({ ...f, latitude: geo.coords.latitude, longitude: geo.coords.longitude }))
  }, [geo.coords])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save(e) {
    e.preventDefault()
    setError('')
    if (!isValidPhone(form.phone)) { setError('Enter a valid 10-digit mobile number (starting 6–9).'); return }
    if (!isValidPin(form.postal_code)) { setError('Enter a valid 6-digit PIN code.'); return }
    setSaving(true)
    try {
      await saveAddress(user.id, { ...form, phone: `+91 ${sanitizePhone(form.phone)}` })
      setForm(EMPTY)
      setKey((k) => k + 1)
      notify(form.id ? 'Address updated' : 'Address added')
    } catch (err) {
      setError(err.message)
      notify('Could not save the address', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this address?')) return
    await deleteAddress(id)
    setKey((k) => k + 1)
    notify('Address removed')
  }

  return (
    <div className="border border-beige bg-ivory p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-light">Addresses</h2>
      <p className="mt-1 text-sm text-muted">Manage where your sarees are delivered.</p>

      <form onSubmit={save} className="mt-6 grid gap-4 border border-beige bg-cream p-5 sm:grid-cols-2">
        <input className={input} placeholder="Full name" value={form.full_name} onChange={set('full_name')} required />
        <PhoneField value={form.phone} onChange={(v) => setForm((f) => ({ ...f, phone: v }))} />
        <input className={`${input} sm:col-span-2`} placeholder="Address line 1" value={form.line1} onChange={set('line1')} required />
        <input className={`${input} sm:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2} onChange={set('line2')} />
        <input className={input} placeholder="City" value={form.city} onChange={set('city')} required />
        <input className={input} placeholder="State" value={form.state} onChange={set('state')} required />
        <input className={input} placeholder="PIN code" inputMode="numeric" value={form.postal_code} onChange={(e) => setForm((f) => ({ ...f, postal_code: sanitizePin(e.target.value) }))} required />

        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <button type="button" onClick={geo.capture} className="border border-charcoal/40 px-4 py-2 text-sm hover:border-wine hover:text-wine">
            {geo.status === 'loading' ? 'Getting location…' : 'Use my current location'}
          </button>
          {form.latitude != null && (
            <span className="text-xs text-green-700">Location saved ({form.latitude.toFixed(4)}, {form.longitude.toFixed(4)})</span>
          )}
          {geo.status === 'error' && <span className="text-xs text-wine">{geo.error}</span>}
        </div>

        {error && <p className="sm:col-span-2 text-sm text-wine">{error}</p>}
        <div className="sm:col-span-2">
          <Button type="submit" size="sm" disabled={saving}>{saving ? 'Saving…' : form.id ? 'Update Address' : 'Add Address'}</Button>
          {form.id && <button type="button" onClick={() => setForm(EMPTY)} className="ml-3 text-sm text-muted">Cancel</button>}
        </div>
      </form>

      {loading ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        </div>
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
    </div>
  )
}
