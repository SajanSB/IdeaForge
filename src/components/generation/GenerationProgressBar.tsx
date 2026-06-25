interface GenerationProgressBarProps {
  docsComplete: number
  totalDocs:    number
}

export function GenerationProgressBar({ docsComplete, totalDocs }: GenerationProgressBarProps) {
  const percent = Math.min(100, Math.round((docsComplete / totalDocs) * 100))

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-[#6B7280] font-sans">
        <span>{docsComplete} of {totalDocs} documents compiled</span>
        <span className="font-medium text-[#0F0F0F]">{percent}%</span>
      </div>
      <div className="w-full h-2 bg-white border border-[0.5px] border-border rounded-full overflow-hidden">
        <div
          className="h-full bg-[#BA7517] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
