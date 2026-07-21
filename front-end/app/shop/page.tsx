'use client'

import Link from 'next/link'
import { useState } from 'react'
import { getProductImage } from '@/lib/data/product-images'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { BottleSlot } from '@/components/ui/BottleSlot'
import { cn, formatPrice, isDarkHue } from '@/lib/utils'

type Filter = 'all' | 'available' | 'coming-soon'

export default function ShopPage() {
  const { t, lang, products } = useApp()
  const [filter, setFilter] = useState<Filter>('all')
  const [hover, setHover] = useState<string | null>(null)

  const visible = products.filter((p) => filter === 'all' || p.status === filter)
  // With the whole collection shipping there is nothing behind this tab, so it
  // only appears once something is actually upcoming again.
  const hasUpcoming = products.some((p) => p.status === 'coming-soon')

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
              ...(hasUpcoming ? [{ id: 'coming-soon', label: t.coming_soon }] : []),
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
          {visible.map((p) => {
              const isSoon = p.status === 'coming-soon'
              return (
                <tr
                  key={p.id}
                  className={cn(
                    'ordi-shop__row',
                    isSoon && 'is-soon',
                    hover === p.id && 'is-hover'
                  )}
                  onMouseEnter={() => setHover(p.id)}
                  onMouseLeave={() => setHover(null)}
                >
                  <td className="ordi-shop__cell-num">
                    {isSoon ? (
                      <span>{p.number}</span>
                    ) : (
                      <Link href={`/shop/${p.id}`}>{p.number}</Link>
                    )}
                  </td>
                  <td>
                    {isSoon ? (
                      <span>
                        <div className="ordi-shop__name">{p.name}</div>
                        <div className="ordi-shop__taglinerow">
                          <em>{p.tagline[lang]}</em>
                        </div>
                      </span>
                    ) : (
                      <Link href={`/shop/${p.id}`}>
                        <div className="ordi-shop__name">{p.name}</div>
                        <div className="ordi-shop__taglinerow">
                          <em>{p.tagline[lang]}</em>
                        </div>
                      </Link>
                    )}
                  </td>
                  <td className="ordi-shop__family">{p.family[lang]}</td>
                  <td className="ordi-shop__notes">{p.notes.heart.join(' · ')}</td>
                  <td className="ordi-shop__price">
                    {formatPrice(p.sizes[1].price)} {t.currency}
                  </td>
                  <td className="ordi-shop__cta">
                    {isSoon ? (
                      <span className="ordi-mono-tag">
                        {t.coming_soon.toUpperCase()}
                      </span>
                    ) : (
                      <Link href={`/shop/${p.id}`}>
                        <span className="ordi-mono-tag">VIEW →</span>
                      </Link>
                    )}
                  </td>
                </tr>
              )
            })}
        </tbody>
      </table>

      {/* Mobile card list — the table is hidden on small screens (see globals.css),
          so this gallery carries the collection on phones. */}
      <div className="ordi-shop__gallery">
        {visible.map((p) => {
          const isSoon = p.status === 'coming-soon'
          const card = (
            <>
              <div className="ordi-galcard__media" style={{ background: p.hue }}>
                <BottleSlot
                  image={getProductImage(p)}
                  placeholder={`${p.name} — bottle on ${isDarkHue(p.hue) ? 'dark' : 'neutral'} backdrop`}
                  alt={`${p.name} ${p.number} — eau de parfum`}
                  sizes="100vw"
                />
                {isSoon && (
                  <span className="ordi-galcard__soon">{t.coming_soon.toUpperCase()}</span>
                )}
              </div>
              <div className="ordi-galcard__meta">
                <span className="ordi-galcard__name">{p.name}</span>
                <span>
                  {formatPrice(p.sizes[1].price)} {t.currency}
                </span>
              </div>
            </>
          )

          return isSoon ? (
            <div className="ordi-galcard" key={p.id}>
              {card}
            </div>
          ) : (
            <Link className="ordi-galcard" key={p.id} href={`/shop/${p.id}`}>
              {card}
            </Link>
          )
        })}
      </div>
    </main>
  )
}
