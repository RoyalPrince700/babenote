import babe4 from '../../assets/new/babe4.jpeg'
import babe5 from '../../assets/new/babe5.jpeg'
import babe6 from '../../assets/new/babe6.jpeg'
import be7 from '../../assets/new/be7.jpeg'
import me from '../../assets/new/me.jpeg'
import me1 from '../../assets/new/me1.jpeg'
import me2 from '../../assets/new/me2.jpeg'
import me3 from '../../assets/new/me3.jpeg'
import me4 from '../../assets/new/me4.jpeg'
import me5 from '../../assets/new/me5.jpeg'
import us from '../../assets/new/us.jpeg'
import us1 from '../../assets/new/us1.jpeg'
import us2 from '../../assets/new/us2.jpeg'
import us3 from '../../assets/new/us3.jpeg'
import babePhoto from '../../assets/babe.jpeg'
import babePhoto2 from '../../assets/babe2.jpeg'
import usPhoto from '../../assets/me and babe.jpeg'
import usPhoto2 from '../../assets/me and babe 2.jpeg'
import usPhoto3 from '../../assets/me and babe 3.jpeg'
import usPhoto4 from '../../assets/me and babe 4.jpeg'

export const POLAROIDS = [
  {
    id: 'p1',
    photo: babe4,
    front: 'This smile.',
    back: 'I keep this one close when the day feels long, Mama.',
    tilt: -6,
  },
  {
    id: 'p2',
    photo: babe5,
    front: 'Soft light.',
    back: 'You make ordinary places feel like home, Snuggles.',
    tilt: 4,
  },
  {
    id: 'p3',
    photo: babe6,
    front: 'My favorite view.',
    back: 'Still the prettiest thing my eyes know how to find.',
    tilt: -3,
  },
  {
    id: 'p4',
    photo: be7,
    front: 'You.',
    back: 'No filter needed. Just you being you, Sausie.',
    tilt: 7,
  },
]

export const MATCHING_DAY = {
  photo: us,
  title: 'That matching day',
  hint: 'Press & hold to remember',
  secret: 'Same color. Same smile. I miss being your pair, Mama.',
  notes: [
    { x: 28, y: 22, text: 'Your soft smile' },
    { x: 68, y: 30, text: 'My arm around you' },
    { x: 48, y: 78, text: 'Us, matching forever' },
  ],
  lines: [
    'Same color. Same smile.',
    'Standing next to you felt like the whole room got warmer.',
    'I miss being your pair, Mama.',
  ],
}

export const HIM_PHOTOS = [me, me1, me2, me3, me4, me5]
export const HER_PHOTOS = [babe4, babe5, babe6, be7, babePhoto]

export const BEFORE_AFTER = {
  left: usPhoto,
  right: us,
  messages: [
    { at: 15, text: 'Still my favorite people.' },
    { at: 40, text: 'Still my favorite smile.' },
    { at: 65, text: 'Still choosing you.' },
    { at: 88, text: 'Still us, Snuggles.' },
  ],
}

export const FILM_FRAMES = [
  { id: 'f1', photo: us, caption: 'Us, dressed like forever' },
  { id: 'f2', photo: us1, caption: 'A quiet little forever' },
  { id: 'f3', photo: us2, caption: 'Your hand. My heart.' },
  { id: 'f4', photo: us3, caption: 'Still choosing this' },
  { id: 'f5', photo: usPhoto, caption: 'Where I want to be' },
  { id: 'f6', photo: usPhoto2, caption: 'Ordinary magic' },
  { id: 'f7', photo: usPhoto4, caption: 'Home is a person' },
]

export const WHISPERS = [
  { id: 'w1', photo: babe4, text: 'I miss your gentleness.' },
  { id: 'w2', photo: us1, text: 'Come closer in my dreams tonight.' },
  { id: 'w3', photo: me2, text: 'Thinking of you from here.' },
  { id: 'w4', photo: babe6, text: 'You are still my soft place.' },
  { id: 'w5', photo: us3, text: 'Distance never changed the feeling.' },
  { id: 'w6', photo: be7, text: 'My Sausie. Always.' },
]

