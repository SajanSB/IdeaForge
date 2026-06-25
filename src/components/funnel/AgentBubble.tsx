import { cn } from '@/utils/cn'

interface AgentBubbleProps {
  question: string
  questionNumber: number
  isCurrent: boolean
}

export function AgentBubble({ question, questionNumber, isCurrent }: AgentBubbleProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 mb-1',
        !isCurrent && 'opacity-60'
      )}
    >
      {/* Agent avatar */}
      <div className="flex-shrink-0 mt-1">
        <div className={cn(
          'w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0',
          isCurrent ? 'bg-[#FAEEDA]' : 'bg-[#F7F5F0] border border-[0.5px] border-border'
        )}>
          <span className={cn(
            'text-[10px] font-mono font-medium',
            isCurrent ? 'text-[#BA7517]' : 'text-[#6B7280]'
          )}>BA</span>
        </div>
      </div>

      {/* Bubble */}
      <div className={cn(
        'flex-1 bg-white border border-[0.5px] border-border rounded-xl rounded-tl-sm',
        'px-4 py-3',
        isCurrent && 'border-l-2 border-l-[#BA7517]'
      )}>
        {/* Agent label + question number */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[11px] font-mono font-medium text-[#BA7517]">
            BA Agent
          </span>
          <span className="text-[10px] font-mono text-[#6B7280]">
            Q{questionNumber}
          </span>
        </div>

        {/* Question text */}
        <p className={cn(
          'text-[14px] font-sans leading-relaxed',
          isCurrent ? 'text-[#0F0F0F]' : 'text-[#6B7280]'
        )}>
          {question}
        </p>
      </div>
    </div>
  )
}
