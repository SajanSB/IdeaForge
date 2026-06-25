interface VersionBadgeProps {
  version:     number
  publishedAt: string
  publishedBy: string
}

export function VersionBadge({ version, publishedAt, publishedBy }: VersionBadgeProps) {
  const dateStr = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(publishedAt))

  return (
    <span
      className="font-mono text-[11px] bg-[#FAEEDA] text-[#BA7517] px-2.5 py-1 rounded-md"
      aria-label={`Version ${version}, published ${dateStr} by ${publishedBy}`}
    >
      v{version} · {dateStr}
    </span>
  )
}
