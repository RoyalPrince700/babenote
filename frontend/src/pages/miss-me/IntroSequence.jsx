import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { INTRO_LINES } from './data'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function IntroSequence({ onComplete }) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.classList.add('mm-intro-lock')
    return () => document.body.classList.remove('mm-intro-lock')
  }, [])

  useEffect(() => {
    // Still show intro on reduced-motion — just faster (common on iPhones).
    const speed = reduced ? 0.55 : 1

    if (index >= INTRO_LINES.length) {
      const end = window.setTimeout(onComplete, reduced ? 200 : 450)
      return () => window.clearTimeout(end)
    }

    const line = INTRO_LINES[index]
    const t = window.setTimeout(
      () => setIndex((i) => i + 1),
      line.duration * 1000 * speed,
    )
    return () => window.clearTimeout(t)
  }, [index, onComplete, reduced])

  const current = INTRO_LINES[index]

  if (!mounted) return null

  return createPortal(
    <motion.div
      className="mm-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.35 : 0.75, ease: EASE }}
    >
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={index}
            className="mm-intro__stage"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduced ? 0.35 : 0.7, ease: EASE }}
          >
            {current.type === 'heart' ? (
              <motion.span
                className="mm-intro__heart"
                animate={
                  reduced
                    ? { opacity: 1 }
                    : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }
                }
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ❤️
              </motion.span>
            ) : (
              <p className="mm-intro__text">{current.text}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>,
    document.body,
  )
}
