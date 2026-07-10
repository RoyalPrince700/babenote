import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import AmbientBackground from './AmbientBackground'
import EndingSequence from './EndingSequence'
import FloatingHearts from './FloatingHearts'
import LoveNotes from './LoveNotes'
import MagicalWorld from './MagicalWorld'
import MemoryCard from './MemoryCard'
import TimelineItem from './TimelineItem'
import { CHAPTERS } from './data'
import { EASE, fadeUp, stageTransition, viewportOnce } from './motion'
import { StaggerText } from './GlassCard'

function BridgeChapter({ lines }) {
  return (
    <section className="mm-chapter mm-chapter--bridge">
      <div className="mm-chapter__inner">
        {lines.map((line, i) => (
          <motion.p
            key={i}
            className="mm-bridge__line"
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, delay: i * 0.35, ease: EASE }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  )
}

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
        <TimelineItem emoji={chapter.emoji} label={chapter.label} active />
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

function MemoryChapter({ chapter }) {
  return (
    <section className="mm-chapter mm-chapter--memory">
      <div className="mm-chapter__inner">
        <TimelineItem emoji={chapter.emoji} label={chapter.label} />
        <motion.h2
          className="mm-story__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {chapter.title}
        </motion.h2>
        <MemoryCard
          photo={chapter.photo}
          photoAlt={chapter.photoAlt}
          caption={chapter.caption}
          frame={chapter.frame}
          body={chapter.body}
          lead={chapter.lead}
          items={chapter.items}
          emphasis={chapter.emphasis}
        />
      </div>
    </section>
  )
}

export default function StoryTimeline({ onHug }) {
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
      <FloatingHearts count={10} className="mm-hearts--story" />
      <LoveNotes active />

      {CHAPTERS.map((chapter) => {
        if (chapter.kind === 'hero') return <HeroChapter key={chapter.id} chapter={chapter} />
        if (chapter.kind === 'bridge') return <BridgeChapter key={chapter.id} lines={chapter.lines} />
        if (chapter.kind === 'dream') return <MagicalWorld key={chapter.id} chapter={chapter} />
        return <MemoryChapter key={chapter.id} chapter={chapter} />
      })}

      <EndingSequence onHug={onHug} />
    </motion.div>
  )
}
