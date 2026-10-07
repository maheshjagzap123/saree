import { Link } from 'react-router-dom'
import Container from '../ui/Container'
import Button from '../ui/Button'

const groups = [
  {
    title: 'Explore',
    links: [
      ['Sarees', '/shop'],
      ['Find Your Paithani', '/shop'],
      ['New Arrivals', '/shop?filter=new'],
      ['Signature Edit', '/shop?filter=bestseller'],
    ],
  },
  {
    title: 'The House',
    links: [
      ['About', '/about'],
      ['The Atelier', '/about'],
      ['Craft Library', '/craft'],
      ['Journal', '/journal'],
    ],
  },
  {
    title: 'Assistance',
    links: [
      ['Contact', '/contact'],
      ['WhatsApp', '/contact'],
      ['Shipping', '/shipping'],
      ['Returns', '/returns'],
      ['FAQ', '/faq'],
    ],
  },
  {
    title: 'Follow',
    links: [
      ['Instagram', 'https://instagram.com'],
      ['Facebook', 'https://facebook.com'],
    ],
    external: true,
  },
]

export default function Footer() {
  return (
    <footer className="mt-28 border-t border-beige bg-cream">
      <Container className="py-20">
        {/* Newsletter — Notes from the Atelier */}
        <div className="grid gap-10 border-b border-beige pb-14 lg:grid-cols-2 lg:items-end">
          <div>
            <span className="eyebrow">Notes from the Atelier</span>
            <h2 className="mt-3 font-serif text-3xl font-light sm:text-4xl">
              Colour, craft and new weaves — occasionally, never often.
            </h2>
          </div>
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
            <input
              id="footer-newsletter"
              type="email"
              required
              placeholder="Your email address"
              className="flex-1 border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine"
            />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>

        {/* Link groups */}
        <div className="mt-14 grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <span className="block font-serif text-xl font-light tracking-[0.12em] text-wine">VASTRAA</span>
            <span className="block text-[10px] tracking-wider2 text-gold-antique">PAITHANI</span>
            <p className="mt-4 max-w-xs text-sm text-muted">A digital atelier for Paithani sarees.</p>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="eyebrow mb-4">{g.title}</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {g.links.map(([label, to]) => (
                  <li key={label}>
                    {g.external ? (
                      <a href={to} target="_blank" rel="noopener noreferrer" className="link-underline hover:text-wine">{label}</a>
                    ) : (
                      <Link to={to} className="link-underline hover:text-wine">{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-beige pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Vastraa Paithani</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/privacy" className="hover:text-wine">Privacy</Link>
            <Link to="/terms" className="hover:text-wine">Terms</Link>
            <Link to="/shipping" className="hover:text-wine">Shipping</Link>
            <Link to="/returns" className="hover:text-wine">Returns</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
