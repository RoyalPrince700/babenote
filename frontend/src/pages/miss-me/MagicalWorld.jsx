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
import MmIcon from './icons'
import { EASE } from './motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

function pick(list, avoid) {
  let item = list[Math.floor(Math.random() * list.length)]
  if (list.length > 1 && item === avoid) {
    item = list[(list.indexOf(item) + 1) % list.length]
  }
  return item
}

function HeartOrb({ reduced }) {
  return (
    <motion.div
      className="mm-dream__orb"
      animate={
        reduced
          ? { opacity: 1, scale: 1 }
          : { rotate: 360, scale: [1, 1.06, 1] }
      }
      transition={
        reduced
          ? { duration: 0.4 }
          : {
              rotate: { duration: 32, repeat: Infinity, ease: 'linear' },
              scale: { duration: 4.6, repeat: Infinity, ease: 'easeInOut' },
            }
      }
      aria-hidden="true"
    >
      <span className="mm-dream__orb-core">
        <MmIcon name="heart" size={36} filled />
      </span>
      <span className="mm-dream__orb-ring" />
      <span className="mm-dream__orb-ring mm-dream__orb-ring--2" />
    </motion.div>
  )
}

function BurstParticles({ id, reduced }) {
  const bits = useMemo(
    () =>
      Array.from({ length: reduced ? 5 : 10 }, (_, i) => {
        const angle = (i / 10) * Math.PI * 2 + Math.random() * 0.4
        const dist = 36 + Math.random() * 52
        return {
          id: `${id}-${i}`,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 6 + Math.random() * 10,
          delay: i * 0.02,
        }
      }),
    [id, reduced],
  )

  return (
    <span className="mm-dream__burst" aria-hidden="true">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="mm-dream__burst-bit"
          style={{ width: b.size, height: b.size }}
          initial={{ opacity: 0.95, scale: 1, x: 0, y: 0 }}
          animate={{ opacity: 0, scale: 0.2, x: b.x, y: b.y }}
          transition={{ duration: 0.7, delay: b.delay, ease: 'easeOut' }}
        />
      ))}
    </span>
  )
}

