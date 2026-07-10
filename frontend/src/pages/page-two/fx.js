/** Micro-FX for page-two photo interactions */

import { playDreamChime, playDreamSparkle } from '../miss-me/dreamAudio'

let sharedCtx = null

function getCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) return null
  if (!sharedCtx) sharedCtx = new Ctx()
  return sharedCtx
}

async function ensureRunning(ctx) {
  if (ctx.state === 'suspended') await ctx.resume()
}

export function softVibrate(pattern = 12) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern)
  } catch {
    /* ignore */
  }
}

export async function playShutter() {
  const ctx = getCtx()
  if (!ctx) return
  await ensureRunning(ctx)
  const now = ctx.currentTime
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.06, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < data.length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.18))
  }
  const src = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  src.buffer = buffer
  filter.type = 'highpass'
  filter.frequency.value = 900
  gain.gain.setValueAtTime(0.045, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  src.start(now)
  src.stop(now + 0.09)
}

export function celebrateTap(kind = 'sparkle') {
  softVibrate(kind === 'shutter' ? [8, 20, 8] : 10)
  if (kind === 'shutter') void playShutter()
  else if (kind === 'chime') void playDreamChime()
  else void playDreamSparkle()
}

export function spawnHeartBurst(x, y, count = 8) {
  const root = document.body
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement('span')
    el.className = 'p2-burst-heart'
    el.textContent = '♥'
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const dist = 36 + Math.random() * 48
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    el.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    el.style.setProperty('--dy', `${Math.sin(angle) * dist - 20}px`)
    el.style.setProperty('--rot', `${-30 + Math.random() * 60}deg`)
    root.appendChild(el)
    window.setTimeout(() => el.remove(), 900)
  }
}

export function burstAtEvent(e, count = 7) {
  const x = e.clientX ?? e.touches?.[0]?.clientX ?? window.innerWidth / 2
  const y = e.clientY ?? e.touches?.[0]?.clientY ?? window.innerHeight / 2
  spawnHeartBurst(x, y, count)
}
