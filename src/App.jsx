import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'

import Home from './pages/public/Home'
import Shop from './pages/public/Shop'
import Collections from './pages/public/Collections'
import CollectionDetail from './pages/public/CollectionDetail'
import Product from './pages/public/Product'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Journal from './pages/public/Journal'
import CartPage from './pages/public/CartPage'
import Checkout from './pages/public/Checkout'
import Search from './pages/public/Search'
import Store from './pages/public/Store'
import Faq from './pages/public/Faq'
import Policy from './pages/public/Policy'
import NotFound from './pages/public/NotFound'

import Account from './pages/account/Account'
import Wishlist from './pages/account/Wishlist'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/:slug" element={<CollectionDetail />} />
        <Route path="products/:slug" element={<Product />} />
        <Route path="about" element={<About />} />
        <Route path="our-story" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="journal" element={<Journal />} />
        <Route path="store" element={<Store />} />
        <Route path="search" element={<Search />} />
        <Route path="faq" element={<Faq />} />
        <Route path="shipping" element={<Policy type="shipping" />} />
        <Route path="returns" element={<Policy type="returns" />} />
        <Route path="privacy" element={<Policy type="privacy" />} />
        <Route path="terms" element={<Policy type="terms" />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<Checkout />} />

        <Route path="account" element={<Account />} />
        <Route path="account/wishlist" element={<Wishlist />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
