import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { IconShield } from '@tabler/icons-react'
import { useAuthStore }   from '@/stores/useAuthStore'
import { Input }          from '@/components/ui/input'
import { Label }          from '@/components/ui/label'
import { Button }         from '@/components/ui/button'
import { PasswordInput }  from '@/components/auth/PasswordInput'

const schema = z.object({
  email:    z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})
type FormData = z.infer<typeof schema>

export function AdminLoginPage() {
  const navigate                       = useNavigate()
  const { signIn, isLoading, isAdmin, isAuthenticated } = useAuthStore()
  const [accessDenied, setAccessDenied] = useState(false)

  useEffect(() => {
    document.title = 'Admin — IdeaForge'
    // Redirect if already admin
    if (isAuthenticated && isAdmin) navigate('/admin/analytics', { replace: true })
  }, [isAuthenticated, isAdmin, navigate])

  const {
    register, handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode:     'onBlur',
  })

  async function onSubmit(data: FormData) {
    setAccessDenied(false)
    const { error } = await signIn(data.email, data.password)

    if (error) {
      setError('password', { message: 'Invalid email or password.' })
      return
    }

    // Check whitelist after sign-in
    const { isAdmin: adminNow } = useAuthStore.getState()
    if (!adminNow) {
      // Sign them out — they authenticated but aren't admin
      await useAuthStore.getState().signOut()
      setAccessDenied(true)
      return
    }

    navigate('/admin/analytics', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4 font-sans">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#FAEEDA] flex items-center justify-center mx-auto mb-4">
            <IconShield size={22} className="text-[#BA7517]" aria-hidden="true" />
          </div>
          <p className="text-[15px] font-medium text-[#0F0F0F] font-sans">IdeaForge</p>
          <p className="text-[12px] text-[#6B7280] font-sans mt-1">Admin access only</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-6">

          {/* Access denied message */}
          {accessDenied && (
            <div className="bg-[#FCEBEB] border border-[0.5px] border-red-200 rounded-lg px-4 py-3 mb-4">
              <p className="text-[13px] text-red-700 font-sans">
                Access denied. Your email is not on the admin whitelist.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                Email
              </Label>
              <Input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="your@email.com"
                aria-invalid={!!errors.email}
                className="h-10 text-[13px]"
                {...register('email')}
              />
              {errors.email && (
                <p role="alert" className="text-[12px] text-red-600 font-sans">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="admin-password" className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                Password
              </Label>
              <PasswordInput
                id="admin-password"
                autoComplete="current-password"
                placeholder="Your password"
                error={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <p role="alert" className="text-[12px] text-red-600 font-sans">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              aria-busy={isLoading}
              className="w-full h-10 bg-[#BA7517] hover:bg-[#A06010] text-[#FFF8ED] text-[13px] font-medium border-none mt-2"
            >
              {isLoading ? 'Signing in...' : 'Sign in to admin'}
            </Button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#6B7280] mt-4 font-sans">
          Admin access is restricted to authorised emails only.
        </p>
      </div>
    </div>
  )
}
