import { useState } from 'react'
import { IconChevronDown, IconChevronUp, IconBulb } from '@tabler/icons-react'
import { cn } from '@/utils/cn'

const EXAMPLE_IDEA = `A SaaS platform for freelance graphic designers in India to manage client projects, 
track revision rounds, collect payments via Razorpay, and share design files with clients through 
a branded client portal. The platform should support 3 user roles: Designer (creates projects, 
uploads files), Client (views, approves, requests revisions), and Admin (manages billing and 
subscription). Target market: individual freelancers earning ₹2L–₹10L annually from design work.`

interface HintExpanderProps {
  onUseExample?: (text: string) => void
}

export function HintExpander({ onUseExample }: HintExpanderProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setIsOpen(p => !p)}
        aria-expanded={isOpen}
        aria-controls="hint-content"
        className="flex items-center gap-1.5 text-[12px] text-[#6B7280] hover:text-[#BA7517] transition-colors font-sans"
      >
        <IconBulb size={14} aria-hidden="true" />
        {isOpen ? 'Hide example' : 'See an example idea'}
        {isOpen
          ? <IconChevronUp size={12} aria-hidden="true" />
          : <IconChevronDown size={12} aria-hidden="true" />
        }
      </button>

      <div
        id="hint-content"
        hidden={!isOpen}
        className={cn(
          'mt-3 bg-white border border-[0.5px] border-border rounded-xl p-4',
          'transition-all duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] mb-2 font-sans">
          Example idea
        </p>
        <p className="text-[13px] text-[#0F0F0F] leading-relaxed font-sans italic whitespace-pre-line">
          {EXAMPLE_IDEA.trim()}
        </p>
        {onUseExample && (
          <button
            type="button"
            onClick={() => {
              onUseExample(EXAMPLE_IDEA.trim())
              setIsOpen(false)
            }}
            className="mt-3 text-[12px] text-[#BA7517] hover:text-[#A06010] font-medium transition-colors font-sans"
          >
            Use this as a starting point →
          </button>
        )}
      </div>
    </div>
  )
}
