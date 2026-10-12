import { useState } from 'react'
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  HomeIcon, BoxIcon, LayersIcon, TagIcon, CartIcon, UsersIcon,
  ChatIcon, DocIcon, GearIcon, BellIcon, SearchIcon, MenuIcon, OutIcon, ChevronDown,
} from './adminIcons'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true, Icon: HomeIcon },
  { to: '/admin/products', label: 'Products', Icon: BoxIcon },
  { to: '/admin/collections', label: 'Collections', Icon: LayersIcon },
  { to: '/admin/categories', label: 'Categories', Icon: TagIcon },
  { to: '/admin/orders', label: 'Orders', Icon: CartIcon },
  { to: '/admin/customers', label: 'Customers', Icon: UsersIcon },
  { to: '/admin/enquiries', label: 'Enquiries', Icon: ChatIcon },
  { to: '/admin/content', label: 'Content', Icon: DocIcon },
  { to: '/admin/settings', label: 'Settings', Icon: GearIcon },
]

function initials(name = '', email = '') {
  const b = (name || email || '').trim()
  if (!b) return 'SA'
  const parts = b.split(/\s+/)
  return (parts.length === 1 ? parts[0].slice(0, 2) : parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function SidebarContent({ onNavigate, displayName, user, onSignOut }) {
  return (
    <div className="flex h-full flex-col">
      <Link to="/admin" onClick={onNavigate} className="block px-6 py-5">
        <span className="font-serif text-xl font-light tracking-[0.12em] text-wine">VASTRAA</span>
        <span className="ml-0.5 block text-[9px] tracking-wider2 text-gold-antique">PAITHANI</span>
      </Link>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ to, label, end, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                isActive ? 'bg-wine text-ivory' : 'text-charcoal hover:bg-wine/5'
              }`
            }
          >
            <span className="text-base"><Icon /></span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto border-t border-beige p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-wine/10 text-xs font-medium text-wine">
            {initials(displayName, user?.email)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{displayName}</p>
            <p className="truncate text-xs text-muted">{user?.email}</p>
          </div>
        </div>
        <button onClick={onSignOut} className="mt-3 flex items-center gap-2 text-sm text-wine hover:underline">
          <OutIcon /> Sign out
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const { displayName, user, signOut } = useAuth()
  const navigate = useNavigate()
  const [mobileNav, setMobileNav] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Fixed sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-beige bg-ivory lg:block">
        <SidebarContent displayName={displayName} user={user} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile sidebar drawer */}
      {mobileNav && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMobileNav(false)} />
          <div className="absolute left-0 top-0 h-full w-64 max-w-[85vw] bg-ivory">
            <SidebarContent displayName={displayName} user={user} onSignOut={handleSignOut} onNavigate={() => setMobileNav(false)} />
          </div>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-beige bg-ivory/95 px-4 py-3 backdrop-blur sm:px-6">
          <button className="text-2xl lg:hidden" aria-label="Open menu" onClick={() => setMobileNav(true)}>
            <MenuIcon />
          </button>

          <label className="relative hidden flex-1 items-center sm:flex">
            <span className="pointer-events-none absolute left-3 text-muted"><SearchIcon /></span>
            <input
              type="search"
              placeholder="Search products, orders, customers…"
              className="w-full max-w-xl rounded-md border border-beige bg-cream/50 py-2 pl-10 pr-3 text-sm focus:border-wine focus:bg-ivory focus:outline-none"
            />
          </label>

          <div className="ml-auto flex items-center gap-3">
            <button aria-label="Notifications" className="relative text-xl text-charcoal hover:text-wine">
              <BellIcon />
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] text-ivory">1</span>
            </button>

            <div className="relative">
              <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-wine/10 text-xs font-medium text-wine">
                  {initials(displayName, user?.email)}
                </span>
                <span className="hidden text-sm sm:inline">{displayName}</span>
                <ChevronDown className="hidden text-xs sm:inline" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full z-10 mt-2 w-44 border border-beige bg-ivory py-1 shadow-lg">
                  <Link to="/" className="block px-4 py-2 text-sm hover:bg-cream" onClick={() => setMenuOpen(false)}>View store</Link>
                  <button onClick={handleSignOut} className="block w-full px-4 py-2 text-left text-sm text-wine hover:bg-cream">Sign out</button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
