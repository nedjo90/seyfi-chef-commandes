import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import StarryBackground from '../components/StarryBackground'
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
  const [phone, setPhone] = useState('')
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
        phone: phone.trim() || null,
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
      setPhone('')
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
        <StarryBackground />
        <div className="relative z-10 text-center">
          <div className="text-5xl mb-4 animate-float">🥩</div>
          <p className="text-gold-300 animate-pulse font-display text-lg">Chargement du menu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-28">
      <StarryBackground />
      <div className="relative z-10 moroccan-pattern">
        <Header />

        {/* Nav to orders */}
        <div className="px-4 mb-5">
          <a
            href="#/commandes"
            className="block w-full text-center py-2.5 rounded-xl border border-gold-500/15 bg-gold-500/5 text-gold-400 text-sm font-medium hover:bg-gold-500/10 transition-all"
          >
            📋 Voir toutes les commandes →
          </a>
        </div>

        {/* Error banner */}
        {error && (
          <div className="mx-4 mb-4 p-3 rounded-xl bg-terracotta-600/20 border border-terracotta-500/30 text-terracotta-300 text-sm text-center animate-slide-down">
            ❌ {error}
          </div>
        )}

        {/* Guest name */}
        <div className="px-4 mb-4">
          <label className="block text-sm text-gold-300 font-medium mb-2">
            ✍️ Votre nom *
          </label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Entrez votre nom..."
            className="w-full bg-night-800/40 border border-night-700/40 rounded-xl px-4 py-3.5 text-gold-100 placeholder-night-500 focus:outline-none focus:border-gold-500/40 dropdown-glow transition-all text-base"
          />
        </div>

        {/* Phone */}
        <div className="px-4 mb-5">
          <label className="block text-sm text-gold-300 font-medium mb-2">
            📱 Telephone (optionnel)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+352..."
            className="w-full bg-night-800/40 border border-night-700/40 rounded-xl px-4 py-3.5 text-gold-100 placeholder-night-500 focus:outline-none focus:border-gold-500/40 dropdown-glow transition-all text-base"
          />
        </div>

        {/* Menu categories */}
        <div className="px-4 space-y-5">
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
        <div className="px-4 mt-5">
          <label className="block text-sm text-gold-300 font-medium mb-2">
            💬 Remarques (allergies, preferences...)
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Optionnel..."
            rows={2}
            className="w-full bg-night-800/40 border border-night-700/40 rounded-xl px-4 py-3 text-gold-100 placeholder-night-500 focus:outline-none focus:border-gold-500/40 dropdown-glow transition-all resize-none text-base"
          />
        </div>

        {/* Order Recap */}
        {cartItemsList.length > 0 && (
          <div className="px-4 mt-5">
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
