import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'

// ── Validation Schemas ───────────────────────────────────────────────────────

const signUpSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/\d/, 'Must contain at least one number'),
})

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>

// ── SignUpForm Component ─────────────────────────────────────────────────────

interface SignUpFormProps {
  onSubmit: (data: SignUpFormData) => Promise<string | null>
  isLoading: boolean
  submitLabel: string
}

export function SignUpForm({ onSubmit, isLoading, submitLabel }: SignUpFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  const handleFormSubmit = async (values: SignUpFormData) => {
    setErrorMessage(null)
    const err = await onSubmit(values)
    if (err) setErrorMessage(err)
  }

  return (
    <div className="space-y-4 font-sans">
      {errorMessage && (
        <p role="alert" className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="modal-signup-email" className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate mb-1">
            Email address
          </label>
          <Input
            id="modal-signup-email"
            type="email"
            placeholder="name@domain.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
            className="text-xs py-2 h-9 rounded-lg"
          />
          {errors.email && (
            <p id="signup-email-error" role="alert" className="text-[11px] text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label htmlFor="modal-signup-password" className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate mb-1">
            Password
          </label>
          <Input
            id="modal-signup-password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
            className="text-xs py-2 h-9 rounded-lg"
          />
          {errors.password && (
            <p id="signup-password-error" role="alert" className="text-[11px] text-red-600 mt-1 leading-normal">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full bg-amber-primary hover:bg-amber-primary/95 text-[#FFF8ED] text-xs font-semibold py-2.5 h-9 rounded-lg mt-2 cursor-pointer"
        >
          {isLoading ? 'Processing...' : submitLabel}
        </Button>
      </form>
    </div>
  )
}

// ── SignInForm Component ─────────────────────────────────────────────────────

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => Promise<string | null>
  isLoading: boolean
  submitLabel: string
  showForgotPassword?: boolean
}

export function SignInForm({ onSubmit, isLoading, submitLabel, showForgotPassword }: SignInFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  })

  const handleFormSubmit = async (values: SignInFormData) => {
    setErrorMessage(null)
    const err = await onSubmit(values)
    if (err) setErrorMessage(err)
  }

  return (
    <div className="space-y-4 font-sans">
      {errorMessage && (
        <p role="alert" className="text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded p-3">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="modal-signin-email" className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate mb-1">
            Email address
          </label>
          <Input
            id="modal-signin-email"
            type="email"
            placeholder="name@domain.com"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'signin-email-error' : undefined}
            className="text-xs py-2 h-9 rounded-lg"
          />
          {errors.email && (
            <p id="signin-email-error" role="alert" className="text-[11px] text-red-600 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="modal-signin-password" className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate">
              Password
            </label>
            {showForgotPassword && (
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-amber-primary hover:text-amber-primary/90"
              >
                Forgot password?
              </Link>
            )}
          </div>
          <Input
            id="modal-signin-password"
            type="password"
            placeholder="••••••••"
            {...register('password')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'signin-password-error' : undefined}
            className="text-xs py-2 h-9 rounded-lg"
          />
          {errors.password && (
            <p id="signin-password-error" role="alert" className="text-[11px] text-red-600 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          aria-busy={isLoading}
          className="w-full bg-amber-primary hover:bg-amber-primary/95 text-[#FFF8ED] text-xs font-semibold py-2.5 h-9 rounded-lg mt-2 cursor-pointer"
        >
          {isLoading ? 'Processing...' : submitLabel}
        </Button>
      </form>
    </div>
  )
}
