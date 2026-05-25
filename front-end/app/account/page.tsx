'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { BottleSlot } from '@/components/ui/BottleSlot'
import { cn } from '@/lib/utils'

type Mode = 'sign-in' | 'sign-up'

export default function AccountPage() {
  const { lang, t } = useApp()
  const [mode, setMode] = useState<Mode>('sign-in')
  const [signed, setSigned] = useState(false)

  if (signed) {
    return (
      <main className="ordi-account">
        <header className="ordi-account__signed-head">
          <div>
            <MonoTag>MEMBER · ORDI-M-1289</MonoTag>
            <h1 className="ordi-display-lg">
              {lang === 'en' ? (
                <span>
                  Welcome back, <em>P</em>.
                </span>
              ) : (
                <span>
                  ยินดีต้อนรับกลับมา <em>P</em>
                </span>
              )}
            </h1>
          </div>
          <button
            className="ordi-btn ordi-btn--ghost"
            onClick={() => setSigned(false)}
          >
            {lang === 'en' ? 'Sign out' : 'ออกจากระบบ'}
          </button>
        </header>
        <div className="ordi-account__signed-grid">
          <article className="ordi-acard">
            <MonoTag>↘ ORDERS</MonoTag>
            <h2 className="ordi-display-sm">Recent</h2>
            <ul className="ordi-orderlist">
              <li>
                <span>ORDI-48201</span>
                <span>GOOD BOY 50ml</span>
                <span>{lang === 'en' ? 'Delivered' : 'ส่งแล้ว'}</span>
                <span>1,890</span>
              </li>
              <li>
                <span>ORDI-47889</span>
                <span>SEA BREEZE 12ml</span>
                <span>{lang === 'en' ? 'In transit' : 'กำลังจัดส่ง'}</span>
                <span>690</span>
              </li>
              <li>
                <span>ORDI-47012</span>
                <span>DROWNING LOVE 50ml</span>
                <span>{lang === 'en' ? 'Delivered' : 'ส่งแล้ว'}</span>
                <span>1,890</span>
              </li>
            </ul>
          </article>
          <article className="ordi-acard">
            <MonoTag>↘ WISHLIST</MonoTag>
            <h2 className="ordi-display-sm">Saved</h2>
            <ul className="ordi-orderlist">
              <li>
                <span>N°02</span>
                <span>HOT DILF 50ml</span>
                <span>—</span>
                <span>1,890</span>
              </li>
              <li>
                <span>N°05</span>
                <span>SKIN SCENT 50ml</span>
                <span>{t.coming_soon.toUpperCase()}</span>
                <span>2,190</span>
              </li>
            </ul>
          </article>
          <article className="ordi-acard ordi-acard--member">
            <MonoTag>↘ MEMBERSHIP</MonoTag>
            <div className="ordi-tier">
              <span>TIER</span>
              <h2 className="ordi-display-lg">
                <em>Ous</em>
              </h2>
              <span>2 of 3 orders to next tier</span>
            </div>
            <div className="ordi-tier__bar">
              <div style={{ width: '66%' }}></div>
            </div>
            <Link
              href="/membership"
              className="ordi-btn ordi-btn--ghost ordi-btn--sm"
            >
              View benefits →
            </Link>
          </article>
          <article className="ordi-acard">
            <MonoTag>↘ ADDRESSES</MonoTag>
            <div className="ordi-addr">
              <div>P. Sukhumvit</div>
              <div>61/2 Sukhumvit Soi 31</div>
              <div>Wattana, Bangkok 10110</div>
              <div>+66 8• ••• ••••</div>
            </div>
          </article>
        </div>
      </main>
    )
  }

  return (
    <main className="ordi-account">
      <div className="ordi-auth">
        <div className="ordi-auth__media">
          <BottleSlot placeholder="Quiet still life — bottle, paper" />
          <div className="ordi-auth__caption">
            <MonoTag>NOT REQUIRED TO SHOP</MonoTag>
            <p>
              <em>Members</em> receive a sample card with every order and quiet access
              to new collections.
            </p>
          </div>
        </div>
        <div className="ordi-auth__form">
          <div className="ordi-auth__tabs">
            <button
              className={cn(mode === 'sign-in' && 'is-active')}
              onClick={() => setMode('sign-in')}
            >
              {t.cta.sign_in}
            </button>
            <button
              className={cn(mode === 'sign-up' && 'is-active')}
              onClick={() => setMode('sign-up')}
            >
              {t.cta.sign_up}
            </button>
          </div>
          <h1 className="ordi-display-md">
            {mode === 'sign-in'
              ? lang === 'en'
                ? <span>Welcome <em>back</em>.</span>
                : <span><em>ยินดีต้อนรับ</em>กลับมา</span>
              : lang === 'en'
                ? <span>Become <em>Ous</em>.</span>
                : <span>เป็น <em>Ous</em></span>}
          </h1>
          {mode === 'sign-up' && (
            <div className="ordi-form-row">
              <label>
                <span>{lang === 'en' ? 'First name' : 'ชื่อ'}</span>
                <input />
              </label>
              <label>
                <span>{lang === 'en' ? 'Last name' : 'นามสกุล'}</span>
                <input />
              </label>
            </div>
          )}
          <label>
            <span>{lang === 'en' ? 'Email' : 'อีเมล'}</span>
            <input placeholder="you@email" />
          </label>
          <label>
            <span>{lang === 'en' ? 'Password' : 'รหัสผ่าน'}</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <button
            className="ordi-btn ordi-btn--primary ordi-btn--full"
            onClick={() => setSigned(true)}
          >
            {mode === 'sign-in' ? t.cta.sign_in : t.cta.sign_up} →
          </button>
          {mode === 'sign-in' && (
            <a className="ordi-auth__forgot">
              {lang === 'en' ? 'Forgot password?' : 'ลืมรหัสผ่าน?'}
            </a>
          )}
          <div className="ordi-auth__or">
            <span>{lang === 'en' ? 'or' : 'หรือ'}</span>
          </div>
          <button className="ordi-btn ordi-btn--ghost ordi-btn--full">
            Continue with Google
          </button>
          <button className="ordi-btn ordi-btn--ghost ordi-btn--full">
            Continue with LINE
          </button>
        </div>
      </div>
    </main>
  )
}
