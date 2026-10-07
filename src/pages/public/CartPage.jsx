import { Link } from 'react-router-dom'
import Seo from '../../components/common/Seo'
import Container from '../../components/ui/Container'
import Button from '../../components/ui/Button'
import { useStore } from '../../context/StoreContext'
import { formatPrice } from '../../utils/format'

export default function CartPage() {
  const { cart, cartSubtotal, setQty, removeFromCart } = useStore()

  return (
    <>
      <Seo title="Your Bag" description="Review the sarees in your bag before checkout." />
      <Container className="py-14">
        <h1 className="font-serif text-4xl">Your Bag</h1>

        {cart.length === 0 ? (
          <div className="mt-10">
            <p className="text-muted">Your bag is empty.</p>
            <Button to="/shop" className="mt-6">Explore Collection</Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_340px]">
            <ul className="divide-y divide-beige border-y border-beige">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-5 py-6">
                  <img src={item.image} alt={item.name} className="h-32 w-24 object-cover" loading="lazy" />
                  <div className="flex flex-1 flex-col">
                    <Link to={`/products/${item.slug}`} className="font-serif text-lg hover:text-wine">
                      {item.name}
                    </Link>
                    <span className="mt-1 text-sm text-wine">{formatPrice(item.price)}</span>
                    <div className="mt-auto flex items-center gap-4">
                      <div className="flex items-center border border-beige">
                        <button className="px-3 py-1 hover:text-wine" onClick={() => setQty(item.id, item.qty - 1)} aria-label="Decrease">−</button>
                        <span className="px-3 text-sm">{item.qty}</span>
                        <button className="px-3 py-1 hover:text-wine" onClick={() => setQty(item.id, item.qty + 1)} aria-label="Increase">+</button>
                      </div>
                      <button className="text-xs text-muted underline hover:text-wine" onClick={() => removeFromCart(item.id)}>
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="text-right font-serif text-lg">{formatPrice(item.price * item.qty)}</div>
                </li>
              ))}
            </ul>

            <aside className="h-fit border border-beige bg-cream p-6">
              <h2 className="font-serif text-xl">Order Summary</h2>
              <div className="mt-5 flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-muted">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <hr className="my-4 border-beige" />
              <div className="flex justify-between font-serif text-lg">
                <span>Total</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>
              <Button to="/checkout" className="mt-6 w-full">Proceed to Checkout</Button>
            </aside>
          </div>
        )}
      </Container>
    </>
  )
}
