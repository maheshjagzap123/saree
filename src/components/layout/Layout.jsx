import { useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import AnnouncementBar from './AnnouncementBar'
import Header from './Header'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import CartDrawer from '../cart/CartDrawer'
import QuickView from '../product/QuickView'
import CompareBar from '../product/CompareBar'

// Scrolls to top on route change.
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      <QuickView />
      <CompareBar />
    </div>
  )
}
