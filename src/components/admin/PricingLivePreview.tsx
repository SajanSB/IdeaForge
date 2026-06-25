import { useMemo } from 'react'
import { calcTokenEstimate } from '@/utils/estimateCalc'
import { formatINR }         from '@/utils/estimateCalc'

interface PricingLivePreviewProps {
  marginPct:        number
  bufferMultiplier: number
  gstEnabled:       boolean
  usdInrRate:       number
}

const SAMPLE_IDEA = 'A task management SaaS for freelancers with client portal, invoice generation, time tracking, and Razorpay payment collection.'

export function PricingLivePreview({ marginPct, bufferMultiplier, gstEnabled, usdInrRate }: PricingLivePreviewProps) {
  const estimate = useMemo(() => {
    try {
      return calcTokenEstimate('preview', SAMPLE_IDEA, {
        model:             'claude-sonnet-4-6',
        bufferMultiplier,
        platformMarginPct: marginPct,
        usdInrRate,
        gstPct:            gstEnabled ? 18 : 0,
      })
    } catch { return null }
  }, [marginPct, bufferMultiplier, gstEnabled, usdInrRate])

  if (!estimate) {
    return (
      <p className="text-[12px] text-red-600 font-sans">
        Invalid configuration — cannot calculate preview.
      </p>
    )
  }

  return (
    <div className="bg-[#FAEEDA] border border-[0.5px] border-[#EF9F27] rounded-xl p-4 space-y-3">
      <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#633806] font-sans">
        Live price preview — medium complexity idea
      </p>
      <div className="space-y-1.5">
        {[
          { label: 'Anthropic API cost',  value: formatINR(estimate.apiCostInr)      },
          { label: `Platform fee (${marginPct}%)`, value: formatINR(estimate.platformFeeInr) },
          { label: `GST (${gstEnabled ? '18' : '0'}%)`, value: formatINR(estimate.gstInr) },
        ].map(row => (
          <div key={row.label} className="flex justify-between text-[12px] font-sans">
            <span className="text-[#633806]">{row.label}</span>
            <span className="font-mono text-[#633806] font-medium">{row.value}</span>
          </div>
        ))}
        <div className="flex justify-between pt-2 border-t border-[#EF9F27]">
          <span className="text-[14px] font-medium text-[#0F0F0F] font-sans">Total</span>
          <span className="text-[22px] font-medium text-[#BA7517] font-sans tabular-nums tracking-[-0.3px]">
            {formatINR(estimate.totalInr)}
          </span>
        </div>
      </div>
      <p className="text-[11px] text-[#854F0B] font-sans">
        ~{Math.round((estimate.bufferedInputTokens + estimate.bufferedOutputTokens) / 1000)}K tokens incl. {bufferMultiplier}× buffer
      </p>
    </div>
  )
}
