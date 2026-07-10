import { motion } from 'framer-motion'
import AppIcon from './AppIcon'
import Reveal from './Reveal'
import SectionDivider from './SectionDivider'

export default function Memories({ memories }) {
  return (
    <section id="memories" className="section memories">
      <div className="section__inner">
        <Reveal className="section__header">
          <span className="section__label">Chapter Two</span>
          <h2 className="section__title">Our Memories</h2>
          <SectionDivider />
          <p className="section__subtitle">
            Every moment we've shared lives here — little treasures of us.
          </p>
        </Reveal>

        <div className="memories__timeline">
          {memories.map((memory, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.article
                className="memory-card"
                whileHover={{ x: 8 }}
                transition={{ duration: 0.3 }}
              >
                <div className="memory-card__icon">
                  <AppIcon name={memory.icon} size={26} />
                </div>
                <div className="memory-card__content">
                  <span className="memory-card__date">{memory.date}</span>
                  <h3 className="memory-card__title">{memory.title}</h3>
                  <p className="memory-card__description">{memory.description}</p>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
