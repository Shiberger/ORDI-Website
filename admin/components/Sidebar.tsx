'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/orders', label: 'Orders' },
  { href: '/products', label: 'Products' },
  { href: '/journal', label: 'Journal' },
] as const

type Props = {
  email: string
  role: string
  pendingOrders: number
}

export function Sidebar({ email, role, pendingOrders }: Props) {
  const pathname = usePathname()

  return (
    <nav className="sidebar">
      <div className="sidebar__brand">
        ORDI
        <small>Studio dashboard</small>
      </div>

      <div className="sidebar__nav">
        {LINKS.map((link) => {
          const active =
            link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar__link${active ? ' is-active' : ''}`}
            >
              <span>{link.label}</span>
              {link.href === '/orders' && pendingOrders > 0 && (
                <span className="sidebar__badge">{pendingOrders}</span>
              )}
            </Link>
          )
        })}
      </div>

      <div className="sidebar__foot">
        <div className="sidebar__user">
          {email}
          <br />
          {role}
        </div>
        <form action="/auth/signout" method="post">
          <button className="btn btn--sm" style={{ width: '100%' }}>
            Sign out
          </button>
        </form>
      </div>
    </nav>
  )
}
