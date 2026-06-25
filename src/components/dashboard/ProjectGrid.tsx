import { memo } from 'react'
import { ProjectCard } from './ProjectCard'
import type { ProjectRecord } from '@/stores/useProjectStore'

interface ProjectGridProps {
  projects:  ProjectRecord[]
  onDelete:  (project: ProjectRecord) => void
}

export const ProjectGrid = memo(function ProjectGrid({ projects, onDelete }: ProjectGridProps) {
  return (
    <div
      role="list"
      aria-label="Your projects"
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      {projects.map(project => (
        <div key={project.projectId} role="listitem">
          <ProjectCard project={project} onDelete={onDelete} />
        </div>
      ))}
    </div>
  )
})
