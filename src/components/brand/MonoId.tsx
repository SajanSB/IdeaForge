import { cn } from '@/utils/cn'

interface MonoIdProps {
  children: React.ReactNode
  className?: string
}

export function MonoId({ children, className }: MonoIdProps) {
  return (
    <span className={cn('font-mono text-xs font-medium text-amber-primary tracking-[0.02em]', className)}>
      {children}
    </span>
  )
}
