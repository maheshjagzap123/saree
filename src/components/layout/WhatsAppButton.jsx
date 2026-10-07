import { WhatsAppIcon } from '../ui/icons'

const number = import.meta.env.VITE_WHATSAPP_NUMBER || '919999999999'

// Floating WhatsApp button. Product pages can pass a pre-filled message.
export default function WhatsAppButton({ message = 'Hi, I would like to know more about your Paithani sarees.' }) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white text-2xl shadow-lg transition-transform hover:scale-105"
    >
      <WhatsAppIcon />
    </a>
  )
}
