const tones = {
  new: 'bg-purple text-ivory',
  sale: 'bg-wine text-ivory',
  bestseller: 'bg-gold text-charcoal',
  limited: 'bg-charcoal text-ivory',
  exclusive: 'bg-purple text-ivory',
  low: 'bg-wine/90 text-ivory',
  neutral: 'bg-cream text-charcoal',
}

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider2 ${
        tones[tone] || tones.neutral
      } ${className}`}
    >
      {children}
    </span>
  )
}
