import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  date: string
  count: number
}

interface GenerationLineChartProps {
  data: ChartData[]
  isLoading?: boolean
}

export function GenerationLineChart({ data, isLoading }: GenerationLineChartProps) {
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
          <LineChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F7F5F0" />
            <XAxis dataKey="date" tick={{ fontSize: 10, fontFamily: 'IBM Plex Mono' }} stroke="#6B7280" />
            <YAxis tick={{ fontSize: 10 }} stroke="#6B7280" />
            <Tooltip
              contentStyle={{ fontSize: 12, border: '0.5px solid #E5E7EB', borderRadius: 8 }}
              formatter={(v: any) => [v, 'Generations']}
            />
            <Line type="monotone" dataKey="count" stroke="#BA7517" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <details className="text-[12px] text-[#6B7280] font-sans">
        <summary className="cursor-pointer hover:text-[#0F0F0F] outline-none">Show chart data table</summary>
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left border-collapse border border-border">
            <thead>
              <tr className="bg-[#F7F5F0]">
                <th className="p-2 border border-border">Date</th>
                <th className="p-2 border border-border">Generations</th>
              </tr>
            </thead>
            <tbody>
              {data.map(row => (
                <tr key={row.date} className="hover:bg-[#F7F5F0]">
                  <td className="p-2 border border-border font-mono">{row.date}</td>
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
