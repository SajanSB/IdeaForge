import { useRef } from 'react'
import { IconX, IconPrinter, IconDownload } from '@tabler/icons-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { MonoId } from '@/components/brand/MonoId'
import { formatINR } from '@/utils/estimateCalc'
import type { PaymentRecord } from '@/types/payment'

interface ReceiptModalProps {
  payment:   PaymentRecord | null
  isOpen:    boolean
  onClose:   () => void
}

export function ReceiptModal({ payment, isOpen, onClose }: ReceiptModalProps) {
  const printRef = useRef<HTMLDivElement>(null)

  const pay = payment
  if (!pay) return null

  const dateStr = pay.paidAt
    ? new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'long', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      }).format(new Date(pay.paidAt))
    : 'Date not available'

  function handlePrint() {
    window.print()
  }

  function handleDownloadReceipt() {
    const p = pay
    if (!p) return

    const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>IdeaForge Receipt - ${p.gatewayOrderId}</title>
  <style>
    body { font-family: 'Inter', sans-serif; max-width: 480px; margin: 40px auto; color: #0F0F0F; }
    h1 { font-size: 22px; font-weight: 500; margin-bottom: 4px; }
    .sub { font-size: 13px; color: #6B7280; margin-bottom: 32px; }
    .row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 0.5px solid #E5E7EB; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .label { color: #6B7280; }
    .value { font-weight: 500; }
    .total .label { font-weight: 500; color: #0F0F0F; }
    .total .value { font-size: 22px; font-weight: 500; color: #BA7517; }
    .mono { font-family: 'IBM Plex Mono', monospace; font-size: 11px; }
    .footer { margin-top: 32px; font-size: 11px; color: #6B7280; }
  </style>
</head>
<body>
  <h1>IdeaForge</h1>
  <p class="sub">Payment Receipt</p>

  <div class="row"><span class="label">Date</span><span class="value">${dateStr}</span></div>
  <div class="row"><span class="label">Order ID</span><span class="mono value">${p.gatewayOrderId || '—'}</span></div>
  <div class="row"><span class="label">Transaction ID</span><span class="mono value">${p.gatewayPaymentId || '—'}</span></div>
  <div class="row"><span class="label">Payment method</span><span class="value capitalize">${p.gateway}</span></div>
  <div class="row"><span class="label">Currency</span><span class="value">${p.currency}</span></div>
  <div class="row total"><span class="label">Amount paid</span><span class="value">${formatINR(p.amountInr)}</span></div>

  <p class="footer">
    IdeaForge · support@ideaforge.ai<br>
    This is a system-generated receipt. No signature required.
  </p>
</body>
</html>`

    const blob = new Blob([receiptHtml], { type: 'text/html;charset=utf-8' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `ideaforge-receipt-${(p.gatewayOrderId ?? 'unknown').slice(0, 16)}.html`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent
        className="max-w-sm w-full border border-[0.5px] border-border rounded-xl p-0 overflow-hidden"
        aria-label="Payment receipt"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0]">
          <p className="text-[13px] font-medium text-[#0F0F0F] font-sans">Payment receipt</p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              aria-label="Print receipt"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#E8E6E2] transition-colors"
            >
              <IconPrinter size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleDownloadReceipt}
              aria-label="Download receipt as HTML"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#E8E6E2] transition-colors"
            >
              <IconDownload size={14} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close receipt"
              className="w-7 h-7 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#E8E6E2] transition-colors"
            >
              <IconX size={14} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Receipt body */}
        <div ref={printRef} className="px-5 py-5">
          {/* IdeaForge wordmark */}
          <p className="text-[15px] font-medium text-[#0F0F0F] font-sans mb-1">IdeaForge</p>
          <p className="text-[11px] text-[#6B7280] font-sans mb-5">Payment receipt</p>

          {/* Receipt rows */}
          <div className="space-y-0 divide-y divide-border">
            {[
              { label: 'Date',           value: dateStr,                      mono: false },
              { label: 'Order ID',       value: pay.gatewayOrderId,       mono: true },
              { label: 'Transaction ID', value: pay.gatewayPaymentId,     mono: true },
              { label: 'Gateway',        value: pay.gateway,              mono: false },
              { label: 'Currency',       value: pay.currency,             mono: false },
            ].map(({ label, value, mono }) => value && (
              <div key={label} className="flex items-center justify-between py-2.5">
                <span className="text-[12px] text-[#6B7280] font-sans">{label}</span>
                {mono
                  ? <MonoId className="text-[10px]">{(value as string).slice(0, 24)}</MonoId>
                  : <span className="text-[12px] text-[#0F0F0F] font-sans capitalize">{value as string}</span>
                }
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="flex items-center justify-between pt-3 border-t border-[0.5px] border-border mt-1">
            <span className="text-[14px] font-medium text-[#0F0F0F] font-sans">Amount paid</span>
            <span className="text-[22px] font-medium text-[#BA7517] font-sans tracking-[-0.3px]">
              {formatINR(pay.amountInr)}
            </span>
          </div>

          <p className="text-[10px] text-[#6B7280] font-sans mt-4 leading-relaxed">
            System-generated receipt · support@ideaforge.ai
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
