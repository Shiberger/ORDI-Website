'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useApp } from '@/lib/context/AppContext'
import { products } from '@/lib/data/products'
import { cn, formatPrice, isDarkHue } from '@/lib/utils'
import { MonoTag } from '@/components/ui/MonoTag'

export function CartDrawer() {
  const { drawerOpen, setDrawerOpen, cart, subtotal, setQty, removeFromCart, t } = useApp()
  const router = useRouter()

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  const goCheckout = () => {
    setDrawerOpen(false)
    router.push('/checkout')
  }

  const goShop = () => {
    setDrawerOpen(false)
    router.push('/shop')
  }

  return (
    <>
      <div
        className={cn('ordi-drawer__scrim', drawerOpen && 'is-open')}
        onClick={() => setDrawerOpen(false)}
      />
      <aside className={cn('ordi-drawer', drawerOpen && 'is-open')}>
        <header className="ordi-drawer__head">
          <div className="ordi-drawer__title">
            <span className="ordi-mono-tag">⌁</span>
            <span>{t.cart_title}</span>
            <span className="ordi-drawer__count">
              ({cart.reduce((n, it) => n + it.qty, 0)})
            </span>
          </div>
          <button className="ordi-drawer__close" onClick={() => setDrawerOpen(false)}>
            Close ✕
          </button>
        </header>
        <div className="ordi-drawer__body">
          {cart.length === 0 ? (
            <div className="ordi-drawer__empty">
              <div className="ordi-display-sm">{t.empty_cart}</div>
              <button className="ordi-btn ordi-btn--ghost" onClick={goShop}>
                {t.cta.shop_all} →
              </button>
            </div>
          ) : (
            cart.map((it, i) => {
              const p = products.find((x) => x.id === it.id)
              if (!p) return null
              const s = p.sizes.find((x) => x.ml === it.size)
              if (!s) return null
              return (
                <article className="ordi-drawer__item" key={`${it.id}-${it.size}-${i}`}>
                  <div
                    className="ordi-drawer__thumb"
                    style={{
                      background: p.hue,
                      color: isDarkHue(p.hue) ? '#fff' : '#0A0A0A',
                    }}
                  >
                    <div className="ordi-drawer__thumb-num">{p.number}</div>
                    <div className="ordi-drawer__thumb-name">{p.name}</div>
                  </div>
                  <div className="ordi-drawer__meta">
                    <div className="ordi-drawer__row1">
                      <div className="ordi-drawer__name">{p.name}</div>
                      <button
                        className="ordi-drawer__remove"
                        onClick={() => removeFromCart(it.id, it.size)}
                      >
                        {t.remove}
                      </button>
                    </div>
                    <div className="ordi-drawer__row2">
                      <MonoTag>{it.size}ml</MonoTag>
                      <MonoTag>
                        {formatPrice(s.price)} {t.currency}
                      </MonoTag>
                    </div>
                    <div className="ordi-drawer__qty">
                      <button onClick={() => setQty(it.id, it.size, it.qty - 1)}>−</button>
                      <span>{it.qty}</span>
                      <button onClick={() => setQty(it.id, it.size, it.qty + 1)}>+</button>
                    </div>
                  </div>
                </article>
              )
            })
          )}
        </div>
        {cart.length > 0 && (
          <footer className="ordi-drawer__foot">
            <div className="ordi-drawer__sub">
              <span>{t.subtotal}</span>
              <span className="ordi-drawer__subtotal">
                {formatPrice(subtotal)} {t.currency}
              </span>
            </div>
            <div className="ordi-drawer__shipnote">{t.shipping}</div>
            <button
              className="ordi-btn ordi-btn--primary ordi-btn--full"
              onClick={goCheckout}
            >
              {t.cta.checkout} →
            </button>
          </footer>
        )}
      </aside>
    </>
  )
}
