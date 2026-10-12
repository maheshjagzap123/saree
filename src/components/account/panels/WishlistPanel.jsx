import Button from '../../ui/Button'
import ProductGrid from '../../product/ProductGrid'
import { ProductGridSkeleton } from '../../ui/Skeleton'
import { useStore } from '../../../context/StoreContext'
import { listProducts } from '../../../services/productService'
import { useAsync } from '../../../hooks/useAsync'

export default function WishlistPanel() {
  const { wishlist } = useStore()
  const { data: products, loading } = useAsync(() => listProducts(), [], [])
  const items = (products || []).filter((p) => wishlist.includes(p.id))

  return (
    <div className="border border-beige bg-ivory p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-light">Your wishlist</h2>
      <p className="mt-1 text-sm text-muted">Sarees you've saved for later.</p>

      {loading ? (
        <div className="mt-8"><ProductGridSkeleton count={4} /></div>
      ) : items.length === 0 ? (
        <div className="mt-8">
          <p className="text-muted">You haven't saved any sarees yet.</p>
          <Button to="/shop" className="mt-6">Explore the Collection</Button>
        </div>
      ) : (
        <div className="mt-8"><ProductGrid products={items} /></div>
      )}
    </div>
  )
}
