import { Bot, Palette, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { GradientIcon } from '@/components/marketing/shared'

const AGENTS = [
  {
    id: 'ba',
    label: 'BA',
    title: 'Business Analyst',
    icon: Bot,
    ring: 'border-white/10 bg-white/[0.04]',
  },
  {
    id: 'ux',
    label: 'UX',
    title: 'UX Designer',
    icon: Palette,
    ring: 'border-white/10 bg-white/[0.04]',
  },
  {
    id: 'pe',
    label: 'PE',
    title: 'Prompt Engineer',
    icon: Terminal,
    ring: 'border-white/10 bg-white/[0.04]',
  },
] as const

type AgentPipelineProps = {
  className?: string
  compact?: boolean
  activeIndex?: number
}

export function AgentPipeline({ className, compact = false, activeIndex = 0 }: AgentPipelineProps) {
  return (
    <div
      className={cn('flex items-center justify-center', compact ? 'gap-1' : 'gap-2 sm:gap-3', className)}
      role="img"
      aria-label="Three-agent AI pipeline: Business Analyst, UX Designer, Prompt Engineer"
    >
      {AGENTS.map((agent, index) => {
        const Icon = agent.icon
        const isActive = index === activeIndex
        const isPast = index < activeIndex

        return (
          <div key={agent.id} className="flex items-center">
            <div className={cn('flex flex-col items-center', compact ? 'gap-1' : 'gap-2')}>
              <div
                className={cn(
                  'relative flex items-center justify-center rounded-xl border transition-all duration-300',
                  agent.ring,
                  compact ? 'h-10 w-10' : 'h-12 w-12 sm:h-14 sm:w-14',
                  isActive && 'border-white/20 bg-white/[0.08]',
                  isPast && 'opacity-70',
                )}
              >
                <GradientIcon icon={Icon} size={compact ? 'md' : 'lg'} />
              </div>
              {!compact && (
                <div className="text-center">
                  <p className="font-mono text-[10px] font-medium uppercase tracking-wider text-chrome-muted">
                    {agent.label}
                  </p>
                  <p className="hidden text-[10px] text-chrome-subtle sm:block">{agent.title}</p>
                </div>
              )}
            </div>

            {index < AGENTS.length - 1 && (
              <div
                className={cn(
                  'relative overflow-hidden rounded-full bg-white/10',
                  compact ? 'mx-1.5 h-px w-6' : 'mx-2 h-px w-8 sm:mx-3 sm:w-14',
                )}
                aria-hidden
              >
                <div
                  className="ai-flow-line absolute inset-0"
                  style={{ animationDelay: `${index * 0.6}s` }}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export function AgentPipelineLabel({ className }: { className?: string }) {
  return (
    <p className={cn('flex items-center justify-center gap-2 text-xs text-chrome-subtle', className)}>
      <span className="ai-live-dot" aria-hidden />
      <span>Sequential multi-agent context</span>
    </p>
  )
}
