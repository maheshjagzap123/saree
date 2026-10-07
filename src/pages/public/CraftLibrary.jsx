import { useParams, Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductGrid from '../../components/product/ProductGrid'
import Reveal from '../../components/common/Reveal'
import { listProducts } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'
import { craftLibrary } from '../../data/content'

// Craft Library — educational pages for weaves/motifs. Index at /craft, detail at /craft/:slug.
// Factual content is intentionally restrained; expand with verified detail over time.
export default function CraftLibrary() {
  const { slug } = useParams()
  const { data: products } = useAsync(() => listProducts(), [], [])
  const all = products || []

  // Detail view
  if (slug) {
    const entry = craftLibrary.find((c) => c.slug === slug)
    if (!entry) {
      return (
        <Container className="py-24 text-center">
          <h1 className="font-serif text-3xl font-light">Not found</h1>
          <Button to="/craft" className="mt-6">Back to Craft Library</Button>
        </Container>
      )
    }
    const q = entry.title.toLowerCase()
    const relatedProducts = all
      .filter((p) =>
        [p.weave_type, p.border_type, p.motif, p.name].join(' ').toLowerCase().includes(q)
      )
      .slice(0, 4)

    return (
      <>
        <Seo title={`${entry.title} — Craft Library`} description={entry.summary} />
        <section className="border-b border-beige bg-cream py-16 text-center">
          <Container>
            <span className="eyebrow">Craft Library</span>
            <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">{entry.title}</h1>
            <p className="mx-auto mt-4 max-w-xl text-muted">{entry.summary}</p>
          </Container>
        </section>

        <Container className="py-16">
          <nav aria-label="Breadcrumb" className="mb-8 text-xs text-muted">
            <Link to="/craft" className="hover:text-wine">Craft Library</Link>
            <span aria-hidden> / </span>
            <span className="text-charcoal">{entry.title}</span>
          </nav>

          {relatedProducts.length > 0 ? (
            <>
              <h2 className="font-serif text-2xl font-light">Sarees featuring {entry.title}</h2>
              <div className="mt-8"><ProductGrid products={relatedProducts} /></div>
            </>
          ) : (
            <p className="text-muted">
              Explore the full collection to discover sarees featuring this style.
            </p>
          )}

          <div className="mt-12">
            <Button to="/shop" variant="outline">Explore All Sarees</Button>
          </div>
        </Container>
      </>
    )
  }

  // Index view
  return (
    <>
      <Seo
        title="Craft Library"
        description="Understand the weaves, borders and motifs that define a Paithani — single muniya, triple muniya, brocade, tissue, peacock and asawali."
      />
      <section className="border-b border-beige bg-cream py-16 text-center">
        <Container>
          <span className="eyebrow">The Craft</span>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">Craft Library</h1>
          <p className="mx-auto mt-4 max-w-xl text-muted">
            A short guide to the weaves, borders and motifs that give each Paithani its character.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {craftLibrary.map((c, i) => (
            <Reveal key={c.slug} delay={i * 50}>
              <Link to={`/craft/${c.slug}`} className="group block border-t border-beige pt-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="font-serif text-2xl font-light group-hover:text-wine">{c.title}</h2>
                  <span className="text-xs uppercase tracking-wider2 text-gold opacity-0 transition-opacity group-hover:opacity-100">Read →</span>
                </div>
                <p className="mt-2 text-sm text-muted">{c.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  )
}
