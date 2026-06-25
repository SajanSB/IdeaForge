import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { IconDatabase, IconTrash, IconInfoCircle } from '@tabler/icons-react'
import { Switch }                from '@/components/ui/switch'
import { useUIStore }            from '@/stores/useUIStore'
import { useDocumentStore }      from '@/stores/useDocumentStore'
import { useLocalStorageUsage }  from '@/hooks/useLocalStorageUsage'
import { SettingsSubNav }        from '@/components/dashboard/SettingsSubNav'
import { StorageUsageBar }       from '@/components/settings/StorageUsageBar'
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// ── Toggle row sub-component ──────────────────────────────────────────────────

interface ToggleRowProps {
  id:          string
  label:       string
  description: string
  checked:     boolean
  onChange:    (v: boolean) => void
  disabled?:   boolean
}

function ToggleRow({ id, label, description, checked, onChange, disabled }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex-1 min-w-0">
        <label
          htmlFor={id}
          className={`text-[14px] font-medium font-sans cursor-pointer block ${disabled ? 'text-[#6B7280]' : 'text-[#0F0F0F]'}`}
        >
          {label}
        </label>
        <p className="text-[12px] text-[#6B7280] font-sans leading-relaxed mt-0.5">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}

export function NotificationsPage() {
  const {
    notifyOnComplete,
    notifyReceipt,
    notifyUpdates,
    setNotifyOnComplete,
    setNotifyReceipt,
    setNotifyUpdates,
  } = useUIStore()

  const { clearAll: clearDocuments } = useDocumentStore()
  const { refresh: refreshStorage }  = useLocalStorageUsage()

  const [isClearModalOpen, setIsClearModalOpen] = useState(false)
  const [isClearing, setIsClearing]             = useState(false)

  useEffect(() => {
    document.title = 'Notifications & Storage — IdeaForge'
  }, [])

  function handleClearDocuments() {
    setIsClearing(true)
    try {
      // Clear documents in localStorage
      clearDocuments()
      // Refresh local storage stats
      refreshStorage()
      toast.success('Stored project documents cleared successfully')
      setIsClearModalOpen(false)
    } catch (err) {
      console.error('Clearing documents failed:', err)
      toast.error('Failed to clear documents. Please try again.')
    } finally {
      setIsClearing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans mb-1">
        Settings
      </h1>
      <p className="text-[13px] text-[#6B7280] font-sans mb-5">
        Manage your account and preferences.
      </p>

      <SettingsSubNav />

      {/* ── Notification Preferences Card ─────────────────────────────────── */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-5">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0]">
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Notification preferences
          </p>
        </div>

        <div className="px-5 divide-y divide-border">
          <ToggleRow
            id="notify-complete"
            label="Generation completed"
            description="Receive an email alert when all 13 scoping documents are ready for your project."
            checked={notifyOnComplete}
            onChange={setNotifyOnComplete}
          />
          <ToggleRow
            id="notify-receipt"
            label="Payment confirmations"
            description="Receive email tax invoices and payment confirmations after checks."
            checked={notifyReceipt}
            onChange={setNotifyReceipt}
          />
          <ToggleRow
            id="notify-updates"
            label="Product updates"
            description="Receive announcements about new AI capabilities and scoping features."
            checked={notifyUpdates}
            onChange={setNotifyUpdates}
          />
        </div>
      </div>

      {/* ── Storage Management Card ────────────────────────────────────────── */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center gap-2">
          <IconDatabase size={14} className="text-[#6B7280]" aria-hidden="true" />
          <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] font-sans">
            Storage management
          </p>
        </div>

        <div className="px-5 py-5 space-y-6">
          {/* Storage usage indicator */}
          <StorageUsageBar />

          {/* Actions and Schema Row */}
          <div className="pt-4 border-t border-[0.5px] border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#6B7280] font-sans">
                <IconInfoCircle size={14} aria-hidden="true" />
                <span>Local database schema version:</span>
                <span className="font-mono font-medium text-[#0F0F0F] bg-[#F7F5F0] px-1.5 py-0.5 rounded border border-[0.5px] border-border">v1</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setIsClearModalOpen(true)}
              variant="outline"
              className="sm:self-auto self-start h-9 text-[13px] border-[0.5px] border-red-300 text-red-600 hover:bg-[#FCEBEB] hover:border-red-400 transition-colors"
            >
              <IconTrash size={14} className="mr-1.5" aria-hidden="true" />
              Clear documents cache
            </Button>
          </div>
        </div>
      </div>

      {/* ── Clear confirmation modal ──────────────────────────────────────── */}
      <Dialog open={isClearModalOpen} onOpenChange={open => !open && setIsClearModalOpen(false)}>
        <DialogContent
          className="max-w-sm w-full border border-[0.5px] border-border rounded-xl p-6"
          aria-labelledby="clear-modal-title"
        >
          <DialogHeader>
            <DialogTitle id="clear-modal-title" className="text-[16px] font-medium text-[#0F0F0F] font-sans">
              Clear documents cache?
            </DialogTitle>
          </DialogHeader>

          <DialogDescription>
            <div className="mt-3 text-[13px] text-[#6B7280] font-sans space-y-3 leading-relaxed">
              <p>
                This will erase all generated scoping documents from this browser's local storage.
              </p>
              <p className="text-amber-700 bg-[#FAEEDA] border border-[#EF9F27]/30 rounded-lg p-2.5 text-[12px]">
                <strong>Warning:</strong> Unless you have downloaded the documents as `.md` or exported them as a ZIP, they will be permanently lost. Your payments record remains untouched.
              </p>
            </div>
          </DialogDescription>

          <div className="flex gap-2 mt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsClearModalOpen(false)}
              disabled={isClearing}
              className="flex-1 h-9 text-[13px] border-[0.5px]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleClearDocuments}
              disabled={isClearing}
              aria-busy={isClearing}
              className="flex-1 h-9 text-[13px] bg-red-600 hover:bg-red-700 text-white border-none"
            >
              {isClearing ? 'Clearing...' : 'Clear cache'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
