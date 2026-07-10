import songUrl from '../../assets/dotti-forever.mp3'

let audio = null
let unlocked = false
let playing = false
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => {
    try {
      fn({ playing, unlocked })
    } catch {
      /* ignore subscriber errors */
    }
  })
}

export function subscribeMusic(fn) {
  listeners.add(fn)
  fn({ playing, unlocked })
  return () => listeners.delete(fn)
}

export function getBgAudio() {
  if (typeof window === 'undefined') return null
  if (!audio) {
    audio = new Audio(songUrl)
    audio.loop = true
    audio.preload = 'auto'
    audio.playsInline = true
    audio.setAttribute('playsinline', 'true')
    audio.setAttribute('webkit-playsinline', 'true')
    audio.muted = false
    audio.volume = 0.42
    audio.addEventListener('play', () => {
      playing = true
      notify()
    })
    audio.addEventListener('pause', () => {
      playing = false
      notify()
    })
  }
  return audio
}

/** Warm the element early so the first tap can play immediately. */
export function preloadBgMusic() {
  const a = getBgAudio()
  if (!a) return
  try {
    a.load()
  } catch {
    /* ignore */
  }
}

/**
 * Must run in the same synchronous turn as a user gesture (tap/click).
 * Do not call this from a CustomEvent or setTimeout — iOS will block it.
 */
export function unlockAndPlay() {
  const a = getBgAudio()
  if (!a) return Promise.resolve(false)

  a.muted = false
  try {
    a.volume = 0.42
  } catch {
    /* iOS may ignore volume */
  }

  try {
    if (a.readyState >= 1) a.currentTime = 0
  } catch {
    /* ignore seek errors before metadata */
  }

  const result = a.play()
  if (result && typeof result.then === 'function') {
    return result
      .then(() => {
        unlocked = true
        playing = true
        notify()
        return true
      })
      .catch(() => {
        unlocked = false
        playing = false
        notify()
        return false
      })
  }

  unlocked = !a.paused
  playing = !a.paused
  notify()
  return Promise.resolve(playing)
}

export async function toggleBgMusic() {
  const a = getBgAudio()
  if (!a) return false

  if (!a.paused) {
    a.pause()
    playing = false
    notify()
    return false
  }

  a.muted = false
  try {
    a.volume = 0.42
  } catch {
    /* ignore */
  }

  if (!unlocked) {
    try {
      if (a.readyState >= 1) a.currentTime = 0
    } catch {
      /* ignore */
    }
  }

  try {
    await a.play()
    unlocked = true
    playing = true
    notify()
    return true
  } catch {
    playing = false
    notify()
    return false
  }
}

export function setBgMusicLevel(level) {
  const a = getBgAudio()
  if (!a || a.paused) return
  try {
    a.volume = Math.min(1, Math.max(0, level))
  } catch {
    /* iOS may ignore */
  }
}