export const POCKET_MEMORIES = [
  { photo: babe4, story: 'This smile belongs to my Mama.' },
  { photo: us2, story: 'My Snuggles, you have no idea how much I miss moments like this.' },
  { photo: me1, story: 'Even far away, I dress like someone who belongs to you.' },
  { photo: us1, story: 'My Sausie, thank you for making ordinary days unforgettable.' },
  { photo: babe6, story: "I've looked at this photo more times than I can count." },
  { photo: us3, story: 'If memories had a home… it would look like this.' },
]

export const POCKET_NOTES = [
  'I love how you love.',
  'Your softness is one of a kind.',
  'Thank you for taking care of me.',
  'I miss crying and smiling with you.',
  'You are one of the best things that happened to me.',
  'I love love love you, Mama.',
]

export const FOREVER_GRID = [
  { photo: us, span: 'wide', caption: 'Matching hearts' },
  { photo: babe4, span: 'tall', caption: 'My Mama' },
  { photo: me, span: 'normal', caption: 'Thinking of you' },
  { photo: us2, span: 'normal', caption: 'Closer' },
  { photo: babe5, span: 'normal', caption: 'Soft light' },
  { photo: me3, span: 'tall', caption: 'Always yours' },
  { photo: us1, span: 'wide', caption: 'Us again' },
  { photo: be7, span: 'normal', caption: 'Sausie' },
]

export const COVERFLOW = [
  { photo: babe4, caption: 'This smile.' },
  { photo: us, caption: 'That matching day.' },
  { photo: babe5, caption: 'Soft as always.' },
  { photo: us1, caption: 'Quiet forever.' },
  { photo: babe6, caption: 'My favorite view.' },
  { photo: usPhoto3, caption: 'Where I want to be.' },
  { photo: be7, caption: 'Just you.' },
]

export const PHOTO_STACK = [
  { photo: us, note: 'I wish I could step back into this day.' },
  { photo: babe4, note: "You'll never know how happy this picture makes me." },
  { photo: us2, note: 'My Snuggles in every frame.' },
  { photo: me2, note: 'Missing you from here.' },
  { photo: us1, note: 'Still my favorite people.' },
  { photo: babePhoto2, note: 'My peace. My home.' },
]

export const LENS_SPOTS = [
  { x: 32, y: 28, memory: 'This smile belongs to my Mama.' },
  { x: 68, y: 42, memory: 'The way you stand — soft confidence.' },
  { x: 48, y: 72, memory: 'I miss being right there with you.' },
]

export const LENS_PHOTO = babe4

export const SCRATCH_PHOTO = us1
export const SCRATCH_MESSAGE = 'Found you again, Snuggles.'

export const FAVORITE_FACE = {
  photo: babe5,
  compliments: [
    'My beautiful Mama',
    'My Snuggles',
    'My Sausie',
    'My peace',
    'My safe place',
    "They don't make smiles like yours",
    'My soft place',
    'My forever',
  ],
}

export const FLOATING_WALL = [
  { photo: babe4, x: 12, y: 18, rot: -8, z: 1, caption: 'Blue day glow' },
  { photo: us, x: 58, y: 10, rot: 5, z: 2, caption: 'Matching forever' },
  { photo: me1, x: 78, y: 48, rot: -4, z: 1, caption: 'Thinking of you' },
  { photo: us2, x: 28, y: 52, rot: 7, z: 3, caption: 'Closer still' },
  { photo: be7, x: 8, y: 62, rot: -2, z: 2, caption: 'Just you' },
  { photo: us3, x: 62, y: 68, rot: 3, z: 1, caption: 'Us again' },
]

export const PAUSES = [
  { id: 'p1', lines: ['I wish I could step back into this day.'] },
  { id: 'p2', lines: ["I've looked at this photo more times than I can count."] },
  {
    id: 'p3',
    lines: ['If memories had a home…', '…it would be here.'],
  },
  {
    id: 'p4',
    lines: ['My Sausie,', 'thank you for making ordinary days unforgettable.'],
  },
]

export const CLOSING_LINES = [
  'Chapter two ends here…',
  'But my heart is not done speaking.',
  'There is one more chapter…',
  'The one where I put my heart into a website.',
  'For you, Mama.',
  'For you, Snuggles.',
  'For you, Sausie.',
]
