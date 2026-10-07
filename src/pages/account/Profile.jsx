import { useState } from 'react'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../services/orderService'

const input = 'w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine'

export default function Profile() {
  const { user, profile } = useAuth()
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function save(e) {
    e.preventDefault()
    setError('')
    setSaved(false)
    try {
      await updateProfile(user.id, { full_name: fullName, phone })
      setSaved(true)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <Seo title="Profile" description="Your account details." />
      <Container className="py-14">
        <h1 className="font-serif text-4xl">Profile</h1>

        <form onSubmit={save} className="mt-6 max-w-md space-y-4">
          <div>
            <label className="eyebrow mb-1 block">Email</label>
            <input className={`${input} text-muted`} value={user?.email || ''} disabled />
          </div>
          <div>
            <label htmlFor="fn" className="eyebrow mb-1 block">Full name</label>
            <input id="fn" className={input} value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ph" className="eyebrow mb-1 block">Phone</label>
            <input id="ph" className={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          {saved && <p className="text-sm text-green-700">Saved.</p>}
          {error && <p className="text-sm text-wine">{error}</p>}
          <Button type="submit">Save Changes</Button>
        </form>
      </Container>
    </>
  )
}
