'use client'

import Link from 'next/link'
import { useState } from 'react'
import { products } from '@/lib/data/products'
import { getProductImage } from '@/lib/data/product-images'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'
import { BottleSlot } from '@/components/ui/BottleSlot'
import { cn, formatPrice, isDarkHue } from '@/lib/utils'
import type { Product } from '@/types/product'

type Props = { product: Product }

export function ProductDetail({ product: p }: Props) {
  const { t, lang, wishlist, toggleWishlist } = useApp()
  const [size, setSize] = useState(p.sizes[0].ml)
  const [hoverNote, setHoverNote] = useState<string | null>(null)
  const selectedSize = p.sizes.find((s) => s.ml === size) ?? p.sizes[0]
  const saved = wishlist.includes(p.id)
  const isSoon = p.status === 'coming-soon'
  const dark = isDarkHue(p.hue)

  const others = products.filter((x) => x.id !== p.id).slice(0, 3)

  return (
    <main className="ordi-product">
      <div className="ordi-product__crumbs">
        <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> /{' '}
        <span>{p.name}</span>
      </div>

      <section className="ordi-product__top">
        <div className="ordi-product__media" style={{ background: p.hue }}>
          <BottleSlot
            image={getProductImage(p.id)}
            placeholder={`${p.name} — large editorial bottle shot`}
            alt={`${p.name} ${p.number} — editorial bottle shot`}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div className={cn('ordi-product__media-num', dark && 'is-dark')}>
            {p.number}
          </div>
          <div className={cn('ordi-product__media-corner', dark && 'is-dark')}>
            <MonoTag>50 ML · EAU DE PARFUM</MonoTag>
            <MonoTag>{t.origin.toUpperCase()}</MonoTag>
          </div>
        </div>

        <div className="ordi-product__panel">
          <div className="ordi-product__head">
            <MonoTag>
              {p.number} · {p.family[lang]}
            </MonoTag>
            {isSoon && (
              <MonoTag className="is-soon">{t.coming_soon.toUpperCase()}</MonoTag>
            )}
          </div>
          <h1 className="ordi-product__name">{p.name}</h1>
          <p className="ordi-product__tagline">
            <em>{p.tagline[lang]}</em>
          </p>

          <div className="ordi-product__story">
            <MonoTag>↘ {t.product.story}</MonoTag>
            <p>{p.story[lang]}</p>
          </div>

          <div className="ordi-product__sizes">
            <MonoTag>{t.product.select_size}</MonoTag>
            <div className="ordi-product__sizebtns">
              {p.sizes.map((s) => (
                <button
                  key={s.ml}
                  className={cn('ordi-sizebtn', size === s.ml && 'is-active')}
                  onClick={() => setSize(s.ml)}
                >
                  <div className="ordi-sizebtn__ml">{s.ml} ml</div>
                  <div className="ordi-sizebtn__price">
                    {formatPrice(s.price)} {t.currency}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="ordi-product__actions">
            {isSoon ? (
              <button
                className="ordi-btn ordi-btn--primary ordi-btn--lg"
                disabled
              >
                {t.cta.sold_out} — {formatPrice(selectedSize.price)} {t.currency}
              </button>
            ) : (
              <a
                className="ordi-btn ordi-btn--primary ordi-btn--lg"
                href="https://shopee.co.th/ordi.bkk#product_list"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.cta.shop_online} — {formatPrice(selectedSize.price)} {t.currency}
              </a>
            )}
            <button
              className={cn('ordi-btn ordi-btn--icon', saved && 'is-saved')}
              onClick={() => toggleWishlist(p.id)}
              title={saved ? t.cta.wishlisted : t.cta.wishlist}
            >
              {saved ? '♥' : '♡'}
            </button>
          </div>

          <ul className="ordi-product__perks">
            <li>
              <MonoTag>✓</MonoTag>
              {t.product.included}
            </li>
            <li>
              <MonoTag>✓</MonoTag>
              {t.product.ships}
            </li>
            <li>
              <MonoTag>✓</MonoTag>
              {lang === 'en'
                ? 'Hand-bottled · numbered batch'
                : 'บรรจุด้วยมือ · ระบุหมายเลขล็อต'}
            </li>
          </ul>
        </div>
      </section>

      <section className="ordi-pyramid">
        <header className="ordi-pyramid__head">
          <MonoTag>↘ {t.product.notes_title.toUpperCase()}</MonoTag>
          <h2 className="ordi-display-md">
            <em>How it</em> unfolds.
          </h2>
        </header>
        <div className="ordi-pyramid__grid">
          {(
            [
              {
                key: 'top',
                label: t.product.top,
                notes: p.notes.top,
                desc:
                  lang === 'en'
                    ? 'The first impression — what you smell when the spray lands.'
                    : 'ความประทับใจแรก — กลิ่นที่คุณได้รับเมื่อสเปรย์ลงสู่ผิว',
              },
              {
                key: 'heart',
                label: t.product.heart,
                notes: p.notes.heart,
                desc:
                  lang === 'en'
                    ? 'The character. What people notice across the table.'
                    : 'ตัวตนของกลิ่น สิ่งที่คนสังเกตเห็นข้ามโต๊ะ',
              },
              {
                key: 'base',
                label: t.product.base,
                notes: p.notes.base,
                desc:
                  lang === 'en'
                    ? 'What stays on the pillow. The reason they ask.'
                    : 'สิ่งที่ติดบนหมอน เหตุผลที่พวกเขาถาม',
              },
            ] as const
          ).map((layer, i) => (
            <div
              className={cn(
                'ordi-pyramid__layer',
                hoverNote === layer.key && 'is-hover'
              )}
              key={layer.key}
              onMouseEnter={() => setHoverNote(layer.key)}
              onMouseLeave={() => setHoverNote(null)}
            >
              <div className="ordi-pyramid__layerhead">
                <MonoTag>0{i + 1}</MonoTag>
                <h3>{layer.label}</h3>
              </div>
              <ul className="ordi-pyramid__notes">
                {layer.notes.map((n, j) => (
                  <li key={j} className="ordi-pyramid__note">
                    <span className="ordi-pyramid__notebullet">∙</span>
                    {n}
                  </li>
                ))}
              </ul>
              <p className="ordi-pyramid__desc">{layer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ordi-section ordi-companion">
        <SectionHead
          kicker="↘ ALSO IN THE COLLECTION"
          title={
            <span>
              Other
              <br />
              <em>versions</em> of you.
            </span>
          }
          right={
            <Link href="/shop" className="ordi-btn ordi-btn--ghost">
              See all five →
            </Link>
          }
        />
        <div className="ordi-companion__grid">
          {others.map((o) => (
            <Link className="ordi-pcard" key={o.id} href={`/shop/${o.id}`}>
              <div className="ordi-pcard__media" style={{ background: o.hue }}>
                <BottleSlot
                  image={getProductImage(o.id)}
                  placeholder={o.name}
                  alt={`${o.name} ${o.number}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="ordi-pcard__num">{o.number}</div>
              </div>
              <div className="ordi-pcard__meta">
                <div className="ordi-pcard__top">
                  <h3 className="ordi-pcard__name">{o.name}</h3>
                  <div className="ordi-pcard__price">
                    {formatPrice(o.sizes[0].price)} {t.currency}
                  </div>
                </div>
                <p className="ordi-pcard__tagline">
                  <em>{o.tagline[lang]}</em>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
