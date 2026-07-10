import { useLayoutEffect } from 'react'
import AmbientBackground from './miss-me/AmbientBackground'
import FloatingHearts from './miss-me/FloatingHearts'
import HeartTrail from './miss-me/HeartTrail'
import MusicPlayer from './miss-me/MusicPlayer'
import {
  BreathSection,
  BorrowedLightSection,
  GravitySection,
  HeartDrawersSection,
  HeartSpeakSection,
  HeroSection,
  ImpactSection,
  LittleThingsSection,
  OrdinarySection,
  ProofSection,
  SecretsSection,
  SentencesSection,
  SoftInventorySection,
  SoftestYesSection,
} from './page-three/StorySections'
import {
  ConstellationSection,
  EchoSection,
  EndingSection,
  FinalLetterSection,
  FutureSection,
  HoldChooseSection,
  LettersSection,
  PeakMoment,
  VersionsSection,
} from './page-three/ClimaxSections'
import { SoftPause } from './page-three/shared'
import './miss-me/miss-me.css'
import './page-two/page-two.css'
import './page-three/page-three.css'

export default function ChoosingYou() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [])

  return (
    <div className="p3-root mm-root">
      <MusicPlayer />
      <HeartTrail active />
      <div className="p3-stage mm-stage mm-story">
        <AmbientBackground variant="story" />
        <FloatingHearts count={5} className="mm-hearts--story" />

        <HeroSection />
        <SoftPause lines={['Smile first.', 'This chapter is only love.']} />
        <SoftInventorySection />
        <OrdinarySection />
        <SoftPause lines={['Curiosity, then comfort.']} />
        <SecretsSection />
        <SentencesSection />
        <LittleThingsSection />
        <BorrowedLightSection />
        <ImpactSection />
        <SoftPause lines={['You quietly rewrote me.']} />
        <HeartDrawersSection />
        <HeartSpeakSection />
        <ConstellationSection />
        <VersionsSection />
        <EchoSection />
        <LettersSection />
        <SoftestYesSection />
        <FutureSection />
        <GravitySection />
        <ProofSection />
        <BreathSection />
        <SoftPause lines={['Nostalgia softens into gratitude.']} />
        <PeakMoment />
        <FinalLetterSection />
        <HoldChooseSection />
        <EndingSection />
      </div>
    </div>
  )
}
