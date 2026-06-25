import { Link, Outlet, useNavigate } from 'react-router-dom'
import { IconBell, IconChevronDown, IconLogout, IconSettings, IconUser } from '@tabler/icons-react'
import { useAuthStore } from '@/stores/useAuthStore'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function UserPortalLayout() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? 'U'

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-paper font-sans">
      <header className="h-14 border-b border-[0.5px] border-border bg-white flex items-center px-6 gap-6">
        <Link to="/" className="font-sans text-[15px] font-medium text-ink tracking-[-0.2px] mr-4">
          IdeaForge
        </Link>
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-[13px] text-slate hover:text-ink">Dashboard</Button>
          </Link>
          <Link to="/idea/new">
            <Button variant="ghost" size="sm" className="text-[13px] text-slate hover:text-ink">New idea</Button>
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Notifications" className="w-9 h-9 text-slate">
            <IconBell size={18} aria-hidden="true" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-lg px-2 py-1 hover:bg-muted transition-colors" aria-label="User menu">
                <Avatar className="w-7 h-7">
                  <AvatarFallback className="text-[11px] bg-amber-tint text-amber-primary font-medium">{initials}</AvatarFallback>
                </Avatar>
                <IconChevronDown size={14} className="text-slate" aria-hidden="true" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
                <IconUser size={14} className="mr-2" aria-hidden="true" /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings/payments')}>
                <IconSettings size={14} className="mr-2" aria-hidden="true" /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                <IconLogout size={14} className="mr-2" aria-hidden="true" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main id="main-content" className="max-w-5xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
