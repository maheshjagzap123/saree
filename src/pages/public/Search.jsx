import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductGrid from '../../components/product/ProductGrid'
import { searchProducts } from '../../services/productService'
import { useAsync } from '../../hooks/useAsync'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [input, setInput] = useState(q)

  useEffect(() => {
    setInput(q)
  }, [q])

  const { data: resultsData } = useAsync(() => (q ? searchProducts(q) : Promise.resolve([])), [q], [])
  const results = resultsData || []

  const submit = (e) => {
    e.preventDefault()
    const value = input.trim()
    setParams(value ? { q: value } : {})
  }

  return (
    <>
      <Seo
        title={q ? `Search: ${q}` : 'Search'}
        description="Search our collection of handcrafted Paithani and silk sarees."
      />

      <section className="border-b border-beige bg-cream py-14 text-center">
        <Container>
          <span className="eyebrow">Find Your Saree</span>
          <h1 className="mt-3 text-4xl sm:text-5xl">Search</h1>
          <form onSubmit={submit} className="mx-auto mt-6 flex max-w-xl gap-3">
            <label htmlFor="search-input" className="sr-only">Search sarees</label>
            <input
              id="search-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Try "purple peacock" or a SKU'
              className="flex-1 border border-beige bg-ivory px-4 py-3 text-sm focus:border-wine"
              autoFocus
            />
            <Button type="submit">Search</Button>
          </form>
        </Container>
      </section>

      <Container className="py-12">
        {q && (
          <p className="mb-8 text-sm text-muted">
            {results.length} result{results.length === 1 ? '' : 's'} for “{q}”
          </p>
        )}

        {q && results.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted">No sarees matched your search.</p>
            <Button to="/shop" variant="outline" className="mt-6">Browse All Sarees</Button>
          </div>
        ) : (
          <ProductGrid products={results} />
        )}
      </Container>
    </>
  )
}
