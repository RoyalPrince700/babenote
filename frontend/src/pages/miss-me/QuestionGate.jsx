import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import AmbientBackground from './AmbientBackground'
import EvasiveNoButton from './EvasiveNoButton'
import FloatingHearts from './FloatingHearts'
import { fadeScale, stageTransition } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'
import babePhoto from '../../assets/babe.jpeg'

export default function QuestionGate({ onYes }) {
  const playgroundRef = useRef(null)
  const reduced = usePrefersReducedMotion()

  const handleYes = () => {
    if (navigator.vibrate) navigator.vibrate([18, 40, 18])
    onYes()
  }

  return (
    <motion.section
      className="mm-stage mm-question"
      variants={fadeScale}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={stageTransition}
    >
      <AmbientBackground variant="question" />
      <FloatingHearts count={12} />

      <div className="mm-question__inner">
        <motion.div
          className="mm-question__photo"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mm-question__glow" aria-hidden="true" />
          <img src={babePhoto} alt="You" />
          <p className="mm-question__photo-caption">Looking at you… so tell me honestly.</p>
        </motion.div>

        <motion.h1
          className="mm-question__title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          Do you miss me?
        </motion.h1>
        <motion.p
          className="mm-question__subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          Be honest… I already know the answer I want to hear.
        </motion.p>

        <div className="mm-question__playground" ref={playgroundRef}>
          <EvasiveNoButton containerRef={playgroundRef} />
        </div>

        <motion.button
          type="button"
          className="mm-yes"
          onClick={handleYes}
          whileHover={reduced ? undefined : { scale: 1.06 }}
          whileTap={{ scale: 0.97 }}
          animate={
            reduced
              ? undefined
              : {
                  boxShadow: [
                    '0 8px 32px rgba(196, 92, 122, 0.35)',
                    '0 12px 42px rgba(232, 160, 180, 0.55)',
                    '0 8px 32px rgba(196, 92, 122, 0.35)',
                  ],
                }
          }
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Heart size={18} fill="currentColor" />
          Yes, I miss you!
        </motion.button>

        <p className="mm-question__hint">Psst… the “No” button is not really an option.</p>
      </div>
    </motion.section>
  )
}
