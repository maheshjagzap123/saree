// Lightweight placeholder for admin sections not yet fully built, so the sidebar links
// always lead somewhere real instead of 404ing. Replace with full modules over time.
export default function AdminPlaceholder({ title, note }) {
  return (
    <div>
      <h1 className="font-serif text-3xl font-light">{title}</h1>
      <p className="mt-2 text-sm text-muted">{note}</p>
      <div className="mt-8 flex items-center justify-center border border-dashed border-beige bg-ivory p-16 text-center">
        <div>
          <p className="font-serif text-xl font-light text-charcoal">Coming soon</p>
          <p className="mt-2 text-sm text-muted">This section is part of the next admin build.</p>
        </div>
      </div>
    </div>
  )
}
