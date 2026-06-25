import { useState, useEffect, useCallback } from 'react'

interface StorageUsage {
  usedBytes:     number
  usedKB:        number
  usedMB:        number
  percentUsed:   number   // % of 5MB
  isWarning:     boolean  // ≥ 70% used
  isCritical:    boolean  // ≥ 85% used
  keyCount:      number
  ideaforgeKeys: string[] // keys belonging to IdeaForge
}

const ESTIMATED_LIMIT_BYTES = 5 * 1024 * 1024  // 5MB conservative estimate
const WARNING_THRESHOLD  = 0.70  // 70%
const CRITICAL_THRESHOLD = 0.85  // 85%

function measureStorage(): StorageUsage {
  let totalBytes       = 0
  const ideaforgeKeys: string[] = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue
      const value = localStorage.getItem(key) ?? ''
      // Each character in localStorage is approximately 2 bytes (UTF-16)
      const bytes = (key.length + value.length) * 2
      totalBytes += bytes
      if (key.startsWith('ideaforge_')) {
        ideaforgeKeys.push(key)
      }
    }
  } catch {
    // localStorage may be inaccessible in some contexts
  }

  const percent = totalBytes / ESTIMATED_LIMIT_BYTES

  return {
    usedBytes:     totalBytes,
    usedKB:        Math.round(totalBytes / 1024),
    usedMB:        Math.round((totalBytes / (1024 * 1024)) * 100) / 100,
    percentUsed:   Math.min(100, Math.round(percent * 100)),
    isWarning:     percent >= WARNING_THRESHOLD,
    isCritical:    percent >= CRITICAL_THRESHOLD,
    keyCount:      localStorage.length,
    ideaforgeKeys,
  }
}

export function useLocalStorageUsage() {
  const [usage, setUsage] = useState<StorageUsage>(() => measureStorage())

  const refresh = useCallback(() => {
    setUsage(measureStorage())
  }, [])

  // Refresh on mount and when storage events fire
  useEffect(() => {
    refresh()
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [refresh])

  return { usage, refresh }
}
