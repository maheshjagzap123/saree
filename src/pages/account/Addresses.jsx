import { useState } from 'react'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { listAddresses, saveAddress, deleteAddress } from '../../services/orderService'
import { useAsync } from '../../hooks/useAsync'

const input = 'w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine'
const EMPTY = { full_name: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '' }

export default function Addresses() {
  const { user } = useAuth()
  const [key, setKey] = useState(0)
  const { data: addresses, loading } = useAsync(() => listAddresses(user?.id), [user?.id, key], [])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save(e) {
    e.preventDefault()
    setError('')
    try {
      await saveAddress(user.id, form)
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
          <input className={input} placeholder="Phone" value={form.phone} onChange={set('phone')} required />
          <input className={`${input} sm:col-span-2`} placeholder="Address line 1" value={form.line1} onChange={set('line1')} required />
          <input className={`${input} sm:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2} onChange={set('line2')} />
          <input className={input} placeholder="City" value={form.city} onChange={set('city')} required />
          <input className={input} placeholder="State" value={form.state} onChange={set('state')} required />
          <input className={input} placeholder="PIN code" value={form.postal_code} onChange={set('postal_code')} required />
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
                  <button onClick={() => setForm({ ...EMPTY, ...a })} className="text-wine hover:underline">Edit</button>
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
