import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Jump to top on every route change (chapters keep window scroll). */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useLayoutEffect(() => {
    const reset = () => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }

    reset()
    const frame = requestAnimationFrame(reset)
    const timer = window.setTimeout(reset, 50)

    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [pathname])

  return null
}
