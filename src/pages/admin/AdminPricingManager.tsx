import { useState, useMemo, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEstimateStore, DEFAULT_CONFIG } from '@/store/useEstimateStore'
import { useToast } from '@/hooks/use-toast'
import { Save, RefreshCw, TrendingUp, Info, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

function fmtInr(n: number) {
  return `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

interface FormState {
  usdInrRate: number
  platformFeeInr: number
  gstRate: number
  bufferMultiplier: number
  gstEnabled: boolean
}

const COMPLEXITY_LEVELS = [
  { id: 'Simple'  as const, dot: 'bg-teal-400',  label: 'SIMPLE',  color: 'text-teal-400',  border: 'border-teal-400/20',  bg: 'bg-teal-400/[0.04]'  },
  { id: 'Medium'  as const, dot: 'bg-amber-400', label: 'MEDIUM',  color: 'text-amber-400', border: 'border-amber-400/20', bg: 'bg-amber-400/[0.04]' },
  { id: 'Complex' as const, dot: 'bg-red-400',   label: 'COMPLEX', color: 'text-red-400',   border: 'border-red-400/20',   bg: 'bg-red-400/[0.04]'   },
]

export function AdminPricingManager() {
  const { updateConfig, calculateForComplexity } = useEstimateStore()
  const { toast } = useToast()

  const [form, setForm] = useState<FormState>({
    usdInrRate:       DEFAULT_CONFIG.usdInrRate,
    platformFeeInr:   DEFAULT_CONFIG.platformFeeInr,
    gstRate:          Math.round(DEFAULT_CONFIG.gstRate * 100),
    bufferMultiplier: DEFAULT_CONFIG.bufferMultiplier,
    gstEnabled:       DEFAULT_CONFIG.gstRate > 0,
  })
  const [isDirty,  setIsDirty]  = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loading,  setLoading]  = useState(true)

  // Load from DB on mount
  useEffect(() => {
    supabase
      .from('pricing_config')
      .select('*')
      .eq('id', 'default')
      .single()
      .then(({ data }) => {
        if (data) {
          const loaded: FormState = {
            usdInrRate:       Number(data.usd_inr_rate),
            platformFeeInr:   Number(data.platform_fee_inr),
            gstRate:          Math.round(Number(data.gst_rate) * 100),
            bufferMultiplier: Number(data.buffer_multiplier),
            gstEnabled:       Number(data.gst_rate) > 0,
          }
          setForm(loaded)
          updateConfig({
            usdInrRate:       loaded.usdInrRate,
            platformFeeInr:   loaded.platformFeeInr,
            gstRate:          loaded.gstEnabled ? loaded.gstRate / 100 : 0,
            bufferMultiplier: loaded.bufferMultiplier,
          })
        }
        setLoading(false)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const patchForm = (key: keyof FormState, value: number | boolean) => {
    setForm((f) => ({ ...f, [key]: value }))
    setIsDirty(true)
  }

  // Live preview: derive pricing for each complexity from current form state
  const previews = useMemo(() => {
    const overrideConfig = {
      usdInrRate: form.usdInrRate,
      platformFeeInr: form.platformFeeInr,
      gstRate: form.gstEnabled ? form.gstRate / 100 : 0,
      bufferMultiplier: form.bufferMultiplier,
    }
    return COMPLEXITY_LEVELS.map((c) => ({
      ...c,
      costs: calculateForComplexity(c.id, overrideConfig),
    }))
  }, [form, calculateForComplexity])

  const handleSave = async () => {
    if (form.usdInrRate < 50 || form.usdInrRate > 200) {
      toast({ title: 'Invalid rate', description: 'USD/INR rate must be between 50 and 200', variant: 'destructive' })
      return
    }
    if (form.bufferMultiplier < 1.0 || form.bufferMultiplier > 3.0) {
      toast({ title: 'Invalid buffer', description: 'Buffer multiplier must be between 1.0 and 3.0', variant: 'destructive' })
      return
    }

    setIsSaving(true)
    const { error } = await supabase
      .from('pricing_config')
      .update({
        usd_inr_rate:      form.usdInrRate,
        platform_fee_inr:  form.platformFeeInr,
        gst_rate:          form.gstEnabled ? form.gstRate / 100 : 0,
        buffer_multiplier: form.bufferMultiplier,
        updated_at:        new Date().toISOString(),
      })
      .eq('id', 'default')

    setIsSaving(false)

    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' })
      return
    }

    updateConfig({
      usdInrRate:       form.usdInrRate,
      platformFeeInr:   form.platformFeeInr,
      gstRate:          form.gstEnabled ? form.gstRate / 100 : 0,
      bufferMultiplier: form.bufferMultiplier,
    })
    setIsDirty(false)
    toast({ title: 'Configuration saved', description: 'Takes effect on next estimate calculation.' })
  }

  const handleReset = () => {
    setForm({
      usdInrRate: DEFAULT_CONFIG.usdInrRate,
      platformFeeInr: DEFAULT_CONFIG.platformFeeInr,
      gstRate: Math.round(DEFAULT_CONFIG.gstRate * 100),
      bufferMultiplier: DEFAULT_CONFIG.bufferMultiplier,
      gstEnabled: DEFAULT_CONFIG.gstRate > 0,
    })
    setIsDirty(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-chrome-subtle">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-[14px]">Loading pricing config…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold tracking-tight text-white leading-tight">Pricing Configuration</h1>
          <p className="text-chrome-muted mt-1 text-[14px]">
            Configure platform pricing parameters. Changes apply to all future estimate calculations.
          </p>
        </div>
        {isDirty && (
          <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Unsaved changes
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">

        {/* ── Left: Config form ─────────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Currency section */}
          <section className="bg-chrome-elevated border border-chrome-border rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-mono font-semibold text-chrome-subtle uppercase tracking-widest">Currency</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/55 text-[12px]">USD → INR Rate</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={50} max={200} step={0.5}
                    value={form.usdInrRate}
                    onChange={(e) => patchForm('usdInrRate', parseFloat(e.target.value))}
                    className="bg-white/[0.03] border-chrome-border text-white focus-visible:ring-primary font-mono pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/25 font-mono pointer-events-none">₹ / USD</span>
                </div>
                <p className="text-[11px] text-white/25">Used to convert Anthropic USD cost to INR</p>
              </div>
            </div>
          </section>

          {/* Platform fees section */}
          <section className="bg-chrome-elevated border border-chrome-border rounded-xl p-5 space-y-4">
            <p className="text-[11px] font-mono font-semibold text-chrome-subtle uppercase tracking-widest">Platform Fees</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/55 text-[12px]">Fixed Platform Fee (INR)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 text-[13px] pointer-events-none">₹</span>
                  <Input
                    type="number"
                    min={0} max={5000} step={10}
                    value={form.platformFeeInr}
                    onChange={(e) => patchForm('platformFeeInr', parseFloat(e.target.value))}
                    className="bg-white/[0.03] border-chrome-border text-white focus-visible:ring-primary font-mono pl-7"
                  />
                </div>
                <p className="text-[11px] text-white/25">Added to API cost before GST</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Label className="text-white/55 text-[12px]">Platform Note</Label>
                  <Info size={11} className="text-white/25" />
                </div>
                <p className="text-[12px] text-white/30 leading-relaxed pt-1">
                  Adjust the platform fee above to control your margin. Price = API cost × buffer + platform fee + GST.
                </p>
              </div>
            </div>
          </section>

          {/* Token estimation section */}
          <section className="bg-chrome-elevated border border-chrome-border rounded-xl p-5 space-y-4">
            <p className="text-[11px] font-mono font-semibold text-chrome-subtle uppercase tracking-widest">Token Estimation</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/55 text-[12px]">Buffer Multiplier</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1.0} max={3.0} step={0.1}
                    value={form.bufferMultiplier}
                    onChange={(e) => patchForm('bufferMultiplier', parseFloat(e.target.value))}
                    className="bg-white/[0.03] border-chrome-border text-white focus-visible:ring-primary font-mono pr-5"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/25 font-mono pointer-events-none">×</span>
                </div>
                <p className="text-[11px] text-white/25">
                  Applied to raw token estimates. 1.4 = 40% safety margin.
                </p>
              </div>

              {/* Visual buffer indicator */}
              <div className="flex flex-col justify-center gap-2 pt-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/35 font-mono">Base tokens</span>
                  <span className="text-white/55 font-mono">100%</span>
                </div>
                <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((form.bufferMultiplier / 3) * 100, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-white/35 font-mono">Buffered</span>
                  <span className="text-primary font-mono font-semibold">{Math.round(form.bufferMultiplier * 100)}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Taxation section */}
          <section className="bg-chrome-elevated border border-chrome-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-mono font-semibold text-chrome-subtle uppercase tracking-widest">Taxation</p>
              <button
                onClick={() => patchForm('gstEnabled', !form.gstEnabled)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-mono font-medium border transition-all',
                  form.gstEnabled
                    ? 'bg-teal-400/10 border-teal-400/20 text-teal-400'
                    : 'bg-white/[0.04] border-chrome-border text-white/35 hover:text-white/55',
                )}
              >
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full transition-colors',
                  form.gstEnabled ? 'bg-teal-400' : 'bg-white/20',
                )} />
                GST {form.gstEnabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {form.gstEnabled && (
              <div className="space-y-2">
                <Label className="text-white/55 text-[12px]">GST Rate</Label>
                <div className="flex items-center gap-3">
                  <div className="relative w-32">
                    <Input
                      type="number"
                      min={0} max={30} step={1}
                      value={form.gstRate}
                      onChange={(e) => patchForm('gstRate', parseFloat(e.target.value))}
                      className="bg-white/[0.03] border-chrome-border text-white focus-visible:ring-primary font-mono pr-7"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-white/25 font-mono pointer-events-none">%</span>
                  </div>
                  <p className="text-[11px] text-white/35">Applied on (API cost + platform fee)</p>
                </div>
              </div>
            )}
          </section>

          {/* Action bar */}
          <div className="flex items-center justify-between pt-3 border-t border-chrome-border">
            <Button
              variant="ghost"
              onClick={handleReset}
              className="text-white/35 hover:text-white/60 hover:bg-white/[0.04] text-[12px] gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset to defaults
            </Button>
            <div className="flex items-center gap-3">
              {isDirty && (
                <span className="text-[11px] text-white/25 font-mono">Unsaved</span>
              )}
              <Button
                onClick={handleSave}
                disabled={!isDirty || isSaving}
                className="bg-primary hover:bg-primary/90 text-white gap-2 text-[13px] disabled:opacity-40"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving…' : 'Save configuration'}
              </Button>
            </div>
          </div>
        </div>

        {/* ── Right: Live preview ───────────────────────────────────────────── */}
        <div className="space-y-4">

          {/* Preview card */}
          <div className="bg-chrome-elevated border border-chrome-border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-chrome-border bg-white/[0.02] flex items-center gap-2">
              <TrendingUp size={13} className="text-primary" />
              <p className="text-[11px] font-mono font-semibold text-chrome-muted uppercase tracking-widest">Live Price Preview</p>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {previews.map((p) => (
                <div key={p.id} className={cn('p-4', p.bg)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={cn('w-2 h-2 rounded-full', p.dot)} />
                      <span className={cn('text-[11px] font-mono font-semibold', p.color)}>
                        {p.label}
                      </span>
                    </div>
                    <span className="text-[22px] font-semibold text-white font-mono leading-none">
                      {fmtInr(p.costs.totalInr)}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/35">API Cost</span>
                      <span className="text-white/55 font-mono">{fmtInr(p.costs.apiCostInr)}</span>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-white/35">Platform Fee</span>
                      <span className="text-white/55 font-mono">{fmtInr(p.costs.platformFeeInr)}</span>
                    </div>
                    {form.gstEnabled && (
                      <div className="flex justify-between text-[11px]">
                        <span className="text-white/35">GST ({form.gstRate}%)</span>
                        <span className="text-white/55 font-mono">{fmtInr(p.costs.gstInr)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing model note */}
          <div className="p-4 rounded-xl bg-white/[0.015] border border-white/[0.06] space-y-3">
            <p className="text-[12px] font-semibold text-white/55">How pricing is calculated</p>
            <div className="space-y-2 text-[11px] text-white/35 leading-relaxed">
              <p>
                Claude Sonnet 4.6 is billed at <span className="text-white/55 font-mono">$3.00 / MTok input</span> and{' '}
                <span className="text-white/55 font-mono">$15.00 / MTok output</span>.
              </p>
              <p>
                Raw token estimates scale by complexity (Simple 1.0×, Medium 1.55×, Complex 2.3×), then multiplied by the buffer.
              </p>
              <p>
                Platform fee and GST are added on top. Users see the full breakdown before paying.
              </p>
            </div>
          </div>

          {/* Target range callout */}
          <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-primary/[0.05] border border-primary/20">
            <p className="text-[11px] text-chrome-subtle font-mono">Target range</p>
            <p className="text-[13px] font-semibold text-primary font-mono">
              {fmtInr(previews[0]?.costs.totalInr ?? 0)} — {fmtInr(previews[2]?.costs.totalInr ?? 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
