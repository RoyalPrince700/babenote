import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

function makePieces(count) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const dist = 80 + Math.random() * 180
    return {
      id: i,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist - 40,
      rotate: -40 + Math.random() * 80,
      size: 10 + Math.random() * 14,
      delay: Math.random() * 0.12,
      char: i % 3 === 0 ? '✨' : '♥',
    }
  })
}

export default function HeartConfetti({ active, onDone }) {
  const reduced = usePrefersReducedMotion()
  const pieces = useMemo(() => makePieces(reduced ? 8 : 28), [reduced])
  const [show, setShow] = useState(false)
  const onDoneRef = useRef(onDone)
  const runId = useRef(0)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    if (!active) return undefined
    const id = ++runId.current
    setShow(true)
    const t = window.setTimeout(() => {
      if (runId.current !== id) return
      setShow(false)
      onDoneRef.current?.()
    }, 1600)
    return () => window.clearTimeout(t)
  }, [active])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="mm-confetti"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
        >
          {pieces.map((p) => (
            <motion.span
              key={`${runId.current}-${p.id}`}
              className="mm-confetti__piece"
              style={{ fontSize: p.size }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
              animate={{ opacity: 0, x: p.x, y: p.y, scale: 1, rotate: p.rotate }}
              transition={{ duration: 1.15, delay: p.delay, ease: EASE }}
            >
              {p.char}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
