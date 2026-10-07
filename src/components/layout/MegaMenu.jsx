import { Link } from 'react-router-dom'

const paithani = [
  'Traditional Paithani',
  'Single Muniya',
  'Triple Muniya',
  'Peacock Border',
  'Muniya Border',
  'Designer Paithani',
]
const occasion = ['Bridal', 'Wedding', 'Festive', 'Puja', 'Gifting']
const price = [
  { label: 'Under ₹10,000', q: 'max=10000' },
  { label: '₹10,000 – ₹25,000', q: 'min=10000&max=25000' },
  { label: '₹25,000 – ₹50,000', q: 'min=25000&max=50000' },
  { label: '₹50,000 – ₹1,00,000', q: 'min=50000&max=100000' },
  { label: '₹1,00,000+', q: 'min=100000' },
]

function Column({ title, children }) {
  return (
    <div>
      <h3 className="eyebrow mb-4">{title}</h3>
      <ul className="space-y-2.5 text-sm text-muted">{children}</ul>
    </div>
  )
}

export default function MegaMenu({ onNavigate }) {
  return (
    <div className="grid grid-cols-3 gap-10 p-10">
      <Column title="Paithani">
        {paithani.map((x) => (
          <li key={x}>
            <Link to="/shop" onClick={onNavigate} className="link-underline hover:text-wine">
              {x}
            </Link>
          </li>
        ))}
      </Column>
      <Column title="By Occasion">
        {occasion.map((x) => (
          <li key={x}>
            <Link to="/shop" onClick={onNavigate} className="link-underline hover:text-wine">
              {x}
            </Link>
          </li>
        ))}
      </Column>
      <Column title="By Price">
        {price.map((x) => (
          <li key={x.label}>
            <Link
              to={`/shop?${x.q}`}
              onClick={onNavigate}
              className="link-underline hover:text-wine"
            >
              {x.label}
            </Link>
          </li>
        ))}
      </Column>
    </div>
  )
}
