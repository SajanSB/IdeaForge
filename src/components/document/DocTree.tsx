import { DOC_META } from '@/lib/flowConstants'
import { AgentBadge } from '@/components/brand/AgentBadge'
import { cn } from '@/lib/utils'
import { Check, FileText } from 'lucide-react'

type DocTreeProps = {
  activeDoc?: string
  availableDocs?: string[]
  completedDocs?: string[]
  onSelect: (docKey: string) => void
  className?: string
  variant?: 'paper' | 'chrome'
}

const AGENT_ORDER: Array<'BA' | 'UX' | 'PE'> = ['BA', 'UX', 'PE']

export function DocTree({ activeDoc, availableDocs, completedDocs = [], onSelect, className, variant = 'paper' }: DocTreeProps) {
  const keys = availableDocs ?? Object.keys(DOC_META)
  const isChrome = variant === 'chrome'

  return (
    <div className={cn('space-y-4', className)}>
      {AGENT_ORDER.map((agent) => {
        const agentDocs = keys.filter((k) => DOC_META[k]?.agent === agent)
        if (agentDocs.length === 0) return null
        return (
          <div key={agent}>
            <AgentBadge agent={agent} className="mb-2" />
            <ul className="space-y-0.5">
              {agentDocs.map((key) => {
                const meta = DOC_META[key]
                const active = key === activeDoc
                const done = completedDocs.includes(key)
                return (
                  <li key={key}>
                    <button
                      onClick={() => onSelect(key)}
                      className={cn(
                        'w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors',
                        isChrome
                          ? active
                            ? 'bg-primary/10 border border-primary/20 text-foreground font-medium'
                            : 'text-chrome-muted hover:bg-white/[0.04] hover:text-foreground'
                          : active
                            ? 'bg-primary/15 text-paper-ink font-medium'
                            : 'text-paper-ink-muted hover:bg-paper-muted/60 hover:text-paper-ink',
                      )}
                    >
                      {done ? (
                        <Check className="h-3.5 w-3.5 text-success shrink-0" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      )}
                      <span className="truncate">{meta.short}</span>
                      <span className="ml-auto text-[10px] font-mono opacity-50 hidden sm:inline">{key}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
