import { useMemo, useState } from 'react'
import { adminListCustomers } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { SearchIcon, UsersIcon } from './adminIcons'
import { PageHeader, Panel, StatCard } from './ui'

// Customers — reads profiles with a derived order count + lifetime spend. Read-only for
// now (customers manage their own details); admins can search and review.
export default function AdminCustomers() {
  const { data: customers, loading } = useAsync(() => adminListCustomers(), [], [])
  const [q, setQ] = useState('')

  const rows = useMemo(() => {
    const list = customers || []
    const term = q.trim().toLowerCase()
    if (!term) return list
    return list.filter((c) =>
      [c.full_name, c.phone, c.role].join(' ').toLowerCase().includes(term)
    )
  }, [customers, q])

  const totals = useMemo(() => {
    const list = customers || []
    return {
      count: list.length,
      withOrders: list.filter((c) => c.orderCount > 0).length,
      admins: list.filter((c) => c.role === 'admin').length,
    }
  }, [customers])

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" subtitle="View and review the people shopping with Vastraa." icon={UsersIcon}>
        <label className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"><SearchIcon /></span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name or phone…"
            className="w-64 max-w-full border border-beige bg-ivory py-2 pl-9 pr-3 text-sm focus:border-wine focus:outline-none"
          />
        </label>
      </PageHeader>

      {/* Summary chips */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={UsersIcon} label="Total customers" value={totals.count} />
          <StatCard icon={UsersIcon} label="With orders" value={totals.withOrders} />
          <StatCard icon={UsersIcon} label="Admins" value={totals.admins} />
        </div>
      )}

      <Panel bodyClassName="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream text-[11px] uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-right">Orders</th>
              <th className="px-4 py-3 text-right">Lifetime spend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-beige">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  {q ? 'No customers match your search.' : 'No customers yet.'}
                </td>
              </tr>
            ) : (
              rows.map((c) => (
                <tr key={c.id} className="hover:bg-cream/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cream text-sm text-wine">
                        {initials(c.full_name)}
                      </span>
                      <span className="font-medium text-charcoal">{c.full_name || 'Unnamed'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{c.phone || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded px-2 py-0.5 text-[11px] ${c.role === 'admin' ? 'bg-plum/10 text-plum' : 'bg-cream text-charcoal'}`}>
                      {c.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted">{new Date(c.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">{c.orderCount}</td>
                  <td className="px-4 py-3 text-right">{c.lifetimeSpend ? formatPrice(c.lifetimeSpend) : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Panel>
    </div>
  )
}

function initials(name) {
  if (!name) return '•'
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}
