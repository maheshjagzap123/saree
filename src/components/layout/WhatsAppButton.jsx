import { WhatsAppIcon } from '../ui/icons'

const number = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

// Floating WhatsApp assistance button. Contextual copy ("Need help choosing?").
// Product pages can pass a pre-filled, product-specific message.
export default function WhatsAppButton({
  message = "Hi, I'd like help choosing a Paithani saree.",
  label = 'Need help choosing?',
}) {
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
