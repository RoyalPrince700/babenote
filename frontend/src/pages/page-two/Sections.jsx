import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import {
  CLOSING_LINES,
  FILM_FRAMES,
  FOREVER_GRID,
  HER_PHOTOS,
  HIM_PHOTOS,
  MATCHING_DAY,
  POLAROIDS,
  WHISPERS,
} from './data'
import { burstAtEvent, celebrateTap, softVibrate } from './fx'
import MmIcon from '../miss-me/icons'
import { EASE, viewportOnce } from '../miss-me/motion'
import usePrefersReducedMotion from '../miss-me/usePrefersReducedMotion'

export function HeroSection() {
  const reduced = usePrefersReducedMotion()
  const mx = useSpring(0, { stiffness: 50, damping: 18 })
  const my = useSpring(0, { stiffness: 50, damping: 18 })

  return (
    <section
      className="p2-section p2-hero p2-section--flush"
      onPointerMove={(e) => {
        if (reduced) return
        const r = e.currentTarget.getBoundingClientRect()
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 18)
        my.set(((e.clientY - r.top) / r.height - 0.5) * 12)
      }}
    >
      <motion.div className="p2-hero__photo" style={{ x: mx, y: my }}>
        <motion.img
          src={MATCHING_DAY.photo}
          alt=""
          animate={reduced ? undefined : { scale: [1.08, 1.14, 1.08] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
        />
        <div className="p2-hero__veil" />
      </motion.div>
      <motion.div
        className="p2-hero__scroll"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={22} />
      </motion.div>
      <div className="p2-hero__content">
        <p className="p2-kicker">Chapter two</p>
        <motion.h1
          className="p2-hero__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          I wasn&apos;t done yet.
        </motion.h1>
        <motion.p
          className="p2-hero__sub"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
        >
          Touch every memory. They were waiting for you, Mama.
        </motion.p>
      </div>
    </section>
  )
}

function LivingPolaroid({ card, index, active, onActivate }) {
  const [flipped, setFlipped] = useState(false)
  const reduced = usePrefersReducedMotion()
  const lastTap = useRef(0)

  const flip = (e) => {
    const now = Date.now()
    if (now - lastTap.current < 320) {
      setFlipped((f) => !f)
      celebrateTap('chime')
      burstAtEvent(e, 6)
    } else {
      onActivate(index)
      celebrateTap('sparkle')
    }
    lastTap.current = now
  }

  return (
    <motion.button
      type="button"
      className={`p2-polaroid__card ${flipped ? 'is-flipped' : ''} ${active ? 'is-active' : ''}`}
      style={{ '--tilt': `${card.tilt}deg` }}
      animate={
        reduced
          ? { rotate: card.tilt }
          : {
              rotate: [card.tilt, card.tilt + 1.5, card.tilt],
              y: active ? [0, -6, 0] : [0, -3, 0],
            }
      }
      transition={{ duration: 4 + index, repeat: Infinity, ease: 'easeInOut' }}
      onClick={flip}
      aria-label={flipped ? 'Show photo' : 'Double-tap to flip'}
    >
      <span className="p2-polaroid__tape" aria-hidden="true" />
      <span className="p2-polaroid__face p2-polaroid__face--front">
        <motion.img
          src={card.photo}
          alt=""
          loading="lazy"
          animate={reduced ? undefined : { scale: [1, 1.04, 1], x: [0, 2, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
        />
        <em>{card.front}</em>
      </span>
      <span className="p2-polaroid__face p2-polaroid__face--back">
        <MmIcon name="heart" size={28} filled />
        <p>{card.back}</p>
      </span>
    </motion.button>
  )
}

export function PolaroidSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="p2-section p2-polaroid p2-polaroid--living">
      <p className="p2-kicker">Living polaroids</p>
      <h2 className="p2-title">They still breathe</h2>
      <p className="p2-polaroid__hint">Double-tap to flip. Shadows follow your attention.</p>
      <div className="p2-polaroid__row">
        {POLAROIDS.map((card, i) => (
          <LivingPolaroid
            key={card.id}
            card={card}
            index={i}
            active={active === i}
            onActivate={setActive}
          />
        ))}
      </div>
    </section>
  )
}

export function MatchingDaySection() {
  const [holding, setHolding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [alive, setAlive] = useState(false)
  const [note, setNote] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (!holding || alive) return undefined
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / 1400)
      setProgress(p)
      if (p >= 1) {
        setAlive(true)
        celebrateTap('chime')
        softVibrate([15, 25, 15, 25])
        return
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [holding, alive])

  useEffect(() => {
    if (!alive || reduced) return undefined
    const t = window.setInterval(() => {
      setNote((n) => (n + 1) % MATCHING_DAY.notes.length)
    }, 2400)
    return () => window.clearInterval(t)
  }, [alive, reduced])

  const endHold = () => {
    setHolding(false)
    if (!alive) setProgress(0)
  }

  return (
    <section className="p2-section p2-match p2-section--flush">
      <div className="p2-match__layout">
        <div className="p2-match__copy">
          <p className="p2-kicker">Hold to remember</p>
          <h2 className="p2-title p2-title--left">{MATCHING_DAY.title}</h2>
          <p className="p2-match__hint">{MATCHING_DAY.hint}</p>
        </div>
        <motion.div
          className={`p2-match__frame ${alive ? 'is-alive' : ''}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture?.(e.pointerId)
            setHolding(true)
          }}
          onPointerUp={endHold}
          onPointerCancel={endHold}
          whileTap={{ scale: 0.99 }}
        >
          <motion.img
            src={MATCHING_DAY.photo}
            alt="Us matching"
            loading="lazy"
            animate={
              alive
                ? { scale: 1.08, filter: 'grayscale(0) saturate(1.05)' }
                : { scale: 1, filter: `grayscale(${1 - progress}) saturate(${0.4 + progress * 0.6})` }
            }
            transition={{ duration: alive ? 1.2 : 0.05, ease: EASE }}
            draggable={false}
          />
          <div className="p2-match__ring" style={{ ['--p']: progress }} aria-hidden="true" />
          {alive && (
            <>
              <div className="p2-match__particles" aria-hidden="true">
                {Array.from({ length: 12 }, (_, i) => (
                  <span key={i} style={{ '--i': i }} />
                ))}
              </div>
              <motion.div
                className="p2-match__heartbeat"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <MmIcon name="heart" size={22} filled />
              </motion.div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={MATCHING_DAY.notes[note].text}
                  className="p2-match__float-note"
                  style={{
                    left: `${MATCHING_DAY.notes[note].x}%`,
                    top: `${MATCHING_DAY.notes[note].y}%`,
                  }}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {MATCHING_DAY.notes[note].text}
                </motion.p>
              </AnimatePresence>
              <motion.p
                className="p2-match__secret"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {MATCHING_DAY.secret}
              </motion.p>
            </>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export function HimAndHerSection() {
  const [him, setHim] = useState(0)
  const [her, setHer] = useState(0)
  const [joined, setJoined] = useState(false)
  const x = useMotionValue(0)
  const gap = useTransform(x, [-80, 80], [28, 4])

  return (
    <section className="p2-section p2-pair">
      <p className="p2-kicker">Drag us together</p>
      <h2 className="p2-title">Him &amp; Her</h2>
      <p className="p2-pair__hint">Tap to change photos. Drag the heart to pull us closer.</p>
      <motion.div className="p2-pair__grid" style={{ gap }}>
        <button
          type="button"
          className="p2-pair__side"
          onClick={(e) => {
            setHim((i) => (i + 1) % HIM_PHOTOS.length)
            celebrateTap('sparkle')
            burstAtEvent(e, 4)
          }}
        >
          <motion.img
            key={HIM_PHOTOS[him]}
            src={HIM_PHOTOS[him]}
            alt="Me"
            loading="lazy"
            initial={{ opacity: 0.4, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            draggable={false}
          />
          <span>Me</span>
        </button>
        <button
          type="button"
          className="p2-pair__side"
          onClick={(e) => {
            setHer((i) => (i + 1) % HER_PHOTOS.length)
            celebrateTap('sparkle')
            burstAtEvent(e, 4)
          }}
        >
          <motion.img
            key={HER_PHOTOS[her]}
            src={HER_PHOTOS[her]}
            alt="You"
            loading="lazy"
            initial={{ opacity: 0.4, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            draggable={false}
          />
          <span>You</span>
        </button>
      </motion.div>
      <motion.button
        type="button"
        className="p2-pair__magnet"
        style={{ x }}
        drag="x"
        dragConstraints={{ left: -80, right: 80 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (Math.abs(info.offset.x) > 36) {
            setJoined(true)
            celebrateTap('chime')
            softVibrate([12, 30, 12])
          }
        }}
        whileTap={{ scale: 0.94 }}
      >
        <MmIcon name="heart" size={20} filled />
      </motion.button>
      <AnimatePresence>
        {joined && (
          <motion.p
            className="p2-pair__sync"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Different places. Same heartbeat.
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

export function FilmReelSection() {
  const [active, setActive] = useState(0)
  const trackRef = useRef(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return undefined
    const onScroll = () => {
      const cards = [...el.querySelectorAll('.p2-film__frame')]
      const mid = el.scrollLeft + el.clientWidth / 2
      let best = 0
      let bestDist = Infinity
      cards.forEach((card, i) => {
        const center = card.offsetLeft + card.offsetWidth / 2
        const dist = Math.abs(center - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      })
      setActive(best)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="p2-section p2-film p2-section--flush">
      <div className="p2-film__head">
        <p className="p2-kicker">Memory film</p>
        <h2 className="p2-title">Drag through time</h2>
      </div>
      <div className="p2-film__sprockets" aria-hidden="true" />
      <div className="p2-film__track" ref={trackRef}>
        {FILM_FRAMES.map((frame, i) => (
          <motion.button
            key={frame.id}
            type="button"
            className={`p2-film__frame ${active === i ? 'is-active' : ''}`}
            onClick={(e) => {
              setActive(i)
              e.currentTarget.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
              celebrateTap('shutter')
              burstAtEvent(e, 5)
            }}
          >
            <img src={frame.photo} alt="" loading="lazy" draggable={false} />
            <span className="p2-film__hole p2-film__hole--l" />
            <span className="p2-film__hole p2-film__hole--r" />
          </motion.button>
        ))}
      </div>
      <div className="p2-film__sprockets" aria-hidden="true" />
      <AnimatePresence mode="wait">
        <motion.p
          key={FILM_FRAMES[active].id}
          className="p2-film__caption"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {FILM_FRAMES[active].caption}
        </motion.p>
      </AnimatePresence>
    </section>
  )
}

export function WhisperWallSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="p2-section p2-whisper">
      <p className="p2-kicker">Whisper wall</p>
      <h2 className="p2-title">Lean in</h2>
      <div className="p2-whisper__wall">
        {WHISPERS.map((w, i) => (
          <motion.button
            key={w.id}
            type="button"
            className={`p2-whisper__tile ${open?.id === w.id ? 'is-open' : ''}`}
            style={{ gridRow: i % 3 === 0 ? 'span 2' : 'span 1' }}
            whileHover={{ y: -4 }}
            onClick={(e) => {
              setOpen(open?.id === w.id ? null : w)
              celebrateTap('chime')
              burstAtEvent(e, 5)
            }}
          >
            <img src={w.photo} alt="" loading="lazy" draggable={false} />
            <AnimatePresence>
              {open?.id === w.id && (
                <motion.span
                  className="p2-whisper__text"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {w.text}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

export function ForeverGridSection() {
  const [open, setOpen] = useState(null)

  return (
    <section className="p2-section p2-grid">
      <p className="p2-kicker">Scrapbook</p>
      <h2 className="p2-title">Pieces of us</h2>
      <div className="p2-grid__mosaic">
        {FOREVER_GRID.map((item, i) => (
          <motion.button
            key={`${item.photo}-${i}`}
            type="button"
            className={`p2-grid__cell p2-grid__cell--${item.span}`}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={viewportOnce}
            transition={{ delay: i * 0.05, duration: 0.55, ease: EASE }}
            whileHover={{ scale: 1.02 }}
            onClick={(e) => {
              setOpen(item)
              celebrateTap('shutter')
              burstAtEvent(e)
            }}
          >
            <img src={item.photo} alt="" loading="lazy" draggable={false} />
            <span className="p2-grid__tape" aria-hidden="true" />
          </motion.button>
        ))}
      </div>
      <p className="p2-grid__caption">Different days. Same us.</p>

      <AnimatePresence>
        {open && (
          <motion.div
            className="p2-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.figure
              className="p2-lightbox__figure"
              initial={{ scale: 0.88, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 170, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src={open.photo} alt="" />
              <figcaption>{open.caption}</figcaption>
              <button type="button" className="p2-btn" onClick={() => setOpen(null)}>
                Close
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export function ClosingSection() {
  const navigate = useNavigate()
  const reduced = usePrefersReducedMotion()
  const [index, setIndex] = useState(0)
  const [showCta, setShowCta] = useState(false)

  useEffect(() => {
    if (reduced) {
      setShowCta(true)
      return undefined
    }
    if (index < CLOSING_LINES.length) {
      const t = window.setTimeout(() => setIndex((i) => i + 1), 2000)
      return () => window.clearTimeout(t)
    }
    const cta = window.setTimeout(() => setShowCta(true), 700)
    return () => window.clearTimeout(cta)
  }, [index, reduced])

  const line = CLOSING_LINES[index]

  return (
    <section className="p2-section p2-close">
      <div className="p2-close__stage">
        <AnimatePresence mode="wait">
          {line && !showCta && (
            <motion.p
              key={line}
              className="p2-close__line"
              initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              {line}
            </motion.p>
          )}
        </AnimatePresence>

        {showCta && (
          <motion.div
            className="p2-close__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <motion.div
              className="p2-close__heart"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <MmIcon name="heart" size={48} filled />
            </motion.div>
            <p className="p2-close__ask">One last chapter — the softest one.</p>
            <motion.button
              type="button"
              className="p2-btn p2-btn--link"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                window.scrollTo(0, 0)
                document.documentElement.scrollTop = 0
                document.body.scrollTop = 0
                navigate('/choosing-you')
              }}
            >
              Continue to chapter three
            </motion.button>
            <Link to="/" className="p2-btn p2-btn--ghost p2-btn--link">
              Back to the beginning
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
