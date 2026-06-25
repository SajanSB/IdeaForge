import { useState, useEffect, useRef } from 'react'
import { IconX } from '@tabler/icons-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useSessionMerge } from '@/hooks/useSessionMerge'
import { SignUpForm, SignInForm, type SignUpFormData, type SignInFormData } from './EmailPasswordForm'
import { GoogleOAuthButton, OrDivider } from './GoogleOAuthButton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

interface AuthGateModalProps {
  isOpen:     boolean
  projectId:  string
  returnUrl?: string
  onSuccess:  () => void
  onDismiss:  () => void
}

export function AuthGateModal({ isOpen, projectId, returnUrl, onSuccess, onDismiss }: AuthGateModalProps) {
  const { isLoading, signUp, signIn } = useAuthStore()
  const { mergeSession } = useSessionMerge()
  const [activeTab, setActiveTab]       = useState<'signup' | 'signin'>('signup')
  const [emailSent, setEmailSent]       = useState(false)
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) setTimeout(() => firstInputRef.current?.focus(), 100)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) { setEmailSent(false); setActiveTab('signup') }
  }, [isOpen])

  async function handleSignUp(data: SignUpFormData): Promise<string | null> {
    const { error } = await signUp(data.email, data.password)
    if (!error) { setEmailSent(true); return null }
    return error
  }

  async function handleSignIn(data: SignInFormData): Promise<string | null> {
    const { error } = await signIn(data.email, data.password)
    if (!error) {
      const merged = mergeSession()
      if (!merged) toast.warning("Session data couldn't be transferred. You may need to re-enter your idea.")
      onSuccess()
      return null
    }
    return error
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onDismiss()}>
      <DialogContent
        className="max-w-sm w-full p-0 gap-0 border border-[0.5px] border-border rounded-xl overflow-hidden"
        aria-labelledby="auth-modal-heading"
        data-project-id={projectId}
        data-return-url={returnUrl}
      >
        {/* Close */}
        <button
          onClick={onDismiss}
          aria-label="Close and return to cost estimate"
          className="absolute right-4 top-4 z-10 w-7 h-7 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F7F5F0] transition-colors"
        >
          <IconX size={16} aria-hidden="true" />
        </button>

        <div className="p-6 pb-2">
          <DialogHeader className="text-left space-y-1 mb-5">
            <DialogTitle id="auth-modal-heading" className="text-[18px] font-medium text-[#0F0F0F] font-sans tracking-[-0.2px] leading-snug pr-8">
              Save your documents & get your receipt
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#6B7280] font-sans">
              One account — access your docs on any device.
            </DialogDescription>
          </DialogHeader>

          {emailSent ? (
            <div className="py-4 text-center">
              <div className="w-10 h-10 rounded-full bg-[#EAF3DE] flex items-center justify-center mx-auto mb-4">
                <span className="text-[#3B6D11]">✓</span>
              </div>
              <p className="text-[14px] font-medium text-[#0F0F0F] mb-1 font-sans">Check your email</p>
              <p className="text-[13px] text-[#6B7280] font-sans leading-relaxed">After verifying, come back and sign in.</p>
              <button onClick={() => { setEmailSent(false); setActiveTab('signin') }} className="mt-4 text-[13px] text-[#BA7517] font-medium font-sans">
                Already verified? Sign in →
              </button>
            </div>
          ) : (
            <>
              <GoogleOAuthButton label="Continue with Google" />
              <OrDivider />
              <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'signup' | 'signin')}>
                <TabsList className="w-full h-9 bg-[#F7F5F0] p-0.5 rounded-lg mb-5">
                  <TabsTrigger value="signup" className="flex-1 text-[13px] data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md">Sign up</TabsTrigger>
                  <TabsTrigger value="signin" className="flex-1 text-[13px] data-[state=active]:bg-white data-[state=active]:shadow-none rounded-md">Sign in</TabsTrigger>
                </TabsList>
                <TabsContent value="signup" className="mt-0">
                  <SignUpForm onSubmit={handleSignUp} isLoading={isLoading} submitLabel="Create account & continue →" />
                </TabsContent>
                <TabsContent value="signin" className="mt-0">
                  <SignInForm onSubmit={handleSignIn} isLoading={isLoading} submitLabel="Sign in & continue →" showForgotPassword />
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        <div className="px-6 py-3 border-t border-[0.5px] border-border bg-[#F7F5F0]">
          <p className="text-[11px] text-[#6B7280] text-center font-sans">
            By continuing you agree to our <a href="/terms" className="text-[#BA7517] hover:underline">Terms</a> and <a href="/privacy" className="text-[#BA7517] hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
