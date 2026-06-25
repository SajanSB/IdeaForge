import { cn } from '@/utils/cn'

interface UserAnswerBubbleProps {
  answer: string | null   // null = skipped
  questionNumber: number
}

export function UserAnswerBubble({ answer, questionNumber }: UserAnswerBubbleProps) {
  const isSkipped = answer === null

  return (
    <div className="flex justify-end mb-4" aria-label={`Your answer to question ${questionNumber}`}>
      <div className={cn(
        'max-w-[85%] rounded-xl rounded-tr-sm px-4 py-3',
        isSkipped
          ? 'bg-[#F7F5F0] border border-[0.5px] border-border'
          : 'bg-[#EEEDFE]'
      )}>
        {isSkipped ? (
          <p className="text-[12px] font-mono italic text-[#6B7280]">
            (skipped)
          </p>
        ) : (
          <p className="text-[13px] font-sans leading-relaxed text-[#3C3489] whitespace-pre-wrap">
            {answer}
          </p>
        )}
      </div>
    </div>
  )
}
