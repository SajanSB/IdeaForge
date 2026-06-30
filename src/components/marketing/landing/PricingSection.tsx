import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Sparkles,
  Coins,
  Gift,
  Zap,
} from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { Callout, SECTION_PAD, GradientIcon } from '@/components/marketing/shared'

const FREE_ITEMS = [
  'Describe your idea',
  'Answer elicitation Q&A',
  'Review generated summary',
  'See token estimate',
]

const PAID_ITEMS = [
  'Full 13-document generation',
  'BA, UX & Prompt Engineer agents',
  'Master dev prompt + sub-prompts',
  'Markdown download',
]

const TRUST = [
  'No subscription or monthly fees',
  '1.4× safety buffer on token estimate',
  'Pay only when you generate',
]

function EstimatePreview() {
  const breakdown = [
    { label: 'Input tokens', pct: 22, amount: '₹54' },
    { label: 'Output tokens', pct: 58, amount: '₹145' },
    { label: 'Safety buffer', pct: 20, amount: '₹50' },
  ]

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -left-3 top-8 z-10 hidden floating-chip sm:block">
        <span className="flex items-center gap-2 text-xs font-semibold text-success">
          <Gift className="h-3.5 w-3.5" />
          No charge until generation
        </span>
      </div>

      <article className="gradient-border card-surface overflow-hidden p-5 md:p-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome-muted">
              Your estimate
            </p>
            <p className="mt-1 text-sm font-bold">Marketplace for UI kits</p>
          </div>
          <span className="rounded-full bg-primary/15 px-3 py-1 text-[10px] font-bold uppercase gradient-text">
            Medium complexity
          </span>
        </div>

        <div className="mt-5 flex h-3 overflow-hidden rounded-full">
          {breakdown.map((item) => (
            <div
              key={item.label}
              className="bg-white/40 first:rounded-l-full last:rounded-r-full"
              style={{ width: `${item.pct}%`, opacity: item.label === 'Safety buffer' ? 0.55 : 1 }}
              title={item.label}
            />
          ))}
        </div>

        <ul className="mt-4 space-y-2">
          {breakdown.map((item) => (
            <li key={item.label} className="flex items-center justify-between text-xs">
              <span className="text-chrome-muted">{item.label}</span>
              <span className="font-semibold tabular-nums">{item.amount}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome-muted">
                Total per generation
              </p>
              <p className="mt-1 text-3xl font-bold tabular-nums stat-gradient">₹249</p>
            </div>
            <p className="text-right text-[10px] text-chrome-muted">
              Starting from ₹199
              <br />
              for simpler ideas
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome-muted">
            Included when you pay
          </p>
          {PAID_ITEMS.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 rounded-xl bg-chrome-surface/60 px-3 py-2 text-xs"
            >
              <GradientIcon icon={CheckCircle2} size="sm" className="shrink-0" />
              {item}
            </div>
          ))}
        </div>

        <div className="btn-primary mt-5 flex items-center justify-center gap-2 py-3 text-sm font-semibold">
          Pay to generate
          <ArrowRight className="h-4 w-4" />
        </div>
      </article>

      <div className="absolute -right-2 bottom-16 z-10 hidden floating-chip sm:block">
        <span className="flex items-center gap-2 text-xs font-semibold">
          <GradientIcon icon={Zap} size="sm" />
          Ready in &lt;15 min
        </span>
      </div>
    </div>
  )
}

function FreeVsPaidCards() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:hidden">
      <div className="card-surface border-success/20 p-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-success">
          <Gift className="h-3.5 w-3.5" />
          Before you pay
        </p>
        <ul className="mt-3 space-y-2">
          {FREE_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-chrome-muted">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="card-surface border-primary/20 p-4">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest gradient-text">
          <GradientIcon icon={Coins} size="sm" />
          Per generation
        </p>
        <ul className="mt-3 space-y-2">
          {PAID_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-xs text-chrome-muted">
              <GradientIcon icon={CheckCircle2} size="sm" className="shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function PricingSection() {
  return (
    <section
      id="pricing"
      className={`relative bg-chrome-elevated/20 ${SECTION_PAD}`}
      aria-labelledby="pricing-heading"
    >
      <div className="section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <Reveal className="lg:sticky lg:top-28">
            <p className="section-label">Pricing</p>
            <h2 id="pricing-heading" className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Simple,{' '}
              <span className="gradient-text">pay-per-generation</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-chrome-muted">
              No subscription. See your estimate before you pay.
            </p>

            <div className="mt-8 hidden lg:grid lg:grid-cols-2 lg:gap-4">
              <div className="card-surface border-success/20 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-success">
                  <Gift className="h-3.5 w-3.5" />
                  Before you pay
                </p>
                <ul className="mt-3 space-y-2">
                  {FREE_ITEMS.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-chrome-muted">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-surface border-primary/20 p-4">
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest gradient-text">
                  <GradientIcon icon={Coins} size="sm" />
                  When you generate
                </p>
                <p className="mt-2 text-2xl font-bold tabular-nums stat-gradient">From ₹199</p>
                <p className="mt-1 text-xs text-chrome-muted">Based on idea complexity</p>
              </div>
            </div>

            <ul className="mt-8 space-y-3">
              {TRUST.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-chrome-muted">
                  <GradientIcon icon={Shield} size="md" className="mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary mt-10 inline-flex">
              Get your estimate
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Callout icon={Sparkles} className="mt-6">
              You&apos;ll know the exact cost before checkout — no payment until you choose to
              generate.
            </Callout>
          </Reveal>

          <Reveal delay={0.12}>
            <EstimatePreview />
            <FreeVsPaidCards />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
