import { useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import {
  IconArrowLeft, IconArrowRight, IconCheck, IconAlertCircle,
  IconFileDescription, IconCreditCard,
} from '@tabler/icons-react'
import { useProjectStore }  from '@/stores/useProjectStore'
import { useDocumentStore } from '@/stores/useDocumentStore'
import { MonoId }           from '@/components/brand/MonoId'
import { DocTag }           from '@/components/brand/DocTag'
import { DOC_ORDER, DOC_NAMES } from '@/types/document'
import type { DocType }     from '@/types/document'
import { formatINR }        from '@/utils/estimateCalc'

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate      = useNavigate()

  const { getProject }  = useProjectStore()
  const { documents }   = useDocumentStore()

  const project = projectId ? getProject(projectId) : undefined

  useEffect(() => {
    document.title = project
      ? `${project.ideaText.slice(0, 40)}... — IdeaForge`
      : 'Project — IdeaForge'
  }, [project])

  // Not found
  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-[14px] text-[#6B7280] font-sans mb-4">
          This project could not be found.
        </p>
        <Link
          to="/dashboard"
          className="text-[13px] text-[#BA7517] hover:text-[#A06010] font-medium font-sans"
        >
          ← Back to dashboard
        </Link>
      </div>
    )
  }

  const projectCode   = `PRJ-${project.projectId.slice(0, 8).toUpperCase()}`
  const dateFormatted = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(project.createdAt))

  const docsWithContent  = DOC_ORDER.filter(d => !!documents[d as DocType])

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">

      {/* Back link */}
      <button
        type="button"
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors font-sans mb-6"
      >
        <IconArrowLeft size={14} aria-hidden="true" />
        Back to dashboard
      </button>

      {/* Heading */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MonoId>{projectCode}</MonoId>
          <span className="text-[11px] text-[#6B7280] font-sans">{dateFormatted}</span>
        </div>
        <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans leading-snug">
          {project.ideaText.slice(0, 80)}
          {project.ideaText.length > 80 && '...'}
        </h1>
      </div>

      {/* ── Idea card ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0]">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Application idea
          </p>
        </div>
        <div className="px-5 py-4">
          <p className="text-[14px] text-[#0F0F0F] font-sans leading-relaxed whitespace-pre-wrap">
            {project.ideaText}
          </p>
          {(project.industry || (project.techPreference && project.techPreference !== 'Any')) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[0.5px] border-border">
              {project.industry && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F7F5F0] border border-[0.5px] border-border text-[#6B7280] font-sans">
                  {project.industry}
                </span>
              )}
              {project.techPreference && project.techPreference !== 'Any' && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F7F5F0] border border-[0.5px] border-border text-[#6B7280] font-sans">
                  {project.techPreference}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Payment receipt card ─────────────────────────────────────────── */}
      {project.amountPaidInr && (
        <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-4">
          <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center gap-2">
            <IconCreditCard size={14} className="text-[#6B7280]" aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
              Payment receipt
            </p>
          </div>
          <div className="px-5 py-4 space-y-2.5">
            <div className="flex justify-between text-[13px] font-sans">
              <span className="text-[#6B7280]">Amount paid</span>
              <span className="font-medium text-[#0F0F0F] font-mono">{formatINR(project.amountPaidInr)}</span>
            </div>
            {project.gateway && (
              <div className="flex justify-between text-[13px] font-sans">
                <span className="text-[#6B7280]">Gateway</span>
                <span className="text-[#0F0F0F] capitalize">{project.gateway}</span>
              </div>
            )}
            {project.orderId && (
              <div className="flex justify-between text-[13px] font-sans">
                <span className="text-[#6B7280]">Order ID</span>
                <MonoId className="text-[11px]">{project.orderId.slice(0, 20)}...</MonoId>
              </div>
            )}
            <div className="flex justify-between text-[13px] font-sans">
              <span className="text-[#6B7280]">Status</span>
              <span className="text-[#27500A] font-medium">Paid ✓</span>
            </div>
          </div>
        </div>
      )}

      {/* ── Documents card ───────────────────────────────────────────────── */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconFileDescription size={14} className="text-[#6B7280]" aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
              Generated documents
            </p>
          </div>
          <span className="text-[11px] font-mono text-[#BA7517]">
            {docsWithContent.length} / {DOC_ORDER.length}
          </span>
        </div>
        <div className="divide-y divide-border">
          {DOC_ORDER.map(docType => {
            const hasContent = !!documents[docType as DocType]

            return (
              <div
                key={docType}
                className="flex items-center gap-3 px-5 py-3"
              >
                {hasContent
                  ? <IconCheck size={14} className="text-[#639922] flex-shrink-0" aria-hidden="true" />
                  : <IconAlertCircle size={14} className="text-[#6B7280]/40 flex-shrink-0" aria-hidden="true" />
                }
                <span className={`flex-1 text-[13px] font-sans ${hasContent ? 'text-[#0F0F0F]' : 'text-[#6B7280]/50'}`}>
                  {DOC_NAMES[docType as DocType]}
                </span>
                <DocTag
                  type={docType as DocType}
                  size="sm"
                  className={!hasContent ? 'opacity-40' : ''}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Open viewer */}
        {docsWithContent.length > 0 && (
          <button
            type="button"
            onClick={() => navigate(`/idea/${project.projectId}/documents`)}
            className="flex items-center justify-center gap-2 px-6 h-11 rounded-xl bg-[#BA7517] text-[#FFF8ED] text-[14px] font-medium font-sans hover:bg-[#A06010] active:scale-[0.98] transition-all"
          >
            Open document viewer
            <IconArrowRight size={15} aria-hidden="true" />
          </button>
        )}

        {/* Resume generation if incomplete */}
        {project.status === 'generating' && (
          <button
            type="button"
            onClick={() => navigate(`/idea/${project.projectId}/generating`)}
            className="flex items-center justify-center gap-2 px-6 h-11 rounded-xl border border-[0.5px] border-border bg-white text-[14px] font-medium font-sans text-[#0F0F0F] hover:bg-[#F7F5F0] transition-colors"
          >
            Resume generation
          </button>
        )}
      </div>

    </div>
  )
}
