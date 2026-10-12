// Overview panel — quick links that switch to the other tabs (no route change).
const tiles = [
  { key: 'orders', label: 'Orders', note: 'View your order history' },
  { key: 'wishlist', label: 'Wishlist', note: 'Your saved sarees' },
  { key: 'addresses', label: 'Addresses', note: 'Manage delivery addresses' },
  { key: 'profile', label: 'Profile Details', note: 'Your personal details' },
]

export default function OverviewPanel({ onSelect }) {
  return (
    <div className="border border-beige bg-ivory p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-light">Overview</h2>
      <p className="mt-1 text-sm text-muted">Everything about your Vastraa account, in one place.</p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {tiles.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onSelect(t.key)}
            className="border border-beige bg-cream p-6 text-left transition-colors hover:border-wine"
          >
            <h3 className="font-serif text-xl font-light">{t.label}</h3>
            <p className="mt-1 text-sm text-muted">{t.note}</p>
          </button>
        ))}
      </div>
    </div>
  )
}
