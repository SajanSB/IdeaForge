import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  IconBulb, IconMessages, IconCreditCard,
  IconFileDescription, IconArrowRight, IconCheck,
} from '@tabler/icons-react'
import { DocTag } from '@/components/brand/DocTag'
import { AgentPill } from '@/components/brand/AgentPill'
import { MonoId } from '@/components/brand/MonoId'
import { Button } from '@/components/ui/button'
import { cn } from '@/utils/cn'
import type { DocType } from '@/types/document'

export function LandingPage() {
  useEffect(() => {
    document.title = 'IdeaForge — SDLC documentation from your idea'
  }, [])

  return (
    <div className="min-h-screen bg-[#F7F5F0] font-sans text-[#0F0F0F]">
      {/* Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:border focus:rounded-lg focus:text-sm focus:text-[#0F0F0F]"
      >
        Skip to content
      </a>

      {/* Top bar */}
      <TopBar />

      {/* Main content */}
      <main id="main-content">
        <HeroSection />
        <SampleOutputSection />
        <HowItWorksSection />
        <WhatYouGetSection />
        <PricingAnchorSection />
        <FinalCTASection />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  )
}

function TopBar() {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-[0.5px] border-border bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <Link
        to="/"
        className="font-sans text-[15px] font-medium text-[#0F0F0F] tracking-[-0.2px] hover:opacity-80 transition-opacity"
        aria-label="IdeaForge home"
      >
        IdeaForge
      </Link>
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-[13px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors"
        >
          Sign in
        </Link>
        <Link to="/idea/new">
          <Button
            size="sm"
            className="bg-[#BA7517] hover:bg-[#A06010] text-[#FFF8ED] text-[13px] h-8 px-3 rounded-lg border-none"
          >
            Start for free
          </Button>
        </Link>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="pt-20 pb-16 px-6" aria-labelledby="hero-heading">
      <div className="max-w-3xl mx-auto text-center">

        {/* Eyebrow label */}
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#BA7517] font-mono mb-6">
          AI-powered SDLC documentation
        </p>

        {/* Headline — display type */}
        <h1
          id="hero-heading"
          className="text-[40px] sm:text-[48px] font-medium text-[#0F0F0F] tracking-[-0.8px] leading-[1.15] mb-6 font-sans"
        >
          From idea to 13 SDLC documents
          <br className="hidden sm:block" />
          {' '}in under 15 minutes.
        </h1>

        {/* Sub-headline */}
        <p className="text-[16px] sm:text-[17px] text-[#6B7280] leading-relaxed max-w-xl mx-auto mb-10 font-sans">
          AI-powered Business Analyst, UX Architect, and Prompt Engineer —
          one generation, one payment. No sign-up required to start.
        </p>

        {/* Primary CTA group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/idea/new" className="w-full sm:w-auto">
            <Button
              size="lg"
              aria-label="Start generating documents for free — no sign-up required"
              className="w-full bg-[#BA7517] hover:bg-[#A06010] active:scale-[0.98] text-[#FFF8ED] text-[15px] font-medium h-12 px-8 rounded-lg border-none gap-2 transition-all"
            >
              Start for free
              <IconArrowRight size={16} aria-hidden="true" />
            </Button>
          </Link>
          <p className="text-xs text-[#6B7280] font-sans">
            No account needed · from ₹199 per generation
          </p>
        </div>

        {/* Social proof strip */}
        <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
          {[
            '13 interconnected documents',
            '3 AI agents in sequence',
            'Pay only when you generate',
          ].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <IconCheck size={13} className="text-[#639922]" aria-hidden="true" />
              <span className="text-[12px] text-[#6B7280] font-sans">{item}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

function SampleOutputSection() {
  return (
    <section className="pb-20 px-6" aria-labelledby="sample-heading">
      <div className="max-w-3xl mx-auto">

        {/* Section label */}
        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6B7280] font-sans text-center mb-6">
          Real output — not a mockup
        </p>

        {/* Sample document card */}
        <div
          role="region"
          aria-label="Sample BRD document preview"
          className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden"
        >
          {/* Card header */}
          <div className="px-5 py-3 border-b border-[0.5px] border-border flex items-center justify-between bg-[#F7F5F0]">
            <div className="flex items-center gap-2.5">
              <DocTag type="BRD" />
              <span className="text-[13px] font-medium text-[#0F0F0F] font-sans">
                Business Requirements Document
              </span>
            </div>
            <MonoId>BRD-001</MonoId>
          </div>

          {/* Document content — fades out */}
          <div className="relative">
            <div className="px-6 pt-5 pb-0 max-h-64 overflow-hidden">
              {/* Render the sample BRD as styled prose */}
              <div className="font-sans text-[13px] leading-relaxed text-[#0F0F0F] space-y-3">
                <h2 className="text-base font-medium text-[#0F0F0F]">1. Executive Summary</h2>
                <p className="text-[#6B7280] text-[13px] leading-relaxed">
                  CareConnect is a clinic management SaaS platform enabling independent clinic owners
                  to manage appointments, patient records, billing, and staff schedules from a single
                  web interface. The platform targets small-to-mid-size clinics in India with 1–10
                  doctors, replacing fragmented spreadsheet and paper-based workflows.
                </p>
                <h2 className="text-base font-medium text-[#0F0F0F]">2. Business Objectives</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-[12px] border-collapse">
                    <thead>
                      <tr className="bg-[#F7F5F0]">
                        <th className="text-left px-3 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] border border-border">ID</th>
                        <th className="text-left px-3 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] border border-border">Objective</th>
                        <th className="text-left px-3 py-2 text-[11px] font-medium uppercase tracking-[0.06em] text-[#6B7280] border border-border">Priority</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: 'BO-01', obj: 'Reduce appointment no-show rate from 28% to under 12% via automated SMS reminders', p: 'High' },
                        { id: 'BO-02', obj: 'Enable digital patient record creation and retrieval within 30 seconds per patient', p: 'High' },
                        { id: 'BO-03', obj: 'Automate billing and generate GST-compliant invoices without manual data entry', p: 'High' },
                      ].map((row) => (
                        <tr key={row.id} className="border-b border-border">
                          <td className="px-3 py-2 font-mono text-[11px] font-medium text-[#BA7517] border border-border whitespace-nowrap">{row.id}</td>
                          <td className="px-3 py-2 text-[#6B7280] border border-border">{row.obj}</td>
                          <td className="px-3 py-2 border border-border">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EAF3DE] text-[#27500A]">{row.p}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h2 className="text-base font-medium text-[#0F0F0F]">3. Problem Statement</h2>
                <p className="text-[#6B7280] text-[13px] leading-relaxed">
                  Independent clinic owners in India manage appointments via WhatsApp groups, patient
                  records via paper files, and billing via manual Excel sheets. This leads to a 28%
                  no-show rate, 15-minute average record retrieval time, and GST billing errors
                  affecting 34% of monthly invoices.
                </p>
              </div>
            </div>

            {/* Fade gradient overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"
              aria-hidden="true"
            />
          </div>

          {/* Card footer */}
          <div className="px-5 py-3 flex items-center justify-between border-t border-[0.5px] border-border bg-[#F7F5F0]">
            <p className="text-[11px] text-[#6B7280] font-sans">
              Generated from a 2-sentence idea description · 13 documents total
            </p>
            <Link
              to="/idea/new"
              className="text-[12px] font-medium text-[#BA7517] hover:text-[#A06010] transition-colors font-sans flex items-center gap-1"
            >
              Generate yours
              <IconArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Document type hint below card */}
        <div className="mt-4 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-[#6B7280] font-sans">Plus 12 more documents:</span>
          {(['FRD', 'SRS', 'USR', 'UC', 'UIUX', 'DEVPROMPT'] as DocType[]).map((type) => (
            <DocTag key={type} type={type} size="sm" />
          ))}
          <span className="text-[11px] text-[#6B7280] font-sans">and more</span>
        </div>

      </div>
    </section>
  )
}

const HOW_IT_WORKS_STEPS = [
  {
    icon: IconBulb,
    label: 'Describe your idea',
    sub: 'Free-text, 50 chars min. No structure needed.',
  },
  {
    icon: IconMessages,
    label: 'Answer 6 questions',
    sub: 'AI Business Analyst asks targeted clarifiers.',
  },
  {
    icon: IconCreditCard,
    label: 'Pay once',
    sub: 'Transparent cost shown before you commit.',
  },
  {
    icon: IconFileDescription,
    label: 'Receive 13 documents',
    sub: 'Ready in 10–15 minutes. Download or copy.',
  },
]

function HowItWorksSection() {
  return (
    <section className="py-20 px-6 bg-white border-y border-[0.5px] border-border" aria-labelledby="how-heading">
      <div className="max-w-3xl mx-auto">

        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6B7280] font-sans text-center mb-2">
          How it works
        </p>
        <h2
          id="how-heading"
          className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] text-center mb-12 font-sans"
        >
          Four steps from idea to documentation suite
        </h2>

        {/* Desktop: horizontal strip | Mobile: 2x2 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
          {HOW_IT_WORKS_STEPS.map((step, i) => {
            const Icon = step.icon
            const isLast = i === HOW_IT_WORKS_STEPS.length - 1
            return (
              <div key={step.label} className="flex flex-col lg:flex-row items-start lg:items-stretch">
                {/* Step content */}
                <div className="flex flex-col items-start lg:items-center lg:text-center flex-1 px-0 lg:px-4">
                  {/* Icon circle */}
                  <div className="w-10 h-10 rounded-xl bg-[#FAEEDA] flex items-center justify-center mb-4 flex-shrink-0">
                    <Icon size={20} className="text-[#BA7517]" aria-hidden="true" />
                  </div>
                  <p className="text-[13px] font-medium text-[#0F0F0F] mb-1 font-sans leading-snug">
                    {step.label}
                  </p>
                  <p className="text-[12px] text-[#6B7280] font-sans leading-relaxed">
                    {step.sub}
                  </p>
                </div>
                {/* Arrow connector — desktop only */}
                {!isLast && (
                  <div className="hidden lg:flex items-center justify-center flex-shrink-0 w-8 self-start mt-4">
                    <IconArrowRight size={16} className="text-border" aria-hidden="true" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

const AGENT_DOC_GROUPS = [
  {
    agent: 'ba' as const,
    label: 'Business Analyst Agent — 10 documents',
    docs: ['BRD', 'FRD', 'SRS', 'BMP', 'USR', 'PFD', 'UC', 'DMD', 'UAT', 'RTM'] as DocType[],
  },
  {
    agent: 'ux' as const,
    label: 'UX Architect Agent — 1 document',
    docs: ['UIUX'] as DocType[],
  },
  {
    agent: 'pe' as const,
    label: 'Prompt Engineer Agent — 1 document',
    docs: ['DEVPROMPT'] as DocType[],
  },
]

const DOC_DESCRIPTIONS: Partial<Record<DocType, string>> = {
  BRD: 'Business Requirements',
  FRD: 'Functional Requirements',
  SRS: 'System Requirements',
  BMP: 'Benefit Measurement Plan',
  USR: 'User Stories with acceptance criteria',
  PFD: 'Process Flow Diagrams',
  UC: 'Use Cases',
  DMD: 'Data Mapping Document',
  UAT: 'User Acceptance Testing',
  RTM: 'Requirements Traceability Matrix',
  UIUX: 'UI/UX Specification',
  DEVPROMPT: 'AI Dev Prompt for Cursor / v0 / Claude Code',
}

function WhatYouGetSection() {
  return (
    <section className="py-20 px-6" aria-labelledby="docs-heading">
      <div className="max-w-3xl mx-auto">

        <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6B7280] font-sans text-center mb-2">
          What you receive
        </p>
        <h2
          id="docs-heading"
          className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] text-center mb-4 font-sans"
        >
          13 interconnected documents
        </h2>
        <p className="text-[14px] text-[#6B7280] text-center max-w-xl mx-auto mb-12 font-sans leading-relaxed">
          Every document references the others. FR-001 from the FRD appears in the RTM. US-017 from User Stories is traced back to the BRD. This is not a template — it is a coherent documentation suite.
        </p>

        <div role="list" aria-label="Generated documents" className="space-y-6">
          {AGENT_DOC_GROUPS.map((group) => (
            <div key={group.agent} role="listitem" className="bg-white border border-[0.5px] border-border rounded-xl overflow-hidden">
              {/* Group header */}
              <div className="px-5 py-3 border-b border-[0.5px] border-border bg-[#F7F5F0] flex items-center gap-3">
                <AgentPill agent={group.agent} />
                <span className="text-[12px] text-[#6B7280] font-sans">{group.label}</span>
              </div>
              {/* Doc list */}
              <div className="p-4 flex flex-wrap gap-2">
                {group.docs.map((docType) => (
                  <div
                    key={docType}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F7F5F0] border border-[0.5px] border-border"
                    title={DOC_DESCRIPTIONS[docType]}
                  >
                    <DocTag type={docType} size="sm" />
                    <span className="text-[11px] text-[#6B7280] font-sans hidden sm:inline">
                      {DOC_DESCRIPTIONS[docType]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

function PricingAnchorSection() {
  return (
    <section className="py-20 px-6 bg-white border-y border-[0.5px] border-border" aria-labelledby="pricing-heading">
      <div className="max-w-3xl mx-auto">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">

          {/* Left — pricing */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6B7280] font-sans mb-3">
              Pricing
            </p>
            <h2
              id="pricing-heading"
              className="text-[22px] font-medium text-[#0F0F0F] tracking-[-0.3px] mb-3 font-sans"
            >
              Pay only when you generate
            </h2>
            <p className="text-[14px] text-[#6B7280] leading-relaxed font-sans mb-6">
              No monthly subscription. No seat fees. Each generation is priced transparently — you see the exact breakdown before you pay.
            </p>
            <div className="bg-[#F7F5F0] border border-[0.5px] border-border rounded-xl p-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[32px] font-medium text-[#0F0F0F] font-sans tracking-[-0.5px]">₹199</span>
                <span className="text-[14px] text-[#6B7280] font-sans">and up per generation</span>
              </div>
              <p className="text-[12px] text-[#6B7280] font-sans">
                Final price shown before payment. Includes API cost + platform fee + 18% GST.
              </p>
            </div>
          </div>

          {/* Right — comparison */}
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-[#6B7280] font-sans mb-4">
              The alternative
            </p>
            <div className="space-y-3">
              {[
                { label: 'Freelance BA (full engagement)', cost: '₹30,000–₹1,50,000', highlight: false },
                { label: 'In-house BA (per project allocation)', cost: '₹20,000–₹60,000', highlight: false },
                { label: 'IdeaForge (one generation)', cost: 'from ₹199', highlight: true },
              ].map((row) => (
                <div
                  key={row.label}
                  className={cn(
                    'flex items-center justify-between px-4 py-3 rounded-lg border border-[0.5px]',
                    row.highlight
                      ? 'bg-[#FAEEDA] border-[#EF9F27]'
                      : 'bg-[#F7F5F0] border-border'
                  )}
                >
                  <span className={cn(
                    'text-[13px] font-sans',
                    row.highlight ? 'text-[#633806] font-medium' : 'text-[#6B7280]'
                  )}>
                    {row.label}
                  </span>
                  <span className={cn(
                    'text-[13px] font-mono font-medium',
                    row.highlight ? 'text-[#BA7517]' : 'text-[#6B7280]'
                  )}>
                    {row.cost}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

function FinalCTASection() {
  return (
    <section className="py-24 px-6" aria-labelledby="final-cta-heading">
      <div className="max-w-3xl mx-auto text-center">
        <h2
          id="final-cta-heading"
          className="text-[28px] font-medium text-[#0F0F0F] tracking-[-0.4px] mb-4 font-sans"
        >
          Ready to document your next idea?
        </h2>
        <p className="text-[15px] text-[#6B7280] leading-relaxed mb-8 font-sans max-w-md mx-auto">
          Start the elicitation Q&A for free. No account required until you're ready to generate.
        </p>
        <Link to="/idea/new" className="w-full sm:w-auto inline-block">
          <Button
            size="lg"
            aria-label="Start generating documents for free — no sign-up required"
            className="w-full sm:w-auto bg-[#BA7517] hover:bg-[#A06010] active:scale-[0.98] text-[#FFF8ED] text-[15px] font-medium h-12 px-10 rounded-lg border-none gap-2 transition-all cursor-pointer"
          >
            Start for free
            <IconArrowRight size={16} aria-hidden="true" />
          </Button>
        </Link>
        <p className="text-xs text-[#6B7280] mt-3 font-sans">
          No credit card needed to start · Q&A is free
        </p>
      </div>
    </section>
  )
}

function LandingFooter() {
  return (
    <footer className="border-t border-[0.5px] border-border bg-white py-6 px-6">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <span className="text-[12px] text-[#6B7280] font-sans">
          © {new Date().getFullYear()} IdeaForge
        </span>
        <nav aria-label="Footer navigation" className="flex items-center gap-4">
          <Link
            to="/privacy"
            className="text-[12px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors font-sans"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="text-[12px] text-[#6B7280] hover:text-[#0F0F0F] transition-colors font-sans"
          >
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  )
}
