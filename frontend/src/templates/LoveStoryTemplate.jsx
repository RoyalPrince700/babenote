import FloatingHearts from '../components/FloatingHearts'
import Hero from '../components/Hero'
import OurStory from '../components/OurStory'
import Memories from '../components/Memories'
import OurBond from '../components/OurBond'
import LoveLetter from '../components/LoveLetter'
import Footer from '../components/Footer'
import TemplateShell from './TemplateShell'

export default function LoveStoryTemplate({ content, theme }) {
  return (
    <TemplateShell theme={theme} className="template-love-story">
      <FloatingHearts />
      <main>
        <Hero content={content.hero} herName={content.herName} />
        <OurStory content={content.ourStory} />
        <Memories memories={content.memories} />
        <OurBond content={content.bond} />
        <LoveLetter content={content.loveLetter} yourName={content.yourName} />
      </main>
      <Footer content={content.footer} herName={content.herName} />
    </TemplateShell>
  )
}
