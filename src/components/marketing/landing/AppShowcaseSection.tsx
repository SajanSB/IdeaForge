import {
  Bot,
  Palette,
  Terminal,
  GitBranch,
  Shield,
  Download,
  Sparkles,
  FileCode2,
  Link2,
} from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { SECTION_PAD, GradientIconBox } from '@/components/marketing/shared'
import { DocumentPreview } from '@/components/marketing/DocumentPreview'
import { AgentPipeline, AgentPipelineLabel } from '@/components/marketing/AgentPipeline'

const AGENTS = [
  {
    title: 'Business Analyst',
    description: 'AI agent writes 10 sequential docs — BRD, FRD, SRS, stories, flows, RTM, and more.',
    icon: Bot,
    ring: 'border-white/10',
  },
  {
    title: 'UX Designer',
    description: 'AI agent produces a full UI/UX spec informed by every BA document.',
    icon: Palette,
    ring: 'border-white/10',
    highlight: true,
  },
  {
    title: 'Prompt Engineer',
    description: 'AI agent forges master dev prompt + sub-prompts for Cursor, Claude Code, or v0.',
    icon: Terminal,
    ring: 'border-white/10',
  },
]

const FEATURES = [
  { icon: GitBranch, label: 'Cross-linked by AI', desc: 'BRD traces to RTM — no drift' },
  { icon: FileCode2, label: 'Dev-ready output', desc: 'Markdown you paste into AI tools' },
  { icon: Shield, label: 'Pay at generation', desc: 'Free account · no charge until then' },
  { icon: Link2, label: 'Sequential context', desc: 'Each agent reads prior output' },
  { icon: Sparkles, label: '13-doc suite', desc: 'Full SDLC coverage in one run' },
  { icon: Download, label: 'Instant download', desc: 'All files ready in minutes' },
]

export function AppShowcaseSection() {
  return (
    <section
      id="showcase"
      className={`relative overflow-hidden bg-chrome-elevated/20 ${SECTION_PAD}`}
      aria-labelledby="showcase-heading"
    >
      <div className="ai-grid-bg pointer-events-none absolute inset-0 opacity-50" />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="section-label">AI agents at work</p>
          <h2 id="showcase-heading" className="section-title mt-3">
            One AI pipeline,{' '}
            <span className="gradient-text">thirteen documents</span>
          </h2>
          <p className="mt-4 text-chrome-muted">
            Three specialized AI agents run in sequence — each building on the last agent&apos;s
            output with full context.
          </p>
          <AgentPipeline className="mt-8" activeIndex={1} />
          <AgentPipelineLabel className="mt-3" />
        </Reveal>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <Reveal className="space-y-4">
            {AGENTS.map((agent) => {
              const Icon = agent.icon
              const isHighlight = 'highlight' in agent && agent.highlight
              return (
                <div
                  key={agent.title}
                  className={`card-surface flex gap-4 p-5 ${agent.ring} ${
                    isHighlight ? 'border-white/14' : ''
                  }`}
                >
                  <GradientIconBox icon={Icon} boxSize="lg" iconSize="md" className={agent.ring} />
                  <div>
                    <h3 className="font-bold">{agent.title}</h3>
                    <p className="mt-1 text-sm text-chrome-muted">{agent.description}</p>
                  </div>
                </div>
              )
            })}
          </Reveal>

          <Reveal delay={0.12}>
            <DocumentPreview variant="showcase" className="mx-auto w-[300px] sm:w-[340px]" />
          </Reveal>

          <Reveal className="space-y-4" delay={0.18}>
            {FEATURES.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="group flex items-start gap-3">
                  <GradientIconBox icon={Icon} boxSize="md" iconSize="sm" className="mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-chrome-muted">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </Reveal>
        </div>
      </div>
    </section>
  )
}
