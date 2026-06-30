import { useEffect, useRef, useState } from 'react'
import { FileText, Clock, Zap, Layers } from 'lucide-react'
import { Reveal } from '@/components/marketing/Reveal'
import { SECTION_PAD_SM, GradientIcon } from '@/components/marketing/shared'

const STATS = [
  { icon: FileText, value: 13, suffix: '', label: 'SDLC documents' },
  { icon: Zap, value: 15, suffix: 'm', label: 'Max generation time', prefix: '<' },
  { icon: Layers, value: 3, suffix: '', label: 'AI agents in pipeline' },
  { icon: Clock, value: 199, suffix: '', label: 'Starting price', prefix: '₹' },
]

function AnimatedNumber({
  value,
  suffix,
  prefix = '',
}: {
  value: number
  suffix: string
  prefix?: string
}) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const duration = 1400
          const start = performance.now()

          function tick(now: number) {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - (1 - progress) ** 3
            setDisplay(Math.round(value * eased))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className="stat-gradient tabular-nums">
      {prefix}
      {display.toLocaleString('en-IN')}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  return (
    <section className={SECTION_PAD_SM} aria-label="Product statistics">
      <div className="section-glow pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
            {STATS.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="card-surface group p-5 text-center md:p-6"
                >
                  <GradientIcon
                    icon={Icon}
                    size="xl"
                    className="mx-auto mb-3 h-8 w-8 transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="text-2xl font-extrabold md:text-3xl">
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                    />
                  </p>
                  <p className="mt-2 text-xs font-medium text-chrome-muted md:text-sm">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
