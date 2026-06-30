import {
  HelpCircle,
  CalendarX,
  Unlink,
  FileQuestion,
  MessageSquareWarning,
  FolderOpen,
} from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { Callout, SECTION_PAD } from '@/components/marketing/shared'

const PAIN_POINTS = [
  {
    icon: HelpCircle,
    title: 'The idea stays vague',
    description: 'You know what you want to build — but not what belongs in a BRD, FRD, or user story.',
  },
  {
    icon: CalendarX,
    title: 'Weeks disappear into docs',
    description: 'Templates, rewrites, and handoffs eat momentum before a single feature ships.',
  },
  {
    icon: Unlink,
    title: 'Nothing connects',
    description: 'Wireframes, notes, and requirements drift apart. AI tools get fragments, not a system.',
  },
]

function DocumentationChaosPreview() {
  const files = [
    { name: 'idea-v3-final.docx', status: 'stale' as const },
    { name: 'wireframes-old.fig', status: 'stale' as const },
    { name: 'NOTES.txt', status: 'active' as const },
    { name: 'BRD-template-empty.docx', status: 'missing' as const },
    { name: 'srs-draft???.md', status: 'stale' as const },
  ]

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -left-3 top-6 z-10 hidden floating-chip sm:block">
        <span className="flex items-center gap-2 text-xs font-semibold text-danger">
          <FileQuestion className="h-3.5 w-3.5" />
          No single source of truth
        </span>
      </div>

      <div className="card-surface overflow-hidden border-danger/20 p-5 shadow-card md:p-6">
        <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-3">
          <FolderOpen className="h-4 w-4 text-chrome-muted" />
          <span className="text-xs font-semibold uppercase tracking-widest text-chrome-muted">
            project-kickoff/
          </span>
        </div>

        <ul className="space-y-2">
          {files.map((file) => (
            <li
              key={file.name}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs ${
                file.status === 'active'
                  ? 'border border-primary/25 bg-primary/10 text-primary'
                  : file.status === 'missing'
                    ? 'border border-dashed border-danger/40 bg-danger/5 text-danger'
                    : 'bg-chrome-surface/60 text-chrome-muted line-through decoration-danger/50'
              }`}
            >
              <span className="font-mono">{file.name}</span>
              {file.status === 'active' && (
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-bold">
                  only copy
                </span>
              )}
              {file.status === 'missing' && (
                <span className="text-[10px] font-bold">empty</span>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-5 rounded-2xl border border-danger/25 bg-danger/5 p-4">
          <div className="flex items-start gap-3">
            <MessageSquareWarning className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
            <div className="min-w-0 text-left">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-chrome-muted">
                Cursor · just now
              </p>
              <p className="mt-1 text-sm font-medium">
                What&apos;s the auth flow in the FRD?
              </p>
              <p className="mt-2 text-xs text-danger">
                No FRD in context. Upload specs or describe requirements manually.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-[10px] text-chrome-muted">
            <span>Documentation progress</span>
            <span className="font-semibold text-danger">Week 3 of ???</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                className={`h-6 flex-1 rounded-sm ${
                  i < 5 ? 'bg-success/25' : i < 12 ? 'bg-warning/35' : 'bg-danger/45'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-[10px] text-chrome-muted">
            Still writing the BRD. Code hasn&apos;t started.
          </p>
        </div>
      </div>

      <div className="absolute -right-2 bottom-8 z-10 hidden floating-chip sm:block">
        <span className="text-xs font-semibold text-chrome-muted">Sound familiar?</span>
      </div>
    </div>
  )
}

export function ProblemSection() {
  return (
    <section className={SECTION_PAD} aria-labelledby="problem-heading">
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-30" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="section-label">The problem</p>
            <h2 id="problem-heading" className="mt-3 text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              Great ideas die in{' '}
              <span className="text-danger">documentation debt</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-chrome-muted">
              When specs live in your head or scattered files, every build becomes a gamble.
              That&apos;s not a talent problem — it&apos;s a framing problem.
            </p>

            <ul className="mt-10 space-y-6">
              {PAIN_POINTS.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.title} className="flex gap-4">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-danger/10 text-danger">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-chrome-muted">
                        {item.description}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>

            <Callout icon={FileQuestion} tone="danger" className="mt-8">
              Founders don&apos;t fail on vision — they fail when documentation never
              catches up enough to guide the build.
            </Callout>
          </Reveal>

          <Reveal delay={0.12}>
            <DocumentationChaosPreview />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
