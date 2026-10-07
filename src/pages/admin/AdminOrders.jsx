import { useState } from 'react'
import { adminListOrders, adminGetOrder, adminUpdateOrder } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { ORDER_STATUSES, STATUS_LABELS } from '../../constants/orders'
import Button from '../../components/ui/Button'

export default function AdminOrders() {
  const [key, setKey] = useState(0)
  const { data: orders, loading } = useAsync(() => adminListOrders(), [key], [])
  const [selected, setSelected] = useState(null)

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

  return (
    <div>
      <h1 className="font-serif text-3xl">Orders</h1>

      {loading ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : (
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="overflow-x-auto border border-beige">
            <table className="w-full text-left text-sm">
              <thead className="bg-cream text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {(orders || []).map((o) => (
                  <tr key={o.id} className="cursor-pointer hover:bg-cream/50" onClick={() => open(o.id)}>
                    <td className="px-4 py-3 font-medium">{o.order_number}</td>
                    <td className="px-4 py-3 text-muted">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3 text-xs uppercase">{STATUS_LABELS[o.status] || o.status}</td>
                  </tr>
                ))}
                {(orders || []).length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-10 text-center text-muted">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Detail panel */}
          {selected && (
            <aside className="h-fit border border-beige p-5">
              <h2 className="font-serif text-xl">{selected.order_number}</h2>
              <p className="mt-1 text-xs text-muted">{new Date(selected.created_at).toLocaleString()}</p>

              <h3 className="eyebrow mt-5">Items</h3>
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
                className="mt-1 w-full border border-beige bg-ivory px-3 py-2 text-sm"
              >
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>

              <h3 className="eyebrow mt-5">Tracking number</h3>
              <div className="mt-1 flex gap-2">
                <input
                  defaultValue={selected.tracking_number || ''}
                  onBlur={(e) => updateTracking(e.target.value)}
                  placeholder="Add tracking…"
                  className="flex-1 border border-beige bg-ivory px-3 py-2 text-sm"
                />
              </div>

              <Button variant="outline" size="sm" className="mt-5" onClick={() => setSelected(null)}>Close</Button>
            </aside>
          )}
        </div>
      )}
    </div>
  )
}
