import { useState, useMemo, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { IconPlus, IconFolder } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useProjectStore }    from '@/stores/useProjectStore'
import { useDocumentStore }   from '@/stores/useDocumentStore'
import { ProjectGrid }        from '@/components/dashboard/ProjectGrid'
import { ProjectSearch }      from '@/components/dashboard/ProjectSearch'
import { DeleteConfirmModal } from '@/components/dashboard/DeleteConfirmModal'
import type { ProjectRecord } from '@/stores/useProjectStore'

// ── Skeleton card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden animate-pulse">
      <div className="px-4 pt-4 pb-3">
        <div className="flex justify-between mb-3">
          <div className="h-5 w-12 bg-[#F7F5F0] rounded" />
          <div className="h-5 w-20 bg-[#F7F5F0] rounded-full" />
        </div>
        <div className="space-y-2 mb-3">
          <div className="h-4 w-full bg-[#F7F5F0] rounded" />
          <div className="h-4 w-4/5 bg-[#F7F5F0] rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-24 bg-[#F7F5F0] rounded" />
          <div className="h-3 w-16 bg-[#F7F5F0] rounded" />
        </div>
      </div>
      <div className="px-4 py-3 border-t border-[0.5px] border-border bg-[#F7F5F0] flex justify-between">
        <div className="h-4 w-24 bg-[#E8E6E2] rounded" />
        <div className="h-5 w-5 bg-[#E8E6E2] rounded" />
      </div>
    </div>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div
      role="status"
      aria-label="No projects yet"
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-14 h-14 rounded-full bg-[#F7F5F0] border border-[0.5px] border-border flex items-center justify-center mb-5">
        <IconFolder size={24} className="text-[#6B7280]" aria-hidden="true" />
      </div>
      <h2 className="text-[18px] font-medium text-[#0F0F0F] mb-2 font-sans">
        No projects yet
      </h2>
      <p className="text-[14px] text-[#6B7280] font-sans mb-6 max-w-xs leading-relaxed">
        Generate your first SDLC documentation suite from a single idea description.
      </p>
      <Link to="/idea/new">
        <button className="inline-flex items-center gap-2 px-6 h-10 rounded-xl bg-[#BA7517] text-[#FFF8ED] text-[13px] font-medium font-sans hover:bg-[#A06010] transition-colors">
          <IconPlus size={15} aria-hidden="true" />
          Start your first generation
        </button>
      </Link>
    </div>
  )
}

// ── Main dashboard page ───────────────────────────────────────────────────────

export function DashboardPage() {
  const { getProjectsSorted, removeProject } = useProjectStore()
  const { clearAll: clearDocuments }         = useDocumentStore()

  const [searchQuery, setSearchQuery]       = useState('')
  const [isLoading, setIsLoading]           = useState(true)
  const [deleteTarget, setDeleteTarget]     = useState<ProjectRecord | null>(null)
  const [isDeleting, setIsDeleting]         = useState(false)

  useEffect(() => {
    document.title = 'Dashboard — IdeaForge'
    // Brief delay to let Zustand rehydrate from localStorage
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [])

  const projects = getProjectsSorted()

  // Filter by search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects
    const q = searchQuery.toLowerCase()
    return projects.filter(p =>
      p.ideaText.toLowerCase().includes(q) ||
      p.projectId.toLowerCase().includes(q) ||
      (p.industry ?? '').toLowerCase().includes(q)
    )
  }, [projects, searchQuery])

  const handleDelete = useCallback((project: ProjectRecord) => {
    setDeleteTarget(project)
  }, [])

  const handleConfirmDelete = useCallback(async () => {
    if (!deleteTarget) return
    setIsDeleting(true)

    try {
      // Remove from project store
      removeProject(deleteTarget.projectId)

      // Clear associated documents from localStorage
      // Note: useDocumentStore.clearAll clears the CURRENT project's docs
      // For multi-project support, we'd need per-project document keys
      // In v1 with single-project focus, clearAll is acceptable
      // TODO v2: implement per-project document namespacing in localStorage
      clearDocuments()

      toast.success('Project deleted')
      setDeleteTarget(null)
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Could not delete project. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }, [deleteTarget, removeProject, clearDocuments])

  const projectCode = deleteTarget
    ? `PRJ-${deleteTarget.projectId.slice(0, 8).toUpperCase()}`
    : ''

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Page heading row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans">
            Your projects
          </h1>
          {!isLoading && projects.length > 0 && (
            <p className="text-[13px] text-[#6B7280] font-sans mt-0.5">
              {projects.length} project{projects.length !== 1 ? 's' : ''} total
            </p>
          )}
        </div>

        {/* New idea button — hidden on mobile (FAB handles it) */}
        <Link to="/idea/new" className="hidden sm:block">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-4 h-9 rounded-xl bg-[#BA7517] text-[#FFF8ED] text-[13px] font-medium font-sans hover:bg-[#A06010] active:scale-[0.98] transition-all"
          >
            <IconPlus size={14} aria-hidden="true" />
            New idea
          </button>
        </Link>
      </div>

      {/* Search — only shown when there are projects */}
      {!isLoading && projects.length > 0 && (
        <div className="mb-5">
          <ProjectSearch value={searchQuery} onChange={setSearchQuery} />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        // Skeleton grid
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        // Empty state
        <EmptyState />
      ) : filteredProjects.length === 0 ? (
        // No search results
        <div className="text-center py-16">
          <p className="text-[14px] text-[#6B7280] font-sans mb-3">
            No projects match{' '}
            <span className="font-medium text-[#0F0F0F]">"{searchQuery}"</span>
          </p>
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="text-[13px] text-[#BA7517] hover:text-[#A06010] font-medium font-sans transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
        // Project grid
        <ProjectGrid
          projects={filteredProjects}
          onDelete={handleDelete}
        />
      )}

      {/* Mobile FAB — new idea */}
      <div className="sm:hidden">
        <Link to="/idea/new">
          <button
            type="button"
            aria-label="Start a new idea"
            className="fixed bottom-5 right-5 z-30 w-12 h-12 rounded-full bg-[#BA7517] text-[#FFF8ED] flex items-center justify-center shadow-md hover:bg-[#A06010] transition-colors"
          >
            <IconPlus size={20} aria-hidden="true" />
          </button>
        </Link>
      </div>

      {/* Delete confirmation modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        ideaSnippet={deleteTarget?.ideaText ?? ''}
        projectCode={projectCode}
        onConfirm={handleConfirmDelete}
        onDismiss={() => setDeleteTarget(null)}
        isDeleting={isDeleting}
      />

    </div>
  )
}
