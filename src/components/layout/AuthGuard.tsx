import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthGuard() {
  const { user, loading } = useAuthStore()
  const location = useLocation()
  const [ready, setReady] = useState(!loading)

  // Wait for the auth store to finish initializing before deciding
  useEffect(() => {
    if (!loading) setReady(true)
  }, [loading])

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white/30" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />
  }

  return <Outlet />
}
