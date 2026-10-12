import { useEffect, useState } from 'react'
import { getSetting, saveSetting } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import { GearIcon } from './adminIcons'

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  whatsapp: '',
  address: '',
  hours: '',
  instagram: '',
  facebook: '',
  free_shipping_threshold: '',
}

// Settings — store details persisted to site_settings('store'). The storefront reads
// these (public read policy); only admins can write (admin write policy).
export default function AdminSettings() {
  const { notify } = useToast()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    getSetting('store')
      .then((v) => { if (active && v) setForm({ ...EMPTY, ...v }) })
      .catch((e) => notify(e.message || 'Could not load settings', 'error'))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await saveSetting('store', {
        ...form,
        free_shipping_threshold: Number(form.free_shipping_threshold) || 0,
      })
      notify('Store settings saved')
    } catch (err) {
      notify(err.message || 'Save failed. Admins only.', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cream text-wine"><GearIcon /></span>
        <div>
          <h1 className="font-serif text-3xl font-light">Settings</h1>
          <p className="mt-1 text-sm text-muted">Store details used across the site and in enquiries.</p>
        </div>
      </div>

      <form onSubmit={onSave} className="max-w-2xl space-y-6">
        <Section title="Store">
          <Field label="Store name" value={form.name} onChange={set('name')} />
          <Field label="Email" type="email" value={form.email} onChange={set('email')} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" value={form.phone} onChange={set('phone')} placeholder="+91 75881 74528" />
            <Field label="WhatsApp number" value={form.whatsapp} onChange={set('whatsapp')} placeholder="917588174528" hint="Country code, digits only (no +)" />
          </div>
          <Field label="Address" value={form.address} onChange={set('address')} />
          <Field label="Opening hours" value={form.hours} onChange={set('hours')} />
        </Section>

        <Section title="Shipping">
          <Field
            label="Free shipping threshold (₹)"
            type="number"
            value={form.free_shipping_threshold}
            onChange={set('free_shipping_threshold')}
            hint="Orders above this amount ship free."
          />
        </Section>

        <Section title="Social">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instagram URL" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/…" />
            <Field label="Facebook URL" value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/…" />
          </div>
        </Section>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save settings'}</Button>
        </div>
      </form>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className="border border-beige bg-ivory p-5">
      <h2 className="eyebrow mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      <input
        {...props}
        className="w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  )
}
