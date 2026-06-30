import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  PenLine,
  MessagesSquare,
  CreditCard,
  FolderDown,
  FileText,
} from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { SECTION_PAD, GradientIcon } from '@/components/marketing/shared'
import { DocTypeBadge } from '@/components/brand/AgentBadge'

const STEPS = [
  { icon: PenLine, label: 'Idea' },
  { icon: MessagesSquare, label: 'Q&A' },
  { icon: CreditCard, label: 'Estimate' },
  { icon: FolderDown, label: '13 docs' },
]

const HIGHLIGHTS = [
  'Free account — your progress is saved',
  'Transparent estimate before payment',
  'Full suite ready in under 15 minutes',
]

function ForgeStartPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -left-3 top-6 z-10 hidden floating-chip sm:block">
        <span className="flex items-center gap-2 text-xs font-semibold">
          <GradientIcon icon={Sparkles} size="sm" />
          ~2 min to your estimate
        </span>
      </div>

      <article className="gradient-border card-surface overflow-hidden p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const active = i === 0
            return (
              <div key={step.label} className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-white/10 bg-white/[0.03] text-chrome-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <span
                  className={`text-[9px] font-medium uppercase tracking-wider ${
                    active ? 'text-foreground' : 'text-chrome-muted'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome-muted">
            Step 1 · Describe your idea
          </p>
          <p className="mt-3 min-h-[72px] text-sm leading-relaxed text-white/80">
            A subscription platform where indie developers sell API access and
            <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-chrome-muted" />
          </p>
          <p className="mt-2 text-[10px] text-chrome-muted">Free account · saved to your dashboard</p>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-chrome-muted">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-chrome-border" />
          <GradientIcon icon={ArrowRight} size="md" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-chrome-border" />
        </div>

        <div className="mt-5 rounded-2xl bg-chrome-surface/60 p-4">
          <div className="flex items-center gap-2">
            <GradientIcon icon={FileText} size="md" />
            <p className="text-xs font-semibold">What you&apos;ll unlock after payment</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {['BRD', 'FRD', 'SRS', 'UX', 'RTM', 'PROMPT'].map((doc) => (
              <DocTypeBadge
                key={doc}
                label={doc}
                agent={doc === 'UX' ? 'UX' : doc === 'PROMPT' ? 'PE' : 'BA'}
              />
            ))}
            <span className="rounded-full bg-chrome-elevated px-2 py-1 text-[10px] font-medium text-chrome-muted">
              +7 more
            </span>
          </div>
          <div className="progress-track mt-4">
            <div className="progress-fill opacity-40" style={{ width: '12%' }} />
          </div>
          <p className="mt-2 text-[10px] text-chrome-muted">
            Pay only when you&apos;re ready to generate the full suite
          </p>
        </div>
      </article>

      <div className="absolute -right-2 bottom-10 z-10 hidden floating-chip sm:block">
        <span className="text-xs font-semibold text-success">13 docs · one pipeline</span>
      </div>
    </div>
  )
}

export function CtaSection() {
  return (
    <section className={`${SECTION_PAD} pb-16 md:pb-24`} aria-labelledby="cta-heading">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-chrome-elevated/60 p-6 md:p-10 lg:p-12">

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <Reveal>
              <p className="section-label">Get started</p>
              <h2
                id="cta-heading"
                className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
              >
                Ready to forge your{' '}
                <span className="gradient-text">docs?</span>
              </h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-chrome-muted">
                Create a free account, walk through idea to estimate, and pay only when you&apos;re
                ready to generate the full suite.
              </p>

              <ul className="mt-8 space-y-3">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-chrome-muted">
                    <GradientIcon icon={CheckCircle2} size="md" className="shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary min-w-[200px]">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#pricing" className="btn-secondary min-w-[200px]">
                  View pricing
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <ForgeStartPreview />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
