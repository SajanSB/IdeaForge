import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  IconChartBar, IconCode, IconAdjustments, IconUsers,
  IconArrowLeft, IconLogout, IconShield,
} from '@tabler/icons-react'
import { cn } from '@/utils/cn'
import { useAuthStore } from '@/stores/useAuthStore'

const NAV_ITEMS = [
  { to: '/admin/analytics',  label: 'Analytics',      Icon: IconChartBar },
  { to: '/admin/skills',     label: 'Skill manager',  Icon: IconCode },
  { to: '/admin/pricing',    label: 'Pricing config', Icon: IconAdjustments },
  { to: '/admin/users',      label: 'Users',          Icon: IconUsers },
]

export function AdminLayout() {
  const { signOut } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex font-sans bg-paper">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-[0.5px] border-border flex flex-col" aria-label="Admin navigation">
        <div className="h-14 flex items-center gap-2 px-5 border-b border-[0.5px] border-border">
          <IconShield size={16} className="text-amber-primary" aria-hidden="true" />
          <span className="text-[13px] font-medium text-ink">IdeaForge</span>
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-amber-tint text-amber-primary ml-1">Admin</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn(
              'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors',
              isActive
                ? 'bg-amber-tint text-amber-primary font-medium border-l-2 border-amber-primary rounded-l-none'
                : 'text-slate hover:bg-muted hover:text-ink'
            )}>
              <Icon size={16} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-[0.5px] border-border space-y-0.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] text-slate hover:bg-muted hover:text-ink transition-colors"
          >
            <IconArrowLeft size={16} aria-hidden="true" /> Back to platform
          </button>
          <button
            onClick={async () => { await signOut(); navigate('/admin/login') }}
            className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] text-slate hover:bg-muted hover:text-ink transition-colors"
          >
            <IconLogout size={16} aria-hidden="true" /> Sign out
          </button>
        </div>
      </aside>
      {/* Content */}
      <main id="main-content" className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
