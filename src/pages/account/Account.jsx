import { Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'

// Placeholder customer dashboard. Auth + orders/addresses/profile come in a later phase
// (see docs/06-progress-and-status.md).
export default function Account() {
  const tiles = [
    { label: 'Orders', to: '/account', note: 'Coming soon' },
    { label: 'Wishlist', to: '/account/wishlist', note: 'View saved sarees' },
    { label: 'Addresses', to: '/account', note: 'Coming soon' },
    { label: 'Profile', to: '/account', note: 'Coming soon' },
  ]

  return (
    <>
      <Seo title="My Account" description="Manage your orders, wishlist, addresses and profile." />
      <Container className="py-14">
        <span className="eyebrow">Welcome</span>
        <h1 className="mt-2 font-serif text-4xl">Your Account</h1>
        <p className="mt-3 max-w-xl text-muted">
          Sign-in and full account features (orders, addresses, profile) are part of the next
          build phase. Your wishlist is available now.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <Link
              key={t.label}
              to={t.to}
              className="border border-beige bg-cream p-6 transition-colors hover:border-wine"
            >
              <h2 className="font-serif text-xl">{t.label}</h2>
              <p className="mt-1 text-sm text-muted">{t.note}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}
