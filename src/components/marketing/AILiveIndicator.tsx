import { cn } from '@/lib/utils'

type AILiveIndicatorProps = {
  label?: string
  className?: string
}

export function AILiveIndicator({ label = 'AI active', className }: AILiveIndicatorProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 font-mono text-[10px] font-medium text-chrome-subtle', className)}>
      <span className="ai-live-dot" aria-hidden />
      {label}
    </span>
  )
}
