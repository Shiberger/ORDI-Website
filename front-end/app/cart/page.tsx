'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'
import { products } from '@/lib/data/products'
import { MonoTag } from '@/components/ui/MonoTag'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const { cart, subtotal, setQty, removeFromCart, t, lang } = useApp()

  return (
    <main className="ordi-cartpage">
      <header className="ordi-cartpage__head">
        <MonoTag>↘ CART</MonoTag>
        <h1 className="ordi-display-lg">
          Your <em>order</em>.
        </h1>
      </header>
      {cart.length === 0 ? (
        <div className="ordi-cartpage__empty">
          <p>{t.empty_cart}</p>
          <Link href="/shop" className="ordi-btn ordi-btn--primary">
            {t.cta.shop_all} →
          </Link>
        </div>
      ) : (
        <div className="ordi-cartpage__grid">
          <div>
            {cart.map((it, i) => {
              const p = products.find((x) => x.id === it.id)
              if (!p) return null
              const s = p.sizes.find((x) => x.ml === it.size)
              if (!s) return null
              return (
                <div className="ordi-cartrow" key={`${it.id}-${it.size}-${i}`}>
                  <div className="ordi-cartrow__media" style={{ background: p.hue }}>
                    <span>{p.number}</span>
                  </div>
                  <div className="ordi-cartrow__meta">
                    <div className="ordi-cartrow__name">{p.name}</div>
                    <div className="ordi-cartrow__sub">
                      <em>{p.tagline[lang]}</em>
                    </div>
                    <MonoTag>{it.size}ml · EAU DE PARFUM</MonoTag>
                  </div>
                  <div className="ordi-cartrow__qty">
                    <button onClick={() => setQty(it.id, it.size, it.qty - 1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(it.id, it.size, it.qty + 1)}>+</button>
                  </div>
                  <div className="ordi-cartrow__price">
                    {formatPrice(s.price * it.qty)} {t.currency}
                  </div>
                  <button
                    className="ordi-cartrow__remove"
                    onClick={() => removeFromCart(it.id, it.size)}
                  >
                    ✕
                  </button>
                </div>
              )
            })}
          </div>
          <aside className="ordi-cartpage__summary">
            <MonoTag>↘ SUMMARY</MonoTag>
            <div className="ordi-summary__row">
              <span>{t.subtotal}</span>
              <span>
                {formatPrice(subtotal)} {t.currency}
              </span>
            </div>
            <div className="ordi-summary__row">
              <span>{lang === 'en' ? 'Shipping' : 'ค่าจัดส่ง'}</span>
              <span>{lang === 'en' ? 'Calculated next' : 'คำนวณถัดไป'}</span>
            </div>
            <div className="ordi-summary__row ordi-summary__row--total">
              <span>{lang === 'en' ? 'Total' : 'รวม'}</span>
              <span>
                {formatPrice(subtotal)} {t.currency}
              </span>
            </div>
            <Link
              href="/checkout"
              className="ordi-btn ordi-btn--primary ordi-btn--full"
            >
              {t.cta.checkout} →
            </Link>
            <ul className="ordi-summary__perks">
              <li>✦ {t.product.included}</li>
              <li>✦ {t.product.ships}</li>
              <li>
                ✦{' '}
                {lang === 'en'
                  ? '30-day return on unopened'
                  : 'คืนได้ภายใน 30 วันสำหรับสินค้าที่ยังไม่เปิด'}
              </li>
            </ul>
          </aside>
        </div>
      )}
    </main>
  )
}
