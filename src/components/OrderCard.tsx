import type { MenuItem, OrderItem, Order } from '../types/database'

interface Props {
  order: Order
  orderItems: OrderItem[]
  menuItems: MenuItem[]
  onDelete: (id: number) => void
}

export default function OrderCard({ order, orderItems, menuItems, onDelete }: Props) {
  const getMenuItem = (id: number) => menuItems.find((m) => m.id === id)

  return (
    <div className="border-b border-onyx-800/60 py-5 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-display text-lg text-ivory-200">
            {order.guest_name}
          </h3>
          <p className="text-[10px] text-onyx-500 tracking-wider">
            {new Date(order.created_at).toLocaleString('fr-FR', {
              day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-lg text-champagne-400 tabular-nums">
            {Number(order.total).toFixed(2)} &euro;
          </p>
          <button
            onClick={() => onDelete(order.id)}
            className="text-[10px] text-wine-500 hover:text-wine-400 mt-1 uppercase tracking-wider"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="space-y-1.5 text-sm">
        {orderItems.map((oi) => {
          const mi = getMenuItem(oi.menu_item_id)
          return (
            <div key={oi.id} className="flex justify-between text-onyx-400">
              <span>
                {oi.quantity > 1 && <span className="text-champagne-500">{oi.quantity}&times; </span>}
                {mi?.name ?? `#${oi.menu_item_id}`}
                {oi.variant_label && <span className="text-onyx-600 text-xs"> ({oi.variant_label})</span>}
              </span>
              <span className="tabular-nums text-onyx-500">{(oi.unit_price * oi.quantity).toFixed(2)}</span>
            </div>
          )
        })}
        {order.remarks && (
          <div className="mt-3 pt-3 border-t border-onyx-800/40">
            <p className="text-onyx-500 text-xs italic">{order.remarks}</p>
          </div>
        )}
      </div>
    </div>
  )
}
