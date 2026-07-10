import { Link } from 'react-router-dom'
import { Heart, Sparkles, Mail, Gem, MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  { icon: Heart, title: 'Love Story', text: 'Full websites with memories, bond & letters' },
  { icon: Mail, title: 'Love Letters', text: 'Beautiful handwritten-style letters' },
  { icon: MessageCircle, title: 'Sweet Messages', text: 'Short notes to brighten their day' },
  { icon: Gem, title: 'Proposals', text: 'Pop the question in unforgettable style' },
  { icon: Sparkles, title: 'I Miss You', text: 'Tell them how much you miss them' },
]

export default function Landing() {
  return (
    <>
      <section className="platform-hero">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1>
            Create something beautiful
            <br />
            <em>for the one you love</em>
          </h1>
          <p>
            Pick a template, customize it with their name and your words, then share a private link.
            Marriage proposals, love letters, miss-you notes — all in dark or light themes.
          </p>
          <div className="platform-hero__actions">
            <Link to="/templates" className="platform-btn platform-btn--primary">Browse templates</Link>
            <Link to="/register" className="platform-btn platform-btn--outline">Create free account</Link>
          </div>
        </motion.div>
      </section>

      <section className="platform-main">
        <h2 className="platform-section-title">What you can create</h2>
        <p className="platform-section-sub">Five categories. Two themes each. One person who matters most.</p>
        <div className="template-grid">
          {features.map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              className="template-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="template-card__preview template-card__preview--dark">
                <Icon size={40} strokeWidth={1.25} />
              </div>
              <div className="template-card__body">
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  )
}
