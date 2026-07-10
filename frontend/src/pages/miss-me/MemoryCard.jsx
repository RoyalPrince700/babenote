import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import GlassCard from './GlassCard'
import { StaggerText } from './GlassCard'
import MmIcon from './icons'
import { EASE, viewportOnce } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function MemoryCard({
  photo,
  photoAlt,
  caption,
  frame = 'wide',
  body = [],
  lead,
  items,
  emphasis = [],
}) {
  const reduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 120, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 120, damping: 18 })

  const onMove = (e) => {
    if (reduced || !ref.current) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    const rect = ref.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width - 0.5)
    my.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <div className="mm-memory">
      {lead && (
        <StaggerText text={lead} className="mm-memory__lead" delay={0.05} highlight={emphasis} />
      )}

      <motion.figure
        ref={ref}
        className={`mm-memory__card mm-memory__card--${frame}`}
        style={reduced ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        initial={{ opacity: 0, y: 48, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.85, ease: EASE }}
      >
        <div className="mm-memory__frame">
          <motion.img
            src={photo}
            alt={photoAlt}
            loading="lazy"
            decoding="async"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 4.5, ease: EASE }}
          />
          <div className="mm-memory__shine" aria-hidden="true" />
        </div>
        {caption && (
          <GlassCard as="figcaption" className="mm-memory__caption">
            {caption}
          </GlassCard>
        )}
      </motion.figure>

      {body.map((line, i) => (
        <StaggerText
          key={i}
          text={line}
          className="mm-memory__body"
          delay={0.08 + i * 0.08}
          highlight={emphasis}
        />
      ))}

      {items && (
        <ul className="mm-memory__list">
          {items.map((item, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
            >
              <MmIcon name="sparkles" size={14} aria-hidden="true" />
              {item}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
