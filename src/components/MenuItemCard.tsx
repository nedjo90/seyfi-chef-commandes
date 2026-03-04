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
      className={`rounded-xl p-3.5 transition-all duration-300 border
        ${inCart
          ? 'bg-ember-500/10 border-ember-500/40 shadow-lg shadow-ember-500/5'
          : 'bg-charcoal-800/50 border-charcoal-700/30 hover:border-copper-500/20 hover:bg-charcoal-800/70'
        }
        ${isFree ? 'opacity-50' : ''}
      `}
    >
      {/* Item info */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div className="flex-1 min-w-0">
          <span className={`text-sm leading-tight font-medium ${
            inCart ? 'text-cream-200' : 'text-smoke-200'
          }`}>
            {item.name}
          </span>
          {item.description && (
            <p className="text-xs text-smoke-600 mt-0.5 line-clamp-2">{item.description}</p>
          )}
        </div>
        {!hasVariants && (
          <span className={`text-sm font-semibold whitespace-nowrap ${
            inCart ? 'text-copper-400' : 'text-smoke-500'
          } ${isFree ? 'text-success-500' : ''}`}>
            {isFree ? 'Offert' : `${item.price.toFixed(2)} \u20AC`}
          </span>
        )}
      </div>

      {/* Variants */}
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
    <div className={`flex items-center justify-between gap-2 pl-3 py-1.5 rounded-lg transition-all ${
      quantity > 0 ? 'bg-ember-500/8 border border-ember-500/15' : 'bg-charcoal-900/30'
    }`}>
      <span className="text-xs text-smoke-300">{variantLabel}</span>
      <div className="flex items-center gap-3">
        <span className={`text-xs font-semibold ${quantity > 0 ? 'text-copper-400' : 'text-smoke-500'}`}>
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
            className="w-7 h-7 rounded-lg bg-charcoal-700/80 text-cream-200 text-sm font-bold flex items-center justify-center hover:bg-charcoal-600 active:scale-90 transition-all"
          >
            -
          </button>
          <span className="w-6 text-center text-sm font-bold text-copper-300">{quantity}</span>
        </>
      )}
      <button
        onClick={onIncrement}
        className="w-7 h-7 rounded-lg bg-ember-500/20 text-ember-400 text-sm font-bold flex items-center justify-center hover:bg-ember-500/30 active:scale-90 transition-all"
      >
        +
      </button>
    </div>
  )
}
