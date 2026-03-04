import { useMemo } from 'react'

export default function EmberBackground() {
  const embers = useMemo(() => {
    return Array.from({ length: 35 }, (_, i) => {
      const isLarge = Math.random() > 0.7
      return {
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: isLarge ? Math.random() * 4 + 3 : Math.random() * 2.5 + 1,
        dur: Math.random() * 4 + 3,
        maxOp: isLarge ? Math.random() * 0.4 + 0.5 : Math.random() * 0.3 + 0.2,
        delay: Math.random() * 4,
        drift: -(Math.random() * 40 + 15),
        // Ember colors: orange, red, warm yellow
        color: ['#e8432e', '#d97b1f', '#f86f5e', '#eeb06a', '#c92d1a'][Math.floor(Math.random() * 5)],
      }
    })
  }, [])

  return (
    <>
      <div className="ember-bg" />
      <div className="grill-glow" />
      <div className="fixed inset-0 z-0 pointer-events-none">
        {embers.map((e) => (
          <div
            key={e.id}
            className="ember-particle"
            style={{
              left: `${e.left}%`,
              top: `${e.top}%`,
              width: `${e.size}px`,
              height: `${e.size}px`,
              background: `radial-gradient(circle, ${e.color} 0%, transparent 70%)`,
              boxShadow: `0 0 ${e.size * 2}px ${e.color}40`,
              '--dur': `${e.dur}s`,
              '--max-op': e.maxOp,
              '--drift': `${e.drift}px`,
              animationDelay: `${e.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  )
}
