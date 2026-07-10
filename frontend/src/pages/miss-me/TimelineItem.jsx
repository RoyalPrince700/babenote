import { motion } from 'framer-motion'
import { EASE, viewportOnce } from './motion'

export default function TimelineItem({ emoji, label, active = false }) {
  return (
    <motion.div
      className={`mm-timeline ${active ? 'mm-timeline--active' : ''}`}
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <span className="mm-timeline__dot" aria-hidden="true">
        {emoji}
      </span>
      <span className="mm-timeline__label">{label}</span>
    </motion.div>
  )
}
