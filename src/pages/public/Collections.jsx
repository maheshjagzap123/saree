import { Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import SectionHeading from '../../components/ui/SectionHeading'
import Img from '../../components/ui/Img'
import { listCollections } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'

export default function Collections() {
  const { data: collectionsData } = useAsync(() => listCollections(), [], [])
  const collections = collectionsData || []

  return (
    <>
      <Seo
        title="Collections"
        description="Explore our Paithani and silk saree collections — traditional, bridal, silk, designer and festive."
      />
      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">Browse</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">Our Collections</h1>
        </Container>
      </section>

      <Container className="py-16">
        <SectionHeading
          title="Curated by Occasion & Craft"
          description="Each collection is a considered edit, grouped to make choosing simpler."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-cream">
                <Img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-4 font-serif text-xl group-hover:text-wine">{c.name}</h3>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  )
}
