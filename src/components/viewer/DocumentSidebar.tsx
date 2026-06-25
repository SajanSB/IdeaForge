import { IconPackage, IconLoader2 } from '@tabler/icons-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarSection } from './SidebarSection'
import { SidebarItem } from './SidebarItem'
import { cn } from '@/utils/cn'
import type { DocType } from '@/types/document'

const BA_DOCS: DocType[] = ['BRD', 'FRD', 'SRS', 'BMP', 'USR', 'PFD', 'UC', 'DMD', 'UAT', 'RTM']
const UX_DOCS: DocType[] = ['UIUX']
const PE_DOCS: DocType[] = ['DEVPROMPT']

interface DocumentSidebarProps {
  documents:    Record<DocType, string | null>
  activeDoc:    DocType
  onSelectDoc:  (docType: DocType) => void
  onExportZip:  () => void
  isExporting:  boolean
}

export function DocumentSidebar({
  documents, activeDoc, onSelectDoc, onExportZip, isExporting
}: DocumentSidebarProps) {
  const completeCount = Object.values(documents).filter(Boolean).length

  return (
    <nav
      role="navigation"
      aria-label="Generated documents"
      className="w-full bg-white border-r border-[0.5px] border-border flex flex-col h-full animate-fade-in"
    >
      {/* Sidebar header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-[0.5px] border-border flex-shrink-0">
        <span className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
          Documents
        </span>
        <span className="text-[11px] font-mono text-[#BA7517]">
          {completeCount}/13
        </span>
      </div>

      {/* Scrollable document list */}
      <ScrollArea className="flex-1 py-2">
        {/* BA Agent section */}
        <SidebarSection
          agent="ba"
          label="BA Agent"
          docs={BA_DOCS}
          documents={documents}
          activeDoc={activeDoc}
          onSelect={onSelectDoc}
        />

        {/* Divider */}
        <div className="mx-4 my-2 border-t border-[0.5px] border-border" />

        {/* UX Agent section */}
        <SidebarSection
          agent="ux"
          label="UX Agent"
          docs={UX_DOCS}
          documents={documents}
          activeDoc={activeDoc}
          onSelect={onSelectDoc}
        />

        {/* Divider */}
        <div className="mx-4 my-2 border-t border-[0.5px] border-border" />

        {/* PE Agent section */}
        <SidebarSection
          agent="pe"
          label="Prompt Engineer"
          docs={PE_DOCS}
          documents={documents}
          activeDoc={activeDoc}
          onSelect={onSelectDoc}
        />

        {/* Divider */}
        <div className="mx-4 my-2 border-t border-[0.5px] border-border" />

        {/* Elicitation Q&A — standalone */}
        <div className="px-2">
          <SidebarItem
            docType="ELICITATION"
            isActive={activeDoc === 'ELICITATION'}
            hasContent={!!documents['ELICITATION']}
            onClick={() => onSelectDoc('ELICITATION')}
          />
        </div>
      </ScrollArea>

      {/* Export ZIP button — pinned to bottom */}
      <div className="p-3 border-t border-[0.5px] border-border flex-shrink-0">
        <button
          type="button"
          onClick={onExportZip}
          disabled={isExporting || completeCount === 0}
          aria-label="Export all 13 documents as ZIP file"
          aria-busy={isExporting}
          className={cn(
            'w-full flex items-center justify-center gap-2',
            'h-9 rounded-lg text-[13px] font-medium font-sans',
            'border border-[0.5px] transition-colors',
            isExporting || completeCount === 0
              ? 'border-border text-[#6B7280]/50 cursor-not-allowed'
              : 'border-border bg-white text-[#0F0F0F] hover:bg-[#F7F5F0]'
          )}
        >
          {isExporting
            ? <IconLoader2 size={14} className="animate-spin text-[#6B7280]" aria-hidden="true" />
            : <IconPackage size={14} aria-hidden="true" />
          }
          {isExporting ? 'Exporting...' : 'Export all (ZIP)'}
        </button>
      </div>
    </nav>
  )
}
