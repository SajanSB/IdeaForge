import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { CheckCircle2, Circle, Loader2, ClipboardCheck, AlertCircle } from 'lucide-react'
import { useProjectStore } from '@/store/useProjectStore'
import { useReviewStore } from '@/store/useReviewStore'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { AgentPipeline } from '@/components/flow/AgentPipeline'
import { AgentBadge } from '@/components/brand/AgentBadge'
import { DOC_META } from '@/lib/flowConstants'
import { cn } from '@/lib/utils'

const BA_DOCS = Object.keys(DOC_META).filter((k) => DOC_META[k].agent === 'BA')
const UX_PE_DOCS = Object.keys(DOC_META).filter((k) => DOC_META[k].agent !== 'BA')
const ALL_DOCS = [...BA_DOCS, ...UX_PE_DOCS]

export function GenerationProgress() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateCurrentProject } = useProjectStore()
  const { toast } = useToast()
  const { phase, status: reviewStatus, markBAComplete, markDone } = useReviewStore()

  const resumeFromUXPE = phase === 'ux_pe' || reviewStatus === 'approved' || reviewStatus === 'skipped'
  const [completedIds, setCompletedIds] = useState<string[]>(() => (resumeFromUXPE ? BA_DOCS : []))
  const [generationStarted, setGenerationStarted] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const navigatedToReview = useRef(false)

  useEffect(() => {
    if (!id) return
    supabase
      .from('documents')
      .select('doc_type')
      .eq('project_id', id)
      .then(({ data }) => {
        if (data?.length) {
          setCompletedIds((prev) => {
            const s = new Set(prev)
            data.forEach((d) => s.add(d.doc_type))
            return [...s]
          })
        }
      })
  }, [id])

  useEffect(() => {
    if (!id) return
    const channel = supabase
      .channel(`documents-${id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'documents', filter: `project_id=eq.${id}` },
        (p) => setCompletedIds((prev) => (prev.includes(p.new.doc_type) ? prev : [...prev, p.new.doc_type])),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'documents', filter: `project_id=eq.${id}` },
        (p) => setCompletedIds((prev) => (prev.includes(p.new.doc_type) ? prev : [...prev, p.new.doc_type])),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [id])

  const startGeneration = useCallback(async () => {
    if (generationStarted || !id) return
    setGenerationStarted(true)
    setGenError(null)
    const docsToGenerate = resumeFromUXPE ? UX_PE_DOCS : BA_DOCS
    for (const docId of docsToGenerate) {
      try {
        const { error } = await supabase.functions.invoke('generate-documents', {
          body: { project_id: id, doc_type: docId },
        })
        if (error) {
          setGenError(`Failed on ${DOC_META[docId]?.name}.`)
          return
        }
      } catch {
        setGenError(`Could not generate ${DOC_META[docId]?.name}.`)
        return
      }
    }
  }, [id, generationStarted, resumeFromUXPE])

  useEffect(() => {
    if (!generationStarted) {
      const t = setTimeout(startGeneration, 800)
      return () => clearTimeout(t)
    }
  }, [generationStarted, startGeneration])

  useEffect(() => {
    const baComplete = BA_DOCS.every((d) => completedIds.includes(d))
    const allComplete = ALL_DOCS.every((d) => completedIds.includes(d))
    if (baComplete && !resumeFromUXPE && !navigatedToReview.current) {
      navigatedToReview.current = true
      markBAComplete()
      setTimeout(() => navigate(`/idea/${id}/review-docs`), 800)
      return
    }
    if (allComplete) {
      markDone()
      updateCurrentProject({ status: 'complete' })
      toast({ title: 'Generation complete!', description: 'All documents are ready.' })
      setTimeout(() => navigate(`/idea/${id}/documents`), 1000)
    }
  }, [completedIds, resumeFromUXPE, id, navigate, markBAComplete, markDone, updateCurrentProject, toast])

  const progressPercent = Math.round((completedIds.length / ALL_DOCS.length) * 100)
  const baComplete = BA_DOCS.every((d) => completedIds.includes(d))
  const allComplete = ALL_DOCS.every((d) => completedIds.includes(d))
  const reviewApproved = reviewStatus === 'approved' || reviewStatus === 'skipped'
  const reviewWaiting = baComplete && !reviewApproved && !resumeFromUXPE

  const activeAgent = completedIds.includes('prompt')
    ? ('PE' as const)
    : completedIds.includes('ux')
      ? ('PE' as const)
      : baComplete && reviewApproved
        ? ('UX' as const)
        : ('BA' as const)

  const completedAgents: Array<'BA' | 'UX' | 'PE'> = []
  if (BA_DOCS.every((d) => completedIds.includes(d))) completedAgents.push('BA')
  if (completedIds.includes('ux')) completedAgents.push('UX')
  if (completedIds.includes('prompt')) completedAgents.push('PE')

  const title = allComplete
    ? 'All documents ready!'
    : reviewWaiting
      ? 'Awaiting your review'
      : 'Generating documents'

  const description = genError
    ? 'Generation paused — see details below.'
    : allComplete
      ? 'Redirecting to your documents…'
      : 'Keep this tab open while agents work.'

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <p className="section-label">Generate</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-chrome-muted">{description}</p>
      </div>

      {genError && (
        <div className="callout callout-danger">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <p>{genError}</p>
        </div>
      )}

      {reviewWaiting && (
        <div className="callout callout-primary">
          <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-chrome-muted" />
          <p>BA documents are ready — review them before UX and Prompt Engineer agents continue.</p>
        </div>
      )}

      <div className="card-surface space-y-5 p-6 sm:p-8">
        <div className="flex items-center justify-between text-xs font-mono text-chrome-muted">
          <span>Overall progress</span>
          <span className="text-foreground">{progressPercent}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="h-full rounded-full bg-primary/70"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
        <AgentPipeline activeAgent={activeAgent} completedAgents={completedAgents} />
      </div>

      <div className="card-surface overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4 sm:px-8">
          <p className="text-[10px] font-medium uppercase tracking-widest text-chrome-subtle">Documents</p>
          <h2 className="mt-1 text-lg font-semibold text-foreground">Generation status</h2>
        </div>
        <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5">
          {ALL_DOCS.map((docId, index) => {
            const done = completedIds.includes(docId)
            const current = index === completedIds.length && !done
            const meta = DOC_META[docId]
            return (
              <div
                key={docId}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-4 py-3 transition-all',
                  current
                    ? 'border-primary/30 bg-primary/5'
                    : done
                      ? 'border-white/10 bg-white/[0.02]'
                      : 'border-white/10 opacity-40',
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                ) : current ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin text-foreground" />
                ) : (
                  <Circle className="h-4 w-4 shrink-0 text-chrome-subtle" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-foreground">{meta.name}</p>
                  <AgentBadge agent={meta.agent} className="mt-1" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
