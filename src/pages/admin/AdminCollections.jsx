import { useState } from 'react'
import {
  adminListCollections,
  adminSaveCollection,
  adminDeleteCollection,
} from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import Button from '../../components/ui/Button'
import { PageHeader, Panel } from './ui'
import { LayersIcon } from './adminIcons'

const input = 'w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine focus:outline-none'
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
    <div className="max-w-4xl space-y-6">
      <PageHeader title="Collections" subtitle="Group sarees into curated collections." icon={LayersIcon} />

      <form onSubmit={save} className="grid gap-4 border border-beige bg-ivory p-5 sm:grid-cols-2">
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

      <Panel title="All collections" bodyClassName="p-0">
        {loading ? (
          <p className="p-5 text-muted">Loading…</p>
        ) : (collections || []).length === 0 ? (
          <p className="p-5 text-muted">No collections yet.</p>
        ) : (
          <ul className="divide-y divide-beige">
            {collections.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-cream/40">
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
      </Panel>
    </div>
  )
}
