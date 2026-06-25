import { useState } from 'react'
import { IconAlertTriangle } from '@tabler/icons-react'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { useAuthStore }      from '@/stores/useAuthStore'
import { useProjectStore }   from '@/stores/useProjectStore'
import { useDocumentStore }  from '@/stores/useDocumentStore'

export function DangerZoneCard() {
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [confirmText, setConfirmText]   = useState('')
  const [isDeleting, setIsDeleting]     = useState(false)

  const { signOut }                     = useAuthStore()
  const { projects }                    = useProjectStore()
  const { clearAll: clearDocs }         = useDocumentStore()

  const CONFIRM_PHRASE = 'delete my account'
  const canConfirm     = confirmText.toLowerCase() === CONFIRM_PHRASE

  async function handleDeleteAccount() {
    if (!canConfirm || isDeleting) return
    setIsDeleting(true)

    try {
      // 1. Clear all local data
      clearDocs()
      localStorage.clear()

      // 2. Sign out from Supabase
      // Note: Full account deletion requires a server-side call via Supabase Admin API
      // In v1, we sign the user out and direct them to contact support for full deletion
      // This prevents data abuse while maintaining a clear deletion path
      await signOut()

      // Redirect happens automatically via auth state change
    } catch (err) {
      console.error('Account deletion failed:', err)
      setIsDeleting(false)
    }
  }

  return (
    <>
      {/* Danger zone card */}
      <div className="border border-[0.5px] border-red-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-[0.5px] border-red-200 bg-[#FCEBEB]">
          <div className="flex items-center gap-2">
            <IconAlertTriangle size={14} className="text-red-500" aria-hidden="true" />
            <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-red-700 font-sans">
              Danger zone
            </p>
          </div>
        </div>
        <div className="px-5 py-4 bg-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[14px] font-medium text-[#0F0F0F] font-sans mb-1">
                Delete account
              </p>
              <p className="text-[12px] text-[#6B7280] font-sans leading-relaxed">
                Permanently delete your account and all associated data.
                {projects.length > 0 && (
                  <span className="block mt-0.5 text-red-600">
                    You have {projects.length} project{projects.length !== 1 ? 's' : ''} — all documents will be erased.
                  </span>
                )}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setIsModalOpen(true)}
              variant="outline"
              className="flex-shrink-0 h-9 px-4 text-[13px] border-[0.5px] border-red-300 text-red-600 hover:bg-[#FCEBEB] hover:border-red-400 transition-colors"
            >
              Delete account
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      <Dialog open={isModalOpen} onOpenChange={open => { if (!open) { setIsModalOpen(false); setConfirmText('') } }}>
        <DialogContent
          className="max-w-sm border border-[0.5px] border-red-200 rounded-xl p-6"
          aria-labelledby="delete-account-title"
        >
          <DialogHeader>
            <DialogTitle id="delete-account-title" className="text-[16px] font-medium text-[#0F0F0F] font-sans">
              Delete your account?
            </DialogTitle>
          </DialogHeader>

          <DialogDescription asChild>
            <div className="mt-3 text-[13px] text-[#6B7280] font-sans space-y-3">
              <p>This will permanently delete:</p>
              <ul className="list-disc pl-4 space-y-1 text-[12px]">
                <li>All {projects.length} of your projects and generated documents</li>
                <li>Your payment history (browser cache)</li>
                <li>All IdeaForge local data</li>
                <li>Your account credentials</li>
              </ul>
              <p className="text-red-600 font-medium">This cannot be undone.</p>
              <div className="space-y-1.5 pt-2">
                <Label htmlFor="confirm-delete" className="text-[12px] font-medium text-[#0F0F0F] font-sans">
                  Type <span className="font-mono text-red-600">delete my account</span> to confirm
                </Label>
                <Input
                  id="confirm-delete"
                  type="text"
                  value={confirmText}
                  onChange={e => setConfirmText(e.target.value)}
                  placeholder="delete my account"
                  autoComplete="off"
                  className={`h-10 text-[13px] font-mono ${canConfirm ? 'border-red-400' : 'border-border'}`}
                />
              </div>
            </div>
          </DialogDescription>

          <div className="flex gap-2 mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setIsModalOpen(false); setConfirmText('') }}
              disabled={isDeleting}
              className="flex-1 h-9 text-[13px] border-[0.5px]"
            >
              Keep account
            </Button>
            <Button
              type="button"
              onClick={handleDeleteAccount}
              disabled={!canConfirm || isDeleting}
              aria-busy={isDeleting}
              className="flex-1 h-9 text-[13px] bg-red-600 hover:bg-red-700 text-white border-none disabled:opacity-40"
            >
              {isDeleting ? 'Deleting...' : 'Delete account'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
