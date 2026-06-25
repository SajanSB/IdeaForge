import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Label }         from '@/components/ui/label'
import { Button }        from '@/components/ui/button'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { supabase }      from '@/services/supabaseClient'

const schema = z.object({
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/\d/, 'Must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your new password'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path:    ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

interface PasswordChangeFormProps {
  onDismiss?: () => void
}

export function PasswordChangeForm({ onDismiss }: PasswordChangeFormProps) {
  const [isSaving, setIsSaving]     = useState(false)
  const [isSuccess, setIsSuccess]   = useState(false)

  const {
    register, handleSubmit, reset,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode:     'onBlur',
  })

  async function onSubmit(data: FormData) {
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      })
      if (error) throw error

      setIsSuccess(true)
      reset()
      toast.success('Password updated successfully')

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
        onDismiss?.()
      }, 3000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Password update failed'
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[#EAF3DE] border border-[0.5px] border-green-200 rounded-xl">
        <span className="text-[#27500A] text-lg">✓</span>
        <div>
          <p className="text-[13px] font-medium text-[#27500A] font-sans">
            Password updated
          </p>
          <p className="text-[12px] text-[#3B6D11] font-sans">
            Your new password is active.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {/* New password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="new-password"
          className="text-[12px] font-medium text-[#0F0F0F] font-sans"
        >
          New password
        </Label>
        <PasswordInput
          id="new-password"
          autoComplete="new-password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          aria-describedby={errors.newPassword ? 'new-pw-error' : undefined}
          aria-invalid={!!errors.newPassword}
          error={!!errors.newPassword}
          {...register('newPassword')}
        />
        {errors.newPassword && (
          <p id="new-pw-error" role="alert" aria-live="assertive" className="text-[12px] text-red-600 font-sans">
            {errors.newPassword.message}
          </p>
        )}
        {!errors.newPassword && (
          <p className="text-[11px] text-[#6B7280] font-sans">
            At least 8 characters · one uppercase · one number
          </p>
        )}
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <Label
          htmlFor="confirm-password"
          className="text-[12px] font-medium text-[#0F0F0F] font-sans"
        >
          Confirm new password
        </Label>
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          placeholder="Same password again"
          aria-describedby={errors.confirmPassword ? 'confirm-pw-error' : undefined}
          aria-invalid={!!errors.confirmPassword}
          error={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p id="confirm-pw-error" role="alert" aria-live="assertive" className="text-[12px] text-red-600 font-sans">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button
          type="submit"
          disabled={!isDirty || isSaving}
          aria-busy={isSaving}
          className="h-9 px-5 bg-[#BA7517] hover:bg-[#A06010] text-[#FFF8ED] text-[13px] font-medium border-none disabled:opacity-40"
        >
          {isSaving ? 'Updating...' : 'Update password'}
        </Button>
        {onDismiss && (
          <Button
            type="button"
            variant="outline"
            onClick={onDismiss}
            disabled={isSaving}
            className="h-9 px-4 text-[13px] border-[0.5px]"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}
