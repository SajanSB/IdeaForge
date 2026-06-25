import { useState, useCallback } from 'react'
import { toast } from 'sonner'

export function useClipboard() {
  const [justCopied, setJustCopied] = useState(false)

  const copy = useCallback(async (text: string, label = 'Copied to clipboard') => {
    try {
      await navigator.clipboard.writeText(text)
      setJustCopied(true)
      toast.success(label)
      setTimeout(() => setJustCopied(false), 2000)
    } catch {
      // Fallback for browsers that block clipboard API
      try {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        setJustCopied(true)
        toast.success(label)
        setTimeout(() => setJustCopied(false), 2000)
      } catch {
        toast.error('Copy failed — please select and copy manually.')
      }
    }
  }, [])

  return { copy, justCopied }
}
