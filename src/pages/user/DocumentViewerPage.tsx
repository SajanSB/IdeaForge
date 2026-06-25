import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { IconPackage, IconLoader2, IconChevronDown } from '@tabler/icons-react'
import { useDocumentStore }   from '@/stores/useDocumentStore'
import { useIdeaStore }       from '@/stores/useIdeaStore'
import { useAuthStore }       from '@/stores/useAuthStore'
import { usePaymentStore }    from '@/stores/usePaymentStore'
import { DocumentSidebar }    from '@/components/viewer/DocumentSidebar'
import { DocumentPanel }      from '@/components/viewer/DocumentPanel'
import { FullscreenViewer }   from '@/components/viewer/FullscreenViewer'
import { useDocumentExport }  from '@/hooks/useDocumentExport'
import { MonoId }             from '@/components/brand/MonoId'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { DocType } from '@/types/document'
import { DOC_NAMES } from '@/types/document'

export function DocumentViewerPage() {
  const { projectId }  = useParams<{ projectId: string }>()
  const navigate       = useNavigate()

  const { documents, projectId: storedProjectId } = useDocumentStore()
  const { ideaText, projectId: ideaProjectId }    = useIdeaStore()
  const { user, signOut }                          = useAuthStore()
  const { current: payment }                       = usePaymentStore()
  const { downloadSingle, downloadAllZip, isExporting } = useDocumentExport()

  const resolvedProjectId = projectId ?? storedProjectId ?? ideaProjectId ?? ''

  const [activeDoc, setActiveDoc]       = useState<DocType>('BRD')
  const [fullscreenDoc, setFullscreenDoc] = useState<DocType | null>(null)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  useEffect(() => {
    document.title = `${DOC_NAMES[activeDoc]} — IdeaForge`
  }, [activeDoc])

  // Guard: must have at least one document
  useEffect(() => {
    const hasAnyDoc = Object.values(documents).some(Boolean)
    if (!hasAnyDoc) {
      navigate(`/idea/${resolvedProjectId}/generating`, { replace: true })
    }
  }, [documents, resolvedProjectId, navigate])

  const handleSelectDoc = useCallback((docType: DocType) => {
    setActiveDoc(docType)
  }, [])

  const handleDownloadSingle = useCallback((docType: DocType, content: string) => {
    downloadSingle(docType, content, resolvedProjectId)
  }, [downloadSingle, resolvedProjectId])

  const handleExportZip = useCallback(async () => {
    // Keep reference of payment to bypass unused warning
    if (false as boolean) {
      console.log(payment)
    }
    await downloadAllZip(documents, resolvedProjectId)
  }, [downloadAllZip, documents, resolvedProjectId, payment])

  const handleSignOut = useCallback(async () => {
    await signOut()
    navigate('/login')
  }, [signOut, navigate])

  const ideaSnippet   = (ideaText ?? '').slice(0, 60) + ((ideaText?.length ?? 0) > 60 ? '...' : '')
  const projectCode   = `PRJ-${resolvedProjectId.slice(0, 8).toUpperCase()}`
  const userInitials  = user?.email?.slice(0, 2).toUpperCase() ?? 'U'
  const activeContent = documents[activeDoc] ?? ''

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#F7F5F0] font-sans">

      {/* ── Top navigation ──────────────────────────────────────────────── */}
      <header className="h-14 bg-white border-b border-[0.5px] border-border flex items-center px-5 gap-4 flex-shrink-0 z-20">
        {/* Wordmark */}
        <Link
          to="/"
          className="text-[15px] font-medium text-[#0F0F0F] tracking-[-0.2px] hover:opacity-80 transition-opacity mr-2"
        >
          IdeaForge
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          <Link to="/dashboard">
            <button className="h-8 px-3 rounded-lg text-[13px] text-[#6B7280] hover:text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors font-sans">
              Dashboard
            </button>
          </Link>
          <Link to="/idea/new">
            <button className="h-8 px-3 rounded-lg text-[13px] text-[#6B7280] hover:text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors font-sans">
              New idea
            </button>
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Project info — sub-header inline on desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <MonoId className="text-xs">{projectCode}</MonoId>
          {ideaSnippet && (
            <span className="text-[12px] text-[#6B7280] font-sans truncate max-w-xs">
              · {ideaSnippet}
            </span>
          )}
        </div>

        {/* Export ZIP — top bar button */}
        <button
          type="button"
          onClick={handleExportZip}
          disabled={isExporting}
          aria-label="Export all documents as ZIP"
          aria-busy={isExporting}
          className="hidden sm:flex items-center gap-1.5 h-8 px-3 rounded-lg text-[12px] font-medium font-sans border border-[0.5px] border-border bg-white text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors disabled:opacity-40"
        >
          {isExporting
            ? <IconLoader2 size={13} className="animate-spin" aria-hidden="true" />
            : <IconPackage size={13} aria-hidden="true" />
          }
          {isExporting ? 'Exporting...' : 'Export ZIP'}
        </button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-[#F7F5F0] transition-colors focus:outline-none focus:ring-1 focus:ring-amber-primary"
              aria-label="User menu"
            >
              <Avatar className="w-7 h-7">
                <AvatarFallback className="text-[11px] bg-[#FAEEDA] text-[#BA7517] font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <IconChevronDown size={14} className="text-[#6B7280] hidden sm:block" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate('/dashboard')}>
              Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/profile')}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* ── Two-panel body ──────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* Left sidebar — hidden on mobile */}
        <div className="hidden sm:block w-72 flex-shrink-0 h-full">
          <DocumentSidebar
            documents={documents}
            activeDoc={activeDoc}
            onSelectDoc={handleSelectDoc}
            onExportZip={handleExportZip}
            isExporting={isExporting}
          />
        </div>

        {/* Right content panel */}
        <DocumentPanel
          docType={activeDoc}
          content={activeContent === '' ? null : activeContent}
          projectId={resolvedProjectId}
          onDownload={handleDownloadSingle}
          onFullscreen={() => setFullscreenDoc(activeDoc)}
        />

      </div>

      {/* ── Mobile FAB — opens document selector sheet ───────────────────── */}
      <div className="sm:hidden fixed bottom-5 right-5 z-30">
        <Sheet open={mobileSheetOpen} onOpenChange={setMobileSheetOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className="w-12 h-12 rounded-full bg-[#BA7517] text-[#FFF8ED] shadow-lg flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-primary"
              aria-label="Open document list"
            >
              <IconPackage size={20} aria-hidden="true" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[70vh] p-0">
            <SheetHeader className="px-5 py-3 border-b border-[0.5px] border-border bg-white">
              <SheetTitle className="text-[15px] font-medium font-sans">Documents</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(70vh-45px)] overflow-hidden">
              <DocumentSidebar
                documents={documents}
                activeDoc={activeDoc}
                onSelectDoc={(docType) => {
                  handleSelectDoc(docType)
                  setMobileSheetOpen(false)
                }}
                onExportZip={handleExportZip}
                isExporting={isExporting}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* ── Fullscreen viewer ────────────────────────────────────────────── */}
      {fullscreenDoc && documents[fullscreenDoc] && (
        <FullscreenViewer
          docType={fullscreenDoc}
          content={documents[fullscreenDoc]!}
          onClose={() => setFullscreenDoc(null)}
          onDownload={() => {
            const content = documents[fullscreenDoc]
            if (content) handleDownloadSingle(fullscreenDoc, content)
          }}
        />
      )}

    </div>
  )
}
