import { useState, useEffect, useRef } from 'react'
import { Calculator, ChevronDown } from 'lucide-react'
import { calcTokenEstimate, formatINR, DEFAULT_PRICING_CONFIG, estimatedQAQuestionCount } from '@/utils/estimateCalc'
import type { TokenEstimate, PricingConfig } from '@/utils/estimateCalc'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const DEBOUNCE_MS = 600

interface InlineEstimatePreviewProps {
  ideaText: string
  embedded?: boolean
}

const COMPLEXITY_BADGE: Record<string, string> = {
  Simple: 'bg-agent-ux/10 border-agent-ux/30 text-agent-ux',
  Medium: 'bg-primary/10 border-primary/30 text-primary',
  Complex: 'bg-destructive/10 border-destructive/30 text-destructive',
}

export function InlineEstimatePreview({ ideaText, embedded = false }: InlineEstimatePreviewProps) {
  const [estimate, setEstimate] = useState<TokenEstimate | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [pricing, setPricing] = useState<PricingConfig>(DEFAULT_PRICING_CONFIG)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pricingRef = useRef<PricingConfig>(DEFAULT_PRICING_CONFIG)

  useEffect(() => {
    supabase.from('pricing_config').select('*').eq('id', 'default').single()
      .then(({ data }) => {
        if (data) {
          const cfg: PricingConfig = {
            usdInrRate: Number(data.usd_inr_rate),
            platformFeeInr: Number(data.platform_fee_inr),
            gstRate: Number(data.gst_rate),
            bufferMultiplier: Number(data.buffer_multiplier),
          }
          setPricing(cfg)
          pricingRef.current = cfg
        }
      })
  }, [])

  useEffect(() => {
    if (ideaText.trim().length < 30) {
      setIsVisible(false)
      setEstimate(null)
      return
    }
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      try {
        const result = calcTokenEstimate('preview', ideaText, pricingRef.current)
        setEstimate(result)
        setIsVisible(true)
      } catch {
        setIsVisible(false)
      }
    }, DEBOUNCE_MS)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [ideaText, pricing])

  if (!isVisible || !estimate) return null

  const qaCount = estimatedQAQuestionCount(estimate.complexityLevel)
  const docGenCostInr = estimate.apiCostInr - estimate.qaApiCostInr

  return (
    <div
      className={cn(
        'overflow-hidden',
        embedded ? 'rounded-lg border border-white/10' : 'card-surface',
        expanded && (embedded ? 'border-white/14' : 'border-white/14'),
      )}
      role="region"
      aria-label="Live cost estimate"
    >
      <button
        type="button"
        onClick={() => setExpanded((p) => !p)}
        className={cn(
          'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors',
          expanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]',
        )}
      >
        <div className="flex items-center gap-2.5">
          <Calculator className={cn('h-3.5 w-3.5', expanded ? 'text-foreground' : 'text-chrome-muted')} />
          <span className="text-xs text-chrome-muted">Estimated cost</span>
          <span className={cn('rounded-full border px-2 py-0.5 font-mono text-[9px] font-semibold', COMPLEXITY_BADGE[estimate.complexityLevel])}>
            {estimate.complexityLevel.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold tabular-nums text-foreground">{formatINR(estimate.totalInr)}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-chrome-subtle transition-transform', expanded && 'rotate-180')} />
        </div>
      </button>
      {expanded && (
        <div className="space-y-2 border-t border-white/10 px-4 py-3 text-xs">
          {[
            { label: `Q&A (~${qaCount} questions)`, value: formatINR(estimate.qaApiCostInr) },
            { label: 'Document generation (12 docs)', value: formatINR(docGenCostInr) },
            { label: 'Platform fee', value: formatINR(estimate.platformFeeInr) },
            ...(estimate.gstInr > 0 ? [{ label: `GST (${Math.round(pricing.gstRate * 100)}%)`, value: formatINR(estimate.gstInr) }] : []),
          ].map((row) => (
            <div key={row.label} className="flex justify-between">
              <span className="text-chrome-muted">{row.label}</span>
              <span className="font-mono text-foreground">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-white/10 pt-2 font-medium">
            <span className="text-chrome-muted">Estimated maximum</span>
            <span className="font-mono text-foreground">{formatINR(estimate.totalInr)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
