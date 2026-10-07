import { useParams, Link } from 'react-router-dom'
import Seo, { SITE_URL } from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductGrid from '../../components/product/ProductGrid'
import { getCollection } from '../../data/collections'
import { getProductsByCollection } from '../../data/products'

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = getCollection(slug)
  const items = getProductsByCollection(slug)

  if (!collection) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-3xl">Collection not found</h1>
        <Button to="/collections" className="mt-6">View All Collections</Button>
      </Container>
    )
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Collections', item: `${SITE_URL}/collections` },
      { '@type': 'ListItem', position: 3, name: collection.name },
    ],
  }

  return (
    <>
      <Seo
        title={collection.name}
        description={collection.description}
        image={collection.image}
        jsonLd={breadcrumbLd}
      />

      {/* Hero */}
      <section className="relative h-[42vh] min-h-[320px] overflow-hidden">
        <img src={collection.image} alt={collection.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-charcoal/45" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-ivory">
          <div className="animate-fade-up px-6">
            <span className="eyebrow text-gold-soft">Collection</span>
            <h1 className="mt-3 font-serif text-4xl text-ivory sm:text-5xl">{collection.name}</h1>
            <p className="mx-auto mt-3 max-w-lg text-ivory/85">{collection.description}</p>
          </div>
        </div>
      </section>

      <Container className="py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link to="/" className="hover:text-wine">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/collections" className="hover:text-wine">Collections</Link></li>
            <li aria-hidden>/</li>
            <li className="text-charcoal">{collection.name}</li>
          </ol>
        </nav>
      </Container>

      <Container className="pb-16">
        <p className="mb-8 text-sm text-muted">{items.length} Products</p>
        <ProductGrid products={items} />
      </Container>
    </>
  )
}
