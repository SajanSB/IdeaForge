import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useProjectStore } from '@/store/useProjectStore'
import { useEstimateStore, DEFAULT_CONFIG } from '@/store/useEstimateStore'
import { type PricingConfig } from '@/utils/estimateCalc'
import { supabase } from '@/lib/supabase'
import { AgentBadge } from '@/components/brand/AgentBadge'
import { Zap, ShieldCheck, CreditCard, ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

function agentType(agent: string): 'BA' | 'UX' | 'PE' {
  if (agent === 'UX Agent') return 'UX'
  if (agent === 'Prompt Engineer') return 'PE'
  return 'BA'
}

const COMPLEXITY_STYLE = {
  Simple: 'text-agent-ux bg-agent-ux/10 border-agent-ux/25',
  Medium: 'text-primary bg-primary/10 border-primary/25',
  Complex: 'text-destructive bg-destructive/10 border-destructive/25',
}

function fmtK(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

function fmtInr(n: number) {
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function TokenEstimate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addProject } = useProjectStore()
  const { toast } = useToast()

  const [gateway, setGateway] = useState<'razorpay' | 'stripe'>('razorpay')
  const [isProcessing, setIsProcessing] = useState(false)
  const [ready, setReady] = useState(false)
  const [ideaSummary, setIdeaSummary] = useState('')

  const {
    complexityLevel,
    documents,
    bufferedInputTokens,
    bufferedOutputTokens,
    apiCostInr,
    platformFeeInr,
    gstInr,
    totalInr,
    config,
    calculateWithConfig,
  } = useEstimateStore()

  useEffect(() => {
    const run = async () => {
      if (!id) return
      const [{ data: pricing }, { data: project }] = await Promise.all([
        supabase.from('pricing_config').select('*').eq('id', 'default').single(),
        supabase.from('projects').select('idea_text, complexity').eq('id', id).single(),
      ])

      const cfg: PricingConfig = pricing
        ? {
            usdInrRate: Number(pricing.usd_inr_rate),
            platformFeeInr: Number(pricing.platform_fee_inr),
            gstRate: Number(pricing.gst_rate),
            bufferMultiplier: Number(pricing.buffer_multiplier),
          }
        : DEFAULT_CONFIG

      const ideaText = project?.idea_text ?? ''
      setIdeaSummary(ideaText)
      calculateWithConfig(ideaText, cfg, project?.complexity ?? undefined)
      setReady(true)
    }
    if (id) run()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const triggerPayment = () => {
    setIsProcessing(true)
    toast({
      title: 'Opening checkout…',
      description: `${gateway === 'razorpay' ? 'Razorpay' : 'Stripe'}`,
    })
    setTimeout(() => {
      toast({ title: 'Payment confirmed', description: 'Generation starting.' })
      addProject({
        id: id ?? `proj-${Date.now()}`,
        ideaText: ideaSummary || 'Untitled',
        status: 'generating',
        qaTranscript: [],
        documents: {},
        createdAt: new Date().toISOString(),
      })
      setIsProcessing(false)
      navigate(`/idea/${id}/generating`)
    }, 2000)
  }

  if (!ready) {
    return (
      <div className="w-full max-w-3xl">
        <div className="card-surface flex min-h-[280px] flex-col items-center justify-center gap-3 p-8 text-chrome-muted">
          <Loader2 className="h-6 w-6 animate-spin text-foreground" />
          <p className="text-sm">Calculating estimate…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl space-y-6">
      <div>
        <p className="section-label">Estimate</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          Generation estimate
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-chrome-muted">
          Maximum charge — actual cost may be lower based on real API usage.
        </p>
      </div>

      {ideaSummary && (
        <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-chrome-muted line-clamp-2">
          {ideaSummary}
        </div>
      )}

      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-chrome-muted" />
            <span className="text-sm font-medium text-foreground">Token breakdown</span>
          </div>
          <span
            className={cn(
              'rounded-full border px-2 py-0.5 font-mono text-[10px] font-semibold',
              COMPLEXITY_STYLE[complexityLevel],
            )}
          >
            {complexityLevel.toUpperCase()}
          </span>
        </div>

        <div className="styled-scroll overflow-x-auto px-6 py-4 sm:px-8">
          <table className="w-full min-w-[480px] text-xs">
            <thead>
              <tr className="border-b border-white/10 text-chrome-subtle">
                <th className="py-2 text-left font-mono uppercase tracking-wider">Document</th>
                <th className="py-2 text-left">Agent</th>
                <th className="py-2 text-right">Tokens</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id} className="border-b border-white/5">
                  <td className="py-3 text-foreground">
                    <span className="mr-2 font-mono text-[10px] text-chrome-subtle">{doc.shortCode}</span>
                    {doc.name}
                  </td>
                  <td className="py-3">
                    <AgentBadge agent={agentType(doc.agent)} />
                  </td>
                  <td className="py-3 text-right font-mono text-chrome-muted">
                    {fmtK(doc.inputTokens + doc.outputTokens)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-mono text-[11px] text-foreground">
                <td colSpan={2} className="pt-4">
                  With {config.bufferMultiplier}× buffer
                </td>
                <td className="pt-4 text-right">{fmtK(bufferedInputTokens + bufferedOutputTokens)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 sm:px-8">
          <span className="text-[10px] font-medium uppercase tracking-widest text-chrome-subtle">Checkout</span>
          <ShieldCheck className="h-4 w-4 text-chrome-muted" />
        </div>

        <div className="space-y-4 px-6 py-5 sm:px-8">
          {[
            { label: 'API cost', value: fmtInr(apiCostInr) },
            { label: 'Platform fee', value: fmtInr(platformFeeInr) },
            ...(gstInr > 0
              ? [{ label: `GST (${Math.round(config.gstRate * 100)}%)`, value: fmtInr(gstInr) }]
              : []),
          ].map((row) => (
            <div key={row.label} className="flex justify-between text-sm">
              <span className="text-chrome-muted">{row.label}</span>
              <span className="font-mono text-foreground">{row.value}</span>
            </div>
          ))}

          <div className="flex items-end justify-between border-t border-white/10 pt-4">
            <span className="text-sm font-semibold text-foreground">Maximum</span>
            <span className="font-mono text-2xl font-semibold tabular-nums text-foreground">
              {fmtInr(totalInr)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(['razorpay', 'stripe'] as const).map((gw) => (
              <button
                key={gw}
                type="button"
                onClick={() => setGateway(gw)}
                className={cn(
                  'rounded-lg border py-2.5 font-mono text-xs capitalize transition-colors',
                  gateway === gw
                    ? 'border-primary/30 bg-primary/10 text-foreground'
                    : 'border-white/10 text-chrome-muted hover:border-white/16 hover:text-foreground',
                )}
              >
                {gw}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 bg-white/[0.02] px-6 py-5 sm:px-8">
          <button
            type="button"
            onClick={triggerPayment}
            disabled={isProcessing}
            className="btn-primary w-full"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <CreditCard className="h-4 w-4" />
                Pay & Generate
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          <p className="mt-3 text-center text-[11px] text-chrome-subtle">
            Secure payment via {gateway === 'razorpay' ? 'Razorpay' : 'Stripe'}
          </p>
        </div>
      </div>
    </div>
  )
}
