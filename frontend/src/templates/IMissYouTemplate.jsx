import { motion } from 'framer-motion'
import AppIcon from '../components/AppIcon'
import Reveal from '../components/Reveal'
import TemplateShell from './TemplateShell'
import babePhoto from '../assets/babe.jpeg'
import babePhoto2 from '../assets/babe2.jpeg'
import usPhoto from '../assets/me and babe.jpeg'
import usPhoto2 from '../assets/me and babe 2.jpeg'

export default function IMissYouTemplate({ content, theme }) {
  const her = content.herName || 'you'

  return (
    <TemplateShell theme={theme} className="template-miss-you">
      <section className="tpl-page tpl-miss-you">
        <Reveal>
          <AppIcon name="moon" size={36} className="tpl-miss-you__icon" />
          <h1 className="tpl-miss-you__headline">{content.headline}</h1>
          <p className="tpl-miss-you__for">{content.herName},</p>

          <figure className="tpl-miss-you__moment">
            <div className="tpl-miss-you__moment-frame tpl-miss-you__moment-frame--us">
              <img src={usPhoto} alt={`Us — me and ${her}`} />
            </div>
            <figcaption className="tpl-miss-you__moment-caption">
              This is us — the picture I hold onto when the distance feels too loud.
            </figcaption>
            <p className="tpl-miss-you__message">{content.message}</p>
          </figure>
        </Reveal>

        <Reveal delay={0.2}>
          <h2 className="tpl-miss-you__subtitle">Things I miss about you</h2>
          <figure className="tpl-miss-you__moment">
            <div className="tpl-miss-you__moment-frame tpl-miss-you__moment-frame--portrait">
              <img src={babePhoto} alt={her} />
            </div>
            <figcaption className="tpl-miss-you__moment-caption">
              Looking at {her} — every little thing becomes a reason I miss you more.
            </figcaption>
          </figure>
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
          <figure className="tpl-miss-you__moment">
            <div className="tpl-miss-you__moment-frame tpl-miss-you__moment-frame--portrait">
              <img src={babePhoto2} alt={her} />
            </div>
            <figcaption className="tpl-miss-you__moment-caption">
              This face. This love. Forever chosen.
            </figcaption>
            <div className="tpl-miss-you__moment-frame tpl-miss-you__moment-frame--us tpl-miss-you__moment-frame--follow">
              <img src={usPhoto2} alt="Us together" />
            </div>
            <p className="tpl-miss-you__closing">{content.closing}</p>
            <p className="tpl-miss-you__from">— {content.yourName}</p>
          </figure>
        </Reveal>
      </section>
    </TemplateShell>
  )
}
