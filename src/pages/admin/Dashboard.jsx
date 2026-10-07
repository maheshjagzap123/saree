import { getDashboardStats } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'

function Card({ label, value }) {
  return (
    <div className="border border-beige bg-cream p-6">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-3xl">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { data: stats, loading } = useAsync(() => getDashboardStats(), [])

  return (
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">An overview of your store.</p>

      {loading ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Revenue" value={formatPrice(stats?.revenue || 0)} />
          <Card label="Orders" value={stats?.orders ?? 0} />
          <Card label="Products" value={stats?.products ?? 0} />
          <Card label="Collections" value={stats?.collections ?? 0} />
        </div>
      )}
    </div>
  )
}
