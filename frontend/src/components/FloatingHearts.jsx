import { useMemo } from 'react'
import { motion } from 'framer-motion'
import AppIcon from './AppIcon'

const FLOATING_ICONS = ['heart', 'sparkles', 'heart']

export default function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        icon: FLOATING_ICONS[i % FLOATING_ICONS.length],
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 15,
        duration: 12 + Math.random() * 10,
        size: 14 + Math.random() * 12,
        opacity: 0.15 + Math.random() * 0.35,
      })),
    []
  )

  return (
    <div className="floating-hearts" aria-hidden="true">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="floating-hearts__item"
          style={{ left: heart.left, opacity: heart.opacity }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{ y: '-10vh', rotate: 360 }}
          transition={{
            duration: heart.duration,
            delay: heart.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <AppIcon name={heart.icon} size={heart.size} />
        </motion.div>
      ))}
    </div>
  )
}
