import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, User as UserIcon, Settings, LayoutDashboard, ShieldCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function TopNav() {
  const { role, name, email, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-chrome-border bg-chrome/80 backdrop-blur-xl">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 sm:px-6">
        <Link to="/" className="mr-8 flex items-center gap-2.5 font-semibold tracking-tight hover:opacity-90 transition-opacity">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-mono text-sm text-primary-foreground">I</span>
          IdeaForge
        </Link>
        <div className="flex flex-1 items-center justify-end gap-4">
          {role === 'guest' ? (
            <>
              <Link to="/login" className="text-sm text-chrome-muted hover:text-foreground transition-colors">
                Sign in
              </Link>
              <Link to="/signup?next=%2Fidea%2Fnew">
                <Button size="sm" className="rounded-full px-5">Get started</Button>
              </Link>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full border border-chrome-border">
                  <UserIcon className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 border-chrome-border bg-chrome-elevated" align="end">
                <div className="p-3 border-b border-chrome-border">
                  {name && <p className="text-sm font-medium">{name}</p>}
                  {email && <p className="text-xs text-chrome-muted truncate">{email}</p>}
                  <p className="text-[10px] font-mono text-chrome-subtle uppercase mt-1">
                    {role === 'admin' ? 'Admin' : 'User'}
                  </p>
                </div>
                {role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/analytics" className="gap-2">
                      <ShieldCheck className="h-4 w-4 text-agent-ba" /> Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" /> My Projects
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive gap-2">
                  <LogOut className="h-4 w-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
