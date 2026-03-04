import { supabase } from './supabase'
import type { MenuItem, Order, OrderItem } from '../types/database'

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('seyfi_menu_items')
    .select('*')
    .order('sort_order')
    .order('price')
  if (error) throw error
  return (data as MenuItem[]) ?? []
}

export async function fetchOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('seyfi_orders')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Order[]) ?? []
}

export async function fetchOrderItems(orderIds: number[]): Promise<OrderItem[]> {
  if (orderIds.length === 0) return []
  const { data, error } = await supabase
    .from('seyfi_order_items')
    .select('*')
    .in('order_id', orderIds)
  if (error) throw error
  return (data as OrderItem[]) ?? []
}

export async function createOrder(order: {
  guest_name: string
  phone: string | null
  remarks: string | null
  total: number
}): Promise<Order> {
  const { data, error } = await supabase
    .from('seyfi_orders')
    .insert(order as Record<string, unknown>)
    .select()
    .single()
  if (error) throw error
  return data as Order
}

export async function createOrderItems(items: {
  order_id: number
  menu_item_id: number
  variant_label: string | null
  quantity: number
  unit_price: number
}[]): Promise<void> {
  const { error } = await supabase
    .from('seyfi_order_items')
    .insert(items as Record<string, unknown>[])
  if (error) throw error
}

export async function deleteOrder(id: number): Promise<void> {
  // Delete order items first (cascade may handle this, but be safe)
  await supabase.from('seyfi_order_items').delete().eq('order_id', id)
  const { error } = await supabase.from('seyfi_orders').delete().eq('id', id)
  if (error) throw error
}

export function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, MenuItem[]>)
}

export const CATEGORY_ORDER = [
  'entrees',
  'salades',
  'menu_midi',
  'bowl_sandwich',
  'hamburgers',
  'hache_selection',
  'agneau',
  'steak_garnitures',
  'tranchee_selection',
  'specialites_partager',
  'menu_enfant',
  'desserts',
  'boissons_chaudes',
  'boissons_froides',
  'cocktails',
  'sauces',
] as const

export const categoryLabels: Record<string, string> = {
  entrees: 'Entrees',
  salades: 'Salades',
  menu_midi: 'Menu du Midi (12h-14h)',
  bowl_sandwich: 'Bowl & Sandwich (12h-14h)',
  hamburgers: 'Hamburgers',
  hache_selection: 'Hache Selection',
  agneau: 'Agneau',
  steak_garnitures: 'Steak et Garnitures',
  tranchee_selection: 'Tranchee Selection',
  specialites_partager: 'Specialites a partager',
  menu_enfant: 'Menu Enfant',
  desserts: 'Desserts',
  boissons_chaudes: 'Boissons Chaudes',
  boissons_froides: 'Boissons Froides',
  cocktails: 'Cocktails sans alcool',
  sauces: 'Sauces (Offertes)',
}

export const categoryIcons: Record<string, string> = {
  entrees: '🥗',
  salades: '🥬',
  menu_midi: '🍝',
  bowl_sandwich: '🥙',
  hamburgers: '🍔',
  hache_selection: '🧆',
  agneau: '🐑',
  steak_garnitures: '🥩',
  tranchee_selection: '🔪',
  specialites_partager: '👨‍👩‍👧‍👦',
  menu_enfant: '👶',
  desserts: '🍨',
  boissons_chaudes: '☕',
  boissons_froides: '🥤',
  cocktails: '🍹',
  sauces: '🫙',
}
