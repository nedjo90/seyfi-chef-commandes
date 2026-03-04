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
    <div
      className={`rounded-xl p-3 transition-all duration-200 border
        ${inCart
          ? 'bg-gold-500/20 border-gold-400 shadow-lg shadow-gold-500/10'
          : 'bg-night-800/50 border-night-700/50'
        }
        ${isFree ? 'opacity-60' : ''}
      `}
    >
      {/* Item info */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <span className={`text-sm leading-tight font-medium ${
            inCart ? 'text-gold-200' : 'text-night-200'
          }`}>
            {item.name}
          </span>
          {item.description && (
            <p className="text-xs text-night-500 mt-0.5 line-clamp-2">{item.description}</p>
          )}
        </div>
        {!hasVariants && (
          <span className={`text-sm font-semibold whitespace-nowrap ${
            inCart ? 'text-gold-400' : 'text-night-400'
          } ${isFree ? 'text-emerald-500' : ''}`}>
            {isFree ? 'Offert' : `${item.price.toFixed(2)} \u20AC`}
          </span>
        )}
      </div>

      {/* Variants (Petite/Grande, 2pers/4pers) */}
      {hasVariants ? (
        <div className="mt-2 space-y-1.5">
          {item.variants!.map((v) => (
            <VariantRow
              key={v.label}
              item={item}
              variantLabel={v.label}
              price={v.price}
              quantity={getCartQty(cartMap, item.id, v.label)}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
      ) : !isFree ? (
        <div className="mt-2 flex items-center justify-end gap-2">
          <QuantityControl
            quantity={getCartQty(cartMap, item.id, null)}
            onIncrement={() => onAdd(item, null, item.price)}
            onDecrement={() => onRemove(item, null)}
          />
        </div>
      ) : null}
    </div>
  )
}

function VariantRow({ item, variantLabel, price, quantity, onAdd, onRemove }: {
  item: MenuItem
  variantLabel: string
  price: number
  quantity: number
  onAdd: (item: MenuItem, variantLabel: string | null, price: number) => void
  onRemove: (item: MenuItem, variantLabel: string | null) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 pl-2 py-1 rounded-lg bg-night-800/30">
      <span className="text-xs text-night-300">{variantLabel}</span>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold ${quantity > 0 ? 'text-gold-400' : 'text-night-400'}`}>
          {price.toFixed(2)} {'\u20AC'}
        </span>
        <QuantityControl
          quantity={quantity}
          onIncrement={() => onAdd(item, variantLabel, price)}
          onDecrement={() => onRemove(item, variantLabel)}
        />
      </div>
    </div>
  )
}

function QuantityControl({ quantity, onIncrement, onDecrement }: {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {quantity > 0 && (
        <>
          <button
            onClick={onDecrement}
            className="w-7 h-7 rounded-lg bg-night-700/80 text-gold-300 text-sm font-bold flex items-center justify-center hover:bg-night-600 active:scale-90 transition-all"
          >
            -
          </button>
          <span className="w-6 text-center text-sm font-bold text-gold-300">{quantity}</span>
        </>
      )}
      <button
        onClick={onIncrement}
        className="w-7 h-7 rounded-lg bg-gold-500/20 text-gold-400 text-sm font-bold flex items-center justify-center hover:bg-gold-500/30 active:scale-90 transition-all"
      >
        +
      </button>
    </div>
  )
}
