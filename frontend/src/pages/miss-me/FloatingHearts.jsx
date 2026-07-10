import { useMemo } from 'react'
import { motion } from 'framer-motion'
import MmIcon from './icons'
import usePrefersReducedMotion from './usePrefersReducedMotion'

function makeHearts(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    size: 10 + (i % 5) * 4,
    delay: (i % 8) * 0.7,
    duration: 10 + (i % 6) * 2.2,
    opacity: 0.15 + (i % 4) * 0.08,
  }))
}

export default function FloatingHearts({ count = 14, className = '' }) {
  const reduced = usePrefersReducedMotion()
  const hearts = useMemo(() => makeHearts(count), [count])

  if (reduced) return null

  return (
    <div className={`mm-hearts ${className}`} aria-hidden="true">
      {hearts.map((h) => (
        <motion.span
          key={h.id}
          className="mm-hearts__item"
          style={{ left: h.left, opacity: h.opacity }}
          animate={{ y: [0, -120, -260], x: [0, 12, -8, 0], opacity: [0, h.opacity, 0] }}
          transition={{ duration: h.duration, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MmIcon name="heart" size={h.size} filled />
        </motion.span>
      ))}
    </div>
  )
}
