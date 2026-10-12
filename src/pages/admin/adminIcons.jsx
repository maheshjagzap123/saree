// Minimal outline icons for the admin sidebar/topbar.
const base = { width: '1em', height: '1em', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const HomeIcon = (p) => (<svg {...base} {...p}><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></svg>)
export const BoxIcon = (p) => (<svg {...base} {...p}><path d="M3 7l9-4 9 4-9 4-9-4Z" /><path d="M3 7v10l9 4 9-4V7" /><path d="M12 11v10" /></svg>)
export const LayersIcon = (p) => (<svg {...base} {...p}><path d="M12 3l9 5-9 5-9-5 9-5Z" /><path d="M3 13l9 5 9-5" /></svg>)
export const TagIcon = (p) => (<svg {...base} {...p}><path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9Z" /><circle cx="7.5" cy="7.5" r="1" /></svg>)
export const CartIcon = (p) => (<svg {...base} {...p}><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2l2.5 12h10l2-8H6" /></svg>)
export const UsersIcon = (p) => (<svg {...base} {...p}><circle cx="9" cy="8" r="3" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5a3 3 0 0 1 0 6M21 20a6 6 0 0 0-5-5.9" /></svg>)
export const ChatIcon = (p) => (<svg {...base} {...p}><path d="M4 5h16v11H9l-5 4V5Z" /></svg>)
export const DocIcon = (p) => (<svg {...base} {...p}><path d="M6 3h8l4 4v14H6V3Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>)
export const GearIcon = (p) => (<svg {...base} {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></svg>)
export const BellIcon = (p) => (<svg {...base} {...p}><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>)
export const SearchIcon = (p) => (<svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>)
export const MenuIcon = (p) => (<svg {...base} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>)
export const OutIcon = (p) => (<svg {...base} {...p}><path d="M10 17l-5-5 5-5M4 12h11M14 4h5v16h-5" /></svg>)
export const ChevronDown = (p) => (<svg {...base} {...p}><path d="m6 9 6 6 6-6" /></svg>)
export const ArrowUp = (p) => (<svg {...base} {...p}><path d="M12 19V5M5 12l7-7 7 7" /></svg>)
export const ArrowDown = (p) => (<svg {...base} {...p}><path d="M12 5v14M19 12l-7 7-7-7" /></svg>)
