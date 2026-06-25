import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { IconSearch } from '@tabler/icons-react'
import { adminService, type StrapiUser } from '@/services/adminService'
import { formatINR } from '@/utils/estimateCalc'
import { useRequireAdmin } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface UserAggregates {
  projectCount: number
  totalSpend:    number
}

export function AdminUsersPage() {
  useRequireAdmin()

  const navigate = useNavigate()
  const [search, setSearch]             = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [users, setUsers]               = useState<StrapiUser[]>([])
  const [aggregates, setAggregates]     = useState<Record<string, UserAggregates>>({})
  const [isLoading, setIsLoading]       = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(false)
  const [page, setPage]                 = useState(1)
  const [totalCount, setTotalCount]     = useState(0)

  const pageSize = 15

  useEffect(() => {
    document.title = 'Users — IdeaForge Admin'
  }, [])

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 400)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    loadUsers()
  }, [debouncedSearch, page])

  async function loadUsers() {
    setIsLoading(true)
    try {
      const res = await adminService.getUsers(debouncedSearch, page, pageSize)
      const usersList = res.data.map(d => d.attributes)
      setUsers(usersList)
      setTotalCount(res.meta?.pagination?.total ?? usersList.length)

      // Fetch stats for these users in parallel
      fetchStats(usersList)
    } catch {
      toast.error('Failed to load users list')
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchStats(usersList: StrapiUser[]) {
    setIsStatsLoading(true)
    try {
      const statsMap: Record<string, UserAggregates> = {}
      await Promise.all(
        usersList.map(async u => {
          try {
            const [paymentsRes, projectsRes] = await Promise.all([
              adminService.getUserPayments(u.supabase_uid),
              adminService.getUserProjects(u.supabase_uid),
            ])
            const payments = paymentsRes.data.map(d => d.attributes)
            const projects = projectsRes.data.map(d => d.attributes)
            const paid = payments.filter(p => p.status === 'paid')
            const spend = paid.reduce((sum, p) => sum + p.amount_inr, 0)
            statsMap[u.supabase_uid] = {
              projectCount: projects.length,
              totalSpend:    spend,
            }
          } catch {
            statsMap[u.supabase_uid] = { projectCount: 0, totalSpend: 0 }
          }
        })
      )
      setAggregates(prev => ({ ...prev, ...statsMap }))
    } catch {
      console.warn('Failed to calculate stats for some users')
    } finally {
      setIsStatsLoading(false)
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="p-8 font-sans space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-[0.5px] border-border">
        <div>
          <h1 className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] font-sans">
            User Management
          </h1>
          <p className="text-[12px] text-[#6B7280] font-sans mt-0.5">
            View customer details, project history, spend metrics, and manage user actions.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-3 bg-white border border-[0.5px] border-border rounded-xl p-4">
        <div className="relative flex-1 max-w-md">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
          <Input
            type="text"
            placeholder="Search by email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 text-[13px]"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 px-5 py-3 animate-pulse">
                <div className="flex-1 h-4 bg-[#F7F5F0] rounded" />
                <div className="w-20 h-4 bg-[#F7F5F0] rounded" />
                <div className="w-16 h-4 bg-[#F7F5F0] rounded" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-[13px] text-[#6B7280] font-sans">
            No users matching search filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px] font-sans text-left">
              <thead className="bg-[#F7F5F0] select-none">
                <tr>
                  {['Display name', 'Email', 'Supabase UID', 'Projects', 'Total Spend', 'Created At', 'Actions'].map(col => (
                    <th
                      key={col}
                      scope="col"
                      className="px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] border-b border-[0.5px] border-border whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map(u => {
                  const stats = aggregates[u.supabase_uid]
                  return (
                    <tr key={u.id} className="hover:bg-[#F7F5F0] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#0F0F0F] whitespace-nowrap">
                        {u.display_name || '—'}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280]">
                        {u.email}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] font-mono text-[11px]">
                        {u.supabase_uid.slice(0, 12)}...
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {isStatsLoading && !stats ? (
                          <span className="text-[11px] text-gray-400">Loading...</span>
                        ) : (
                          stats?.projectCount ?? 0
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono font-medium text-[#0F0F0F]">
                        {isStatsLoading && !stats ? (
                          <span className="text-[11px] text-gray-400">Loading...</span>
                        ) : (
                          formatINR(stats?.totalSpend ?? 0)
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#6B7280] text-[12px] whitespace-nowrap">
                        {new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(u.created_at))}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/admin/users/${u.supabase_uid}/dispute`)}
                          className="text-[12px] font-medium text-[#BA7517] hover:underline"
                        >
                          Dispute log
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-[12px] text-[#6B7280] font-sans">
            Showing Page {page} of {totalPages} ({totalCount} users)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="h-8 text-[12px] px-3 border-border hover:bg-[#F7F5F0]"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="h-8 text-[12px] px-3 border-border hover:bg-[#F7F5F0]"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
