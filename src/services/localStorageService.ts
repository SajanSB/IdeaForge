const SCHEMA_VERSION = 'v1'
const PREFIX = `ideaforge_${SCHEMA_VERSION}`

export const ls = {
  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`${PREFIX}_${key}`)
      return raw ? (JSON.parse(raw) as T) : null
    } catch { return null }
  },
  set<T>(key: string, value: T): void {
    try { localStorage.setItem(`${PREFIX}_${key}`, JSON.stringify(value)) } catch {}
  },
  remove(key: string): void {
    try { localStorage.removeItem(`${PREFIX}_${key}`) } catch {}
  },
  clear(prefix?: string): void {
    const target = prefix ? `${PREFIX}_${prefix}` : PREFIX
    Object.keys(localStorage)
      .filter(k => k.startsWith(target))
      .forEach(k => localStorage.removeItem(k))
  },
}
