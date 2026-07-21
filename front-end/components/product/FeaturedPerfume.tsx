'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'
import { getProductGallery, getProductImage } from '@/lib/data/product-images'
import { MonoTag } from '@/components/ui/MonoTag'
import { BottleSlot } from '@/components/ui/BottleSlot'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

type Props = { product: Product }

/**
 * The home-page launch band — one fragrance on ink, above the collection grid,
 * so a visitor meets a whole perfume before scrolling through the catalogue.
 * Which product lands here is the `featured` flag, set from the dashboard.
 */
export function FeaturedPerfume({ product: p }: Props) {
  const { t, lang } = useApp()
  const from = p.sizes.length ? Math.min(...p.sizes.map((s) => s.price)) : null
  const href = `/shop/${p.id}`
  const isSoon = p.status === 'coming-soon'

  // A campaign still frames the band better than the catalogue crop when the
  // shoot has one; otherwise the regular bottle shot carries it.
  const art = getProductGallery(p.id)[0]?.image ?? getProductImage(p)

  const chip = isSoon ? t.coming_soon : p.status === 'sold-out' ? t.sold_out : t.now_available

  return (
    <section className="ordi-featured" data-reveal>
      <div className="ordi-featured__grid">
        <Link href={href} className="ordi-featured__media" aria-label={`${p.name} ${p.number}`}>
          <BottleSlot
            image={art}
            placeholder={`${p.name} — campaign still`}
            alt={`${p.name} ${p.number} — eau de parfum`}
            sizes="(max-width: 768px) 100vw, 680px"
            quality={92}
          />
          <span className="ordi-featured__num">{p.number}</span>
          <span className="ordi-featured__chip">{chip.toUpperCase()}</span>
        </Link>

        <div className="ordi-featured__copy">
          <MonoTag>↘ FEATURED PERFUME · {p.number}</MonoTag>

          <h2 className="ordi-display-lg">
            <em>{p.name}</em>.
          </h2>

          <p className="ordi-featured__tagline">{p.tagline[lang]}</p>
          <p>{p.story[lang]}</p>

          <div className="ordi-featured__notes">
            <div>
              <MonoTag>{t.product.top}</MonoTag>
              {p.notes.top.join(' · ')}
            </div>
            <div>
              <MonoTag>{t.product.heart}</MonoTag>
              {p.notes.heart.join(' · ')}
            </div>
            <div>
              <MonoTag>{t.product.base}</MonoTag>
              {p.notes.base.join(' · ')}
            </div>
          </div>

          <div className="ordi-featured__foot">
            <Link href={href} className="ordi-btn ordi-btn--primary">
              {isSoon ? t.cta.sold_out : t.cta.view_product} →
            </Link>
            {from !== null && !isSoon && (
              <div className="ordi-featured__price">
                <MonoTag>{lang === 'en' ? 'FROM' : 'เริ่มต้น'}</MonoTag>
                <span>
                  {formatPrice(from)} {t.currency}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
