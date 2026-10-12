import { useSearchParams, useNavigate } from 'react-router-dom'
import Container from '../ui/Container'
import { useAuth } from '../../context/AuthContext'
import { BagIcon, HeartIcon } from '../ui/icons'
import Img from '../ui/Img'
import { IMG } from '../../assets/images'

// Minimal outline icons for the sidebar.
const base = { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }
const GridIcon = (p) => (<svg {...base} {...p}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>)
const PinIcon = (p) => (<svg {...base} {...p}><path d="M12 21s-6-5.3-6-10a6 6 0 1 1 12 0c0 4.7-6 10-6 10Z" /><circle cx="12" cy="11" r="2" /></svg>)
const IdIcon = (p) => (<svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="1" /><circle cx="9" cy="11" r="2" /><path d="M14 10h4M14 13h4M6 15.5c.8-1.2 4.2-1.2 5 0" /></svg>)
const LockTabIcon = (p) => (<svg {...base} {...p}><rect x="5" y="11" width="14" height="9" rx="1" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>)
const OutIcon = (p) => (<svg {...base} {...p}><path d="M10 17l-5-5 5-5M4 12h11M14 4h5v16h-5" /></svg>)

export const TABS = [
  { key: 'overview', label: 'Overview', Icon: GridIcon },
  { key: 'orders', label: 'Orders', Icon: BagIcon },
  { key: 'wishlist', label: 'Wishlist', Icon: HeartIcon },
  { key: 'addresses', label: 'Addresses', Icon: PinIcon },
  { key: 'profile', label: 'Profile Details', Icon: IdIcon },
  { key: 'security', label: 'Security', Icon: LockTabIcon },
]

const heroImg = IMG.burgundyPeacock

function initials(name = '', email = '') {
  const b = (name || email || '').trim()
  if (!b) return 'VP'
  const parts = b.split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Single-page account shell. The sidebar switches the center panel via a `?tab=` query
 * param — it does NOT navigate to separate routes. `renderPanel(tab)` returns the content
 * for the active tab.
 */
export default function AccountShell({ renderPanel }) {
  const { user, profile, displayName, signOut } = useAuth()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()

  const active = TABS.some((t) => t.key === params.get('tab')) ? params.get('tab') : 'overview'
  const name = profile?.full_name || displayName
  const memberSince = profile?.created_at ? new Date(profile.created_at).getFullYear() : null

  function selectTab(key) {
    const next = new URLSearchParams(params)
    if (key === 'overview') next.delete('tab')
    else next.set('tab', key)
    setParams(next)
    // scroll the panel into view on mobile where the sidebar sits above
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      document.getElementById('account-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-beige bg-cream">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
          <Img src={heroImg} alt="" aria-hidden="true" loading="eager" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/60 to-transparent" />
        </div>
        <Container className="relative py-10 lg:py-16">
          <div className="max-w-xl">
            <span className="eyebrow">Your Account</span>
            <h1
              className="mt-3 break-words font-serif font-light leading-tight"
              style={{ fontSize: 'clamp(1.9rem, 7vw, 3.25rem)' }}
            >
              Welcome back, {name}
            </h1>
            <p className="mt-3 text-sm text-muted sm:text-base">Manage your orders, details and saved sarees in one place.</p>
          </div>
        </Container>
      </section>

      {/* MAIN */}
      <Container className="py-12">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
          {/* Sidebar — buttons that switch the panel (no route change).
              Mobile: 2-col grid of tiles. Desktop: vertical list. */}
          <aside className="min-w-0">
            <nav className="grid grid-cols-2 gap-1 border border-beige bg-cream p-2 sm:grid-cols-3 lg:grid-cols-1">
              {TABS.map(({ key, label, Icon }) => {
                const isActive = active === key
                return (
                  <button
                    key={key}
                    type="button"
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => selectTab(key)}
                    className={`flex items-center gap-2.5 border-l-2 px-3 py-2.5 text-sm transition-colors ${
                      isActive
                        ? 'border-wine bg-wine/5 font-medium text-wine'
                        : 'border-transparent text-charcoal hover:bg-beige/40'
                    }`}
                  >
                    <span className="shrink-0 text-base"><Icon /></span>
                    <span className="truncate">{label}</span>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2.5 border-l-2 border-transparent px-3 py-2.5 text-sm text-charcoal transition-colors hover:bg-beige/40"
              >
                <span className="shrink-0 text-base"><OutIcon /></span>
                <span className="truncate">Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Content panel */}
          <div id="account-panel" className="min-w-0 scroll-mt-24">
            {renderPanel(active, selectTab)}
          </div>

          {/* Summary */}
          <div className="order-last">
            <aside className="border border-beige bg-cream p-6 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-wine/10 font-serif text-2xl text-wine">
                {initials(profile?.full_name, user?.email)}
              </div>
              <h2 className="mt-4 font-serif text-xl font-light">{name}</h2>
              {memberSince && <p className="mt-1 text-xs text-muted">Member since {memberSince}</p>}

              <div className="my-5 flex items-center justify-center gap-2">
                <span className="h-px w-10 bg-beige" />
                <span className="text-gold-antique">✦</span>
                <span className="h-px w-10 bg-beige" />
              </div>

              <p className="flex items-start gap-2 text-left text-xs leading-relaxed text-muted">
                <span className="mt-0.5 shrink-0"><LockIcon /></span>
                Your details are kept private and are used only to manage your orders and
                provide a better shopping experience.
              </p>

              <div className="mt-6 flex justify-center text-gold-soft/50">
                <LotusIcon />
              </div>
            </aside>
          </div>
        </div>
      </Container>
    </>
  )
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-gold-antique">
      <rect x="5" y="11" width="14" height="9" rx="1" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function LotusIcon() {
  return (
    <svg width="56" height="32" viewBox="0 0 56 32" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M28 28 C 20 22, 16 14, 28 6 C 40 14, 36 22, 28 28 Z" />
      <path d="M28 28 C 18 26, 10 22, 10 14 C 20 16, 26 20, 28 28 Z" />
      <path d="M28 28 C 38 26, 46 22, 46 14 C 36 16, 30 20, 28 28 Z" />
    </svg>
  )
}
