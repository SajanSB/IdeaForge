import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { SECTION_PAD } from '@/components/marketing/shared'

const FAQ = [
  {
    q: 'What do I get?',
    a: '13 interconnected SDLC documents plus an AI dev prompt — BRD through RTM, UI/UX spec, and a master prompt for Cursor or Claude Code.',
  },
  {
    q: 'Do I need to sign up first?',
    a: 'Yes — create a free account to start a project. You only pay when you are ready to generate your documents.',
  },
  {
    q: 'How long does generation take?',
    a: 'Typically under 15 minutes for the full document suite.',
  },
  {
    q: 'What does it cost?',
    a: 'Pay-per-generation from ₹199 depending on complexity. Transparent token estimate before payment.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'IdeaForge runs a structured multi-agent pipeline with sequential context — not a single chat. Each document references the others, and you get a complete SDLC suite, not a one-off answer.',
  },
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className={SECTION_PAD} aria-labelledby="faq-heading">
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        <Reveal className="text-center">
          <p className="section-label">FAQ</p>
          <h2 id="faq-heading" className="section-title mt-3">
            Questions? We&apos;ve got answers.
          </h2>
        </Reveal>

        <Reveal className="mt-12 space-y-3" delay={0.1}>
          {FAQ.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.q}
                className={`card-surface overflow-hidden transition-all duration-300 ${isOpen ? 'border-white/14' : ''}`}
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-chrome-surface/30"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className="font-semibold">{item.q}</span>
                  <ChevronDown
                    className={`icon-gradient h-5 w-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-relaxed text-chrome-muted">{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
