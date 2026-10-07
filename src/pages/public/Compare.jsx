import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useStore } from '../../context/StoreContext'
import { listProducts } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'
import { formatPrice } from '../../utils/format'
import { Link } from 'react-router-dom'

const ROWS = [
  ['Price', (p) => formatPrice(p.price)],
  ['Fabric', (p) => p.fabric],
  ['Weave', (p) => p.weave_type],
  ['Colour', (p) => p.color],
  ['Border', (p) => p.border_type],
  ['Motif', (p) => p.motif],
  ['Occasion', (p) => (p.occasion || []).join(', ')],
  ['Length', (p) => p.saree_length],
  ['Blouse', (p) => (p.blouse_included ? 'Included' : 'Not included')],
  ['Availability', (p) => (p.stock_quantity > 0 ? 'In stock' : 'Made to order')],
]

export default function Compare() {
  const { compare, removeCompare, addToCart } = useStore()
  const { data: products } = useAsync(() => listProducts(), [], [])
  const all = products || []
  const items = compare.map((slug) => all.find((p) => p.slug === slug)).filter(Boolean)

  return (
    <>
      <Seo title="Compare Sarees" description="Compare Paithani sarees side by side." />
      <Container className="py-14">
        <span className="eyebrow">Side by Side</span>
        <h1 className="mt-2 font-serif text-4xl font-light">Compare Sarees</h1>

        {items.length === 0 ? (
          <div className="mt-10">
            <p className="text-muted">You haven't added any sarees to compare yet.</p>
            <Button to="/shop" className="mt-6">Explore the Collection</Button>
          </div>
        ) : (
          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-32 border-b border-beige p-3" />
                  {items.map((p) => (
                    <th key={p.id} className="border-b border-beige p-3 text-left align-top">
                      <Link to={`/products/${p.slug}`} className="block">
                        <div className="aspect-[3/4] w-40 overflow-hidden bg-cream">
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <span className="mt-2 block font-serif text-base font-light hover:text-wine">{p.name}</span>
                      </Link>
                      <div className="mt-2 flex gap-3 text-xs">
                        <button onClick={() => addToCart(p)} className="text-wine hover:underline">Add to Bag</button>
                        <button onClick={() => removeCompare(p.slug)} className="text-muted hover:text-wine">Remove</button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map(([label, get]) => (
                  <tr key={label}>
                    <td className="border-b border-beige p-3 align-top text-xs uppercase tracking-wide text-muted">{label}</td>
                    {items.map((p) => (
                      <td key={p.id} className="border-b border-beige p-3 align-top">{get(p) || '—'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </>
  )
}
