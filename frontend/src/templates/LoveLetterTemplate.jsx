import AppIcon from '../components/AppIcon'
import Reveal from '../components/Reveal'
import TemplateShell from './TemplateShell'

export default function LoveLetterTemplate({ content, theme }) {
  return (
    <TemplateShell theme={theme} className="template-letter">
      <section className="tpl-page tpl-letter">
        <Reveal>
          <p className="tpl-letter__for">For {content.herName}</p>
          <h1 className="tpl-letter__title">{content.title}</h1>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="tpl-letter__paper">
            <p className="tpl-letter__greeting">{content.greeting}</p>
            {content.body?.map((p, i) => (
              <p key={i} className="tpl-letter__body">{p}</p>
            ))}
            <div className="tpl-letter__closing">
              <p>{content.closing}</p>
              <p className="tpl-letter__signature">{content.yourName}</p>
              <p className="tpl-letter__sign-line">
                {content.signature}
                <AppIcon name="heart" size={16} />
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </TemplateShell>
  )
}
