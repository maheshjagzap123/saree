// Lightweight inline-SVG charts — no charting library (keeps the bundle small).
import { formatPrice } from '../../utils/format'

export function LineChart({ data, valueKey = 'revenue', height = 160 }) {
  const w = 560
  const h = height
  const pad = 24
  const values = data.map((d) => d[valueKey])
  const max = Math.max(1, ...values)
  const stepX = (w - pad * 2) / Math.max(1, data.length - 1)
  const points = data.map((d, i) => {
    const x = pad + i * stepX
    const y = h - pad - (d[valueKey] / max) * (h - pad * 2)
    return [x, y]
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${path} L${points[points.length - 1][0].toFixed(1)},${h - pad} L${points[0][0].toFixed(1)},${h - pad} Z`

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Trend chart">
      <path d={area} fill="#6E1023" opacity="0.08" />
      <path d={path} fill="none" stroke="#6E1023" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="2.5" fill="#6E1023" />
      ))}
      {/* sparse x labels */}
      {data.map((d, i) =>
        i % Math.ceil(data.length / 6) === 0 ? (
          <text key={i} x={pad + i * stepX} y={h - 6} fontSize="9" fill="#6B6259" textAnchor="middle">{d.label}</text>
        ) : null
      )}
    </svg>
  )
}

export function BarList({ items, max }) {
  const peak = max || Math.max(1, ...items.map((i) => i.qty))
  return (
    <ul className="space-y-3">
      {items.map((it) => (
        <li key={it.name}>
          <div className="flex items-center justify-between text-sm">
            <span className="truncate pr-3">{it.name}</span>
            <span className="shrink-0 text-muted">{it.qty} sold · {formatPrice(it.revenue)}</span>
          </div>
          <div className="mt-1 h-2 w-full bg-cream">
            <div className="h-2 bg-gold" style={{ width: `${(it.qty / peak) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}
