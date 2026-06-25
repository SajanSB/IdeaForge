export const REQUIREMENT_ID_REGEX = /\b([A-Z]{2,4}-\d{3})\b/g

export function highlightRequirementIds(text: string): string {
  return text.replace(REQUIREMENT_ID_REGEX, '<span class="req-id">$1</span>')
}
