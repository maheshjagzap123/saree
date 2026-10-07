import { Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import { useAuth } from '../../context/AuthContext'

export default function Account() {
  const { displayName } = useAuth()

  const tiles = [
    { label: 'Orders', to: '/account/orders', note: 'View your order history' },
    { label: 'Wishlist', to: '/account/wishlist', note: 'Your saved sarees' },
    { label: 'Addresses', to: '/account/addresses', note: 'Manage delivery addresses' },
    { label: 'Profile', to: '/account/profile', note: 'Your details' },
  ]

  return (
    <>
      <Seo title="My Account" description="Manage your orders, wishlist, addresses and profile." />
      <Container className="py-14">
        <span className="eyebrow">Welcome</span>
        <h1 className="mt-2 font-serif text-4xl">Hello, {displayName}</h1>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((t) => (
            <Link key={t.label} to={t.to} className="border border-beige bg-cream p-6 transition-colors hover:border-wine">
              <h2 className="font-serif text-xl">{t.label}</h2>
              <p className="mt-1 text-sm text-muted">{t.note}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}
