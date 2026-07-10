import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { INTRO_LINES } from './data'
import MmIcon from './icons'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

function requestMusicStart() {
  window.dispatchEvent(new CustomEvent('mm-music-start'))
}

export default function IntroSequence({ onComplete }) {
  const reduced = usePrefersReducedMotion()
  const [started, setStarted] = useState(false)
  const [index, setIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    document.body.classList.add('mm-intro-lock')
    return () => document.body.classList.remove('mm-intro-lock')
  }, [])

  useEffect(() => {
    if (!started) return undefined

    // Keep intro slow on every device (including mobile)
    if (index >= INTRO_LINES.length) {
      const end = window.setTimeout(onComplete, 500)
      return () => window.clearTimeout(end)
    }

    const line = INTRO_LINES[index]
    const t = window.setTimeout(() => setIndex((i) => i + 1), line.duration * 1000)
    return () => window.clearTimeout(t)
  }, [index, onComplete, started])

  const begin = () => {
    if (started) return
    requestMusicStart()
    setStarted(true)
  }

  const current = started ? INTRO_LINES[index] : null

  if (!mounted) return null

  return createPortal(
    <motion.div
      className="mm-intro"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.75, ease: EASE }}
    >
      <AnimatePresence mode="wait">
        {!started ? (
          <motion.button
            key="gate"
            type="button"
            className="mm-intro__gate"
            onClick={begin}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <motion.span
              className="mm-intro__heart"
              animate={
                reduced
                  ? { opacity: 1 }
                  : { scale: [1, 1.1, 1], opacity: [0.85, 1, 0.85] }
              }
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MmIcon name="heart" size={48} filled />
            </motion.span>
            <p className="mm-intro__text">Put your earpiece on first, Mama.</p>
            <p className="mm-intro__hint">Tap anywhere to begin — and enjoy the music.</p>
          </motion.button>
        ) : (
          current && (
            <motion.div
              key={index}
              className="mm-intro__stage"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.85, ease: EASE }}
            >
              {current.type === 'heart' ? (
                <motion.span
                  className="mm-intro__heart"
                  animate={
                    reduced
                      ? { opacity: 1 }
                      : { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] }
                  }
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <MmIcon name="heart" size={48} filled />
                </motion.span>
              ) : (
                <p className="mm-intro__text">{current.text}</p>
              )}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </motion.div>,
    document.body,
  )
}
