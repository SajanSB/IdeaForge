import { cn } from '@/lib/utils'

type Agent = 'BA' | 'UX' | 'PE'

const STYLES: Record<Agent, string> = {
  BA: 'bg-agent-ba/15 text-agent-ba border-agent-ba/30',
  UX: 'bg-agent-ux/15 text-agent-ux border-agent-ux/30',
  PE: 'bg-agent-pe/15 text-agent-pe border-agent-pe/30',
}

const LABELS: Record<Agent, string> = {
  BA: 'BA Agent',
  UX: 'UX Agent',
  PE: 'Prompt Engineer',
}

export function AgentBadge({ agent, className }: { agent: Agent; className?: string }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-mono font-semibold uppercase tracking-wider',
      STYLES[agent],
      className,
    )}>
      <span className={cn('h-1.5 w-1.5 rounded-full', agent === 'BA' ? 'bg-agent-ba' : agent === 'UX' ? 'bg-agent-ux' : 'bg-agent-pe')} />
      {LABELS[agent]}
    </span>
  )
}

export function DocTypeBadge({ label, agent }: { label: string; agent: Agent }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-mono font-semibold',
      STYLES[agent],
    )}>
      {label}
    </span>
  )
}

export function MonoId({ id, className }: { id: string; className?: string }) {
  return (
    <span className={cn('font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20', className)}>
      {id}
    </span>
  )
}
