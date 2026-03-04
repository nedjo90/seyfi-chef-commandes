import FlameIcon from './Lantern'

export default function Header() {
  return (
    <header className="relative overflow-hidden pt-6 pb-10 px-4 text-center">
      {/* Background — dark smoky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/90 via-charcoal-900/60 to-transparent" />

      {/* Subtle top fire glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(232,67,46,0.15) 0%, transparent 70%)',
        }}
      />

      {/* Flames */}
      <FlameIcon side="left" />
      <FlameIcon side="right" />

      {/* Content */}
      <div className="relative z-10 pt-6">
        {/* Crescent — ember glow style */}
        <div className="text-5xl mb-3" style={{ filter: 'drop-shadow(0 0 12px rgba(217,123,31,0.5))' }}>
          🌙
        </div>

        {/* Bismillah — subtle */}
        <p className="font-arabic text-xl text-copper-400/50 mb-3">
          بسم الله الرحمن الرحيم
        </p>

        {/* Restaurant name — BOLD steakhouse feel */}
        <h1 className="font-display text-4xl font-bold tracking-wider mb-1" style={{
          background: 'linear-gradient(135deg, #fdf0d5, #eeb06a, #d97b1f)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          filter: 'drop-shadow(0 2px 8px rgba(217,123,31,0.3))',
        }}>
          SEYFI CHEF
        </h1>
        <p className="text-copper-400/80 text-sm font-semibold uppercase tracking-[0.3em] mb-4">
          Steakhouse
        </p>

        {/* Ember divider */}
        <div className="flex items-center justify-center gap-4 my-4">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-ember-500/40" />
          <span className="text-ember-500 text-xs">🔥</span>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-ember-500/40" />
        </div>

        {/* Iftar badge */}
        <div className="inline-flex items-center gap-2 bg-ember-500/10 border border-ember-500/20 rounded-full px-5 py-2.5 mb-3">
          <span className="text-base">🇱🇺</span>
          <span className="text-sm text-cream-200 font-medium">
            Iftar Special — Leudelange
          </span>
        </div>

        {/* Restaurant info */}
        <p className="text-smoke-500 text-xs tracking-wider">
          19 Rue Jean Fischbach — Ramadan 2026
        </p>
        <p className="mt-1 text-smoke-600 text-xs">
          +352 27 52 13 83
        </p>
      </div>
    </header>
  )
}
