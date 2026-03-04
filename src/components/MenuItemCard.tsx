import type { MenuItem, CartItem } from '../types/database'

interface Props {
  item: MenuItem
  cartMap: Map<string, CartItem>
  onAdd: (item: MenuItem, variantLabel: string | null, price: number) => void
  onRemove: (item: MenuItem, variantLabel: string | null) => void
}

function getCartQty(cartMap: Map<string, CartItem>, itemId: number, variantLabel: string | null): number {
  const key = `${itemId}__${variantLabel ?? ''}`
  return cartMap.get(key)?.quantity ?? 0
}

function hasAnyInCart(cartMap: Map<string, CartItem>, itemId: number): boolean {
  for (const [key, ci] of cartMap) {
    if (key.startsWith(`${itemId}__`) && ci.quantity > 0) return true
  }
  return false
}

export default function MenuItemCard({ item, cartMap, onAdd, onRemove }: Props) {
  const hasVariants = item.variants && item.variants.length > 0
  const isFree = !hasVariants && item.price === 0
  const inCart = hasAnyInCart(cartMap, item.id)

  return (
    <div className={`menu-item-card rounded-lg px-4 py-3 ${inCart ? 'bg-champagne-500/5 border-l-2 border-l-champagne-500' : 'border-l-2 border-l-transparent'}`}>
      {/* Main row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${inCart ? 'text-ivory-100 font-medium' : 'text-ivory-300'}`}>
              {item.name}
            </span>
            {item.allergens > 0 && (
              <span className="text-[9px] text-onyx-500 border border-onyx-700 rounded px-1">
                {item.allergens}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-xs text-onyx-500 mt-1 leading-relaxed line-clamp-2 italic">{item.description}</p>
          )}
        </div>

        {/* Price + controls for non-variant items */}
        {!hasVariants && (
          <div className="flex items-center gap-3 shrink-0">
            {!isFree && (
              <span className={`text-sm font-light tabular-nums ${inCart ? 'text-champagne-400' : 'text-onyx-400'}`}>
                {item.price.toFixed(2)}
              </span>
            )}
            {isFree ? (
              <span className="text-[10px] text-onyx-500 uppercase tracking-wider">offert</span>
            ) : (
              <QuantityControl
                quantity={getCartQty(cartMap, item.id, null)}
                onIncrement={() => onAdd(item, null, item.price)}
                onDecrement={() => onRemove(item, null)}
              />
            )}
          </div>
        )}
      </div>

      {/* Variants */}
      {hasVariants && (
        <div className="mt-3 space-y-2 pl-2">
          {item.variants!.map((v) => {
            const qty = getCartQty(cartMap, item.id, v.label)
            return (
              <div key={v.label} className="flex items-center justify-between gap-3">
                <span className={`text-xs ${qty > 0 ? 'text-ivory-300' : 'text-onyx-500'}`}>
                  {v.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className={`text-xs tabular-nums ${qty > 0 ? 'text-champagne-400' : 'text-onyx-500'}`}>
                    {v.price.toFixed(2)}
                  </span>
                  <QuantityControl
                    quantity={qty}
                    onIncrement={() => onAdd(item, v.label, v.price)}
                    onDecrement={() => onRemove(item, v.label)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function QuantityControl({ quantity, onIncrement, onDecrement }: {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}) {
  if (quantity === 0) {
    return (
      <button
        onClick={onIncrement}
        className="w-7 h-7 rounded-full border border-onyx-600 text-onyx-400 text-xs flex items-center justify-center hover:border-champagne-500 hover:text-champagne-400 transition-colors"
      >
        +
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrement}
        className="w-6 h-6 rounded-full border border-onyx-600 text-onyx-400 text-xs flex items-center justify-center hover:border-wine-500 hover:text-wine-400 transition-colors"
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-medium text-champagne-400 tabular-nums">{quantity}</span>
      <button
        onClick={onIncrement}
        className="w-6 h-6 rounded-full border border-onyx-600 text-onyx-400 text-xs flex items-center justify-center hover:border-champagne-500 hover:text-champagne-400 transition-colors"
      >
        +
      </button>
    </div>
  )
}
