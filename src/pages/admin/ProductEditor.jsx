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
  updateProductImage,
  reorderProductImages,
} from '../../services/adminService'
import Button from '../../components/ui/Button'

const EMPTY = {
  name: '', slug: '', sku: '', price: '', compare_at_price: '', stock_quantity: 0,
  short_description: '', description: '', collection_id: '', category_id: '',
  fabric: '', color: '', weave_type: '', border_type: '', motif: '', occasion: '',
  saree_length: '', saree_width: '', blouse_included: true,
  product_story: '', craft_story: '', styling_notes: '', occasion_notes: '', care_instructions: '',
  seo_title: '', seo_description: '', og_image: '',
  status: 'draft', is_featured: false, is_bestseller: false, is_new: false, is_exclusive: false,
}

const IMAGE_TYPES = ['hero', 'full saree', 'drape', 'pallu', 'border', 'detail', 'blouse', 'packaging', 'video thumbnail']

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      {children}
    </label>
  )
}

function SectionTitle({ children }) {
  return <h2 className="mt-10 border-b border-beige pb-2 font-serif text-xl font-light">{children}</h2>
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
  const [savedMsg, setSavedMsg] = useState('')

  useEffect(() => {
    adminListCollections().then(setCollections).catch(() => {})
    adminListCategories().then(setCategories).catch(() => {})
    if (!isNew) {
      adminGetProduct(id)
        .then((p) => {
          if (p) {
            setForm({ ...EMPTY, ...p, price: p.price ?? '', compare_at_price: p.compare_at_price ?? '' })
            setImages((p.product_images || []).sort((a, b) => (a.display_order ?? a.position) - (b.display_order ?? b.position)))
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
    setSavedMsg('')
    setSaving(true)
    try {
      const saved = await adminSaveProduct(form)
      if (isNew) {
        navigate(`/admin/products/${saved.id}`, { replace: true })
      } else {
        setForm((f) => ({ ...f, ...saved }))
        setSavedMsg('Saved.')
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

  function patchImageLocal(imgId, patch) {
    setImages((cur) => cur.map((i) => (i.id === imgId ? { ...i, ...patch } : i)))
  }

  async function saveImageMeta(img) {
    try {
      await updateProductImage(img.id, { alt_text: img.alt_text || null, image_type: img.image_type || null })
    } catch (err) {
      setError('Could not save image details: ' + err.message)
    }
  }

  async function move(index, dir) {
    const next = [...images]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    ;[next[index], next[target]] = [next[target], next[index]]
    setImages(next)
    try {
      await reorderProductImages(next.map((i) => i.id))
    } catch (err) {
      setError('Could not reorder: ' + err.message)
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>

  return (
    <div className="max-w-3xl">
      <h1 className="font-serif text-3xl font-light">{isNew ? 'New Product' : 'Edit Product'}</h1>

      {error && <p className="mt-4 border border-wine/30 bg-wine/5 p-3 text-sm text-wine">{error}</p>}

      <form onSubmit={save} className="mt-6 space-y-5">
        <SectionTitle>Basics</SectionTitle>
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
        </div>

        <SectionTitle>Product Identity</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Colour"><input className={input} value={form.color || ''} onChange={set('color')} /></Field>
          <Field label="Fabric"><input className={input} value={form.fabric || ''} onChange={set('fabric')} /></Field>
          <Field label="Weave type"><input className={input} value={form.weave_type || ''} onChange={set('weave_type')} /></Field>
          <Field label="Border type"><input className={input} value={form.border_type || ''} onChange={set('border_type')} /></Field>
          <Field label="Motif"><input className={input} value={form.motif || ''} onChange={set('motif')} /></Field>
          <Field label="Occasion (comma separated)"><input className={input} value={form.occasion || ''} onChange={set('occasion')} /></Field>
          <Field label="Saree length"><input className={input} value={form.saree_length || ''} onChange={set('saree_length')} /></Field>
          <Field label="Saree width"><input className={input} value={form.saree_width || ''} onChange={set('saree_width')} /></Field>
        </div>

        <SectionTitle>Editorial</SectionTitle>
        <Field label="Short description">
          <input className={input} value={form.short_description || ''} onChange={set('short_description')} />
        </Field>
        <Field label="Description">
          <textarea className={input} rows={3} value={form.description || ''} onChange={set('description')} />
        </Field>
        <Field label="Product story (The Story Behind the Saree)">
          <textarea className={input} rows={3} value={form.product_story || ''} onChange={set('product_story')} />
        </Field>
        <Field label="Craft story (Craft Details)">
          <textarea className={input} rows={3} value={form.craft_story || ''} onChange={set('craft_story')} />
        </Field>
        <Field label="Styling notes (How to Style)">
          <textarea className={input} rows={2} value={form.styling_notes || ''} onChange={set('styling_notes')} />
        </Field>
        <Field label="Occasion notes">
          <textarea className={input} rows={2} value={form.occasion_notes || ''} onChange={set('occasion_notes')} />
        </Field>
        <Field label="Care instructions">
          <textarea className={input} rows={2} value={form.care_instructions || ''} onChange={set('care_instructions')} />
        </Field>

        <SectionTitle>SEO</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SEO title"><input className={input} value={form.seo_title || ''} onChange={set('seo_title')} /></Field>
          <Field label="OG image URL"><input className={input} value={form.og_image || ''} onChange={set('og_image')} /></Field>
        </div>
        <Field label="SEO description">
          <textarea className={input} rows={2} value={form.seo_description || ''} onChange={set('seo_description')} />
        </Field>

        <SectionTitle>Merchandising</SectionTitle>
        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.blouse_included} onChange={set('blouse_included')} className="accent-wine" /> Blouse included</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="accent-wine" /> Featured</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_bestseller} onChange={set('is_bestseller')} className="accent-wine" /> Bestseller</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_new} onChange={set('is_new')} className="accent-wine" /> New</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_exclusive} onChange={set('is_exclusive')} className="accent-wine" /> Exclusive</label>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save Product'}</Button>
          {savedMsg && <span className="text-sm text-green-700">{savedMsg}</span>}
        </div>
      </form>

      {/* Images */}
      <div className="mt-12 border-t border-beige pt-8">
        <h2 className="font-serif text-xl font-light">Images</h2>
        {isNew ? (
          <p className="mt-2 text-sm text-muted">Save the product first, then add images.</p>
        ) : (
          <>
            <div className="mt-5 space-y-4">
              {images.map((img, index) => (
                <div key={img.id} className="flex gap-4 border border-beige p-3">
                  <div className="relative w-24 shrink-0">
                    <img src={img.url} alt={img.alt_text || ''} className="h-32 w-24 object-cover" />
                    {img.is_primary && (
                      <span className="absolute left-1 top-1 bg-wine px-1.5 py-0.5 text-[10px] uppercase text-ivory">Primary</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="grid gap-2 sm:grid-cols-2">
                      <input
                        className={input}
                        placeholder="Alt text (for SEO & accessibility)"
                        value={img.alt_text || ''}
                        onChange={(e) => patchImageLocal(img.id, { alt_text: e.target.value })}
                        onBlur={() => saveImageMeta(img)}
                      />
                      <select
                        className={input}
                        value={img.image_type || ''}
                        onChange={(e) => { patchImageLocal(img.id, { image_type: e.target.value }); saveImageMeta({ ...img, image_type: e.target.value }) }}
                      >
                        <option value="">Image type…</option>
                        {IMAGE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <button type="button" onClick={() => move(index, -1)} disabled={index === 0} className="hover:text-wine disabled:opacity-30">↑ Up</button>
                      <button type="button" onClick={() => move(index, 1)} disabled={index === images.length - 1} className="hover:text-wine disabled:opacity-30">↓ Down</button>
                      {!img.is_primary && <button type="button" onClick={() => makePrimary(img.id)} className="text-wine hover:underline">Set primary</button>}
                      <button type="button" onClick={() => removeImage(img.id)} className="text-muted hover:text-wine">Remove</button>
                    </div>
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
