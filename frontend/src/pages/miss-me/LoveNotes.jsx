import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LOVE_NOTES } from './data'
import MmIcon from './icons'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

function randomNote() {
  const text = LOVE_NOTES[Math.floor(Math.random() * LOVE_NOTES.length)]
  return {
    id: `${Date.now()}-${Math.random()}`,
    text,
    x: 8 + Math.random() * 72,
    y: 12 + Math.random() * 70,
  }
}

export default function LoveNotes({ active = true }) {
  const reduced = usePrefersReducedMotion()
  const [note, setNote] = useState(null)

  useEffect(() => {
    if (!active || reduced) return undefined

    let timeout
    const cycle = () => {
      setNote(randomNote())
      timeout = window.setTimeout(() => {
        setNote(null)
        timeout = window.setTimeout(cycle, 2200 + Math.random() * 1800)
      }, 3200)
    }

    timeout = window.setTimeout(cycle, 1800)
    return () => window.clearTimeout(timeout)
  }, [active, reduced])

  return (
    <div className="mm-notes" aria-hidden="true">
      <AnimatePresence>
        {note && (
          <motion.div
            key={note.id}
            className="mm-notes__item"
            style={{ left: `${note.x}%`, top: `${note.y}%` }}
            initial={{ opacity: 0, y: 12, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.96 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <MmIcon name="heart" size={12} filled /> {note.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
