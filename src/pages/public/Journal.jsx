import { Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Img from '../../components/ui/Img'
import { journal } from '../../data/content'

export default function Journal() {
  const [featured, ...rest] = journal

  return (
    <>
      <Seo
        title="Journal"
        description="Stories, guides and heritage from the world of Paithani — what it is, how it's woven, and how to care for it."
      />

      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">The Journal</span>
          <h1 className="mt-3 text-4xl font-light sm:text-5xl">Stories & Guides</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Learn about the craft, choose with confidence, and care for your saree.
          </p>
        </Container>
      </section>

      <Container className="py-16">
        {/* Featured article */}
        {featured && (
          <Link to={`/journal/${featured.slug}`} className="group grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="aspect-[16/11] overflow-hidden bg-cream">
              <Img src={featured.image} alt={featured.title} loading="eager" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider2 text-gold">{featured.category}</span>
              <h2 className="mt-2 font-serif text-3xl font-light leading-tight group-hover:text-wine sm:text-4xl">{featured.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{featured.excerpt}</p>
              <span className="mt-5 inline-block text-sm uppercase tracking-wider2 text-charcoal link-underline">Read the story →</span>
            </div>
          </Link>
        )}

        {/* Supporting articles */}
        {rest.length > 0 && (
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <Link key={a.slug} to={`/journal/${a.slug}`} className="group block">
                <div className="aspect-[16/10] overflow-hidden bg-cream">
                  <Img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <span className="mt-4 block text-xs uppercase tracking-wider2 text-gold">{a.category}</span>
                <h3 className="mt-1 font-serif text-xl font-light group-hover:text-wine">{a.title}</h3>
                <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
