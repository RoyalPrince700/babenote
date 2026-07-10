import { useEffect } from 'react'
import AmbientBackground from './miss-me/AmbientBackground'
import FloatingHearts from './miss-me/FloatingHearts'
import HeartTrail from './miss-me/HeartTrail'
import MusicPlayer from './miss-me/MusicPlayer'
import {
  ClosingSection,
  FilmReelSection,
  ForeverGridSection,
  HeroSection,
  HimAndHerSection,
  MatchingDaySection,
  PolaroidSection,
  WhisperWallSection,
} from './page-two/Sections'
import {
  BeforeAfterSection,
  CoverflowSection,
  EmotionalPause,
  FavoriteFaceSection,
  FloatingWallSection,
  MemoryLensSection,
  PhotoStackSection,
  PocketMemoriesSection,
  ScratchMemorySection,
} from './page-two/PhotoMoments'
import { PAUSES } from './page-two/data'
import './miss-me/miss-me.css'
import './page-two/page-two.css'

export default function StillForYou() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [])

  return (
    <div className="p2-root mm-root">
      <MusicPlayer />
      <HeartTrail active />
      <div className="p2-stage mm-stage mm-story">
        <AmbientBackground variant="story" />
        <FloatingHearts count={6} className="mm-hearts--story" />

        <HeroSection />
        <EmotionalPause lines={PAUSES[0].lines} />
        <PolaroidSection />
        <ScratchMemorySection />
        <MatchingDaySection />
        <EmotionalPause lines={PAUSES[1].lines} />
        <BeforeAfterSection />
        <HimAndHerSection />
        <CoverflowSection />
        <FilmReelSection />
        <FavoriteFaceSection />
        <EmotionalPause lines={PAUSES[2].lines} />
        <PhotoStackSection />
        <MemoryLensSection />
        <FloatingWallSection />
        <WhisperWallSection />
        <PocketMemoriesSection />
        <ForeverGridSection />
        <EmotionalPause lines={PAUSES[3].lines} />
        <ClosingSection />
      </div>
    </div>
  )
}
