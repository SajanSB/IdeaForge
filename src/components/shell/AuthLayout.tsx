import { Link } from 'react-router-dom'
import {
  FileText,
  Zap,
  Bot,
  GitBranch,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react'
import { AIBackground } from '@/components/marketing/AIBackground'
import { BrandLogoLink } from '@/components/marketing/shared'
import { DocTypeBadge } from '@/components/brand/AgentBadge'

const POINTS = [
  { icon: GitBranch, text: '13 cross-linked SDLC documents' },
  { icon: Bot, text: 'BA → UX → Prompt Engineer agents' },
  { icon: Clock, text: 'Full suite generated in under 15 minutes' },
  { icon: Shield, text: 'Sign in to create projects and generate' },
  { icon: Sparkles, text: 'Master dev prompt for Cursor & Claude Code' },
  { icon: FileText, text: 'BRD through RTM, ready to download' },
]

const STATS = [
  { icon: FileText, value: '13', label: 'SDLC docs' },
  { icon: Zap, value: '<15m', label: 'Per run' },
  { icon: Bot, value: '3', label: 'AI agents' },
]

const DOC_BADGES = [
  { label: 'BRD', agent: 'BA' as const },
  { label: 'FRD', agent: 'BA' as const },
  { label: 'SRS', agent: 'BA' as const },
  { label: 'UX', agent: 'UX' as const },
  { label: 'RTM', agent: 'BA' as const },
  { label: 'PROMPT', agent: 'PE' as const },
]

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <AIBackground variant="section" className="opacity-60" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-25" />

      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-5 sm:px-8">
        <BrandLogoLink />
        <Link
          to="/"
          className="text-sm text-chrome-muted transition-colors hover:text-foreground"
        >
          ← Back to home
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-8 sm:px-8">
        <div className="flex w-full max-w-6xl flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-14 xl:gap-20">
          {/* Brand panel */}
          <div className="hidden w-full lg:block lg:max-w-lg xl:max-w-xl">
            <p className="section-label">AI documentation forge</p>
            <h1 className="mt-3 text-balance text-2xl font-semibold leading-snug tracking-tight text-foreground xl:text-[2rem] xl:leading-tight">
              Enterprise SDLC docs, forged by AI.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-chrome-muted xl:text-base">
              Turn a raw product idea into thirteen linked documents — from business
              requirements through UI spec to a master dev prompt your AI tools can run
              on.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-3 text-center"
                  >
                    <Icon className="mx-auto h-4 w-4 text-chrome-subtle" />
                    <p className="mt-1.5 text-sm font-semibold tabular-nums text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-chrome-subtle">{stat.label}</p>
                  </div>
                )
              })}
            </div>

            <ul className="mt-6 space-y-2.5">
              {POINTS.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm text-chrome-muted">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-chrome-subtle" strokeWidth={1.75} />
                  {text}
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <p className="text-[10px] font-medium uppercase tracking-widest text-chrome-subtle">
                Included in every generation
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {DOC_BADGES.map((doc) => (
                  <DocTypeBadge key={doc.label} label={doc.label} agent={doc.agent} />
                ))}
                <span className="inline-flex items-center rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] font-semibold text-chrome-subtle">
                  +7 more
                </span>
              </div>
            </div>
          </div>

          {/* Form card */}
          <div className="w-full max-w-[400px] shrink-0 rounded-2xl border border-white/[0.08] bg-chrome-elevated/80 p-6 shadow-card backdrop-blur-sm sm:p-8 lg:sticky lg:top-8">
            {children}
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-6 pb-6 text-center text-xs text-chrome-subtle sm:pb-8">
        © {new Date().getFullYear()} IdeaForge
      </footer>
    </div>
  )
}
