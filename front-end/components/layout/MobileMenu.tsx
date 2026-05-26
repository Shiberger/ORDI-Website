'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useApp } from '@/lib/context/AppContext'
import { cn } from '@/lib/utils'

export function MobileMenu() {
  const { menuOpen, setMenuOpen, setDrawerOpen, cartCount, t } = useApp()
  const pathname = usePathname()

  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, setMenuOpen])

  const links = [
    { href: '/shop', label: t.nav.shop },
    { href: '/journal', label: t.nav.journal },
    { href: '/about', label: t.nav.about },
    { href: '/contact', label: t.nav.contact },
  ]

  const close = () => setMenuOpen(false)

  const openCart = () => {
    setMenuOpen(false)
    setDrawerOpen(true)
  }

  return (
    <div
      className={cn('ordi-mobilemenu', menuOpen && 'is-open')}
      role="dialog"
      aria-modal="true"
      aria-hidden={!menuOpen}
    >
      <header className="ordi-mobilemenu__head">
        <Link href="/" onClick={close} className="ordi-mobilemenu__brand ordi-wordmark">
          <span className="ordi-wordmark__o">O</span>RDI
        </Link>
        <button
          type="button"
          className="ordi-mobilemenu__close"
          aria-label="Close menu"
          onClick={close}
        >
          Close ✕
        </button>
      </header>

      <nav className="ordi-mobilemenu__links">
        {links.map((l) => {
          const isActive = pathname === l.href || pathname.startsWith(`${l.href}/`)
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={close}
              className={cn('ordi-mobilemenu__link', isActive && 'is-active')}
            >
              {l.label}
            </Link>
          )
        })}
      </nav>

      <footer className="ordi-mobilemenu__foot">
        <button type="button" className="ordi-mobilemenu__cart" onClick={openCart}>
          <span>{t.nav.cart}</span>
          <span>[{String(cartCount).padStart(2, '0')}]</span>
        </button>
        <span className="ordi-mobilemenu__origin">{t.origin}</span>
      </footer>
    </div>
  )
}
