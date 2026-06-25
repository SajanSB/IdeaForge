import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  value: number
}

interface ModelPieChartProps {
  data: ChartData[]
  isLoading?: boolean
}

const COLORS = ['#BA7517', '#6B7280', '#3C3489']

export function ModelPieChart({ data, isLoading }: ModelPieChartProps) {
  if (isLoading) {
    return <div className="h-48 bg-[#F7F5F0] rounded-lg animate-pulse" />
  }

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-[12px] text-[#6B7280] font-sans">
        No data for this period
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={70}
              label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <details className="text-[12px] text-[#6B7280] font-sans">
        <summary className="cursor-pointer hover:text-[#0F0F0F] outline-none">Show chart data table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left border-collapse border border-border">
            <thead>
              <tr className="bg-[#F7F5F0]">
                <th className="p-2 border border-border">Model</th>
                <th className="p-2 border border-border">Runs</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.name} className="hover:bg-[#F7F5F0]">
                  <td className="p-2 border border-border font-mono">{row.name}</td>
                  <td className="p-2 border border-border tabular-nums">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
