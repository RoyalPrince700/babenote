export const EASE = [0.22, 1, 0.36, 1]
export const EASE_SOFT = [0.4, 0, 0.2, 1]

export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
}

export const fadeScale = {
  initial: { opacity: 0, scale: 0.94 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
}

export const stageTransition = {
  duration: 0.7,
  ease: EASE,
}

export const viewportOnce = {
  once: true,
  amount: 0.35,
}
