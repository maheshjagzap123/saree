import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatPrice, discountPercent } from '../../utils/format'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import { CloseIcon } from '../ui/icons'

export default function QuickView() {
  const { quickView: product, closeQuickView, addToCart } = useStore()

  if (!product) return null

  const discount = discountPercent(product.price, product.compare_at_price)
  const inStock = product.stock_quantity > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/50" onClick={closeQuickView} aria-hidden />
      <div
        role="dialog"
        aria-label={`Quick view: ${product.name}`}
        className="relative z-10 grid w-full max-w-3xl animate-fade-in overflow-hidden bg-ivory shadow-2xl sm:grid-cols-2"
      >
        <button
          aria-label="Close quick view"
          onClick={closeQuickView}
          className="absolute right-3 top-3 z-10 text-2xl text-charcoal hover:text-wine"
        >
          <CloseIcon />
        </button>

        <div className="aspect-[4/5] bg-cream sm:aspect-auto">
          <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col p-7">
          <div className="flex flex-wrap gap-2">
            {product.is_new && <Badge tone="new">New</Badge>}
            {discount > 0 && <Badge tone="sale">{discount}% Off</Badge>}
          </div>
          <h2 className="mt-3 font-serif text-2xl">{product.name}</h2>
          <span className="mt-1 text-xs uppercase tracking-wide text-muted">{product.category}</span>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-serif text-2xl text-wine">{formatPrice(product.price)}</span>
            {product.compare_at_price && (
              <span className="text-sm text-muted line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted">{product.short_description}</p>

          <div className="mt-4 text-sm">
            <span className="text-muted">Colour: </span>{product.color}
            <span className="mx-3 text-beige">|</span>
            <span className={inStock ? 'text-green-700' : 'text-wine'}>
              {inStock ? 'In stock' : 'Made to order'}
            </span>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-6">
            <Button onClick={() => { addToCart(product); closeQuickView() }}>Add to Bag</Button>
            <Button
              to={`/products/${product.slug}`}
              variant="outline"
              onClick={closeQuickView}
            >
              View Full Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
