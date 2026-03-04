export default function FlameIcon({ side }: { side: 'left' | 'right' }) {
  const isLeft = side === 'left'
  return (
    <div
      className={`absolute top-2 ${isLeft ? 'left-5' : 'right-5'} flame`}
      style={{ animationDelay: isLeft ? '0s' : '0.8s' }}
    >
      <svg width="24" height="40" viewBox="0 0 24 40" fill="none">
        <defs>
          <linearGradient id={`flameGrad_${side}`} x1="12" y1="40" x2="12" y2="0">
            <stop offset="0%" stopColor="#e8432e" />
            <stop offset="40%" stopColor="#d97b1f" />
            <stop offset="80%" stopColor="#eeb06a" />
            <stop offset="100%" stopColor="#fdf0d5" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        <path
          d="M12 0 C12 0, 2 14, 2 22 C2 30, 6 36, 12 40 C18 36, 22 30, 22 22 C22 14, 12 0, 12 0 Z"
          fill={`url(#flameGrad_${side})`}
          opacity="0.7"
        />
        <ellipse cx="12" cy="28" rx="4" ry="6" fill="#fdf0d5" opacity="0.4" />
      </svg>
    </div>
  )
}
