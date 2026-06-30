import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Search, ShieldOff, ShieldCheck, MoreHorizontal, X, Loader2, RefreshCw } from 'lucide-react'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'

interface UserRow {
  id:        string
  email:     string
  full_name: string
  projects:  number
  revenue:   number
  joined:    string
  status:    'active' | 'suspended'
}

type StatusFilter = 'all' | 'active' | 'suspended'

export function AdminUsers() {
  const [users,         setUsers]         = useState<UserRow[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState('')
  const [statusFilter,  setStatusFilter]  = useState<StatusFilter>('all')
  const [confirmUser,   setConfirmUser]   = useState<UserRow | null>(null)
  const [confirmAction, setConfirmAction] = useState<'suspend' | 'activate' | null>(null)
  const [actioning,     setActioning]     = useState(false)
  const { toast } = useToast()

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.functions.invoke('admin-users')
    if (error || data?.error) {
      toast({ title: 'Failed to load users', description: error?.message ?? data?.error, variant: 'destructive' })
    } else {
      setUsers(data.users ?? [])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = users.filter((u) => {
    const matchStatus = statusFilter === 'all' || u.status === statusFilter
    const matchSearch = !search ||
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openConfirm = (user: UserRow, action: 'suspend' | 'activate') => {
    setConfirmUser(user)
    setConfirmAction(action)
  }

  const handleConfirm = async () => {
    if (!confirmUser || !confirmAction) return
    setActioning(true)
    const { data, error } = await supabase.functions.invoke('admin-users', {
      method: 'PATCH',
      body: { user_id: confirmUser.id, action: confirmAction },
    })
    setActioning(false)
    if (error || data?.error) {
      toast({ title: 'Action failed', description: error?.message ?? data?.error, variant: 'destructive' })
      return
    }
    setUsers((prev) => prev.map((u) =>
      u.id === confirmUser.id
        ? { ...u, status: confirmAction === 'suspend' ? 'suspended' : 'active' }
        : u
    ))
    toast({
      title: confirmAction === 'suspend' ? 'User suspended' : 'User activated',
      description: confirmUser.email,
    })
    setConfirmUser(null)
    setConfirmAction(null)
  }

  const initials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

  const fmt = (n: number) => n.toLocaleString('en-IN')

  const totalRevenue = users.reduce((s, u) => s + u.revenue, 0)

  return (
    <div className="w-full max-w-[1100px] mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">User Management</h1>
          <p className="text-chrome-muted mt-1">View, search, and manage all registered users.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={load}
          disabled={loading}
          className="bg-transparent border-chrome-border text-white/60 hover:text-white hover:bg-white/5 h-9"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',  value: loading ? '—' : fmt(users.length) },
          { label: 'Active',       value: loading ? '—' : fmt(users.filter((u) => u.status === 'active').length) },
          { label: 'Suspended',    value: loading ? '—' : fmt(users.filter((u) => u.status === 'suspended').length) },
          { label: 'Total Revenue',value: loading ? '—' : `₹${fmt(totalRevenue)}` },
        ].map((s) => (
          <div key={s.label} className="bg-chrome-elevated border border-chrome-border rounded-xl px-5 py-4">
            <p className="text-[10px] font-mono text-chrome-subtle uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-[26px] font-semibold text-white leading-none">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <Input
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-chrome-elevated border-chrome-border text-white placeholder:text-white/25 focus-visible:ring-primary text-[13px]"
          />
        </div>
        <div className="flex gap-1 bg-chrome-elevated border border-chrome-border rounded-lg p-1">
          {(['all', 'active', 'suspended'] as StatusFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 text-[11px] font-mono rounded transition-colors capitalize ${
                statusFilter === f
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-chrome-subtle hover:text-white/70'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-chrome-elevated border border-chrome-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40 gap-3 text-chrome-subtle">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-[13px]">Loading users…</span>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-white/[0.01]">
              <TableRow className="border-chrome-border hover:bg-transparent">
                <TableHead className="font-mono text-[11px] uppercase text-chrome-subtle py-3">User</TableHead>
                <TableHead className="font-mono text-[11px] uppercase text-chrome-subtle py-3">Projects</TableHead>
                <TableHead className="font-mono text-[11px] uppercase text-chrome-subtle py-3">Revenue</TableHead>
                <TableHead className="font-mono text-[11px] uppercase text-chrome-subtle py-3">Joined</TableHead>
                <TableHead className="font-mono text-[11px] uppercase text-chrome-subtle py-3">Status</TableHead>
                <TableHead className="font-mono text-[11px] uppercase text-chrome-subtle py-3 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-[11px] font-mono text-primary shrink-0">
                        {initials(user.full_name)}
                      </div>
                      <div>
                        <p className="text-[13px] text-white font-medium">{user.full_name}</p>
                        <p className="text-[11px] text-chrome-subtle font-mono">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/70 font-mono text-[13px]">{user.projects}</TableCell>
                  <TableCell className="text-primary font-mono text-[13px]">
                    {user.revenue > 0 ? `₹${fmt(user.revenue)}` : '—'}
                  </TableCell>
                  <TableCell className="text-chrome-subtle font-mono text-[12px]">
                    {new Date(user.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    {user.status === 'active' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border text-teal-400 border-teal-400/20 bg-teal-400/5">ACTIVE</span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded border text-red-400 border-red-400/20 bg-red-400/5">SUSPENDED</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-white/30 hover:text-white hover:bg-white/[0.06]">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-chrome-elevated border-chrome-border text-white shadow-xl rounded-xl min-w-[160px]" align="end">
                        {user.status === 'active' ? (
                          <DropdownMenuItem
                            onClick={() => openConfirm(user, 'suspend')}
                            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:bg-red-400/10 gap-2 text-[12px] rounded-md mx-1 my-0.5"
                          >
                            <ShieldOff className="h-3.5 w-3.5" />Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => openConfirm(user, 'activate')}
                            className="cursor-pointer text-teal-400 hover:text-teal-300 hover:bg-teal-400/10 focus:bg-teal-400/10 gap-2 text-[12px] rounded-md mx-1 my-0.5"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" />Activate User
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {!loading && filtered.length === 0 && (
          <div className="py-12 text-center text-white/30 text-[13px]">No users match your search.</div>
        )}
      </div>

      {/* Confirm Dialog */}
      <Dialog open={!!confirmUser} onOpenChange={(open) => !open && setConfirmUser(null)}>
        <DialogContent className="bg-chrome-elevated border-chrome-border text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">
              {confirmAction === 'suspend' ? 'Suspend user?' : 'Activate user?'}
            </DialogTitle>
            <DialogDescription className="text-white/45 text-[13px] mt-1">
              {confirmAction === 'suspend'
                ? 'The user will be banned from signing in and generating new documents.'
                : 'The user will regain full access to the platform.'}
            </DialogDescription>
          </DialogHeader>
          {confirmUser && (
            <div className="rounded-lg bg-white/[0.03] border border-white/[0.07] px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center text-[12px] font-mono text-primary">
                {initials(confirmUser.full_name)}
              </div>
              <div>
                <p className="text-[13px] text-white font-medium">{confirmUser.full_name}</p>
                <p className="text-[11px] text-chrome-subtle font-mono">{confirmUser.email}</p>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmUser(null)}
              disabled={actioning}
              className="border-chrome-border text-white/60 hover:bg-white/5 hover:text-white text-[12px]"
            >
              <X className="mr-1.5 h-3.5 w-3.5" />Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={actioning}
              className={`text-[12px] ${
                confirmAction === 'suspend'
                  ? 'bg-red-500/80 hover:bg-red-500 text-white'
                  : 'bg-teal-500/80 hover:bg-teal-500 text-white'
              }`}
            >
              {actioning
                ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                : confirmAction === 'suspend'
                ? <><ShieldOff className="mr-1.5 h-3.5 w-3.5" />Suspend</>
                : <><ShieldCheck className="mr-1.5 h-3.5 w-3.5" />Activate</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
