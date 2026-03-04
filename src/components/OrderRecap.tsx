import type { CartItem } from '../types/database'

interface Props {
  cartItems: CartItem[]
  total: number
}

export default function OrderRecap({ cartItems, total }: Props) {
  if (cartItems.length === 0) return null

  return (
    <div className="recap-card rounded-xl p-6 animate-fade-in">
      <h3 className="font-display text-lg font-light text-ivory-200 mb-4 tracking-wide">
        Votre selection
      </h3>
      <div className="space-y-3">
        {cartItems.map((ci) => {
          const key = `${ci.menuItem.id}__${ci.variantLabel ?? ''}`
          return (
            <div key={key} className="flex justify-between items-baseline text-sm">
              <span className="text-ivory-300 min-w-0">
                {ci.quantity > 1 && <span className="text-champagne-500 font-medium">{ci.quantity} &times; </span>}
                <span>{ci.menuItem.name}</span>
                {ci.variantLabel && <span className="text-onyx-500 text-xs ml-1">({ci.variantLabel})</span>}
              </span>
              <span className="text-champagne-400 font-light tabular-nums whitespace-nowrap ml-4">
                {(ci.unitPrice * ci.quantity).toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-champagne-500/10 flex justify-between items-baseline">
        <span className="font-display text-base text-ivory-200 tracking-wide">Total</span>
        <span className="font-display text-2xl font-light text-champagne-400 tabular-nums">{total.toFixed(2)} &euro;</span>
      </div>
    </div>
  )
}
