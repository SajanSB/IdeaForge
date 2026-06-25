import { IconAlertCircle } from '@tabler/icons-react'

interface GenerationErrorCardProps {
  message: string
  failedAtDoc: string | null
  onRetry: () => void
}

export function GenerationErrorCard({ message, failedAtDoc, onRetry }: GenerationErrorCardProps) {
  return (
    <div
      role="alert"
      className="bg-[#FCEBEB] border border-[0.5px] border-red-200 rounded-xl p-5 mb-6"
    >
      <div className="flex items-start gap-3">
        <IconAlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <h2 className="text-[14px] font-medium text-red-800 font-sans mb-1">
            Generation halted
          </h2>
          <p className="text-[12px] text-red-700 font-sans leading-relaxed mb-4">
            Failed at document: <span className="font-semibold">{failedAtDoc}</span>. Error details: {message}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onRetry}
              className="px-4 h-9 rounded-lg text-[13px] font-medium font-sans bg-red-600 text-white hover:bg-red-700 transition-colors"
            >
              Resume generation
            </button>
            <p className="text-[11px] text-red-700 font-sans">
              Completed documents are saved in your account.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
