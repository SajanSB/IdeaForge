import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/useAuthStore'
import { AuthLayout } from '@/components/shell/AuthLayout'
import { GoogleIcon } from '@/components/auth/GoogleIcon'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { Loader2, MailCheck, Check, Eye, EyeOff } from 'lucide-react'
import { cn, getConfirmPasswordError, getEmailValidationError, getPasswordRequirements, isStrongPassword, isValidEmail } from '@/lib/utils'

export function SignupPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuthStore()
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const nextPath = searchParams.get('next') || '/dashboard'

  const passwordChecks = getPasswordRequirements(password)
  const passwordOk = isStrongPassword(password)
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (confirmPasswordError && confirmPassword) {
      setConfirmPasswordError(getConfirmPasswordError(value, confirmPassword))
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    if (confirmPasswordError) {
      setConfirmPasswordError(getConfirmPasswordError(password, value))
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const emailErr = getEmailValidationError(email)
    if (emailErr) {
      setEmailError(emailErr)
      return
    }
    if (!name || !passwordOk) return
    const confirmErr = getConfirmPasswordError(password, confirmPassword)
    if (confirmErr) {
      setConfirmPasswordError(confirmErr)
      return
    }
    setLoading(true)
    const { error } = await signUp(email, password, name)
    setLoading(false)
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' })
      return
    }
    setStep('verify')
  }

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}${nextPath}` },
    })
    if (error) {
      setLoading(false)
      toast({ title: 'Google sign up failed', description: error.message, variant: 'destructive' })
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            {step === 'verify' ? 'Check your email' : 'Create account'}
          </h2>
          <p className="text-sm text-chrome-muted">
            {step === 'verify'
              ? `We sent a confirmation link to ${email}`
              : 'Get started with IdeaForge for free.'}
          </p>
        </div>

        {step === 'verify' ? (
          <div className="space-y-5 py-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <MailCheck className="h-7 w-7 text-chrome-muted" />
            </div>
            <p className="text-sm leading-relaxed text-chrome-muted">
              Click the link in the email to activate your account.
            </p>
            <button
              type="button"
              onClick={() => setStep('form')}
              className="text-xs text-chrome-subtle transition-colors hover:text-foreground"
            >
              ← Back to sign up
            </button>
          </div>
        ) : (
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

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-chrome-muted">Full name</Label>
                <Input
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="name"
                  className="auth-input"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-chrome-muted">Email</Label>
                <Input
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
                <Label className="text-chrome-muted">Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => handlePasswordChange(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
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
                <div className="flex flex-wrap gap-2">
                  {passwordChecks.map(({ check, label }) => (
                    <span
                      key={label}
                      className={cn(
                        'rounded border px-2 py-0.5 font-mono text-[10px]',
                        check
                          ? 'border-success/30 bg-success/10 text-success'
                          : 'border-white/10 text-chrome-subtle',
                      )}
                    >
                      {check && <Check className="mr-0.5 inline h-2.5 w-2.5" />}
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-chrome-muted">Confirm password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    onBlur={() => setConfirmPasswordError(getConfirmPasswordError(password, confirmPassword))}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    aria-invalid={!!confirmPasswordError}
                    className={cn('auth-input pr-10', confirmPasswordError && 'border-destructive/50')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-chrome-muted transition-colors hover:text-foreground"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPasswordError && (
                  <p className="text-xs text-destructive">{confirmPasswordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading || !name || !isValidEmail(email) || !passwordOk || !passwordsMatch}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create account'}
              </button>
            </form>
          </div>
        )}

        <p className="text-center text-sm text-chrome-muted">
          Have an account?{' '}
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
