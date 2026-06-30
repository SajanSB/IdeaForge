import { FileText, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { DocTypeBadge } from '@/components/brand/AgentBadge'
import { AILiveIndicator } from '@/components/marketing/AILiveIndicator'
import { GradientIcon } from '@/components/marketing/shared'
import { DOC_META } from '@/lib/flowConstants'

const DOC_ORDER = ['brd', 'frd', 'srs', 'bmp', 'usr', 'pfd', 'uc', 'dmd', 'uat', 'rtm', 'ux', 'prompt'] as const

type DocumentPreviewProps = {
  className?: string
  glow?: boolean
  variant?: 'hero' | 'showcase'
}

export function DocumentPreview({
  className = '',
  glow = true,
  variant = 'hero',
}: DocumentPreviewProps) {
  const isShowcase = variant === 'showcase'
  const docs = DOC_ORDER.map((key, i) => ({
    key,
    ...DOC_META[key],
    done: i < 7,
    active: i === 7,
  }))

  return (
    <div className={`relative ${className}`}>
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 -z-10 scale-110 rounded-3xl blur-3xl animate-pulse-glow"
          style={{
            background:
              'radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.06), transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}

      {isShowcase && (
        <div className="absolute -left-4 top-10 z-10 hidden floating-chip sm:block">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <GradientIcon icon={Loader2} size="sm" className="animate-spin" />
            Generating…
          </span>
        </div>
      )}

      <div
        className={`browser-frame mx-auto w-full ring-1 ring-white/[0.06] ${isShowcase ? 'max-w-[340px]' : 'max-w-[360px]'}`}
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-chrome-elevated px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-danger/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/80" />
          </div>
          <span className="flex flex-1 items-center justify-center gap-2 text-[10px] font-medium text-chrome-muted">
            IdeaForge
            <AILiveIndicator label={isShowcase ? 'AI generating' : 'AI pipeline'} />
          </span>
        </div>

        <div
          className={`relative flex bg-background text-left ${isShowcase ? 'min-h-[420px]' : 'min-h-[380px]'}`}
        >
          {isShowcase && <div className="ai-scan-line" aria-hidden />}
          <aside className="w-[36%] border-r border-white/5 bg-chrome-elevated/50 p-2.5 sm:p-3">
            <p className="mb-2 text-[9px] font-semibold uppercase tracking-widest text-chrome-muted">
              Documents
            </p>
            <ul className={`space-y-1 ${isShowcase ? 'max-h-[360px] overflow-y-auto scrollbar-none' : ''}`}>
              {docs.map((doc) => (
                <li
                  key={doc.key}
                  className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[9px] sm:text-[10px] ${
                    doc.key === 'brd'
                      ? 'bg-white/[0.08] text-foreground'
                      : doc.active
                        ? 'bg-white/[0.06] text-chrome-muted'
                        : 'text-chrome-muted'
                  }`}
                >
                  {doc.done ? (
                    <CheckCircle2 className="h-3 w-3 shrink-0 text-success" />
                  ) : doc.active ? (
                    <Loader2 className="h-3 w-3 shrink-0 animate-spin" />
                  ) : (
                    <Clock className="h-3 w-3 shrink-0 opacity-40" />
                  )}
                  <span className="truncate font-medium">{doc.short}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex-1 p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <DocTypeBadge label="BRD" agent="BA" />
              <span className="text-[9px] text-chrome-muted">v1.0 · Generated</span>
            </div>
            <h3 className="text-sm font-bold leading-tight">Business Requirements Document</h3>
            <p className="mt-2 text-[10px] leading-relaxed text-chrome-muted">1. Executive Summary</p>
            <p className="mt-1 text-[10px] leading-relaxed text-chrome-muted">
              This document defines the business requirements for…
            </p>

            <div className="mt-3 space-y-1.5">
              {[92, 78, 65, 88, 72].map((w, i) => (
                <div
                  key={i}
                  className="h-1.5 rounded-full bg-chrome-surface"
                  style={{ width: `${w}%` }}
                />
              ))}
            </div>

            {isShowcase && (
              <div className="mt-4 space-y-2">
                <p className="text-[9px] font-semibold uppercase tracking-widest text-chrome-muted">
                  Linked references
                </p>
                {['FRD §3.2', 'USR-014', 'RTM trace'].map((ref) => (
                  <div
                    key={ref}
                    className="rounded-lg bg-chrome-surface/60 px-2.5 py-1.5 text-[9px] font-mono text-primary"
                  >
                    → {ref}
                  </div>
                ))}
              </div>
            )}

            <div className="gradient-border mt-4 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <GradientIcon icon={FileText} size="sm" />
                <span className="text-[10px] font-semibold">
                  {isShowcase ? '7 of 13 complete' : '13 docs · cross-linked'}
                </span>
              </div>
            <p className="mt-1 text-[9px] text-chrome-muted">3 AI agents · sequential context</p>
              {isShowcase && (
                <div className="progress-track mt-2">
                  <div className="progress-fill" style={{ width: '54%' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isShowcase && (
        <div className="absolute -right-3 bottom-12 z-10 hidden floating-chip sm:block">
          <span className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            Cross-linked
          </span>
        </div>
      )}
    </div>
  )
}
