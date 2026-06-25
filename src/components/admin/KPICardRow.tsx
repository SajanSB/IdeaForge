import { KPICard } from './KPICard'

interface KPICardRowProps {
  kpis: {
    totalGenerations: number
    netRevenue: number
    avgTokens: number
    conversionRate: number
  }
  isLoading?: boolean
}

export function KPICardRow({ kpis, isLoading }: KPICardRowProps) {
  const formattedRevenue = new Intl.NumberFormat('en-IN', {
    style:                 'currency',
    currency:              'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(kpis.netRevenue)

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      <KPICard
        label="Total generations"
        value={kpis.totalGenerations}
        sub="paid completions"
        isLoading={isLoading}
      />
      <KPICard
        label="Net revenue (INR)"
        value={formattedRevenue}
        sub="after API costs"
        isLoading={isLoading}
      />
      <KPICard
        label="Avg tokens / run"
        value={`${Math.round(kpis.avgTokens / 1000)}K`}
        sub="incl. buffer"
        valueIsCode
        isLoading={isLoading}
      />
      <KPICard
        label="Conversion rate"
        value={`${kpis.conversionRate}%`}
        sub="estimate → paid"
        isLoading={isLoading}
      />
    </div>
  )
}
