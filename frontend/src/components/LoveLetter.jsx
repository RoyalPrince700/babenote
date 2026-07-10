import AppIcon from './AppIcon'
import Reveal from './Reveal'

export default function LoveLetter({ content, yourName }) {
  return (
    <section id="letter" className="section love-letter">
      <div className="section__inner">
        <Reveal>
          <div className="love-letter__envelope">
            <div className="love-letter__paper">
              <div className="section__header">
                <span className="section__label">Chapter Four</span>
                <h2 className="section__title">{content.title}</h2>
              </div>

              <p className="love-letter__greeting">{content.greeting}</p>

              {content.body.map((paragraph, i) => (
                <p key={i} className="love-letter__body">
                  {paragraph}
                </p>
              ))}

              <div className="love-letter__closing">
                <p>{content.closing}</p>
                <p className="love-letter__signature">{yourName}</p>
                <p className="love-letter__heart">
                  {content.signature}
                  <AppIcon name="heart" size={16} className="love-letter__heart-icon" />
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
