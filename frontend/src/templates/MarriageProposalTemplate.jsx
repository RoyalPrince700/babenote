import { motion } from 'framer-motion'
import AppIcon from '../components/AppIcon'
import Reveal from '../components/Reveal'
import TemplateShell from './TemplateShell'

export default function MarriageProposalTemplate({ content, theme }) {
  return (
    <TemplateShell theme={theme} className="template-proposal">
      <section className="tpl-page tpl-proposal">
        <Reveal>
          <p className="tpl-proposal__for">{content.herName},</p>
          <p className="tpl-proposal__intro">{content.message}</p>
        </Reveal>

        <Reveal delay={0.2}>
          <ul className="tpl-proposal__highlights">
            {content.highlights?.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <AppIcon name="sparkles" size={18} />
                {item}
              </motion.li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.35}>
          <h1 className="tpl-proposal__question">{content.question}</h1>
          <p className="tpl-proposal__closing">{content.closingLine}</p>
          <p className="tpl-proposal__from">— {content.yourName}</p>
        </Reveal>
      </section>
    </TemplateShell>
  )
}
