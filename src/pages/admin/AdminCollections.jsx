import { useState } from 'react'
import {
  adminListCollections,
  adminSaveCollection,
  adminDeleteCollection,
} from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import Button from '../../components/ui/Button'

const input = 'w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine'
const EMPTY = { name: '', slug: '', description: '', cover_image: '', status: 'published' }

export default function AdminCollections() {
  const [key, setKey] = useState(0)
  const { data: collections, loading } = useAsync(() => adminListCollections(), [key], [])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save(e) {
    e.preventDefault()
    setError('')
    try {
      await adminSaveCollection(form)
      setForm(EMPTY)
      setKey((k) => k + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id, name) {
    if (!window.confirm(`Delete collection "${name}"?`)) return
    try {
      await adminDeleteCollection(id)
      setKey((k) => k + 1)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif text-3xl">Collections</h1>

      <form onSubmit={save} className="mt-6 grid gap-4 border border-beige bg-cream p-5 sm:grid-cols-2">
        <input className={input} placeholder="Name" value={form.name} onChange={set('name')} required />
        <input className={input} placeholder="Slug (optional)" value={form.slug} onChange={set('slug')} />
        <input className={`${input} sm:col-span-2`} placeholder="Cover image URL" value={form.cover_image} onChange={set('cover_image')} />
        <input className={`${input} sm:col-span-2`} placeholder="Description" value={form.description} onChange={set('description')} />
        <select className={input} value={form.status} onChange={set('status')}>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <div className="sm:col-span-2">
          <Button type="submit" size="sm">{form.id ? 'Update' : 'Add'} Collection</Button>
          {form.id && (
            <button type="button" onClick={() => setForm(EMPTY)} className="ml-3 text-sm text-muted hover:text-wine">Cancel</button>
          )}
        </div>
        {error && <p className="sm:col-span-2 text-sm text-wine">{error}</p>}
      </form>

      {loading ? (
        <p className="mt-6 text-muted">Loading…</p>
      ) : (
        <ul className="mt-6 divide-y divide-beige border border-beige">
          {(collections || []).map((c) => (
            <li key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <span className="font-medium">{c.name}</span>
                <span className="ml-2 text-xs text-muted">/{c.slug}</span>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setForm({ ...EMPTY, ...c })} className="text-wine hover:underline">Edit</button>
                <button onClick={() => remove(c.id, c.name)} className="text-muted hover:text-wine">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
