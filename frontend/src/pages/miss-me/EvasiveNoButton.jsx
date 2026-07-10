import { useCallback, useEffect, useRef, useState } from 'react'

const BTN_W = 130
const BTN_H = 52
const PADDING = 16

function randomPosition(container) {
  const maxX = Math.max(PADDING, container.clientWidth - BTN_W - PADDING)
  const maxY = Math.max(PADDING, container.clientHeight - BTN_H - PADDING)
  return {
    x: PADDING + Math.random() * (maxX - PADDING),
    y: PADDING + Math.random() * (maxY - PADDING),
  }
}

function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window
}

export default function EvasiveNoButton({ containerRef }) {
  const [pos, setPos] = useState(null)
  const touchRef = useRef(isTouchDevice())

  useEffect(() => {
    const container = containerRef.current
    if (container) setPos(randomPosition(container))
  }, [containerRef])

  const dodge = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      const container = containerRef.current
      if (container) setPos(randomPosition(container))
    },
    [containerRef]
  )

  if (!pos) return null

  return (
    <button
      type="button"
      className="miss-me-btn miss-me-btn--no"
      style={{ left: pos.x, top: pos.y }}
      onMouseEnter={touchRef.current ? undefined : dodge}
      onMouseDown={touchRef.current ? undefined : dodge}
      onClick={dodge}
      onTouchStart={touchRef.current ? dodge : undefined}
      aria-label="No — nice try"
    >
      No
    </button>
  )
}
