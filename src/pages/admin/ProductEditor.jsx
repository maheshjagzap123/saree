import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  adminGetProduct,
  adminSaveProduct,
  adminListCollections,
  adminListCategories,
  uploadProductImage,
  deleteProductImage,
  setPrimaryImage,
} from '../../services/adminService'
import Button from '../../components/ui/Button'

const EMPTY = {
  name: '', slug: '', sku: '', price: '', compare_at_price: '', stock_quantity: 0,
  short_description: '', description: '', collection_id: '', category_id: '',
  fabric: '', color: '', weave_type: '', border_type: '', motif: '', occasion: '',
  saree_length: '', saree_width: '', blouse_included: true,
  status: 'draft', is_featured: false, is_bestseller: false, is_new: false,
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      {children}
    </label>
  )
}

const input = 'w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine'

export default function ProductEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isNew = id === 'new'

  const [form, setForm] = useState(EMPTY)
  const [images, setImages] = useState([])
  const [collections, setCollections] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    adminListCollections().then(setCollections).catch(() => {})
    adminListCategories().then(setCategories).catch(() => {})
    if (!isNew) {
      adminGetProduct(id)
        .then((p) => {
          if (p) {
            setForm({ ...EMPTY, ...p, price: p.price ?? '', compare_at_price: p.compare_at_price ?? '' })
            setImages(p.product_images || [])
          }
        })
        .finally(() => setLoading(false))
    }
  }, [id, isNew])

  const set = (k) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function save(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const saved = await adminSaveProduct(form)
      if (isNew) {
        navigate(`/admin/products/${saved.id}`, { replace: true })
      } else {
        setForm((f) => ({ ...f, ...saved }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleUpload(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length || isNew) return
    setUploading(true)
    try {
      for (const file of files) {
        const img = await uploadProductImage(form.id || id, file)
        setImages((cur) => [...cur, img])
      }
    } catch (err) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  async function removeImage(imgId) {
    await deleteProductImage(imgId)
    setImages((cur) => cur.filter((i) => i.id !== imgId))
  }

  async function makePrimary(imgId) {
    await setPrimaryImage(form.id || id, imgId)
    setImages((cur) => cur.map((i) => ({ ...i, is_primary: i.id === imgId })))
  }

  if (loading) return <p className="text-muted">Loading…</p>

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl">{isNew ? 'New Product' : 'Edit Product'}</h1>

      {error && <p className="mt-4 border border-wine/30 bg-wine/5 p-3 text-sm text-wine">{error}</p>}

      <form onSubmit={save} className="mt-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><input className={input} value={form.name} onChange={set('name')} required /></Field>
          <Field label="SKU"><input className={input} value={form.sku || ''} onChange={set('sku')} /></Field>
          <Field label="Price (₹)"><input className={input} type="number" value={form.price} onChange={set('price')} required /></Field>
          <Field label="Compare-at price (₹)"><input className={input} type="number" value={form.compare_at_price || ''} onChange={set('compare_at_price')} /></Field>
          <Field label="Stock quantity"><input className={input} type="number" value={form.stock_quantity} onChange={set('stock_quantity')} /></Field>
          <Field label="Status">
            <select className={input} value={form.status} onChange={set('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </Field>
          <Field label="Collection">
            <select className={input} value={form.collection_id || ''} onChange={set('collection_id')}>
              <option value="">—</option>
              {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Category">
            <select className={input} value={form.category_id || ''} onChange={set('category_id')}>
              <option value="">—</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Colour"><input className={input} value={form.color || ''} onChange={set('color')} /></Field>
          <Field label="Fabric"><input className={input} value={form.fabric || ''} onChange={set('fabric')} /></Field>
          <Field label="Weave type"><input className={input} value={form.weave_type || ''} onChange={set('weave_type')} /></Field>
          <Field label="Border type"><input className={input} value={form.border_type || ''} onChange={set('border_type')} /></Field>
          <Field label="Motif"><input className={input} value={form.motif || ''} onChange={set('motif')} /></Field>
          <Field label="Occasion (comma separated)"><input className={input} value={form.occasion || ''} onChange={set('occasion')} /></Field>
          <Field label="Saree length"><input className={input} value={form.saree_length || ''} onChange={set('saree_length')} /></Field>
          <Field label="Saree width"><input className={input} value={form.saree_width || ''} onChange={set('saree_width')} /></Field>
        </div>

        <Field label="Short description">
          <input className={input} value={form.short_description || ''} onChange={set('short_description')} />
        </Field>
        <Field label="Description">
          <textarea className={input} rows={4} value={form.description || ''} onChange={set('description')} />
        </Field>

        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.blouse_included} onChange={set('blouse_included')} className="accent-wine" /> Blouse included</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="accent-wine" /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_bestseller} onChange={set('is_bestseller')} className="accent-wine" /> Bestseller</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_new} onChange={set('is_new')} className="accent-wine" /> New</label>
        </div>

        <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Product'}</Button>
      </form>

      {/* Images */}
      <div className="mt-10 border-t border-beige pt-8">
        <h2 className="font-serif text-xl">Images</h2>
        {isNew ? (
          <p className="mt-2 text-sm text-muted">Save the product first, then add images.</p>
        ) : (
          <>
            <div className="mt-4 flex flex-wrap gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative w-28">
                  <img src={img.url} alt="" className="h-36 w-28 object-cover" />
                  {img.is_primary && (
                    <span className="absolute left-1 top-1 bg-wine px-1.5 py-0.5 text-[10px] uppercase text-ivory">Primary</span>
                  )}
                  <div className="mt-1 flex justify-between text-xs">
                    {!img.is_primary && (
                      <button onClick={() => makePrimary(img.id)} className="text-wine hover:underline">Set primary</button>
                    )}
                    <button onClick={() => removeImage(img.id)} className="text-muted hover:text-wine">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <label className="mt-5 inline-block cursor-pointer border border-charcoal/40 px-4 py-2 text-sm hover:border-wine hover:text-wine">
              {uploading ? 'Uploading…' : 'Upload images'}
              <input type="file" accept="image/*" multiple hidden onChange={handleUpload} disabled={uploading} />
            </label>
          </>
        )}
      </div>
    </div>
  )
}
