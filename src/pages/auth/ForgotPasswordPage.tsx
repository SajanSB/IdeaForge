import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from '@/components/shell/AuthLayout'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Loader2, MailCheck } from 'lucide-react'
import { cn, getEmailValidationError, isValidEmail } from '@/lib/utils'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault()
    const emailErr = getEmailValidationError(email)
    if (emailErr) {
      setEmailError(emailErr)
      return
    }
    setLoading(true)
    setSent(true)
    setLoading(false)
    toast({ title: 'Reset link sent', description: `Check your inbox at ${email}` })
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">Reset password</h2>
          <p className="text-sm text-chrome-muted">
            {sent
              ? `We sent a reset link to ${email}`
              : "Enter your email and we'll send you a reset link."}
          </p>
        </div>

        {sent ? (
          <div className="space-y-5 py-2 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <MailCheck className="h-7 w-7 text-chrome-muted" />
            </div>
            <p className="text-sm text-chrome-muted">Check your inbox and click the reset link.</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="text-xs text-chrome-subtle transition-colors hover:text-foreground"
            >
              Resend link
            </button>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-chrome-muted">Email address</Label>
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
                autoFocus
                autoComplete="email"
                aria-invalid={!!emailError}
                className={cn('auth-input', emailError && 'border-destructive/50')}
              />
              {emailError && (
                <p className="text-xs text-destructive">{emailError}</p>
              )}
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading || !isValidEmail(email)}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-chrome-muted">
          <Link to="/login" className="font-medium text-foreground hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
