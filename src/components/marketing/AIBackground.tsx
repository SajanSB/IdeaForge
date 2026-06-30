import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type AIBackgroundProps = {
  className?: string
  variant?: 'global' | 'section'
}

const ORBS = [
  {
    id: 'top',
    className: 'ai-orb-neutral',
    size: 'min(70vw, 560px)',
    top: '-12%',
    left: '20%',
    animate: { x: [0, 20, 0], y: [0, 15, 0], scale: [1, 1.04, 1] },
    duration: 28,
  },
  {
    id: 'bottom',
    className: 'ai-orb-neutral',
    size: 'min(60vw, 480px)',
    bottom: '0%',
    right: '-8%',
    animate: { x: [0, -15, 0], y: [0, -10, 0], scale: [1, 1.02, 1] },
    duration: 32,
  },
]

function GradientOrb({
  className,
  size,
  style,
  animate,
  duration,
}: {
  className: string
  size: string
  style: React.CSSProperties
  animate: { x: number[]; y: number[]; scale: number[] }
  duration: number
}) {
  return (
    <motion.div
      className={cn('ai-gradient-orb absolute rounded-full blur-3xl', className)}
      style={{ width: size, height: size, ...style }}
      animate={animate}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

export function AIBackground({ className, variant = 'section' }: AIBackgroundProps) {
  const isGlobal = variant === 'global'

  return (
    <div
      className={cn(
        'pointer-events-none overflow-hidden',
        isGlobal ? 'fixed inset-0 z-0' : 'absolute inset-0',
        className,
      )}
      aria-hidden
    >
      <div className="ai-mesh-gradient absolute inset-0" />

      {ORBS.map((orb) => (
        <GradientOrb
          key={orb.id}
          className={orb.className}
          size={orb.size}
          style={{
            top: 'top' in orb ? orb.top : undefined,
            left: 'left' in orb ? orb.left : undefined,
            right: 'right' in orb ? orb.right : undefined,
            bottom: 'bottom' in orb ? orb.bottom : undefined,
          }}
          animate={orb.animate}
          duration={orb.duration}
        />
      ))}

      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_35%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  )
}

export function SectionAIGlow({ className }: { className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden>
      <div className="ai-mesh-gradient absolute inset-0 opacity-40" />
    </div>
  )
}
