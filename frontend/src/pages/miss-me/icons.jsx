import {
  Beef,
  Clapperboard,
  Coffee,
  HandHeart,
  Heart,
  IceCreamCone,
  Laugh,
  Lightbulb,
  Plane,
  Smile,
  Sparkles,
  Star,
  Sunrise,
} from 'lucide-react'

/** Simple sausage mark — Lucide has no hotdog icon. */
export function SausageIcon({ size = 24, className = '', ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path
        d="M5.5 14.5c-1.8-1.8-1.6-5 .5-6.9 2-1.9 5-2.1 6.8-.4l6.1 6.1c1.8 1.8 1.6 5-.5 6.9-2 1.9-5 2.1-6.8.4L5.5 14.5Z"
        fill="currentColor"
        opacity="0.92"
      />
      <path
        d="M9 9.2c.7-.6 1.6-.9 2.4-.8M12.2 12.4c.7-.6 1.6-.9 2.4-.8M15.4 15.6c.7-.6 1.6-.9 2.4-.8"
        stroke="#2a1520"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />
    </svg>
  )
}

const MAP = {
  heart: Heart,
  sparkles: Sparkles,
  star: Star,
  smile: Smile,
  lightbulb: Lightbulb,
  sausage: SausageIcon,
  beef: Beef,
  sunrise: Sunrise,
  plane: Plane,
  clapperboard: Clapperboard,
  icecream: IceCreamCone,
  coffee: Coffee,
  handheart: HandHeart,
  laugh: Laugh,
}

export default function MmIcon({
  name = 'heart',
  size = 20,
  className = '',
  filled = false,
  strokeWidth = 1.75,
  ...props
}) {
  const Icon = MAP[name] ?? Heart
  return (
    <Icon
      size={size}
      className={`mm-icon ${className}`.trim()}
      strokeWidth={strokeWidth}
      fill={filled ? 'currentColor' : 'none'}
      {...props}
    />
  )
}
