import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatPrice } from '../../utils/format'
import { HeartIcon } from '../ui/icons'

// Minimal luxury fashion card: image, small category, name, short descriptor, price,
// wishlist. "View Saree →" appears on hover (desktop) and is always usable via the card
// link on mobile — no essential action is hover-only.
export default function ProductCard({ product }) {
  const { toggleWish, isWished, openQuickView } = useStore()
  const wished = isWished(product.id)

  // Show at most one meaningful badge, quietly.
  const badge = product.is_new ? 'New' : product.is_bestseller ? 'Bestseller' : null

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <Link to={`/products/${product.slug}`} aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.04]"
            loading="lazy"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>

        {badge && (
          <span className="absolute left-3 top-3 bg-ivory/90 px-2.5 py-1 text-[10px] uppercase tracking-wider2 text-charcoal">
            {badge}
          </span>
        )}

        {/* Wishlist — quiet, always usable */}
        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={() => toggleWish(product.id)}
          className={`absolute right-3 top-3 text-lg transition-colors ${
            wished ? 'text-wine' : 'text-charcoal/70 hover:text-wine'
          }`}
        >
          <HeartIcon filled={wished} />
        </button>

        {/* View Saree — reveal on hover (desktop); card is fully linked anyway */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-charcoal/55 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <div className="flex items-center justify-between">
            <Link
              to={`/products/${product.slug}`}
              className="pointer-events-auto text-xs uppercase tracking-wider2 text-ivory link-underline"
            >
              View Saree →
            </Link>
            <button
              type="button"
              onClick={() => openQuickView(product)}
              className="pointer-events-auto text-xs uppercase tracking-wider2 text-ivory/80 hover:text-ivory"
            >
              Quick View
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <span className="text-[11px] uppercase tracking-wider2 text-gold-antique">{product.category}</span>
        <Link to={`/products/${product.slug}`} className="mt-1 font-serif text-lg font-light leading-snug hover:text-wine">
          {product.name}
        </Link>
        {product.short_description && (
          <p className="mt-1 line-clamp-1 text-sm text-muted">{product.short_description}</p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-charcoal">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-xs text-muted line-through">{formatPrice(product.compare_at_price)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
