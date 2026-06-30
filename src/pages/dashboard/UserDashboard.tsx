import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, FileText, Clock, AlertCircle, Trash2, Search, CheckCircle2, Loader2, RefreshCw } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { useToast } from '@/hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/common/PageHeader'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface DBProject {
  id: string
  idea_text: string
  industry: string | null
  status: 'draft' | 'generating' | 'complete' | 'failed'
  created_at: string
  doc_count: number
}

type StatusFilter = 'all' | 'complete' | 'generating' | 'failed'

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    complete: 'bg-success/10 text-success border-success/20',
    generating: 'bg-primary/10 text-primary border-primary/20',
    failed: 'bg-destructive/10 text-destructive border-destructive/20',
    draft: 'bg-white/5 text-chrome-muted border-chrome-border',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border', styles[status] ?? styles.draft)}>
      {status === 'generating' && <Loader2 className="h-2.5 w-2.5 animate-spin" />}
      {status === 'complete' && <CheckCircle2 className="h-2.5 w-2.5" />}
      {status === 'failed' && <AlertCircle className="h-2.5 w-2.5" />}
      {status.toUpperCase()}
    </span>
  )
}

function resumeHref(project: DBProject) {
  if (project.status === 'complete') return `/idea/${project.id}/documents`
  if (project.status === 'generating') return `/idea/${project.id}/generating`
  if (project.status === 'draft') return `/idea/${project.id}/elicitation`
  return `/idea/${project.id}/generating`
}

export function UserDashboard() {
  const { name } = useAuthStore()
  const { toast } = useToast()
  const [projects, setProjects] = useState<DBProject[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('id, idea_text, industry, status, created_at, documents(count)')
      .order('created_at', { ascending: false })

    if (error) toast({ title: 'Failed to load projects', description: error.message, variant: 'destructive' })
    else {
      setProjects((data ?? []).map((p: Record<string, unknown>) => ({
        id: p.id as string,
        idea_text: (p.idea_text as string) ?? '',
        industry: p.industry as string | null,
        status: p.status as DBProject['status'],
        created_at: p.created_at as string,
        doc_count: (p.documents as { count: number }[] | undefined)?.[0]?.count ?? 0,
      })))
    }
    setLoading(false)
  }, [toast])

  useEffect(() => { load() }, [load])

  const filtered = projects.filter((p) => {
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    const matchSearch = !search || p.idea_text.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const handleDeleteConfirm = async () => {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await supabase.from('projects').delete().eq('id', deleteId)
    setDeleting(false)
    if (error) { toast({ title: 'Delete failed', description: error.message, variant: 'destructive' }); return }
    setProjects((prev) => prev.filter((p) => p.id !== deleteId))
    toast({ title: 'Project deleted' })
    setDeleteId(null)
  }

  const deleteTarget = projects.find((p) => p.id === deleteId)
  const filterTabs: { key: StatusFilter; label: string }[] = [
    { key: 'all', label: 'All' }, { key: 'complete', label: 'Complete' },
    { key: 'generating', label: 'In progress' }, { key: 'failed', label: 'Failed' },
  ]

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title={`Welcome back, ${name || 'there'}`}
        description="Manage your documentation projects."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={load} disabled={loading} className="border-chrome-border">
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            </Button>
            <Button asChild className="gap-2">
              <Link to="/idea/new"><Plus className="h-4 w-4" /> New project</Link>
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total" value={loading ? '—' : projects.length} />
        <StatCard label="Complete" value={loading ? '—' : projects.filter((p) => p.status === 'complete').length} />
        <StatCard label="In progress" value={loading ? '—' : projects.filter((p) => p.status === 'generating').length} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 chrome-card p-1">
          {filterTabs.map((tab) => (
            <button key={tab.key} onClick={() => setStatusFilter(tab.key)}
              className={cn('px-3 py-1.5 text-xs font-mono rounded-md transition-colors',
                statusFilter === tab.key ? 'bg-primary/15 text-primary' : 'text-chrome-muted hover:text-foreground')}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-chrome-subtle" />
          <Input placeholder="Search projects…" value={search} onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-chrome-elevated border-chrome-border" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-chrome-muted" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={FileText} title={search || statusFilter !== 'all' ? 'No matching projects' : 'No projects yet'}
          description="Create your first project to generate SDLC documents."
          action={<Button asChild><Link to="/idea/new">Start your first project</Link></Button>} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <div key={project.id} className="chrome-card overflow-hidden flex flex-col hover:border-primary/30 transition-colors group">
              <div className="p-5 flex-1">
                <div className="flex items-start justify-between mb-3">
                  <StatusBadge status={project.status} />
                  <button onClick={() => setDeleteId(project.id)} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/10 text-chrome-subtle hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <h3 className="text-sm font-semibold line-clamp-2 mb-2">{project.idea_text.slice(0, 80) || 'Untitled'}</h3>
                <div className="flex items-center gap-3 text-[11px] text-chrome-subtle font-mono">
                  {project.industry && <span>{project.industry}</span>}
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />
                    {new Date(project.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                  <span>{project.doc_count} docs</span>
                </div>
              </div>
              <div className="px-5 pb-5">
                <Button asChild variant={project.status === 'complete' ? 'default' : 'outline'} className="w-full h-9 text-xs" disabled={project.status === 'failed'}>
                  <Link to={resumeHref(project)}>
                    {project.status === 'complete' ? 'View documents' : project.status === 'failed' ? 'Failed' : 'Continue'}
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="bg-chrome-elevated border-chrome-border max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete project?</DialogTitle>
            <DialogDescription>This permanently deletes the project and all documents.</DialogDescription>
          </DialogHeader>
          {deleteTarget && <p className="text-sm text-chrome-muted line-clamp-2 chrome-card p-3">{deleteTarget.idea_text}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={deleting}>
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
