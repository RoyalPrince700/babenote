import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import HeartConfetti from './miss-me/HeartConfetti'
import HeartTrail from './miss-me/HeartTrail'
import IntroSequence from './miss-me/IntroSequence'
import MusicPlayer from './miss-me/MusicPlayer'
import QuestionGate from './miss-me/QuestionGate'
import StoryTimeline from './miss-me/StoryTimeline'
import MmIcon from './miss-me/icons'
import './miss-me/miss-me.css'

const STAGES = {
  INTRO: 'intro',
  QUESTION: 'question',
  STORY: 'story',
}

export default function DoYouMissMe() {
  const [stage, setStage] = useState(STAGES.INTRO)
  const [burst, setBurst] = useState(false)
  const [hugged, setHugged] = useState(false)
  const burstModeRef = useRef('yes')

  const finishIntro = useCallback(() => setStage(STAGES.QUESTION), [])

  const handleYes = useCallback(() => {
    burstModeRef.current = 'yes'
    setBurst(true)
  }, [])

  const afterBurst = useCallback(() => {
    setBurst(false)
    if (burstModeRef.current === 'yes') {
      setStage(STAGES.STORY)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [])

  const handleHug = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate([20, 30, 20, 30, 40])
    setHugged(true)
    burstModeRef.current = 'hug'
    setBurst(true)
  }, [])

  return (
    <div className="mm-root">
      <MusicPlayer />
      <HeartTrail active={stage !== STAGES.INTRO} />
      <HeartConfetti active={burst} onDone={afterBurst} />

      <AnimatePresence mode="wait">
        {stage === STAGES.INTRO && <IntroSequence key="intro" onComplete={finishIntro} />}
        {stage === STAGES.QUESTION && <QuestionGate key="question" onYes={handleYes} />}
        {stage === STAGES.STORY && <StoryTimeline key="story" onHug={handleHug} />}
      </AnimatePresence>

      <AnimatePresence>
        {hugged && (
          <motion.div
            className="mm-hug-toast"
            role="status"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Soft hug sent. Come back soon <MmIcon name="heart" size={14} filled />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
