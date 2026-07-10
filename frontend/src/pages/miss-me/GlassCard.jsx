import { motion } from 'framer-motion'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function GlassCard({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag className={`mm-glass ${className}`} {...props}>
      {children}
    </Tag>
  )
}

export function StaggerText({
  text,
  className = '',
  as: Tag = 'p',
  delay = 0,
  highlight = [],
}) {
  const reduced = usePrefersReducedMotion()
  const words = text.split(' ')

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  return (
    <Tag className={`mm-stagger ${className}`} aria-label={text}>
      {words.map((word, i) => {
        const clean = word.replace(/[.,!?;:'"]/g, '').toLowerCase()
        const isHot = highlight.some((h) => clean.includes(h.toLowerCase()))
        return (
          <motion.span
            key={`${word}-${i}`}
            className={`mm-stagger__word ${isHot ? 'mm-stagger__word--hot' : ''}`}
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.55, delay: delay + i * 0.045, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        )
      })}
    </Tag>
  )
}
