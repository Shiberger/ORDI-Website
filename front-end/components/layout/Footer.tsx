'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'

export function Footer() {
  const { t, lang, setLang } = useApp()
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
            <Link href="/contact">Contact</Link>
          </div>
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Care</div>
            <a
              href="https://shopee.co.th/ordi.bkk#product_list"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shipping
            </a>
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
        <div className="ordi-footer__lang" role="group" aria-label="Language">
          <button
            type="button"
            className={`ordi-footer__langbtn${lang === 'en' ? ' is-active' : ''}`}
            onClick={() => setLang('en')}
            aria-pressed={lang === 'en'}
          >
            EN
          </button>
          <span aria-hidden="true">·</span>
          <button
            type="button"
            className={`ordi-footer__langbtn${lang === 'th' ? ' is-active' : ''}`}
            onClick={() => setLang('th')}
            aria-pressed={lang === 'th'}
          >
            TH
          </button>
          <span aria-hidden="true">·</span>
          <span>{lang === 'en' ? 'Showing English' : 'กำลังแสดงภาษาไทย'}</span>
        </div>
      </div>
    </footer>
  )
}
