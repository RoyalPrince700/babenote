import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CHEMISTRY_TRAITS,
  COMPLIMENTS,
  FUTURE_PROMISES,
  LOVE_LETTER,
  MEMORY_STARS,
  NOTIFICATIONS,
} from '../data'
import { EASE, viewportOnce } from '../motion'
import { playDreamChime, playDreamSparkle } from '../dreamAudio'
import MmIcon from '../icons'
import usePrefersReducedMotion from '../usePrefersReducedMotion'

export function NotificationsSection() {
  const [visible, setVisible] = useState([])
  const inViewRef = useRef(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const el = inViewRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setStarted(true)
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return undefined
    let i = 0
    const t = window.setInterval(() => {
      if (i >= NOTIFICATIONS.length) {
        window.clearInterval(t)
        return
      }
      const note = NOTIFICATIONS[i]
      setVisible((prev) => [...prev, { ...note, id: `${i}-${note.from}` }])
      playDreamSparkle()
      i += 1
    }, 900)
    return () => window.clearInterval(t)
  }, [started])

  return (
    <section className="xp xp--phone" ref={inViewRef}>
      <div className="xp-phone">
        <div className="xp-phone__notch" />
        <p className="xp-phone__status">Now</p>
        <div className="xp-phone__stack">
          <AnimatePresence>
            {visible.map((n) => (
              <motion.div
                key={n.id}
                className="xp-phone__card"
                initial={{ opacity: 0, y: -24, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              >
                <strong>{n.from}</strong>
                <span>{n.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <p className="xp-phone__caption">If my heart could send notifications…</p>
    </section>
  )
}

export function LoveChemistrySection() {
  const [dropped, setDropped] = useState([])
  const [dragging, setDragging] = useState(null)
  const complete = dropped.length === CHEMISTRY_TRAITS.length

  const onDrop = (id) => {
    if (dropped.includes(id)) return
    setDropped((d) => [...d, id])
    playDreamChime()
    setDragging(null)
  }

  return (
    <section className="xp xp--chem">
      <h2 className="xp-chem__title">Love Chemistry</h2>
      <p className="xp-chem__hint">Drag every feeling into the heart.</p>
      <div className="xp-chem__tray">
        {CHEMISTRY_TRAITS.filter((t) => !dropped.includes(t.id)).map((t) => (
          <motion.button
            key={t.id}
            type="button"
            className="xp-chem__chip"
            style={{ background: t.color }}
            drag
            dragSnapToOrigin
            onDragStart={() => setDragging(t.id)}
            onDragEnd={(_, info) => {
              // Tap-friendly: also allow click to add
              if (Math.hypot(info.offset.x, info.offset.y) < 8) onDrop(t.id)
              else if (info.point.y < window.innerHeight * 0.55) onDrop(t.id)
              setDragging(null)
            }}
            whileTap={{ scale: 1.08 }}
          >
            {t.label}
          </motion.button>
        ))}
      </div>
      <motion.div
        className={`xp-chem__cauldron ${dragging ? 'is-hot' : ''} ${complete ? 'is-done' : ''}`}
        onClick={() => {
          // mobile fallback: tap next chip area handled above; cauldron pulse
        }}
      >
        <span className="xp-chem__heart">
          <MmIcon name="heart" size={32} filled />
        </span>
        <div className="xp-chem__mixed">
          {dropped.map((id) => {
            const t = CHEMISTRY_TRAITS.find((x) => x.id === id)
            return (
              <span key={id} style={{ background: t.color }}>
                {t.label}
              </span>
            )
          })}
        </div>
        {!complete && (
          <p className="xp-chem__or-tap">
            Or tap a feeling to mix it in
          </p>
        )}
      </motion.div>
      <div className="xp-chem__quick">
        {CHEMISTRY_TRAITS.filter((t) => !dropped.includes(t.id)).map((t) => (
          <button key={`tap-${t.id}`} type="button" className="xp-chem__tap" onClick={() => onDrop(t.id)}>
            + {t.label}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {complete && (
          <motion.p
            className="xp-chem__result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Result: <strong>You + Me</strong>
            <span>Perfect formula. No edits needed, Sausie.</span>
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

export function MemoryStarsSection() {
  const [open, setOpen] = useState(null)
  const active = MEMORY_STARS.find((s) => s.id === open)

  return (
    <section className="xp xp--stars">
      <p className="xp-kicker">Memory sky</p>
      <div className="xp-stars__sky">
        {MEMORY_STARS.map((s) => (
          <motion.button
            key={s.id}
            type="button"
            className={`xp-stars__star ${open === s.id ? 'is-open' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            onClick={() => {
              setOpen(s.id)
              playDreamSparkle()
            }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.2 + (s.id % 3) * 0.4, repeat: Infinity, ease: 'easeInOut' }}
            aria-label="Memory star"
            aria-expanded={open === s.id}
          >
            <MmIcon name="star" size={18} filled />
          </motion.button>
        ))}
      </div>

      <div className="xp-stars__reveal" aria-live="polite">
        <AnimatePresence mode="wait">
          {active ? (
            <motion.p
              key={active.id}
              className="xp-stars__msg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              {active.msg}
            </motion.p>
          ) : (
            <motion.p
              key="hint"
              className="xp-stars__msg xp-stars__msg--hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Tap a star to read a memory.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <p className="xp-stars__caption">Each star holds a little piece of us.</p>
    </section>
  )
}

export function HeartbeatSection() {
  const reduced = usePrefersReducedMotion()
  const [taps, setTaps] = useState([])
  const [synced, setSynced] = useState(false)
  const last = useRef(0)

  const onTap = () => {
    const now = performance.now()
    const delta = now - last.current
    last.current = now
    setTaps((prev) => [...prev.slice(-4), delta])
    if (navigator.vibrate) navigator.vibrate(8)

    // ~60-90bpm = 666-1000ms between taps, need 4 steady taps
    const recent = [...taps.slice(-3), delta]
    if (recent.length >= 4) {
      const ok = recent.every((d) => d > 450 && d < 1200)
      if (ok) {
        setSynced(true)
        playDreamChime()
      }
    }
  }

  return (
    <section className="xp xp--beat">
      <h2>Heartbeat Sync</h2>
      <p className="xp-beat__hint">Tap with a calm rhythm — like resting on my chest.</p>
      <motion.button
        type="button"
        className="xp-beat__heart"
        onClick={onTap}
        animate={
          reduced
            ? undefined
            : synced
              ? { scale: [1, 1.08, 1] }
              : { scale: [1, 1.12, 1] }
        }
        transition={{ duration: synced ? 1.2 : 0.85, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MmIcon name="heart" size={64} filled />
      </motion.button>
      <AnimatePresence>
        {synced ? (
          <motion.p
            className="xp-beat__msg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            There. That&apos;s us — steady, soft, and home. I love you, Snuggles.
          </motion.p>
        ) : (
          <p className="xp-beat__count">{Math.min(4, taps.length)} / 4 soft beats</p>
        )}
      </AnimatePresence>
    </section>
  )
}

export function OpenHeartSection() {
  const [open, setOpen] = useState(false)
  const [unrolled, setUnrolled] = useState(false)
  const lines = useMemo(() => LOVE_LETTER.split('\n'), [])

  useEffect(() => {
    if (!open) {
      setUnrolled(false)
      return undefined
    }
    const t = window.setTimeout(() => setUnrolled(true), 180)
    return () => window.clearTimeout(t)
  }, [open])

  return (
    <section className="xp xp--letter">
      <AnimatePresence mode="wait">
        {!open ? (
          <motion.button
            key="env"
            type="button"
            className="xp-letter__envelope"
            onClick={() => {
              setOpen(true)
              playDreamChime()
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -12 }}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="xp-letter__flap" />
            <span className="xp-letter__seal">
              <MmIcon name="heart" size={22} filled />
            </span>
            <span className="xp-letter__label">Open My Heart</span>
          </motion.button>
        ) : (
          <motion.div
            key="scroll"
            className={`xp-scroll ${unrolled ? 'is-unrolled' : ''}`}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <div className="xp-scroll__rod xp-scroll__rod--top" aria-hidden="true">
              <span className="xp-scroll__knob" />
              <span className="xp-scroll__barrel" />
              <span className="xp-scroll__knob" />
            </div>

            <div className="xp-scroll__veil">
              <article className="xp-scroll__sheet">
                <div className="xp-scroll__ruled" aria-hidden="true" />
                <div className="xp-scroll__stain" aria-hidden="true" />
                <header className="xp-scroll__head">
                  <span className="xp-scroll__ornament" aria-hidden="true">
                    ❦
                  </span>
                  <p className="xp-scroll__to">To my dearest Mama</p>
                  <span className="xp-scroll__ornament" aria-hidden="true">
                    ❦
                  </span>
                </header>

                <div className="xp-scroll__body">
                  {lines.map((line, i) => {
                    const trimmed = line.trim()
                    if (!trimmed) {
                      return <p key={i} className="xp-scroll__blank" />
                    }
                    // Header already addresses her — skip the opening greeting line
                    if (trimmed.startsWith('My dearest')) return null
                    const isSignoff = trimmed === 'Always yours.'
                    return (
                      <motion.p
                        key={i}
                        className={isSignoff ? 'xp-scroll__sign' : 'xp-scroll__line'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={unrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ delay: 0.45 + i * 0.16, duration: 0.55, ease: EASE }}
                      >
                        {trimmed}
                      </motion.p>
                    )
                  })}
                </div>

                <footer className="xp-scroll__foot">
                  <span className="xp-scroll__flourish" aria-hidden="true">
                    ✦ · ❧ · ✦
                  </span>
                  <p className="xp-scroll__from">With all my heart</p>
                </footer>
              </article>
            </div>

            <div className="xp-scroll__rod xp-scroll__rod--bottom" aria-hidden="true">
              <span className="xp-scroll__knob" />
              <span className="xp-scroll__barrel" />
              <span className="xp-scroll__knob" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export function ComplimentRainSection() {
  const reduced = usePrefersReducedMotion()
  const [holding, setHolding] = useState(false)
  const [drops, setDrops] = useState([])

  useEffect(() => {
    if (!holding || reduced) return undefined
    const t = window.setInterval(() => {
      const id = `${Date.now()}-${Math.random()}`
      const text = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)]
      setDrops((prev) => [...prev.slice(-18), { id, text, left: 5 + Math.random() * 85 }])
      window.setTimeout(() => setDrops((prev) => prev.filter((d) => d.id !== id)), 3200)
    }, 220)
    return () => window.clearInterval(t)
  }, [holding, reduced])

  return (
    <section className="xp xp--rain">
      <div className="xp-rain__stage" aria-hidden="true">
        <AnimatePresence>
          {drops.map((d) => (
            <motion.span
              key={d.id}
              className="xp-rain__drop"
              style={{ left: `${d.left}%` }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 280 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.8, ease: 'easeIn' }}
            >
              {d.text}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
      <motion.button
        type="button"
        className="xp-rain__hold"
        onPointerDown={() => setHolding(true)}
        onPointerUp={() => setHolding(false)}
        onPointerLeave={() => setHolding(false)}
        onPointerCancel={() => setHolding(false)}
        animate={holding ? { scale: 1.06 } : { scale: 1 }}
      >
        {holding ? 'Keep holding…' : 'Hold for compliment rain'}
      </motion.button>
      <p className="xp-rain__hint">Let it pour, Mama.</p>
    </section>
  )
}

export function ConstellationSection({ chapter }) {
  const points = useMemo(
    () => [
      { x: 20, y: 30 },
      { x: 40, y: 18 },
      { x: 62, y: 28 },
      { x: 72, y: 52 },
      { x: 55, y: 72 },
      { x: 35, y: 72 },
      { x: 18, y: 52 },
      { x: 50, y: 42 },
    ],
    [],
  )
  const [lit, setLit] = useState([])
  const done = lit.length === points.length

  return (
    <section className="xp xp--constellation">
      <h2>Draw Us</h2>
      <p className="xp-constellation__hint">Tap each point to connect our constellation.</p>
      <div className="xp-constellation__board">
        <svg viewBox="0 0 100 100" className="xp-constellation__lines" aria-hidden="true">
          {lit.length > 1 &&
            lit.slice(1).map((idx, i) => {
              const a = points[lit[i]]
              const b = points[idx]
              return (
                <motion.line
                  key={`${lit[i]}-${idx}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.85 }}
                />
              )
            })}
        </svg>
        {points.map((p, i) => (
          <button
            key={i}
            type="button"
            className={`xp-constellation__dot ${lit.includes(i) ? 'is-on' : ''}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onClick={() => {
              if (lit.includes(i)) return
              setLit((prev) => [...prev, i])
              playDreamSparkle()
            }}
            aria-label={`Star ${i + 1}`}
          />
        ))}
        <AnimatePresence>
          {done && (
            <motion.div
              className="xp-constellation__reveal"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img src={chapter.photo} alt="Us" loading="lazy" />
              <p>Connected. Always.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export function PhotoMosaicSection({ chapter }) {
  const [active, setActive] = useState(0)

  return (
    <section className="xp xp--mosaic">
      <div className="xp-mosaic__track">
        {chapter.photos.map((src, i) => (
          <motion.button
            key={i}
            type="button"
            className={`xp-mosaic__card ${active === i ? 'is-active' : ''}`}
            onClick={() => setActive(i)}
            whileHover={{ y: -6 }}
            style={{ zIndex: active === i ? 3 : 1 }}
          >
            <img src={src} alt="" loading="lazy" />
          </motion.button>
        ))}
      </div>
      <p className="xp-mosaic__caption">Different days. Same feeling. Us.</p>
    </section>
  )
}

export function FutureSection() {
  return (
    <section className="xp xp--future">
      <div className="xp-future__horizon" aria-hidden="true" />
      <h2 className="xp-future__title">Our horizon</h2>
      <p className="xp-future__sub">Promises floating toward us.</p>
      <div className="xp-future__row">
        {FUTURE_PROMISES.map((p, i) => (
          <motion.div
            key={p.id}
            className="xp-future__card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
            drag="x"
            dragConstraints={{ left: -20, right: 20 }}
          >
            <span>
              <MmIcon name={p.icon} size={28} />
            </span>
            <strong>{p.text}</strong>
          </motion.div>
        ))}
      </div>
      <motion.p
        className="xp-future__close"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
      >
        More memories. More snuggles. More choosing you, Sausie.
      </motion.p>
    </section>
  )
}
