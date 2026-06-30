import { cn } from '@/lib/utils'

type Agent = 'BA' | 'UX' | 'PE'

const AGENTS: { key: Agent; label: string; color: string }[] = [
  { key: 'BA', label: 'BA Agent', color: 'bg-agent-ba' },
  { key: 'UX', label: 'UX Agent', color: 'bg-agent-ux' },
  { key: 'PE', label: 'Prompt Engineer', color: 'bg-agent-pe' },
]

type AgentPipelineProps = {
  activeAgent?: Agent
  completedAgents?: Agent[]
  compact?: boolean
  className?: string
}

export function AgentPipeline({ activeAgent = 'BA', completedAgents = [], compact, className }: AgentPipelineProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {!compact && (
        <p className="label-mono text-chrome-subtle uppercase tracking-widest text-[10px]">Agent pipeline</p>
      )}
      <div className={cn('flex gap-2', compact ? 'flex-col' : 'flex-row')}>
        {AGENTS.map((agent, i) => {
          const done = completedAgents.includes(agent.key)
          const active = agent.key === activeAgent && !done
          return (
            <div key={agent.key} className="flex items-center gap-2 flex-1">
              <div className={cn(
                'h-2 flex-1 rounded-full transition-all',
                done ? agent.color : active ? `${agent.color} animate-pulse` : 'bg-white/10',
              )} />
              {!compact && (
                <span className={cn(
                  'text-[10px] font-mono shrink-0 w-16',
                  done || active ? 'text-foreground' : 'text-chrome-subtle',
                )}>
                  {agent.label}
                </span>
              )}
              {i < AGENTS.length - 1 && !compact && (
                <span className="text-chrome-subtle text-xs">→</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
