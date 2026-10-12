import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { adminListProducts, adminDeleteProduct } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import Button from '../../components/ui/Button'
import { PageHeader, Panel, StatCard, ProductStatusPill } from './ui'
import { BoxIcon, LayersIcon, SearchIcon } from './adminIcons'

const LOW_STOCK = 3

export default function AdminProducts() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: products, loading } = useAsync(() => adminListProducts(), [refreshKey], [])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('all')

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await adminDeleteProduct(id)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      alert('Could not delete: ' + e.message)
    }
  }

  const list = products || []

  const stats = useMemo(() => ({
    total: list.length,
    published: list.filter((p) => p.status === 'published').length,
    lowStock: list.filter((p) => (p.stock_quantity ?? 0) <= LOW_STOCK).length,
  }), [list])

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return list.filter((p) => {
      if (status !== 'all' && p.status !== status) return false
      if (!term) return true
      return [p.name, p.sku].join(' ').toLowerCase().includes(term)
    })
  }, [list, q, status])

  return (
    <div className="space-y-6">
      <PageHeader title="Products" subtitle="Manage your saree catalogue." icon={BoxIcon}>
        <Button to="/admin/products/new" size="sm">+ New Product</Button>
      </PageHeader>

      {!loading && (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={BoxIcon} label="Total products" value={stats.total} />
          <StatCard icon={LayersIcon} label="Published" value={stats.published} />
          <StatCard icon={BoxIcon} label={`Low stock (≤${LOW_STOCK})`} value={stats.lowStock} />
        </div>
      )}

      <Panel bodyClassName="p-0">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-beige p-4">
          <label className="relative flex-1">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"><SearchIcon /></span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name or SKU…"
              className="w-full min-w-48 border border-beige bg-cream/40 py-2 pl-9 pr-3 text-sm focus:border-wine focus:bg-ivory focus:outline-none"
            />
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3 text-right">Price</th>
                <th className="px-4 py-3 text-right">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige">
              {loading ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted">
                    {list.length === 0 ? 'No products yet.' : 'No products match your filters.'}
                  </td>
                </tr>
              ) : (
                rows.map((p) => {
                  const img = p.product_images?.find((i) => i.is_primary) || p.product_images?.[0]
                  const low = (p.stock_quantity ?? 0) <= LOW_STOCK
                  return (
                    <tr key={p.id} className="hover:bg-cream/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {img ? (
                            <img src={img.url} alt="" className="h-12 w-10 shrink-0 rounded-sm object-cover" loading="lazy" />
                          ) : (
                            <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-sm bg-cream text-muted"><BoxIcon /></span>
                          )}
                          <Link to={`/admin/products/${p.id}`} className="font-medium text-charcoal hover:text-wine">{p.name}</Link>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{p.sku || '—'}</td>
                      <td className="px-4 py-3 text-right">{formatPrice(p.price)}</td>
                      <td className={`px-4 py-3 text-right ${low ? 'font-medium text-wine' : ''}`}>{p.stock_quantity ?? 0}</td>
                      <td className="px-4 py-3"><ProductStatusPill status={p.status} /></td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <Link to={`/admin/products/${p.id}`} className="text-wine hover:underline">Edit</Link>
                        <button onClick={() => handleDelete(p.id, p.name)} className="ml-4 text-muted hover:text-wine">Delete</button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
