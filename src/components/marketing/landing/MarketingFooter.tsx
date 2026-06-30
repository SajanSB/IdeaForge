import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, Zap, Coins } from 'lucide-react'
import { BrandLogoLink, GradientIcon } from '@/components/marketing/shared'

const PRODUCT_LINKS = [
  { href: '#showcase', label: 'Product' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#comparison', label: 'Compare' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#faq', label: 'FAQ' },
]

const ACCOUNT_LINKS = [
  { href: '/login', label: 'Sign in', internal: true },
  { href: '/signup', label: 'Sign up', internal: true },
  { href: '/signup?next=%2Fidea%2Fnew', label: 'Get started', internal: true },
]

const STATS = [
  { icon: FileText, value: '13', label: 'SDLC docs' },
  { icon: Zap, value: '<15m', label: 'Generation' },
  { icon: Coins, value: '₹199', label: 'From' },
]

function FooterLink({
  href,
  label,
  internal,
}: {
  href: string
  label: string
  internal?: boolean
}) {
  const className = 'text-sm text-chrome-muted transition-colors duration-200 hover:text-accent'

  if (internal) {
    return (
      <Link to={href} className={className}>
        {label}
      </Link>
    )
  }

  return (
    <a href={href} className={className}>
      {label}
    </a>
  )
}

export function MarketingFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative bg-chrome-elevated/25" role="contentinfo">
      <div className="dot-bg pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-14">
          <div className="lg:col-span-5">
            <BrandLogoLink size="lg" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-chrome-muted">
              AI agents turn a raw product idea into thirteen enterprise SDLC documents — in
              minutes, not weeks.
            </p>

            <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary mt-6 inline-flex text-sm">
              Get started
              <ArrowRight className="h-4 w-4" />
            </Link>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {STATS.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="glass-stat px-3 py-3 text-center">
                    <GradientIcon icon={Icon} size="sm" className="mx-auto" />
                    <p className="stat-gradient mt-1.5 text-sm font-bold tabular-nums">{stat.value}</p>
                    <p className="text-[10px] text-chrome-muted">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:col-span-1 md:col-span-1 lg:col-span-7 lg:grid-cols-2 lg:pl-8">
            <nav aria-label="Product links">
              <p className="section-label">Product</p>
              <ul className="mt-4 space-y-3">
                {PRODUCT_LINKS.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Account links">
              <p className="section-label">Account</p>
              <ul className="mt-4 space-y-3">
                {ACCOUNT_LINKS.map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} internal />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-chrome-border/30 py-6 sm:flex-row">
          <p className="text-xs text-chrome-muted">© {year} IdeaForge. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-xs text-chrome-muted">
            <Sparkles className="icon-gradient h-3.5 w-3.5" />
            Built by AI agents, for founders who ship.
          </p>
        </div>
      </div>
    </footer>
  )
}
