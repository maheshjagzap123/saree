import { NavLink, Outlet, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/collections', label: 'Collections' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
]

export default function AdminLayout() {
  const { displayName, signOut } = useAuth()

  return (
    <div className="flex min-h-screen bg-ivory">
      {/* Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-beige bg-cream p-6 lg:flex">
        <Link to="/admin" className="font-serif text-xl text-wine">
          Vastraa <span className="text-charcoal">Admin</span>
        </Link>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `rounded px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-wine text-ivory' : 'text-charcoal hover:bg-beige'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-6 text-sm">
          <Link to="/" className="block text-muted hover:text-wine">← View store</Link>
          <button onClick={signOut} className="mt-2 text-wine">Sign out</button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-beige px-6 py-4">
          <div className="flex gap-4 lg:hidden">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className="text-xs uppercase tracking-wide hover:text-wine">
                {n.label}
              </NavLink>
            ))}
          </div>
          <span className="ml-auto text-sm text-muted">Signed in as {displayName}</span>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
