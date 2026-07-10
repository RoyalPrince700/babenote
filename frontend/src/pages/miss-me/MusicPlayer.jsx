import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import songUrl from '../../assets/dotti-forever.mp3'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function MusicPlayer() {
  const reduced = usePrefersReducedMotion()
  const [on, setOn] = useState(false)
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef(null)
  const fadeRef = useRef(null)
  const unlockedRef = useRef(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fadeVolume = useCallback((audio, target, ms = 700) => {
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
        }
      }
    }, 40)
  }, [])

  const startFromBeginning = useCallback(async () => {
    if (reduced) return false
    const audio = audioRef.current
    if (!audio || unlockedRef.current) return unlockedRef.current

    try {
      audio.currentTime = 0
      audio.volume = 0
      await audio.play()
      unlockedRef.current = true
      fadeVolume(audio, 0.42, 900)
      setOn(true)
      return true
    } catch {
      return false
    }
  }, [fadeVolume, reduced])

  useEffect(() => {
    if (reduced) return undefined

    const audio = new Audio(songUrl)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audioRef.current = audio

    const cleanupGestures = () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('click', unlock)
    }

    const unlock = () => {
      if (unlockedRef.current) return
      startFromBeginning().then((ok) => {
        if (ok) cleanupGestures()
      })
    }

    const onForcedStart = () => {
      startFromBeginning().then((ok) => {
        if (ok) cleanupGestures()
      })
    }

    // Try autoplay (works on some desktops)
    const tryPlay = () => {
      startFromBeginning().then((ok) => {
        if (ok) cleanupGestures()
      })
    }

    if (audio.readyState >= 2) {
      tryPlay()
    } else {
      audio.addEventListener('canplaythrough', tryPlay, { once: true })
    }

    window.addEventListener('mm-music-start', onForcedStart)
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('keydown', unlock)
    window.addEventListener('click', unlock)

    return () => {
      cleanupGestures()
      window.removeEventListener('mm-music-start', onForcedStart)
      audio.removeEventListener('canplaythrough', tryPlay)
      if (fadeRef.current) window.clearInterval(fadeRef.current)
      audio.pause()
      audio.src = ''
      audioRef.current = null
      unlockedRef.current = false
    }
  }, [reduced, startFromBeginning])

  useEffect(() => {
    const onDream = (e) => {
      const audio = audioRef.current
      if (!audio || !on) return
      const richer = Boolean(e.detail?.active)
      fadeVolume(audio, richer ? 0.55 : 0.42, 600)
    }
    window.addEventListener('mm-dream-music', onDream)
    return () => window.removeEventListener('mm-dream-music', onDream)
  }, [on, fadeVolume])

  const toggle = async (e) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    if (reduced) return
    const audio = audioRef.current
    if (!audio) return

    if (on && !audio.paused) {
      if (fadeRef.current) window.clearInterval(fadeRef.current)
      fadeRef.current = null
      audio.pause()
      setOn(false)
      return
    }

    try {
      if (audio.paused) {
        if (!unlockedRef.current) audio.currentTime = 0
        audio.volume = 0
        await audio.play()
      }
      unlockedRef.current = true
      fadeVolume(audio, 0.42, 500)
      setOn(true)
    } catch {
      /* autoplay blocked — user can tap again */
    }
  }

  if (reduced || !mounted) return null

  return createPortal(
    <motion.button
      type="button"
      className={`mm-music ${on ? 'mm-music--on' : ''}`}
      onClick={toggle}
      onPointerDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      aria-pressed={on}
      aria-label={on ? 'Pause music' : 'Play music'}
      whileTap={{ scale: 0.94 }}
    >
      {on ? (
        <span className="mm-music__bars" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              animate={{ scaleY: [0.35, 1, 0.45, 0.85, 0.35] }}
              transition={{
                duration: 1.1 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </span>
      ) : (
        <span className="mm-music__label">Start</span>
      )}
    </motion.button>,
    document.body,
  )
}
