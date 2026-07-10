import { motion } from 'framer-motion'
import AppIcon from './AppIcon'
import Reveal from './Reveal'
import SectionDivider from './SectionDivider'

export default function OurBond({ content }) {
  return (
    <section id="bond" className="section our-bond">
      <div className="section__inner">
        <Reveal className="section__header">
          <span className="section__label">Chapter Three</span>
          <h2 className="section__title">{content.title}</h2>
          <SectionDivider />
          <p className="section__subtitle">{content.subtitle}</p>
        </Reveal>

        <div className="bond__grid">
          {content.reasons.map((reason, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <motion.div
                className="bond-card"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
              >
                <span className="bond-card__icon">
                  <AppIcon name={reason.icon} size={32} />
                </span>
                <p className="bond-card__text">{reason.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
