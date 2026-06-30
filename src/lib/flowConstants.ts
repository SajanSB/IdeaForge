export const FLOW_STEPS = [
  { key: 'idea', label: 'Idea', step: 1, path: 'new', description: 'Describe your product' },
  { key: 'qa', label: 'Q&A', step: 2, path: 'elicitation', description: 'Answer BA questions' },
  { key: 'review', label: 'Review', step: 3, path: 'review', description: 'Confirm understanding' },
  { key: 'estimate', label: 'Estimate', step: 4, path: 'estimate', description: 'Review token cost' },
  { key: 'generate', label: 'Generate', step: 5, path: 'generating', description: 'AI writes your docs' },
] as const

export type FlowStepKey = (typeof FLOW_STEPS)[number]['key']

export const DOC_META: Record<string, { name: string; short: string; agent: 'BA' | 'UX' | 'PE' }> = {
  brd:    { name: 'Business Requirements Document', short: 'BRD', agent: 'BA' },
  frd:    { name: 'Functional Requirements Document', short: 'FRD', agent: 'BA' },
  srs:    { name: 'System Requirements Specification', short: 'SRS', agent: 'BA' },
  bmp:    { name: 'Benefit Measurement Plan', short: 'BMP', agent: 'BA' },
  usr:    { name: 'User Stories', short: 'USR', agent: 'BA' },
  pfd:    { name: 'Process Flow Document', short: 'PFD', agent: 'BA' },
  uc:     { name: 'Use Cases', short: 'UC', agent: 'BA' },
  dmd:    { name: 'Data Mapping Document', short: 'DMD', agent: 'BA' },
  uat:    { name: 'UAT Testing Plan', short: 'UAT', agent: 'BA' },
  rtm:    { name: 'Requirements Traceability Matrix', short: 'RTM', agent: 'BA' },
  ux:     { name: 'UI/UX Specification', short: 'UX', agent: 'UX' },
  prompt: { name: 'AI Dev Prompt', short: 'PROMPT', agent: 'PE' },
}

export const AGENT_LABELS = {
  BA: { label: 'Business Analyst', color: 'agent-ba' as const },
  UX: { label: 'UX Designer', color: 'agent-ux' as const },
  PE: { label: 'Prompt Engineer', color: 'agent-pe' as const },
}
