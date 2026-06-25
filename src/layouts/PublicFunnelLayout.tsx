import { Link, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'

export function PublicFunnelLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  return (
    <div className="min-h-screen bg-paper font-sans">
      {/* Minimal top bar */}
      <header className="h-14 border-b border-[0.5px] border-border bg-white flex items-center justify-between px-6">
        <Link to="/" className="font-sans text-[15px] font-medium text-ink tracking-[-0.2px]">
          IdeaForge
        </Link>
        {!isAuthenticated && (
          <Link to="/login" className="text-[13px] text-slate hover:text-ink transition-colors">
            Sign in
          </Link>
        )}
      </header>
      {/* Content */}
      <main id="main-content" className="max-w-3xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  )
}
