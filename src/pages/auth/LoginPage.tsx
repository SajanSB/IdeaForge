import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthLayout } from '@/components/shell/AuthLayout'
import { GoogleIcon } from '@/components/auth/GoogleIcon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { cn, getEmailValidationError, isValidEmail } from '@/lib/utils'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn, user } = useAuthStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const nextPath = searchParams.get('next') || '/dashboard'

  useEffect(() => {
    if (user) navigate(nextPath, { replace: true })
  }, [user, navigate, nextPath])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailErr = getEmailValidationError(email)
    if (emailErr) {
      setEmailError(emailErr)
      return
    }
    if (!password) return
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' })
      return
    }
    navigate(nextPath, { replace: true })
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${nextPath}` },
    })
    if (error) {
      setLoading(false)
      toast({ title: 'Google sign in failed', description: error.message, variant: 'destructive' })
    }
  }

  const signupHref =
    nextPath !== '/dashboard' ? `/signup?next=${encodeURIComponent(nextPath)}` : '/signup'

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Sign in</h2>
          <p className="text-sm text-chrome-muted">Welcome back. Access your projects and documents.</p>
        </div>

        <div className="space-y-5">
          <button
            type="button"
            className="btn-secondary w-full"
            onClick={handleGoogle}
            disabled={loading}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          <div className="auth-divider">
            <span className="text-xs text-chrome-subtle">or</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-chrome-muted">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => {
                  const value = e.target.value
                  setEmail(value)
                  if (emailError) setEmailError(getEmailValidationError(value))
                }}
                onBlur={() => setEmailError(getEmailValidationError(email))}
                required
                disabled={loading}
                autoComplete="email"
                aria-invalid={!!emailError}
                className={cn('auth-input', emailError && 'border-destructive/50')}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-chrome-muted">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-chrome-muted transition-colors hover:text-foreground"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  className="auth-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome-muted transition-colors hover:text-foreground"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !isValidEmail(email) || !password}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-chrome-muted">
          No account?{' '}
          <Link to={signupHref} className="font-medium text-foreground hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
