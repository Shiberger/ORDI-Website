'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { cn, formatPrice } from '@/lib/utils'
import { SHIPPING_RATES } from '@/lib/shipping'
import type { Carrier } from '@/types/order'

type FormState = {
  email: string
  first: string
  last: string
  address: string
  city: string
  postcode: string
  phone: string
  method: Carrier
}

export default function CheckoutPage() {
  const { cart, subtotal, t, lang, products } = useApp()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const [form, setForm] = useState<FormState>({
    email: '',
    first: '',
    last: '',
    address: '',
    city: 'Bangkok',
    postcode: '',
    phone: '',
    method: 'thai-post',
  })

  // Stripe sends the shopper back to /checkout?cancelled=1. Read it from the
  // URL directly so the page needs no Suspense boundary.
  useEffect(() => {
    setCancelled(new URLSearchParams(window.location.search).has('cancelled'))
  }, [])

  const upd = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const ship = SHIPPING_RATES[form.method]
  const total = subtotal + ship

  const contactValid =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    form.first.trim() !== '' &&
    form.last.trim() !== '' &&
    form.phone.trim() !== ''

  const shippingValid =
    form.method === 'pickup' ||
    (form.address.trim() !== '' && form.city.trim() !== '' && form.postcode.trim() !== '')

  async function placeOrder() {
    setError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          email: form.email.trim(),
          carrier: form.method,
          shipping_address: {
            first_name: form.first.trim(),
            last_name: form.last.trim(),
            phone: form.phone.trim(),
            address: form.address.trim(),
            city: form.city.trim(),
            postcode: form.postcode.trim(),
            country: 'TH',
          },
        }),
      })

      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        throw new Error(data.error ?? 'Could not start checkout.')
      }
      // The cart is cleared on /checkout/success, not here — a shopper who
      // abandons the Stripe page must come back to a full cart.
      window.location.assign(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <main className="ordi-checkout">
      <header className="ordi-checkout__head">
        <MonoTag>↘ CHECKOUT</MonoTag>
        <h1 className="ordi-display-lg">
          Almost <em>yours</em>.
        </h1>
        <ol className="ordi-checkout__steps">
          {[
            lang === 'en' ? 'Contact' : 'ติดต่อ',
            lang === 'en' ? 'Shipping' : 'การจัดส่ง',
            lang === 'en' ? 'Review' : 'ตรวจสอบ',
          ].map((s, i) => (
            <li
              key={i}
              className={cn(step === i + 1 && 'is-active', step > i + 1 && 'is-done')}
            >
              <span>0{i + 1}</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </header>

      {cancelled && (
        <p className="ordi-checkout__notice">
          {lang === 'en'
            ? 'Payment was cancelled. Your cart is untouched — you can try again.'
            : 'การชำระเงินถูกยกเลิก ตะกร้าของคุณยังอยู่ครบ ลองใหม่ได้เลย'}
        </p>
      )}

      <div className="ordi-checkout__grid">
        <div className="ordi-checkout__form">
          {step === 1 && (
            <section className="ordi-formstep">
              <h2>01 — {lang === 'en' ? 'Contact' : 'ติดต่อ'}</h2>
              <label>
                <span>{lang === 'en' ? 'Email' : 'อีเมล'}</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => upd('email', e.target.value)}
                  placeholder="you@email.com"
                />
              </label>
              <div className="ordi-form-row">
                <label>
                  <span>{lang === 'en' ? 'First name' : 'ชื่อ'}</span>
                  <input value={form.first} onChange={(e) => upd('first', e.target.value)} />
                </label>
                <label>
                  <span>{lang === 'en' ? 'Last name' : 'นามสกุล'}</span>
                  <input value={form.last} onChange={(e) => upd('last', e.target.value)} />
                </label>
              </div>
              <label>
                <span>{lang === 'en' ? 'Phone' : 'โทรศัพท์'}</span>
                <input
                  value={form.phone}
                  onChange={(e) => upd('phone', e.target.value)}
                  placeholder="+66"
                />
              </label>
              <button
                className="ordi-btn ordi-btn--primary"
                disabled={!contactValid}
                onClick={() => setStep(2)}
              >
                {t.cta.continue} →
              </button>
            </section>
          )}

          {step === 2 && (
            <section className="ordi-formstep">
              <h2>02 — {lang === 'en' ? 'Shipping' : 'การจัดส่ง'}</h2>
              <fieldset className="ordi-radiogroup">
                <legend>{lang === 'en' ? 'Carrier' : 'ผู้ให้บริการ'}</legend>
                {(
                  [
                    { id: 'thai-post', label: 'Thai Post · 50 THB · 3–5 days' },
                    { id: 'kerry', label: 'Kerry Express · 80 THB · 1–2 days' },
                    {
                      id: 'pickup',
                      label:
                        lang === 'en'
                          ? 'Studio pickup · Free · Sukhumvit'
                          : 'รับที่สตูดิโอ · ฟรี · สุขุมวิท',
                    },
                  ] as { id: Carrier; label: string }[]
                ).map((o) => (
                  <label
                    key={o.id}
                    className={cn('ordi-radio', form.method === o.id && 'is-checked')}
                  >
                    <input
                      type="radio"
                      name="method"
                      checked={form.method === o.id}
                      onChange={() => upd('method', o.id)}
                    />
                    <span className="ordi-radio__dot"></span>
                    <span>{o.label}</span>
                  </label>
                ))}
              </fieldset>

              {form.method !== 'pickup' && (
                <>
                  <label>
                    <span>{lang === 'en' ? 'Address' : 'ที่อยู่'}</span>
                    <input
                      value={form.address}
                      onChange={(e) => upd('address', e.target.value)}
                    />
                  </label>
                  <div className="ordi-form-row">
                    <label>
                      <span>{lang === 'en' ? 'City' : 'เมือง'}</span>
                      <input value={form.city} onChange={(e) => upd('city', e.target.value)} />
                    </label>
                    <label>
                      <span>{lang === 'en' ? 'Postcode' : 'รหัสไปรษณีย์'}</span>
                      <input
                        value={form.postcode}
                        onChange={(e) => upd('postcode', e.target.value)}
                      />
                    </label>
                  </div>
                </>
              )}

              <div className="ordi-formstep__actions">
                <button className="ordi-btn ordi-btn--ghost" onClick={() => setStep(1)}>
                  ← Back
                </button>
                <button
                  className="ordi-btn ordi-btn--primary"
                  disabled={!shippingValid}
                  onClick={() => setStep(3)}
                >
                  {t.cta.continue} →
                </button>
              </div>
            </section>
          )}

          {step === 3 && (
            <section className="ordi-formstep">
              <h2>03 — {lang === 'en' ? 'Review' : 'ตรวจสอบ'}</h2>

              <dl className="ordi-review">
                <div>
                  <dt>{lang === 'en' ? 'Email' : 'อีเมล'}</dt>
                  <dd>{form.email}</dd>
                </div>
                <div>
                  <dt>{lang === 'en' ? 'Deliver to' : 'จัดส่งถึง'}</dt>
                  <dd>
                    {form.first} {form.last}
                    <br />
                    {form.method === 'pickup' ? (
                      lang === 'en' ? (
                        'Studio pickup — Sukhumvit, Bangkok'
                      ) : (
                        'รับที่สตูดิโอ — สุขุมวิท กรุงเทพฯ'
                      )
                    ) : (
                      <>
                        {form.address}
                        <br />
                        {form.city} {form.postcode}
                      </>
                    )}
                    <br />
                    {form.phone}
                  </dd>
                </div>
              </dl>

              <p className="ordi-checkout__securenote">
                {lang === 'en'
                  ? 'You will be redirected to Stripe to pay securely. We never see your card details.'
                  : 'ระบบจะพาไปชำระเงินอย่างปลอดภัยที่ Stripe เราไม่เห็นข้อมูลบัตรของคุณ'}
              </p>

              {error && <p className="ordi-checkout__error">{error}</p>}

              <div className="ordi-formstep__actions">
                <button
                  className="ordi-btn ordi-btn--ghost"
                  onClick={() => setStep(2)}
                  disabled={submitting}
                >
                  ← Back
                </button>
                <button
                  className="ordi-btn ordi-btn--primary"
                  onClick={placeOrder}
                  disabled={submitting || cart.length === 0}
                >
                  {submitting
                    ? lang === 'en'
                      ? 'Redirecting…'
                      : 'กำลังไปหน้าชำระเงิน…'
                    : `${t.cta.place_order} — ${formatPrice(total)} ${t.currency}`}
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="ordi-checkout__summary">
          <MonoTag>↘ {lang === 'en' ? 'Your order' : 'คำสั่งซื้อของคุณ'}</MonoTag>
          {cart.length === 0 && (
            <p style={{ opacity: 0.6 }}>
              {t.empty_cart} <Link href="/shop">{t.cta.shop_all}</Link>
            </p>
          )}
          {cart.map((it, i) => {
            const p = products.find((x) => x.id === it.id)
            if (!p) return null
            const s = p.sizes.find((x) => x.ml === it.size)
            if (!s) return null
            return (
              <div className="ordi-checkout__item" key={i}>
                <div className="ordi-checkout__thumb" style={{ background: p.hue }}>
                  <span>{p.number}</span>
                  <span className="ordi-checkout__thumbqty">{it.qty}</span>
                </div>
                <div className="ordi-checkout__itemmeta">
                  <div>{p.name}</div>
                  <MonoTag>{it.size}ml</MonoTag>
                </div>
                <div className="ordi-checkout__itemprice">
                  {formatPrice(s.price * it.qty)} {t.currency}
                </div>
              </div>
            )
          })}
          <div className="ordi-summary__row">
            <span>{t.subtotal}</span>
            <span>
              {formatPrice(subtotal)} {t.currency}
            </span>
          </div>
          <div className="ordi-summary__row">
            <span>{lang === 'en' ? 'Shipping' : 'จัดส่ง'}</span>
            <span>
              {ship === 0 ? (lang === 'en' ? 'Free' : 'ฟรี') : `${ship} ${t.currency}`}
            </span>
          </div>
          <div className="ordi-summary__row ordi-summary__row--total">
            <span>{lang === 'en' ? 'Total' : 'รวม'}</span>
            <span>
              {formatPrice(total)} {t.currency}
            </span>
          </div>
        </aside>
      </div>
    </main>
  )
}
