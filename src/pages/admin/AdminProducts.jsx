import { useState } from 'react'
import { Link } from 'react-router-dom'
import { adminListProducts, adminDeleteProduct } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import Button from '../../components/ui/Button'

export default function AdminProducts() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data: products, loading } = useAsync(() => adminListProducts(), [refreshKey], [])

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    try {
      await adminDeleteProduct(id)
      setRefreshKey((k) => k + 1)
    } catch (e) {
      alert('Could not delete: ' + e.message)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Products</h1>
        <Button to="/admin/products/new" size="sm">+ New Product</Button>
      </div>

      {loading ? (
        <p className="mt-8 text-muted">Loading…</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-beige">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige">
              {(products || []).map((p) => {
                const img = p.product_images?.find((i) => i.is_primary) || p.product_images?.[0]
                return (
                  <tr key={p.id} className="hover:bg-cream/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {img && <img src={img.url} alt="" className="h-12 w-10 object-cover" />}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted">{p.sku}</td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">{p.stock_quantity}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs uppercase ${p.status === 'published' ? 'text-green-700' : 'text-muted'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/admin/products/${p.id}`} className="text-wine hover:underline">Edit</Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="ml-4 text-muted hover:text-wine">
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
              {(products || []).length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-muted">No products yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
