import { Link } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export function NotFoundPage() {
  useEffect(() => {
    document.title = '404 — IdeaForge'
  }, [])

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center font-sans">
      <div className="text-center max-w-sm">
        <p className="font-mono text-xs text-amber-primary tracking-[0.1em] uppercase mb-4">404</p>
        <h1 className="text-[22px] font-medium text-ink mb-3">Page not found</h1>
        <p className="text-sm text-slate mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/dashboard">
          <Button variant="outline" size="sm">
            <IconArrowLeft size={14} className="mr-2" aria-hidden="true" />
            Go to dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}
