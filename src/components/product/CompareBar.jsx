import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import Button from '../ui/Button'
import { CloseIcon } from '../ui/icons'

// Floating bar showing products queued for comparison. Appears when 1+ selected.
export default function CompareBar() {
  const { compare, compareCount, removeCompare, clearCompare } = useStore()

  if (compareCount === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-beige bg-ivory/95 backdrop-blur">
      <div className="container-max flex items-center justify-between gap-4 py-3">
        <div className="flex items-center gap-3 overflow-x-auto">
          <span className="shrink-0 text-xs uppercase tracking-wider2 text-muted">Compare</span>
          {compare.map((slug) => (
            <span key={slug} className="flex shrink-0 items-center gap-1 border border-beige px-2 py-1 text-xs">
              {slug.replace(/-/g, ' ').replace(/\bpaithani\b/i, '').trim().slice(0, 24)}
              <button aria-label="Remove" onClick={() => removeCompare(slug)} className="text-muted hover:text-wine">
                <CloseIcon width="0.8em" height="0.8em" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button onClick={clearCompare} className="text-xs text-muted hover:text-wine">Clear</button>
          <Button to="/compare" size="sm" disabled={compareCount < 2}>
            Compare ({compareCount})
          </Button>
        </div>
      </div>
    </div>
  )
}
