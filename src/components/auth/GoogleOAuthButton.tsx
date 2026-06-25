import { IconBrandGoogle } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'

interface GoogleOAuthButtonProps {
  label?: string
}

export function GoogleOAuthButton({ label = 'Continue with Google' }: GoogleOAuthButtonProps) {
  const signInWithGoogle = useAuthStore(s => s.signInWithGoogle)
  return (
    <Button variant="outline" type="button" className="w-full gap-2 text-[13px]" onClick={() => signInWithGoogle()}>
      <IconBrandGoogle size={16} aria-hidden="true" />
      {label}
    </Button>
  )
}

export function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-4" aria-hidden="true">
      <div className="flex-1 h-[0.5px] bg-border" />
      <span className="text-[11px] text-muted-foreground uppercase tracking-[0.06em]">or</span>
      <div className="flex-1 h-[0.5px] bg-border" />
    </div>
  )
}