function NicknameBubble({ bubble, index, total, reduced, onPop, wide }) {
  const [phase, setPhase] = useState('float')
  const [message, setMessage] = useState('')
  const [burstKey, setBurstKey] = useState(0)
  const rings = wide ? 5 : 3
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2 + (index % rings) * 0.12
  const base = wide ? 130 : 88
  const step = wide ? 42 : 24
  const radius = base + (index % rings) * step
  const duration = 10 + (index % 5) * 1.8
  const driftX = (wide ? 22 : 12) + (index % 4) * 5
  const driftY = (wide ? 26 : 16) + (index % 3) * 7

  const handleClick = async () => {
    if (phase !== 'float') return
    setMessage(pick(DREAM_POP_MESSAGES))
    setBurstKey((k) => k + 1)
    setPhase('pop')
    await playDreamChime()
    onPop?.()
    window.setTimeout(() => setPhase('gone'), 750)
    window.setTimeout(() => setPhase('reform'), 1400)
    window.setTimeout(() => setPhase('float'), 2100)
  }

  const x = Math.cos(angle) * radius
  const y = Math.sin(angle) * radius * 0.82

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
      initial={{ opacity: 0, scale: 0.55, x, y }}
      animate={
        phase === 'pop'
          ? { scale: [1, 1.2, 0.15], opacity: [1, 1, 0], x, y }
          : phase === 'gone'
            ? { scale: 0, opacity: 0, x, y }
            : phase === 'reform'
              ? { scale: 0.7, opacity: 0.55, x, y }
              : reduced
                ? { opacity: 1, scale: 1, x, y }
                : {
                    opacity: 1,
                    scale: [1, 1.05, 0.97, 1.02, 1],
                    x: [x, x + driftX, x - driftX * 0.7, x + driftX * 0.35, x],
                    y: [y, y - driftY, y + driftY * 0.55, y - driftY * 0.35, y],
                  }
      }
      transition={
        phase === 'float' && !reduced
          ? {
              x: {
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.18,
              },
              y: {
                duration: duration * 1.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: index * 0.12,
              },
              scale: {
                duration: 4.5 + (index % 4) * 0.4,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              opacity: { duration: 0.55 },
            }
          : phase === 'pop'
            ? { duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }
            : { type: 'spring', stiffness: 200, damping: 16 }
      }
    >
      <span className="mm-dream__bubble-shine" aria-hidden="true" />
      <span className="mm-dream__bubble-heart" aria-hidden="true">
        <MmIcon name="heart" size={12} filled />
      </span>
      <span className="mm-dream__bubble-label">{bubble.label}</span>

      {phase === 'pop' && <BurstParticles id={burstKey} reduced={reduced} />}

      <AnimatePresence>
        {phase === 'pop' && message && (
          <motion.span
            className="mm-dream__bubble-toast"
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: -42, scale: 1 }}
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

function pickSpinnerPrize() {
  const lomlIndex = DREAM_SPINNER_PRIZES.findIndex((p) => p.id === 'loml')
  // 8 out of 10 spins land on Send me LOML
  if (lomlIndex >= 0 && Math.random() < 0.8) return lomlIndex
  const others = DREAM_SPINNER_PRIZES.map((_, i) => i).filter((i) => i !== lomlIndex)
  return others[Math.floor(Math.random() * others.length)]
}

function SpinSparks({ active }) {
  const sparks = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        angle: (i / 12) * 360,
        delay: (i % 6) * 0.08,
        dist: 52 + (i % 4) * 10,
      })),
    [],
  )

  if (!active) return null

  return (
    <div className="mm-dream__spin-sparks" aria-hidden="true">
      {sparks.map((s) => (
        <motion.span
          key={s.id}
          className="mm-dream__spin-spark"
          style={{ '--spark-angle': `${s.angle}deg` }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.2, 0.3],
            x: [0, Math.cos((s.angle * Math.PI) / 180) * s.dist],
            y: [0, Math.sin((s.angle * Math.PI) / 180) * s.dist],
          }}
          transition={{
            duration: 0.9,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

function LoveSpinner({ reduced }) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [prize, setPrize] = useState(null)
  const [flash, setFlash] = useState(false)
  const count = DREAM_SPINNER_PRIZES.length
  const slice = 360 / count

  const spin = async () => {
    if (spinning) return
    setPrize(null)
    setFlash(false)
    setSpinning(true)
    await playDreamSparkle()
    const index = pickSpinnerPrize()
    const turns = 5 + Math.floor(Math.random() * 3)
    const target = turns * 360 + (360 - index * slice - slice / 2)
    setRotation((prev) => prev + target - (prev % 360))
    window.setTimeout(() => {
      const won = DREAM_SPINNER_PRIZES[index]
      setPrize(won)
      setSpinning(false)
      setFlash(true)
      playDreamChime()
      if (won.id === 'loml' && navigator.vibrate) navigator.vibrate([18, 40, 18])
      window.setTimeout(() => setFlash(false), 1200)
    }, 4800)
  }

  return (
    <div className={`mm-dream__spinner ${spinning ? 'is-spinning' : ''} ${flash ? 'is-flash' : ''}`}>
      <p className="mm-dream__spinner-title">A little surprise for you</p>
      <div className="mm-dream__compass">
        <motion.div
          className="mm-dream__compass-pointer"
          aria-hidden="true"
          animate={
            spinning
              ? { y: [0, -3, 0], scale: [1, 1.15, 1], rotate: [0, -8, 8, 0] }
              : { y: 0, scale: 1, rotate: 0 }
          }
          transition={
            spinning
              ? { duration: 0.35, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.3 }
          }
        >
          <MmIcon name="heart" size={16} filled />
        </motion.div>
        <SpinSparks active={spinning && !reduced} />
        <motion.div
          className="mm-dream__compass-glow"
          aria-hidden="true"
          animate={
            spinning
              ? { opacity: [0.35, 0.85, 0.35], scale: [1, 1.08, 1] }
              : flash
                ? { opacity: [0, 1, 0.4], scale: [0.9, 1.12, 1] }
                : { opacity: 0.25, scale: 1 }
          }
          transition={
            spinning
              ? { duration: 0.7, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.9, ease: EASE }
          }
        />
        <motion.div
          className="mm-dream__compass-wheel"
          animate={{ rotate: rotation }}
          transition={{
            duration: spinning ? 4.8 : 0.4,
            ease: spinning ? [0.12, 0.75, 0.08, 1] : 'easeOut',
          }}
        >
          {DREAM_SPINNER_PRIZES.map((item, i) => (
            <div
              key={item.id}
              className={`mm-dream__compass-slice ${item.id === 'loml' ? 'is-loml' : ''}`}
              style={{ transform: `rotate(${i * slice}deg)` }}
            >
              <span style={{ transform: `rotate(${slice / 2}deg)` }}>{item.label}</span>
            </div>
          ))}
        </motion.div>
        <motion.div
          className="mm-dream__compass-center"
          aria-hidden="true"
          animate={spinning && !reduced ? { scale: [1, 1.12, 1], rotate: [0, 12, -8, 0] } : { scale: 1 }}
          transition={spinning ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
        >
          <MmIcon name="heart" size={18} filled />
        </motion.div>
      </div>
      <motion.button
        type="button"
        className="mm-dream__spin-btn"
        onClick={spin}
        disabled={spinning}
        whileHover={reduced || spinning ? undefined : { scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        animate={spinning ? { scale: [1, 0.97, 1] } : { scale: 1 }}
        transition={spinning ? { duration: 0.6, repeat: Infinity } : { duration: 0.2 }}
      >
        {spinning ? 'Spinning…' : 'Spin'} <MmIcon name="heart" size={16} filled />
      </motion.button>
      <AnimatePresence mode="wait">
        {prize && (
          <motion.div
            key={prize.id}
            className={`mm-dream__prize ${prize.id === 'loml' ? 'mm-dream__prize--loml' : ''}`}
            initial={{ opacity: 0, y: 16, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
          >
            <span className="mm-dream__prize-burst" aria-hidden="true">
              <MmIcon name="sparkles" size={20} />
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
          <MmIcon name="heart" size={14} filled />
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
      Array.from({ length: reduced ? 8 : 18 }, (_, i) => ({
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

function DreamSky({ reduced }) {
  return (
    <>
      <div className="mm-dream__sky" aria-hidden="true" />
      <Particles reduced={reduced} />
    </>
  )
}

const MOBILE_BUBBLE_COUNT = 10

export default function MagicalWorld({ chapter }) {
  const reduced = usePrefersReducedMotion()
  const [wide, setWide] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 900px)').matches : false,
  )
  const seeRef = useRef(null)
  const spinRef = useRef(null)
  const seeInView = useInView(seeRef, { amount: 0.4 })
  const spinInView = useInView(spinRef, { amount: 0.35 })
  const musicActive = seeInView || spinInView

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)')
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    signalDreamMusic(musicActive)
    return () => signalDreamMusic(false)
  }, [musicActive])

  const bubbles = useMemo(
    () => (wide ? DREAM_BUBBLES : DREAM_BUBBLES.slice(0, MOBILE_BUBBLE_COUNT)),
    [wide],
  )

  const onBubblePop = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(12)
  }, [])

  return (
    <>
      <section ref={seeRef} className="mm-dream mm-dream--see" id="how-i-see-you">
        <DreamSky reduced={reduced} />
        <DriftNotes active={seeInView} reduced={reduced} />
        <SecretHearts reduced={reduced} />

        <div className="mm-dream__panel">
          <div className="mm-dream__header">
            <span className="mm-dream__badge">
              <MmIcon name={chapter.icon || 'sparkles'} size={14} /> {chapter.label}
            </span>
            <h2 className="mm-dream__title">A little world for Mama</h2>
            <p className="mm-dream__hint">Tap a floating circle — watch it burst into bubbles.</p>
          </div>

          <div className={`mm-dream__stage ${wide ? 'mm-dream__stage--wide' : ''}`}>
            <HeartOrb reduced={reduced} />
            <div className="mm-dream__orbit">
              {bubbles.map((bubble, i) => (
                <NicknameBubble
                  key={bubble.id}
                  bubble={bubble}
                  index={i}
                  total={bubbles.length}
                  reduced={reduced}
                  onPop={onBubblePop}
                  wide={wide}
                />
              ))}
            </div>
          </div>

          <WarmMessages active={seeInView} />
        </div>
      </section>

      <section ref={spinRef} className="mm-dream mm-dream--spin" id="love-spinner">
        <DreamSky reduced={reduced} />
        <DriftNotes active={spinInView} reduced={reduced} />

        <div className="mm-dream__panel">
          <div className="mm-dream__header">
            <span className="mm-dream__badge">
              <MmIcon name="heart" size={14} filled /> Surprise spin
            </span>
            <h2 className="mm-dream__title">Spin for a little gift</h2>
            <p className="mm-dream__hint">One spin. One soft promise. Just for you.</p>
          </div>

          <AffectionMeter active={spinInView} reduced={reduced} />
          <LoveSpinner reduced={reduced} />
        </div>
      </section>
    </>
  )
}
