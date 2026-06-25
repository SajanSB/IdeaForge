interface SkillEditorProps {
  value:     string
  onChange:  (val: string) => void
  disabled?: boolean
  maxLength?: number
}

export function SkillEditor({ value, onChange, disabled, maxLength = 50000 }: SkillEditorProps) {
  return (
    <div className="border-[0.5px] border-border rounded-xl bg-white flex flex-col overflow-hidden h-full">
      <div className="p-3 border-b-[0.5px] border-border bg-[#F7F5F0] flex justify-between items-center select-none">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
          SKILL.md Editor
        </span>
      </div>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 w-full p-4 font-mono text-[13px] leading-7 outline-none bg-white text-[#0F0F0F] resize-none min-h-[400px]"
        placeholder="# Write skill directives here..."
      />
      <div className="p-3 border-t-[0.5px] border-border bg-[#F7F5F0] flex justify-between items-center select-none font-sans text-[10px] text-[#6B7280]">
        <span>CHARACTERS: {value.length.toLocaleString()} / {maxLength.toLocaleString()}</span>
      </div>
    </div>
  )
}
