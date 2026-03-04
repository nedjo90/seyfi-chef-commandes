import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import OrderCard from '../components/OrderCard'
import { fetchOrders, fetchMenuItems, fetchOrderItems, deleteOrder } from '../lib/menu'
import type { MenuItem, Order, OrderItem } from '../types/database'

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [orderItemsMap, setOrderItemsMap] = useState<Record<number, OrderItem[]>>({})
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    const [o, m] = await Promise.all([fetchOrders(), fetchMenuItems()])
    setOrders(o)
    setMenuItems(m)

    if (o.length > 0) {
      const items = await fetchOrderItems(o.map((ord) => ord.id))
      const map: Record<number, OrderItem[]> = {}
      for (const item of items) {
        if (!map[item.order_id]) map[item.order_id] = []
        map[item.order_id].push(item)
      }
      setOrderItemsMap(map)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette commande ?')) return
    await deleteOrder(id)
    setOrders((prev) => prev.filter((o) => o.id !== id))
    setOrderItemsMap((prev) => {
      const next = { ...prev }
      delete next[id]
      return next
    })
  }

  const getMenuItem = (id: number) => menuItems.find((m) => m.id === id)

  const handleExportExcel = () => {
    type Row = (string | number)[]
    const header: Row = ['Nom', 'Telephone', 'Articles', 'Quantite', 'Prix unitaire', 'Sous-total', 'TOTAL', 'Remarques']
    const rows: Row[] = [header]

    let computedGrandTotal = 0

    for (const order of orders) {
      const items = orderItemsMap[order.id] ?? []
      const orderTotal = Math.round(items.reduce((s, oi) => s + oi.unit_price * oi.quantity, 0) * 100) / 100
      computedGrandTotal += orderTotal

      if (items.length > 0) {
        const firstItem = items[0]
        const mi = getMenuItem(firstItem.menu_item_id)
        const itemName = (mi?.name ?? `Item #${firstItem.menu_item_id}`) +
          (firstItem.variant_label ? ` (${firstItem.variant_label})` : '')

        rows.push([
          order.guest_name,
          order.phone ?? '',
          itemName,
          firstItem.quantity,
          firstItem.unit_price,
          Math.round(firstItem.unit_price * firstItem.quantity * 100) / 100,
          orderTotal,
          order.remarks ?? '',
        ])

        for (let i = 1; i < items.length; i++) {
          const oi = items[i]
          const miN = getMenuItem(oi.menu_item_id)
          const name = (miN?.name ?? `Item #${oi.menu_item_id}`) +
            (oi.variant_label ? ` (${oi.variant_label})` : '')
          rows.push(['', '', name, oi.quantity, oi.unit_price, Math.round(oi.unit_price * oi.quantity * 100) / 100, '', ''])
        }
      } else {
        rows.push([order.guest_name, order.phone ?? '', '(vide)', 0, 0, 0, 0, order.remarks ?? ''])
      }
    }

    const grandTotal = Math.round(computedGrandTotal * 100) / 100
    rows.push([])
    rows.push(['TOTAL GENERAL', '', '', '', '', '', grandTotal, `${orders.length} commandes`])

    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [
      { wch: 18 }, { wch: 16 }, { wch: 45 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 25 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Commandes Iftar Seyfi')
    XLSX.writeFile(wb, 'commandes_iftar_seyfi_chef.xlsx')
  }

  const grandTotal = orders.reduce((sum, o) => sum + Number(o.total), 0)

  return (
    <div className="min-h-screen grill-pattern pb-8">
      <header className="px-4 pt-8 pb-6">
        <a
          href="#/"
          className="inline-flex items-center gap-2 text-copper-400 text-sm mb-4 hover:text-copper-300"
        >
          ← Retour au menu
        </a>
        <h1 className="font-display text-2xl font-bold text-cream-200">
          🔥 Commandes Seyfi Chef
        </h1>
        <p className="text-smoke-500 text-sm mt-1">
          Toutes les commandes pour l'iftar
        </p>
      </header>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-cream-200">{orders.length}</p>
            <p className="text-xs text-smoke-500">Commandes</p>
          </div>
          <div className="bg-charcoal-800/60 border border-charcoal-700/40 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-success-400">
              {grandTotal.toFixed(2)} {'\u20AC'}
            </p>
            <p className="text-xs text-smoke-500">Total general</p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-4 mb-4 space-y-2">
        <button
          onClick={loadData}
          className="w-full py-2.5 rounded-xl border border-copper-500/20 bg-copper-500/5 text-copper-300 text-sm font-medium hover:bg-copper-500/10 transition-all active:scale-[0.98]"
        >
          🔄 Rafraichir les commandes
        </button>
        {orders.length > 0 && (
          <button
            onClick={handleExportExcel}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-success-600 to-success-500 text-white text-sm font-semibold hover:from-success-500 hover:to-success-400 transition-all active:scale-[0.98] shadow-lg shadow-success-500/20"
          >
            📥 Telecharger Excel pour le restaurant
          </button>
        )}
      </div>

      {/* Orders list */}
      <div className="px-4 space-y-3">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-3xl mb-3 animate-float">🔥</div>
            <p className="text-copper-300 animate-pulse">Chargement...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-smoke-400">Aucune commande pour l'instant</p>
            <p className="text-smoke-600 text-sm mt-1">
              Les commandes apparaitront ici
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              orderItems={orderItemsMap[order.id] ?? []}
              menuItems={menuItems}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  )
}
