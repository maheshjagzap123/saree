import { Link } from 'react-router-dom'
import Container from '../ui/Container'

const groups = [
  {
    title: 'Shop',
    links: [
      ['Collections', '/collections'],
      ['New Arrivals', '/shop?filter=new'],
      ['Bridal', '/collections/bridal-paithani'],
      ['Best Sellers', '/shop?filter=bestseller'],
    ],
  },
  {
    title: 'About',
    links: [
      ['Our Story', '/about'],
      ['Visit Our Store', '/store'],
      ['Journal', '/journal'],
    ],
  },
  {
    title: 'Customer Care',
    links: [
      ['Contact', '/contact'],
      ['Shipping', '/shipping'],
      ['Returns', '/returns'],
      ['FAQ', '/faq'],
    ],
  },
]

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-beige bg-cream">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="block font-serif text-2xl text-wine">VASTRAA PAITHANI</span>
            <p className="mt-3 max-w-xs text-sm text-muted">The Art of Timeless Paithani.</p>
            <div className="mt-6 flex gap-4 text-sm text-muted">
              <a href="#" className="link-underline hover:text-wine">Instagram</a>
              <a href="#" className="link-underline hover:text-wine">Facebook</a>
              <a href="#" className="link-underline hover:text-wine">WhatsApp</a>
            </div>
          </div>

          {groups.map((g) => (
            <div key={g.title}>
              <h3 className="eyebrow mb-4">{g.title}</h3>
              <ul className="space-y-2.5 text-sm text-muted">
                {g.links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="link-underline hover:text-wine">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-beige pt-6 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Vastraa Paithani. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-wine">Privacy</Link>
            <Link to="/terms" className="hover:text-wine">Terms</Link>
            <Link to="/shipping" className="hover:text-wine">Shipping Policy</Link>
            <Link to="/returns" className="hover:text-wine">Refund Policy</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
