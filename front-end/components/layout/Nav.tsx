'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useApp } from '@/lib/context/AppContext'
import { cn } from '@/lib/utils'

export function Nav() {
  const { cartCount, setDrawerOpen, t } = useApp()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '/shop', label: t.nav.shop },
    { href: '/journal', label: t.nav.journal },
    { href: '/about', label: t.nav.about },
    { href: '/account', label: t.nav.account },
  ]

  return (
    <header className={cn('ordi-nav', scrolled && 'ordi-nav--scrolled')}>
      <div className="ordi-nav__inner">
        <div className="ordi-nav__left">
          <Link href="/" className="ordi-nav__brand">
            <span className="ordi-nav__brand-mark ordi-wordmark">
              <span className="ordi-wordmark__o">O</span>RDI
            </span>
            <span className="ordi-nav__brand-full">OUT OF ORDINARY ONLY OUS</span>
          </Link>
        </div>
        <nav className="ordi-nav__center">
          {links.map((l) => {
            const isActive = pathname === l.href || pathname.startsWith(`${l.href}/`)
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn('ordi-nav__link', isActive && 'is-active')}
              >
                {l.label}
              </Link>
            )
          })}
        </nav>
        <div className="ordi-nav__right">
          <button className="ordi-nav__cart" onClick={() => setDrawerOpen(true)}>
            <span>{t.nav.cart}</span>
            <span className="ordi-nav__cart-count">[{String(cartCount).padStart(2, '0')}]</span>
          </button>
        </div>
      </div>
    </header>
  )
}
