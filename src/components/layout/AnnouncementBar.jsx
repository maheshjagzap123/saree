import { useSettings } from '../../context/SettingsContext'

// Admin-configurable via site_settings('announcement'). Hidden when disabled or empty.
export default function AnnouncementBar() {
  const { announcement } = useSettings()
  if (!announcement.enabled || !announcement.text) return null

  return (
    <div className="bg-wine text-ivory">
      <div className="container-max flex items-center justify-center py-2 text-center text-[10px] uppercase leading-tight tracking-wide sm:text-xs sm:tracking-wider2">
        {announcement.text}
      </div>
    </div>
  )
}
