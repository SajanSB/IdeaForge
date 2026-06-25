import { useRef, useEffect } from 'react'
import { cn } from '@/utils/cn'

interface IdeaTextareaProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
  minLength?: number
  placeholder?: string
  autoFocus?: boolean
}

const DEFAULT_PLACEHOLDER =
  'e.g. A mobile app for independent clinic owners to manage appointments, patient records, billing, and staff schedules — targeting small clinics in India with 1–10 doctors.'

export function IdeaTextarea({
  value,
  onChange,
  maxLength = 2000,
  minLength = 50,
  placeholder = DEFAULT_PLACEHOLDER,
  autoFocus = true,
}: IdeaTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus()
  }, [autoFocus])

  // Auto-resize height based on content
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.max(el.scrollHeight, 200)}px`
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const newValue = e.target.value
    // Hard cap at maxLength
    if (newValue.length <= maxLength) {
      onChange(newValue)
    }
  }

  const isNearLimit = value.length >= 1800
  const isAtLimit = value.length >= maxLength

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        id="idea-text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        minLength={minLength}
        aria-label="Application idea"
        aria-describedby="idea-char-count idea-hint"
        aria-required="true"
        className={cn(
          // Base styles
          'w-full min-h-[200px] sm:min-h-[240px] resize-none rounded-xl',
          'px-4 py-4 text-[14px] font-sans leading-relaxed',
          'bg-white border border-[0.5px] border-border text-[#0F0F0F]',
          'placeholder:text-[#6B7280]/60 placeholder:text-[13px]',
          'transition-colors duration-150',
          // Focus ring — amber primary
          'focus:outline-none focus:border-[1.5px] focus:border-[#BA7517]',
          'focus:ring-2 focus:ring-[#BA7517]/15',
          // Near limit — subtle amber border
          isNearLimit && !isAtLimit && 'border-[#EF9F27]',
          // At limit — red border
          isAtLimit && 'border-red-300 focus:border-red-400 focus:ring-red-200',
        )}
      />
    </div>
  )
}
