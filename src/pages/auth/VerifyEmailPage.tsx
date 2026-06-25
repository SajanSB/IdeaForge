import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { IconCheck, IconAlertTriangle } from '@tabler/icons-react'

import { supabase } from '@/services/supabaseClient'
import { useAuthStore } from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'

export function VerifyEmailPage() {
  const navigate = useNavigate()
  const setUser = useAuthStore(s => s.setUser)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Verify Email — IdeaForge'

    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error

        if (session?.user) {
          setUser(session.user)
          setStatus('success')
          setTimeout(() => {
            navigate('/dashboard', { replace: true })
          }, 3000)
        } else {
          setStatus('error')
          setErrorMessage('No active session found. The link may have expired or already been used.')
        }
      } catch (err) {
        setStatus('error')
        setErrorMessage(err instanceof Error ? err.message : 'Failed to verify email link.')
      }
    }

    checkSession()
  }, [])

  return (
    <div className="flex justify-center items-center py-10 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] bg-white border border-[0.5px] border-border rounded-xl p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4 py-4">
            <div className="w-10 h-10 border-2 border-t-amber-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto" />
            <h1 className="text-lg font-medium text-ink">Confirming verification...</h1>
            <p className="text-xs text-slate">Verifying your email token with Supabase Auth</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-12 h-12 bg-green-50 border border-green-200 text-green-600 rounded-full flex items-center justify-center mx-auto">
              <IconCheck size={24} aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="text-[22px] font-medium text-ink">Email verified!</h1>
              <p className="text-sm text-slate leading-relaxed">
                Your email has been confirmed. Redirecting you to the dashboard in 3 seconds...
              </p>
            </div>
            <div className="pt-2">
              <Link to="/dashboard">
                <Button className="w-full bg-amber-primary hover:bg-amber-primary/95 text-[#FFF8ED] text-xs font-semibold py-2">
                  Go to dashboard now
                </Button>
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-12 h-12 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <IconAlertTriangle size={24} aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <h1 className="text-[22px] font-medium text-ink">Verification failed</h1>
              <p className="text-sm text-red-600 font-sans leading-relaxed">{errorMessage}</p>
            </div>
            <div className="space-y-4 pt-2">
              <Link to="/login" className="block">
                <Button variant="outline" className="w-full text-xs font-semibold py-2">
                  Back to login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
