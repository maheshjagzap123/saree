import { useParams, Link } from 'react-router-dom'
import Seo, { SITE_URL } from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import Img from '../../components/ui/Img'
import { getArticle, journal } from '../../data/content'

export default function JournalArticle() {
  const { slug } = useParams()
  const article = getArticle(slug)

  if (!article) {
    return (
      <Container className="py-24 text-center">
        <h1 className="font-serif text-3xl font-light">Article not found</h1>
        <Button to="/journal" className="mt-6">Back to the Journal</Button>
      </Container>
    )
  }

  const related = journal.filter((a) => a.slug !== article.slug).slice(0, 2)

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    author: { '@type': 'Organization', name: article.author || 'Vastraa Paithani' },
    datePublished: article.published,
    dateModified: article.updated || article.published,
    publisher: { '@type': 'Organization', name: 'Vastraa Paithani' },
    mainEntityOfPage: `${SITE_URL}/journal/${article.slug}`,
  }

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '')

  return (
    <>
      <Seo title={article.title} description={article.excerpt} image={article.image} type="article" jsonLd={articleLd} />

      <Container className="py-6">
        <nav aria-label="Breadcrumb" className="text-xs text-muted">
          <ol className="flex flex-wrap items-center gap-1">
            <li><Link to="/" className="hover:text-wine">Home</Link></li>
            <li aria-hidden>/</li>
            <li><Link to="/journal" className="hover:text-wine">Journal</Link></li>
            <li aria-hidden>/</li>
            <li className="text-charcoal">{article.title}</li>
          </ol>
        </nav>
      </Container>

      <article>
        {/* Header */}
        <Container className="pt-4 text-center">
          <span className="eyebrow">{article.category}</span>
          <h1 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-light leading-tight sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-muted">
            {article.author} · {fmt(article.published)}
          </p>
        </Container>

        {/* Hero image */}
        <Container className="mt-10">
          <div className="aspect-[16/9] overflow-hidden bg-cream">
            <Img src={article.image} alt={article.title} loading="eager" className="h-full w-full object-cover" />
          </div>
        </Container>

        {/* Body */}
        <Container className="py-14">
          <div className="mx-auto max-w-2xl">
            {article.body?.map((block, i) =>
              block.type === 'h' ? (
                <h2 key={i} className="mt-10 font-serif text-2xl font-light">{block.text}</h2>
              ) : (
                <p key={i} className="mt-5 leading-relaxed text-muted">{block.text}</p>
              )
            )}
          </div>
        </Container>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-cream py-16">
          <Container>
            <span className="eyebrow">Keep Reading</span>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              {related.map((a) => (
                <Link key={a.slug} to={`/journal/${a.slug}`} className="group block">
                  <div className="aspect-[16/10] overflow-hidden bg-ivory">
                    <Img src={a.image} alt={a.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <span className="mt-4 block text-xs uppercase tracking-wider2 text-gold">{a.category}</span>
                  <h3 className="mt-1 font-serif text-xl font-light group-hover:text-wine">{a.title}</h3>
                  <p className="mt-2 text-sm text-muted">{a.excerpt}</p>
                </Link>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
