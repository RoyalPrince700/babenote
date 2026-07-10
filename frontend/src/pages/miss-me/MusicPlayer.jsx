import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import {
  getBgAudio,
  preloadBgMusic,
  setBgMusicLevel,
  subscribeMusic,
  toggleBgMusic,
  unlockAndPlay,
} from './bgMusic'
import usePrefersReducedMotion from './usePrefersReducedMotion'

export default function MusicPlayer() {
  const reduced = usePrefersReducedMotion()
  const [on, setOn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    preloadBgMusic()
    return subscribeMusic(({ playing }) => setOn(playing))
  }, [])

  useEffect(() => {
    const onDream = (e) => {
      if (!on) return
      const richer = Boolean(e.detail?.active)
      setBgMusicLevel(richer ? 0.55 : 0.42)
    }
    window.addEventListener('mm-dream-music', onDream)
    return () => window.removeEventListener('mm-dream-music', onDream)
  }, [on])

  // Desktop may allow autoplay; mobile browsers usually block until a tap.
  useEffect(() => {
    const audio = getBgAudio()
    if (!audio) return undefined

    const tryAuto = () => {
      void unlockAndPlay()
    }

    if (audio.readyState >= 2) {
      tryAuto()
      return undefined
    }

    audio.addEventListener('canplaythrough', tryAuto, { once: true })
    return () => audio.removeEventListener('canplaythrough', tryAuto)
  }, [])

  const toggle = (e) => {
    e?.stopPropagation?.()
    e?.preventDefault?.()
    void toggleBgMusic()
  }

  if (!mounted) return null

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
          {[0, 1, 2, 3].map((i) =>
            reduced ? (
              <span key={i} style={{ transform: `scaleY(${0.4 + i * 0.15})` }} />
            ) : (
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
            ),
          )}
        </span>
      ) : (
        <span className="mm-music__label">Start</span>
      )}
    </motion.button>,
    document.body,
  )
}
