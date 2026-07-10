import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import usePrefersReducedMotion from './usePrefersReducedMotion'

/** Soft ambient pad via Web Audio — no external file required. */
function createRomanticPad(ctx) {
  const master = ctx.createGain()
  master.gain.value = 0.0001
  master.connect(ctx.destination)

  const notes = [196, 246.94, 293.66, 329.63] // G3 A3 D4 E4 — gentle open voicing
  const oscillators = notes.map((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()
    osc.type = i % 2 === 0 ? 'sine' : 'triangle'
    osc.frequency.value = freq
    filter.type = 'lowpass'
    filter.frequency.value = 680
    gain.gain.value = 0.045 - i * 0.006
    osc.connect(filter)
    filter.connect(gain)
    gain.connect(master)
    osc.start()
    return { osc, gain }
  })

  const lfo = ctx.createOscillator()
  const lfoGain = ctx.createGain()
  lfo.frequency.value = 0.08
  lfoGain.gain.value = 0.012
  lfo.connect(lfoGain)
  lfoGain.connect(master.gain)
  lfo.start()

  return {
    master,
    stop() {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(master.gain.value, now)
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.6)
      window.setTimeout(() => {
        oscillators.forEach(({ osc }) => {
          try {
            osc.stop()
          } catch {
            /* already stopped */
          }
        })
        try {
          lfo.stop()
        } catch {
          /* already stopped */
        }
      }, 700)
    },
    fadeIn() {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(0.0001, now)
      master.gain.exponentialRampToValueAtTime(0.22, now + 1.4)
    },
    fadeOut() {
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(Math.max(master.gain.value, 0.0001), now)
      master.gain.exponentialRampToValueAtTime(0.0001, now + 0.8)
    },
  }
}

export default function MusicPlayer() {
  const reduced = usePrefersReducedMotion()
  const [on, setOn] = useState(false)
  const ctxRef = useRef(null)
  const padRef = useRef(null)

  useEffect(() => {
    return () => {
      padRef.current?.stop()
      ctxRef.current?.close?.()
    }
  }, [])

  const toggle = async () => {
    if (reduced) return

    if (!on) {
      const Ctx = window.AudioContext || window.webkitAudioContext
      if (!Ctx) return
      if (!ctxRef.current) ctxRef.current = new Ctx()
      if (ctxRef.current.state === 'suspended') await ctxRef.current.resume()
      padRef.current?.stop()
      padRef.current = createRomanticPad(ctxRef.current)
      padRef.current.fadeIn()
      setOn(true)
    } else {
      padRef.current?.fadeOut()
      window.setTimeout(() => padRef.current?.stop(), 850)
      setOn(false)
    }
  }

  if (reduced) return null

  return (
    <motion.button
      type="button"
      className={`mm-music ${on ? 'mm-music--on' : ''}`}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Mute music' : 'Play soft music'}
      whileTap={{ scale: 0.94 }}
    >
      <span className="mm-music__bars" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            animate={on ? { scaleY: [0.35, 1, 0.45, 0.85, 0.35] } : { scaleY: 0.35 }}
            transition={
              on
                ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut', delay: i * 0.1 }
                : { duration: 0.3 }
            }
          />
        ))}
      </span>
      <span className="mm-music__label">{on ? 'Playing' : 'Music'}</span>
    </motion.button>
  )
}
