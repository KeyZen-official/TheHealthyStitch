import {
  Leaf,
  Scale,
  Activity,
  Flame,
  HeartPulse,
  Heart,
  Flower2,
  Sparkles,
  Clock,
  UtensilsCrossed,
  ShieldCheck,
  Bone,
  HeartHandshake,
  Baby,
} from 'lucide-react'

const ICON_MAP = {
  Leaf,
  Scale,
  Activity,
  Flame,
  HeartPulse,
  Heart,
  Flower2,
  Sparkles,
  Clock,
  UtensilsCrossed,
  ShieldCheck,
  Bone,
  HeartHandshake,
  Baby,
}

export default function PlanEmblem({ icon, num, className = '' }) {
  const IconComponent = ICON_MAP[icon] || Leaf

  return (
    <div className={`plan-emblem ${className}`} aria-hidden="true">
      <div className="plan-emblem__backdrop">
        <svg className="plan-emblem__ring" viewBox="0 0 100 100" fill="none">
          {/* Subtle concentric editorial rings */}
          <circle
            cx="50"
            cy="50"
            r="44"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="3 3"
            strokeOpacity="0.45"
          />
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeOpacity="0.25"
          />
        </svg>
        <span className="plan-emblem__num">{num}</span>
      </div>
      <div className="plan-emblem__icon-wrap">
        <IconComponent className="plan-emblem__icon" strokeWidth={1.5} />
      </div>
    </div>
  )
}

