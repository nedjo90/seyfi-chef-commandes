import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import AmbientBackground from '../components/StarryBackground'
import CategorySection from '../components/CategorySection'
import OrderRecap from '../components/OrderRecap'
import OrderSummaryBar from '../components/OrderSummaryBar'
import SuccessOverlay from '../components/SuccessOverlay'
import { fetchMenuItems, createOrder, createOrderItems, groupByCategory, CATEGORY_ORDER } from '../lib/menu'
import type { MenuItem, CartItem } from '../types/database'

function cartKey(itemId: number, variantLabel: string | null): string {
  return `${itemId}__${variantLabel ?? ''}`
}

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [successData, setSuccessData] = useState<{ name: string; total: number; itemNames: string[] } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [guestName, setGuestName] = useState('')
  const [remarks, setRemarks] = useState('')
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map())

  useEffect(() => {
    fetchMenuItems()
      .then(setMenuItems)
      .catch(() => setError('Impossible de charger le menu'))
      .finally(() => setLoading(false))
  }, [])

  const grouped = groupByCategory(menuItems)

  const handleAdd = useCallback((item: MenuItem, variantLabel: string | null, price: number) => {
    setCart((prev) => {
      const next = new Map(prev)
      const key = cartKey(item.id, variantLabel)
      const existing = next.get(key)
      if (existing) {
        next.set(key, { ...existing, quantity: existing.quantity + 1 })
      } else {
        next.set(key, { menuItem: item, variantLabel, unitPrice: price, quantity: 1 })
      }
      return next
    })
  }, [])

  const handleRemove = useCallback((item: MenuItem, variantLabel: string | null) => {
    setCart((prev) => {
      const next = new Map(prev)
      const key = cartKey(item.id, variantLabel)
      const existing = next.get(key)
      if (existing) {
        if (existing.quantity <= 1) {
          next.delete(key)
        } else {
          next.set(key, { ...existing, quantity: existing.quantity - 1 })
        }
      }
      return next
    })
  }, [])

  const cartItemsList = Array.from(cart.values()).filter((ci) => ci.quantity > 0)
  const total = Math.round(cartItemsList.reduce((sum, ci) => sum + ci.unitPrice * ci.quantity, 0) * 100) / 100
  const itemCount = cartItemsList.reduce((sum, ci) => sum + ci.quantity, 0)
  const canSubmit = guestName.trim().length > 0 && cartItemsList.length > 0

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)

    try {
      const order = await createOrder({
        guest_name: guestName.trim(),
        phone: null,
        remarks: remarks.trim() || null,
        total,
      })

      await createOrderItems(
        cartItemsList.map((ci) => ({
          order_id: order.id,
          menu_item_id: ci.menuItem.id,
          variant_label: ci.variantLabel,
          quantity: ci.quantity,
          unit_price: ci.unitPrice,
        }))
      )

      setSuccessData({
        name: guestName.trim(),
        total,
        itemNames: cartItemsList.map((ci) => ci.menuItem.name),
      })
      setGuestName('')
      setRemarks('')
      setCart(new Map())
    } catch (err) {
      setError('Erreur: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AmbientBackground />
        <div className="relative z-10 text-center">
          <p className="text-champagne-400 animate-pulse font-display text-lg tracking-wider">Chargement du menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-28">
      <AmbientBackground />
      <div className="relative z-10">
        <Header />

        {/* Nav to orders */}
        <div className="px-4 mb-6">
          <a
            href="#/commandes"
            className="block w-full text-center py-2.5 border-b border-onyx-800/60 text-onyx-400 text-xs uppercase tracking-[0.2em] hover:text-champagne-400 transition-colors"
          >
            Voir toutes les commandes
          </a>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-4 mb-4 p-3 border border-wine-800/40 bg-wine-900/20 text-wine-400 text-sm text-center animate-slide-down">
            {error}
          </div>
        )}

        {/* Guest name */}
        <div className="px-4 mb-6">
          <label className="block text-[10px] text-onyx-500 uppercase tracking-[0.2em] mb-2">
            Votre nom
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Entrez votre nom..."
            className="luxury-input"
          />
        </div>

        {/* Menu categories */}
        <div className="px-4">
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped[cat] ?? []
            if (items.length === 0) return null
            return (
              <div key={cat} className="animate-fade-in-up">
                <CategorySection
                  category={cat}
                  items={items}
                  cartItems={cart}
                  onAdd={handleAdd}
                  onRemove={handleRemove}
                />
              </div>
            )
          })}
        </div>

        {/* Remarks */}
        <div className="px-4 mt-4">
          <label className="block text-[10px] text-onyx-500 uppercase tracking-[0.2em] mb-2">
            Remarques
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Allergies, preferences..."
            rows={2}
            className="luxury-input resize-none"
          />
        </div>

        {/* Order Recap */}
        {cartItemsList.length > 0 && (
          <div className="px-4 mt-6">
            <OrderRecap cartItems={cartItemsList} total={total} />
          </div>
        )}

        {/* Bottom bar */}
        <OrderSummaryBar
          total={total}
          itemCount={itemCount}
          onSubmit={handleSubmit}
          disabled={!canSubmit}
          loading={submitting}
        />

        {/* Success overlay */}
        {successData && (
          <SuccessOverlay
            guestName={successData.name}
            total={successData.total}
            itemNames={successData.itemNames}
            onClose={() => setSuccessData(null)}
          />
        )}
      </div>
    </div>
  )
}
