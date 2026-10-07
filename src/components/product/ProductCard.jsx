import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatPrice, discountPercent } from '../../utils/format'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import { HeartIcon } from '../ui/icons'

export default function ProductCard({ product }) {
  const { addToCart, toggleWish, isWished, openQuickView } = useStore()
  const discount = discountPercent(product.price, product.compare_at_price)
  const wished = isWished(product.id)
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 3

  return (
    <div className="group relative flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream">
        <Link to={`/products/${product.slug}`} aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
            loading="lazy"
          />
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              loading="lazy"
            />
          )}
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_new && <Badge tone="new">New</Badge>}
          {discount > 0 && <Badge tone="sale">{discount}% Off</Badge>}
          {product.is_bestseller && <Badge tone="bestseller">Bestseller</Badge>}
          {lowStock && <Badge tone="low">Low Stock</Badge>}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          onClick={() => toggleWish(product.id)}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-lg shadow-sm transition-colors ${
            wished ? 'text-wine' : 'text-charcoal hover:text-wine'
          }`}
        >
          <HeartIcon filled={wished} />
        </button>

        {/* Quick add / quick view */}
        <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            variant="light"
            size="sm"
            className="w-full"
            onClick={() => addToCart(product)}
          >
            Quick Add
          </Button>
          <button
            type="button"
            onClick={() => openQuickView(product)}
            className="w-full bg-charcoal/80 py-1.5 text-xs uppercase tracking-wide text-ivory transition-colors hover:bg-charcoal"
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col">
        <Link to={`/products/${product.slug}`} className="font-serif text-lg leading-snug hover:text-wine">
          {product.name}
        </Link>
        <span className="mt-0.5 text-xs uppercase tracking-wide text-muted">{product.category}</span>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-wine">{formatPrice(product.price)}</span>
          {product.compare_at_price && (
            <span className="text-sm text-muted line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
