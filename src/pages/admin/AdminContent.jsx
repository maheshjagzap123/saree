import { useEffect, useState } from 'react'
import { getSettings, saveSetting } from '../../services/adminService'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/ui/Button'
import { DocIcon } from './adminIcons'

const EMPTY_ANN = { enabled: true, text: '' }
const EMPTY_HOME = { hero_eyebrow: '', hero_title: '', hero_subtitle: '', cta_label: '', cta_link: '/shop' }

// Content — edit the announcement bar and homepage hero copy. Stored in site_settings
// ('announcement', 'homepage'); public read, admin write.
export default function AdminContent() {
  const { notify } = useToast()
  const [ann, setAnn] = useState(EMPTY_ANN)
  const [home, setHome] = useState(EMPTY_HOME)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(null) // 'announcement' | 'homepage' | null

  useEffect(() => {
    let active = true
    getSettings(['announcement', 'homepage'])
      .then((s) => {
        if (!active) return
        if (s.announcement) setAnn({ ...EMPTY_ANN, ...s.announcement })
        if (s.homepage) setHome({ ...EMPTY_HOME, ...s.homepage })
      })
      .catch((e) => notify(e.message || 'Could not load content', 'error'))
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function save(key, value) {
    setSaving(key)
    try {
      await saveSetting(key, value)
      notify('Content saved')
    } catch (err) {
      notify(err.message || 'Save failed. Admins only.', 'error')
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <p className="text-muted">Loading…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cream text-wine"><DocIcon /></span>
        <div>
          <h1 className="font-serif text-3xl font-light">Content</h1>
          <p className="mt-1 text-sm text-muted">Edit the announcement bar and homepage hero copy.</p>
        </div>
      </div>

      {/* Announcement bar */}
      <section className="max-w-2xl border border-beige bg-ivory p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="eyebrow">Announcement bar</h2>
          <label className="flex items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={ann.enabled}
              onChange={(e) => setAnn((a) => ({ ...a, enabled: e.target.checked }))}
            />
            Show on site
          </label>
        </div>
        <label className="block">
          <span className="eyebrow mb-1 block">Message</span>
          <input
            value={ann.text}
            onChange={(e) => setAnn((a) => ({ ...a, text: e.target.value }))}
            placeholder="Complimentary shipping on orders above ₹10,000"
            className="w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-gold focus:outline-none"
          />
        </label>
        {/* Live preview */}
        <div className="mt-4">
          <span className="eyebrow mb-1 block">Preview</span>
          {ann.enabled ? (
            <div className="bg-charcoal px-4 py-2 text-center text-xs text-ivory">{ann.text || '—'}</div>
          ) : (
            <p className="text-xs text-muted">Hidden on the site.</p>
          )}
        </div>
        <Button className="mt-5" disabled={saving === 'announcement'} onClick={() => save('announcement', ann)}>
          {saving === 'announcement' ? 'Saving…' : 'Save announcement'}
        </Button>
      </section>

      {/* Homepage hero */}
      <section className="max-w-2xl border border-beige bg-ivory p-5">
        <h2 className="eyebrow mb-4">Homepage hero</h2>
        <div className="space-y-4">
          <Field label="Eyebrow" value={home.hero_eyebrow} onChange={(e) => setHome((h) => ({ ...h, hero_eyebrow: e.target.value }))} />
          <Field label="Title" value={home.hero_title} onChange={(e) => setHome((h) => ({ ...h, hero_title: e.target.value }))} />
          <Field label="Subtitle" value={home.hero_subtitle} onChange={(e) => setHome((h) => ({ ...h, hero_subtitle: e.target.value }))} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="CTA label" value={home.cta_label} onChange={(e) => setHome((h) => ({ ...h, cta_label: e.target.value }))} />
            <Field label="CTA link" value={home.cta_link} onChange={(e) => setHome((h) => ({ ...h, cta_link: e.target.value }))} />
          </div>
        </div>
        <Button className="mt-5" disabled={saving === 'homepage'} onClick={() => save('homepage', home)}>
          {saving === 'homepage' ? 'Saving…' : 'Save homepage'}
        </Button>
        <p className="mt-3 text-xs text-muted">
          Note: the storefront hero currently uses built-in copy. These values are saved for
          when the hero is wired to read from settings.
        </p>
      </section>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="eyebrow mb-1 block">{label}</span>
      <input
        {...props}
        className="w-full border border-beige bg-ivory px-3 py-2 text-sm focus:border-gold focus:outline-none"
      />
    </label>
  )
}
