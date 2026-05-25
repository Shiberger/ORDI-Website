'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'

export function Footer() {
  const { t, lang } = useApp()
  return (
    <footer className="ordi-footer">
      <div className="ordi-footer__top">
        <div className="ordi-footer__brand">
          <div className="ordi-footer__brandmark ordi-wordmark">
            <span className="ordi-wordmark__o">O</span>RDI
          </div>
          <div className="ordi-footer__brandsub">{t.brand_full}</div>
        </div>
        <div className="ordi-footer__cols">
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Shop</div>
            <Link href="/shop">All fragrances</Link>
            <Link href="/shop">50 ml</Link>
            <Link href="/shop">12 ml travel</Link>
            <Link href="/shop">Discovery set</Link>
          </div>
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Company</div>
            <Link href="/about">About</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/membership">Membership</Link>
            <a>Contact</a>
          </div>
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Care</div>
            <a>Shipping</a>
            <a>Returns</a>
            <a>How to wear</a>
            <a>FAQ</a>
          </div>
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Newsletter</div>
            <div className="ordi-footer__news">
              <input placeholder="your@email" />
              <button type="button">→</button>
            </div>
            <div className="ordi-footer__newssub">Slow updates. Never daily.</div>
          </div>
        </div>
      </div>
      <div className="ordi-footer__bottom">
        <div>© ORDI ATELIER {new Date().getFullYear()}</div>
        <div className="ordi-footer__origin">{t.origin}</div>
        <div>EN · TH · {lang === 'en' ? 'Showing English' : 'กำลังแสดงภาษาไทย'}</div>
      </div>
    </footer>
  )
}
