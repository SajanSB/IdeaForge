import { Link } from 'react-router-dom'
import {
  X,
  CheckCircle2,
  ArrowRight,
  Clock,
  FileText,
  Bot,
  Wallet,
  GitBranch,
  Sparkles,
} from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { SECTION_PAD, GradientIcon, GradientIconBox } from '@/components/marketing/shared'
import { DocTypeBadge } from '@/components/brand/AgentBadge'

const WINS = [
  '13 documents generated in one pipeline run',
  'Every artifact cross-references the others',
  'Pay only when you\'re ready to generate',
]

function TraditionalPanel() {
  return (
    <article className="card-surface flex h-full flex-col border-danger/20 p-5 opacity-90 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-danger/10 text-danger">
          <X className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-chrome-muted">Traditional</p>
          <h3 className="font-bold text-chrome-muted">Manual specs</h3>
        </div>
      </div>

      <ul className="flex-1 space-y-4 text-sm">
        <li>
          <p className="text-xs text-chrome-muted">Time to ship specs</p>
          <p className="mt-1 text-lg font-bold text-chrome-muted line-through decoration-danger/50">
            3–4 weeks
          </p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4].map((w) => (
              <div
                key={w}
                className={`h-2 flex-1 rounded-full ${w < 3 ? 'bg-warning/40' : 'bg-danger/40'}`}
              />
            ))}
          </div>
        </li>

        <li className="rounded-xl bg-chrome-surface/60 p-3">
          <p className="text-xs text-chrome-muted">Output</p>
          <div className="mt-2 space-y-1.5">
            {['template-brd.docx', 'notes.txt', 'figma-export.pdf'].map((f) => (
              <p key={f} className="font-mono text-xs text-chrome-muted line-through decoration-danger/40">
                {f}
              </p>
            ))}
          </div>
        </li>

        <li className="rounded-xl border border-danger/20 bg-danger/5 p-3">
          <p className="text-xs text-chrome-muted">Dev handoff</p>
          <p className="mt-1 text-sm">Paste into ChatGPT and hope it remembers context</p>
        </li>

        <li>
          <p className="text-xs text-chrome-muted">Cost</p>
          <p className="mt-1 font-semibold text-danger">BA consultant or monthly subscription</p>
        </li>
      </ul>
    </article>
  )
}

function IdeaForgePanel() {
  return (
    <article className="gradient-border card-surface flex h-full flex-col p-5 md:p-6">
      <div className="mb-5 flex items-center gap-2">
        <GradientIconBox icon={Sparkles} boxSize="md" iconSize="md" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest gradient-text">IdeaForge</p>
          <h3 className="font-bold">AI documentation forge</h3>
        </div>
      </div>

      <ul className="flex-1 space-y-4 text-sm">
        <li>
          <p className="text-xs text-chrome-muted">Time to ship specs</p>
          <p className="mt-1 text-2xl font-bold tabular-nums stat-gradient">&lt;15 minutes</p>
          <div className="progress-track mt-2">
            <div className="progress-fill" style={{ width: '100%' }} />
          </div>
        </li>

        <li className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <p className="text-xs text-chrome-muted">Output</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['BRD', 'FRD', 'SRS', 'UX', 'RTM', 'PROMPT'].map((doc) => (
              <DocTypeBadge
                key={doc}
                label={doc}
                agent={doc === 'UX' ? 'UX' : doc === 'PROMPT' ? 'PE' : 'BA'}
              />
            ))}
            <span className="rounded-full bg-chrome-surface px-2 py-1 text-[10px] font-medium text-chrome-muted">
              +7
            </span>
          </div>
        </li>

        <li className="rounded-xl bg-chrome-surface/60 p-3">
          <p className="text-xs text-chrome-muted">Dev handoff</p>
          <p className="mt-1 font-medium">Master prompt + sub-prompts for Cursor & Claude Code</p>
          <div className="mt-2 flex gap-1">
            <div className="h-1.5 flex-[2] rounded-full bg-agent-ba" />
            <div className="h-1.5 flex-1 rounded-full bg-agent-ux" />
            <div className="h-1.5 flex-1 rounded-full bg-agent-pe" />
          </div>
        </li>

        <li>
          <p className="text-xs text-chrome-muted">Cost</p>
          <p className="mt-1 font-semibold">
            From <span className="stat-gradient">₹199</span> per generation
          </p>
        </li>
      </ul>
    </article>
  )
}

const COMPARE_ROWS = [
  { icon: Clock, label: 'Speed', manual: 'Weeks of manual work', forge: 'Under 15 minutes' },
  { icon: FileText, label: 'Output', manual: 'Scattered templates', forge: '13 linked SDLC docs' },
  { icon: GitBranch, label: 'Traceability', manual: 'Requirements drift apart', forge: 'BRD → FRD → RTM chain' },
  { icon: Bot, label: 'AI handoff', manual: 'One-off ChatGPT replies', forge: 'Structured dev prompts' },
  { icon: Wallet, label: 'Pricing', manual: 'Consultant or subscription', forge: 'Pay per generation' },
]

function ComparisonMatrix() {
  return (
    <div className="mt-6 space-y-2 md:hidden">
      {COMPARE_ROWS.map((row) => {
        const Icon = row.icon
        return (
          <div key={row.label} className="card-surface p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Icon className="icon-gradient h-4 w-4" />
              {row.label}
            </div>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded-xl bg-danger/5 p-2.5 text-chrome-muted">
                <X className="mt-0.5 h-3.5 w-3.5 shrink-0 text-danger" />
                {row.manual}
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 font-medium">
                <CheckCircle2 className="icon-gradient mt-0.5 h-3.5 w-3.5 shrink-0" />
                {row.forge}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ComparisonSection() {
  return (
    <section id="comparison" className={SECTION_PAD} aria-labelledby="comparison-heading">
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14">
          <Reveal className="lg:sticky lg:top-28">
            <p className="section-label">Why IdeaForge</p>
            <h2 id="comparison-heading" className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Manual specs vs{' '}
              <span className="gradient-text">IdeaForge</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-chrome-muted">
              Same idea. Different process. Completely different speed to ship.
            </p>

            <ul className="mt-8 space-y-3">
              {WINS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-chrome-muted">
                  <GradientIcon icon={CheckCircle2} size="md" className="shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary mt-10 inline-flex">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="hidden gap-4 md:grid md:grid-cols-2">
              <TraditionalPanel />
              <IdeaForgePanel />
            </div>

            <div className="hidden md:mt-8 md:grid md:grid-cols-2 md:gap-4">
              {COMPARE_ROWS.map((row) => {
                const Icon = row.icon
                return (
                  <div
                    key={row.label}
                    className="col-span-2 grid grid-cols-[auto_1fr_1fr] items-center gap-3 rounded-2xl border border-chrome-border/50 bg-chrome-elevated/40 px-4 py-3 text-sm"
                  >
                    <span className="flex items-center gap-2 font-semibold">
                      <Icon className="icon-gradient h-4 w-4" />
                      {row.label}
                    </span>
                    <span className="flex items-center gap-2 text-chrome-muted">
                      <X className="h-3.5 w-3.5 shrink-0 text-danger" />
                      {row.manual}
                    </span>
                    <span className="flex items-center gap-2 font-medium">
                      <CheckCircle2 className="icon-gradient h-3.5 w-3.5 shrink-0" />
                      {row.forge}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="md:hidden">
              <div className="grid gap-4">
                <TraditionalPanel />
                <div className="flex justify-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-xs font-medium text-chrome-muted">
                    VS
                  </div>
                </div>
                <IdeaForgePanel />
              </div>
              <ComparisonMatrix />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
