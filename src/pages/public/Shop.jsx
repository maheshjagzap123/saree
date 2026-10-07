import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import ProductGrid from '../../components/product/ProductGrid'
import { listProducts } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'

const COLORS = ['Purple', 'Green', 'Red', 'Pink', 'Blue', 'Black', 'Orange', 'Multicolor']
const FABRICS = ['Pure Silk', 'Silk', 'Semi Silk', 'Tissue']
const BORDERS = ['Muniya', 'Peacock', 'Asawali', 'Narali', 'Temple']
const PRICE_BANDS = [
  { label: 'Under ₹10,000', min: 0, max: 10000 },
  { label: '₹10,000 – ₹25,000', min: 10000, max: 25000 },
  { label: '₹25,000 – ₹50,000', min: 25000, max: 50000 },
  { label: '₹50,000+', min: 50000, max: Infinity },
]
const SORTS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'new', label: 'Newest' },
]

function CheckGroup({ title, options, selected, onToggle }) {
  return (
    <div className="border-b border-beige py-5">
      <h3 className="eyebrow mb-3">{title}</h3>
      <ul className="space-y-2">
        {options.map((opt) => (
          <li key={opt}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-muted hover:text-charcoal">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => onToggle(opt)}
                className="accent-wine"
              />
              {opt}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Shop() {
  const [params] = useSearchParams()
  const [colors, setColors] = useState([])
  const [fabrics, setFabrics] = useState([])
  const [borders, setBorders] = useState([])
  const [bands, setBands] = useState([])
  const [sort, setSort] = useState('featured')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { data: products } = useAsync(() => listProducts(), [], [])

  // Seed filters from query params (?min=&max= price band, ?color= colour).
  useEffect(() => {
    const min = Number(params.get('min'))
    const max = Number(params.get('max'))
    if (params.get('min') || params.get('max')) {
      const match = PRICE_BANDS.find(
        (b) => (min ? b.min === min : true) && (max ? b.max === max : true)
      )
      if (match) setBands([match.label])
    }
    const color = params.get('color')
    if (color && COLORS.includes(color)) setColors([color])
  }, [params])

  const toggle = (setter) => (val) =>
    setter((cur) => (cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]))

  const filtered = useMemo(() => {
    let list = (products || []).filter((p) => p.status === 'published')
    const filterQ = params.get('filter')
    if (filterQ === 'new') list = list.filter((p) => p.is_new)
    if (filterQ === 'bestseller') list = list.filter((p) => p.is_bestseller)

    if (colors.length) list = list.filter((p) => colors.includes(p.color))
    if (fabrics.length) list = list.filter((p) => fabrics.includes(p.fabric))
    if (borders.length) list = list.filter((p) => borders.includes(p.border_type))
    if (bands.length) {
      list = list.filter((p) =>
        bands.some((label) => {
          const b = PRICE_BANDS.find((x) => x.label === label)
          return b && p.price >= b.min && p.price < b.max
        })
      )
    }

    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'new':
        return [...list].sort((a, b) => Number(b.is_new) - Number(a.is_new))
      default:
        return [...list].sort((a, b) => Number(b.is_featured) - Number(a.is_featured))
    }
  }, [products, colors, fabrics, borders, bands, sort, params])

  const Filters = () => (
    <>
      <CheckGroup title="Price" options={PRICE_BANDS.map((b) => b.label)} selected={bands} onToggle={toggle(setBands)} />
      <CheckGroup title="Color" options={COLORS} selected={colors} onToggle={toggle(setColors)} />
      <CheckGroup title="Fabric" options={FABRICS} selected={fabrics} onToggle={toggle(setFabrics)} />
      <CheckGroup title="Border" options={BORDERS} selected={borders} onToggle={toggle(setBorders)} />
    </>
  )

  return (
    <>
      <Seo
        title="Shop All Paithani Sarees"
        description="Browse our full collection of handcrafted Paithani and silk sarees. Filter by colour, fabric, border and price."
      />

      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">The Collection</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">All Paithani</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Discover our curated collection of handcrafted sarees.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="flex items-center justify-between border-b border-beige pb-4">
          <button
            type="button"
            className="text-sm uppercase tracking-wide hover:text-wine lg:hidden"
            onClick={() => setDrawerOpen(true)}
          >
            Filter
          </button>
          <span className="hidden text-sm text-muted lg:block">{filtered.length} Products</span>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-beige bg-ivory px-3 py-2 focus:border-wine"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <Filters />
          </aside>

          <div>
            <p className="mb-6 text-sm text-muted lg:hidden">{filtered.length} Products</p>
            <ProductGrid products={filtered} />
          </div>
        </div>
      </Container>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/40" onClick={() => setDrawerOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-80 overflow-y-auto bg-ivory p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-serif text-xl">Filters</span>
              <button className="text-sm underline" onClick={() => setDrawerOpen(false)}>Done</button>
            </div>
            <Filters />
          </div>
        </div>
      )}
    </>
  )
}
