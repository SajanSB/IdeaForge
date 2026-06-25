import { useRef, useEffect } from 'react'
import { IconAlertCircle } from '@tabler/icons-react'
import { MarkdownRenderer } from './MarkdownRenderer'
import { DocumentActions } from './DocumentActions'
import { TableOfContents } from './TableOfContents'
import { DocTag } from '@/components/brand/DocTag'
import { MonoId } from '@/components/brand/MonoId'
import { useClipboard } from '@/hooks/useClipboard'
import { DOC_NAMES } from '@/types/document'
import type { DocType } from '@/types/document'

interface DocumentPanelProps {
  docType:      DocType
  content:      string | null
  projectId:    string
  onDownload:   (docType: DocType, content: string) => void
  onFullscreen: () => void
}

// Skeleton for when a doc is loading or switching
function ContentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-7 w-3/4 bg-white rounded-lg" />
      <div className="h-[0.5px] w-full bg-border" />
      <div className="space-y-2 pt-2">
        {[100, 85, 90, 70, 95, 80].map((w, i) => (
          <div key={i} className="h-4 bg-[#EAE8E3]/60 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="h-5 w-1/3 bg-white rounded-lg mt-6" />
      <div className="h-32 w-full bg-[#EAE8E3]/60 rounded-xl" />
    </div>
  )
}

export function DocumentPanel({
  docType, content, projectId, onDownload, onFullscreen
}: DocumentPanelProps) {
  const { copy, justCopied } = useClipboard()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Scroll to top when active document changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [docType])

  function handleCopy() {
    if (content) copy(content, `${DOC_NAMES[docType]} copied to clipboard`)
  }

  function handleDownload() {
    if (content) onDownload(docType, content)
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden bg-[#F7F5F0]">

      {/* Panel header — doc name + actions */}
      <div className="h-12 flex items-center justify-between px-5 border-b border-[0.5px] border-border bg-white flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <DocTag type={docType} />
          <h2 className="text-[15px] font-medium text-[#0F0F0F] font-sans truncate">
            {DOC_NAMES[docType]}
          </h2>
          <MonoId className="flex-shrink-0 hidden sm:inline text-xs">
            {docType}-001
          </MonoId>
        </div>

        {/* Action buttons */}
        {content && (
          <DocumentActions
            docType={docType}
            content={content}
            projectId={projectId}
            onCopy={handleCopy}
            onDownload={handleDownload}
            onFullscreen={onFullscreen}
            justCopied={justCopied}
          />
        )}
      </div>

      {/* Content area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex gap-0 xl:gap-6 max-w-none">

          {/* Document content */}
          <div className="flex-1 min-w-0 px-6 py-6 sm:px-8 sm:py-8">
            <div className="bg-white border border-[0.5px] border-border rounded-xl p-6 sm:p-8">
              {content === null ? (
                // Skeleton while switching
                <ContentSkeleton />
              ) : content === '' ? (
                // Document unavailable
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F7F5F0] flex items-center justify-center mb-4">
                    <IconAlertCircle size={22} className="text-[#6B7280]" aria-hidden="true" />
                  </div>
                  <h3 className="text-[15px] font-medium text-[#0F0F0F] mb-2 font-sans">
                    Document not available
                  </h3>
                  <p className="text-[13px] text-[#6B7280] max-w-sm leading-relaxed font-sans">
                    This document wasn't found in your browser storage. Your payment and generation records are safe.
                  </p>
                  <a
                    href="mailto:support@ideaforge.ai"
                    className="mt-4 text-[13px] text-[#BA7517] hover:text-[#A06010] font-medium font-sans"
                  >
                    Contact support →
                  </a>
                </div>
              ) : (
                <MarkdownRenderer content={content} />
              )}
            </div>
          </div>

          {/* Table of contents — desktop only */}
          {content && content.length > 500 && (
            <TableOfContents content={content} />
          )}

        </div>
      </div>
    </div>
  )
}
