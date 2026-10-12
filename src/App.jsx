import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'

// Old /search page now lives on /shop — redirect while preserving the ?q= query.
function SearchRedirect() {
  const [params] = useSearchParams()
  const q = params.get('q')
  return <Navigate to={q ? `/shop?q=${encodeURIComponent(q)}` : '/shop'} replace />
}

import Home from './pages/public/Home'
import Shop from './pages/public/Shop'
import Collections from './pages/public/Collections'
import CollectionDetail from './pages/public/CollectionDetail'
import Product from './pages/public/Product'
import About from './pages/public/About'
import Contact from './pages/public/Contact'
import Journal from './pages/public/Journal'
import JournalArticle from './pages/public/JournalArticle'
import CartPage from './pages/public/CartPage'
import Checkout from './pages/public/Checkout'
import OrderSuccess from './pages/public/OrderSuccess'
import Store from './pages/public/Store'
import Faq from './pages/public/Faq'
import Policy from './pages/public/Policy'
import CraftLibrary from './pages/public/CraftLibrary'
import FindYourSaree from './pages/public/FindYourSaree'
import Compare from './pages/public/Compare'
import NotFound from './pages/public/NotFound'

import AuthPage from './pages/account/AuthPage'
import Account from './pages/account/Account'
import OrderDetail from './pages/account/OrderDetail'

import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/AdminProducts'
import ProductEditor from './pages/admin/ProductEditor'
import AdminCollections from './pages/admin/AdminCollections'
import AdminCategories from './pages/admin/AdminCategories'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminEnquiries from './pages/admin/AdminEnquiries'
import AdminContent from './pages/admin/AdminContent'
import AdminSettings from './pages/admin/AdminSettings'

export default function App() {
  return (
    <Routes>
      {/* Public + customer area share the storefront Layout */}
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
        <Route path="journal/:slug" element={<JournalArticle />} />
        <Route path="craft" element={<CraftLibrary />} />
        <Route path="craft/:slug" element={<CraftLibrary />} />
        <Route path="find" element={<FindYourSaree />} />
        <Route path="compare" element={<Compare />} />
        <Route path="store" element={<Store />} />
        <Route path="search" element={<SearchRedirect />} />
        <Route path="faq" element={<Faq />} />
        <Route path="shipping" element={<Policy type="shipping" />} />
        <Route path="returns" element={<Policy type="returns" />} />
        <Route path="privacy" element={<Policy type="privacy" />} />
        <Route path="terms" element={<Policy type="terms" />} />
        <Route path="cart" element={<CartPage />} />

        {/* Auth */}
        <Route path="login" element={<AuthPage mode="login" />} />
        <Route path="signup" element={<AuthPage mode="signup" />} />

        {/* Checkout requires sign-in */}
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />

        {/* Customer account — single page with in-place tab panels (?tab=) */}
        <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="account/orders/:id" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        {/* Legacy sub-routes redirect to the single account page with the right tab */}
        <Route path="account/orders" element={<Navigate to="/account?tab=orders" replace />} />
        <Route path="account/wishlist" element={<Navigate to="/account?tab=wishlist" replace />} />
        <Route path="account/addresses" element={<Navigate to="/account?tab=addresses" replace />} />
        <Route path="account/profile" element={<Navigate to="/account?tab=profile" replace />} />

        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Admin (protected, admin role, own layout) */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute admin>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="products/:id" element={<ProductEditor />} />
        <Route path="collections" element={<AdminCollections />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
        <Route path="enquiries" element={<AdminEnquiries />} />
        <Route path="content" element={<AdminContent />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  )
}
