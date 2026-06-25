import { useEffect, useRef } from 'react'
import { IconX, IconDownload } from '@tabler/icons-react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { DocTag } from '@/components/brand/DocTag'
import { MonoId } from '@/components/brand/MonoId'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DOC_NAMES } from '@/types/document'
import type { DocType } from '@/types/document'

interface FullscreenViewerProps {
  docType:    DocType
  content:    string
  onClose:    () => void
  onDownload: () => void
}

export function FullscreenViewer({
  docType, content, onClose, onDownload
}: FullscreenViewerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus close button on open
  useEffect(() => {
    closeButtonRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Prevent body scroll while fullscreen is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${DOC_NAMES[docType]} — fullscreen`}
      className="fixed inset-0 z-50 bg-white flex flex-col"
    >
      {/* Fullscreen header */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-[0.5px] border-border bg-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <DocTag type={docType} />
          <span className="text-[15px] font-medium text-[#0F0F0F] font-sans">
            {DOC_NAMES[docType]}
          </span>
          <MonoId>{docType}-001</MonoId>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDownload}
            aria-label={`Download ${DOC_NAMES[docType]} as Markdown file`}
            className="flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-sans border border-[0.5px] border-border text-[#6B7280] hover:text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors"
          >
            <IconDownload size={13} aria-hidden="true" />
            Download
          </button>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close fullscreen view"
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-[0.5px] border-border text-[#6B7280] hover:text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors"
          >
            <IconX size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1">
        <div className="max-w-3xl mx-auto px-8 py-8">
          <MarkdownRenderer content={content} />
        </div>
      </ScrollArea>
    </div>
  )
}
