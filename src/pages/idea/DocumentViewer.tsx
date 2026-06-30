import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Download, Copy, Check, Loader2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { DocTree } from '@/components/document/DocTree'
import { MonoId } from '@/components/brand/AgentBadge'
import { DOC_META } from '@/lib/flowConstants'
import { cn } from '@/lib/utils'

const proseChrome =
  'prose prose-base prose-invert max-w-none prose-headings:scroll-mt-4 prose-headings:text-foreground prose-p:text-chrome-muted prose-p:leading-relaxed prose-strong:text-foreground prose-li:text-chrome-muted prose-li:leading-relaxed prose-code:rounded prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-pre:border prose-pre:border-white/10 prose-pre:bg-white/[0.04] prose-table:text-sm prose-th:text-foreground prose-td:text-chrome-muted'

export function DocumentViewer() {
  const { id } = useParams<{ id: string }>()
  const { toast } = useToast()
  const [docs, setDocs] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [activeDoc, setActiveDoc] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = 'Your documents — IdeaForge'
  }, [])

  useEffect(() => {
    if (!id) return
    supabase
      .from('documents')
      .select('doc_type, content')
      .eq('project_id', id)
      .then(({ data, error }) => {
        if (error) {
          toast({ title: 'Failed to load documents', description: error.message, variant: 'destructive' })
          setLoading(false)
          return
        }
        const map: Record<string, string> = {}
        data?.forEach((d) => {
          map[d.doc_type] = d.content
        })
        setDocs(map)
        const first = Object.keys(DOC_META).find((k) => map[k])
        if (first) setActiveDoc(first)
        setLoading(false)
      })
  }, [id, toast])

  const docKeys = Object.keys(DOC_META).filter((k) => docs[k])
  const meta = DOC_META[activeDoc]

  const handleDownload = () => {
    const content = docs[activeDoc] ?? ''
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeDoc}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadAll = () => {
    docKeys.forEach((key) => {
      const blob = new Blob([docs[key] ?? ''], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${key}.md`
      a.click()
      URL.revokeObjectURL(url)
    })
    toast({ title: 'Downloaded all documents' })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(docs[activeDoc] ?? '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ title: 'Copied to clipboard' })
    })
  }

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

  if (docKeys.length === 0) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="card-surface space-y-4 p-8 text-center">
          <p className="text-sm text-chrome-muted">No documents found for this project.</p>
          {id && (
            <Link to={`/idea/${id}/generating`} className="btn-secondary inline-flex text-sm">
              Back to generation
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col gap-3 overflow-hidden">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <p className="section-label">Complete</p>
            {id && <MonoId id={`PRJ-${id.slice(0, 8).toUpperCase()}`} />}
          </div>
          <h1 className="mt-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Your documents
          </h1>
          <p className="mt-1 text-sm text-chrome-muted">
            {docKeys.length} documents generated — read, copy, or export as Markdown.
          </p>
        </div>
        <button type="button" onClick={handleDownloadAll} className="btn-secondary hidden shrink-0 sm:inline-flex">
          <Download className="h-4 w-4" />
          Export all
        </button>
      </div>

      <div className="card-surface flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-white/10 p-4 lg:block xl:w-60">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-widest text-chrome-subtle">
            Documents
          </p>
          <DocTree
            activeDoc={activeDoc}
            availableDocs={docKeys}
            completedDocs={docKeys}
            onSelect={setActiveDoc}
            variant="chrome"
          />
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 border-b border-white/10 px-4 py-3 sm:px-6">
            <div className="mb-3 overflow-x-auto lg:hidden">
              <div className="flex gap-2 pb-1">
                {docKeys.map((docId) => {
                  const docMeta = DOC_META[docId]
                  const active = docId === activeDoc
                  return (
                    <button
                      key={docId}
                      type="button"
                      onClick={() => setActiveDoc(docId)}
                      className={cn(
                        'shrink-0 rounded-lg border px-3 py-1.5 font-mono text-[11px] transition-colors',
                        active
                          ? 'border-primary/30 bg-primary/10 text-foreground'
                          : 'border-white/10 text-chrome-muted hover:text-foreground',
                      )}
                    >
                      {docMeta.short}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase tracking-wider text-chrome-subtle">
                  {meta?.short ?? activeDoc}
                </p>
                <h2 className="mt-0.5 truncate text-base font-semibold text-foreground sm:text-lg">
                  {meta?.name ?? activeDoc}
                </h2>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn-secondary px-3 py-2 text-xs"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-success" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  Copy
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn-secondary px-3 py-2 text-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  .md
                </button>
              </div>
            </div>
          </div>

          <article
            className={cn(
              'styled-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10',
              proseChrome,
            )}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{docs[activeDoc] ?? ''}</ReactMarkdown>
          </article>
        </div>
      </div>

      <div className="flex shrink-0 sm:hidden">
        <button type="button" onClick={handleDownloadAll} className="btn-secondary w-full">
          <Download className="h-4 w-4" />
          Export all documents
        </button>
      </div>
    </div>
  )
}
