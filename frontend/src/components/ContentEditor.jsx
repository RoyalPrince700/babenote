function Field({ label, value, onChange, multiline = false }) {
  return (
    <div className="editor-field">
      <label>{label}</label>
      {multiline ? (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  )
}

function updateNested(obj, path, value) {
  const keys = path.split('.')
  const next = structuredClone(obj)
  let cur = next
  for (let i = 0; i < keys.length - 1; i++) {
    cur[keys[i]] = { ...cur[keys[i]] }
    cur = cur[keys[i]]
  }
  cur[keys[keys.length - 1]] = value
  return next
}

function updateArrayItem(obj, path, index, field, value) {
  const next = structuredClone(obj)
  const parts = path.split('.')
  let cur = next
  for (const part of parts) cur = cur[part]
  cur[index] = { ...cur[index], [field]: value }
  return next
}

function updateArrayText(obj, path, index, value) {
  const next = structuredClone(obj)
  const parts = path.split('.')
  let cur = next
  for (const part of parts) cur = cur[part]
  cur[index] = value
  return next
}

export default function ContentEditor({ category, content, onChange }) {
  const set = (path, value) => onChange(updateNested(content, path, value))
  const setArrayItem = (path, index, field, value) => onChange(updateArrayItem(content, path, index, field, value))
  const setArrayText = (path, index, value) => onChange(updateArrayText(content, path, index, value))

  return (
    <div>
      <div className="editor-section">
        <h3>Names</h3>
        <Field label="Their name (babe)" value={content.herName} onChange={(v) => set('herName', v)} />
        <Field label="Your name" value={content.yourName} onChange={(v) => set('yourName', v)} />
      </div>

      {category === 'love-story' && (
        <>
          <div className="editor-section">
            <h3>Hero</h3>
            <Field label="Title" value={content.hero?.title} onChange={(v) => set('hero.title', v)} />
            <Field label="Subtitle" value={content.hero?.subtitle} onChange={(v) => set('hero.subtitle', v)} />
            <Field label="Tagline" value={content.hero?.tagline} onChange={(v) => set('hero.tagline', v)} multiline />
          </div>
          <div className="editor-section">
            <h3>Our Story</h3>
            {content.ourStory?.paragraphs?.map((p, i) => (
              <Field key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(v) => setArrayText('ourStory.paragraphs', i, v)} multiline />
            ))}
          </div>
          <div className="editor-section">
            <h3>Memories</h3>
            {content.memories?.map((m, i) => (
              <div key={i} className="editor-array-item">
                <Field label="Date" value={m.date} onChange={(v) => setArrayItem('memories', i, 'date', v)} />
                <Field label="Title" value={m.title} onChange={(v) => setArrayItem('memories', i, 'title', v)} />
                <Field label="Description" value={m.description} onChange={(v) => setArrayItem('memories', i, 'description', v)} multiline />
              </div>
            ))}
          </div>
          <div className="editor-section">
            <h3>Why I Love You</h3>
            {content.bond?.reasons?.map((r, i) => (
              <Field key={i} label={`Reason ${i + 1}`} value={r.text} onChange={(v) => setArrayItem('bond.reasons', i, 'text', v)} multiline />
            ))}
          </div>
          <div className="editor-section">
            <h3>Love Letter</h3>
            <Field label="Greeting" value={content.loveLetter?.greeting} onChange={(v) => set('loveLetter.greeting', v)} />
            {content.loveLetter?.body?.map((p, i) => (
              <Field key={i} label={`Body ${i + 1}`} value={p} onChange={(v) => setArrayText('loveLetter.body', i, v)} multiline />
            ))}
            <Field label="Closing" value={content.loveLetter?.closing} onChange={(v) => set('loveLetter.closing', v)} />
          </div>
        </>
      )}

      {category === 'love-letter' && (
        <div className="editor-section">
          <h3>Letter</h3>
          <Field label="Title" value={content.title} onChange={(v) => set('title', v)} />
          <Field label="Greeting" value={content.greeting} onChange={(v) => set('greeting', v)} />
          {content.body?.map((p, i) => (
            <Field key={i} label={`Paragraph ${i + 1}`} value={p} onChange={(v) => setArrayText('body', i, v)} multiline />
          ))}
          <Field label="Closing" value={content.closing} onChange={(v) => set('closing', v)} />
          <Field label="Signature line" value={content.signature} onChange={(v) => set('signature', v)} />
        </div>
      )}

      {category === 'love-message' && (
        <div className="editor-section">
          <h3>Message</h3>
          <Field label="Headline" value={content.headline} onChange={(v) => set('headline', v)} />
          <Field label="Message" value={content.message} onChange={(v) => set('message', v)} multiline />
          <Field label="Subtext" value={content.subtext} onChange={(v) => set('subtext', v)} />
        </div>
      )}

      {category === 'marriage-proposal' && (
        <div className="editor-section">
          <h3>Proposal</h3>
          <Field label="The question" value={content.question} onChange={(v) => set('question', v)} />
          <Field label="Your message" value={content.message} onChange={(v) => set('message', v)} multiline />
          {content.highlights?.map((h, i) => (
            <Field key={i} label={`Reason ${i + 1}`} value={h} onChange={(v) => setArrayText('highlights', i, v)} />
          ))}
          <Field label="Closing line" value={content.closingLine} onChange={(v) => set('closingLine', v)} />
        </div>
      )}

      {category === 'i-miss-you' && (
        <div className="editor-section">
          <h3>Miss You Note</h3>
          <Field label="Headline" value={content.headline} onChange={(v) => set('headline', v)} />
          <Field label="Message" value={content.message} onChange={(v) => set('message', v)} multiline />
          {content.thingsIMiss?.map((item, i) => (
            <Field key={i} label={`Thing you miss ${i + 1}`} value={item} onChange={(v) => setArrayText('thingsIMiss', i, v)} />
          ))}
          <Field label="Closing" value={content.closing} onChange={(v) => set('closing', v)} />
        </div>
      )}
    </div>
  )
}
