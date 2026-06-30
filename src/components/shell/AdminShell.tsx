import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { BarChart3, Wrench, CreditCard, Users, Search, LogOut, Settings, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/skills', label: 'Skills', icon: Wrench },
  { href: '/admin/pricing', label: 'Pricing', icon: CreditCard },
  { href: '/admin/users', label: 'Users', icon: Users },
]

export function AdminShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const { name, email, signOut } = useAuthStore()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen forge-chrome flex">
      <aside className="w-56 shrink-0 border-r border-chrome-border bg-chrome-elevated/80 flex flex-col">
        <div className="p-5 border-b border-chrome-border">
          <Link to="/" className="flex items-center gap-2 font-semibold text-sm">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary font-mono text-xs text-primary-foreground">I</span>
            Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                location.pathname === href
                  ? 'bg-primary/15 text-primary'
                  : 'text-chrome-muted hover:text-foreground hover:bg-white/5',
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-chrome-border space-y-1">
          <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 text-sm text-chrome-muted hover:text-foreground rounded-lg hover:bg-white/5">
            <LayoutDashboard className="h-4 w-4" /> User portal
          </Link>
          <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-chrome-border flex items-center justify-between px-6 shrink-0">
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-chrome-subtle" />
            <input
              placeholder="Search projects, users…"
              className="w-full h-9 pl-8 pr-3 rounded-lg bg-white/5 border border-chrome-border text-sm text-foreground placeholder:text-chrome-subtle focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-chrome-muted hidden sm:block">{email}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
              {(name ?? email ?? 'A').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
