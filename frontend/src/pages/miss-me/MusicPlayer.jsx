import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import songUrl from '../../assets/dotti-forever.mp3'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function MusicPlayer() {
  const reduced = usePrefersReducedMotion()
  const [on, setOn] = useState(false)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)

  useEffect(() => {
    const audio = new Audio(songUrl)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audioRef.current = audio

    return () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current)
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    const onDream = (e) => {
      const audio = audioRef.current
      if (!audio || !on) return
      const richer = Boolean(e.detail?.active)
      fadeVolume(audio, richer ? 0.55 : 0.42, 600)
    }
    window.addEventListener('mm-dream-music', onDream)
    return () => window.removeEventListener('mm-dream-music', onDream)
  }, [on])

  const fadeVolume = (audio, target, ms = 700) => {
    if (fadeRef.current) window.clearInterval(fadeRef.current)
    const start = audio.volume
    const steps = Math.max(8, Math.floor(ms / 40))
    let i = 0
    fadeRef.current = window.setInterval(() => {
      i += 1
      const t = i / steps
      audio.volume = Math.min(1, Math.max(0, start + (target - start) * t))
      if (i >= steps) {
        window.clearInterval(fadeRef.current)
        fadeRef.current = null
        if (target <= 0.001) {
          audio.pause()
          audio.currentTime = 0
        }
      }
    }, 40)
  }

  const toggle = async () => {
    if (reduced) return
    const audio = audioRef.current
    if (!audio) return

    if (!on) {
      try {
        audio.volume = 0
        await audio.play()
        fadeVolume(audio, 0.42, 900)
        setOn(true)
      } catch {
        /* autoplay blocked — user can tap again */
      }
    } else {
      fadeVolume(audio, 0, 600)
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
      aria-label={on ? 'Mute music' : 'Play Forever Sweet'}
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
