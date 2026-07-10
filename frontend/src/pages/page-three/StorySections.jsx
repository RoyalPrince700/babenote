import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import {
  GRAVITY_WORDS,
  HEART_DRAWERS,
  HEARTBEATS,
  IMPACT,
  INVENTORY,
  LITTLE_THINGS,
  ORDINARY,
  PETALS,
  PROOFS,
  SECRETS,
  SENTENCES,
} from './data'
import { SectionShell } from './shared'
import { burstAtEvent, celebrateTap, softVibrate } from '../page-two/fx'
import MmIcon from '../miss-me/icons'
import { EASE, viewportOnce } from '../miss-me/motion'
import usePrefersReducedMotion from '../miss-me/usePrefersReducedMotion'

export function HeroSection() {
  const reduced = usePrefersReducedMotion()

  return (
    <section className="p3-section p3-hero p3-section--flush">
      <div className="p3-hero__glow" aria-hidden="true" />
      <div className="p3-hero__content">
        <p className="p3-kicker">Chapter three</p>
        <motion.h1
          className="p3-hero__title"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          If I could put my heart into a website…
        </motion.h1>
        <motion.p
          className="p3-hero__sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.35, ease: EASE }}
        >
          …it would look like this. Slow. Warm. Yours.
        </motion.p>
      </div>
      <motion.div
        className="p3-hero__scroll"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  )
}

