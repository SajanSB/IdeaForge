import { Outlet } from 'react-router-dom'
import { TopNav } from '@/components/layout/TopNav'

export function AppShell() {
  return (
    <div className="relative flex min-h-screen flex-col forge-chrome text-foreground selection:bg-primary/30">
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
        <div className="h-[400px] w-[700px] rounded-full bg-primary opacity-[0.03] blur-[100px]" />
      </div>
      <TopNav />
      <main className="relative z-10 flex-1 container max-w-6xl py-8 px-4 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
