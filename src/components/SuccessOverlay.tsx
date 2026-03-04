import FoodRain from './FoodRain'
import { getFunTitle, getRandomBlessing } from '../lib/fun'
import { useMemo } from 'react'

interface Props {
  guestName: string
  total: number
  itemNames: string[]
  onClose: () => void
}

export default function SuccessOverlay({ guestName, total, itemNames, onClose }: Props) {
  const title = useMemo(() => getFunTitle(itemNames, total), [itemNames, total])
  const blessing = useMemo(() => getRandomBlessing(), [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      {/* Food Rain */}
      <FoodRain />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm animate-success-pulse">
        <div className="smoke-card rounded-2xl p-8 text-center">
          <div className="text-6xl mb-3">🔥</div>

          <div className="inline-block bg-gradient-to-r from-ember-600 to-copper-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            {title}
          </div>

          <h2 className="font-display text-2xl font-bold text-cream-200 mb-1">
            {guestName}
          </h2>
          <p className="text-smoke-400 text-sm mb-4">
            Ta commande est enregistree !
          </p>

          <div className="bg-charcoal-900/60 rounded-xl p-4 mb-5 border border-ember-500/10">
            <p className="text-3xl font-bold text-success-400">
              {total.toFixed(2)} {'\u20AC'}
            </p>
          </div>

          <div className="mb-5">
            <p className="font-arabic text-2xl text-copper-400 mb-1">
              {blessing.text}
            </p>
            <p className="text-smoke-500 text-xs">
              {blessing.lang} — {blessing.meaning}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-ember-600 to-ember-500 text-white font-semibold hover:from-ember-500 hover:to-ember-400 active:scale-[0.97] transition-all text-base shadow-lg shadow-ember-500/20"
          >
            🌙 Nouvelle commande
          </button>
        </div>
      </div>
    </div>
  )
}
