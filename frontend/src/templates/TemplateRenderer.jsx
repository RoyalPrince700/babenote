import LoveStoryTemplate from './LoveStoryTemplate'
import LoveLetterTemplate from './LoveLetterTemplate'
import LoveMessageTemplate from './LoveMessageTemplate'
import MarriageProposalTemplate from './MarriageProposalTemplate'
import IMissYouTemplate from './IMissYouTemplate'
import './templates.css'

const MAP = {
  'love-story': LoveStoryTemplate,
  'love-letter': LoveLetterTemplate,
  'love-message': LoveMessageTemplate,
  'marriage-proposal': MarriageProposalTemplate,
  'i-miss-you': IMissYouTemplate,
}

export default function TemplateRenderer({ category, content, theme = 'dark' }) {
  const Component = MAP[category]
  if (!Component) {
    return (
      <div className="template template--dark">
        <p style={{ padding: '4rem', textAlign: 'center' }}>Template not found.</p>
      </div>
    )
  }
  return <Component content={content} theme={theme} />
}
