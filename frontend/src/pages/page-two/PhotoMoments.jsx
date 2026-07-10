import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  BEFORE_AFTER,
  COVERFLOW,
  FAVORITE_FACE,
  FLOATING_WALL,
  LENS_PHOTO,
  LENS_SPOTS,
  PHOTO_STACK,
  POCKET_MEMORIES,
  SCRATCH_MESSAGE,
  SCRATCH_PHOTO,
} from './data'
import { burstAtEvent, celebrateTap, softVibrate } from './fx'
import { EASE, viewportOnce } from '../miss-me/motion'
import usePrefersReducedMotion from '../miss-me/usePrefersReducedMotion'

export function EmotionalPause({ lines }) {
  return (
    <section className="p2-pause">
      <div className="p2-pause__inner">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            className="p2-pause__line"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, delay: i * 0.35, ease: EASE }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

export function ScratchMemorySection() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)
  const drawing = useRef(false)
  const clearedRef = useRef(0)
  const [cleared, setCleared] = useState(0)
  const [done, setDone] = useState(false)
  const reduced = usePrefersReducedMotion()

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    const rect = wrap.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    const ctx = canvas.getContext('2d')
    const grad = ctx.createLinearGradient(0, 0, rect.width * dpr, rect.height * dpr)
    grad.addColorStop(0, '#5a3048')
    grad.addColorStop(0.5, '#8a5570')
    grad.addColorStop(1, '#3a1828')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(255,240,245,0.18)'
    for (let i = 0; i < 40; i += 1) {
      ctx.beginPath()
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 8 + Math.random() * 40, 0, Math.PI * 2)
      ctx.fill()
    }
  }, [])

  useEffect(() => {
    setup()
    const onResize = () => {
      if (!done) setup()
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [setup, done])

  const scratchAt = (clientX, clientY) => {
    const canvas = canvasRef.current
    if (!canvas || done) return
    const rect = canvas.getBoundingClientRect()
    const dpr = canvas.width / rect.width
    const ctx = canvas.getContext('2d')
    const x = (clientX - rect.left) * dpr
    const y = (clientY - rect.top) * dpr
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 28 * dpr, 0, Math.PI * 2)
    ctx.fill()

    // Sample sparsely — full read every move is too heavy on mobile
    if (Math.random() > 0.18 && clearedRef.current < 0.35) return
    const sample = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let clear = 0
    const step = 48
    for (let i = 3; i < sample.length; i += 4 * step) {
      if (sample[i] < 40) clear += 1
    }
    const total = Math.max(1, sample.length / (4 * step))
    const pct = clear / total
    clearedRef.current = pct
    setCleared(pct)
    if (pct > 0.45) {
      setDone(true)
      celebrateTap('chime')
      softVibrate([20, 30, 20])
    }
  }

  const onPointerDown = (e) => {
    drawing.current = true
    e.currentTarget.setPointerCapture?.(e.pointerId)
    scratchAt(e.clientX, e.clientY)
  }
  const onPointerMove = (e) => {
    if (!drawing.current) return
    scratchAt(e.clientX, e.clientY)
  }
  const onPointerUp = () => {
    drawing.current = false
  }

  useEffect(() => {
    if (reduced) setDone(true)
  }, [reduced])

  return (
    <section className="p2-section p2-scratch p2-section--flush">
      <div className="p2-scratch__copy">
        <p className="p2-kicker">Scratch gently</p>
        <h2 className="p2-title p2-title--left">A foggy memory</h2>
        <p className="p2-scratch__hint">Brush the mist away with your finger.</p>
      </div>
      <div className="p2-scratch__stage" ref={wrapRef}>
        <img src={SCRATCH_PHOTO} alt="" className="p2-scratch__photo" draggable={false} />
        {!done && (
          <canvas
            ref={canvasRef}
            className="p2-scratch__fog"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />
        )}
        <div className="p2-scratch__progress" style={{ width: `${Math.min(100, cleared * 120)}%` }} />
        <AnimatePresence>
          {done && (
            <motion.p
              className="p2-scratch__msg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {SCRATCH_MESSAGE}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export function MemoryLensSection() {
  const stageRef = useRef(null)
  const [pos, setPos] = useState({ x: 50, y: 45 })
  const [found, setFound] = useState([])
  const reduced = usePrefersReducedMotion()

  const move = (clientX, clientY) => {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * 100
    const y = ((clientY - rect.top) / rect.height) * 100
    setPos({ x, y })

    LENS_SPOTS.forEach((spot) => {
      if (found.includes(spot.memory)) return
      const dx = spot.x - x
      const dy = spot.y - y
      if (Math.hypot(dx, dy) < 12) {
        setFound((f) => [...f, spot.memory])
        celebrateTap('chime')
      }
    })
  }

  return (
    <section className="p2-section p2-lens p2-section--split">
      <div className="p2-lens__copy">
        <p className="p2-kicker">Memory lens</p>
        <h2 className="p2-title p2-title--left">Look closer, Mama</h2>
        <p className="p2-lens__hint">Drag the glass. Hidden notes wake up where you look.</p>
        <ul className="p2-lens__found">
          <AnimatePresence>
            {found.map((m) => (
              <motion.li
                key={m}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                {m}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
      <div
        className="p2-lens__stage"
        ref={stageRef}
        onPointerMove={(e) => move(e.clientX, e.clientY)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture?.(e.pointerId)
          move(e.clientX, e.clientY)
        }}
      >
        <img
          src={LENS_PHOTO}
          alt=""
          className="p2-lens__blur"
          style={reduced ? undefined : { filter: 'blur(14px) saturate(0.85)' }}
          draggable={false}
        />
        <img
          src={LENS_PHOTO}
          alt=""
          className="p2-lens__clear"
          style={{
            clipPath: `circle(${reduced ? 100 : 16}% at ${pos.x}% ${pos.y}%)`,
          }}
          draggable={false}
        />
        <div className="p2-lens__glass" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} aria-hidden="true" />
        {LENS_SPOTS.map((s) => (
          <span
            key={s.memory}
            className={`p2-lens__dot ${found.includes(s.memory) ? 'is-on' : ''}`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          />
        ))}
      </div>
    </section>
  )
}

export function BeforeAfterSection() {
  const [pct, setPct] = useState(50)
  const [msg, setMsg] = useState(BEFORE_AFTER.messages[0].text)
  const dragging = useRef(false)
  const stageRef = useRef(null)

  const apply = (clientX) => {
    const el = stageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const next = Math.max(4, Math.min(96, ((clientX - rect.left) / rect.width) * 100))
    setPct(next)
    const hit = [...BEFORE_AFTER.messages].reverse().find((m) => next >= m.at)
    if (hit) setMsg(hit.text)
  }

  return (
    <section className="p2-section p2-ba">
      <p className="p2-kicker">Then &amp; now</p>
      <h2 className="p2-title">Still choosing you</h2>
      <div
        className="p2-ba__stage"
        ref={stageRef}
        onPointerDown={(e) => {
          dragging.current = true
          e.currentTarget.setPointerCapture?.(e.pointerId)
          apply(e.clientX)
          celebrateTap('sparkle')
        }}
        onPointerMove={(e) => dragging.current && apply(e.clientX)}
        onPointerUp={() => {
          dragging.current = false
        }}
      >
        <img src={BEFORE_AFTER.right} alt="" className="p2-ba__img p2-ba__img--right" draggable={false} />
        <div className="p2-ba__left" style={{ width: `${pct}%` }}>
          <img src={BEFORE_AFTER.left} alt="" className="p2-ba__img" draggable={false} />
        </div>
        <div className="p2-ba__handle" style={{ left: `${pct}%` }}>
          <span />
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={msg}
          className="p2-ba__msg"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
        >
          {msg}
        </motion.p>
      </AnimatePresence>
    </section>
  )
}

export function CoverflowSection() {
  const [active, setActive] = useState(2)
  const n = COVERFLOW.length

  const go = (dir) => {
    setActive((i) => (i + dir + n) % n)
    celebrateTap('shutter')
  }

  return (
    <section className="p2-section p2-cover">
      <p className="p2-kicker">Cover flow</p>
      <h2 className="p2-title">Turn the album</h2>
      <div className="p2-cover__stage">
        {COVERFLOW.map((item, i) => {
          const offset = i - active
          const abs = Math.abs(offset)
          return (
            <motion.button
              key={item.photo + i}
              type="button"
              className="p2-cover__card"
              style={{ zIndex: 20 - abs }}
              animate={{
                x: offset * 72,
                rotateY: offset * -28,
                scale: abs === 0 ? 1 : 0.78 - abs * 0.04,
                opacity: abs > 3 ? 0 : 1 - abs * 0.18,
                filter: abs === 0 ? 'blur(0px)' : `blur(${abs}px)`,
              }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              onClick={() => {
                setActive(i)
                celebrateTap('shutter')
              }}
            >
              <img src={item.photo} alt="" draggable={false} />
            </motion.button>
          )
        })}
      </div>
      <div className="p2-cover__nav">
        <button type="button" className="p2-btn p2-btn--ghost" onClick={() => go(-1)}>
          Prev
        </button>
        <AnimatePresence mode="wait">
          <motion.p
            key={COVERFLOW[active].caption}
            className="p2-cover__caption"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {COVERFLOW[active].caption}
          </motion.p>
        </AnimatePresence>
        <button type="button" className="p2-btn p2-btn--ghost" onClick={() => go(1)}>
          Next
        </button>
      </div>
    </section>
  )
}

export function PhotoStackSection() {
  const [stack, setStack] = useState(PHOTO_STACK)
  const [note, setNote] = useState('')
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-180, 180], [-14, 14])

  const toss = (info) => {
    if (Math.abs(info.offset.x) < 90) return
    const top = stack[0]
    setNote(top.note)
    celebrateTap('chime')
    burstAtEvent({ clientX: window.innerWidth / 2, clientY: window.innerHeight / 2 }, 6)
    setStack((s) => [...s.slice(1), s[0]])
    x.set(0)
  }

  if (!stack.length) return null
  const top = stack[0]

  return (
    <section className="p2-section p2-stack">
      <div className="p2-stack__copy">
        <p className="p2-kicker">Printed stack</p>
        <h2 className="p2-title p2-title--left">Swipe a memory</h2>
        <p className="p2-stack__hint">Drag the top photo aside — like flipping through prints.</p>
      </div>
      <div className="p2-stack__pile">
        {stack.slice(0, 4).map((item, i) =>
          i === 0 ? (
            <motion.div
              key={item.photo + 'top'}
              className="p2-stack__card is-top"
              style={{ x, rotate, zIndex: 10 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.9}
              onDragEnd={(_, info) => toss(info)}
              whileTap={{ cursor: 'grabbing' }}
            >
              <img src={item.photo} alt="" draggable={false} />
            </motion.div>
          ) : (
            <div
              key={item.photo + i}
              className="p2-stack__card"
              style={{
                zIndex: 10 - i,
                transform: `translateY(${i * 10}px) scale(${1 - i * 0.04}) rotate(${i % 2 ? 3 : -3}deg)`,
              }}
            >
              <img src={item.photo} alt="" draggable={false} />
            </div>
          ),
        )}
      </div>
      <AnimatePresence mode="wait">
        {note && (
          <motion.p
            key={note}
            className="p2-stack__note"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {note}
          </motion.p>
        )}
      </AnimatePresence>
    </section>
  )
}

export function FavoriteFaceSection() {
  const reduced = usePrefersReducedMotion()
  const mx = useSpring(0, { stiffness: 80, damping: 20 })
  const my = useSpring(0, { stiffness: 80, damping: 20 })
  const [orbit, setOrbit] = useState(FAVORITE_FACE.compliments.slice(0, 4))

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 24)
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 18)
  }

  useEffect(() => {
    if (reduced) return undefined
    const t = window.setInterval(() => {
      setOrbit((prev) => {
        const pool = FAVORITE_FACE.compliments
        const next = pool[Math.floor(Math.random() * pool.length)]
        return [...prev.slice(1), next]
      })
    }, 2200)
    return () => window.clearInterval(t)
  }, [reduced])

  return (
    <section className="p2-section p2-face p2-section--flush">
      <motion.div className="p2-face__stage" onPointerMove={onMove} style={{ x: mx, y: my }}>
        <motion.img
          src={FAVORITE_FACE.photo}
          alt="You"
          className="p2-face__photo"
          animate={reduced ? undefined : { scale: [1, 1.03, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
        />
        {orbit.map((text, i) => {
          const angle = (i / orbit.length) * Math.PI * 2
          return (
            <motion.span
              key={`${text}-${i}`}
              className="p2-face__orbit"
              style={{
                left: `${50 + Math.cos(angle) * 38}%`,
                top: `${50 + Math.sin(angle) * 34}%`,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              {text}
            </motion.span>
          )
        })}
      </motion.div>
      <p className="p2-face__caption">Move around her — compliments find you.</p>
    </section>
  )
}

export function FloatingWallSection() {
  const [open, setOpen] = useState(null)
  const reduced = usePrefersReducedMotion()
  const rx = useSpring(0, { stiffness: 60, damping: 18 })
  const ry = useSpring(0, { stiffness: 60, damping: 18 })

  return (
    <section
      className="p2-section p2-floatwall"
      onPointerMove={(e) => {
        if (reduced) return
        const rect = e.currentTarget.getBoundingClientRect()
        ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 14)
        rx.set(((e.clientY - rect.top) / rect.height - 0.5) * -10)
      }}
    >
      <p className="p2-kicker">Floating gallery</p>
      <h2 className="p2-title">Our little museum</h2>
      <motion.div className="p2-floatwall__space" style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}>
        {FLOATING_WALL.map((item) => (
          <motion.button
            key={item.caption}
            type="button"
            className="p2-floatwall__frame"
            style={{ left: `${item.x}%`, top: `${item.y}%`, zIndex: item.z }}
            animate={reduced ? { rotate: item.rot } : { rotate: [item.rot, item.rot + 2, item.rot], y: [0, -8, 0] }}
            transition={{ duration: 5 + item.z, repeat: Infinity, ease: 'easeInOut' }}
            onClick={(e) => {
              setOpen(item)
              celebrateTap('shutter')
              burstAtEvent(e)
            }}
            whileHover={{ scale: 1.06 }}
          >
            <img src={item.photo} alt="" draggable={false} />
          </motion.button>
        ))}
      </motion.div>

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
              initial={{ scale: 0.86, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 20 }}
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

export function PocketMemoriesSection() {
  const [drawn, setDrawn] = useState([])
  const remaining = POCKET_MEMORIES.filter((m) => !drawn.find((d) => d.photo === m.photo))
  const done = remaining.length === 0

  const pull = (e) => {
    if (!remaining.length) return
    const item = remaining[Math.floor(Math.random() * remaining.length)]
    setDrawn((d) => [...d, item])
    celebrateTap('chime')
    burstAtEvent(e, 5)
  }

  return (
    <section className="p2-section p2-pocketmem">
      <p className="p2-kicker">Coat pocket</p>
      <h2 className="p2-title">Pull a memory</h2>
      <motion.button
        type="button"
        className="p2-pocketmem__pocket"
        onClick={pull}
        disabled={done}
        whileTap={done ? undefined : { scale: 0.97, y: 4 }}
      >
        <span className="p2-pocketmem__rim" />
        <span className="p2-pocketmem__label">{done ? 'Empty… for now' : 'Reach in'}</span>
      </motion.button>
      <div className="p2-pocketmem__stack">
        <AnimatePresence>
          {drawn.map((item, i) => (
            <motion.article
              key={item.photo}
              className="p2-pocketmem__print"
              initial={{ opacity: 0, y: 80, rotate: -12, scale: 0.9 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: i % 2 === 0 ? -3 : 4,
                scale: 1,
              }}
              transition={{ type: 'spring', stiffness: 160, damping: 16 }}
              style={{ zIndex: i + 1 }}
            >
              <img src={item.photo} alt="" draggable={false} />
              <p>{item.story}</p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}
