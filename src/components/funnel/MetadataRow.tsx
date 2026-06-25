import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import type { Industry, TechPreference } from '@/types/project'

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: 'SaaS',         label: 'SaaS' },
  { value: 'E-commerce',   label: 'E-commerce' },
  { value: 'HealthTech',   label: 'HealthTech' },
  { value: 'EdTech',       label: 'EdTech' },
  { value: 'FinTech',      label: 'FinTech' },
  { value: 'FieldService', label: 'Field Service' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Other',        label: 'Other' },
]

const TECH_PREFERENCES: { value: TechPreference; label: string }[] = [
  { value: 'Any',     label: 'Any (let AI decide)' },
  { value: 'React',   label: 'React' },
  { value: 'NextJS',  label: 'Next.js' },
  { value: 'Angular', label: 'Angular' },
  { value: 'Vue',     label: 'Vue' },
  { value: 'Flutter', label: 'Flutter' },
  { value: 'Other',   label: 'Other' },
]

interface MetadataRowProps {
  industry: Industry | ''
  techPreference: TechPreference
  onIndustryChange: (value: Industry | '') => void
  onTechChange: (value: TechPreference) => void
}

export function MetadataRow({
  industry,
  techPreference,
  onIndustryChange,
  onTechChange,
}: MetadataRowProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

      {/* Industry */}
      <div className="space-y-1.5">
        <Label
          htmlFor="industry-select"
          className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans"
        >
          Industry
          <span className="ml-1 text-[#6B7280]/60 normal-case tracking-normal font-normal">
            (optional)
          </span>
        </Label>
        <Select
          value={industry || ''}
          onValueChange={(v) => onIndustryChange(v as Industry | '')}
        >
          <SelectTrigger
            id="industry-select"
            className="h-10 text-[13px] border-[0.5px] bg-white focus:ring-[#BA7517]/15 focus:border-[#BA7517]"
          >
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="text-[13px]">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tech preference */}
      <div className="space-y-1.5">
        <Label
          htmlFor="tech-select"
          className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans"
        >
          Tech preference
          <span className="ml-1 text-[#6B7280]/60 normal-case tracking-normal font-normal">
            (optional)
          </span>
        </Label>
        <Select
          value={techPreference}
          onValueChange={(v) => onTechChange(v as TechPreference)}
        >
          <SelectTrigger
            id="tech-select"
            className="h-10 text-[13px] border-[0.5px] bg-white focus:ring-[#BA7517]/15 focus:border-[#BA7517]"
          >
            <SelectValue placeholder="Select preference" />
          </SelectTrigger>
          <SelectContent>
            {TECH_PREFERENCES.map(({ value, label }) => (
              <SelectItem key={value} value={value} className="text-[13px]">
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

    </div>
  )
}
