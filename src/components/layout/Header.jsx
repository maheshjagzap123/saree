import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  BagIcon,
  MenuIcon,
  CloseIcon,
  ChevronDown,
} from '../ui/icons'

// Editorial navigation. Items with `columns` open a mega panel on hover (desktop).
const nav = [
  {
    label: 'Discover',
    to: '/shop',
    columns: [
      {
        heading: 'Discover',
        links: [
          ['Find Your Paithani', '/shop'],
          ['Signature Edit', '/shop?filter=bestseller'],
          ['New Arrivals', '/shop?filter=new'],
          ['Bridal', '/collections/bridal-paithani'],
          ['Festive', '/collections/festive-paithani'],
          ['Gifts', '/shop'],
        ],
      },
    ],
  },
  {
    label: 'Sarees',
    to: '/shop',
    columns: [
      {
        heading: 'Sarees',
        links: [
          ['All Sarees', '/shop'],
          ['Single Muniya', '/search?q=single%20muniya'],
          ['Triple Muniya', '/search?q=triple%20muniya'],
          ['Brocade', '/search?q=brocade'],
          ['Tissue', '/search?q=tissue'],
          ['Traditional', '/collections/traditional-paithani'],
          ['Designer', '/collections/designer-paithani'],
        ],
      },
    ],
  },
  {
    label: 'The Craft',
    to: '/about',
    columns: [
      {
        heading: 'The Craft',
        links: [
          ['The Paithani', '/about'],
          ['Craft Library', '/craft'],
          ['The Atelier', '/about'],
          ['Motifs & Weaves', '/craft'],
        ],
      },
    ],
  },
  { label: 'Journal', to: '/journal' },
  { label: 'About', to: '/about' },
]

function MegaPanel({ columns, onNavigate }) {
  return (
    <div className="grid min-w-[260px] gap-10 p-8" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}>
      {columns.map((col) => (
        <div key={col.heading}>
          <h3 className="eyebrow mb-4">{col.heading}</h3>
          <ul className="space-y-2.5 text-sm text-muted">
            {col.links.map(([label, to]) => (
              <li key={label}>
                <Link to={to} onClick={onNavigate} className="link-underline hover:text-wine">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default function Header() {
  const { cartCount, wishCount, setCartOpen } = useStore()
  const { isAuthed, isAdmin, signOut } = useAuth()
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-30 border-b border-beige bg-ivory/95 backdrop-blur">
      <div className="container-max flex items-center justify-between gap-6 py-4">
        {/* Mobile menu toggle */}
        <button type="button" className="text-2xl lg:hidden" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </button>

        {/* Logo */}
        <Link to="/" className="shrink-0 text-center" aria-label="Vastraa Paithani home">
          <span className="block font-serif text-2xl font-light leading-none tracking-[0.12em] text-wine">VASTRAA</span>
          <span className="block text-[10px] tracking-wider2 text-gold-antique">PAITHANI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {nav.map((item) =>
            item.columns ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <NavLink to={item.to} className="flex items-center gap-1 text-sm tracking-wide text-charcoal hover:text-wine">
                  {item.label}
                  <ChevronDown className="text-xs" />
                </NavLink>
                {openMenu === item.label && (
                  <div className="absolute left-1/2 top-full -translate-x-1/2 animate-fade-in">
                    <div className="mt-4 border border-beige bg-ivory shadow-xl">
                      <MegaPanel columns={item.columns} onNavigate={() => setOpenMenu(null)} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) => `text-sm tracking-wide hover:text-wine ${isActive ? 'text-wine' : 'text-charcoal'}`}
              >
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4 sm:gap-5">
          <Link to="/search" aria-label="Search" className="hidden text-xl text-charcoal hover:text-wine sm:block">
            <SearchIcon />
          </Link>
          <Link
            to={isAuthed ? '/account' : '/login'}
            aria-label={isAuthed ? 'Account' : 'Sign in'}
            className="hidden text-xl text-charcoal hover:text-wine sm:block"
          >
            <UserIcon />
          </Link>
          <Link to="/account/wishlist" aria-label="Wishlist" className="relative text-xl text-charcoal hover:text-wine">
            <HeartIcon />
            {wishCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] text-ivory">{wishCount}</span>
            )}
          </Link>
          <button type="button" aria-label="Open bag" className="relative text-xl text-charcoal hover:text-wine" onClick={() => setCartOpen(true)}>
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] text-ivory">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-ivory p-6 animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-xl text-wine">Vastraa</span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-2xl"><CloseIcon /></button>
            </div>
            <nav className="flex flex-col gap-5">
              {nav.map((item) => (
                <div key={item.label}>
                  <NavLink to={item.to} onClick={() => setMobileOpen(false)} className="font-serif text-lg text-charcoal hover:text-wine">
                    {item.label}
                  </NavLink>
                  {item.columns && (
                    <ul className="mt-2 space-y-2 pl-3 text-sm text-muted">
                      {item.columns[0].links.map(([label, to]) => (
                        <li key={label}>
                          <Link to={to} onClick={() => setMobileOpen(false)} className="hover:text-wine">{label}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
              <hr className="my-2 border-beige" />
              <Link to="/search" onClick={() => setMobileOpen(false)} className="text-base">Search</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-base">Admin</Link>}
              {isAuthed ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="text-base">Account</Link>
                  <button onClick={() => { setMobileOpen(false); signOut() }} className="text-left text-base text-wine">Sign Out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-base">Sign In</Link>
              )}
              <Link to="/contact" onClick={() => setMobileOpen(false)} className="text-base">Contact</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
