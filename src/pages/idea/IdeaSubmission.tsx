import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { InlineEstimatePreview } from '@/components/idea/InlineEstimatePreview'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const fieldClass =
  'rounded-lg border border-white/10 bg-white/[0.04] text-foreground placeholder:text-chrome-subtle transition-colors focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/16'

export function IdeaSubmission() {
  const [ideaText, setIdeaText] = useState('')
  const [industry, setIndustry] = useState('')
  const [techPref, setTechPref] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { toast } = useToast()

  useEffect(() => {
    const saved = sessionStorage.getItem('pending_idea')
    if (saved) {
      try {
        const { ideaText: t, industry: i, techPref: p } = JSON.parse(saved)
        if (t) setIdeaText(t)
        if (i) setIndustry(i)
        if (p) setTechPref(p)
        sessionStorage.removeItem('pending_idea')
      } catch {
        sessionStorage.removeItem('pending_idea')
      }
    }
  }, [])

  const charCount = ideaText.length
  const isReady = charCount >= 50

  const handleStart = async () => {
    if (!isReady || loading || !user) return
    setLoading(true)

    try {
      const projectId = 'prj-' + Math.random().toString(36).substring(2, 9)
      const { error } = await supabase.from('projects').insert({
        id: projectId,
        user_id: user.id,
        idea_text: ideaText,
        industry: industry || null,
        tech_preference: techPref || null,
        status: 'draft',
      })
      if (error) throw error
      navigate(`/idea/${projectId}/elicitation`)
    } catch (err) {
      toast({ title: 'Error', description: err instanceof Error ? err.message : 'Could not start', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-8">
        <p className="section-label">New project</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
          Describe your idea
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-chrome-muted">
          Plain English is fine — the more detail you share, the better your documents will be.
        </p>
      </div>

      <div className="card-surface overflow-hidden">
        <div className="space-y-5 p-6 sm:p-8">
          <div className="space-y-2">
            <Label className="text-chrome-muted">Your idea</Label>
            <Textarea
              placeholder="E.g., A clinic management SaaS for independent clinics — appointment booking, billing, patient records, and WhatsApp reminders..."
              className={cn(fieldClass, 'min-h-[240px] resize-none text-sm leading-relaxed')}
              value={ideaText}
              onChange={(e) => setIdeaText(e.target.value)}
              maxLength={4000}
              autoFocus
            />
            <div className="space-y-2">
              <div className="h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-primary/50 transition-all duration-300"
                  style={{ width: `${Math.min(100, (charCount / 50) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[11px] text-chrome-subtle">
                <span>{charCount} / 4000</span>
                {charCount < 50 ? (
                  <span>{50 - charCount} more characters needed</span>
                ) : (
                  <span className="text-success">Ready to continue</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-chrome-muted">
                Industry <span className="text-chrome-subtle">(optional)</span>
              </Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className={cn(fieldClass, 'h-11')}>
                  <SelectValue placeholder="Select vertical" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-chrome-elevated text-foreground">
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="healthtech">HealthTech</SelectItem>
                  <SelectItem value="edtech">EdTech</SelectItem>
                  <SelectItem value="fintech">FinTech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-chrome-muted">
                Tech preference <span className="text-chrome-subtle">(optional)</span>
              </Label>
              <Select value={techPref} onValueChange={setTechPref}>
                <SelectTrigger className={cn(fieldClass, 'h-11')}>
                  <SelectValue placeholder="Select stack" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-chrome-elevated text-foreground">
                  <SelectItem value="any">Let AI decide</SelectItem>
                  <SelectItem value="react">React / Next.js</SelectItem>
                  <SelectItem value="vue">Vue.js</SelectItem>
                  <SelectItem value="angular">Angular</SelectItem>
                  <SelectItem value="mobile">Mobile Native</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {charCount >= 30 && (
          <div className="border-t border-white/10 px-6 py-4 sm:px-8">
            <InlineEstimatePreview ideaText={ideaText} embedded />
          </div>
        )}

        <div className="flex flex-col gap-4 border-t border-white/10 bg-white/[0.02] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <p className="text-sm font-medium text-foreground">Next: Business Analyst Q&A</p>
            <p className="mt-0.5 text-xs text-chrome-subtle">Saved to your account as you progress</p>
          </div>
          <button
            type="button"
            onClick={handleStart}
            disabled={!isReady || loading}
            className="btn-primary w-full sm:w-auto"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Start Q&A
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
