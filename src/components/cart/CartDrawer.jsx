import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { formatPrice } from '../../utils/format'
import Button from '../ui/Button'
import { CloseIcon } from '../ui/icons'

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    cartSubtotal,
    removeFromCart,
    setQty,
  } = useStore()

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-charcoal/40 transition-opacity ${
          cartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setCartOpen(false)}
        aria-hidden
      />
      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ${
          cartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-beige px-6 py-5">
          <h2 className="font-serif text-xl">Your Bag</h2>
          <button aria-label="Close bag" className="text-2xl hover:text-wine" onClick={() => setCartOpen(false)}>
            <CloseIcon />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted">Your bag is empty.</p>
            <Button to="/shop" variant="outline" onClick={() => setCartOpen(false)}>
              Explore Collection
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-beige">
                {cart.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-20 flex-shrink-0 object-cover"
                      loading="lazy"
                    />
                    <div className="flex flex-1 flex-col">
                      <Link
                        to={`/products/${item.slug}`}
                        onClick={() => setCartOpen(false)}
                        className="text-sm font-medium hover:text-wine"
                      >
                        {item.name}
                      </Link>
                      <span className="mt-1 text-sm text-wine">{formatPrice(item.price)}</span>
                      <div className="mt-auto flex items-center gap-3">
                        <div className="flex items-center border border-beige">
                          <button
                            className="px-2 py-1 text-sm hover:text-wine"
                            aria-label="Decrease quantity"
                            onClick={() => setQty(item.id, item.qty - 1)}
                          >
                            −
                          </button>
                          <span className="px-3 text-sm">{item.qty}</span>
                          <button
                            className="px-2 py-1 text-sm hover:text-wine"
                            aria-label="Increase quantity"
                            onClick={() => setQty(item.id, item.qty + 1)}
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-muted underline hover:text-wine"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-beige px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-serif text-lg">{formatPrice(cartSubtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-muted">Shipping and taxes calculated at checkout.</p>
              <div className="flex flex-col gap-3">
                <Button to="/checkout" onClick={() => setCartOpen(false)}>Checkout</Button>
                <Button to="/cart" variant="outline" onClick={() => setCartOpen(false)}>
                  View Bag
                </Button>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
