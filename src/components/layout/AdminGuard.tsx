import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { supabase } from '@/lib/supabase'

type CheckState = 'loading' | 'allowed' | 'not-admin' | 'unauthenticated'

export function AdminGuard() {
  const { user } = useAuthStore()
  const [state, setState] = useState<CheckState>('loading')

  useEffect(() => {
    if (!user) {
      setState('unauthenticated')
      return
    }

    supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setState(data?.is_admin === true ? 'allowed' : 'not-admin')
      })
  }, [user])

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-white/30" />
      </div>
    )
  }

  if (state === 'unauthenticated') {
    return <Navigate to="/login?next=/admin/analytics" replace />
  }

  if (state === 'not-admin') {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
