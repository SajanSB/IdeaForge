import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconTrash, IconArrowRight, IconCheck, IconAlertCircle,
} from '@tabler/icons-react'
import { DocTag } from '@/components/brand/DocTag'
import { MonoId } from '@/components/brand/MonoId'
import { cn } from '@/utils/cn'
import type { ProjectRecord } from '@/stores/useProjectStore'
import type { ProjectStatus } from '@/types/project'
import { formatINR } from '@/utils/estimateCalc'

// ── Status badge sub-component ────────────────────────────────────────────────

function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = {
    complete:   { label: 'Complete',   dot: 'bg-[#639922]',       container: 'bg-[#EAF3DE] text-[#27500A]' },
    generating: { label: 'Generating', dot: 'bg-blue-500 animate-status-pulse', container: 'bg-[#E6F1FB] text-[#0C447C]' },
    failed:     { label: 'Failed',     dot: 'bg-red-500',          container: 'bg-[#FCEBEB] text-[#791F1F]' },
    draft:      { label: 'Draft',      dot: 'bg-gray-400',         container: 'bg-gray-100  text-gray-600'  },
    eliciting:  { label: 'In progress',dot: 'bg-gray-400',         container: 'bg-gray-100  text-gray-600'  },
    reviewing:  { label: 'Reviewing',  dot: 'bg-gray-400',         container: 'bg-gray-100  text-gray-600'  },
    estimating: { label: 'Estimating', dot: 'bg-gray-400',         container: 'bg-gray-100  text-gray-600'  },
    paying:     { label: 'Paying',     dot: 'bg-gray-400',         container: 'bg-gray-100  text-gray-600'  },
  }[status] ?? { label: status, dot: 'bg-gray-400', container: 'bg-gray-100 text-gray-600' }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-[3px] rounded-full text-[11px] font-medium border border-[0.5px] border-transparent font-sans',
      config.container
    )}>
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', config.dot)} aria-hidden="true" />
      {config.label}
    </span>
  )
}

// ── Progress bar sub-component ────────────────────────────────────────────────

function MiniProgressBar({ value, max = 13 }: { value: number; max?: number }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[11px] text-[#6B7280] font-sans">{value} / {max} documents</span>
        <span className="text-[11px] font-mono text-[#BA7517]">{pct}%</span>
      </div>
      <div className="h-1.5 bg-[#F7F5F0] rounded-full overflow-hidden border border-[0.5px] border-border">
        <div
          className="h-full bg-[#BA7517] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

// ── Main card component ───────────────────────────────────────────────────────

interface ProjectCardProps {
  project:   ProjectRecord
  onDelete:  (project: ProjectRecord) => void
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate     = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const projectCode  = `PRJ-${project.projectId.slice(0, 8).toUpperCase()}`
  const ideaSnippet  = project.ideaText.slice(0, 100)
  const dateStr      = new Intl.DateTimeFormat('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).format(new Date(project.createdAt))

  function handleOpen() {
    if (project.status === 'complete' || project.docsComplete > 0) {
      navigate(`/idea/${project.projectId}/documents`)
    } else if (project.status === 'generating') {
      navigate(`/idea/${project.projectId}/generating`)
    } else {
      navigate(`/project/${project.projectId}`)
    }
  }

  function handleDeleteClick(e: React.MouseEvent) {
    e.stopPropagation()  // prevent card click
    onDelete(project)
  }

  return (
    <article
      className={cn(
        'bg-white border border-[0.5px] rounded-xl overflow-hidden',
        'transition-colors duration-150 cursor-pointer group',
        isHovered ? 'border-[#BA7517]/30' : 'border-border',
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleOpen}
      aria-label={`Open project: ${ideaSnippet}`}
    >
      {/* Card header */}
      <div className="px-4 pt-4 pb-3">
        {/* Top row: doc tag + status */}
        <div className="flex items-center justify-between mb-3">
          <DocTag type="BRD" size="sm" />
          <StatusBadge status={project.status} />
        </div>

        {/* Idea snippet */}
        <p className="text-[14px] text-[#0F0F0F] leading-snug font-sans line-clamp-2 mb-3">
          {ideaSnippet}
          {project.ideaText.length > 100 && (
            <span className="text-[#6B7280]">...</span>
          )}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 flex-wrap">
          <MonoId>{projectCode}</MonoId>
          <span className="text-[#6B7280]/40 text-xs">·</span>
          <span className="text-[11px] text-[#6B7280] font-sans">{dateStr}</span>
          {project.amountPaidInr && (
            <>
              <span className="text-[#6B7280]/40 text-xs">·</span>
              <span className="text-[11px] font-mono text-[#6B7280]">
                {formatINR(project.amountPaidInr)}
              </span>
            </>
          )}
          {project.industry && (
            <>
              <span className="text-[#6B7280]/40 text-xs">·</span>
              <span className="text-[11px] text-[#6B7280] font-sans">{project.industry}</span>
            </>
          )}
        </div>
      </div>

      {/* Progress / doc count */}
      <div className="px-4 pb-3">
        {project.status === 'generating' ? (
          <MiniProgressBar value={project.docsComplete} />
        ) : project.status === 'complete' ? (
          <div className="flex items-center gap-1.5 mt-1">
            <IconCheck size={13} className="text-[#639922]" aria-hidden="true" />
            <span className="text-[12px] text-[#639922] font-sans">13 documents ready</span>
          </div>
        ) : project.status === 'failed' ? (
          <div className="flex items-center gap-1.5 mt-1">
            <IconAlertCircle size={13} className="text-red-500" aria-hidden="true" />
            <span className="text-[12px] text-red-600 font-sans">
              {project.docsComplete > 0 ? `${project.docsComplete} docs generated` : 'Generation failed'}
            </span>
          </div>
        ) : null}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-[0.5px] border-border bg-[#F7F5F0] flex items-center justify-between">
        {/* Open button */}
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`Open project: ${ideaSnippet.slice(0, 40)}`}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#BA7517] hover:text-[#A06010] transition-colors font-sans"
        >
          {project.status === 'complete' ? 'View documents' : 'Open'}
          <IconArrowRight size={13} aria-hidden="true" />
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label={`Delete project: ${ideaSnippet.slice(0, 40)}`}
          className="flex items-center justify-center w-7 h-7 rounded-lg text-[#6B7280] hover:bg-[#FCEBEB] hover:text-red-500 transition-colors"
        >
          <IconTrash size={14} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}
