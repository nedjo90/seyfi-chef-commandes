import type { MenuItem, CartItem } from '../types/database'
import { categoryLabels, categoryIcons } from '../lib/menu'
import MenuItemCard from './MenuItemCard'

interface Props {
  category: string
  items: MenuItem[]
  cartItems: Map<string, CartItem>
  onAdd: (item: MenuItem, variantLabel: string | null, price: number) => void
  onRemove: (item: MenuItem, variantLabel: string | null) => void
}

export default function CategorySection({
  category,
  items,
  cartItems,
  onAdd,
  onRemove,
}: Props) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4 px-1">
        <span className="text-2xl">{categoryIcons[category]}</span>
        <h2 className="font-display text-lg font-semibold text-cream-200 tracking-wide">
          {categoryLabels[category]}
        </h2>
        <div className="flex-1 hot-divider" />
      </div>
      <div className="space-y-2.5">
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
    </section>
  )
}
