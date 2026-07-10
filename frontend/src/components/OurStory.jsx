import Reveal from './Reveal'
import SectionDivider from './SectionDivider'

export default function OurStory({ content }) {
  return (
    <section id="story" className="section our-story">
      <div className="section__inner">
        <Reveal className="section__header">
          <span className="section__label">Chapter One</span>
          <h2 className="section__title">{content.title}</h2>
          <SectionDivider />
        </Reveal>

        <div className="our-story__content">
          {content.paragraphs.map((paragraph, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <p className="our-story__paragraph">{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
