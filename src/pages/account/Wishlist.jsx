import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import ProductGrid from '../../components/product/ProductGrid'
import { useStore } from '../../context/StoreContext'
import { products } from '../../data/products'

export default function Wishlist() {
  const { wishlist } = useStore()
  const items = products.filter((p) => wishlist.includes(p.id))

  return (
    <>
      <Seo title="Wishlist" description="Your saved sarees." />
      <Container className="py-14">
        <h1 className="font-serif text-4xl">Your Wishlist</h1>
        {items.length === 0 ? (
          <div className="mt-10">
            <p className="text-muted">You haven't saved any sarees yet.</p>
            <Button to="/shop" className="mt-6">Explore Collection</Button>
          </div>
        ) : (
          <div className="mt-10">
            <ProductGrid products={items} />
          </div>
        )}
      </Container>
    </>
  )
}
