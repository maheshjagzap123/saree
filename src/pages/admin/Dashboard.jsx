import { getDashboardStats, getSalesSeries, getTopProducts, getRecentOrders } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { useAuth } from '../../context/AuthContext'
import { formatPrice } from '../../utils/format'
import { IMG } from '../../assets/images'
import { LineChart, BarChart } from './charts'
import { BoxIcon, CartIcon, UsersIcon } from './adminIcons'
import { Panel, StatCard, StatusPill, PanelViewAll } from './ui'

export default function Dashboard() {
  const { displayName } = useAuth()
  const { data: stats, loading } = useAsync(() => getDashboardStats(14), [])
  const { data: series } = useAsync(() => getSalesSeries(14), [], [])
  const { data: top } = useAsync(() => getTopProducts(5), [], [])
  const { data: recent } = useAsync(() => getRecentOrders(5), [], [])

  const c = stats?.changes || {}

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <section className="relative overflow-hidden border border-beige bg-cream">
        <div className="absolute inset-y-0 right-0 hidden w-2/5 md:block">
          <img src={IMG.burgundyPeacock} alt="" aria-hidden className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/70 to-transparent" />
        </div>
        <div className="relative px-6 py-8 sm:py-10">
          <p className="text-sm text-muted">Welcome back,</p>
          <h1 className="mt-1 font-serif text-3xl font-light sm:text-4xl">{displayName}</h1>
          <p className="mt-2 max-w-md text-sm text-muted">Here's what's happening with your Vastraa store today.</p>
        </div>
      </section>

      {/* Metric cards */}
      {loading ? (
        <p className="text-muted">Loading…</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={CartIcon} label="Total Revenue" value={formatPrice(stats?.revenue || 0)} change={c.revenue} />
          <StatCard icon={CartIcon} label="Total Orders" value={stats?.orders ?? 0} change={c.orders} />
          <StatCard icon={BoxIcon} label="Total Products" value={stats?.products ?? 0} change={c.products} />
          <StatCard icon={UsersIcon} label="Total Customers" value={stats?.customers ?? 0} change={c.customers} />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Revenue — Last 14 days">
          {series?.length ? <LineChart data={series} valueKey="revenue" /> : <p className="text-sm text-muted">No data yet.</p>}
        </Panel>
        <Panel title="Orders — Last 14 days">
          {series?.length ? <BarChart data={series} valueKey="orders" /> : <p className="text-sm text-muted">No data yet.</p>}
        </Panel>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Top products" action={<PanelViewAll to="/admin/products" />}>
          {top?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wide text-muted">
                  <tr><th className="pb-2">Product</th><th className="pb-2">Sold</th><th className="pb-2 text-right">Revenue</th></tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {top.map((t) => (
                    <tr key={t.name}>
                      <td className="py-2.5 pr-3">{t.name}</td>
                      <td className="py-2.5">{t.qty}</td>
                      <td className="py-2.5 text-right">{formatPrice(t.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-sm text-muted">No sales yet.</p>}
        </Panel>

        <Panel title="Recent orders" action={<PanelViewAll to="/admin/orders" />}>
          {recent?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-wide text-muted">
                  <tr><th className="pb-2">Order</th><th className="pb-2">Customer</th><th className="pb-2">Total</th><th className="pb-2">Status</th></tr>
                </thead>
                <tbody className="divide-y divide-beige">
                  {recent.map((o) => (
                    <tr key={o.id}>
                      <td className="py-2.5 pr-3 font-medium">{o.order_number}</td>
                      <td className="py-2.5 pr-3 text-muted">{o.shipping_address?.full_name || '—'}</td>
                      <td className="py-2.5">{formatPrice(o.total)}</td>
                      <td className="py-2.5"><StatusPill status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-sm text-muted">No orders yet.</p>}
        </Panel>
      </div>
    </div>
  )
}
