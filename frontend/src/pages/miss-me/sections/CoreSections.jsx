import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { SAUSIE_BEATS } from '../data'
import MmIcon from '../icons'
import { EASE, viewportOnce } from '../motion'
import { playDreamChime } from '../dreamAudio'

export function GiantNameSection({ chapter }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % chapter.names.length), 2200)
    return () => window.clearInterval(t)
  }, [chapter.names.length])

  return (
    <section className="xp xp--giant">
      <AnimatePresence mode="wait">
        <motion.h2
          key={chapter.names[i]}
          className="xp-giant__word"
          initial={{ opacity: 0, scale: 0.86, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(8px)' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {chapter.names[i]}
        </motion.h2>
      </AnimatePresence>
      <p className="xp-giant__sub">Three names. One heart. All you.</p>
    </section>
  )
}

export function SausieStorySection() {
  const [step, setStep] = useState(0)
  const beat = SAUSIE_BEATS[step]
  const last = step === SAUSIE_BEATS.length - 1

  return (
    <section className="xp xp--sausie">
      <div className="xp-sausie">
        <p className="xp-kicker">Why you&apos;re my Sausie</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={beat.id}
            className="xp-sausie__card"
            initial={{ opacity: 0, x: 40, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -30, rotate: -2 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <motion.span
              className="xp-sausie__emoji"
              animate={{ y: [0, -6, 0], rotate: [0, -6, 6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MmIcon name={beat.icon} size={42} filled={beat.icon === 'heart'} />
            </motion.span>
            <h3>{beat.title}</h3>
            <p>{beat.text}</p>
          </motion.div>
        </AnimatePresence>
        <div className="xp-sausie__dots" aria-hidden="true">
          {SAUSIE_BEATS.map((b, idx) => (
            <span key={b.id} className={idx === step ? 'is-on' : ''} />
          ))}
        </div>
        <button
          type="button"
          className="xp-btn"
          onClick={() => {
            playDreamChime()
            setStep((s) => Math.min(s + 1, SAUSIE_BEATS.length - 1))
          }}
          disabled={last}
        >
          {last ? (
            <>
              That&apos;s my Sausie <MmIcon name="heart" size={16} filled />
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </section>
  )
}

export function PhotoHoldSection({ chapter }) {
  const [holding, setHolding] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!holding || revealed) return undefined
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 900)
      setProgress(p)
      if (p >= 1) {
        setRevealed(true)
        playDreamChime()
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [holding, revealed])

  const endHold = () => {
    setHolding(false)
    if (!revealed) setProgress(0)
  }

  return (
    <section className="xp xp--hold">
      <p className="xp-kicker">{chapter.hint}</p>
      <motion.div
        className="xp-hold__frame"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId)
          setHolding(true)
        }}
        onPointerUp={endHold}
        onPointerCancel={endHold}
        whileTap={{ scale: 0.985 }}
      >
        <img src={chapter.photo} alt={chapter.photoAlt} loading="lazy" />
        <div className="xp-hold__ring" style={{ ['--p']: progress }} aria-hidden="true" />
        <AnimatePresence>
          {revealed && (
            <motion.p
              className="xp-hold__secret"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {chapter.secret}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}

export function HugMeterSection() {
  const [count, setCount] = useState(0)
  const overflow = count >= 24
  const width = Math.min(100, count * 5)

  const labels = [
    [0, '0 hugs'],
    [4, 'Warming up…'],
    [8, '100%'],
    [12, '500%'],
    [16, '9999%'],
    [24, 'Overflow.'],
  ]
  const label = [...labels].reverse().find(([n]) => count >= n)?.[1] || '0 hugs'

  return (
    <section className="xp xp--hug">
      <div className="xp-hug">
        <h2>Hug Meter</h2>
        <p className="xp-hug__hint">Tap like you mean it, Snuggles.</p>
        <motion.button
          type="button"
          className="xp-hug__btn"
          onClick={() => {
            setCount((c) => c + 1)
            if (navigator.vibrate) navigator.vibrate(10)
          }}
          whileTap={{ scale: 0.92 }}
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          Hug Me <MmIcon name="heart" size={16} filled />
        </motion.button>
        <div className="xp-hug__track">
          <motion.div className="xp-hug__fill" animate={{ width: `${width}%` }} />
        </div>
        <p className={`xp-hug__label ${overflow ? 'is-overflow' : ''}`}>{label}</p>
        {overflow && (
          <motion.p
            className="xp-hug__extra"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            There is no limit. Not for you, Mama.
          </motion.p>
        )}
      </div>
    </section>
  )
}

export function SnuggleModeSection() {
  const [moonMsg, setMoonMsg] = useState(false)

  return (
    <section className="xp xp--snuggle">
      <div className="xp-snuggle__sky" aria-hidden="true">
        {Array.from({ length: 28 }, (_, i) => (
          <span
            key={i}
            className="xp-snuggle__star"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 29) % 70}%`,
              animationDelay: `${(i % 7) * 0.35}s`,
            }}
          />
        ))}
        <motion.button
          type="button"
          className="xp-snuggle__moon"
          aria-label="Moon"
          onClick={() => {
            setMoonMsg(true)
            playDreamChime()
          }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="xp-snuggle__cloud xp-snuggle__cloud--1" />
        <div className="xp-snuggle__cloud xp-snuggle__cloud--2" />
      </div>
      <div className="xp-snuggle__content">
        <p className="xp-kicker">Snuggle Mode</p>
        <motion.p
          className="xp-snuggle__line"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, ease: EASE }}
        >
          If you were here right now…
        </motion.p>
        <motion.p
          className="xp-snuggle__line xp-snuggle__line--soft"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 1, delay: 0.55, ease: EASE }}
        >
          I&apos;d wrap you in the biggest hug, Snuggles.
        </motion.p>
        <div className="xp-snuggle__blanket" aria-hidden="true" />
        <AnimatePresence>
          {moonMsg && (
            <motion.p
              className="xp-easter"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              Even the moon knows you&apos;re my favorite view.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
