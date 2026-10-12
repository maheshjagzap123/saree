import Seo from '../../components/common/Seo'
import AccountShell from '../../components/account/AccountShell'
import OverviewPanel from '../../components/account/panels/OverviewPanel'
import OrdersPanel from '../../components/account/panels/OrdersPanel'
import WishlistPanel from '../../components/account/panels/WishlistPanel'
import AddressesPanel from '../../components/account/panels/AddressesPanel'
import ProfilePanel from '../../components/account/panels/ProfilePanel'
import SecurityPanel from '../../components/account/panels/SecurityPanel'

const TITLES = {
  overview: 'My Account',
  orders: 'My Orders',
  wishlist: 'Wishlist',
  addresses: 'Addresses',
  profile: 'Profile Details',
  security: 'Security',
}

// Single-page account area. The sidebar switches the panel in place (via ?tab=),
// so Overview / Orders / Wishlist / Addresses / Profile all render inside the shell
// without navigating to separate routes.
export default function Account() {
  return (
    <AccountShell
      renderPanel={(tab, onSelect) => {
        const title = TITLES[tab] || 'My Account'
        let panel
        switch (tab) {
          case 'orders': panel = <OrdersPanel />; break
          case 'wishlist': panel = <WishlistPanel />; break
          case 'addresses': panel = <AddressesPanel />; break
          case 'profile': panel = <ProfilePanel />; break
          case 'security': panel = <SecurityPanel />; break
          default: panel = <OverviewPanel onSelect={onSelect} />
        }
        return (
          <>
            <Seo title={title} description="Manage your orders, wishlist, addresses and profile." />
            {panel}
          </>
        )
      }}
    />
  )
}
