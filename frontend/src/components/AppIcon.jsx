import {
  Brain,
  ChevronDown,
  Dumbbell,
  Flower2,
  Heart,
  HeartHandshake,
  Infinity,
  Laugh,
  Moon,
  Music,
  Rainbow,
  Smile,
  Sparkles,
} from 'lucide-react'

const iconMap = {
  sparkles: Sparkles,
  flower: Flower2,
  laugh: Laugh,
  moon: Moon,
  heart: Heart,
  heartHandshake: HeartHandshake,
  smile: Smile,
  brain: Brain,
  strength: Dumbbell,
  music: Music,
  rainbow: Rainbow,
  infinity: Infinity,
  chevronDown: ChevronDown,
}

export default function AppIcon({ name, size = 24, className = '', ...props }) {
  const Icon = iconMap[name] ?? Heart
  return <Icon size={size} className={`app-icon ${className}`.trim()} strokeWidth={1.75} {...props} />
}
