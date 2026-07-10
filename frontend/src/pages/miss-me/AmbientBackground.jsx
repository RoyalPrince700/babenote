import { useMemo } from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

function makeOrbs(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    size: 140 + (i % 4) * 80,
    x: `${(i * 23) % 90}%`,
    y: `${(i * 31) % 80}%`,
    duration: 14 + (i % 5) * 3,
    delay: i * 0.4,
  }))
}

export default function AmbientBackground({ variant = 'default' }) {
  const reduced = usePrefersReducedMotion()
  const orbs = useMemo(() => makeOrbs(5), [])

  return (
    <div className={`mm-ambient mm-ambient--${variant}`} aria-hidden="true">
      <div className="mm-ambient__wash" />
      {!reduced &&
        orbs.map((o) => (
          <motion.span
            key={o.id}
            className="mm-ambient__orb"
            style={{ width: o.size, height: o.size, left: o.x, top: o.y }}
            animate={{ x: [0, 30, -20, 0], y: [0, -24, 18, 0], opacity: [0.35, 0.55, 0.4, 0.35] }}
            transition={{ duration: o.duration, delay: o.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
    </div>
  )
}