export function SoftInventorySection() {
  const [open, setOpen] = useState({})

  return (
    <SectionShell
      kicker="I carry you"
      title="Soft inventory"
      subtitle="Tap each piece of you I keep with me."
      className="p3-inventory"
    >
      <div className="p3-inventory__grid">
        {INVENTORY.map((item, i) => {
          const active = open[item.id]
          return (
            <motion.button
              key={item.id}
              type="button"
              className={`p3-inventory__item ${active ? 'is-open' : ''}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.06, duration: 0.55, ease: EASE }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => {
                setOpen((s) => ({ ...s, [item.id]: !s[item.id] }))
                celebrateTap('sparkle')
                burstAtEvent(e, 5)
              }}
            >
              <span className="p3-inventory__label">{item.label}</span>
              <AnimatePresence>
                {active && (
                  <motion.span
                    className="p3-inventory__keep"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {item.keep}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </SectionShell>
  )
}

export function OrdinarySection() {
  const [revealed, setRevealed] = useState({})

  return (
    <SectionShell
      kicker="After you"
      title="You changed ordinary"
      subtitle="Tap each day-piece. Watch it transform."
      className="p3-ordinary"
    >
      <div className="p3-ordinary__list">
        {ORDINARY.map((item, i) => {
          const on = revealed[item.id]
          return (
            <motion.button
              key={item.id}
              type="button"
              className={`p3-ordinary__row ${on ? 'is-on' : ''}`}
              initial={{ opacity: 0, x: i % 2 ? 24 : -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
              onClick={(e) => {
                setRevealed((s) => ({ ...s, [item.id]: true }))
                celebrateTap('chime')
                burstAtEvent(e, 4)
              }}
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={on ? 'a' : 'b'}
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.45 }}
                >
                  {on ? item.after : item.before}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
      <p className="p3-ordinary__foot">Nothing about my days stayed ordinary after you.</p>
    </SectionShell>
  )
}

export function SecretsSection() {
  const [index, setIndex] = useState(-1)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || index < 0 || index >= SECRETS.length - 1) return undefined
    const t = window.setTimeout(() => setIndex((i) => i + 1), 1600)
    return () => window.clearTimeout(t)
  }, [index, reduced])

  const started = index >= 0
  const visible = started ? SECRETS.slice(0, index + 1) : []

  return (
    <SectionShell
      kicker="Quiet truths"
      title="Things you don't know"
      subtitle="Little things I never found the right moment to say."
      className="p3-secrets"
    >
      {!started ? (
        <motion.button
          type="button"
          className="p3-btn"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setIndex(0)
            celebrateTap('chime')
          }}
        >
          Reveal them softly
        </motion.button>
      ) : (
        <ul className="p3-secrets__list">
          <AnimatePresence>
            {visible.map((line) => (
              <motion.li
                key={line}
                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.75, ease: EASE }}
              >
                {line}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {started && index >= SECRETS.length - 1 && (
        <motion.button
          type="button"
          className="p3-btn p3-btn--ghost"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIndex(0)}
        >
          Watch again
        </motion.button>
      )}
    </SectionShell>
  )
}

export function SentencesSection() {
  const [done, setDone] = useState({})

  return (
    <SectionShell
      kicker="Finish with me"
      title="Unfinished sentences"
      subtitle="Tap each line. Complete what my heart started."
      className="p3-sentences"
    >
      <div className="p3-sentences__stack">
        {SENTENCES.map((s, i) => {
          const complete = done[i]
          return (
            <motion.button
              key={s.start}
              type="button"
              className={`p3-sentences__card ${complete ? 'is-done' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.08, duration: 0.6, ease: EASE }}
              onClick={(e) => {
                setDone((d) => ({ ...d, [i]: true }))
                celebrateTap('sparkle')
                burstAtEvent(e, 5)
              }}
            >
              <span className="p3-sentences__start">{s.start}</span>
              <AnimatePresence>
                {complete ? (
                  <motion.span
                    className="p3-sentences__end"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    {s.end}
                  </motion.span>
                ) : (
                  <motion.span className="p3-sentences__blank" initial={{ opacity: 0.5 }} animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}>
                    …
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
    </SectionShell>
  )
}

export function LittleThingsSection() {
  const [active, setActive] = useState(0)

  return (
    <SectionShell
      kicker="Tiny forever"
      title="The little things"
      subtitle="Swipe through the details I treasure."
      className="p3-little"
    >
      <div
        className="p3-little__track"
        onTouchStart={(e) => {
          e.currentTarget.dataset.x = String(e.touches[0].clientX)
        }}
        onTouchEnd={(e) => {
          const start = Number(e.currentTarget.dataset.x || 0)
          const end = e.changedTouches[0].clientX
          const dx = end - start
          if (Math.abs(dx) < 40) return
          setActive((a) => {
            if (dx < 0) return Math.min(LITTLE_THINGS.length - 1, a + 1)
            return Math.max(0, a - 1)
          })
          celebrateTap('sparkle')
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={LITTLE_THINGS[active].id}
            className="p3-little__card"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p className="p3-little__title">{LITTLE_THINGS[active].title}</p>
            <p className="p3-little__note">{LITTLE_THINGS[active].note}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="p3-little__dots" role="tablist" aria-label="Little things">
        {LITTLE_THINGS.map((item, i) => (
          <button
            key={item.id}
            type="button"
            className={`p3-little__dot ${i === active ? 'is-on' : ''}`}
            aria-label={`Show ${item.title}`}
            onClick={() => setActive(i)}
          />
        ))}
      </div>
    </SectionShell>
  )
}

export function BorrowedLightSection() {
  const [lit, setLit] = useState(0)
  const holding = useRef(false)
  const litRef = useRef(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    let raf
    const loop = () => {
      if (holding.current) {
        litRef.current = Math.min(1, litRef.current + (reduced ? 0.08 : 0.035))
        setLit(litRef.current)
        if (litRef.current >= 0.98) {
          holding.current = false
          celebrateTap('chime')
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <SectionShell
      kicker="Hold the dark"
      title="Borrowed light"
      subtitle="Press and hold. Let her warmth fill the room."
      className="p3-light"
    >
      <button
        type="button"
        className="p3-light__stage"
        style={{ '--lit': lit }}
        onPointerDown={() => {
          holding.current = true
          softVibrate(8)
        }}
        onPointerUp={() => {
          holding.current = false
        }}
        onPointerLeave={() => {
          holding.current = false
        }}
        onPointerCancel={() => {
          holding.current = false
        }}
        aria-label="Hold to fill with light"
      >
        <span className="p3-light__veil" />
        <span className="p3-light__copy">
          {lit < 0.2 && 'Hold…'}
          {lit >= 0.2 && lit < 0.7 && 'Warmer…'}
          {lit >= 0.7 && lit < 0.95 && 'Almost…'}
          {lit >= 0.95 && 'You light every room I enter.'}
        </span>
      </button>
    </SectionShell>
  )
}

export function ImpactSection() {
  const [seen, setSeen] = useState({})

  return (
    <SectionShell
      kicker="Quiet change"
      title="Your impact"
      subtitle="Tap each shift you made in me."
      className="p3-impact"
    >
      <div className="p3-impact__grid">
        {IMPACT.map((item, i) => {
          const on = seen[i]
          return (
            <motion.button
              key={item.to}
              type="button"
              className={`p3-impact__tile ${on ? 'is-on' : ''}`}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.05, duration: 0.55, ease: EASE }}
              onClick={(e) => {
                setSeen((s) => ({ ...s, [i]: true }))
                celebrateTap('chime')
                burstAtEvent(e, 6)
              }}
            >
              <span className="p3-impact__from">{item.from}</span>
              <span className="p3-impact__arrow" aria-hidden="true">
                →
              </span>
              <span className="p3-impact__to">{on ? item.to : '…'}</span>
            </motion.button>
          )
        })}
      </div>
    </SectionShell>
  )
}

export function HeartDrawersSection() {
  const [open, setOpen] = useState(null)

  return (
    <SectionShell
      kicker="Inside"
      title="Where I keep you"
      subtitle="Open a drawer of my heart."
      className="p3-drawers"
    >
      <div className="p3-drawers__cabinet">
        {HEART_DRAWERS.map((d) => (
          <motion.button
            key={d.id}
            type="button"
            className={`p3-drawers__row ${open === d.id ? 'is-open' : ''}`}
            whileTap={{ scale: 0.99 }}
            onClick={() => {
              setOpen((o) => (o === d.id ? null : d.id))
              celebrateTap('sparkle')
            }}
          >
            <span className="p3-drawers__handle" />
            <span className="p3-drawers__label">{d.label}</span>
            <AnimatePresence>
              {open === d.id && (
                <motion.span
                  className="p3-drawers__text"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {d.text}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </SectionShell>
  )
}

export function HeartSpeakSection() {
  const [beat, setBeat] = useState(0)
  const [running, setRunning] = useState(false)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!running || reduced) return undefined
    const t = window.setInterval(() => {
      setBeat((b) => (b + 1) % HEARTBEATS.length)
      softVibrate(10)
    }, 2200)
    return () => window.clearInterval(t)
  }, [running, reduced])

  return (
    <SectionShell
      kicker="Listen"
      title="If my heart could speak"
      subtitle="Tap the heart. Every beat says something true."
      className="p3-speak"
    >
      <button
        type="button"
        className="p3-speak__heart"
        aria-label="Start heartbeats"
        onClick={() => {
          setRunning(true)
          setBeat(0)
          celebrateTap('chime')
        }}
      >
        <motion.span
          animate={running && !reduced ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <MmIcon name="heart" size={72} filled />
        </motion.span>
        <span className="p3-speak__glow" aria-hidden="true" />
      </button>
      <div className="p3-speak__line-wrap" aria-live="polite">
        <AnimatePresence mode="wait">
          {running && (
            <motion.p
              key={HEARTBEATS[beat]}
              className="p3-speak__line"
              initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              {HEARTBEATS[beat]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      {!running && <p className="p3-hint">Tap to begin</p>}
    </SectionShell>
  )
}

export function SoftestYesSection() {
  const [count, setCount] = useState(0)
  const petals = PETALS.slice(0, count)

  return (
    <SectionShell
      kicker="Bloom"
      title="The softest yes"
      subtitle="Tap the center. Watch reasons bloom."
      className="p3-yes"
    >
      <div className="p3-yes__garden">
        {petals.map((p, i) => {
          const angle = (i / PETALS.length) * Math.PI * 2 - Math.PI / 2
          const r = 38 + (i % 3) * 8
          return (
            <motion.span
              key={p}
              className="p3-yes__petal"
              style={{
                left: `${50 + Math.cos(angle) * r}%`,
                top: `${50 + Math.sin(angle) * r}%`,
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 160, damping: 16 }}
            >
              {p}
            </motion.span>
          )
        })}
        <motion.button
          type="button"
          className="p3-yes__core"
          whileTap={{ scale: 0.94 }}
          onClick={(e) => {
            if (count < PETALS.length) {
              setCount((c) => c + 1)
              celebrateTap('sparkle')
              burstAtEvent(e, 4)
            }
          }}
        >
          <MmIcon name="heart" size={28} filled />
        </motion.button>
      </div>
      {count >= PETALS.length && (
        <motion.p className="p3-yes__done" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Every petal is a reason I stay.
        </motion.p>
      )}
    </SectionShell>
  )
}

export function GravitySection() {
  const [pulled, setPulled] = useState({})

  return (
    <SectionShell
      kicker="Pull"
      title="Gravity of you"
      subtitle="Tap a word. Watch it fall toward your name."
      className="p3-gravity"
    >
      <div className="p3-gravity__field">
        <div className="p3-gravity__center">you</div>
        {GRAVITY_WORDS.map((g) => (
          <motion.button
            key={g.id}
            type="button"
            className={`p3-gravity__word ${pulled[g.id] ? 'is-pulled' : ''}`}
            style={{ '--i': g.id.slice(1) }}
            onClick={() => {
              setPulled((p) => ({ ...p, [g.id]: true }))
              celebrateTap('sparkle')
            }}
          >
            <span>{g.word}</span>
            {pulled[g.id] && <em>{g.pull}</em>}
          </motion.button>
        ))}
      </div>
    </SectionShell>
  )
}

export function ProofSection() {
  const [page, setPage] = useState(0)
  const card = PROOFS[page]

  return (
    <SectionShell
      kicker="No camera needed"
      title="Proof without photos"
      subtitle="Flip through the evidence of how I love you."
      className="p3-proof"
    >
      <AnimatePresence mode="wait">
        <motion.button
          key={card.title}
          type="button"
          className="p3-proof__card"
          initial={{ opacity: 0, rotateY: -18 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 18 }}
          transition={{ duration: 0.45, ease: EASE }}
          onClick={() => {
            setPage((p) => (p + 1) % PROOFS.length)
            celebrateTap('chime')
          }}
        >
          <span className="p3-proof__tag">{card.title}</span>
          <p>{card.text}</p>
          <span className="p3-hint">Tap to flip</span>
        </motion.button>
      </AnimatePresence>
    </SectionShell>
  )
}

export function BreathSection() {
  const [fill, setFill] = useState(0)
  const holding = useRef(false)
  const fillRef = useRef(0)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    let raf
    const loop = () => {
      if (holding.current) {
        fillRef.current = Math.min(1, fillRef.current + 0.012)
        setFill(fillRef.current)
        if (fillRef.current >= 0.98) setSynced(true)
      } else if (!synced) {
        fillRef.current = Math.max(0, fillRef.current - 0.02)
        setFill(fillRef.current)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [synced])

  return (
    <SectionShell
      kicker="Together"
      title="The pause between"
      subtitle="Hold your finger here. Breathe with me."
      className="p3-breath"
    >
      <motion.button
        type="button"
        className="p3-breath__orb"
        animate={{ scale: synced ? 1.08 : 1 }}
        onPointerDown={() => {
          holding.current = true
          softVibrate(6)
        }}
        onPointerUp={() => {
          holding.current = false
        }}
        onPointerLeave={() => {
          holding.current = false
        }}
        onPointerCancel={() => {
          holding.current = false
        }}
        aria-label="Hold to sync breath"
      >
        <span className="p3-breath__ring" style={{ transform: `scale(${0.55 + fill * 0.55})` }} />
        <span className="p3-breath__label">{synced ? 'In sync with you' : 'Hold'}</span>
      </motion.button>
    </SectionShell>
  )
}
