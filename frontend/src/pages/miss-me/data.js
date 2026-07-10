import babePhoto from '../../assets/babe.jpeg'
import babePhoto2 from '../../assets/babe2.jpeg'
import usPhoto from '../../assets/me and babe.jpeg'
import usPhoto2 from '../../assets/me and babe 2.jpeg'
import usPhoto3 from '../../assets/me and babe 3.jpeg'
import usPhoto4 from '../../assets/me and babe 4.jpeg'

export const INTRO_LINES = [
  { type: 'heart', duration: 1.8 },
  { type: 'text', text: 'I built something...', duration: 2.4 },
  { type: 'text', text: "Because words weren't enough.", duration: 2.6 },
  { type: 'text', text: 'So I made this for you.', duration: 2.6 },
]

export const LOVE_NOTES = [
  'Thinking about you',
  'I adore you',
  'My favorite person',
  'Forever us',
  'Still smiling because of you',
  'You make everything softer',
  'Miss your laugh',
  'Always choosing you',
]

export const ENDING_LINES = [
  'The truth is...',
  'No picture...',
  'No paragraph...',
  'No website...',
  'Can fully explain...',
  'How much I miss you.',
  'I love you.',
]

export const CHAPTERS = [
  {
    id: 'open',
    kind: 'hero',
    emoji: '❤️',
    label: 'Today',
    title: 'I knew it.',
    subtitle: 'Scroll slowly — every photo has something I needed to say.',
  },
  {
    id: 'bridge-1',
    kind: 'bridge',
    lines: ['If I could pause one moment...', 'It would be this one.'],
  },
  {
    id: 'us',
    kind: 'memory',
    emoji: '📸',
    label: 'Our favorite photo',
    title: 'This is us',
    photo: usPhoto,
    photoAlt: 'Us together',
    frame: 'wide',
    caption: 'This is what I reach for in my mind when I miss you.',
    emphasis: ['I miss you'],
    body: [
      'The truth is, I miss you every single second we are apart.',
      'When you are not here, the world feels a little quieter — like someone turned down the brightness on everything beautiful.',
    ],
  },
  {
    id: 'bridge-2',
    kind: 'bridge',
    lines: ["I didn't know someone could become my home...", 'Until I met you.'],
  },
  {
    id: 'her',
    kind: 'memory',
    emoji: '🥹',
    label: 'The moment I realized',
    title: 'Little things that remind me of you',
    photo: babePhoto,
    photoAlt: 'You',
    frame: 'portrait',
    caption: 'Your face. Your energy. The reason my day feels incomplete without you.',
    lead: 'I look at this face and suddenly every small thing becomes you again.',
    items: [
      'Songs that feel like they were written about us',
      'Random moments that make me wish you were right here',
      'Your laugh echoing in my head at the worst times',
      'The way my phone lighting up still gives me butterflies',
      'Every plan I make — always hoping you are in it',
    ],
  },
  {
    id: 'bridge-3',
    kind: 'bridge',
    lines: ['You listen. You care. You show up.', 'Not because you have to — because that is who you are.'],
  },
  {
    id: 'ordinary',
    kind: 'memory',
    emoji: '😂',
    label: 'The funniest memory',
    title: 'Ordinary days, extraordinary you',
    photo: usPhoto2,
    photoAlt: 'A moment with you',
    frame: 'wide',
    caption: 'Ordinary days with you somehow become the ones I never want to forget.',
    emphasis: ['my favorite person'],
    body: [
      'You make ordinary days feel like something worth remembering.',
      'With you, I never have to pretend. Soft, silly, serious — you love me through all of it.',
    ],
  },
  {
    id: 'choose',
    kind: 'memory',
    emoji: '💖',
    label: 'Forever chosen',
    title: 'Why you are my favorite person',
    photo: usPhoto3,
    photoAlt: 'Us being ourselves',
    frame: 'wide',
    caption: 'If I could choose anyone — it would always, always be you.',
    emphasis: ['I choose you'],
    body: [
      'That kind of love is rare, and I never take it for granted.',
      'You are my favorite person. In every room. On every day. In every version of the future.',
    ],
  },
  {
    id: 'bridge-4',
    kind: 'bridge',
    lines: ['However far apart we are...', 'You are still the softest place my heart knows.'],
  },
  {
    id: 'face',
    kind: 'memory',
    emoji: '❤️',
    label: 'The day we met — and every day after',
    title: 'This face. This love.',
    photo: babePhoto2,
    photoAlt: 'My favorite person',
    frame: 'portrait',
    caption: 'This is the face I choose, over and over again.',
    emphasis: ['forever chosen'],
    body: [
      'Never forget this: you are deeply loved, endlessly missed, and forever chosen.',
    ],
  },
  {
    id: 'together',
    kind: 'memory',
    emoji: '📸',
    label: 'Us, always',
    title: 'Come back to me soon',
    photo: usPhoto4,
    photoAlt: 'Us',
    frame: 'wide',
    caption: 'I am already waiting in every memory of us.',
    body: [
      'Missing you is not a bad feeling — it is proof of how much you mean to me.',
    ],
  },
]
