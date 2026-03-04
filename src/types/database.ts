export interface MenuItemVariant {
  label: string
  price: number
}

export interface MenuItem {
  id: number
  category: string
  name: string
  description: string | null
  price: number
  variants: MenuItemVariant[] | null
  allergens: number
  sort_order: number
}

export interface Order {
  id: number
  guest_name: string
  phone: string | null
  remarks: string | null
  total: number
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  menu_item_id: number
  variant_label: string | null
  quantity: number
  unit_price: number
}

export interface OrderWithItems extends Order {
  items: (OrderItem & { menu_item?: MenuItem })[]
}

export interface CartItem {
  menuItem: MenuItem
  variantLabel: string | null
  unitPrice: number
  quantity: number
}
