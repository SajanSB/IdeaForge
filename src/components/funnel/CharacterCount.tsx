import { cn } from '@/utils/cn'

interface CharacterCountProps {
  current: number
  max: number
  min: number
}

export function CharacterCount({ current, max, min }: CharacterCountProps) {
  const charsToMin = Math.max(0, min - current)
  const isAboveMin = current >= min
  const isNearLimit = current >= 1800
  const isAtLimit = current >= max

  return (
    <div
      id="idea-char-count"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-center justify-between mt-2"
    >
      {/* Left — min requirement hint */}
      <span className={cn(
        'text-[12px] font-sans transition-colors',
        isAboveMin ? 'text-[#3B6D11]' : 'text-[#6B7280]'
      )}>
        {isAboveMin
          ? '✓ Good length'
          : `${charsToMin} more character${charsToMin === 1 ? '' : 's'} to continue`
        }
      </span>

      {/* Right — character count */}
      <span className={cn(
        'text-[12px] font-mono tabular-nums transition-colors',
        isAtLimit ? 'text-red-500 font-medium' :
        isNearLimit ? 'text-[#BA7517] font-medium' :
        'text-[#6B7280]'
      )}>
        {current.toLocaleString()} / {max.toLocaleString()}
        {isAtLimit && (
          <span className="ml-1.5 text-[11px] font-sans font-normal">
            (limit reached)
          </span>
        )}
      </span>
    </div>
  )
}
