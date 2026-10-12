// Lightweight inline-SVG charts — no charting library (keeps the bundle small).
import { formatPrice } from '../../utils/format'

export function LineChart({ data, valueKey = 'revenue', height = 220 }) {
  const w = 640
  const h = height
  const padX = 36
  const padY = 28
  const values = data.map((d) => d[valueKey])
  const max = Math.max(1, ...values)
  const stepX = (w - padX * 2) / Math.max(1, data.length - 1)
  const points = data.map((d, i) => {
    const x = padX + i * stepX
    const y = h - padY - (d[valueKey] / max) * (h - padY * 2)
    return [x, y]
  })
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${path} L${points[points.length - 1][0].toFixed(1)},${h - padY} L${points[0][0].toFixed(1)},${h - padY} Z`

  // y gridlines (3)
  const grid = [0.25, 0.5, 0.75, 1].map((f) => h - padY - f * (h - padY * 2))

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Revenue trend">
      {grid.map((y, i) => (
        <line key={i} x1={padX} y1={y} x2={w - padX} y2={y} stroke="#E7DCCB" strokeWidth="1" />
      ))}
      <path d={area} fill="#79152B" opacity="0.08" />
      <path d={path} fill="none" stroke="#79152B" strokeWidth="2.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#79152B" />
      ))}
      {data.map((d, i) =>
        i % Math.ceil(data.length / 6) === 0 ? (
          <text key={i} x={padX + i * stepX} y={h - 6} fontSize="10" fill="#6B6259" textAnchor="middle">{d.label}</text>
        ) : null
      )}
    </svg>
  )
}

export function BarChart({ data, valueKey = 'orders', height = 220 }) {
  const w = 640
  const h = height
  const padX = 30
  const padY = 28
  const max = Math.max(1, ...data.map((d) => d[valueKey]))
  const slot = (w - padX * 2) / data.length
  const barW = Math.min(26, slot * 0.55)

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Orders per day">
      {[0.5, 1].map((f, i) => (
        <line key={i} x1={padX} y1={h - padY - f * (h - padY * 2)} x2={w - padX} y2={h - padY - f * (h - padY * 2)} stroke="#E7DCCB" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const x = padX + i * slot + (slot - barW) / 2
        const barH = (d[valueKey] / max) * (h - padY * 2)
        const y = h - padY - barH
        return <rect key={i} x={x} y={y} width={barW} height={Math.max(barH, 1)} fill="#C98B9B" rx="2" />
      })}
      {data.map((d, i) =>
        i % Math.ceil(data.length / 6) === 0 ? (
          <text key={i} x={padX + i * slot + slot / 2} y={h - 6} fontSize="10" fill="#6B6259" textAnchor="middle">{d.label}</text>
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
