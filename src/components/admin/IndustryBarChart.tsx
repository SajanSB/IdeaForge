import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  count: number
}

interface IndustryBarChartProps {
  data: ChartData[]
  isLoading?: boolean
}

export function IndustryBarChart({ data, isLoading }: IndustryBarChartProps) {
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
          <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F7F5F0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10 }} stroke="#6B7280" />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="#6B7280" width={80} />
            <Tooltip contentStyle={{ fontSize: 12 }} />
            <Bar dataKey="count" fill="#6B7280" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <details className="text-[12px] text-[#6B7280] font-sans">
        <summary className="cursor-pointer hover:text-[#0F0F0F] outline-none">Show chart data table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left border-collapse border border-border">
            <thead>
              <tr className="bg-[#F7F5F0]">
                <th className="p-2 border border-border">Industry</th>
                <th className="p-2 border border-border">Generations</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.name} className="hover:bg-[#F7F5F0]">
                  <td className="p-2 border border-border font-mono">{row.name}</td>
                  <td className="p-2 border border-border tabular-nums">{row.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
