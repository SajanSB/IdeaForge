export type GuestProject = {
  id: string
  ideaText: string
  industry: string
  techPref: string
  createdAt: string
}

export type GuestQAItem = {
  q: string
  a?: string
  skipped?: boolean
  options?: string[]
}

const PROJECT_KEY = (id: string) => `guest_project_${id}`
const QA_KEY = (id: string) => `guest_qa_${id}`

export function saveGuestProject(project: GuestProject) {
  sessionStorage.setItem(PROJECT_KEY(project.id), JSON.stringify(project))
}

export function getGuestProject(id: string): GuestProject | null {
  try {
    const raw = sessionStorage.getItem(PROJECT_KEY(id))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveGuestQA(id: string, transcript: GuestQAItem[]) {
  sessionStorage.setItem(QA_KEY(id), JSON.stringify(transcript))
}

export function getGuestQA(id: string): GuestQAItem[] {
  try {
    const raw = sessionStorage.getItem(QA_KEY(id))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function isGuestProjectId(id: string) {
  return id.startsWith('guest-')
}

export function createGuestProjectId() {
  return `guest-${Math.random().toString(36).substring(2, 11)}`
}
