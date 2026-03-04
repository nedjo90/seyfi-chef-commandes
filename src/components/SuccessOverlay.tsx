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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <FoodRain />
      <div className="relative z-10 w-full max-w-sm animate-success-pulse">
        <div className="recap-card rounded-2xl p-10 text-center">
          {/* Checkmark */}
          <div className="w-16 h-16 mx-auto mb-5 rounded-full border-2 border-champagne-500/40 flex items-center justify-center">
            <svg className="w-8 h-8 text-champagne-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <p className="text-[10px] text-champagne-500/60 uppercase tracking-[0.3em] mb-3">{title}</p>

          <h2 className="font-display text-3xl font-light text-ivory-100 mb-2">
            {guestName}
          </h2>
          <p className="text-onyx-400 text-sm mb-6">
            Commande enregistree
          </p>

          <div className="mb-6">
            <p className="font-display text-4xl font-light text-champagne-400 tabular-nums">
              {total.toFixed(2)} &euro;
            </p>
          </div>

          <div className="mb-8">
            <p className="font-arabic text-xl text-champagne-500/40 mb-1">
              {blessing.text}
            </p>
            <p className="text-onyx-500 text-[10px] tracking-wider">
              {blessing.lang} — {blessing.meaning}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-lg bg-champagne-500 text-onyx-900 font-semibold text-sm uppercase tracking-wider hover:bg-champagne-400 active:scale-[0.97] transition-all"
          >
            Nouvelle commande
          </button>
        </div>
      </div>
    </div>
  )
}
