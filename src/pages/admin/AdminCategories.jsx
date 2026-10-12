import { useState } from 'react'
import {
  adminListCategories,
  adminSaveCategory,
  adminDeleteCategory,
} from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import Button from '../../components/ui/Button'
import { PageHeader, Panel } from './ui'
import { TagIcon } from './adminIcons'

const input = 'w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-wine focus:outline-none'
const EMPTY = { name: '', slug: '', description: '' }

export default function AdminCategories() {
  const [key, setKey] = useState(0)
  const { data: categories, loading } = useAsync(() => adminListCategories(), [key], [])
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function save(e) {
    e.preventDefault()
    setError('')
    try {
      await adminSaveCategory(form)
      setForm(EMPTY)
      setKey((k) => k + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(id, name) {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try {
      await adminDeleteCategory(id)
      setKey((k) => k + 1)
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader title="Categories" subtitle="Organise sarees by category." icon={TagIcon} />

      <form onSubmit={save} className="flex flex-wrap items-end gap-3 border border-beige bg-ivory p-5">
        <input className={`${input} flex-1`} placeholder="Name" value={form.name} onChange={set('name')} required />
        <input className={`${input} flex-1`} placeholder="Slug (optional)" value={form.slug} onChange={set('slug')} />
        <Button type="submit" size="sm">{form.id ? 'Update' : 'Add'}</Button>
        {form.id && <button type="button" onClick={() => setForm(EMPTY)} className="text-sm text-muted">Cancel</button>}
        {error && <p className="w-full text-sm text-wine">{error}</p>}
      </form>

      <Panel title="All categories" bodyClassName="p-0">
        {loading ? (
          <p className="p-5 text-muted">Loading…</p>
        ) : (categories || []).length === 0 ? (
          <p className="p-5 text-muted">No categories yet.</p>
        ) : (
          <ul className="divide-y divide-beige">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center justify-between px-5 py-3 text-sm hover:bg-cream/40">
                <span>{c.name} <span className="ml-2 text-xs text-muted">/{c.slug}</span></span>
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
