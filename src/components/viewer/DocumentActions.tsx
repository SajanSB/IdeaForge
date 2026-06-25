import { IconCopy, IconCheck, IconDownload, IconMaximize } from '@tabler/icons-react'
import { cn } from '@/utils/cn'
import type { DocType } from '@/types/document'
import { DOC_NAMES } from '@/types/document'

interface DocumentActionsProps {
  docType:        DocType
  content:        string
  projectId:      string
  onCopy:         () => void
  onDownload:     () => void
  onFullscreen:   () => void
  justCopied:     boolean
}

export function DocumentActions({
  docType, onCopy, onDownload, onFullscreen, justCopied
}: DocumentActionsProps) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Copy */}
      <button
        type="button"
        onClick={onCopy}
        aria-label={justCopied ? 'Copied!' : `Copy ${DOC_NAMES[docType]} Markdown to clipboard`}
        title={justCopied ? 'Copied!' : 'Copy Markdown'}
        className={cn(
          'flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-sans border border-[0.5px] transition-all',
          justCopied
            ? 'bg-[#EAF3DE] border-green-200 text-[#27500A]'
            : 'bg-white border-border text-[#6B7280] hover:text-[#0F0F0F] hover:bg-[#F7F5F0]'
        )}
      >
        {justCopied
          ? <IconCheck size={13} aria-hidden="true" />
          : <IconCopy size={13} aria-hidden="true" />
        }
        <span className="hidden sm:inline">
          {justCopied ? 'Copied' : 'Copy'}
        </span>
      </button>

      {/* Download MD */}
      <button
        type="button"
        onClick={onDownload}
        aria-label={`Download ${DOC_NAMES[docType]} as Markdown file`}
        title="Download .md"
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-sans border border-[0.5px] border-border bg-white text-[#6B7280] hover:text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors"
      >
        <IconDownload size={13} aria-hidden="true" />
        <span className="hidden sm:inline">Download</span>
      </button>

      {/* Fullscreen */}
      <button
        type="button"
        onClick={onFullscreen}
        aria-label={`View ${DOC_NAMES[docType]} in fullscreen`}
        title="Fullscreen"
        className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-sans border border-[0.5px] border-border bg-white text-[#6B7280] hover:text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors"
      >
        <IconMaximize size={13} aria-hidden="true" />
        <span className="hidden sm:inline">Fullscreen</span>
      </button>
    </div>
  )
}
