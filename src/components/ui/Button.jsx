import { Link } from 'react-router-dom'

const base =
  'inline-flex items-center justify-center gap-2 font-sans text-sm tracking-wide transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  primary: 'bg-wine text-ivory hover:bg-wine-dark',
  outline: 'border border-charcoal/40 text-charcoal hover:border-wine hover:text-wine',
  ghost: 'text-charcoal hover:text-wine',
  gold: 'bg-gold text-charcoal hover:bg-gold-soft',
  light: 'bg-ivory text-charcoal hover:bg-cream',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-base',
}

export default function Button({
  as = 'button',
  to,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const cls = `${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`

  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    )
  }
  const Tag = as
  return (
    <Tag className={cls} {...props}>
      {children}
    </Tag>
  )
}
