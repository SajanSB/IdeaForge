import { cn } from '@/utils/cn'
import type { DocType } from '@/types/document'

type AgentColour = 'ba' | 'ux' | 'pe' | 'sys'

const DOC_AGENT_MAP: Record<DocType, AgentColour> = {
  BRD: 'ba', FRD: 'ba', SRS: 'ba', BMP: 'ba', USR: 'ba',
  PFD: 'ba', UC: 'ba', DMD: 'ba', UAT: 'ba', RTM: 'ba',
  UIUX: 'ux', DEVPROMPT: 'pe', ELICITATION: 'sys',
}

const AGENT_STYLES: Record<AgentColour, string> = {
  ba:  'bg-ba-fill border-ba-border text-ba-text',
  ux:  'bg-ux-fill border-ux-border text-ux-text',
  pe:  'bg-pe-fill border-pe-border text-pe-text',
  sys: 'bg-muted border-border text-muted-foreground',
}

interface DocTagProps {
  type: DocType
  size?: 'sm' | 'md'
  className?: string
}

export function DocTag({ type, size = 'md', className }: DocTagProps) {
  const agent = DOC_AGENT_MAP[type]
  return (
    <span
      aria-label={type}
      className={cn(
        'inline-flex items-center font-mono font-medium border rounded tracking-[0.02em] flex-shrink-0',
        AGENT_STYLES[agent],
        size === 'md' ? 'text-[11px] px-2 py-[3px]' : 'text-[10px] px-1.5 py-[2px]',
        className
      )}
    >
      {type === 'DEVPROMPT' ? 'DEV PROMPT' : type === 'ELICITATION' ? 'ELICITATION' : type}
    </span>
  )
}
