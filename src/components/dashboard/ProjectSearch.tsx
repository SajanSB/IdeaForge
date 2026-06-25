import { IconSearch, IconX } from '@tabler/icons-react'
import { cn } from '@/utils/cn'

interface ProjectSearchProps {
  value:    string
  onChange: (value: string) => void
}

export function ProjectSearch({ value, onChange }: ProjectSearchProps) {
  return (
    <div className="relative">
      <IconSearch
        size={15}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search projects by idea..."
        aria-label="Search projects"
        className={cn(
          'w-full h-10 pl-9 pr-9 rounded-xl',
          'text-[13px] font-sans text-[#0F0F0F]',
          'bg-white border border-[0.5px] border-border',
          'placeholder:text-[#6B7280]/60',
          'focus:outline-none focus:border-[1.5px] focus:border-[#BA7517]',
          'focus:ring-2 focus:ring-[#BA7517]/15',
          'transition-colors duration-150',
        )}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#0F0F0F] transition-colors"
        >
          <IconX size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
