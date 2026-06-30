import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const NODES = [
  { id: 1, x: 12, y: 18, pulse: 0 },
  { id: 2, x: 28, y: 42, pulse: 1.2 },
  { id: 3, x: 45, y: 15, pulse: 0.6 },
  { id: 4, x: 62, y: 38, pulse: 2.1 },
  { id: 5, x: 78, y: 22, pulse: 0.9 },
  { id: 6, x: 88, y: 55, pulse: 1.8 },
  { id: 7, x: 22, y: 72, pulse: 2.4 },
  { id: 8, x: 55, y: 68, pulse: 1.5 },
  { id: 9, x: 72, y: 82, pulse: 0.3 },
  { id: 10, x: 38, y: 58, pulse: 2.8 },
  { id: 11, x: 8, y: 48, pulse: 1.1 },
  { id: 12, x: 92, y: 35, pulse: 2.2 },
]

const EDGES: [number, number][] = [
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [2, 10],
  [10, 8],
  [8, 9],
  [7, 11],
  [11, 2],
  [4, 10],
  [5, 12],
  [6, 9],
  [3, 5],
]

type AINeuralFieldProps = {
  className?: string
  opacity?: number
}

export function AINeuralField({ className, opacity = 0.35 }: AINeuralFieldProps) {
  const nodeMap = Object.fromEntries(NODES.map((n) => [n.id, n]))

  return (
    <svg
      className={cn('absolute inset-0 h-full w-full', className)}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="ai-edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
          <stop offset="50%" stopColor="rgba(34, 211, 238, 0.55)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
        </linearGradient>
        <radialGradient id="ai-node-glow">
          <stop offset="0%" stopColor="rgba(34, 211, 238, 0.9)" />
          <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
        </radialGradient>
      </defs>

      {EDGES.map(([from, to], i) => {
        const a = nodeMap[from]
        const b = nodeMap[to]
        return (
          <motion.line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="url(#ai-edge-gradient)"
            strokeWidth="0.15"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{ pathLength: 1, opacity: [0.15, 0.35, 0.15] }}
            transition={{
              pathLength: { duration: 2, delay: i * 0.08 },
              opacity: { duration: 4 + (i % 3), repeat: Infinity, ease: 'easeInOut' },
            }}
          />
        )
      })}

      {NODES.map((node) => (
        <motion.g key={node.id}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="0.9"
            fill="url(#ai-node-glow)"
            animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              delay: node.pulse,
              ease: 'easeInOut',
            }}
          />
          <circle cx={node.x} cy={node.y} r="0.25" fill="rgba(34, 211, 238, 0.8)" />
        </motion.g>
      ))}
    </svg>
  )
}
