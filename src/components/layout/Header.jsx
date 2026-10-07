import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { useAuth } from '../../context/AuthContext'
import MegaMenu from './MegaMenu'
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  BagIcon,
  MenuIcon,
  CloseIcon,
  ChevronDown,
} from '../ui/icons'

const navLinks = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/collections', mega: true },
  { label: 'New Arrivals', to: '/shop?filter=new' },
  { label: 'Bridal', to: '/collections/bridal-paithani' },
  { label: 'Our Story', to: '/about' },
  { label: 'Journal', to: '/journal' },
]

export default function Header() {
  const { cartCount, wishCount, setCartOpen } = useStore()
  const { isAuthed, isAdmin, signOut } = useAuth()
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const IconBtn = ({ children, ...p }) => (
    <button
      type="button"
      className="text-xl text-charcoal hover:text-wine transition-colors"
      {...p}
    >
      {children}
    </button>
  )

  return (
    <header className="sticky top-0 z-30 border-b border-beige bg-ivory/95 backdrop-blur">
      <div className="container-max flex items-center justify-between gap-6 py-4">
        {/* Mobile menu toggle */}
        <button
          type="button"
          className="text-2xl lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon />
        </button>

        {/* Logo */}
        <Link to="/" className="shrink-0 text-center">
          <span className="block font-serif text-2xl leading-none tracking-wide text-wine">
            VASTRAA
          </span>
          <span className="block text-[10px] tracking-wider2 text-gold">PAITHANI</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
          {navLinks.map((l) =>
            l.mega ? (
              <div
                key={l.label}
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <NavLink
                  to={l.to}
                  className="flex items-center gap-1 text-sm tracking-wide text-charcoal hover:text-wine"
                >
                  {l.label}
                  <ChevronDown className="text-xs" />
                </NavLink>
                {megaOpen && (
                  <div className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 animate-fade-in">
                    <div className="mt-4 border border-beige bg-ivory shadow-xl">
                      <MegaMenu onNavigate={() => setMegaOpen(false)} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={l.label}
                to={l.to}
                className={({ isActive }) =>
                  `text-sm tracking-wide hover:text-wine ${
                    isActive ? 'text-wine' : 'text-charcoal'
                  }`
                }
              >
                {l.label}
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
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] text-ivory">
                {wishCount}
              </span>
            )}
          </Link>
          <IconBtn aria-label="Open bag" className="relative" onClick={() => setCartOpen(true)}>
            <BagIcon />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-wine px-1 text-[10px] text-ivory">
                {cartCount}
              </span>
            )}
          </IconBtn>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ivory p-6 animate-fade-in">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-serif text-xl text-wine">Menu</span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-2xl">
                <CloseIcon />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {navLinks.map((l) => (
                <NavLink
                  key={l.label}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-charcoal hover:text-wine"
                >
                  {l.label}
                </NavLink>
              ))}
              <hr className="my-2 border-beige" />
              <Link to="/search" onClick={() => setMobileOpen(false)} className="text-base">Search</Link>
              {isAdmin && (
                <Link to="/admin" onClick={() => setMobileOpen(false)} className="text-base">Admin</Link>
              )}
              {isAuthed ? (
                <>
                  <Link to="/account" onClick={() => setMobileOpen(false)} className="text-base">Account</Link>
                  <button
                    onClick={() => { setMobileOpen(false); signOut() }}
                    className="text-left text-base text-wine"
                  >
                    Sign Out
                  </button>
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
