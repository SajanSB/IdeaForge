import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { IconLoader2, IconAdjustments } from '@tabler/icons-react'
import { adminService } from '@/services/adminService'
import { PricingLivePreview } from '@/components/admin/PricingLivePreview'
import { useRequireAdmin } from '@/hooks/useAuth'
import { supabase } from '@/services/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function AdminPricingPage() {
  useRequireAdmin()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [marginPct, setMarginPct] = useState(100)
  const [bufferMultiplier, setBufferMultiplier] = useState(1.4)
  const [gstEnabled, setGstEnabled] = useState(true)
  const [usdInrRate, setUsdInrRate] = useState(84)

  useEffect(() => {
    document.title = 'Pricing Config — IdeaForge Admin'
    loadConfig()
  }, [])

  async function loadConfig() {
    setIsLoading(true)
    try {
      const res = await adminService.getPlatformConfig()
      if (res?.data?.attributes) {
        const attr = res.data.attributes
        setMarginPct(attr.margin_pct)
        setBufferMultiplier(attr.buffer_multiplier)
        setGstEnabled(attr.gst_enabled)
        setUsdInrRate(attr.usd_inr_rate)
      }
    } catch {
      toast.error('Failed to load platform config, using defaults')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Not authenticated')

      const res = await fetch('/api/admin/config', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          marginPct,
          bufferMultiplier,
          gstEnabled,
          usdInrRate,
        })
      })

      if (!res.ok) {
        throw new Error(await res.text())
      }

      toast.success('Platform pricing configuration saved!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      toast.error(`Save failed: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <IconLoader2 className="animate-spin text-[#BA7517]" size={28} />
      </div>
    )
  }

  return (
    <div className="p-8 font-sans max-w-4xl space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[0.5px] border-border">
        <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans">
          Pricing Configuration
        </h1>
        <p className="text-[12px] text-[#6B7280] font-sans mt-0.5">
          Configure platform pricing markup, safety buffers, exchange rates, and tax parameters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Config Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          <div className="space-y-4 bg-white border border-[0.5px] border-border rounded-xl p-5">
            <div className="flex items-center gap-2 pb-2 border-b border-border">
              <IconAdjustments size={16} className="text-[#BA7517]" />
              <h2 className="text-[13px] font-medium text-[#0F0F0F] font-sans">Configuration parameters</h2>
            </div>

            {/* Platform Margin */}
            <div className="space-y-1.5">
              <Label htmlFor="margin-pct" className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                Platform Markup Margin (%)
              </Label>
              <Input
                id="margin-pct"
                type="number"
                min="0"
                max="500"
                value={marginPct}
                onChange={e => setMarginPct(Math.max(0, parseInt(e.target.value) || 0))}
                className="h-10 text-[13px]"
                required
              />
              <p className="text-[11px] text-[#6B7280] font-sans">
                Multiplier applied on top of raw API costs (e.g. 100% means platform fee equals raw API cost, doubling the price).
              </p>
            </div>

            {/* Safety Buffer */}
            <div className="space-y-1.5">
              <Label htmlFor="buffer-mult" className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                Token Safety Buffer Multiplier
              </Label>
              <Input
                id="buffer-mult"
                type="number"
                step="0.1"
                min="1.0"
                max="3.0"
                value={bufferMultiplier}
                onChange={e => setBufferMultiplier(Math.max(1.0, parseFloat(e.target.value) || 1.0))}
                className="h-10 text-[13px]"
                required
              />
              <p className="text-[11px] text-[#6B7280] font-sans">
                Safety markup for input/output token estimates to shield platform from usage spikes (1.0 to 3.0).
              </p>
            </div>

            {/* Exchange Rate */}
            <div className="space-y-1.5">
              <Label htmlFor="usd-inr" className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                USD to INR Conversion Rate
              </Label>
              <Input
                id="usd-inr"
                type="number"
                step="0.5"
                min="50"
                max="150"
                value={usdInrRate}
                onChange={e => setUsdInrRate(Math.max(50, parseFloat(e.target.value) || 50))}
                className="h-10 text-[13px]"
                required
              />
              <p className="text-[11px] text-[#6B7280] font-sans">
                Exchange multiplier used to convert USD billing costs to customer payment amounts.
              </p>
            </div>

            {/* GST Status Toggle */}
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="gst-toggle" className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                  Enable GST (18%)
                </Label>
                <p className="text-[11px] text-[#6B7280] font-sans">
                  Whether to levy standard 18% tax on total invoice amount.
                </p>
              </div>
              <Switch
                id="gst-toggle"
                checked={gstEnabled}
                onCheckedChange={setGstEnabled}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-10 bg-[#BA7517] hover:bg-[#A06010] text-[#FFF8ED] text-[13px] px-6 font-medium"
            >
              {isSaving ? (
                <>
                  <IconLoader2 className="animate-spin mr-1.5" size={16} /> Saving...
                </>
              ) : (
                <>
                  Save pricing variables
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Live Preview Panel */}
        <div className="lg:col-span-5">
          <div className="sticky top-6">
            <PricingLivePreview
              marginPct={marginPct}
              bufferMultiplier={bufferMultiplier}
              gstEnabled={gstEnabled}
              usdInrRate={usdInrRate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
