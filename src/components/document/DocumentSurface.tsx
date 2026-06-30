import { cn } from '@/lib/utils'

type DocumentSurfaceProps = {
  children: React.ReactNode
  className?: string
  padding?: boolean
}

export function DocumentSurface({ children, className, padding = true }: DocumentSurfaceProps) {
  return (
    <div className={cn('paper-surface paper-scroll', padding && 'p-6 sm:p-8', className)}>
      {children}
    </div>
  )
}
