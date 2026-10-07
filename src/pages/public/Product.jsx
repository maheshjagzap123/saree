import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Seo, { SITE_URL } from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductGrid from '../../components/product/ProductGrid'
import Reveal from '../../components/common/Reveal'
import { HeartIcon } from '../../components/ui/icons'
import { useStore } from '../../context/StoreContext'
import { getProduct, listProducts } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { recordRecentlyViewed, getRecentlyViewed } from '../../utils/recentlyViewed'

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
  const { data: allProducts } = useAsync(() => listProducts(), [], [])

  // Record + reset gallery when the product changes.
  useEffect(() => {
    setActiveImg(0)
    if (product?.slug) recordRecentlyViewed(product.slug)
  }, [product?.slug])

  if (loading) {
    return <Container className="py-24 text-center"><p className="text-muted">Loading…</p></Container>
  }

  if (!product) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-3xl">Saree not found</h1>
        <p className="mt-3 text-muted">This weave seems to have gone elsewhere.</p>
        <Button to="/shop" className="mt-6">Explore the Collection</Button>
      </Container>
    )
  }

  const all = allProducts || []
  const inStock = product.stock_quantity > 0
  const wished = isWished(product.id)

  const related = all.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 4)

  // Recently viewed (exclude current)
  const recentSlugs = getRecentlyViewed().filter((s) => s !== product.slug)
  const recentlyViewed = recentSlugs.map((s) => all.find((p) => p.slug === s)).filter(Boolean).slice(0, 4)

  const productUrl = `${SITE_URL}/products/${product.slug}`
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi, I'm interested in the ${product.name} (SKU: ${product.sku || 'n/a'}). ${productUrl} — could you share more details?`
  )}`

  // "Why This Saree?" — built only from real product data (no invented claims).
  const whyPoints = [
    product.color && { label: 'The Colour', value: product.color, note: product.occasion_notes },
    product.weave_type && { label: 'The Weave', value: product.weave_type, note: product.craft_story },
    product.motif && { label: 'The Motif', value: product.motif },
    product.occasion?.length > 0 && { label: 'The Occasion', value: product.occasion.join(', ') },
  ].filter(Boolean)

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
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: productUrl,
    },
  }

  return (
    <>
      <Seo title={product.name} description={product.short_description} image={product.images[0]} type="product" jsonLd={productLd} />

      <Container className="py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link to="/" className="hover:text-wine">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/shop" className="hover:text-wine">Sarees</Link></li>
            <li aria-hidden>/</li>
            <li className="text-charcoal">{product.name}</li>
          </ol>
        </nav>
      </Container>

      <Container className="pb-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            <div className="flex gap-3 sm:flex-col">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-16 overflow-hidden border ${activeImg === i ? 'border-wine' : 'border-beige'}`}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-hidden bg-cream">
              <img src={product.images[activeImg]} alt={product.name} className="aspect-[4/5] h-full w-full object-cover" />
            </div>
          </div>

          {/* Info */}
          <div>
            {(product.is_new || product.is_bestseller) && (
              <span className="text-[11px] uppercase tracking-wider2 text-gold-antique">
                {product.is_new ? 'New Arrival' : 'Bestseller'}
              </span>
            )}
            <h1 className="mt-2 font-serif text-3xl font-light sm:text-4xl">{product.name}</h1>
            <span className="mt-1 block text-xs uppercase tracking-wide text-muted">{product.category}</span>

            <div className="mt-5 flex items-center gap-3">
              <span className="font-serif text-3xl text-wine">{formatPrice(product.price)}</span>
              {product.compare_at_price && (
                <span className="text-lg text-muted line-through">{formatPrice(product.compare_at_price)}</span>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes.</p>

            <p className="mt-5 leading-relaxed text-muted">{product.short_description}</p>

            <div className="mt-5 flex items-center gap-6 text-sm">
              <span><span className="text-muted">Colour: </span>{product.color}</span>
              <span className={inStock ? 'text-green-700' : 'text-wine'}>
                {inStock ? (product.stock_quantity <= 3 ? 'Low stock' : 'In stock') : 'Made to order'}
              </span>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" size="lg" onClick={() => addToCart(product)}>Add to Bag</Button>
              <Button variant="outline" size="lg" className="flex-1" onClick={() => toggleWish(product.id)}>
                <HeartIcon filled={wished} /> {wished ? 'Wishlisted' : 'Wishlist'}
              </Button>
            </div>

            <Button href={waHref} target="_blank" rel="noopener noreferrer" variant="gold" className="mt-3 w-full">
              Need help choosing? Ask on WhatsApp
            </Button>

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

        {/* WHY THIS SAREE? */}
        {whyPoints.length > 0 && (
          <Reveal className="mt-20 border-t border-beige pt-14">
            <span className="eyebrow">Why This Saree?</span>
            <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {whyPoints.map((p) => (
                <div key={p.label} className="border-l-2 border-gold pl-5">
                  <h3 className="font-serif text-xl font-light">{p.label}</h3>
                  <p className="mt-1 text-sm text-charcoal">{p.value}</p>
                  {p.note && <p className="mt-2 text-sm text-muted">{p.note}</p>}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* STORY + CRAFT + STYLING + CARE (uses editorial fields with graceful fallbacks) */}
        <div className="mt-16 grid gap-x-16 gap-y-10 border-t border-beige pt-14 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-light">The Story Behind the Saree</h2>
            <p className="mt-3 leading-relaxed text-muted">
              {product.product_story || product.description || product.short_description}
            </p>
          </div>
          {product.craft_story && (
            <div>
              <h2 className="font-serif text-2xl font-light">Craft Details</h2>
              <p className="mt-3 leading-relaxed text-muted">{product.craft_story}</p>
            </div>
          )}
          {product.styling_notes && (
            <div>
              <h2 className="font-serif text-2xl font-light">How to Style</h2>
              <p className="mt-3 leading-relaxed text-muted">{product.styling_notes}</p>
            </div>
          )}
          <div>
            <h2 className="font-serif text-2xl font-light">Care</h2>
            <p className="mt-3 leading-relaxed text-muted">
              {product.care_instructions ||
                'Dry clean only. Store wrapped in a soft cotton or muslin cloth, away from direct sunlight. Avoid contact with perfume and moisture to protect the silk and zari.'}
            </p>
          </div>
        </div>
      </Container>

      {/* COMPLETE THE LOOK */}
      {related.length > 0 && (
        <section className="bg-cream py-20">
          <Container>
            <span className="eyebrow">Complete the Look</span>
            <h2 className="mt-3 font-serif text-3xl font-light">Sarees in the same spirit</h2>
            <div className="mt-10"><ProductGrid products={related} /></div>
          </Container>
        </section>
      )}

      {/* YOU WERE LOOKING AT */}
      {recentlyViewed.length > 0 && (
        <section className="py-20">
          <Container>
            <span className="eyebrow">You Were Looking At</span>
            <h2 className="mt-3 font-serif text-3xl font-light">Recently viewed</h2>
            <div className="mt-10"><ProductGrid products={recentlyViewed} /></div>
          </Container>
        </section>
      )}
    </>
  )
}
