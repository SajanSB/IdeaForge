import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ArrowRight, Loader2, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'

type QARow = { order_index?: number; question: string; answer: string | null; skipped: boolean }

const INDUSTRY_LABELS: Record<string, string> = {
  saas: 'SaaS',
  ecommerce: 'E-commerce',
  healthtech: 'HealthTech',
  edtech: 'EdTech',
  fintech: 'FinTech',
  other: 'Other',
}

export function IdeaReview() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ideaText, setIdeaText] = useState('')
  const [industry, setIndustry] = useState<string | null>(null)
  const [qa, setQa] = useState<QARow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      setLoading(true)
      const [{ data: proj, error: projErr }, { data: qaRows }] = await Promise.all([
        supabase.from('projects').select('idea_text, industry, tech_preference').eq('id', id).single(),
        supabase.from('qa_responses').select('order_index, question, answer, skipped').eq('project_id', id).order('order_index'),
      ])
      if (projErr || !proj) setError('Could not load project.')
      else {
        setIdeaText(proj.idea_text)
        setIndustry(proj.industry)
        setQa(qaRows ?? [])
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="w-full max-w-3xl">
        <div className="card-surface flex min-h-[280px] items-center justify-center gap-2 p-8 text-chrome-muted">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading review…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-3xl">
        <div className="card-surface space-y-4 p-8 text-center">
          <p className="text-sm text-chrome-muted">{error}</p>
          <button type="button" onClick={() => navigate('/idea/new')} className="btn-secondary">
            Start new project
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <p className="section-label">Review</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          Confirm your inputs
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-chrome-muted">
          Check your idea and Q&A answers before moving to the cost estimate.
        </p>
      </div>

      <div className="card-surface space-y-4 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-chrome-subtle">Your idea</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">Project summary</h2>
          </div>
          {industry && (
            <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] text-chrome-muted">
              {INDUSTRY_LABELS[industry] ?? industry}
            </span>
          )}
        </div>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-chrome-muted">{ideaText}</p>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-8">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-chrome-subtle">Q&A transcript</p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              {qa.length} {qa.length === 1 ? 'answer' : 'answers'}
            </h2>
          </div>
          <Link
            to={`/idea/${id}/elicitation`}
            className="inline-flex shrink-0 items-center gap-1.5 text-xs text-chrome-muted transition-colors hover:text-foreground"
          >
            <Pencil className="h-3 w-3" />
            Edit answers
          </Link>
        </div>

        <div className="styled-scroll max-h-[420px] space-y-0 overflow-y-auto px-6 py-2 sm:px-8">
          {qa.length === 0 ? (
            <p className="py-8 text-center text-sm text-chrome-subtle">No answers recorded yet.</p>
          ) : (
            qa.map((row, i) => (
              <div
                key={i}
                className={cn(
                  'border-b border-white/10 py-4 last:border-0',
                )}
              >
                <p className="mb-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-agent-ba">
                  Q{i + 1}
                </p>
                <p className="mb-2 text-sm leading-relaxed text-foreground">{row.question}</p>
                <p className="text-sm text-chrome-muted">
                  {row.skipped ? (
                    <span className="italic text-chrome-subtle">Skipped</span>
                  ) : (
                    row.answer || '—'
                  )}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[0.02] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p className="text-xs text-chrome-subtle">Next: generation cost estimate</p>
          <button
            type="button"
            onClick={() => navigate(`/idea/${id}/estimate`)}
            className="btn-primary w-full sm:w-auto"
          >
            Continue to estimate
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
