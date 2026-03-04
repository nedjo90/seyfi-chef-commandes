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
    <div className="bg-night-800/60 border border-night-700/50 rounded-xl p-4 animate-fade-in-up">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gold-300 text-lg">
            {order.guest_name}
          </h3>
          <p className="text-xs text-night-400">
            {new Date(order.created_at).toLocaleString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          {order.phone && (
            <p className="text-xs text-night-500 mt-0.5">📱 {order.phone}</p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold text-gold-400 text-lg">
            {Number(order.total).toFixed(2)} {'\u20AC'}
          </p>
          <button
            onClick={() => onDelete(order.id)}
            className="text-xs text-terracotta-400 hover:text-terracotta-300 mt-1"
          >
            Supprimer
          </button>
        </div>
      </div>

      <div className="space-y-1 text-sm">
        {orderItems.map((oi) => {
          const mi = getMenuItem(oi.menu_item_id)
          return (
            <div key={oi.id} className="flex justify-between text-night-300">
              <span>
                {oi.quantity > 1 && <span className="text-gold-400 font-bold">{oi.quantity}x </span>}
                {mi?.name ?? `Item #${oi.menu_item_id}`}
                {oi.variant_label && <span className="text-night-500"> ({oi.variant_label})</span>}
              </span>
              <span className="text-night-400">{(oi.unit_price * oi.quantity).toFixed(2)} {'\u20AC'}</span>
            </div>
          )
        })}
        {order.remarks && (
          <div className="mt-2 pt-2 border-t border-night-700/50">
            <p className="text-night-400 text-xs italic">
              💬 {order.remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
