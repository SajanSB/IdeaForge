import { useState, useEffect, useMemo } from 'react'
import { useNavigate }   from 'react-router-dom'
import { toast }         from 'sonner'
import { IconAlertCircle, IconRefresh } from '@tabler/icons-react'
import { adminService, type DateRange, type StrapiPayment, type StrapiProject, type StrapiTokenLog } from '@/services/adminService'
import { KPICardRow }      from '@/components/admin/KPICardRow'
import { DateRangeToggle } from '@/components/admin/DateRangeToggle'
import { GenerationLineChart } from '@/components/admin/GenerationLineChart'
import { ModelPieChart }       from '@/components/admin/ModelPieChart'
import { RevenueBarChart }     from '@/components/admin/RevenueBarChart'
import { IndustryBarChart }    from '@/components/admin/IndustryBarChart'
import { GenerationTable }     from '@/components/admin/GenerationTable'
import { useRequireAdmin } from '@/hooks/useAuth'

// Group payments by date for charts
function groupByDate(payments: StrapiPayment[]): Array<{ date: string; count: number; revenue: number }> {
  const map = new Map<string, { count: number; revenue: number }>()
  payments.forEach(p => {
    const date = (p.paid_at ?? p.created_at).slice(0, 10)
    const curr = map.get(date) ?? { count: 0, revenue: 0 }
    map.set(date, { count: curr.count + 1, revenue: curr.revenue + p.amount_inr })
  })
  return Array.from(map.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function AdminAnalyticsPage() {
  useRequireAdmin()

  const navigate = useNavigate()
  const [range, setRange]             = useState<DateRange>('last_30')
  const [payments, setPayments]       = useState<StrapiPayment[]>([])
  const [projects, setProjects]       = useState<StrapiProject[]>([])
  const [tokenLogs, setTokenLogs]     = useState<StrapiTokenLog[]>([])
  const [isLoading, setIsLoading]     = useState(true)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    document.title = 'Analytics — IdeaForge Admin'
  }, [])

  useEffect(() => {
    loadData()
  }, [range])

  async function loadData() {
    setIsLoading(true)
    setError(null)
    try {
      const [paymentsRes, projectsRes, tokenLogsRes] = await Promise.all([
        adminService.getAllPayments(range),
        adminService.getProjects(range, 1, 100), // load more for analytics context
        adminService.getTokenLogs(range),
      ])
      const allPayments = paymentsRes.data.map(d => d.attributes)
      setPayments(allPayments)
      setProjects(projectsRes.data.map(d => d.attributes))
      setTokenLogs(tokenLogsRes.data.map(d => d.attributes))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load analytics'
      setError(msg)
      toast.error('Analytics data unavailable — check Strapi connection')
    } finally {
      setIsLoading(false)
    }
  }

  // Paid payments only for revenue/metric computations
  const paidPayments = useMemo(() => payments.filter(p => p.status === 'paid'), [payments])

  // ── KPI calculations ──────────────────────────────────────────────────────

  const kpis = useMemo(() => {
    const totalRevenue    = paidPayments.reduce((sum, p) => sum + p.amount_inr, 0)
    const totalTokensUsed = tokenLogs.reduce((sum, t) => sum + t.input_tokens + t.output_tokens, 0)
    const avgTokens       = paidPayments.length > 0 ? Math.round(totalTokensUsed / paidPayments.length) : 0
    const totalApiCostUsd = tokenLogs.reduce((sum, t) => sum + t.cost_usd, 0)
    const totalApiCostInr = totalApiCostUsd * 84   // approximate exchange rate
    const netRevenue      = totalRevenue - totalApiCostInr

    return {
      totalGenerations: paidPayments.length,
      netRevenue,
      avgTokens,
      conversionRate: projects.length > 0
        ? Math.round((paidPayments.length / projects.length) * 100)
        : 0,
    }
  }, [paidPayments, tokenLogs, projects])

  // ── Chart data ────────────────────────────────────────────────────────────

  const dailyData = useMemo(() => groupByDate(paidPayments), [paidPayments])

  const industryData = useMemo(() => {
    const map = new Map<string, number>()
    projects.forEach(p => {
      const ind = p.industry ?? 'Other'
      map.set(ind, (map.get(ind) ?? 0) + 1)
    })
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [projects])

  const modelData = useMemo(() => {
    const map = new Map<string, number>()
    tokenLogs.forEach(t => map.set(t.model, (map.get(t.model) ?? 0) + 1))
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }))
  }, [tokenLogs])

  // Error state
  if (error && !isLoading) {
    return (
      <div className="p-8 font-sans">
        <div className="flex items-start gap-3 bg-[#FCEBEB] border border-[0.5px] border-red-200 rounded-xl p-5 max-w-lg">
          <IconAlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="text-[14px] font-medium text-red-800 mb-1 font-sans">Analytics unavailable</p>
            <p className="text-[12px] text-red-700 font-sans mb-3">{error}</p>
            <button
              type="button"
              onClick={loadData}
              className="flex items-center gap-1.5 text-[13px] text-[#BA7517] font-medium font-sans"
            >
              <IconRefresh size={13} aria-hidden="true" /> Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans">
          Analytics
        </h1>
        <DateRangeToggle value={range} onChange={setRange} />
      </div>

      {/* KPI cards */}
      <KPICardRow kpis={kpis} isLoading={isLoading} />

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Daily volume line chart */}
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-5">
          <p className="text-[12px] font-medium text-[#0F0F0F] font-sans mb-4">Daily generations</p>
          <GenerationLineChart data={dailyData} isLoading={isLoading} />
        </div>

        {/* Model pie chart */}
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-5">
          <p className="text-[12px] font-medium text-[#0F0F0F] font-sans mb-4">Model usage</p>
          <ModelPieChart data={modelData} isLoading={isLoading} />
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Revenue bar chart */}
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-5">
          <p className="text-[12px] font-medium text-[#0F0F0F] font-sans mb-4">Revenue by day (₹)</p>
          <RevenueBarChart data={dailyData} isLoading={isLoading} />
        </div>

        {/* Industry bar chart */}
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-5">
          <p className="text-[12px] font-medium text-[#0F0F0F] font-sans mb-4">Top industries</p>
          <IndustryBarChart data={industryData} isLoading={isLoading} />
        </div>
      </div>

      {/* Recent generations table */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Recent generations
          </p>
          <span className="text-[11px] font-mono text-[#BA7517]">{paidPayments.length} paid</span>
        </div>

        <GenerationTable
          payments={paidPayments.slice(0, 20)}
          isLoading={isLoading}
          onRowClick={payment => navigate(`/admin/users/${payment.user_id}/dispute?projectId=${payment.project_id}`)}
        />
      </div>
    </div>
  )
}
