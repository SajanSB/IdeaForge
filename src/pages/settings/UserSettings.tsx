import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import { PageHeader } from '@/components/common/PageHeader'
import { User, CreditCard, Bell, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

type Tab = 'profile' | 'payments' | 'notifications'
const JOB_ROLES = ['Founder', 'Product Manager', 'Developer', 'Consultant', 'Designer', 'Other']
const INDUSTRIES = ['SaaS', 'FinTech', 'HealthTech', 'EdTech', 'FoodTech', 'E-Commerce', 'Other']

type NotifPrefs = { generationComplete: boolean; paymentReceipt: boolean; productUpdates: boolean; weeklyDigest: boolean }
const DEFAULT_NOTIFS: NotifPrefs = { generationComplete: true, paymentReceipt: true, productUpdates: false, weeklyDigest: false }

function ProfileTab() {
  const { name, email, user } = useAuthStore()
  const { toast } = useToast()
  const [displayName, setDisplayName] = useState(name || '')
  const [jobRole, setJobRole] = useState('Founder')
  const [industry, setIndustry] = useState('SaaS')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('full_name, job_role, industry').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.full_name ?? name ?? '')
          setJobRole(data.job_role ?? 'Founder')
          setIndustry(data.industry ?? 'SaaS')
        }
        setLoading(false)
      })
  }, [user, name])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    const [{ error: profileErr }, { error: authErr }] = await Promise.all([
      supabase.from('profiles').update({
        full_name: displayName,
        job_role: jobRole,
        industry,
      }).eq('id', user.id),
      supabase.auth.updateUser({ data: { full_name: displayName } }),
    ])
    setSaving(false)
    if (profileErr || authErr) {
      toast({ title: 'Save failed', description: (profileErr ?? authErr)?.message, variant: 'destructive' })
      return
    }
    toast({ title: 'Profile updated' })
  }

  if (loading) return <div className="chrome-card flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin text-chrome-muted" /></div>

  return (
    <div className="chrome-card p-6">
      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Display name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="bg-white/5 border-chrome-border" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email || ''} disabled className="bg-white/[0.02] border-chrome-border opacity-60" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label>Job role</Label>
            <select value={jobRole} onChange={(e) => setJobRole(e.target.value)} className="w-full h-10 px-3 rounded-md border border-chrome-border bg-white/5 text-sm">
              {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label>Industry</Label>
            <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full h-10 px-3 rounded-md border border-chrome-border bg-white/5 text-sm">
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save changes'}</Button>
        </div>
      </form>
    </div>
  )
}

function PaymentsTab() {
  const [payments, setPayments] = useState<Array<{ id: string; idea: string; amount: string; status: string; gateway: string; date: string; docs: number }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('projects').select('id, idea_text, estimated_cost_inr, payment_provider, payment_status, created_at, documents(count)')
      .in('payment_status', ['paid', 'failed']).order('created_at', { ascending: false })
      .then(({ data }) => {
        setPayments((data ?? []).map((p: Record<string, unknown>) => ({
          id: p.id as string,
          idea: ((p.idea_text as string)?.slice(0, 60) ?? '') + ((p.idea_text as string)?.length > 60 ? '…' : ''),
          amount: `₹${Number(p.estimated_cost_inr ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          status: p.payment_status === 'paid' ? 'success' : 'failed',
          gateway: (p.payment_provider as string) ?? '—',
          date: new Date(p.created_at as string).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          docs: (p.documents as { count: number }[] | undefined)?.[0]?.count ?? 0,
        })))
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="chrome-card flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin" /></div>
  if (!payments.length) return <div className="chrome-card p-8 text-center text-chrome-muted text-sm">No payments yet.</div>

  return (
    <div className="chrome-card divide-y divide-chrome-border">
      {payments.map((pay) => (
        <div key={pay.id} className="px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {pay.status === 'success' ? <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> : <XCircle className="h-4 w-4 text-destructive shrink-0" />}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{pay.idea}</p>
              <p className="text-[10px] font-mono text-chrome-subtle mt-0.5">{pay.date} · {pay.gateway}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className={cn('font-mono font-semibold text-sm', pay.status === 'success' ? 'text-primary' : 'text-chrome-subtle line-through')}>{pay.amount}</p>
            <p className="text-[10px] text-chrome-subtle">{pay.docs} docs</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function NotificationsTab() {
  const { user } = useAuthStore()
  const { toast } = useToast()
  const [notifs, setNotifs] = useState<NotifPrefs>(DEFAULT_NOTIFS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('notification_prefs').eq('id', user.id).single()
      .then(({ data }) => {
        if (data?.notification_prefs && typeof data.notification_prefs === 'object' && !Array.isArray(data.notification_prefs)) {
          setNotifs({ ...DEFAULT_NOTIFS, ...(data.notification_prefs as NotifPrefs) })
        }
        setLoading(false)
      })
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { error } = await supabase.from('profiles').update({ notification_prefs: notifs }).eq('id', user.id)
    setSaving(false)
    if (error) toast({ title: 'Save failed', description: error.message, variant: 'destructive' })
    else toast({ title: 'Preferences saved' })
  }

  const items = [
    { key: 'generationComplete' as const, label: 'Generation complete', desc: 'When your documents are ready.' },
    { key: 'paymentReceipt' as const, label: 'Payment receipts', desc: 'After every successful payment.' },
    { key: 'productUpdates' as const, label: 'Product updates', desc: 'New features and improvements.' },
    { key: 'weeklyDigest' as const, label: 'Weekly digest', desc: 'Summary of project activity.' },
  ]

  if (loading) return <div className="chrome-card flex justify-center py-16"><Loader2 className="h-5 w-5 animate-spin" /></div>

  return (
    <div className="chrome-card">
      <div className="divide-y divide-chrome-border">
        {items.map((item) => (
          <div key={item.key} className="px-5 py-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-chrome-muted mt-0.5">{item.desc}</p>
            </div>
            <button onClick={() => setNotifs((p) => ({ ...p, [item.key]: !p[item.key] }))}
              className={cn('w-10 h-[22px] rounded-full border relative transition-colors', notifs[item.key] ? 'bg-primary border-primary' : 'bg-white/5 border-chrome-border')}>
              <span className={cn('absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm', notifs[item.key] ? 'translate-x-[22px]' : 'translate-x-0.5')} />
            </button>
          </div>
        ))}
      </div>
      <div className="px-5 py-4 border-t border-chrome-border flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="sm">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}</Button>
      </div>
    </div>
  )
}

export function UserSettings() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'notifications', label: 'Notifications', icon: Bell },
  ]

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader title="Settings" description="Manage your account and preferences." />
      <div className="flex flex-col md:flex-row gap-6">
        <nav className="md:w-48 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={cn('w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors',
                activeTab === tab.key ? 'bg-primary/15 text-primary' : 'text-chrome-muted hover:text-foreground hover:bg-white/5')}>
              <tab.icon className="h-4 w-4" /> {tab.label}
            </button>
          ))}
        </nav>
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
        </div>
      </div>
    </div>
  )
}
