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
    const header: Row = ['Nom', 'Articles', 'Quantite', 'Prix unitaire', 'Sous-total', 'TOTAL', 'Remarques']
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
          rows.push(['', name, oi.quantity, oi.unit_price, Math.round(oi.unit_price * oi.quantity * 100) / 100, '', ''])
        }
      } else {
        rows.push([order.guest_name, '(vide)', 0, 0, 0, 0, order.remarks ?? ''])
      }
    }

    const grandTotal = Math.round(computedGrandTotal * 100) / 100
    rows.push([])
    rows.push(['TOTAL GENERAL', '', '', '', '', grandTotal, `${orders.length} commandes`])

    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [
      { wch: 18 }, { wch: 45 }, { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 25 },
    ]

    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Commandes Iftar Seyfi')
    XLSX.writeFile(wb, 'commandes_iftar_seyfi_chef.xlsx')
  }

  const grandTotal = orders.reduce((sum, o) => sum + Number(o.total), 0)

  return (
    <div className="min-h-screen pb-8">
      <div className="ambient-bg" />
      <div className="relative z-10">
        <header className="px-4 pt-10 pb-8">
          <a
            href="#/"
            className="inline-flex items-center gap-2 text-onyx-500 text-xs uppercase tracking-[0.2em] mb-6 hover:text-champagne-400 transition-colors"
          >
            &larr; Retour au menu
          </a>
          <h1 className="font-display text-3xl font-light text-ivory-200 tracking-wide">
            Commandes
          </h1>
          <div className="line-gold mt-3 w-16" />
          <p className="text-onyx-500 text-xs mt-3 tracking-wider">
            Toutes les commandes pour l'iftar
          </p>
        </header>

        {/* Stats */}
        <div className="px-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="recap-card rounded-xl p-5 text-center">
              <p className="font-display text-3xl font-light text-ivory-200">{orders.length}</p>
              <p className="text-[10px] text-onyx-500 uppercase tracking-[0.2em] mt-1">Commandes</p>
            </div>
            <div className="recap-card rounded-xl p-5 text-center">
              <p className="font-display text-3xl font-light text-champagne-400 tabular-nums">
                {grandTotal.toFixed(2)} {'\u20AC'}
              </p>
              <p className="text-[10px] text-onyx-500 uppercase tracking-[0.2em] mt-1">Total general</p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="px-4 mb-6 space-y-3">
          <button
            onClick={loadData}
            className="w-full py-3 border border-onyx-800/60 text-onyx-400 text-xs uppercase tracking-[0.2em] hover:border-champagne-500/30 hover:text-champagne-400 transition-all active:scale-[0.98]"
          >
            Rafraichir
          </button>
          {orders.length > 0 && (
            <button
              onClick={handleExportExcel}
              className="w-full py-3.5 rounded-lg bg-champagne-500 text-onyx-900 text-sm font-semibold uppercase tracking-wider hover:bg-champagne-400 transition-all active:scale-[0.97]"
            >
              Telecharger Excel
            </button>
          )}
        </div>

        {/* Orders list */}
        <div className="px-4">
          {loading ? (
            <div className="text-center py-16">
              <p className="text-champagne-400 animate-pulse font-display text-lg tracking-wider">Chargement...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-onyx-500 text-sm">Aucune commande pour l'instant</p>
              <p className="text-onyx-600 text-xs mt-2">
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
    </div>
  )
}
