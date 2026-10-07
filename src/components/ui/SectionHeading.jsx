export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const alignCls = align === 'left' ? 'text-left items-start' : 'text-center items-center'
  return (
    <div className={`flex flex-col ${alignCls} ${className}`}>
      {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight">{title}</h2>
      {description && (
        <p className="mt-4 max-w-2xl text-muted text-base leading-relaxed">{description}</p>
      )}
    </div>
  )
}
