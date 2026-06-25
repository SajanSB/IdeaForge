import { NavLink } from 'react-router-dom'
import { cn } from '@/utils/cn'

const SETTINGS_TABS = [
  { to: '/settings/profile',       label: 'Profile'       },
  { to: '/settings/payments',      label: 'Payment history' },
  { to: '/settings/notifications', label: 'Notifications' },
]

export function SettingsSubNav() {
  return (
    <nav
      aria-label="Settings navigation"
      className="flex gap-0 border-b border-[0.5px] border-border mb-6 -mx-4 px-4 sm:mx-0 sm:px-0"
    >
      {SETTINGS_TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) => cn(
            'px-4 py-2.5 text-[13px] font-sans border-b-2 transition-colors whitespace-nowrap',
            '-mb-[0.5px]',  // overlap the border-b of the nav container
            isActive
              ? 'border-[#BA7517] text-[#BA7517] font-medium'
              : 'border-transparent text-[#6B7280] hover:text-[#0F0F0F]'
          )}
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}
