'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'
import { products } from '@/lib/data/products'
import { journal } from '@/lib/data/journal'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'
import { Marquee } from '@/components/ui/Marquee'
import { BottleSlot } from '@/components/ui/BottleSlot'
import { formatPrice, isDarkHue } from '@/lib/utils'

export default function HomePage() {
  const { t, lang } = useApp()
  const featured = products.slice(0, 4)
  const skin = products.find((p) => p.id === 'skin-scent')

  return (
    <main className="ordi-home">
      {/* HERO */}
      <section className="ordi-hero">
        <div className="ordi-hero__poster">
          <div className="ordi-hero__meta">
            <MonoTag>EST. BANGKOK / 2024</MonoTag>
            <MonoTag>
              VOL. 05 ·{' '}
              {new Date()
                .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
                .toUpperCase()}
            </MonoTag>
          </div>

          <h1 className="ordi-hero__title">
            <span className="ordi-hero__line ordi-hero__line--1">Out of</span>
            <span className="ordi-hero__line ordi-hero__line--2">
              <em>Ordinary</em>
            </span>
            <span className="ordi-hero__line ordi-hero__line--3">Only Ous.</span>
          </h1>

          <div className="ordi-hero__bottom">
            <p className="ordi-hero__lede">
              {lang === 'en'
                ? "Five fragrances. One small studio in Bangkok. Perfume for people who don't want to smell like everyone else — and aren't quite sure what they do want to smell like."
                : 'ห้ากลิ่น สตูดิโอเล็กๆ ในกรุงเทพ น้ำหอมสำหรับคนที่ไม่อยากมีกลิ่นเหมือนใคร — และยังไม่แน่ใจว่าตัวเองอยากมีกลิ่นแบบไหน'}
            </p>
            <div className="ordi-hero__cta">
              <Link href="/shop" className="ordi-btn ordi-btn--primary">
                {t.cta.shop_all} →
              </Link>
              <Link href="/about" className="ordi-btn ordi-btn--ghost">
                The studio
              </Link>
            </div>
          </div>

          <div className="ordi-hero__foot">
            <MonoTag>↓ scroll · the collection</MonoTag>
            <MonoTag>{t.origin.toUpperCase()}</MonoTag>
          </div>
        </div>
      </section>

      <Marquee
        items={[
          'FIVE FRAGRANCES',
          'MADE BY HAND IN BANGKOK',
          'NICHE PERFUMERY',
          'EAU DE PARFUM 18%',
          'VEGAN · CRUELTY-FREE',
          'OUT OF ORDINARY ONLY OUS',
        ]}
        speed={45}
      />

      {/* COLLECTION GRID */}
      <section className="ordi-section ordi-collection">
        <SectionHead
          kicker="↘ THE COLLECTION · N°01—N°05"
          title={
            <span>
              Five fragrances,
              <br />
              one for each <em>version</em>
              <br />
              of you.
            </span>
          }
          right={
            <div className="ordi-secthead__right-inner">
              <p>
                {lang === 'en'
                  ? 'Each scent is composed and macerated in our Sukhumvit studio. Aged sixty days. Bottled in fifty milliliters or twelve.'
                  : 'ทุกกลิ่นถูกประพันธ์และหมักในสตูดิโอย่านสุขุมวิทของเรา บ่มหกสิบวัน บรรจุในขนาดห้าสิบหรือสิบสองมิลลิลิตร'}
              </p>
              <Link href="/shop" className="ordi-btn ordi-btn--ghost">
                {t.cta.shop_all} →
              </Link>
            </div>
          }
        />
        <div className="ordi-collection__grid">
          {featured.map((p) => (
            <Link className="ordi-pcard" key={p.id} href={`/shop/${p.id}`}>
              <div className="ordi-pcard__media" style={{ background: p.hue }}>
                <BottleSlot
                  placeholder={`${p.name} — bottle on ${isDarkHue(p.hue) ? 'dark' : 'neutral'} backdrop`}
                />
                <div className="ordi-pcard__num">{p.number}</div>
              </div>
              <div className="ordi-pcard__meta">
                <div className="ordi-pcard__top">
                  <h3 className="ordi-pcard__name">{p.name}</h3>
                  <div className="ordi-pcard__price">
                    {formatPrice(p.sizes[0].price)} {t.currency}
                  </div>
                </div>
                <p className="ordi-pcard__tagline">
                  <em>{p.tagline[lang]}</em>
                </p>
                <div className="ordi-pcard__notes">
                  {[...p.notes.top, ...p.notes.heart].slice(0, 3).map((n, j) => (
                    <span key={j}>{n}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SKIN SCENT TEASE */}
      {skin && (
        <section className="ordi-skinscent">
          <div className="ordi-skinscent__grid">
            <div className="ordi-skinscent__media">
              <BottleSlot placeholder="SKIN SCENT — moody close-up of skin / fabric" />
              <div className="ordi-skinscent__chip">{t.coming_soon.toUpperCase()}</div>
            </div>
            <div className="ordi-skinscent__copy">
              <MonoTag>N°05 · NEW COLLECTION</MonoTag>
              <h2 className="ordi-display-lg">
                Skin <em>Scent.</em>
              </h2>
              <p>
                {lang === 'en'
                  ? "A perfume that doesn't arrive. It is already there. The fifth in our collection — designed to live underneath, almost beneath, the people who get close enough."
                  : 'น้ำหอมที่ไม่ได้มาถึง มันอยู่ที่นั่นแล้ว กลิ่นที่ห้าในคอลเลกชั่น — ออกแบบมาให้อยู่ใต้ผิว เกือบใต้ ของคนที่เข้ามาใกล้พอ'}
              </p>
              <div className="ordi-skinscent__notes">
                <div>
                  <MonoTag>{t.product.top}</MonoTag>
                  {skin.notes.top.join(' · ')}
                </div>
                <div>
                  <MonoTag>{t.product.heart}</MonoTag>
                  {skin.notes.heart.join(' · ')}
                </div>
                <div>
                  <MonoTag>{t.product.base}</MonoTag>
                  {skin.notes.base.join(' · ')}
                </div>
              </div>
              <Link
                href={`/shop/${skin.id}`}
                className="ordi-btn ordi-btn--primary"
              >
                {t.cta.sold_out} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PRESS QUOTES */}
      <section className="ordi-press">
        <MonoTag>NOTES ABOUT US</MonoTag>
        <div className="ordi-press__grid">
          <blockquote>
            <p>
              {lang === 'en'
                ? "“Bangkok's most quietly confident new perfume house.”"
                : '“บ้านน้ำหอมหน้าใหม่ของกรุงเทพที่มั่นใจอย่างเงียบๆ ที่สุด”'}
            </p>
            <cite>— A SMALL MAGAZINE</cite>
          </blockquote>
          <blockquote>
            <p>
              {lang === 'en'
                ? "“The kind of fragrance you keep on the nightstand and won't tell anyone the name of.”"
                : '“น้ำหอมที่เก็บไว้ที่หัวเตียงและไม่บอกใครว่ามันชื่ออะไร”'}
            </p>
            <cite>— W. C., LOYAL CUSTOMER</cite>
          </blockquote>
          <blockquote>
            <p>
              {lang === 'en'
                ? '“GOOD BOY ruined every other clean fragrance for me. Sorry to all of them.”'
                : '“GOOD BOY ทำให้กลิ่นสะอาดอื่นๆ ใช้ไม่ได้แล้ว ขอโทษทุกขวด”'}
            </p>
            <cite>— TIKTOK COMMENT, ★★★★★</cite>
          </blockquote>
        </div>
      </section>

      {/* JOURNAL TEASE */}
      <section className="ordi-section">
        <SectionHead
          kicker="↘ JOURNAL"
          title={
            <span>
              Slowly, <em>about smelling</em>.
            </span>
          }
          right={
            <Link href="/journal" className="ordi-btn ordi-btn--ghost">
              Read all entries →
            </Link>
          }
        />
        <div className="ordi-journal__grid ordi-journal__grid--home">
          {journal.slice(0, 3).map((j) => (
            <Link className="ordi-jcard" key={j.id} href="/journal">
              <div className="ordi-jcard__meta">
                <MonoTag>{j.number}</MonoTag>
                <span>{j.date}</span>
              </div>
              <h3 className="ordi-jcard__title">{j.title[lang]}</h3>
              <p>{j.excerpt[lang]}</p>
              <MonoTag>↗ READ · {j.readtime}</MonoTag>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
