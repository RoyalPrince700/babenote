import { motion } from 'framer-motion'
import { EASE, viewportOnce } from '../miss-me/motion'

export function SectionShell({
  kicker,
  title,
  subtitle,
  children,
  className = '',
  flush = false,
}) {
  return (
    <section className={`p3-section ${flush ? 'p3-section--flush' : ''} ${className}`}>
      {(kicker || title || subtitle) && (
        <header className="p3-section__head">
          {kicker && <p className="p3-kicker">{kicker}</p>}
          {title && (
            <motion.h2
              className="p3-title"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.85, ease: EASE }}
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              className="p3-sub"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.8, delay: 0.12, ease: EASE }}
            >
              {subtitle}
            </motion.p>
          )}
        </header>
      )}
      {children}
    </section>
  )
}

export function SoftPause({ lines }) {
  return (
    <section className="p3-pause">
      <div className="p3-pause__inner">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            className="p3-pause__line"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, delay: i * 0.4, ease: EASE }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

export function FloatingDust({ count = 18 }) {
  return (
    <div className="p3-dust" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className="p3-dust__speck"
          style={{
            left: `${(i * 17 + 7) % 100}%`,
            top: `${(i * 29 + 11) % 100}%`,
            animationDelay: `${(i % 8) * 0.7}s`,
            animationDuration: `${10 + (i % 6)}s`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
          }}
        />
      ))}
    </div>
  )
}
