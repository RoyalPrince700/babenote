import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react'
import AppIcon from '../components/AppIcon.jsx'
import EvasiveNoButton from './miss-me/EvasiveNoButton.jsx'
import './miss-me/miss-me.css'

const pageVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

const PAGES = [
  {
    id: 1,
    type: 'question',
  },
  {
    id: 2,
    title: 'I knew it!',
    body: [
      'The truth is, I miss you every single second we are apart. When you are not here, the world feels a little quieter, a little dimmer — like someone turned down the brightness on everything beautiful.',
      'You are the first person I want to tell things to, the voice I long to hear, and the smile I replay in my mind when the day gets heavy. Missing you is not a bad feeling — it is proof of how much you mean to me.',
    ],
  },
  {
    id: 3,
    title: 'Little things that remind me of you',
    items: [
      'Songs that feel like they were written about us',
      'Random moments that make me wish you were right here',
      'Your laugh echoing in my head at the worst times',
      'The way my phone lighting up still gives me butterflies',
      'Every plan I make — always hoping you are in it',
    ],
  },
  {
    id: 4,
    title: 'Why you are my favorite person',
    body: [
      'You make ordinary days feel like something worth remembering. You listen, you care, you show up — not because you have to, but because that is who you are.',
      'With you, I never have to pretend. I can be silly, soft, serious, or completely myself — and you love me through all of it. That kind of love is rare, and I never take it for granted.',
      'If I could choose anyone in this world to miss, to wait for, to dream about — it would always, always be you.',
    ],
  },
  {
    id: 5,
    title: 'One last thing...',
    closing:
      'However far apart we are, whatever busy day we are having — never forget this: you are deeply loved, endlessly missed, and forever chosen. Come back to me soon, my love.',
    signature: 'Always yours',
  },
]

function ProgressDots({ current, total }) {
  return (
    <div className="miss-me-dots" aria-hidden="true">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`miss-me-dots__dot ${i === current ? 'miss-me-dots__dot--active' : ''}`} />
      ))}
    </div>
  )
}

function QuestionPage({ onYes, containerRef }) {
  return (
    <motion.div
      key="q"
      className="miss-me-page miss-me-page--question"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45 }}
    >
      <AppIcon name="heart" size={40} className="miss-me-page__icon" />
      <h1 className="miss-me-page__title">Do you miss me?</h1>
      <p className="miss-me-page__subtitle">Be honest... I already know the answer I want to hear.</p>

      <div className="miss-me-playground" ref={containerRef}>
        <EvasiveNoButton containerRef={containerRef} />
      </div>

      <div className="miss-me-actions miss-me-actions--center">
        <button type="button" className="miss-me-btn miss-me-btn--yes" onClick={onYes}>
          <Heart size={18} />
          Yes, I miss you!
        </button>
      </div>
      <p className="miss-me-hint">Psst... the &ldquo;No&rdquo; button is not really an option.</p>
    </motion.div>
  )
}

function ContentPage({ page, onNext, onBack, isLast, stepIndex }) {
  return (
    <motion.div
      key={page.id}
      className="miss-me-page"
      variants={pageVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.45 }}
    >
      <ProgressDots current={stepIndex} total={5} />

      {page.id === 2 && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <Sparkles size={36} className="miss-me-page__icon" />
          </motion.div>
          <h1 className="miss-me-page__title">{page.title}</h1>
          {page.body.map((p, i) => (
            <p key={i} className="miss-me-page__body">{p}</p>
          ))}
        </>
      )}

      {page.id === 3 && (
        <>
          <h1 className="miss-me-page__title">{page.title}</h1>
          <ul className="miss-me-list">
            {page.items.map((item, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
              >
                <AppIcon name="sparkles" size={18} />
                {item}
              </motion.li>
            ))}
          </ul>
        </>
      )}

      {page.id === 4 && (
        <>
          <h1 className="miss-me-page__title">{page.title}</h1>
          {page.body.map((p, i) => (
            <motion.p
              key={i}
              className="miss-me-page__body"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.12 }}
            >
              {p}
            </motion.p>
          ))}
        </>
      )}

      {page.id === 5 && (
        <>
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <AppIcon name="heart" size={48} className="miss-me-page__icon miss-me-page__icon--pulse" />
          </motion.div>
          <h1 className="miss-me-page__title">{page.title}</h1>
          <p className="miss-me-page__body miss-me-page__body--highlight">{page.closing}</p>
          <p className="miss-me-page__signature">{page.signature}</p>
        </>
      )}

      <div className="miss-me-actions">
        {stepIndex > 0 && (
          <button type="button" className="miss-me-btn miss-me-btn--ghost" onClick={onBack}>
            <ChevronLeft size={18} />
            Back
          </button>
        )}
        {!isLast && (
          <button type="button" className="miss-me-btn miss-me-btn--yes" onClick={onNext}>
            Continue
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default function DoYouMissMe() {
  const [step, setStep] = useState(0)
  const playgroundRef = useRef(null)

  const currentPage = PAGES[step]
  const isQuestion = step === 0

  return (
    <div className="miss-me">
      <AnimatePresence mode="wait">
        {isQuestion ? (
          <QuestionPage
            key="question"
            onYes={() => setStep(1)}
            containerRef={playgroundRef}
          />
        ) : (
          <ContentPage
            page={currentPage}
            stepIndex={step}
            isLast={step === PAGES.length - 1}
            onNext={() => setStep((s) => Math.min(s + 1, PAGES.length - 1))}
            onBack={() => setStep((s) => Math.max(s - 1, 1))}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
