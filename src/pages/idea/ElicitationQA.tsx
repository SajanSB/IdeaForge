import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Textarea } from '@/components/ui/textarea'
import { AgentBadge } from '@/components/brand/AgentBadge'
import { BrainCircuit, Send, RefreshCw, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Question = { question: string; options: string[] }
type TranscriptItem = { q: string; a?: string; skipped?: boolean; options?: string[] }

const fieldClass =
  'rounded-lg border border-white/10 bg-white/[0.04] text-foreground placeholder:text-chrome-subtle transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/16'

function TypingDots() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
        <BrainCircuit className="h-3.5 w-3.5 text-chrome-muted" />
      </div>
      <div className="flex gap-1.5 rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-1.5 w-1.5 rounded-full bg-chrome-muted"
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.16 }}
          />
        ))}
      </div>
    </div>
  )
}

export function ElicitationQA() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingQ, setLoadingQ] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [qIndex, setQIndex] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptItem[]>([])
  const [answer, setAnswer] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [savingAnswer, setSavingAnswer] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasFetchedRef = useRef(false)

  useEffect(() => {
    if (!id || hasFetchedRef.current) return
    hasFetchedRef.current = true

    const fetchQuestions = async () => {
      setLoadingQ(true)
      setFetchError(null)
      try {
        const { data: project, error: projErr } = await supabase
          .from('projects').select('idea_text, industry, tech_preference').eq('id', id).single()
        if (projErr || !project) throw new Error('Project not found')
        const ideaText = project.idea_text
        const industry = project.industry
        const techPreference = project.tech_preference

        const { data, error } = await supabase.functions.invoke('elicit-questions', {
          body: { project_id: id, idea_text: ideaText, industry, tech_preference: techPreference },
        })
        if (error) throw error
        const qs: Question[] = data.questions
        if (!Array.isArray(qs) || qs.length === 0) throw new Error('No questions returned')

        setQuestions(qs)
        setTimeout(() => {
          setTranscript([{ q: qs[0].question, options: qs[0].options }])
          setLoadingQ(false)
        }, 600)
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load questions')
        setLoadingQ(false)
      }
    }
    fetchQuestions()
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [transcript, isTyping])

  const handleSubmit = async (skipped = false) => {
    if (loadingQ || isTyping || savingAnswer) return
    if (!skipped && answer.trim() === '') return

    const currentQ = questions[qIndex]
    const finalAnswer = skipped ? '' : answer.trim()
    const updatedTranscript = transcript.map((item, i) =>
      i === qIndex ? { ...item, a: finalAnswer, skipped } : item
    )
    setTranscript(updatedTranscript)
    setAnswer('')
    setSavingAnswer(true)

    try {
      if (id) {
        await supabase.from('qa_responses').upsert({
          project_id: id, question: currentQ.question, answer: finalAnswer || null,
          skipped, order_index: qIndex,
        }, { onConflict: 'project_id,order_index' })
      }
    } catch { /* non-fatal */ } finally {
      setSavingAnswer(false)
    }

    const isLast = qIndex >= questions.length - 1
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      if (!isLast) {
        const nextQ = questions[qIndex + 1]
        setTranscript((prev) => [...prev, { q: nextQ.question, options: nextQ.options }])
        setQIndex((prev) => prev + 1)
        setTimeout(() => textareaRef.current?.focus(), 100)
      } else {
        if (id) sessionStorage.setItem(`qa_${id}`, JSON.stringify(updatedTranscript))
        navigate(`/idea/${id}/review`)
      }
    }, isLast ? 700 : 1300)
  }

  const totalCount = questions.length || 1
  const progress = loadingQ ? 0 : ((qIndex + 1) / totalCount) * 100
  const isInputDisabled = isTyping || loadingQ || savingAnswer

  if (loadingQ || fetchError) {
    return (
      <div className="w-full max-w-3xl">
        <div className="card-surface flex min-h-[360px] flex-col items-center justify-center gap-4 p-8 text-center">
          {fetchError ? (
            <>
              <p className="text-sm text-chrome-muted">{fetchError}</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="btn-secondary gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try again
              </button>
            </>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
                <BrainCircuit className="h-5 w-5 animate-pulse text-chrome-muted" />
              </div>
              <div>
                <p className="font-medium text-foreground">BA Agent is analysing your idea…</p>
                <p className="mt-1 text-sm text-chrome-subtle">Preparing clarifying questions</p>
              </div>
              <TypingDots />
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-3xl flex-col">
      <div className="mb-8">
        <p className="section-label">Business Analyst Q&A</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          Elicitation Q&A
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-chrome-muted">
          Answer clarifying questions so the BA agent can shape your requirements.
        </p>
      </div>

      <div className="card-surface flex min-h-[min(640px,calc(100vh-18rem))] flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <AgentBadge agent="BA" />
            <span className="text-xs text-chrome-muted">{isTyping ? 'Typing…' : 'Online'}</span>
          </div>
          <span className="font-mono text-sm text-foreground">
            {qIndex + 1} / {totalCount}
          </span>
        </div>

        <div className="h-1 bg-white/5">
          <motion.div
            className="h-full bg-primary/70"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="styled-scroll flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          <AnimatePresence initial={false}>
            {transcript.map((item, i) => (
              <motion.div key={i} className="space-y-3">
                <div className="flex max-w-[92%] items-end gap-2">
                  <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-relaxed text-foreground">
                    {item.q}
                  </div>
                </div>
                {i === qIndex && item.a === undefined && !isTyping && item.options && item.options.length > 0 && (
                  <div className="ml-1 flex flex-col gap-1.5">
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setAnswer(opt)}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-left text-xs transition-colors',
                          answer === opt
                            ? 'border-primary/30 bg-primary/10 text-foreground'
                            : 'border-white/10 text-chrome-muted hover:border-white/16 hover:text-foreground',
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {(item.a !== undefined || item.skipped) && (
                  <div className="flex justify-end">
                    <div className="max-w-[92%] rounded-2xl rounded-tr-sm border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-foreground">
                      {item.skipped ? (
                        <span className="italic text-chrome-muted">Skipped</span>
                      ) : (
                        item.a
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
            {isTyping && <TypingDots />}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>

        <div className="space-y-3 border-t border-white/10 bg-white/[0.02] p-4 sm:p-5">
          <Textarea
            ref={textareaRef}
            placeholder={isInputDisabled ? 'Waiting…' : 'Type your answer or pick an option above…'}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault()
                handleSubmit(false)
              }
            }}
            disabled={isInputDisabled}
            className={cn(fieldClass, 'min-h-[80px] resize-none text-sm')}
          />
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={isInputDisabled}
              className="text-xs text-chrome-muted transition-colors hover:text-foreground disabled:opacity-30"
            >
              Skip question
            </button>
            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={answer.trim() === '' || isInputDisabled}
              className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40"
            >
              {savingAnswer ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  {qIndex >= questions.length - 1 ? 'Finish' : 'Send'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
