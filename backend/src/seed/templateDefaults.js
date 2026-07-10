export const templateDefaults = {
  'love-story': {
    herName: 'My Babe',
    yourName: 'Your Name',
    hero: {
      title: 'Every moment with you',
      subtitle: 'is a memory I never want to forget',
      tagline: 'This little corner of the internet exists because of you — and only you.',
    },
    ourStory: {
      title: 'Our Story',
      paragraphs: [
        'It started like something out of a dream — a conversation, a laugh, a look that said more than words ever could.',
        'We have walked through sunny days and rainy nights together. Every chapter of us feels like the best one yet.',
        'This is not just a website. It is a love letter — one I will keep writing, one memory at a time.',
      ],
    },
    memories: [
      { date: 'The Beginning', title: 'When We First Met', description: 'That day changed everything.', icon: 'sparkles' },
      { date: 'First Date', title: 'Nervous Hearts, Perfect Night', description: 'Every second felt like it was meant to be.', icon: 'flower' },
      { date: 'Every Day', title: 'Choosing You Again', description: 'Not just once — but every single day.', icon: 'heart' },
    ],
    bond: {
      title: 'Why I Love You',
      subtitle: 'A thousand reasons, but here are just a few...',
      reasons: [
        { icon: 'sparkles', text: 'The way you make ordinary moments feel extraordinary' },
        { icon: 'heartHandshake', text: 'Your warmth — like coming home every time I see you' },
        { icon: 'smile', text: 'That smile that can turn my worst day around' },
        { icon: 'infinity', text: 'Because with you, forever does not feel long enough' },
      ],
    },
    loveLetter: {
      title: 'A Letter For You',
      greeting: 'My dearest love,',
      body: [
        'If I could gather every star in the sky, I would write your name across them all.',
        'You are my favorite person, my safe place, my greatest adventure.',
        'I built this for you — because some feelings are too big for texts.',
      ],
      closing: 'Forever yours,',
      signature: 'With all my love',
    },
    footer: {
      message: 'Made with love, just for you',
      quote: '"In all the world, there is no heart for me like yours."',
    },
  },

  'love-letter': {
    herName: 'My Babe',
    yourName: 'Your Name',
    title: 'A Letter From My Heart',
    greeting: 'My dearest,',
    body: [
      'There are days when I try to find the right words for how I feel about you — and every time, I come up short. Not because my love is small, but because it is too vast for language.',
      'You are the calm in my chaos, the light in my darkest hours, and the reason I believe in beautiful things. Every version of my future has you in it.',
      'Thank you for loving me the way you do — patiently, deeply, and without conditions. I hope this letter reminds you of what you mean to me, today and always.',
    ],
    closing: 'Always and forever,',
    signature: 'Yours completely',
  },

  'love-message': {
    herName: 'My Babe',
    yourName: 'Your Name',
    headline: 'Just Because You Are You',
    message:
      'I was thinking about you and realized — you are the best part of my every day. Your laugh, your kindness, the way you care... I am so lucky to have you.',
    subtext: 'Never forget how deeply you are loved.',
  },

  'marriage-proposal': {
    herName: 'My Babe',
    yourName: 'Your Name',
    question: 'Will you marry me?',
    message:
      'From the moment you walked into my life, everything changed. You are my best friend, my greatest love, and the person I want beside me for every sunrise and every storm.',
    highlights: [
      'Every adventure is better with you',
      'You make me want to be the best version of myself',
      'I cannot imagine my life without you in it',
    ],
    closingLine: 'Say yes, and let us write forever together.',
  },

  'i-miss-you': {
    herName: 'My Babe',
    yourName: 'Your Name',
    headline: 'I Miss You',
    message:
      'Distance means nothing when someone means everything. Even when we are apart, you are always on my mind — in every song, every quiet moment, every beat of my heart.',
    thingsIMiss: [
      'Your voice when you say my name',
      'The way you laugh at my silly jokes',
      'Falling asleep knowing you are near',
      'The feeling of your hand in mine',
    ],
    closing: 'Counting the moments until I see you again.',
  },
}

export const templateCatalog = [
  {
    category: 'love-story',
    nameBase: 'Our Love Story',
    description: 'A full love website with memories, bond, and a love letter.',
    previewAccent: '#e8a0b4',
  },
  {
    category: 'love-letter',
    nameBase: 'Love Letter',
    description: 'A beautiful handwritten-style letter for your special someone.',
    previewAccent: '#c45c7a',
  },
  {
    category: 'love-message',
    nameBase: 'Love Message',
    description: 'A short, sweet message to brighten their day.',
    previewAccent: '#d4a574',
  },
  {
    category: 'marriage-proposal',
    nameBase: 'Marriage Proposal',
    description: 'Pop the question with a stunning proposal page.',
    previewAccent: '#b76e79',
  },
  {
    category: 'i-miss-you',
    nameBase: 'I Miss You',
    description: 'Tell them how much you miss them when you are apart.',
    previewAccent: '#9b8aa5',
  },
]
