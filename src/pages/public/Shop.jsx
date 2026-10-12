import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import ProductGrid from '../../components/product/ProductGrid'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'
import { SearchIcon } from '../../components/ui/icons'
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
  const [params, setParams] = useSearchParams()
  const [colors, setColors] = useState([])
  const [fabrics, setFabrics] = useState([])
  const [borders, setBorders] = useState([])
  const [bands, setBands] = useState([])
  const [sort, setSort] = useState('featured')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [query, setQuery] = useState(params.get('q') || '')
  const { data: products, loading } = useAsync(() => listProducts(), [], [])

  // Active filter chips (search + checkbox filters).
  const activeChips = [
    ...(query ? [{ label: `“${query}”`, clear: () => onSearchChange('') }] : []),
    ...bands.map((b) => ({ label: b, clear: () => setBands((c) => c.filter((x) => x !== b)) })),
    ...colors.map((c) => ({ label: c, clear: () => setColors((x) => x.filter((v) => v !== c)) })),
    ...fabrics.map((f) => ({ label: f, clear: () => setFabrics((x) => x.filter((v) => v !== f)) })),
    ...borders.map((b) => ({ label: b, clear: () => setBorders((x) => x.filter((v) => v !== b)) })),
  ]
  function clearAll() {
    setBands([]); setColors([]); setFabrics([]); setBorders([])
    onSearchChange('')
  }

  // Seed filters from query params (?q= search, ?min=&max= price band, ?color= colour).
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
    setQuery(params.get('q') || '')
  }, [params])

  // Keep the ?q= param in sync so the search is shareable/bookmarkable.
  function onSearchChange(value) {
    setQuery(value)
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    setParams(next, { replace: true })
  }

  const toggle = (setter) => (val) =>
    setter((cur) => (cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val]))

  const filtered = useMemo(() => {
    let list = (products || []).filter((p) => p.status === 'published')
    const filterQ = params.get('filter')
    if (filterQ === 'new') list = list.filter((p) => p.is_new)
    if (filterQ === 'bestseller') list = list.filter((p) => p.is_bestseller)

    // Text search across the key saree attributes.
    const q = query.trim().toLowerCase()
    if (q) {
      const terms = q.split(/\s+/)
      list = list.filter((p) => {
        const hay = [p.name, p.sku, p.collection, p.category, p.color, p.motif, p.weave_type, p.border_type]
          .join(' ')
          .toLowerCase()
        return terms.every((t) => hay.includes(t))
      })
    }

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
  }, [products, colors, fabrics, borders, bands, sort, params, query])

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

      <section className="border-b border-beige bg-cream py-10 text-center">
        <Container>
          <span className="eyebrow">The Collection</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">All Paithani</h1>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Discover our curated collection of handcrafted sarees.
          </p>
        </Container>
      </section>

      {/* Sticky search + sort toolbar — stays below the header while scrolling */}
      <div className="sticky top-[72px] z-20 border-b border-beige bg-ivory/95 backdrop-blur">
        <Container className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center border border-beige bg-ivory focus-within:border-wine">
            <span className="pl-3 text-lg text-muted"><SearchIcon /></span>
            <input
              type="search"
              value={query}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder='Search sarees — try "purple peacock" or a SKU'
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
              aria-label="Search sarees"
            />
            {query && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="pr-3 text-sm text-muted hover:text-wine"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              className="text-sm uppercase tracking-wide hover:text-wine lg:hidden"
              onClick={() => setDrawerOpen(true)}
            >
              Filter
            </button>
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
        </Container>
      </div>

      <Container className="py-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <p className="text-sm text-muted">{filtered.length} Products</p>
          {activeChips.length > 0 && (
            <>
              <span className="text-beige">|</span>
              {activeChips.map((chip, i) => (
                <button
                  key={i}
                  onClick={chip.clear}
                  className="flex items-center gap-1.5 border border-beige bg-cream px-3 py-1 text-xs hover:border-wine hover:text-wine"
                >
                  {chip.label} <span aria-hidden>×</span>
                </button>
              ))}
              <button onClick={clearAll} className="text-xs uppercase tracking-wide text-wine hover:underline">
                Clear all
              </button>
            </>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
          {/* Desktop filters */}
          <aside className="hidden lg:block">
            <Filters />
          </aside>

          <div>
            {loading ? (
              <ProductGridSkeleton count={8} />
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-muted">No sarees match your selection.</p>
                {activeChips.length > 0 && (
                  <button onClick={clearAll} className="mt-4 text-sm text-wine hover:underline">Clear all filters</button>
                )}
              </div>
            ) : (
              <ProductGrid products={filtered} />
            )}
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
