import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { IconMail } from '@tabler/icons-react'

import { supabase } from '@/services/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const resetSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
})

type ResetFormValues = z.infer<typeof resetSchema>

export function ForgotPasswordPage() {
  const [successEmail, setSuccessEmail] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  useEffect(() => {
    document.title = 'Forgot password — IdeaForge'
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    mode: 'onBlur',
    defaultValues: { email: '' }
  })

  const onSubmit = async (values: ResetFormValues) => {
    setIsLoading(true)
    setErrorMessage(null)
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setIsLoading(false)
    if (error) {
      setErrorMessage(error.message)
    } else {
      setSuccessEmail(values.email)
    }
  }

  const handleResend = async () => {
    if (!successEmail) return
    setResendStatus('sending')
    const { error } = await supabase.auth.resetPasswordForEmail(successEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) {
      // Ignore or log error
    }
    setTimeout(() => {
      setResendStatus('sent')
    }, 1000)
  }

  if (successEmail) {
    return (
      <div className="flex justify-center items-center py-10 font-sans animate-fade-in">
        <div className="w-full max-w-[400px] bg-white border border-[0.5px] border-border rounded-xl p-8 text-center">
          <div className="w-12 h-12 bg-amber-tint text-amber-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <IconMail size={24} aria-hidden="true" />
          </div>
          <h1 className="text-[22px] font-medium tracking-[-0.3px] leading-snug text-ink mb-2">
            Check your email
          </h1>
          <p className="text-sm text-slate leading-relaxed mb-8">
            We sent a password reset link to <strong className="text-ink font-medium">{successEmail}</strong>.
          </p>
          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full text-xs font-semibold py-2.5"
              onClick={handleResend}
              disabled={resendStatus === 'sending'}
            >
              {resendStatus === 'sending' ? 'Sending...' : resendStatus === 'sent' ? 'Sent!' : 'Resend reset email'}
            </Button>
            <div className="pt-2">
              <Link to="/login" className="text-xs font-semibold text-amber-primary hover:text-amber-primary/90">
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-10 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] bg-white border border-[0.5px] border-border rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-[22px] font-medium tracking-[-0.3px] leading-snug text-ink mb-1.5">
            Reset your password
          </h1>
          <p className="text-xs text-slate">
            Enter your email to receive a password reset link
          </p>
        </div>

        {errorMessage && (
          <p role="alert" className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded p-3 mb-4">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate mb-1">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@domain.com"
              {...register('email')}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className="text-xs py-2 h-9 rounded-lg"
            />
            {errors.email && (
              <p id="email-error" role="alert" className="text-[11px] text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            aria-busy={isLoading}
            className="w-full bg-amber-primary hover:bg-amber-primary/95 text-[#FFF8ED] text-xs font-semibold py-2.5 h-9 rounded-lg mt-2 cursor-pointer"
          >
            {isLoading ? 'Sending reset link...' : 'Send reset link'}
          </Button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[0.5px] border-border">
          <Link to="/login" className="text-xs font-semibold text-amber-primary hover:text-amber-primary/90">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
