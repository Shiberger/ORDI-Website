'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/lib/context/AppContext'
import { products } from '@/lib/data/products'
import { MonoTag } from '@/components/ui/MonoTag'
import { cn, formatPrice } from '@/lib/utils'

type Carrier = 'thai-post' | 'kerry' | 'pickup'
type Payment = 'card' | 'promptpay' | 'transfer'

type FormState = {
  email: string
  first: string
  last: string
  address: string
  city: string
  postcode: string
  phone: string
  method: Carrier
  payment: Payment
}

export default function CheckoutPage() {
  const { cart, subtotal, t, lang } = useApp()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState<FormState>({
    email: '',
    first: '',
    last: '',
    address: '',
    city: 'Bangkok',
    postcode: '',
    phone: '',
    method: 'thai-post',
    payment: 'card',
  })
  const upd = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const ship = form.method === 'kerry' ? 80 : form.method === 'thai-post' ? 50 : 0
  const total = subtotal + ship

  if (done) {
    return (
      <main className="ordi-checkout ordi-checkout--done">
        <div className="ordi-thanks">
          <MonoTag>
            ORDER · ORDI-{String(Math.floor(Math.random() * 90000) + 10000)}
          </MonoTag>
          <h1 className="ordi-display-lg">
            {lang === 'en' ? (
              <span>
                Thank <em>you</em>.
              </span>
            ) : (
              <span>
                <em>ขอบคุณ</em>.
              </span>
            )}
          </h1>
          <p>
            {lang === 'en'
              ? "We'll hand-bottle your order in the studio this week. A confirmation is on its way to your inbox."
              : 'เราจะบรรจุคำสั่งซื้อของคุณด้วยมือในสตูดิโอภายในสัปดาห์นี้ อีเมลยืนยันกำลังจะส่งถึง'}
          </p>
          <div className="ordi-thanks__meta">
            <div>
              <MonoTag>EST. ARRIVAL</MonoTag>
              {lang === 'en' ? '3–5 business days' : '3–5 วันทำการ'}
            </div>
            <div>
              <MonoTag>FROM</MonoTag>Sukhumvit Studio, Bangkok
            </div>
          </div>
          <Link href="/" className="ordi-btn ordi-btn--ghost">
            ← Back to ORDI
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="ordi-checkout">
      <header className="ordi-checkout__head">
        <MonoTag>↘ CHECKOUT</MonoTag>
        <h1 className="ordi-display-lg">
          Almost <em>yours</em>.
        </h1>
        <ol className="ordi-checkout__steps">
          {['Contact', lang === 'en' ? 'Shipping' : 'การจัดส่ง', lang === 'en' ? 'Payment' : 'การชำระเงิน'].map(
            (s, i) => (
              <li
                key={i}
                className={cn(
                  step === i + 1 && 'is-active',
                  step > i + 1 && 'is-done'
                )}
              >
                <span>0{i + 1}</span>
                <span>{s}</span>
              </li>
            )
          )}
        </ol>
      </header>

      <div className="ordi-checkout__grid">
        <div className="ordi-checkout__form">
          {step === 1 && (
            <section className="ordi-formstep">
              <h2>01 — Contact</h2>
              <label>
                <span>{lang === 'en' ? 'Email' : 'อีเมล'}</span>
                <input
                  value={form.email}
                  onChange={(e) => upd('email', e.target.value)}
                  placeholder="you@email"
                />
              </label>
              <div className="ordi-form-row">
                <label>
                  <span>{lang === 'en' ? 'First name' : 'ชื่อ'}</span>
                  <input
                    value={form.first}
                    onChange={(e) => upd('first', e.target.value)}
                  />
                </label>
                <label>
                  <span>{lang === 'en' ? 'Last name' : 'นามสกุล'}</span>
                  <input
                    value={form.last}
                    onChange={(e) => upd('last', e.target.value)}
                  />
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
                onClick={() => setStep(2)}
              >
                {t.cta.continue} →
              </button>
            </section>
          )}
          {step === 2 && (
            <section className="ordi-formstep">
              <h2>02 — {lang === 'en' ? 'Shipping' : 'การจัดส่ง'}</h2>
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
                  <input
                    value={form.city}
                    onChange={(e) => upd('city', e.target.value)}
                  />
                </label>
                <label>
                  <span>{lang === 'en' ? 'Postcode' : 'รหัสไปรษณีย์'}</span>
                  <input
                    value={form.postcode}
                    onChange={(e) => upd('postcode', e.target.value)}
                  />
                </label>
              </div>
              <fieldset className="ordi-radiogroup">
                <legend>{lang === 'en' ? 'Carrier' : 'ผู้ให้บริการ'}</legend>
                {(
                  [
                    { id: 'thai-post', label: 'Thai Post · 50 THB · 3-5 days' },
                    { id: 'kerry', label: 'Kerry Express · 80 THB · 1-2 days' },
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
              <div className="ordi-formstep__actions">
                <button
                  className="ordi-btn ordi-btn--ghost"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  className="ordi-btn ordi-btn--primary"
                  onClick={() => setStep(3)}
                >
                  {t.cta.continue} →
                </button>
              </div>
            </section>
          )}
          {step === 3 && (
            <section className="ordi-formstep">
              <h2>03 — {lang === 'en' ? 'Payment' : 'การชำระเงิน'}</h2>
              <fieldset className="ordi-radiogroup">
                {(
                  [
                    {
                      id: 'card',
                      label:
                        lang === 'en' ? 'Credit / debit card' : 'บัตรเครดิต / เดบิต',
                    },
                    { id: 'promptpay', label: 'PromptPay QR' },
                    {
                      id: 'transfer',
                      label:
                        lang === 'en'
                          ? 'Bank transfer (SCB · Kasikorn)'
                          : 'โอนผ่านธนาคาร (SCB · กสิกร)',
                    },
                  ] as { id: Payment; label: string }[]
                ).map((o) => (
                  <label
                    key={o.id}
                    className={cn('ordi-radio', form.payment === o.id && 'is-checked')}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={form.payment === o.id}
                      onChange={() => upd('payment', o.id)}
                    />
                    <span className="ordi-radio__dot"></span>
                    <span>{o.label}</span>
                  </label>
                ))}
              </fieldset>
              {form.payment === 'card' && (
                <>
                  <label>
                    <span>{lang === 'en' ? 'Card number' : 'หมายเลขบัตร'}</span>
                    <input placeholder="•••• •••• •••• ••••" />
                  </label>
                  <div className="ordi-form-row">
                    <label>
                      <span>MM / YY</span>
                      <input placeholder="MM / YY" />
                    </label>
                    <label>
                      <span>CVC</span>
                      <input placeholder="•••" />
                    </label>
                  </div>
                </>
              )}
              {form.payment === 'promptpay' && (
                <div className="ordi-pay-promptpay">
                  <div className="ordi-pay-qr">
                    <div className="ordi-pay-qr__inner"></div>
                  </div>
                  <p>
                    {lang === 'en'
                      ? 'Scan with any Thai banking app. Your order will be released once we see the transfer.'
                      : 'สแกนด้วยแอปธนาคารใดก็ได้ คำสั่งซื้อจะถูกปล่อยเมื่อเราเห็นการโอน'}
                  </p>
                </div>
              )}
              <div className="ordi-formstep__actions">
                <button
                  className="ordi-btn ordi-btn--ghost"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </button>
                <button
                  className="ordi-btn ordi-btn--primary"
                  onClick={() => setDone(true)}
                >
                  {t.cta.place_order} — {formatPrice(total)} {t.currency}
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="ordi-checkout__summary">
          <MonoTag>↘ {lang === 'en' ? 'Your order' : 'คำสั่งซื้อของคุณ'}</MonoTag>
          {cart.length === 0 && <p style={{ opacity: 0.6 }}>{t.empty_cart}</p>}
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
              {ship === 0
                ? lang === 'en'
                  ? 'Free'
                  : 'ฟรี'
                : `${ship} ${t.currency}`}
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
