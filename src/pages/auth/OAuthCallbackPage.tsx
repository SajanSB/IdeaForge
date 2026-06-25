import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabaseClient'
import { useAuthStore } from '@/stores/useAuthStore'

import { useIdeaStore } from '@/stores/useIdeaStore'

export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser(data.session.user)
        const { projectId, status: ideaStatus } = useIdeaStore.getState()
        if (projectId && (ideaStatus === 'estimating' || ideaStatus === 'reviewing' || ideaStatus === 'paying')) {
          navigate(`/idea/${projectId}/payment`, { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      } else {
        navigate('/login?error=oauth_failed', { replace: true })
      }
    })
  }, [navigate, setUser])

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <p className="text-sm text-slate font-sans">Completing sign-in...</p>
    </div>
  )
}
