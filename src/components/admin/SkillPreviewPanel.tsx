import { MarkdownRenderer } from '../viewer/MarkdownRenderer'

interface SkillPreviewPanelProps {
  content: string
}

export function SkillPreviewPanel({ content }: SkillPreviewPanelProps) {
  return (
    <div className="border-[0.5px] border-border rounded-xl bg-white flex flex-col overflow-hidden h-full">
      <div className="p-3 border-b-[0.5px] border-border bg-[#F7F5F0] text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans select-none">
        Live Preview (Rendered Markdown)
      </div>
      <div className="flex-1 p-6 overflow-y-auto max-h-[500px]">
        {content ? (
          <MarkdownRenderer content={content} />
        ) : (
          <p className="text-[13px] text-[#6B7280] font-sans italic">
            Enter markdown content in the editor to preview.
          </p>
        )}
      </div>
    </div>
  )
}
