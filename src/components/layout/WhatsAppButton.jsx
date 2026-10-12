import { WhatsAppIcon } from '../ui/icons'
import { useSettings } from '../../context/SettingsContext'

// Floating WhatsApp assistance button. Contextual copy ("Need help choosing?").
// Product pages can pass a pre-filled, product-specific message. The destination number
// comes from site_settings('store').whatsapp, falling back to the env var.
export default function WhatsAppButton({
  message = "Hi, I'd like help choosing a Paithani saree.",
  label = 'Need help choosing?',
}) {
  const { store } = useSettings()
  const number = store.whatsapp || import.meta.env.VITE_WHATSAPP_NUMBER || '917588174528'
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — chat with us on WhatsApp`}
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-0 rounded-full bg-plum px-3.5 py-3.5 text-ivory shadow-lg transition-all hover:gap-2 hover:bg-plum-soft"
    >
      <span className="text-xl text-[#8ef0ab]"><WhatsAppIcon /></span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm transition-all duration-300 group-hover:max-w-[180px] group-focus:max-w-[180px]">
        {label}
      </span>
    </a>
  )
}
