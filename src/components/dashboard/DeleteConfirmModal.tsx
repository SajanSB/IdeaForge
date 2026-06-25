import { useRef, useEffect } from 'react'
import { IconAlertCircle } from '@tabler/icons-react'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteConfirmModalProps {
  isOpen:      boolean
  ideaSnippet: string   // first 80 chars of idea text
  projectCode: string   // e.g. PRJ-A1B2C3D4
  onConfirm:   () => void
  onDismiss:   () => void
  isDeleting?: boolean
}

export function DeleteConfirmModal({
  isOpen, ideaSnippet, projectCode, onConfirm, onDismiss, isDeleting
}: DeleteConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  // Focus the cancel button (safer default) when modal opens
  useEffect(() => {
    if (isOpen) setTimeout(() => cancelRef.current?.focus(), 50)
  }, [isOpen])

  const snippet = ideaSnippet.length > 80
    ? `${ideaSnippet.slice(0, 80)}...`
    : ideaSnippet

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onDismiss()}>
      <DialogContent
        className="max-w-sm w-full border border-[0.5px] border-border rounded-xl p-6"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-desc"
      >
        <DialogHeader>
          <div className="flex items-start gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-[#FCEBEB] flex items-center justify-center flex-shrink-0 mt-0.5">
              <IconAlertCircle size={18} className="text-red-500" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle
                id="delete-modal-title"
                className="text-[16px] font-medium text-[#0F0F0F] font-sans leading-snug"
              >
                Delete this project?
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <DialogDescription
          id="delete-modal-desc"
          className="text-[13px] text-[#6B7280] font-sans leading-relaxed mt-3"
          asChild
        >
          <div>
            <p className="mb-3">
              This will permanently remove{' '}
              <span className="font-medium text-[#0F0F0F]">{projectCode}</span>{' '}
              and all 13 generated documents. This cannot be undone.
            </p>
            <div className="bg-[#F7F5F0] border border-[0.5px] border-border rounded-lg px-3 py-2.5 mb-1">
              <p className="text-[12px] text-[#0F0F0F] font-sans leading-relaxed italic">
                "{snippet}"
              </p>
            </div>
          </div>
        </DialogDescription>

        <div className="flex items-center gap-2 mt-5">
          {/* Cancel — default focus */}
          <Button
            ref={cancelRef}
            type="button"
            variant="outline"
            onClick={onDismiss}
            disabled={isDeleting}
            className="flex-1 h-9 text-[13px] border-[0.5px]"
          >
            Keep it
          </Button>

          {/* Delete — destructive */}
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            aria-busy={isDeleting}
            className="flex-1 h-9 text-[13px] bg-red-600 hover:bg-red-700 text-white border-none"
          >
            {isDeleting ? 'Deleting...' : 'Delete project'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
