import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  DREAM_BUBBLES,
  DREAM_DRIFT_NOTES,
  DREAM_POP_MESSAGES,
  DREAM_SECRET_HEARTS,
  DREAM_SPINNER_PRIZES,
  DREAM_WARM_LINES,
} from './data'
import { playDreamChime, playDreamSparkle, signalDreamMusic } from './dreamAudio'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

function pick(list, avoid) {
  let item = list[Math.floor(Math.random() * list.length)]
  if (list.length > 1 && item === avoid) {
    item = list[(list.indexOf(item) + 1) % list.length]
  }
  return item
}

function HeartOrb({ exiting }) {
  return (
    <motion.div
      className="mm-dream__orb"
      animate={
        exiting
          ? { scale: 0.2, opacity: 0, filter: 'blur(12px)' }
          : { rotate: 360, scale: [1, 1.05, 1] }
      }
      transition={
        exiting
          ? { duration: 1.1, ease: EASE }
          : {
              rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      aria-hidden="true"
    >
      <span className="mm-dream__orb-core">❤️</span>
      <span className="mm-dream__orb-ring" />
      <span className="mm-dream__orb-ring mm-dream__orb-ring--2" />
    </motion.div>
  )
}

function NicknameBubble({ bubble, index, total, reduced, onPop }) {
  const [phase, setPhase] = useState('float') // float | pop | gone | reform
  const [message, setMessage] = useState('')
  const angle = (index / total) * Math.PI * 2
  const radius = 118 + (index % 3) * 28
  const duration = 14 + (index % 5) * 2.4
  const drift = 10 + (index % 4) * 6

  const handleClick = async () => {
    if (phase !== 'float') return
    setMessage(pick(DREAM_POP_MESSAGES))
    setPhase('pop')
    await playDreamChime()
    onPop?.()
    window.setTimeout(() => setPhase('gone'), 900)
    window.setTimeout(() => setPhase('reform'), 1600)
    window.setTimeout(() => setPhase('float'), 2400)
  }

  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius * 0.78

  return (
    <motion.button
      type="button"
      className={`mm-dream__bubble mm-dream__bubble--${phase}`}
      style={{
        width: bubble.size,
        height: bubble.size,
        fontSize: bubble.size > 90 ? 12 : 11,
        left: '50%',
        top: '50%',
        marginLeft: -bubble.size / 2,
        marginTop: -bubble.size / 2,
      }}
      onClick={handleClick}
      aria-label={`Open love note: ${bubble.label}`}
      initial={{ opacity: 0, scale: 0.6, x, y }}
      animate={
        phase === 'pop'
          ? { scale: 1.35, opacity: 0, x, y }
          : phase === 'gone'
            ? { scale: 0, opacity: 0, x, y }
            : phase === 'reform'
              ? { scale: 0.85, opacity: 0.7, x, y }
              : reduced
                ? { opacity: 1, scale: 1, x, y }
                : {
                    opacity: 1,
                    scale: [1, 1.04, 0.98, 1],
                    x: [x, x + drift, x - drift * 0.6, x],
                    y: [y, y - drift * 0.8, y + drift * 0.5, y],
                  }
      }
      transition={
        phase === 'float' && !reduced
          ? {
              x: { duration, repeat: Infinity, ease: 'easeInOut', delay: index * 0.2 },
              y: { duration: duration * 1.1, repeat: Infinity, ease: 'easeInOut', delay: index * 0.15 },
              scale: { duration: 5 + index * 0.3, repeat: Infinity, ease: 'easeInOut' },
              opacity: { duration: 0.6 },
            }
          : { type: 'spring', stiffness: 180, damping: 16 }
      }
    >
      <span className="mm-dream__bubble-heart" aria-hidden="true">
        ❤️
      </span>
      <span className="mm-dream__bubble-label">{bubble.label}</span>
      <AnimatePresence>
        {phase === 'pop' && message && (
          <motion.span
            className="mm-dream__bubble-toast"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: -36, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function LoveSpinner({ reduced }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [prize, setPrize] = useState(null)
  const count = DREAM_SPINNER_PRIZES.length
  const slice = 360 / count

  const spin = async () => {
    if (spinning) return
    setPrize(null)
    setSpinning(true)
    await playDreamSparkle()
    const index = Math.floor(Math.random() * count)
    const turns = 4 + Math.floor(Math.random() * 3)
    // Pointer at top; prize center should land under pointer
    const target = turns * 360 + (360 - index * slice - slice / 2)
    setRotation((prev) => prev + target - (prev % 360))
    window.setTimeout(() => {
      setPrize(DREAM_SPINNER_PRIZES[index])
      setSpinning(false)
      playDreamChime()
    }, 4200)
  }

  return (
    <div className="mm-dream__spinner">
      <p className="mm-dream__spinner-title">A little surprise for you</p>
      <div className="mm-dream__compass">
        <div className="mm-dream__compass-pointer" aria-hidden="true">
          ♥
        </div>
        <motion.div
          className="mm-dream__compass-wheel"
          animate={{ rotate: rotation }}
          transition={{ duration: spinning ? 4.2 : 0.4, ease: [0.15, 0.85, 0.2, 1] }}
        >
          {DREAM_SPINNER_PRIZES.map((item, i) => (
            <div
              key={item.id}
              className="mm-dream__compass-slice"
              style={{ transform: `rotate(${i * slice}deg)` }}
            >
              <span style={{ transform: `rotate(${slice / 2}deg)` }}>{item.label}</span>
            </div>
          ))}
        </motion.div>
        <div className="mm-dream__compass-center" aria-hidden="true">
          ❤️
        </div>
      </div>
      <motion.button
        type="button"
        className="mm-dream__spin-btn"
        onClick={spin}
        disabled={spinning}
        whileHover={reduced ? undefined : { scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        Spin ❤️
      </motion.button>
      <AnimatePresence mode="wait">
        {prize && (
          <motion.div
            key={prize.id}
            className="mm-dream__prize"
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <span className="mm-dream__prize-burst" aria-hidden="true">
              ✨
            </span>
            <strong>{prize.label}</strong>
            <p>{prize.note}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function AffectionMeter({ active, reduced }) {
  const [label, setLabel] = useState('0%')
  const [glitch, setGlitch] = useState(false)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    const steps = [
      { t: 400, w: 22, l: '100%' },
      { t: 1400, w: 40, l: '200%' },
      { t: 2600, w: 62, l: '500%' },
      { t: 4000, w: 88, l: '9999%' },
      { t: 5200, w: 100, l: 'Error.', g: true },
    ]
    const timers = steps.map((s) =>
      window.setTimeout(() => {
        setWidth(s.w)
        setLabel(s.l)
        if (s.g) setGlitch(true)
      }, reduced ? s.t * 0.5 : s.t),
    )
    return () => timers.forEach(clearTimeout)
  }, [active, reduced])

  return (
    <div className={`mm-dream__meter ${glitch ? 'mm-dream__meter--glitch' : ''}`}>
      <p className="mm-dream__meter-title">How much do I miss you?</p>
      <div className="mm-dream__meter-track" aria-hidden="true">
        <motion.div
          className="mm-dream__meter-fill"
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.85, ease: EASE }}
        />
      </div>
      <p className="mm-dream__meter-label">{label}</p>
      {glitch && (
        <motion.p
          className="mm-dream__meter-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Amount exceeds measurable limits.
        </motion.p>
      )}
    </div>
  )
}

function DriftNotes({ active, reduced }) {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (!active || reduced) return undefined
    let alive = true
    const spawn = () => {
      if (!alive) return
      const id = `${Date.now()}-${Math.random()}`
      const text = pick(DREAM_DRIFT_NOTES)
      setNotes((prev) => [...prev.slice(-5), { id, text, left: 8 + Math.random() * 75 }])
      window.setTimeout(() => {
        setNotes((prev) => prev.filter((n) => n.id !== id))
      }, 7000)
    }
    spawn()
    const interval = window.setInterval(spawn, 2800)
    return () => {
      alive = false
      window.clearInterval(interval)
    }
  }, [active, reduced])

  return (
    <div className="mm-dream__drifts" aria-hidden="true">
      <AnimatePresence>
        {notes.map((n) => (
          <motion.span
            key={n.id}
            className="mm-dream__drift"
            style={{ left: `${n.left}%` }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: [0, 0.9, 0], y: -180 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 6.5, ease: 'easeOut' }}
          >
            {n.text}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}

function SecretHearts({ reduced }) {
  const hearts = useMemo(
    () =>
      DREAM_SECRET_HEARTS.map((msg, i) => ({
        id: i,
        msg,
        left: 10 + ((i * 19) % 80),
        top: 12 + ((i * 23) % 70),
        delay: i * 0.4,
      })),
    [],
  )
  const [open, setOpen] = useState(null)

  return (
    <div className="mm-dream__secrets" aria-hidden={false}>
      {hearts.map((h) => (
        <motion.button
          key={h.id}
          type="button"
          className="mm-dream__secret"
          style={{ left: `${h.left}%`, top: `${h.top}%` }}
          onClick={async () => {
            setOpen(h.id)
            await playDreamSparkle()
            window.setTimeout(() => setOpen((cur) => (cur === h.id ? null : cur)), 3200)
          }}
          animate={reduced ? { opacity: 0.55 } : { y: [0, -8, 0], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 3.5 + h.delay, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
          aria-label="Secret heart"
        >
          ♥
          <AnimatePresence>
            {open === h.id && (
              <motion.span
                className="mm-dream__secret-msg"
                initial={{ opacity: 0, y: 6, scale: 0.92 }}
                animate={{ opacity: 1, y: -28, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {h.msg}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      ))}
    </div>
  )
}

function WarmMessages({ active }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!active) return undefined
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % DREAM_WARM_LINES.length)
    }, 6500)
    return () => window.clearInterval(t)
  }, [active])

  const lines = DREAM_WARM_LINES[index]

  return (
    <div className="mm-dream__warm">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 1, ease: EASE }}
        >
          {lines.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Particles({ reduced }) {
  const dots = useMemo(
    () =>
      Array.from({ length: reduced ? 8 : 22 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        size: 2 + (i % 4),
        delay: (i % 7) * 0.5,
        dur: 8 + (i % 5) * 2,
      })),
    [reduced],
  )

  if (reduced) return null

  return (
    <div className="mm-dream__particles" aria-hidden="true">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="mm-dream__particle"
          style={{ left: d.left, width: d.size, height: d.size }}
          animate={{ y: [40, -220], opacity: [0, 0.8, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

export default function MagicalWorld({ chapter }) {
  const reduced = usePrefersReducedMotion()
  const sectionRef = useRef(null)
  const pinRef = useRef(null)
  const inView = useInView(sectionRef, { amount: 0.25 })
  const deeplyInView = useInView(pinRef, { amount: 0.55 })
  const [snapped, setSnapped] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [showExitLine, setShowExitLine] = useState(0)
  const wasDeep = useRef(false)

  useEffect(() => {
    signalDreamMusic(deeplyInView)
    return () => signalDreamMusic(false)
  }, [deeplyInView])

  useEffect(() => {
    if (!inView || snapped || !sectionRef.current) return undefined
    const t = window.setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setSnapped(true)
    }, 180)
    return () => window.clearTimeout(t)
  }, [inView, snapped])

  useEffect(() => {
    if (deeplyInView) {
      wasDeep.current = true
      setExiting(false)
      setShowExitLine(0)
      return undefined
    }
    if (!wasDeep.current) return undefined
    setExiting(true)
    const a = window.setTimeout(() => setShowExitLine(1), 400)
    const b = window.setTimeout(() => setShowExitLine(2), 1800)
    return () => {
      window.clearTimeout(a)
      window.clearTimeout(b)
    }
  }, [deeplyInView])

  const onBubblePop = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(12)
  }, [])

  return (
    <section ref={sectionRef} className="mm-dream" id="how-i-see-you">
      <div className="mm-dream__sticky">
        <div ref={pinRef} className={`mm-dream__world ${exiting ? 'mm-dream__world--exit' : ''}`}>
          <div className="mm-dream__sky" aria-hidden="true" />
          <Particles reduced={reduced} />
          <DriftNotes active={deeplyInView} reduced={reduced} />
          <SecretHearts reduced={reduced} />

          <div className="mm-dream__header">
            <span className="mm-dream__badge">
              {chapter.emoji} {chapter.label}
            </span>
            <h2 className="mm-dream__title">A little world, just for you</h2>
            <p className="mm-dream__hint">Tap the bubbles. Spin the heart. Stay as long as you want.</p>
          </div>

          <div className="mm-dream__stage">
            <HeartOrb exiting={exiting && !deeplyInView} />
            <div className="mm-dream__orbit">
              {DREAM_BUBBLES.map((bubble, i) => (
                <NicknameBubble
                  key={bubble.id}
                  bubble={bubble}
                  index={i}
                  total={DREAM_BUBBLES.length}
                  reduced={reduced}
                  onPop={onBubblePop}
                />
              ))}
            </div>
          </div>

          <WarmMessages active={deeplyInView} />
          <AffectionMeter active={deeplyInView} reduced={reduced} />
          <LoveSpinner reduced={reduced} />

          <AnimatePresence>
            {showExitLine > 0 && !deeplyInView && (
              <motion.div
                className="mm-dream__farewell"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {showExitLine >= 1 && <p>My favorite place...</p>}
                {showExitLine >= 2 && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                  >
                    ...has always been beside you.
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
