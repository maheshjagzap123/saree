import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'

export default function AuthPage({ mode = 'login' }) {
  const isSignup = mode === 'signup'
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/account'

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isSignup) {
        await signUp({ email, password, fullName })
      } else {
        await signIn({ email, password })
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <Seo title={isSignup ? 'Create Account' : 'Sign In'} description="Access your Vastraa Paithani account." />
      <Container className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="text-center">
            <span className="eyebrow">{isSignup ? 'Join Us' : 'Welcome Back'}</span>
            <h1 className="mt-3 font-serif text-3xl">{isSignup ? 'Create Your Account' : 'Sign In'}</h1>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            {isSignup && (
              <div>
                <label htmlFor="fullName" className="eyebrow mb-1 block">Full Name</label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="eyebrow mb-1 block">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine"
              />
            </div>
            <div>
              <label htmlFor="password" className="eyebrow mb-1 block">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className="w-full border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine"
              />
            </div>

            {error && <p className="border border-wine/30 bg-wine/5 p-3 text-sm text-wine">{error}</p>}

            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? 'Please wait…' : isSignup ? 'Create Account' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            {isSignup ? (
              <>Already have an account? <Link to="/login" className="text-wine link-underline">Sign in</Link></>
            ) : (
              <>New here? <Link to="/signup" className="text-wine link-underline">Create an account</Link></>
            )}
          </p>
        </div>
      </Container>
    </>
  )
}
