import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import AmbientBackground from './AmbientBackground'
import EndingSequence from './EndingSequence'
import FloatingHearts from './FloatingHearts'
import LoveNotes from './LoveNotes'
import MagicalWorld from './MagicalWorld'
import TimelineItem from './TimelineItem'
import { CHAPTERS } from './data'
import { EASE, fadeUp, stageTransition } from './motion'
import { StaggerText } from './GlassCard'
import { playDreamChime } from './dreamAudio'
import {
  GiantNameSection,
  SausieStorySection,
  PhotoHoldSection,
  HugMeterSection,
  SnuggleModeSection,
} from './sections/CoreSections'
import {
  NotificationsSection,
  LoveChemistrySection,
  MemoryStarsSection,
  HeartbeatSection,
  OpenHeartSection,
  ComplimentRainSection,
  ConstellationSection,
  PhotoMosaicSection,
  FutureSection,
} from './sections/PlaySections'
import './experience.css'

function HeroChapter({ chapter }) {
  return (
    <section className="mm-chapter mm-chapter--hero">
      <div className="mm-chapter__inner">
        <motion.div
          className="mm-story__scroll-hint"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown size={22} />
        </motion.div>
        <TimelineItem icon={chapter.icon} label={chapter.label} active />
        <motion.h1
          className="mm-story__title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          {chapter.title}
        </motion.h1>
        <StaggerText text={chapter.subtitle} className="mm-story__subtitle" delay={0.2} />
      </div>
    </section>
  )
}

function renderChapter(chapter) {
  switch (chapter.kind) {
    case 'hero':
      return <HeroChapter key={chapter.id} chapter={chapter} />
    case 'giant-name':
      return <GiantNameSection key={chapter.id} chapter={chapter} />
    case 'sausie-story':
      return <SausieStorySection key={chapter.id} />
    case 'photo-hold':
      return <PhotoHoldSection key={chapter.id} chapter={chapter} />
    case 'dream':
      return <MagicalWorld key={chapter.id} chapter={chapter} />
    case 'hug-meter':
      return <HugMeterSection key={chapter.id} />
    case 'notifications':
      return <NotificationsSection key={chapter.id} />
    case 'snuggle-mode':
      return <SnuggleModeSection key={chapter.id} />
    case 'love-chemistry':
      return <LoveChemistrySection key={chapter.id} />
    case 'memory-stars':
      return <MemoryStarsSection key={chapter.id} />
    case 'heartbeat':
      return <HeartbeatSection key={chapter.id} />
    case 'open-heart':
      return <OpenHeartSection key={chapter.id} />
    case 'compliment-rain':
      return <ComplimentRainSection key={chapter.id} />
    case 'constellation':
      return <ConstellationSection key={chapter.id} chapter={chapter} />
    case 'photo-mosaic':
      return <PhotoMosaicSection key={chapter.id} chapter={chapter} />
    case 'future':
      return <FutureSection key={chapter.id} />
    default:
      return null
  }
}

export default function StoryTimeline({ onHug }) {
  const [egg, setEgg] = useState('')

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase()
      if (k === 'm') {
        setEgg('Mama — still my favorite word.')
        playDreamChime()
      } else if (k === 's') {
        setEgg('Sausie & Snuggles — my whole vocabulary of love.')
        playDreamChime()
      } else return
      window.setTimeout(() => setEgg(''), 2800)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <motion.div
      className="mm-stage mm-story"
      variants={fadeUp}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={stageTransition}
    >
      <AmbientBackground variant="story" />
      <FloatingHearts count={8} className="mm-hearts--story" />
      <LoveNotes active />

      {CHAPTERS.map((chapter) => renderChapter(chapter))}

      <EndingSequence onHug={onHug} />

      <AnimatePresence>
        {egg && (
          <motion.div
            className="xp-key-egg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {egg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
