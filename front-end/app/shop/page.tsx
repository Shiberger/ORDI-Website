'use client'

import Link from 'next/link'
import { useState } from 'react'
import { products } from '@/lib/data/products'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { cn, formatPrice } from '@/lib/utils'

type Filter = 'all' | 'available' | 'coming-soon'

export default function ShopPage() {
  const { t, lang } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [hover, setHover] = useState<string | null>(null)

  return (
    <main className="ordi-shop">
      <header className="ordi-shop__head">
        <div>
          <MonoTag>THE COLLECTION</MonoTag>
          <h1 className="ordi-display-lg">
            All <em>fragrances</em>.
          </h1>
        </div>
        <div className="ordi-shop__filters">
          {(
            [
              { id: 'all', label: lang === 'en' ? 'All' : 'ทั้งหมด' },
              { id: 'available', label: lang === 'en' ? 'In stock' : 'พร้อมส่ง' },
              { id: 'coming-soon', label: t.coming_soon },
            ] as { id: Filter; label: string }[]
          ).map((f) => (
            <button
              key={f.id}
              className={cn('ordi-shop__filter', filter === f.id && 'is-active')}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <table className="ordi-shop__table">
        <thead>
          <tr>
            <th style={{ width: '60px' }}>N°</th>
            <th>{lang === 'en' ? 'Fragrance' : 'น้ำหอม'}</th>
            <th>{t.product.family}</th>
            <th>{lang === 'en' ? 'Heart notes' : 'กลิ่นกลาง'}</th>
            <th style={{ textAlign: 'right' }}>{lang === 'en' ? 'From' : 'เริ่มต้น'}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products
            .filter((p) => filter === 'all' || p.status === filter)
            .map((p) => (
              <tr
                key={p.id}
                className={cn(
                  'ordi-shop__row',
                  p.status === 'coming-soon' && 'is-soon',
                  hover === p.id && 'is-hover'
                )}
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
              >
                <td className="ordi-shop__cell-num">
                  <Link href={`/shop/${p.id}`}>{p.number}</Link>
                </td>
                <td>
                  <Link href={`/shop/${p.id}`}>
                    <div className="ordi-shop__name">{p.name}</div>
                    <div className="ordi-shop__taglinerow">
                      <em>{p.tagline[lang]}</em>
                    </div>
                  </Link>
                </td>
                <td className="ordi-shop__family">{p.family[lang]}</td>
                <td className="ordi-shop__notes">{p.notes.heart.join(' · ')}</td>
                <td className="ordi-shop__price">
                  {formatPrice(p.sizes[1].price)} {t.currency}
                </td>
                <td className="ordi-shop__cta">
                  <Link href={`/shop/${p.id}`}>
                    {p.status === 'coming-soon' ? (
                      <span className="ordi-mono-tag">
                        {t.coming_soon.toUpperCase()} →
                      </span>
                    ) : (
                      <span className="ordi-mono-tag">VIEW →</span>
                    )}
                  </Link>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </main>
  )
}
