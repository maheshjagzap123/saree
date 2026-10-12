import { useMemo, useState } from 'react'
import { adminListOrders, adminGetOrder, adminUpdateOrder } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { ORDER_STATUSES, STATUS_LABELS } from '../../constants/orders'
import Button from '../../components/ui/Button'
import { PageHeader, Panel, StatCard, StatusPill } from './ui'
import { CartIcon, SearchIcon } from './adminIcons'

const OPEN_STATUSES = ['placed', 'confirmed', 'processing']

export default function AdminOrders() {
  const [key, setKey] = useState(0)
  const { data: orders, loading } = useAsync(() => adminListOrders(), [key], [])
  const [selected, setSelected] = useState(null)
  const [q, setQ] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  async function open(id) {
    const order = await adminGetOrder(id)
    setSelected(order)
  }

  async function updateStatus(status) {
    const updated = await adminUpdateOrder(selected.id, { status })
    setSelected((s) => ({ ...s, status: updated.status }))
    setKey((k) => k + 1)
  }

  async function updateTracking(tracking_number) {
    await adminUpdateOrder(selected.id, { tracking_number })
    setSelected((s) => ({ ...s, tracking_number }))
    setKey((k) => k + 1)
  }

  const list = orders || []

  const stats = useMemo(() => ({
    total: list.length,
    revenue: list.reduce((s, o) => s + Number(o.total || 0), 0),
    open: list.filter((o) => OPEN_STATUSES.includes(o.status)).length,
  }), [list])

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return list.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false
      if (!term) return true
      return [o.order_number, o.shipping_address?.full_name].join(' ').toLowerCase().includes(term)
    })
  }, [list, q, statusFilter])

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" subtitle="Review order requests and update their status." icon={CartIcon} />

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={CartIcon} label="Total orders" value={stats.total} />
          <StatCard icon={CartIcon} label="Revenue" value={formatPrice(stats.revenue)} />
          <StatCard icon={CartIcon} label="Open (to fulfil)" value={stats.open} />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Panel bodyClassName="p-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b border-beige p-4">
            <label className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"><SearchIcon /></span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search order # or customer…"
                className="w-full min-w-48 border border-beige bg-cream/40 py-2 pl-9 pr-3 text-sm focus:border-wine focus:bg-ivory focus:outline-none"
              />
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine focus:outline-none"
            >
              <option value="all">All statuses</option>
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-[11px] uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {loading ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-muted">Loading…</td></tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-muted">
                      {list.length === 0 ? 'No orders yet.' : 'No orders match your filters.'}
                    </td>
                  </tr>
                ) : (
                  rows.map((o) => (
                    <tr
                      key={o.id}
                      className={`cursor-pointer hover:bg-cream/40 ${selected?.id === o.id ? 'bg-cream/60' : ''}`}
                      onClick={() => open(o.id)}
                    >
                      <td className="px-4 py-3 font-medium">{o.order_number}</td>
                      <td className="px-4 py-3 text-muted">{o.shipping_address?.full_name || '—'}</td>
                      <td className="px-4 py-3 text-muted">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                      <td className="px-4 py-3 text-right">{formatPrice(o.total)}</td>
                      <td className="px-4 py-3"><StatusPill status={o.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        {/* Detail panel */}
        {selected && (
          <Panel title={selected.order_number} className="h-fit" action={<StatusPill status={selected.status} />}>
            <p className="-mt-1 mb-4 text-xs text-muted">{new Date(selected.created_at).toLocaleString('en-IN')}</p>

            <h3 className="eyebrow">Items</h3>
            <ul className="mt-2 space-y-1 text-sm">
              {(selected.order_items || []).map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span>{it.name} × {it.quantity}</span>
                  <span>{formatPrice(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-beige pt-2 text-sm font-medium">
              <span>Total</span><span>{formatPrice(selected.total)}</span>
            </div>

            {selected.shipping_address && (
              <>
                <h3 className="eyebrow mt-5">Shipping to</h3>
                <p className="mt-1 text-sm text-muted">
                  {selected.shipping_address.full_name}<br />
                  {selected.shipping_address.line1}, {selected.shipping_address.city}<br />
                  {selected.shipping_address.state} {selected.shipping_address.postal_code}<br />
                  {selected.shipping_address.phone}
                </p>
              </>
            )}

            <h3 className="eyebrow mt-5">Status</h3>
            <select
              value={selected.status}
              onChange={(e) => updateStatus(e.target.value)}
              className="mt-1 w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine focus:outline-none"
            >
              {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>

            <h3 className="eyebrow mt-5">Tracking number</h3>
            <input
              defaultValue={selected.tracking_number || ''}
              onBlur={(e) => updateTracking(e.target.value)}
              placeholder="Add tracking…"
              className="mt-1 w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine focus:outline-none"
            />

            <Button variant="outline" size="sm" className="mt-5" onClick={() => setSelected(null)}>Close</Button>
          </Panel>
        )}
      </div>
    </div>
  )
}
