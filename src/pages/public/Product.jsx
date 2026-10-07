import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo, { SITE_URL } from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import ProductGrid from '../../components/product/ProductGrid'
import { StarIcon, HeartIcon } from '../../components/ui/icons'
import { useStore } from '../../context/StoreContext'
import { getProduct, listProducts } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice, discountPercent } from '../../utils/format'

const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

function Spec({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="flex justify-between gap-4 border-b border-beige py-2.5 text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-right">{String(value)}</span>
    </div>
  )
}

export default function Product() {
  const { slug } = useParams()
  const { addToCart, toggleWish, isWished } = useStore()
  const [activeImg, setActiveImg] = useState(0)

  const { data: product, loading } = useAsync(() => getProduct(slug), [slug])
  const { data: allProducts } = useAsync(() => listProducts(), [])

  if (loading) {
    return (
      <Container className="py-24 text-center">
        <p className="text-muted">Loading…</p>
      </Container>
    )
  }

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-3xl">Saree not found</h1>
        <p className="mt-3 text-muted">This weave seems to have gone elsewhere.</p>
        <Button to="/shop" className="mt-6">Explore Collection</Button>
      </Container>
    )
  }

  const discount = discountPercent(product.price, product.compare_at_price)
  const inStock = product.stock_quantity > 0
  const wished = isWished(product.id)
  const related = (allProducts || [])
    .filter((p) => p.collection === product.collection && p.id !== product.id)
    .slice(0, 4)

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I'm interested in this Paithani: ${product.name} (${product.sku}).`
  )}`

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.short_description,
    sku: product.sku,
    brand: { '@type': 'Brand', name: 'Vastraa Paithani' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: product.price,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/products/${product.slug}`,
    },
  }

  return (
    <>
      <Seo
        title={product.name}
        description={product.short_description}
        image={product.images[0]}
        type="product"
        jsonLd={productLd}
      />

      <Container className="py-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link to="/" className="hover:text-wine">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/shop" className="hover:text-wine">Shop</Link></li>
            <li aria-hidden>/</li>
            <li className="text-charcoal">{product.name}</li>
          </ol>
        </nav>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <div className="flex gap-3 sm:flex-col">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-16 overflow-hidden border ${
                    activeImg === i ? 'border-wine' : 'border-beige'
                  }`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden bg-cream">
              <img
                src={product.images[activeImg]}
                alt={product.name}
                className="aspect-[4/5] h-full w-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2">
              {product.is_new && <Badge tone="new">New</Badge>}
              {product.is_bestseller && <Badge tone="bestseller">Bestseller</Badge>}
              {discount > 0 && <Badge tone="sale">{discount}% Off</Badge>}
            </div>

            <h1 className="mt-3 font-serif text-3xl sm:text-4xl">{product.name}</h1>
            <span className="mt-1 block text-xs uppercase tracking-wide text-muted">
              {product.category}
            </span>

            <div className="mt-3 flex items-center gap-1 text-gold">
              {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
              <span className="ml-2 text-xs text-muted">Handpicked by our team</span>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <span className="font-serif text-3xl text-wine">{formatPrice(product.price)}</span>
              {product.compare_at_price && (
                <span className="text-lg text-muted line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes.</p>

            <p className="mt-5 leading-relaxed text-muted">{product.short_description}</p>

            <div className="mt-5 flex items-center gap-6 text-sm">
              <span>
                <span className="text-muted">Colour: </span>{product.color}
              </span>
              <span className={inStock ? 'text-green-700' : 'text-wine'}>
                {inStock ? (product.stock_quantity <= 3 ? 'Low stock' : 'In stock') : 'Made to order'}
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" size="lg" onClick={() => addToCart(product)}>
                Add to Bag
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => toggleWish(product.id)}
              >
                <HeartIcon filled={wished} /> {wished ? 'Wishlisted' : 'Wishlist'}
              </Button>
            </div>

            <Button href={waHref} target="_blank" rel="noopener noreferrer" variant="gold" className="mt-3 w-full">
              Enquire on WhatsApp
            </Button>

            {/* Specs */}
            <div className="mt-10">
              <h2 className="eyebrow mb-3">Details</h2>
              <Spec label="SKU" value={product.sku} />
              <Spec label="Fabric" value={product.fabric} />
              <Spec label="Weave Type" value={product.weave_type} />
              <Spec label="Border" value={product.border_type} />
              <Spec label="Motif" value={product.motif} />
              <Spec label="Length" value={product.saree_length} />
              <Spec label="Width" value={product.saree_width} />
              <Spec label="Blouse Included" value={product.blouse_included ? 'Yes' : 'No'} />
              <Spec label="Occasion" value={product.occasion?.join(', ')} />
            </div>
          </div>
        </div>

        {/* Description sections */}
        <div className="mt-16 grid gap-10 border-t border-beige pt-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl">About the Saree</h2>
            <p className="mt-3 leading-relaxed text-muted">{product.description}</p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Care</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Dry clean only. Store wrapped in a soft cotton or muslin cloth, away from direct
              sunlight. Avoid contact with perfume and moisture to protect the silk and zari.
            </p>
          </div>
        </div>
      </Container>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-cream py-16">
          <Container>
            <h2 className="mb-10 text-center font-serif text-3xl">You May Also Like</h2>
            <ProductGrid products={related} />
          </Container>
        </section>
      )}
    </>
  )
}
