import { Link } from 'react-router-dom'
import {
  PenLine,
  MessagesSquare,
  CreditCard,
  FolderDown,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { Callout, SECTION_PAD, GradientIcon } from '@/components/marketing/shared'
import { AgentPipeline } from '@/components/marketing/AgentPipeline'
import { DocTypeBadge } from '@/components/brand/AgentBadge'

const STEPS = [
  {
    step: '01',
    icon: PenLine,
    title: 'Describe your idea',
    description: 'Create a free account and describe what you want to build in plain English.',
    visual: 'idea' as const,
  },
  {
    step: '02',
    icon: MessagesSquare,
    title: 'Answer quick Q&A',
    description: '5–8 AI-targeted questions so agents can fill gaps and write accurate specs.',
    visual: 'qa' as const,
  },
  {
    step: '03',
    icon: CreditCard,
    title: 'Review & pay',
    description: 'See a transparent token estimate. Pay only when you\'re ready to generate.',
    visual: 'pay' as const,
  },
  {
    step: '04',
    icon: FolderDown,
    title: 'Download 13 docs',
    description: 'AI agents deliver the full markdown suite plus master dev prompt — under 15 minutes.',
    visual: 'download' as const,
  },
]

function StepVisual({ type }: { type: 'idea' | 'qa' | 'pay' | 'download' }) {
  if (type === 'idea') {
    return (
      <div className="mt-4 rounded-2xl bg-chrome-surface/80 p-4 text-left">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome-muted">
          Your idea
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/90">
          &ldquo;A marketplace where freelance designers can sell UI kits and buyers get
          instant downloads with license tracking…&rdquo;
        </p>
        <p className="mt-2 text-[10px] gradient-text">142 characters · ready to refine</p>
      </div>
    )
  }

  if (type === 'qa') {
    return (
      <div className="mt-4 space-y-2 text-left">
        {[
          { q: 'Who is the primary user?', a: 'Freelance UI designers' },
          { q: 'Revenue model?', a: 'Commission per sale' },
        ].map((item) => (
          <div key={item.q} className="rounded-xl bg-chrome-surface/80 px-3 py-2.5">
            <p className="text-[10px] text-chrome-muted">{item.q}</p>
            <p className="mt-0.5 text-xs font-semibold">{item.a}</p>
          </div>
        ))}
        <p className="text-[10px] text-chrome-muted">Question 3 of 7</p>
      </div>
    )
  }

  if (type === 'pay') {
    return (
      <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome-muted">
            Token estimate
          </p>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-chrome-muted">
            1.4× buffer
          </span>
        </div>
        <p className="mt-2 text-2xl font-bold tabular-nums stat-gradient">₹249</p>
        <p className="mt-1 text-[10px] text-chrome-muted">Based on idea complexity · pay to generate</p>
      </div>
    )
  }

  return (
    <div className="mt-4 space-y-2 text-left">
      <div className="flex flex-wrap gap-1.5">
        {['BRD', 'FRD', 'SRS', 'UX', 'PROMPT'].map((doc) => (
          <DocTypeBadge
            key={doc}
            label={doc}
            agent={doc === 'UX' ? 'UX' : doc === 'PROMPT' ? 'PE' : 'BA'}
          />
        ))}
        <span className="rounded-full bg-chrome-surface px-2 py-1 text-[10px] font-medium text-chrome-muted">
          +8 more
        </span>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-success/10 px-3 py-2 text-xs font-semibold text-success">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Generation complete · 12m 34s
      </div>
    </div>
  )
}

function FlowTimeline() {
  return (
    <div className="relative">
      <div
        className="absolute bottom-6 left-[27px] top-6 w-px bg-gradient-to-b from-white/20 via-chrome-border to-success/50"
        aria-hidden="true"
      />

      <ol className="space-y-5">
        {STEPS.map((item) => {
          const Icon = item.icon
          return (
            <li
              key={item.step}
              className="card-surface relative flex flex-col gap-4 p-5 sm:flex-row sm:items-start"
            >
              <div className="relative z-10 flex shrink-0 items-center gap-3 sm:flex-col sm:items-start sm:gap-2">
                <div className="icon-box-gradient flex h-14 w-14 items-center justify-center rounded-xl ring-1 ring-primary/20">
                  <GradientIcon icon={Icon} size="xl" />
                </div>
                <span className="text-xs font-bold tabular-nums gradient-text">{item.step}</span>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-chrome-muted">{item.description}</p>
                <StepVisual type={item.visual} />
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className={`relative bg-chrome-elevated/20 ${SECTION_PAD}`}
      aria-labelledby="how-heading"
    >
      <div className="section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28">
            <p className="section-label">How it works</p>
            <h2 id="how-heading" className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              AI agents,{' '}
              <span className="gradient-text">four steps</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-chrome-muted">
              From raw idea to enterprise documentation — autonomous agents handle the heavy
              lifting. Create a free account, refine your idea, and pay only when you&apos;re
              ready to generate.
            </p>

            <AgentPipeline compact className="mt-6 justify-start" activeIndex={2} />

            <ul className="mt-8 space-y-3">
              {[
                'Free account to save your project',
                'Transparent pricing before payment',
                'Full suite in under 15 minutes',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-chrome-muted">
                  <GradientIcon icon={CheckCircle2} size="md" className="shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary mt-10 inline-flex">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Callout icon={Sparkles} className="mt-6">
              Your project saves to your account as you move through each step — payment comes
              only at generation.
            </Callout>
          </Reveal>

          <Reveal delay={0.12}>
            <FlowTimeline />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
