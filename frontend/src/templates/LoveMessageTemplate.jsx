import { motion } from 'framer-motion'
import AppIcon from '../components/AppIcon'
import Reveal from '../components/Reveal'
import TemplateShell from './TemplateShell'

export default function LoveMessageTemplate({ content, theme }) {
  return (
    <TemplateShell theme={theme} className="template-message">
      <section className="tpl-page tpl-message">
        <motion.div
          className="tpl-message__card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AppIcon name="heart" size={32} className="tpl-message__icon" />
          <p className="tpl-message__to">Dear {content.herName},</p>
          <h1 className="tpl-message__headline">{content.headline}</h1>
          <p className="tpl-message__text">{content.message}</p>
          <p className="tpl-message__sub">{content.subtext}</p>
          <p className="tpl-message__from">— {content.yourName}</p>
        </motion.div>
      </section>
    </TemplateShell>
  )
}
