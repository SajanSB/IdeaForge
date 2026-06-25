import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { useAuthStore } from '@/stores/useAuthStore'
import { useIdeaStore } from '@/stores/useIdeaStore'
import { GoogleOAuthButton, OrDivider } from '@/components/auth/GoogleOAuthButton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

type SignInFormValues = z.infer<typeof signInSchema>

export function SignInPage() {
  const { signIn, isAuthenticated, isLoading } = useAuthStore()
  const { projectId, status: ideaStatus } = useIdeaStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const returnUrl = searchParams.get('returnUrl')

  useEffect(() => {
    document.title = 'Sign in — IdeaForge'
  }, [])

  // If already authenticated on mount, redirect appropriately
  useEffect(() => {
    if (isAuthenticated) {
      handlePostAuthRedirect()
    }
  }, [isAuthenticated])

  const handlePostAuthRedirect = () => {
    if (returnUrl) {
      navigate(returnUrl, { replace: true })
    } else if (projectId && ideaStatus === 'estimating') {
      navigate(`/idea/${projectId}/estimate`, { replace: true })
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' }
  })

  const onSubmit = async (values: SignInFormValues) => {
    setErrorMessage(null)
    const { error } = await signIn(values.email, values.password)
    if (error) {
      setErrorMessage(error)
    } else {
      handlePostAuthRedirect()
    }
  }

  return (
    <div className="flex justify-center items-center py-10 font-sans animate-fade-in">
      <div className="w-full max-w-[400px] bg-white border border-[0.5px] border-border rounded-xl p-8">
        <div className="text-center mb-6">
          <h1 className="text-[22px] font-medium tracking-[-0.3px] leading-snug text-ink mb-1.5">
            Sign in to IdeaForge
          </h1>
          <p className="text-xs text-slate">
            Welcome back! Access your scoping sessions
          </p>
        </div>

        <GoogleOAuthButton label="Sign in with Google" />
        <OrDivider />

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

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="text-[11px] font-medium uppercase tracking-[0.06em] text-slate">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11px] font-semibold text-amber-primary hover:text-amber-primary/90"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
              className="text-xs py-2 h-9 rounded-lg"
            />
            {errors.password && (
              <p id="password-error" role="alert" className="text-[11px] text-red-600 mt-1">
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
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-[0.5px] border-border">
          <p className="text-xs text-slate">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-amber-primary hover:text-amber-primary/90">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
