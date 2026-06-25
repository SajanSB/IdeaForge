export type ProjectStatus = 'draft' | 'eliciting' | 'reviewing' | 'estimating' | 'paying' | 'generating' | 'complete' | 'failed'
export type Industry = 'SaaS' | 'E-commerce' | 'HealthTech' | 'EdTech' | 'FinTech' | 'FieldService' | 'Construction' | 'Other'
export type TechPreference = 'Any' | 'React' | 'NextJS' | 'Angular' | 'Vue' | 'Flutter' | 'Other'

export interface Project {
  projectId: string
  userId: string | null
  ideaText: string
  industry: Industry | ''
  techPreference: TechPreference
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}
