import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AIBackground } from '@/components/marketing/AIBackground'
import { BrandLogoLink } from '@/components/marketing/shared'

export const MARKETING_NAV_LINKS = [
  { href: '#showcase', label: 'Product' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#comparison', label: 'Compare' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
] as const

type MarketingLayoutProps = {
  children: React.ReactNode
  footer?: React.ReactNode
}

export function MarketingLayout({ children, footer }: MarketingLayoutProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-white/15">
      <AIBackground variant="global" />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-chrome-border bg-background/90 backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <nav
          className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 lg:px-8"
          aria-label="Main navigation"
        >
          <BrandLogoLink />

          <ul className="hidden items-center gap-8 md:flex">
            {MARKETING_NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="nav-link"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="nav-link">
              Sign in
            </Link>
            <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary text-sm">
              Get started
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-chrome-border bg-chrome-surface md:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-chrome-border/40 bg-background/95 px-5 py-4 backdrop-blur-xl md:hidden">
            <ul className="space-y-3">
              {MARKETING_NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="block py-2 nav-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/login" className="block py-2 nav-link">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary mt-2 w-full" onClick={() => setMenuOpen(false)}>
                  Get started
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>

      <div className="relative z-10">{children}</div>
      {footer}
    </div>
  )
}
