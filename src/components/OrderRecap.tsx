import type { CartItem } from '../types/database'

interface Props {
  cartItems: CartItem[]
  total: number
}

export default function OrderRecap({ cartItems, total }: Props) {
  if (cartItems.length === 0) return null

  return (
    <div className="recap-card rounded-xl border border-gold-500/20 p-4 animate-fade-in-scale">
      <h3 className="text-sm font-semibold text-gold-400 mb-3 flex items-center gap-2">
        <span>🧾</span> Votre panier
      </h3>
      <div className="space-y-2">
        {cartItems.map((ci) => {
          const key = `${ci.menuItem.id}__${ci.variantLabel ?? ''}`
          return (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-night-200 flex items-center gap-2 min-w-0">
                <span className="truncate max-w-[220px]">
                  {ci.quantity > 1 && <span className="text-gold-400 font-bold">{ci.quantity}x </span>}
                  {ci.menuItem.name}
                  {ci.variantLabel && <span className="text-night-400"> ({ci.variantLabel})</span>}
                </span>
              </span>
              <span className="text-gold-400 font-medium whitespace-nowrap ml-2">
                {(ci.unitPrice * ci.quantity).toFixed(2)} {'\u20AC'}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-gold-500/15 flex justify-between items-center">
        <span className="text-gold-300 font-semibold text-sm">Total</span>
        <span className="text-xl font-bold text-gold-300">{total.toFixed(2)} {'\u20AC'}</span>
      </div>
    </div>
  )
}
