import { motion } from 'framer-motion'
import AppIcon from '../components/AppIcon'
import Reveal from '../components/Reveal'
import TemplateShell from './TemplateShell'

export default function IMissYouTemplate({ content, theme }) {
  return (
    <TemplateShell theme={theme} className="template-miss-you">
      <section className="tpl-page tpl-miss-you">
        <Reveal>
          <AppIcon name="moon" size={36} className="tpl-miss-you__icon" />
          <h1 className="tpl-miss-you__headline">{content.headline}</h1>
          <p className="tpl-miss-you__for">{content.herName},</p>
          <p className="tpl-miss-you__message">{content.message}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <h2 className="tpl-miss-you__subtitle">Things I miss about you</h2>
          <ul className="tpl-miss-you__list">
            {content.thingsIMiss?.map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 6 }}
                transition={{ duration: 0.2 }}
              >
                <AppIcon name="heart" size={16} />
                {item}
              </motion.li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.3}>
          <p className="tpl-miss-you__closing">{content.closing}</p>
          <p className="tpl-miss-you__from">— {content.yourName}</p>
        </Reveal>
      </section>
    </TemplateShell>
  )
}
