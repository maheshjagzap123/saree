import { getDashboardStats, getSalesSeries, getTopProducts } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { LineChart, BarList } from './charts'

function Card({ label, value }) {
  return (
    <div className="border border-beige bg-cream p-6">
      <p className="eyebrow">{label}</p>
      <p className="mt-2 font-serif text-3xl font-light">{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { data: stats, loading } = useAsync(() => getDashboardStats(), [])
  const { data: series } = useAsync(() => getSalesSeries(14), [], [])
  const { data: top } = useAsync(() => getTopProducts(5), [], [])

  return (
    <div>
      <h1 className="font-serif text-3xl font-light">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">An overview of your store.</p>

      {loading ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Card label="Revenue" value={formatPrice(stats?.revenue || 0)} />
          <Card label="Orders" value={stats?.orders ?? 0} />
          <Card label="Avg Order Value" value={formatPrice(stats?.avgOrderValue || 0)} />
          <Card label="Products" value={stats?.products ?? 0} />
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="border border-beige p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-light">Revenue — last 14 days</h2>
          </div>
          {series && series.length > 0 ? (
            <div className="mt-4"><LineChart data={series} valueKey="revenue" /></div>
          ) : (
            <p className="mt-4 text-sm text-muted">No data yet.</p>
          )}
        </div>

        <div className="border border-beige p-6">
          <h2 className="font-serif text-xl font-light">Orders — last 14 days</h2>
          {series && series.length > 0 ? (
            <div className="mt-4"><LineChart data={series} valueKey="orders" /></div>
          ) : (
            <p className="mt-4 text-sm text-muted">No data yet.</p>
          )}
        </div>
      </div>

      <div className="mt-6 border border-beige p-6">
        <h2 className="font-serif text-xl font-light">Top products</h2>
        {top && top.length > 0 ? (
          <div className="mt-4"><BarList items={top} /></div>
        ) : (
          <p className="mt-4 text-sm text-muted">No sales yet — top products appear once orders are placed.</p>
        )}
      </div>
    </div>
  )
}
