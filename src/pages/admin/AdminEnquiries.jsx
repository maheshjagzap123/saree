import { getSetting } from '../../services/adminService'
import { useAsync } from '../../hooks/useAsync'
import Button from '../../components/ui/Button'
import { ChatIcon } from './adminIcons'
import { WhatsAppIcon } from '../../components/ui/icons'

// Enquiries — Vastraa's enquiry flow runs through WhatsApp (product pages, the floating
// button and checkout all deep-link to chat). There is no stored enquiries table, so this
// page is an honest operational hub: it surfaces the destination number and quick links
// rather than inventing data. Wire a persisted enquiries table here later if the flow
// changes to on-site forms.
export default function AdminEnquiries() {
  const { data: store } = useAsync(() => getSetting('store'), [], null)
  const waNumber = store?.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '917588174528'
  const waLink = `https://wa.me/${waNumber}`

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cream text-wine"><ChatIcon /></span>
        <div>
          <h1 className="font-serif text-3xl font-light">Enquiries</h1>
          <p className="mt-1 text-sm text-muted">How customers reach you about products and orders.</p>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Explainer */}
        <div className="space-y-4 border border-beige bg-ivory p-6">
          <h2 className="font-serif text-xl font-light">Enquiries come in via WhatsApp</h2>
          <p className="text-sm leading-relaxed text-muted">
            Vastraa's enquiry flow is built around WhatsApp. Every product page, the floating
            help button and the checkout's "preferred contact" option deep-link customers to
            a chat with your store, often pre-filled with the saree name and SKU. This keeps
            the conversation personal and lands directly on your phone.
          </p>
          <ul className="space-y-2 text-sm text-muted">
            <li className="flex gap-2"><span className="text-wine">•</span> Product pages: "Need help choosing? Ask on WhatsApp"</li>
            <li className="flex gap-2"><span className="text-wine">•</span> Floating button on every storefront page</li>
            <li className="flex gap-2"><span className="text-wine">•</span> Homepage "WhatsApp Us" and "Talk to a Saree Specialist"</li>
            <li className="flex gap-2"><span className="text-wine">•</span> Checkout: customers can pick WhatsApp as their preferred contact</li>
          </ul>
          <div className="rounded-md bg-cream p-4 text-sm text-charcoal">
            Enquiries are not stored in the dashboard today. To build an inbox here, add an
            on-site enquiry form that writes to an <code className="text-wine">enquiries</code> table —
            then this page can list and track them.
          </div>
        </div>

        {/* Destination card */}
        <aside className="h-fit space-y-4 border border-beige bg-ivory p-6">
          <h3 className="eyebrow">Destination number</h3>
          <p className="font-serif text-2xl font-light tracking-wide">+{waNumber}</p>
          <p className="text-xs text-muted">
            Set this in <span className="text-charcoal">Settings → WhatsApp number</span>. The
            storefront falls back to the <code>VITE_WHATSAPP_NUMBER</code> env var.
          </p>
          <Button
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="gold"
            className="w-full"
          >
            <span className="mr-2 text-[#1b7a3d]"><WhatsAppIcon /></span>
            Open WhatsApp
          </Button>
        </aside>
      </section>
    </div>
  )
}
