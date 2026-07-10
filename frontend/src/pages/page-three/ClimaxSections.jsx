import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CONSTELLATION,
  ECHOES,
  ENDING_LINES,
  FINAL_LETTER,
  FUTURES,
  HOLD_REVEAL,
  LETTERS,
  PEAK_LINES,
  VERSIONS,
} from './data'
import { FloatingDust, SectionShell } from './shared'
import { burstAtEvent, celebrateTap, softVibrate } from '../page-two/fx'
import MmIcon from '../miss-me/icons'
import { EASE, viewportOnce } from '../miss-me/motion'
import usePrefersReducedMotion from '../miss-me/usePrefersReducedMotion'
import { setBgMusicLevel } from '../miss-me/bgMusic'

export function ConstellationSection() {
  const [lit, setLit] = useState({})

  return (
    <SectionShell
      kicker="Night sky"
      title="A constellation of us"
      subtitle="Tap each star. Read what it holds."
      className="p3-stars"
    >
      <div className="p3-stars__sky">
        {CONSTELLATION.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`p3-stars__star ${lit[s.id] ? 'is-on' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            aria-label={s.text}
            onClick={(e) => {
              setLit((l) => ({ ...l, [s.id]: true }))
              celebrateTap('sparkle')
              burstAtEvent(e, 4)
            }}
          >
            <span className="p3-stars__dot" />
            <AnimatePresence>
              {lit[s.id] && (
                <motion.span
                  className="p3-stars__tip"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {s.text}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
        <svg className="p3-stars__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {CONSTELLATION.map((s, i) => {
            const next = CONSTELLATION[(i + 1) % CONSTELLATION.length]
            if (!lit[s.id] || !lit[next.id]) return null
            return (
              <line
                key={`${s.id}-${next.id}`}
                x1={s.x}
                y1={s.y}
                x2={next.x}
                y2={next.y}
                stroke="rgba(232,160,180,0.35)"
                strokeWidth="0.3"
              />
            )
          })}
        </svg>
      </div>
    </SectionShell>
  )
}

export function VersionsSection() {
  const [index, setIndex] = useState(0)
  const reduced = usePrefersReducedMotion()
  const item = VERSIONS[index]

  useEffect(() => {
    if (reduced) return undefined
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % VERSIONS.length)
    }, 3200)
    return () => window.clearInterval(t)
  }, [reduced])

  return (
    <SectionShell
      kicker="Every you"
      title="A thousand versions of you"
      subtitle="Every version carries a compliment."
      className="p3-versions"
    >
      <div className="p3-versions__frame">
        <AnimatePresence mode="wait">
          <motion.img
            key={item.photo}
            src={item.photo}
            alt=""
            loading="lazy"
            draggable={false}
            className="p3-versions__img"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </AnimatePresence>
        <div className="p3-versions__veil" />
        <AnimatePresence mode="wait">
          <motion.p
            key={item.line}
            className="p3-versions__line"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {item.line}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="p3-versions__dots">
        {VERSIONS.map((v, i) => (
          <button
            key={v.line}
            type="button"
            className={`p3-little__dot ${i === index ? 'is-on' : ''}`}
            aria-label={v.line}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </SectionShell>
  )
}

export function EchoSection() {
  const [active, setActive] = useState(null)
  const [phase, setPhase] = useState('idle')

  const send = (i) => {
    setActive(i)
    setPhase('out')
    celebrateTap('chime')
    window.setTimeout(() => setPhase('back'), 900)
    window.setTimeout(() => setPhase('done'), 1800)
  }

  const echo = active != null ? ECHOES[active] : null

  return (
    <SectionShell
      kicker="Return"
      title="Echo chamber"
      subtitle="Send a word. Hear what love sends back."
      className="p3-echo"
    >
      <div className="p3-echo__words">
        {ECHOES.map((item, i) => (
          <motion.button
            key={item.send}
            type="button"
            className="p3-echo__chip"
            whileTap={{ scale: 0.96 }}
            onClick={() => send(i)}
          >
            {item.send}
          </motion.button>
        ))}
      </div>
      <div className="p3-echo__stage" aria-live="polite">
        <AnimatePresence mode="wait">
          {echo && phase === 'out' && (
            <motion.p
              key="out"
              className="p3-echo__send"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.05 }}
              exit={{ opacity: 0, scale: 1.2 }}
            >
              {echo.send}
            </motion.p>
          )}
          {echo && (phase === 'back' || phase === 'done') && (
            <motion.p
              key="back"
              className="p3-echo__return"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {echo.return}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </SectionShell>
  )
}

export function LettersSection() {
  const [open, setOpen] = useState(null)
  const letter = LETTERS.find((l) => l.id === open)

  return (
    <SectionShell
      kicker="Unsent"
      title="Letters I never sent"
      subtitle="Tap an envelope. Read what waited."
      className="p3-letters"
    >
      <div className="p3-letters__row">
        {LETTERS.map((l, i) => (
          <motion.button
            key={l.id}
            type="button"
            className="p3-letters__env"
            style={{ '--tilt': `${-6 + i * 4}deg` }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: i * 0.08, duration: 0.55, ease: EASE }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setOpen(l.id)
              celebrateTap('chime')
            }}
          >
            <span className="p3-letters__flap" />
            <span className="p3-letters__seal">{l.seal}</span>
            <span className="p3-letters__title">{l.title}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {letter && (
          <motion.div
            className="p3-letters__modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.article
              className="p3-letters__paper"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>{letter.title}</h3>
              <p>{letter.body}</p>
              <button type="button" className="p3-btn" onClick={() => setOpen(null)}>
                Close gently
              </button>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </SectionShell>
  )
}

export function FutureSection() {
  const [active, setActive] = useState(0)

  return (
    <SectionShell
      kicker="Ahead"
      title="Future memories"
      subtitle="Not looking back — dreaming forward."
      className="p3-future"
    >
      <div className="p3-future__rail">
        {FUTURES.map((f, i) => (
          <motion.button
            key={f.id}
            type="button"
            className={`p3-future__card ${i === active ? 'is-on' : ''}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ delay: i * 0.05, duration: 0.5, ease: EASE }}
            onClick={() => {
              setActive(i)
              celebrateTap('sparkle')
            }}
          >
            <span className="p3-future__title">{f.title}</span>
            <AnimatePresence>
              {i === active && (
                <motion.span
                  className="p3-future__note"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {f.note}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </SectionShell>
  )
}

export function PeakMoment() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.55 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return undefined
    setBgMusicLevel(0.22)
    return () => setBgMusicLevel(0.42)
  }, [inView])

  useEffect(() => {
    if (!inView || reduced) return undefined
    if (index >= PEAK_LINES.length - 1) return undefined
    const hold = index === PEAK_LINES.length - 2 ? 2800 : 2200
    const t = window.setTimeout(() => setIndex((i) => i + 1), hold)
    return () => window.clearTimeout(t)
  }, [index, inView, reduced])

  const line = reduced ? PEAK_LINES[PEAK_LINES.length - 1] : PEAK_LINES[index]

  return (
    <section className="p3-peak" ref={ref}>
      <div className="p3-peak__stage">
        <AnimatePresence mode="wait">
          {inView && (
            <motion.p
              key={line}
              className="p3-peak__line"
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(10px)' }}
              transition={{ duration: 1, ease: EASE }}
            >
              {line}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export function FinalLetterSection() {
  const reduced = usePrefersReducedMotion()
  const [chars, setChars] = useState(reduced ? FINAL_LETTER.join('\n').length : 0)
  const [started, setStarted] = useState(false)
  const full = FINAL_LETTER.join('\n')
  const shown = full.slice(0, chars)

  useEffect(() => {
    if (!started || reduced) return undefined
    if (chars >= full.length) return undefined
    const t = window.setTimeout(() => setChars((c) => c + 1), 28)
    return () => window.clearTimeout(t)
  }, [chars, started, reduced, full.length])

  return (
    <SectionShell kicker="For you" title="A letter" className="p3-final-letter">
      {!started && !reduced ? (
        <motion.button
          type="button"
          className="p3-btn"
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setStarted(true)
            celebrateTap('chime')
          }}
        >
          Open the letter
        </motion.button>
      ) : (
        <article className="p3-final-letter__paper">
          <pre className="p3-final-letter__text">
            {shown}
            {chars < full.length && <span className="p3-final-letter__caret" />}
          </pre>
        </article>
      )}
    </SectionShell>
  )
}

export function HoldChooseSection() {
  const [phase, setPhase] = useState('ask')
  const [hold, setHold] = useState(0)
  const holding = useRef(false)
  const holdRef = useRef(0)
  const reduced = usePrefersReducedMotion()
  const [line, setLine] = useState(0)

  useEffect(() => {
    if (phase !== 'ask') return undefined
    const t = window.setTimeout(() => setPhase('ready'), 1800)
    return () => window.clearTimeout(t)
  }, [phase])

  useEffect(() => {
    if (phase !== 'reveal') return undefined
    if (reduced) {
      setLine(HOLD_REVEAL.length - 1)
      return undefined
    }
    if (line >= HOLD_REVEAL.length - 1) return undefined
    const t = window.setTimeout(() => setLine((l) => l + 1), 1600)
    return () => window.clearTimeout(t)
  }, [phase, line, reduced])

  useEffect(() => {
    let raf
    const loop = () => {
      if (holding.current && phase === 'holding') {
        holdRef.current = Math.min(1, holdRef.current + 0.008)
        setHold(holdRef.current)
        if (holdRef.current >= 1) {
          holding.current = false
          setPhase('reveal')
          celebrateTap('chime')
          softVibrate([20, 40, 20])
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [phase])

  return (
    <section className={`p3-hold ${phase === 'reveal' ? 'is-lit' : ''}`}>
      <FloatingDust count={22} />
      {phase === 'ask' && (
        <motion.div
          className="p3-hold__ask"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="p3-hold__heart"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MmIcon name="heart" size={56} filled />
          </motion.div>
          <p>I have one last question…</p>
        </motion.div>
      )}

      {(phase === 'ready' || phase === 'holding') && (
        <motion.button
          type="button"
          className="p3-hold__btn"
          style={{ '--p': hold }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onPointerDown={() => {
            holding.current = true
            setPhase('holding')
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
        >
          <motion.span
            className="p3-hold__grow"
            style={{ scale: 1 + hold * 1.4 }}
          >
            <MmIcon name="heart" size={42} filled />
          </motion.span>
          <span className="p3-hold__label">Press and Hold</span>
        </motion.button>
      )}

      {phase === 'reveal' && (
        <div className="p3-hold__reveal">
          <AnimatePresence mode="wait">
            <motion.p
              key={HOLD_REVEAL[line]}
              className="p3-hold__line"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {HOLD_REVEAL[line]}
            </motion.p>
          </AnimatePresence>
        </div>
      )}
    </section>
  )
}

export function EndingSection() {
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [showThanks, setShowThanks] = useState(false)
  const [inView, setInView] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return undefined
    if (reduced) {
      setShowThanks(true)
      return undefined
    }
    if (index < ENDING_LINES.length) {
      const t = window.setTimeout(() => setIndex((i) => i + 1), 2600)
      return () => window.clearTimeout(t)
    }
    const thanks = window.setTimeout(() => setShowThanks(true), 1200)
    return () => window.clearTimeout(thanks)
  }, [index, inView, reduced])

  const line = ENDING_LINES[Math.min(index, ENDING_LINES.length - 1)]
  const showingLines = inView && !showThanks

  return (
    <section className="p3-ending" ref={ref}>
      <FloatingDust count={28} />
      <div className="p3-ending__stars" aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <span
            key={i}
            style={{
              left: `${(i * 19) % 100}%`,
              top: `${(i * 27) % 100}%`,
              animationDelay: `${(i % 7) * 0.4}s`,
            }}
          />
        ))}
      </div>
      <div className="p3-ending__stage">
        <AnimatePresence mode="wait">
          {showingLines && (
            <motion.p
              key={line}
              className="p3-ending__line"
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 1, ease: EASE }}
            >
              {line}
            </motion.p>
          )}
        </AnimatePresence>

        {showThanks && (
          <motion.div
            className="p3-ending__thanks"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: EASE }}
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MmIcon name="heart" size={40} filled />
            </motion.div>
            <p>Thank you for existing.</p>
          </motion.div>
        )}
      </div>
    </section>
  )
}
