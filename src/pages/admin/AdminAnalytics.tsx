import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Download, Zap, Banknote, FileText, Target, Loader2, RefreshCw } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

type Stats = {
  total_projects: number
  complete_projects: number
  total_revenue: number
  conversion_rate: number
}

type DayRow    = { day: string; count: number }
type RecentRow = { id: string; idea_snippet: string; full_name: string; status: string; revenue: number; created_at: string }
type IndustryRow = { industry: string; count: number }

const INDUSTRY_COLORS = ['#C4892A', '#7C6FE0', '#14B8A6', '#EF4444', '#3B82F6', '#F59E0B']

const STATUS_COLORS: Record<string, string> = {
  complete:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  generating: 'text-primary bg-primary/10 border-primary/20',
  draft:      'text-chrome-muted bg-white/[0.04] border-chrome-border',
  failed:     'text-red-400 bg-red-500/10 border-red-500/20',
}

type Range = '7D' | '30D' | '90D'
const RANGE_DAYS: Record<Range, number> = { '7D': 7, '30D': 30, '90D': 90 }

export function AdminAnalytics() {
  const [stats,    setStats]    = useState<Stats | null>(null)
  const [chart,    setChart]    = useState<DayRow[]>([])
  const [recent,   setRecent]   = useState<RecentRow[]>([])
  const [industry, setIndustry] = useState<IndustryRow[]>([])
  const [loading,  setLoading]  = useState(true)
  const [range,    setRange]    = useState<Range>('30D')
  const { toast } = useToast()

  const load = async (r: Range = range) => {
    setLoading(true)
    const [s, c, rec, ind] = await Promise.all([
      supabase.rpc('admin_get_stats'),
      supabase.rpc('admin_get_daily_chart', { p_days: RANGE_DAYS[r] }),
      supabase.rpc('admin_get_recent_projects', { p_limit: 20 }),
      supabase.rpc('admin_get_industry_breakdown'),
    ])

    if (s.error)   toast({ title: 'Stats error',    description: s.error.message,   variant: 'destructive' })
    if (c.error)   toast({ title: 'Chart error',    description: c.error.message,   variant: 'destructive' })
    if (rec.error) toast({ title: 'Recent error',   description: rec.error.message, variant: 'destructive' })
    if (ind.error) toast({ title: 'Industry error', description: ind.error.message, variant: 'destructive' })

    if (s.data)   setStats(s.data as Stats)
    if (c.data)   setChart((c.data as DayRow[]).map((d) => ({ ...d, count: Number(d.count) })))
    if (rec.data) setRecent(rec.data as RecentRow[])
    if (ind.data) setIndustry((ind.data as IndustryRow[]).map((d) => ({ ...d, count: Number(d.count) })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  const handleRangeChange = (r: Range) => {
    setRange(r)
    load(r)
  }

  const handleExportCSV = () => {
    if (!recent.length) return
    const header = 'ID,Idea,User,Status,Revenue (INR),Created At'
    const rows = recent.map((r) =>
      `"${r.id}","${r.idea_snippet.replace(/"/g, '""')}","${r.full_name}","${r.status}","${r.revenue}","${r.created_at}"`
    )
    const csv  = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `ideaforge-analytics-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const fmt = (n: number) => n.toLocaleString('en-IN')

  return (
    <div className="w-full max-w-[1200px] mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Performance Overview</h1>
          <p className="text-white/50 mt-1">Live metrics from your Supabase database.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-chrome-elevated border border-white/10 rounded-md p-1">
            {(['7D', '30D', '90D'] as Range[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRangeChange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  range === r
                    ? 'text-primary bg-primary/10 border border-primary/20'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => load()}
            disabled={loading}
            className="bg-transparent border-white/10 text-white/60 hover:text-white hover:bg-white/5 h-9"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: 'Generations',
            value: stats ? fmt(stats.complete_projects) : '—',
            sub: stats ? `${fmt(stats.total_projects)} total projects` : 'Loading…',
            subColor: 'text-white/40',
            Icon: Zap, iconColor: 'text-primary',
          },
          {
            label: 'Revenue (INR)',
            value: stats ? `₹${fmt(stats.total_revenue)}` : '—',
            sub: 'Paid generations only',
            subColor: 'text-white/40',
            Icon: Banknote, iconColor: 'text-primary',
          },
          {
            label: 'Documents',
            value: stats ? fmt(stats.complete_projects * 12) : '—',
            sub: '12 docs per generation',
            subColor: 'text-white/40',
            Icon: FileText, iconColor: 'text-[#8B5CF6]',
          },
          {
            label: 'Conversion',
            value: stats ? `${stats.conversion_rate}%` : '—',
            sub: 'Draft → Complete',
            subColor: 'text-white/40',
            Icon: Target, iconColor: 'text-[#0D9488]',
          },
        ].map((card) => (
          <Card key={card.label} className="artifact-card shadow-2xl border-white/10 bg-chrome-elevated">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-mono font-medium text-white/70 uppercase">{card.label}</CardTitle>
              <card.Icon className={`h-4 w-4 ${card.iconColor}`} />
            </CardHeader>
            <CardContent>
              {loading
                ? <Loader2 className="h-5 w-5 animate-spin text-white/30 mt-1" />
                : <div className="text-3xl font-bold text-white">{card.value}</div>}
              <p className={`text-xs mt-1 ${card.subColor}`}>{card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart + Industry split */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="artifact-card shadow-2xl border-white/10 bg-chrome-elevated md:col-span-2 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">Completed Generations / Day</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-4 min-h-[250px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/30" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#C4892A" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#C4892A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }} dy={10} interval="preserveStartEnd" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                    itemStyle={{ color: '#C4892A' }}
                  />
                  <Area type="monotone" dataKey="count" name="Completions" stroke="#C4892A" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="artifact-card shadow-2xl border-white/10 bg-chrome-elevated flex flex-col">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">Industry Mix</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center pb-4">
            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-white/30" />
              </div>
            ) : industry.length === 0 ? (
              <p className="text-white/30 text-sm text-center">No data yet</p>
            ) : (
              <>
                <div className="h-[160px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={industry} innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="count" stroke="none">
                        {industry.map((_, i) => (
                          <Cell key={i} fill={INDUSTRY_COLORS[i % INDUSTRY_COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold text-white">
                      {industry.reduce((s, r) => s + r.count, 0)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 px-2">
                  {industry.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: INDUSTRY_COLORS[i % INDUSTRY_COLORS.length] }} />
                        <span className="text-white/80 capitalize">{item.industry}</span>
                      </div>
                      <span className="text-white/50 font-mono">{item.count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent projects table */}
      <Card className="artifact-card shadow-2xl border-white/10 bg-chrome-elevated">
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-white/10 bg-white/[0.02]">
          <CardTitle className="text-base font-semibold text-white">Recent Projects</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            disabled={loading || recent.length === 0}
            className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white h-8"
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-5 w-5 animate-spin text-white/30" />
            </div>
          ) : recent.length === 0 ? (
            <p className="text-white/30 text-sm text-center py-10">No projects yet</p>
          ) : (
            <Table>
              <TableHeader className="bg-white/[0.01]">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="font-mono text-xs uppercase text-white/40 py-3">Idea</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-white/40 py-3">User</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-white/40 py-3">Revenue</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-white/40 py-3">Status</TableHead>
                  <TableHead className="font-mono text-xs uppercase text-white/40 py-3 text-right">Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((row) => (
                  <TableRow key={row.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                    <TableCell className="font-medium text-white/90 max-w-[280px] truncate">{row.idea_snippet}</TableCell>
                    <TableCell className="text-white/60">{row.full_name}</TableCell>
                    <TableCell className="text-primary font-mono">
                      {row.revenue > 0 ? `₹${fmt(row.revenue)}` : '—'}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium border ${STATUS_COLORS[row.status] ?? 'text-white/40 bg-white/[0.04] border-white/10'}`}>
                        [{row.status.toUpperCase()}]
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-white/40 font-mono text-xs">
                      {new Date(row.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
