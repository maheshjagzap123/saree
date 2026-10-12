import { useState } from 'react'
import Button from '../../ui/Button'
import PhoneField from '../../ui/PhoneField'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'
import { updateProfile } from '../../../services/orderService'
import { isValidPhone, sanitizePhone } from '../../../utils/validation'

const label = 'mb-1.5 block text-xs uppercase tracking-wider2 text-gold-antique'
const field =
  'w-full border border-beige bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-muted/60 focus:border-wine focus:outline-none disabled:bg-cream disabled:text-muted'

function initialForm(profile) {
  return {
    full_name: profile?.full_name || '',
    phone: sanitizePhone(profile?.phone || ''),
    date_of_birth: profile?.date_of_birth || '',
    newsletter_opt_in: Boolean(profile?.newsletter_opt_in),
  }
}

export default function ProfilePanel() {
  const { user, profile, refreshProfile } = useAuth()
  const { notify } = useToast()
  const [form, setForm] = useState(() => initialForm(profile))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function save(e) {
    e.preventDefault()
    setError('')
    if (!form.full_name.trim()) { setError('Please enter your full name.'); return }
    if (form.phone && !isValidPhone(form.phone)) { setError('Enter a valid 10-digit mobile number (starting 6–9).'); return }
    setSaving(true)
    try {
      await updateProfile(user.id, {
        full_name: form.full_name.trim(),
        phone: form.phone ? `+91 ${sanitizePhone(form.phone)}` : null,
        date_of_birth: form.date_of_birth || null,
        newsletter_opt_in: form.newsletter_opt_in,
      })
      await refreshProfile()
      notify('Your details have been saved')
    } catch (err) {
      setError(err.message || 'Could not save your details.')
      notify('Could not save your details', 'error')
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setForm(initialForm(profile))
    setError('')
  }

  return (
    <div className="border border-beige bg-ivory p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-light">Personal details</h2>
      <p className="mt-1 text-sm text-muted">Keep your information up to date so we can serve you better.</p>

      <form onSubmit={save} className="mt-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="full_name" className={label}>Full name</label>
            <input id="full_name" className={field} value={form.full_name} onChange={(e) => set('full_name', e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email" className={label}>Email address</label>
            <input id="email" className={field} value={user?.email || ''} disabled title="Email cannot be changed here" />
          </div>
          <div>
            <label htmlFor="phone" className={label}>Phone number</label>
            <PhoneField id="phone" value={form.phone} onChange={(v) => set('phone', v)} required={false} />
          </div>
          <div>
            <label htmlFor="dob" className={label}>Date of birth <span className="normal-case text-muted">(optional)</span></label>
            <input id="dob" type="date" className={field} value={form.date_of_birth} onChange={(e) => set('date_of_birth', e.target.value)} />
          </div>
        </div>

        <hr className="my-8 border-beige" />
        <h3 className="font-serif text-xl font-light">Account preferences</h3>
        <p className="mt-1 text-sm text-muted">Choose how you'd like to hear from us.</p>

        <label className="mt-4 flex items-start gap-3">
          <input type="checkbox" checked={form.newsletter_opt_in} onChange={(e) => set('newsletter_opt_in', e.target.checked)} className="mt-0.5 h-4 w-4 accent-wine" />
          <span className="text-sm">
            <span className="text-charcoal">Send me occasional notes from the atelier</span>
            <span className="mt-0.5 block text-xs text-muted">New arrivals, craft stories and special previews.</span>
          </span>
        </label>

        {error && <p role="alert" className="mt-6 border border-wine/30 bg-wine/5 p-3 text-sm text-wine">{error}</p>}

        <div className="mt-8 flex items-center gap-5">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes →'}</Button>
          <button type="button" onClick={cancel} disabled={saving} className="text-sm text-muted hover:text-wine disabled:opacity-50">Cancel</button>
        </div>
      </form>
    </div>
  )
}
