import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import MmIcon from './icons'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function HeartTrail({ active = true }) {
  const reduced = usePrefersReducedMotion()
  const [points, setPoints] = useState([])
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && active && !reduced)
  }, [active, reduced])

  useEffect(() => {
    if (!enabled) return undefined

    let last = 0
    const onMove = (e) => {
      const now = performance.now()
      if (now - last < 55) return
      last = now
      const id = `${now}`
      setPoints((prev) => [...prev.slice(-14), { id, x: e.clientX, y: e.clientY }])
      window.setTimeout(() => {
        setPoints((prev) => prev.filter((p) => p.id !== id))
      }, 700)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="mm-trail" aria-hidden="true">
      <AnimatePresence>
        {points.map((p) => (
          <motion.span
            key={p.id}
            className="mm-trail__heart"
            style={{ left: p.x, top: p.y }}
            initial={{ opacity: 0.7, scale: 0.5, y: 0 }}
            animate={{ opacity: 0, scale: 1, y: -18 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65 }}
          >
            <MmIcon name="heart" size={12} filled />
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
