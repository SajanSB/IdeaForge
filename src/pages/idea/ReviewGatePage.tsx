import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useReviewStore } from '@/store/useReviewStore'
import { supabase } from '@/lib/supabase'
import { DocTree } from '@/components/document/DocTree'
import { MonoId } from '@/components/brand/AgentBadge'
import { Textarea } from '@/components/ui/textarea'
import { DOC_META } from '@/lib/flowConstants'
import { cn } from '@/lib/utils'

const BA_DOC_IDS = Object.keys(DOC_META).filter((k) => DOC_META[k].agent === 'BA')

const fieldClass =
  'rounded-lg border border-white/10 bg-white/[0.04] text-foreground placeholder:text-chrome-subtle transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/16'

const proseChrome =
  'prose prose-base prose-invert max-w-none prose-headings:scroll-mt-4 prose-headings:text-foreground prose-p:text-chrome-muted prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-chrome-muted prose-li:leading-relaxed prose-code:rounded prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/[0.04] prose-table:text-sm prose-th:text-foreground prose-td:text-chrome-muted'

export function ReviewGatePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { feedback, setFeedback, approve, status } = useReviewStore()
  const [docs, setDocs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('brd')
  const [isApproving, setIsApproving] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('documents')
      .select('doc_type, content')
      .eq('project_id', id)
      .in('doc_type', BA_DOC_IDS)
      .then(({ data }) => {
        const map: Record<string, string> = {}
        data?.forEach((d) => {
          map[d.doc_type] = d.content
        })
        setDocs(map)
        const first = BA_DOC_IDS.find((t) => map[t])
        if (first) setActiveTab(first)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (status === 'approved' || status === 'skipped') {
      navigate(`/idea/${id}/generating`, { replace: true })
    }
  }, [status, id, navigate])

  useEffect(() => {
    document.title = 'Review documents — IdeaForge'
  }, [])

  function handleApprove() {
    setIsApproving(true)
    setTimeout(() => {
      approve(feedback.trim())
      navigate(`/idea/${id}/generating`)
    }, 400)
  }

  const availableDocs = BA_DOC_IDS.filter((t) => docs[t])
  const activeMeta = DOC_META[activeTab]

  if (loading) {
    return (
      <div className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center">
        <div className="card-surface flex min-h-[320px] w-full items-center justify-center gap-2 p-8 text-chrome-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading documents…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="section-label">Document review</p>
            {id && <MonoId id={`PRJ-${id.slice(0, 8).toUpperCase()}`} />}
          </div>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Review BA documents
          </h1>
          <p className="mt-1 text-sm text-chrome-muted">
            {availableDocs.length} of 10 ready — read each document, then approve to continue.
          </p>
        </div>
        <button
          type="button"
          onClick={handleApprove}
          disabled={isApproving}
          className="btn-primary hidden shrink-0 sm:inline-flex"
        >
          {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve & continue'}
        </button>
      </div>

      <div className="callout callout-primary shrink-0 py-3">
        <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-chrome-muted" />
        <p className="text-sm">Optional feedback is passed to the UX Agent and Prompt Engineer.</p>
      </div>

      <div className="card-surface flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-white/10 p-4 lg:block xl:w-60">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-chrome-subtle">
            Documents
          </p>
          <DocTree
            activeDoc={activeTab}
            availableDocs={availableDocs}
            onSelect={setActiveTab}
            variant="chrome"
          />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="mb-3 overflow-x-auto lg:hidden">
              <div className="flex gap-2 pb-1">
                {availableDocs.map((docId) => {
                  const meta = DOC_META[docId]
                  const active = docId === activeTab
                  return (
                    <button
                      key={docId}
                      type="button"
                      onClick={() => setActiveTab(docId)}
                      className={cn(
                        'shrink-0 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-colors',
                        active
                          ? 'border-primary/30 bg-primary/10 text-foreground'
                          : 'border-white/10 text-chrome-muted hover:text-foreground',
                      )}
                    >
                      {meta.short}
                    </button>
                  )
                })}
              </div>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-wider text-chrome-subtle">
              {activeMeta?.short ?? activeTab}
            </p>
            <h2 className="mt-0.5 text-base font-semibold text-foreground sm:text-lg">
              {activeMeta?.name ?? activeTab}
            </h2>
          </div>

          <article
            className={cn(
              'styled-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10',
              proseChrome,
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs[activeTab] ?? ''}</ReactMarkdown>
          </article>
        </div>

        <aside className="flex w-full shrink-0 flex-col border-t border-white/10 bg-white/[0.02] p-4 sm:p-5 lg:w-72 lg:border-l lg:border-t-0 xl:w-80">
          <p className="text-xs font-medium text-chrome-muted">Feedback (optional)</p>
          <Textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Flag anything to correct in UX spec and dev prompt…"
            className={cn(fieldClass, 'mt-2 min-h-[120px] flex-1 resize-none text-sm lg:min-h-0')}
          />
          <button
            type="button"
            onClick={handleApprove}
            disabled={isApproving}
            className="btn-primary mt-4 w-full sm:hidden lg:inline-flex"
          >
            {isApproving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Approve & continue'}
          </button>
        </aside>
      </div>
    </div>
  )
}
