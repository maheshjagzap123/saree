import { useState } from 'react'
import Button from '../../ui/Button'
import { useAuth } from '../../../context/AuthContext'
import { useToast } from '../../../context/ToastContext'

const label = 'mb-1.5 block text-xs uppercase tracking-wider2 text-gold-antique'
const field =
  'w-full border border-beige bg-white px-3.5 py-2.5 text-sm text-charcoal focus:border-wine focus:outline-none'

export default function SecurityPanel() {
  const { changePassword } = useAuth()
  const { notify } = useToast()

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (next.length < 6) {
      setError('Your new password must be at least 6 characters.')
      return
    }
    if (next !== confirm) {
      setError('The new passwords do not match.')
      return
    }
    setSaving(true)
    try {
      await changePassword({ currentPassword: current, newPassword: next })
      setCurrent(''); setNext(''); setConfirm('')
      notify('Your password has been updated')
    } catch (err) {
      setError(err.message || 'Could not update your password.')
      notify('Could not update your password', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="border border-beige bg-ivory p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-light">Security</h2>
      <p className="mt-1 text-sm text-muted">Update the password you use to sign in.</p>

      <form onSubmit={submit} className="mt-7 max-w-md space-y-5">
        <div>
          <label htmlFor="current" className={label}>Current password</label>
          <input
            id="current"
            type="password"
            autoComplete="current-password"
            className={field}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="new" className={label}>New password</label>
          <input
            id="new"
            type="password"
            autoComplete="new-password"
            minLength={6}
            className={field}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
          />
          <p className="mt-1 text-xs text-muted">At least 6 characters.</p>
        </div>
        <div>
          <label htmlFor="confirm" className={label}>Confirm new password</label>
          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            className={field}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error && <p role="alert" className="border border-wine/30 bg-wine/5 p-3 text-sm text-wine">{error}</p>}

        <Button type="submit" disabled={saving}>{saving ? 'Updating…' : 'Update password →'}</Button>
      </form>
    </div>
  )
}
