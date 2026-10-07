import { announcement } from '../../data/content'

// Admin-configurable later via site_settings. Hardcoded from mock content for now.
export default function AnnouncementBar() {
  return (
    <div className="bg-wine text-ivory">
      <div className="container-max flex items-center justify-center py-2 text-center text-xs tracking-wider2 uppercase">
        {announcement}
      </div>
    </div>
  )
}
