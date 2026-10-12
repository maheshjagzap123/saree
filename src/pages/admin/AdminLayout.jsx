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

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex flex-col gap-2 border-b border-beige px-4 py-3 sm:flex-row sm:items-center sm:px-6 sm:py-4">
          <div className="-mx-1 flex gap-4 overflow-x-auto px-1 lg:hidden">
            {nav.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className="shrink-0 whitespace-nowrap text-xs uppercase tracking-wide hover:text-wine">
                {n.label}
              </NavLink>
            ))}
          </div>
          <span className="text-xs text-muted sm:ml-auto sm:text-sm">Signed in as {displayName}</span>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
