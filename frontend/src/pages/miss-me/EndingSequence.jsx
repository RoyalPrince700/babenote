import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ENDING_LINES } from './data'
import MmIcon from './icons'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function EndingSequence({ onHug }) {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [showHeart, setShowHeart] = useState(false)
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    if (reduced) {
      setShowHeart(true)
      setShowCta(true)
      return undefined
    }

    if (index < ENDING_LINES.length) {
      const hold = ENDING_LINES[index].length > 18 ? 2400 : 2000
      const t = window.setTimeout(() => setIndex((i) => i + 1), hold)
      return () => window.clearTimeout(t)
    }

    const heart = window.setTimeout(() => setShowHeart(true), 500)
    const cta = window.setTimeout(() => setShowCta(true), 1600)
    return () => {
      window.clearTimeout(heart)
      window.clearTimeout(cta)
    }
  }, [index, reduced])

  const line = ENDING_LINES[index]

  return (
    <section className="mm-ending">
      <div className="mm-ending__stage">
        <AnimatePresence mode="wait">
          {line && !showCta && (
            <motion.p
              key={line}
              className="mm-ending__line"
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {line}
            </motion.p>
          )}
        </AnimatePresence>

        {showHeart && (
          <motion.div
            className="mm-ending__heart"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MmIcon name="heart" size={52} filled />
          </motion.div>
        )}

        {showCta && (
          <motion.div
            className="mm-ending__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="mm-ending__ask">Can I have another hug soon?</p>
            <motion.button
              type="button"
              className="mm-yes mm-yes--ending"
              onClick={onHug}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <MmIcon name="heart" size={18} filled />
              Hug Me Soon
            </motion.button>

            <div className="mm-ending__more">
              <p className="mm-ending__more-label">There&apos;s still more for you…</p>
              <Link to="/still-for-you" className="mm-ending__more-link">
                Open chapter two <MmIcon name="heart" size={14} filled />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
