import { useCallback, useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from 'sonner'
import { DOC_ORDER, DOC_NAMES } from '@/types/document'
import type { DocType } from '@/types/document'

export function useDocumentExport() {
  const [isExporting, setIsExporting] = useState(false)

  // Download a single document as a .md file
  const downloadSingle = useCallback((
    docType: DocType,
    content: string,
    projectId: string
  ) => {
    try {
      const slug    = DOC_NAMES[docType].replace(/\s+/g, '-').toLowerCase()
      const filename = `${docType}-${slug}-${projectId.slice(0, 8)}.md`
      const blob    = new Blob([content], { type: 'text/markdown;charset=utf-8' })

      // Use file-saver for cross-browser compatibility
      saveAs(blob, filename)
      toast.success(`${DOC_NAMES[docType]} downloaded`)
    } catch (err) {
      console.error('Download failed:', err)
      toast.error('Download failed. Please try again.')
    }
  }, [])

  // Download all documents as a ZIP archive
  const downloadAllZip = useCallback(async (
    documents: Partial<Record<DocType, string | null>>,
    projectId: string
  ) => {
    setIsExporting(true)
    try {
      const zip = new JSZip()

      // Create a folder inside the ZIP
      const folder = zip.folder(`ideaforge-${projectId.slice(0, 8)}-docs`)
      if (!folder) throw new Error('Could not create ZIP folder')

      let fileCount = 0
      for (const docType of DOC_ORDER) {
        const content = documents[docType]
        if (content) {
          const slug     = DOC_NAMES[docType].replace(/\s+/g, '-').toLowerCase()
          const filename = `${String(DOC_ORDER.indexOf(docType) + 1).padStart(2, '0')}-${docType}-${slug}.md`
          folder.file(filename, content)
          fileCount++
        }
      }

      if (fileCount === 0) {
        toast.error('No documents to export.')
        return
      }

      const blob = await zip.generateAsync({
        type:               'blob',
        compression:        'DEFLATE',
        compressionOptions: { level: 6 },
      })

      saveAs(blob, `ideaforge-${projectId.slice(0, 8)}-docs.zip`)
      toast.success(`All ${fileCount} documents exported as ZIP`)
    } catch (err) {
      console.error('ZIP export failed:', err)
      toast.error('Export failed. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { downloadSingle, downloadAllZip, isExporting }
}
