import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { IconChevronDown, IconChevronUp, IconUser } from '@tabler/icons-react'
import { useAuthStore }         from '@/stores/useAuthStore'
import { SettingsSubNav }       from '@/components/dashboard/SettingsSubNav'
import { PasswordChangeForm }   from '@/components/settings/PasswordChangeForm'
import { DangerZoneCard }       from '@/components/settings/DangerZoneCard'
import { Input }                from '@/components/ui/input'
import { Label }                from '@/components/ui/label'
import { Button }               from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { supabase } from '@/services/supabaseClient'

const ROLES = [
  'Founder', 'Developer', 'Product Manager',
  'Business Analyst', 'Consultant', 'Designer', 'Other',
]
const INDUSTRIES = [
  'SaaS', 'E-commerce', 'HealthTech', 'EdTech',
  'FinTech', 'Field Service', 'Construction', 'Other',
]

const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or fewer'),
  role:     z.string().optional(),
  industry: z.string().optional(),
})
type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileSettingsPage() {
  const { user, refreshSession }    = useAuthStore()
  const [isSaving, setIsSaving]     = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  useEffect(() => {
    document.title = 'Profile — IdeaForge'
  }, [])

  const meta = user?.user_metadata as {
    display_name?: string; role?: string; industry?: string
  } | undefined

  const {
    register, handleSubmit, setValue, watch,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver:      zodResolver(profileSchema),
    mode:          'onBlur',
    defaultValues: {
      displayName: meta?.display_name ?? '',
      role:        meta?.role         ?? '',
      industry:    meta?.industry     ?? '',
    },
  })

  // Format account creation date
  const createdAt = user?.created_at
    ? new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric',
      }).format(new Date(user.created_at))
    : null

  async function onSubmitProfile(data: ProfileFormData) {
    setIsSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: data.displayName,
          role:         data.role ?? '',
          industry:     data.industry ?? '',
        },
      })
      if (error) throw error
      await refreshSession()
      toast.success('Profile saved')
    } catch (err) {
      console.error('Profile save failed:', err)
      toast.error('Could not save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-1">
        Settings
      </h1>
      <p className="text-[13px] text-[#6B7280] font-sans mb-5">
        Manage your account and preferences.
      </p>

      <SettingsSubNav />

      {/* ── Profile section ──────────────────────────────────────────────── */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center gap-2">
          <IconUser size={14} className="text-[#6B7280]" aria-hidden="true" />
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Profile information
          </p>
        </div>

        <div className="px-5 py-5">
          <form onSubmit={handleSubmit(onSubmitProfile)} noValidate className="space-y-5">

            {/* Email — read-only */}
            <div className="space-y-1.5">
              <Label className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                Email address
              </Label>
              <Input
                type="email"
                value={user?.email ?? ''}
                readOnly
                disabled
                aria-label="Email address (read-only)"
                className="h-10 text-[13px] bg-[#F7F5F0] text-[#6B7280] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#6B7280] font-sans">
                Email cannot be changed.{' '}
                <a
                  href="mailto:support@ideaforge.ai"
                  className="text-[#BA7517] hover:text-[#A06010] transition-colors"
                >
                  Contact support
                </a>
                {' '}if needed.
              </p>
            </div>

            {/* Display name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="profile-display-name"
                className="text-[12px] font-medium text-[#0F0F0F] font-sans"
              >
                Display name
              </Label>
              <Input
                id="profile-display-name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                aria-describedby={errors.displayName ? 'name-error' : undefined}
                aria-invalid={!!errors.displayName}
                className="h-10 text-[13px]"
                {...register('displayName')}
              />
              {errors.displayName && (
                <p
                  id="name-error"
                  role="alert"
                  aria-live="assertive"
                  className="text-[12px] text-red-600 font-sans"
                >
                  {errors.displayName.message}
                </p>
              )}
            </div>

            {/* Role + Industry — 2-column on sm+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                  Your role
                  <span className="ml-1 text-[#6B7280]/60 font-normal">(optional)</span>
                </Label>
                <Select
                  value={watch('role') ?? ''}
                  onValueChange={v => setValue('role', v, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-10 text-[13px] border-[0.5px]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map(r => (
                      <SelectItem key={r} value={r} className="text-[13px]">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                  Industry
                  <span className="ml-1 text-[#6B7280]/60 font-normal">(optional)</span>
                </Label>
                <Select
                  value={watch('industry') ?? ''}
                  onValueChange={v => setValue('industry', v, { shouldDirty: true })}
                >
                  <SelectTrigger className="h-10 text-[13px] border-[0.5px]">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map(i => (
                      <SelectItem key={i} value={i} className="text-[13px]">
                        {i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Account meta */}
            {createdAt && (
              <p className="text-[11px] text-[#6B7280] font-sans">
                Account created {createdAt}
              </p>
            )}

            {/* Save */}
            <div className="pt-1">
              <Button
                type="submit"
                disabled={!isDirty || isSaving}
                aria-busy={isSaving}
                className="h-10 px-6 bg-[#BA7517] hover:bg-[#A06010] text-[#FFF8ED] text-[13px] font-medium border-none disabled:opacity-40"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* ── Password section ──────────────────────────────────────────────── */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-5">
        <button
          type="button"
          onClick={() => setShowPasswordForm(p => !p)}
          aria-expanded={showPasswordForm}
          aria-controls="password-change-section"
          className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#F7F5F0] transition-colors"
        >
          <div>
            <p className="text-[14px] font-medium text-[#0F0F0F] font-sans">
              Change password
            </p>
            <p className="text-[12px] text-[#6B7280] font-sans mt-0.5">
              Update your account password.
            </p>
          </div>
          {showPasswordForm
            ? <IconChevronUp size={16} className="text-[#6B7280] flex-shrink-0" aria-hidden="true" />
            : <IconChevronDown size={16} className="text-[#6B7280] flex-shrink-0" aria-hidden="true" />
          }
        </button>

        {showPasswordForm && (
          <div
            id="password-change-section"
            className="px-5 pb-5 border-t border-[0.5px] border-border pt-4"
          >
            <PasswordChangeForm
              onDismiss={() => setShowPasswordForm(false)}
            />
          </div>
        )}
      </div>

      {/* ── Danger zone ───────────────────────────────────────────────────── */}
      <DangerZoneCard />
    </div>
  )
}
