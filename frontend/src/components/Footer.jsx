import { motion } from 'framer-motion'
import AppIcon from './AppIcon'

export default function Footer({ content, herName }) {
  const year = new Date().getFullYear()

  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer__inner">
        <p className="footer__quote">{content.quote}</p>
        <p className="footer__message">
          {content.message}, {herName}
          <AppIcon name="heart" size={14} className="footer__heart-icon" />
        </p>
        <p className="footer__year">&copy; {year} — Our love story continues...</p>
      </div>
    </motion.footer>
  )
}
