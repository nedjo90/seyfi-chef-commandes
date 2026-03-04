export default function Header() {
  return (
    <header className="relative pt-12 pb-10 px-6 text-center">
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(212,168,67,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10">
        {/* Crescent — small, elegant */}
        <div className="text-3xl mb-4 opacity-40">☽</div>

        {/* Bismillah — very subtle */}
        <p className="font-arabic text-base text-champagne-500/30 mb-6">
          بسم الله الرحمن الرحيم
        </p>

        {/* Restaurant name — LARGE, elegant serif */}
        <h1 className="font-display text-5xl font-light tracking-[0.15em] text-ivory-100 mb-2 uppercase">
          Seyfi Chef
        </h1>

        {/* Thin gold line */}
        <div className="mx-auto w-24 line-gold my-5" />

        <p className="text-xs text-onyx-400 tracking-[0.4em] uppercase">
          Steakhouse &middot; Leudelange
        </p>

        <p className="mt-6 text-champagne-500/60 text-xs tracking-[0.2em] uppercase">
          Iftar &middot; Ramadan 2026
        </p>
      </div>
    </header>
  )
}
