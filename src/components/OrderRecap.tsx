import type { CartItem } from '../types/database'

interface Props {
  cartItems: CartItem[]
  total: number
}

export default function OrderRecap({ cartItems, total }: Props) {
  if (cartItems.length === 0) return null

  return (
    <div className="smoke-card rounded-2xl p-5 animate-fade-in-scale">
      <h3 className="text-sm font-bold text-copper-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
        <span>🔥</span> Votre panier
      </h3>
      <div className="space-y-2.5">
        {cartItems.map((ci) => {
          const key = `${ci.menuItem.id}__${ci.variantLabel ?? ''}`
          return (
            <div key={key} className="flex justify-between items-center text-sm">
              <span className="text-smoke-200 flex items-center gap-2 min-w-0">
                <span className="truncate max-w-[220px]">
                  {ci.quantity > 1 && <span className="text-ember-400 font-bold">{ci.quantity}x </span>}
                  {ci.menuItem.name}
                  {ci.variantLabel && <span className="text-smoke-500"> ({ci.variantLabel})</span>}
                </span>
              </span>
              <span className="text-copper-400 font-medium whitespace-nowrap ml-2">
                {(ci.unitPrice * ci.quantity).toFixed(2)} {'\u20AC'}
              </span>
            </div>
          )
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-ember-500/15 flex justify-between items-center">
        <span className="text-cream-300 font-bold text-sm uppercase tracking-wider">Total</span>
        <span className="text-2xl font-bold text-copper-300">{total.toFixed(2)} {'\u20AC'}</span>
      </div>
    </div>
  )
}
