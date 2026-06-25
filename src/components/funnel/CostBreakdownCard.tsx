import { useState } from 'react'
import { IconInfoCircle, IconX } from '@tabler/icons-react'
import { formatINR, formatTokenCount } from '@/utils/estimateCalc'
import type { TokenEstimate } from '@/types/estimate'
import { cn } from '@/utils/cn'

interface CostBreakdownCardProps {
  estimate: TokenEstimate
}

const COMPLEXITY_LABELS: Record<string, string> = {
  simple:  'Simple',
  medium:  'Medium',
  complex: 'Complex',
}

export function CostBreakdownCard({ estimate }: CostBreakdownCardProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const totalTokens = estimate.bufferedInputTokens + estimate.bufferedOutputTokens

  return (
    <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden">

      {/* Card header — model + token info */}
      <div className="px-5 py-4 border-b border-[0.5px] border-border bg-[#F7F5F0]">
        <div className="flex items-center flex-wrap gap-2 mb-1.5">
          {/* Model badge */}
          <span className="font-mono text-[11px] font-medium bg-[#FAEEDA] text-[#BA7517] px-2.5 py-1 rounded-md">
            {estimate.model}
          </span>
          {/* Complexity badge */}
          <span className={cn(
            'text-[11px] font-medium px-2 py-0.5 rounded-full border border-[0.5px]',
            estimate.complexityLevel === 'simple'  && 'bg-[#EAF3DE] border-green-200  text-[#27500A]',
            estimate.complexityLevel === 'medium'  && 'bg-[#E6F1FB] border-blue-200   text-[#0C447C]',
            estimate.complexityLevel === 'complex' && 'bg-[#FAEEDA] border-[#EF9F27] text-[#633806]',
          )}>
            {COMPLEXITY_LABELS[estimate.complexityLevel]} idea
          </span>
        </div>
        {/* Token summary */}
        <p className="text-[12px] font-mono text-[#6B7280]">
          ~{formatTokenCount(totalTokens)} tokens
          <span className="ml-1.5 text-[#6B7280]/70">
            (incl. {estimate.usdInrRate > 0 ? `${estimate.complexityLevel === 'simple' ? '~5' : estimate.complexityLevel === 'medium' ? '~10' : '~18'} modules, ` : ''}{(((estimate.bufferedInputTokens / estimate.rawInputTokens) - 1) * 100).toFixed(0)}% safety buffer)
          </span>
        </p>
      </div>

      {/* Cost breakdown table */}
      <div className="px-5 py-5">
        <table className="w-full" aria-label="Generation cost breakdown">
          <caption className="sr-only">Generation cost breakdown in Indian Rupees</caption>
          <tbody className="space-y-0">

            {/* API cost */}
            <tr className="flex items-center justify-between py-2.5 border-b border-[0.5px] border-border">
              <td className="text-[14px] text-[#6B7280] font-sans">
                Anthropic API cost
              </td>
              <td className="text-[14px] font-medium text-[#0F0F0F] font-sans tabular-nums">
                {formatINR(estimate.apiCostInr)}
              </td>
            </tr>

            {/* Platform fee */}
            <tr className="flex items-center justify-between py-2.5 border-b border-[0.5px] border-border">
              <td className="text-[14px] text-[#6B7280] font-sans">
                Platform fee
              </td>
              <td className="text-[14px] font-medium text-[#0F0F0F] font-sans tabular-nums">
                {formatINR(estimate.platformFeeInr)}
              </td>
            </tr>

            {/* GST */}
            <tr className="flex items-center justify-between py-2.5 border-b border-[0.5px] border-border">
              <td className="text-[14px] text-[#6B7280] font-sans">
                GST (18%)
              </td>
              <td className="text-[14px] font-medium text-[#0F0F0F] font-sans tabular-nums">
                {formatINR(estimate.gstInr)}
              </td>
            </tr>

            {/* Total */}
            <tr className="flex items-center justify-between pt-4">
              <th scope="row" className="text-[15px] font-medium text-[#0F0F0F] font-sans text-left">
                <span>Total</span>
                {/* Info tooltip trigger */}
                <button
                  type="button"
                  onClick={() => setTooltipOpen(p => !p)}
                  aria-label="What is included in the total?"
                  aria-expanded={tooltipOpen}
                  aria-controls="total-tooltip"
                  className="ml-1.5 text-[#6B7280] hover:text-[#BA7517] transition-colors align-middle"
                >
                  <IconInfoCircle size={15} aria-hidden="true" />
                </button>
              </th>
              <td
                className="text-[32px] font-medium text-[#BA7517] font-sans tracking-[-0.5px] tabular-nums"
                aria-label={`Total: ${formatINR(estimate.totalInr)}`}
              >
                {formatINR(estimate.totalInr)}
              </td>
            </tr>

          </tbody>
        </table>

        {/* Tooltip — buffer and refund policy */}
        {tooltipOpen && (
          <div
            id="total-tooltip"
            role="tooltip"
            className="mt-3 p-4 bg-[#FAEEDA] border border-[0.5px] border-[#EF9F27] rounded-xl relative"
          >
            <button
              type="button"
              onClick={() => setTooltipOpen(false)}
              aria-label="Close tooltip"
              className="absolute top-3 right-3 text-[#6B7280] hover:text-[#0F0F0F]"
            >
              <IconX size={14} aria-hidden="true" />
            </button>
            <p className="text-[12px] font-sans text-[#633806] leading-relaxed">
              <span className="font-medium">Safety buffer:</span> The token estimate includes a {((((estimate.bufferedInputTokens / estimate.rawInputTokens)) - 1) * 100).toFixed(0)}% buffer above the expected usage. This ensures the generation completes even if your idea requires more context than estimated.
            </p>
            <p className="text-[12px] font-sans text-[#633806] leading-relaxed mt-2">
              <span className="font-medium">No refunds on unused tokens:</span> You pay for the estimated (buffered) amount upfront. If generation uses fewer tokens than estimated, the difference is not refunded.
            </p>
            <p className="text-[12px] font-sans text-[#633806] leading-relaxed mt-2">
              <span className="font-medium">Generation failure:</span> If generation fails after payment, a full refund is initiated manually within 2 business days.
            </p>
          </div>
        )}

        {/* USD equivalent — small mono text */}
        <p className="text-[11px] font-mono text-[#6B7280] mt-3 text-right">
          ≈ ${(estimate.totalInr / estimate.usdInrRate).toFixed(2)} USD · at ₹{estimate.usdInrRate}/$ rate
        </p>
      </div>

    </div>
  )
}
