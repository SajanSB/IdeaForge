export type DocType =
  | 'BRD' | 'FRD' | 'SRS' | 'BMP' | 'USR' | 'PFD'
  | 'UC'  | 'DMD' | 'UAT' | 'RTM' | 'UIUX'
  | 'DEVPROMPT' | 'ELICITATION'

export type AgentType  = 'ba' | 'ux' | 'pe'
export type DocStatus  = 'pending' | 'generating' | 'complete' | 'failed'

export interface GeneratedDocument {
  documentId: string
  projectId: string
  docType: DocType
  agent: AgentType
  sequence: number
  contentMd: string | null
  tokensInput: number
  tokensOutput: number
  status: DocStatus
  generatedAt?: string
}

// Ordered generation sequence — MUST match the pipeline order
export const DOC_ORDER: DocType[] = [
  'BRD', 'FRD', 'SRS', 'BMP', 'USR', 'PFD', 'UC', 'DMD', 'UAT', 'RTM',  // BA agent (10)
  'UIUX',                                                                    // UX agent (1)
  'DEVPROMPT',                                                               // PE agent (1)
  'ELICITATION',                                                             // Q&A transcript (1)
]

export const DOC_NAMES: Record<DocType, string> = {
  BRD:         'Business Requirements Doc',
  FRD:         'Functional Requirements',
  SRS:         'System Requirements Spec',
  BMP:         'Benefit Measurement Plan',
  USR:         'User Stories',
  PFD:         'Process Flow Diagrams',
  UC:          'Use Cases',
  DMD:         'Data Mapping Document',
  UAT:         'User Acceptance Testing',
  RTM:         'Requirements Traceability',
  UIUX:        'UI/UX Specification',
  DEVPROMPT:   'AI Dev Prompt',
  ELICITATION: 'Elicitation Q&A',
}

export const DOC_AGENT: Record<DocType, AgentType> = {
  BRD: 'ba', FRD: 'ba', SRS: 'ba', BMP: 'ba', USR: 'ba',
  PFD: 'ba', UC:  'ba', DMD: 'ba', UAT: 'ba', RTM: 'ba',
  UIUX: 'ux', DEVPROMPT: 'pe', ELICITATION: 'ba',
}

// max_tokens per document type
export const DOC_MAX_TOKENS: Record<DocType, number> = {
  BRD: 8000,  FRD: 10000, SRS: 8000,  BMP: 4000,
  USR: 10000, PFD: 6000,  UC:  6000,  DMD: 6000,
  UAT: 6000,  RTM: 6000,  UIUX: 12000,
  DEVPROMPT: 10000, ELICITATION: 2000,
}

// Temperature per agent
export const AGENT_TEMPERATURE: Record<AgentType, number> = {
  ba: 0.3,
  ux: 0.4,
  pe: 0.2,
}
