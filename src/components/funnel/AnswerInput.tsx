import { useRef, useEffect } from 'react'
import { IconArrowRight } from '@tabler/icons-react'
import { cn } from '@/utils/cn'

const MAX_ANSWER_CHARS = 500
const SHOW_COUNTER_AT = 400

interface AnswerInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onSkip: () => void
  isLast: boolean
  isLoading: boolean
  questionIndex: number
}

export function AnswerInput({
  value,
  onChange,
  onSubmit,
  onSkip,
  isLast,
  isLoading,
  questionIndex,
}: AnswerInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const charCount = value.length
  const canSubmit = value.trim().length > 0 && !isLoading
  const showCounter = charCount >= SHOW_COUNTER_AT

  // Focus the textarea whenever the question changes
  useEffect(() => {
    textareaRef.current?.focus()
  }, [questionIndex])

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [value])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Submit on Enter (not Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey && !isLoading && value.trim().length > 0) {
      e.preventDefault()
      onSubmit()
    }
    // Shift+Enter adds newline — default textarea behaviour
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length <= MAX_ANSWER_CHARS) {
      onChange(e.target.value)
    }
  }

  return (
    <div className="border-t border-[0.5px] border-border bg-[#F7F5F0] pt-4 pb-4 sm:pb-0">

      {/* Character counter — shown only when approaching limit */}
      {showCounter && (
        <div className="flex justify-end mb-1.5">
          <span className={cn(
            'text-[11px] font-mono tabular-nums',
            charCount >= MAX_ANSWER_CHARS ? 'text-red-500' : 'text-[#BA7517]'
          )}>
            {charCount} / {MAX_ANSWER_CHARS}
          </span>
        </div>
      )}

      {/* Textarea */}
      <div className="relative">
        <label htmlFor="answer-input" className="sr-only">
          Your answer
        </label>
        <textarea
          ref={textareaRef}
          id="answer-input"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={isLast
            ? 'Your final answer (or skip to continue)...'
            : 'Type your answer... (Enter to submit, Shift+Enter for new line)'
          }
          disabled={isLoading}
          maxLength={MAX_ANSWER_CHARS}
          rows={2}
          aria-describedby={showCounter ? 'answer-char-count' : undefined}
          className={cn(
            'w-full resize-none rounded-xl px-4 py-3',
            'text-[14px] font-sans leading-relaxed text-[#0F0F0F]',
            'bg-white border border-[0.5px] border-border',
            'placeholder:text-[#6B7280]/50 placeholder:text-[13px]',
            'focus:outline-none focus:border-[1.5px] focus:border-[#BA7517]',
            'focus:ring-2 focus:ring-[#BA7517]/15',
            'transition-colors duration-150',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            charCount >= MAX_ANSWER_CHARS && 'border-red-300',
          )}
        />
        {/* Hidden character count for screen readers */}
        {showCounter && (
          <span id="answer-char-count" className="sr-only">
            {charCount} of {MAX_ANSWER_CHARS} characters used
          </span>
        )}
      </div>

      {/* Action row */}
      <div className="flex items-center justify-between mt-3">

        {/* Skip link */}
        <button
          type="button"
          onClick={onSkip}
          disabled={isLoading}
          aria-label="Skip this question and move to the next one"
          className={cn(
            'text-[13px] font-sans text-[#6B7280]',
            'hover:text-[#0F0F0F] transition-colors',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            'underline-offset-2 hover:underline',
          )}
        >
          Skip this question
        </button>

        {/* Answer / final CTA */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          aria-disabled={!canSubmit}
          className={cn(
            'inline-flex items-center gap-2 px-5 h-10 rounded-lg',
            'text-[13px] font-medium font-sans',
            'transition-all duration-150 active:scale-[0.98]',
            canSubmit
              ? 'bg-[#BA7517] text-[#FFF8ED] hover:bg-[#A06010] cursor-pointer'
              : 'bg-[#BA7517]/35 text-[#FFF8ED]/60 cursor-not-allowed',
          )}
        >
          {isLoading ? (
            <>
              <span
                className="w-3.5 h-3.5 rounded-full border-2 border-[#FFF8ED]/50 border-t-[#FFF8ED] animate-spin"
                aria-hidden="true"
              />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>{isLast ? 'Review my answers' : 'Answer'}</span>
              <IconArrowRight size={14} aria-hidden="true" />
            </>
          )}
        </button>

      </div>

      {/* Keyboard hint */}
      <p className="text-[11px] text-[#6B7280]/60 text-right mt-1.5 font-sans hidden sm:block">
        Enter to submit · Shift+Enter for new line
      </p>

    </div>
  )
}
