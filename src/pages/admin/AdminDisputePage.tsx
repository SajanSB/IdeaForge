import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { IconLoader2, IconAlertCircle, IconArrowLeft } from '@tabler/icons-react'
import { adminService, type StrapiProject, type StrapiPayment, type StrapiTokenLog, type StrapiGenerationLog } from '@/services/adminService'
import { formatINR } from '@/utils/estimateCalc'
import { useRequireAdmin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function AdminDisputePage() {
  useRequireAdmin()

  const { userId } = useParams<{ userId: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [projects, setProjects]       = useState<StrapiProject[]>([])
  const [selectedProject, setSelectedProject] = useState<StrapiProject | null>(null)
  const [payments, setPayments]       = useState<StrapiPayment[]>([])
  const [tokenLogs, setTokenLogs]     = useState<StrapiTokenLog[]>([])
  const [genLog, setGenLog]           = useState<StrapiGenerationLog | null>(null)
  
  const [isLoading, setIsLoading]     = useState(true)
  const [isDetailLoading, setIsDetailLoading] = useState(false)

  const activeProjectId = searchParams.get('projectId') || ''

  useEffect(() => {
    document.title = 'Dispute Resolution — IdeaForge Admin'
    if (userId) {
      loadUserProjects()
    }
  }, [userId])

  useEffect(() => {
    if (projects.length > 0) {
      const target = projects.find(p => p.project_id === activeProjectId) || projects[0]
      setSelectedProject(target)
      if (target.project_id !== activeProjectId) {
        setSearchParams({ projectId: target.project_id })
      }
    }
  }, [projects, activeProjectId])

  useEffect(() => {
    if (selectedProject) {
      loadProjectDetails(selectedProject.project_id)
    }
  }, [selectedProject])

  async function loadUserProjects() {
    setIsLoading(true)
    try {
      const res = await adminService.getUserProjects(userId!)
      setProjects(res.data.map(d => d.attributes))
    } catch {
      toast.error('Failed to load user projects')
    } finally {
      setIsLoading(false)
    }
  }

  async function loadProjectDetails(projectId: string) {
    setIsDetailLoading(true)
    try {
      const [paymentsRes, tokensRes, genRes] = await Promise.all([
        adminService.getUserPayments(userId!),
        adminService.getProjectTokenLogs(projectId),
        adminService.getProjectGenerationLog(projectId),
      ])

      const allPayments = paymentsRes.data.map(d => d.attributes)
      setPayments(allPayments.filter(p => p.project_id === projectId))
      setTokenLogs(tokensRes.data.map(d => d.attributes))
      setGenLog(genRes.data?.[0]?.attributes ?? null)
    } catch {
      toast.error('Failed to load dispute audit logs')
    } finally {
      setIsDetailLoading(false)
    }
  }

  const selectedPayment = payments[0] ?? null

  const totalTokens = tokenLogs.reduce((sum, t) => sum + t.input_tokens + t.output_tokens, 0)
  const totalCostUsd = tokenLogs.reduce((sum, t) => sum + t.cost_usd, 0)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <IconLoader2 className="animate-spin text-[#BA7517]" size={28} />
      </div>
    )
  }

  return (
    <div className="p-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-[0.5px] border-border">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/users')}
          className="h-9 px-3 border-border hover:bg-[#F7F5F0]"
        >
          <IconArrowLeft size={16} />
        </Button>
        <div>
          <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans">
            Dispute Audit Console
          </h1>
          <p className="text-[12px] text-[#6B7280] font-sans mt-0.5">
            Audit payment receipts, token expenditures, LLM execution pipelines, and logs.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-[0.5px] border-border rounded-xl p-8 text-center text-[#6B7280]">
          This user has not submitted any projects yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Projects List Sidebar */}
          <aside className="lg:col-span-4 bg-white border border-[0.5px] border-border rounded-xl p-4 space-y-3">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280]">
              User Projects ({projects.length})
            </h2>
            <nav className="space-y-1">
              {projects.map(p => (
                <button
                  key={p.project_id}
                  onClick={() => setSearchParams({ projectId: p.project_id })}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex flex-col gap-1 text-[12px] border ${
                    selectedProject?.project_id === p.project_id
                      ? 'border-[#BA7517] bg-[#FAEEDA]/30 text-[#BA7517] font-medium'
                      : 'border-transparent text-slate hover:bg-[#F7F5F0]'
                  }`}
                >
                  <span className="font-mono text-[11px]">
                    PRJ-{p.project_id.slice(0, 8).toUpperCase()}
                  </span>
                  <span className="truncate text-[#6B7280]">
                    {p.idea_snippet}
                  </span>
                  <span className={`text-[10px] w-fit px-1.5 py-0.5 rounded font-sans uppercase mt-1 ${
                    p.status === 'complete' ? 'bg-[#EAF3DE] text-[#27500A]' : 'bg-[#FCEBEB] text-[#7E1E1E]'
                  }`}>
                    {p.status}
                  </span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Audit Details Panel */}
          <main className="lg:col-span-8 space-y-6">
            {isDetailLoading ? (
              <div className="bg-white border border-[0.5px] border-border rounded-xl p-12 flex items-center justify-center">
                <IconLoader2 className="animate-spin text-[#BA7517]" size={28} />
              </div>
            ) : (
              <>
                {/* Status metrics grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Payment Details */}
                  <div className="bg-white border border-[0.5px] border-border rounded-xl p-5 space-y-3">
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280]">
                      Payment Record
                    </h3>
                    {selectedPayment ? (
                      <div className="space-y-2 text-[13px] font-sans">
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Status:</span>
                          <span className={`font-medium px-2 py-0.5 rounded-full text-[11px] uppercase ${
                            selectedPayment.status === 'paid' ? 'bg-[#EAF3DE] text-[#27500A]' : 'bg-[#FCEBEB] text-[#7E1E1E]'
                          }`}>
                            {selectedPayment.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Amount Paid:</span>
                          <span className="font-mono font-medium">{formatINR(selectedPayment.amount_inr)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Gateway:</span>
                          <span className="font-mono">{selectedPayment.gateway}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Payment ID:</span>
                          <span className="font-mono text-[11px] truncate max-w-[150px]">{selectedPayment.gateway_payment_id || '—'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Transaction Date:</span>
                          <span className="text-[#0F0F0F]">
                            {selectedPayment.paid_at
                              ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(selectedPayment.paid_at))
                              : '—'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[12px] text-[#6B7280] italic">No transaction records found for this project.</p>
                    )}
                  </div>

                  {/* Generation Log Diagnostics */}
                  <div className="bg-white border border-[0.5px] border-border rounded-xl p-5 space-y-3">
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280]">
                      LLM Generation Logs
                    </h3>
                    {genLog ? (
                      <div className="space-y-2 text-[13px] font-sans">
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Pipeline Status:</span>
                          <span className={`font-medium px-2 py-0.5 rounded-full text-[11px] uppercase ${
                            genLog.status === 'complete' ? 'bg-[#EAF3DE] text-[#27500A]' : 'bg-[#FCEBEB] text-[#7E1E1E]'
                          }`}>
                            {genLog.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Completions:</span>
                          <span className="font-mono">{genLog.docs_completed} / 13 docs</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Retry Counts:</span>
                          <span className="font-mono">{genLog.retry_count} times</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#6B7280]">Started At:</span>
                          <span>
                            {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(genLog.started_at))}
                          </span>
                        </div>
                        {genLog.completed_at && (
                          <div className="flex justify-between">
                            <span className="text-[#6B7280]">Completed At:</span>
                            <span>
                              {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(genLog.completed_at))}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[12px] text-[#6B7280] italic">No generation logs found for this project.</p>
                    )}
                  </div>
                </div>

                {/* Error diagnostics block */}
                {genLog && genLog.status === 'failed' && (
                  <div className="bg-[#FCEBEB] border border-[0.5px] border-red-200 rounded-xl p-5 space-y-2">
                    <div className="flex items-center gap-2 text-red-700 font-medium text-[13px]">
                      <IconAlertCircle size={16} />
                      <span>Pipeline failure diagnostics</span>
                    </div>
                    <div className="text-[12px] text-red-700 space-y-1">
                      <p><strong className="font-sans">Failed Document:</strong> <span className="font-mono bg-white/50 px-1 rounded">{genLog.failed_at_doc || 'Unknown'}</span></p>
                      <p><strong className="font-sans">Error Context:</strong> <span className="font-mono bg-white/50 px-1 rounded">{genLog.error_type || 'Unknown'}</span></p>
                      <p className="mt-1 font-mono text-[11px] bg-white border border-red-100 p-2.5 rounded whitespace-pre-wrap leading-5">
                        {genLog.error_message || 'No detailed error message reported.'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Token Expenditure Breakdown */}
                <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden">
                  <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex justify-between items-center">
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280]">
                      Token expenditure audit
                    </h3>
                    <div className="text-[11px] text-[#6B7280] font-sans space-x-3">
                      <span>Total Tokens: <strong className="font-mono text-[#BA7517]">{totalTokens.toLocaleString()}</strong></span>
                      <span>Total Cost: <strong className="font-mono text-[#BA7517]">${totalCostUsd.toFixed(4)}</strong></span>
                    </div>
                  </div>

                  {tokenLogs.length === 0 ? (
                    <div className="p-8 text-center text-[#6B7280] text-[13px]">
                      No token logs have been recorded for this project.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[13px] font-sans text-left">
                        <thead className="bg-[#F7F5F0]">
                          <tr>
                            {['Agent', 'Doc Type', 'Model', 'Input Tokens', 'Output Tokens', 'Cost (USD)'].map(col => (
                              <th
                                key={col}
                                className="px-4 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] border-b border-border whitespace-nowrap"
                              >
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {tokenLogs.map(log => (
                            <tr key={log.id} className="hover:bg-[#F7F5F0] transition-colors">
                              <td className="px-4 py-2.5 font-medium uppercase text-[11px] text-[#BA7517] whitespace-nowrap">
                                {log.agent_type}
                              </td>
                              <td className="px-4 py-2.5 text-[#0F0F0F] font-mono text-[11px]">
                                {log.doc_type}
                              </td>
                              <td className="px-4 py-2.5 text-[#6B7280] font-mono text-[11px]">
                                {log.model}
                              </td>
                              <td className="px-4 py-2.5 font-mono tabular-nums text-[#6B7280]">
                                {log.input_tokens.toLocaleString()}
                              </td>
                              <td className="px-4 py-2.5 font-mono tabular-nums text-[#6B7280]">
                                {log.output_tokens.toLocaleString()}
                              </td>
                              <td className="px-4 py-2.5 font-mono font-medium text-[#0F0F0F]">
                                ${log.cost_usd.toFixed(4)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      )}
    </div>
  )
}
