import { useState } from 'react'
import type { MenuItem, CartItem } from '../types/database'
import { categoryLabels } from '../lib/menu'
import MenuItemCard from './MenuItemCard'

interface Props {
  category: string
  items: MenuItem[]
  cartItems: Map<string, CartItem>
  onAdd: (item: MenuItem, variantLabel: string | null, price: number) => void
  onRemove: (item: MenuItem, variantLabel: string | null) => void
}

function getCategoryItemCount(cartItems: Map<string, CartItem>, items: MenuItem[]): number {
  let count = 0
  const ids = new Set(items.map((i) => i.id))
  for (const [, ci] of cartItems) {
    if (ids.has(ci.menuItem.id) && ci.quantity > 0) count += ci.quantity
  }
  return count
}

export default function CategorySection({
  category,
  items,
  cartItems,
  onAdd,
  onRemove,
}: Props) {
  const [open, setOpen] = useState(false)
  const count = getCategoryItemCount(cartItems, items)

  return (
    <div className="border-b border-onyx-800/80">
      {/* Accordion header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 px-1 group"
      >
        <div className="flex items-center gap-4">
          <h2 className="font-display text-xl font-light text-ivory-200 tracking-wide group-hover:text-champagne-400 transition-colors">
            {categoryLabels[category]}
          </h2>
          {count > 0 && (
            <span className="bg-wine-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-onyx-500">{items.length} plats</span>
          <svg
            className={`w-4 h-4 text-onyx-500 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Accordion content */}
      <div
        className="accordion-content"
        data-open={open ? 'true' : 'false'}
      >
        <div className="pb-6 space-y-1">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              cartMap={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
