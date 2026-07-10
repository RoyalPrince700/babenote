/** Soft chimes / sparkles for the dream world (Web Audio). */

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

function tone(ctx, { freq, dur = 0.35, type = 'sine', gain = 0.05, delay = 0 }) {
  const now = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  const filter = ctx.createBiquadFilter()
  osc.type = type
  osc.frequency.value = freq
  filter.type = 'lowpass'
  filter.frequency.value = 1800
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(gain, now + 0.03)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  osc.connect(filter)
  filter.connect(g)
  g.connect(ctx.destination)
  osc.start(now)
  osc.stop(now + dur + 0.05)
}

export async function playDreamChime() {
  const ctx = getCtx()
  if (!ctx) return
  await ensureRunning(ctx)
  tone(ctx, { freq: 659.25, dur: 0.28, gain: 0.04 })
  tone(ctx, { freq: 830.61, dur: 0.4, gain: 0.035, delay: 0.06 })
  tone(ctx, { freq: 987.77, dur: 0.5, gain: 0.025, delay: 0.12 })
}

export async function playDreamSparkle() {
  const ctx = getCtx()
  if (!ctx) return
  await ensureRunning(ctx)
  tone(ctx, { freq: 1174.7, dur: 0.22, type: 'triangle', gain: 0.03 })
  tone(ctx, { freq: 1568, dur: 0.3, type: 'sine', gain: 0.02, delay: 0.05 })
}

export function signalDreamMusic(active) {
  window.dispatchEvent(new CustomEvent('mm-dream-music', { detail: { active } }))
}
