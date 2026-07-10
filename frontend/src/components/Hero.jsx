import { motion } from 'framer-motion'
import AppIcon from './AppIcon'

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
}

export default function Hero({ content, herName }) {
  return (
    <section className="hero">
      <div className="hero__glow" />
      <motion.div
        className="hero__content"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="hero__for" variants={item}>
          For {herName}
        </motion.p>
        <motion.h1 className="hero__title" variants={item}>
          {content.title}
          <br />
          <em>{content.subtitle}</em>
        </motion.h1>
        <motion.p className="hero__tagline" variants={item}>
          {content.tagline}
        </motion.p>
        <motion.a href="#story" className="hero__cta" variants={item} whileHover={{ y: -2 }}>
          Read our story
          <motion.span
            className="hero__cta-arrow"
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AppIcon name="chevronDown" size={18} />
          </motion.span>
        </motion.a>
      </motion.div>
      <motion.div
        className="hero__scroll-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <span>scroll</span>
      </motion.div>
    </section>
  )
}
