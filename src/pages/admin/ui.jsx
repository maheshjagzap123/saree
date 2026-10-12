import { Link } from 'react-router-dom'
import { STATUS_LABELS } from '../../constants/orders'
import { ArrowUp, ArrowDown } from './adminIcons'

// Shared admin UI primitives so every admin page uses one SaaS-dashboard visual language:
// page headers, bordered panels, metric cards and status pills.

export function PageHeader({ title, subtitle, children, icon: Icon }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-md bg-cream text-wine">
            <Icon />
          </span>
        )}
        <div>
          <h1 className="font-serif text-3xl font-light">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  )
}

export function Panel({ title, action, children, className = '', bodyClassName = 'p-5' }) {
  return (
    <section className={`border border-beige bg-ivory ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between border-b border-beige px-5 py-4">
          {title && <h2 className="font-serif text-lg font-light">{title}</h2>}
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}

export function StatCard({ icon: Icon, label, value, change }) {
  const up = (change ?? 0) >= 0
  return (
    <div className="flex items-start gap-4 border border-beige bg-ivory p-5">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-cream text-lg text-wine">
          <Icon />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider2 text-muted">{label}</p>
        <p className="mt-1 font-serif text-2xl font-light">{value}</p>
        {change != null && (
          <p className={`mt-1 flex items-center gap-1 text-xs ${up ? 'text-green-700' : 'text-wine'}`}>
            <span className="text-[10px]">{up ? <ArrowUp /> : <ArrowDown />}</span>
            {Math.abs(change)}% <span className="text-muted">vs previous period</span>
          </p>
        )}
      </div>
    </div>
  )
}

// Order status → pill colour. Shared by Dashboard, Orders and anywhere a status shows.
export const statusTone = {
  placed: 'bg-gold/15 text-gold-antique',
  confirmed: 'bg-purple/10 text-purple',
  processing: 'bg-gold/15 text-gold-antique',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-wine/10 text-wine',
}

export function StatusPill({ status }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[11px] ${statusTone[status] || 'bg-cream text-charcoal'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

// Product publish-status pill (draft / published / archived).
const productTone = {
  published: 'bg-green-50 text-green-700',
  draft: 'bg-cream text-muted',
  archived: 'bg-wine/10 text-wine',
}

export function ProductStatusPill({ status }) {
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[11px] capitalize ${productTone[status] || 'bg-cream text-charcoal'}`}>
      {status}
    </span>
  )
}

export function PanelViewAll({ to }) {
  return <Link to={to} className="text-sm text-wine hover:underline">View all</Link>
}
