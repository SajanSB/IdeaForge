import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle2, FileText, Zap, Bot } from 'lucide-react'
import { AgentPipeline } from '@/components/marketing/AgentPipeline'
import { MarketingLayout } from '@/components/shell/MarketingLayout'
import { MarketingFooter } from '@/components/marketing/landing/MarketingFooter'
import { DocumentPreview } from '@/components/marketing/DocumentPreview'
import { StatsSection } from '@/components/marketing/landing/StatsSection'
import { ProblemSection } from '@/components/marketing/landing/ProblemSection'
import { AppShowcaseSection } from '@/components/marketing/landing/AppShowcaseSection'
import { HowItWorksSection } from '@/components/marketing/landing/HowItWorksSection'
import { ComparisonSection } from '@/components/marketing/landing/ComparisonSection'
import { PricingSection } from '@/components/marketing/landing/PricingSection'
import { FaqSection } from '@/components/marketing/landing/FaqSection'
import { CtaSection } from '@/components/marketing/landing/CtaSection'
import { PillBadge, HeroStat, GradientIcon } from '@/components/marketing/shared'

const TRUST_ITEMS = [
  'Multi-agent AI pipeline',
  '13 cross-linked SDLC docs',
  'Autonomous doc generation',
  'Pay only when you generate',
  'Master dev prompt output',
  'Under 15 min per run',
]

const FLOATING_STATS = [
  { icon: FileText, label: '13 docs generated', position: 'left-0 top-1/4', delay: 0.6 },
  { icon: Zap, label: '<15 min pipeline', position: 'right-0 top-1/3', delay: 0.8 },
  { icon: Bot, label: '3 AI agents active', position: 'right-4 bottom-1/4', delay: 1 },
]

export function LandingPage() {
  useEffect(() => {
    document.title = 'IdeaForge — AI SDLC Documentation'
  }, [])

  const doubledTrust = [...TRUST_ITEMS, ...TRUST_ITEMS]

  return (
    <MarketingLayout footer={<MarketingFooter />}>
      <main id="main-content">
        {/* Hero */}
        <section
          className="relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
          aria-labelledby="hero-heading"
        >
          <div className="hero-glow pointer-events-none absolute inset-0" />
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />

          <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <PillBadge live className="mb-5">
                    Multi-agent AI pipeline
                  </PillBadge>
                  <AgentPipeline compact className="mb-6 lg:justify-start" activeIndex={0} />
                </motion.div>

                <motion.h1
                  id="hero-heading"
                  className="text-balance text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  Your product idea is{' '}
                  <span className="gradient-text">too vague</span>
                  <br />
                  to build on.
                </motion.h1>

                <motion.p
                  className="mt-6 max-w-xl text-balance text-lg text-chrome-muted md:text-xl lg:mx-0 mx-auto"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  IdeaForge&apos;s AI agents turn a raw idea into{' '}
                  <strong className="font-semibold text-white">thirteen enterprise documents</strong>{' '}
                  — BRD through dev prompt — autonomously, in one sequential run.
                </motion.p>

                <motion.div
                  className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start justify-center"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Link to="/signup?next=%2Fidea%2Fnew" className="btn-primary w-full sm:w-auto">
                    Get started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a href="#showcase" className="btn-secondary w-full sm:w-auto">
                    See inside
                  </a>
                </motion.div>

                <motion.div
                  className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {[
                    { value: '13', label: 'SDLC documents' },
                    { value: '<15m', label: 'full generation' },
                    { value: '₹199', label: 'starting price' },
                  ].map((stat) => (
                    <HeroStat key={stat.label} value={stat.value} label={stat.label} />
                  ))}
                </motion.div>
              </div>

              <motion.div
                className="relative mx-auto w-full max-w-[360px] lg:max-w-none"
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.35 }}
              >
                {FLOATING_STATS.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      className={`floating-chip absolute z-10 hidden sm:flex ${stat.position}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: stat.delay, duration: 0.5 }}
                    >
                      <span className="flex items-center gap-2 text-xs font-semibold">
                        <Icon className="icon-gradient h-4 w-4" />
                        {stat.label}
                      </span>
                    </motion.div>
                  )
                })}
                <DocumentPreview variant="hero" className="animate-float-slow" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="trust-bar bg-chrome-elevated/25 py-5" aria-label="Product highlights">
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
            <div className="flex animate-marquee whitespace-nowrap">
              {doubledTrust.map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="mx-5 inline-flex items-center gap-2 text-sm font-medium text-chrome-muted"
                >
                  <GradientIcon icon={CheckCircle2} size="md" className="shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        <StatsSection />
        <ProblemSection />
        <AppShowcaseSection />
        <HowItWorksSection />
        <ComparisonSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>
    </MarketingLayout>
  )
}
