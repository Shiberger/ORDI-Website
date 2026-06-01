'use client'

import Link from 'next/link'
import { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { useApp } from '@/lib/context/AppContext'
import { products } from '@/lib/data/products'
import { getProductImage } from '@/lib/data/product-images'
import { journal } from '@/lib/data/journal'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'
import { Marquee } from '@/components/ui/Marquee'
import { BottleSlot } from '@/components/ui/BottleSlot'
import { formatPrice, isDarkHue } from '@/lib/utils'
import PhiwfonHero from '@/assets/journal/phiwfon_feature_article.png'

gsap.registerPlugin(SplitText)

export default function HomePage() {
  const { t, lang } = useApp()
  const featured = products.slice(0, 4)
  const skin = products.find((p) => p.id === 'phiwfon')
  const phiwfon = journal.find((j) => j.slug === 'phiwfon-scent-of-air')
  const mainRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) {
        gsap.set(
          '.ordi-hero__line, .ordi-hero__meta, .ordi-hero__bottom, .ordi-hero__foot',
          { opacity: 1, y: 0 },
        )
        return
      }

      const lines = gsap.utils.toArray<HTMLElement>('.ordi-hero__line')
      const splits = lines.map((line) => SplitText.create(line, { type: 'chars,words' }))

      const tl = gsap.timeline()
      tl.to('.ordi-hero__meta', { opacity: 1, duration: 0.4 }, 0)

      splits.forEach((split, i) => {
        gsap.set(lines[i], { opacity: 1 })
        tl.from(
          split.chars,
          { opacity: 0, y: 14, duration: 0.55, stagger: 0.012 },
          0.1 + i * 0.18,
        )
      })

      tl.to('.ordi-hero__bottom', { opacity: 1, duration: 0.5 }, 0.75)
      tl.to('.ordi-hero__foot', { opacity: 1, duration: 0.5 }, 0.9)

      return () => {
        splits.forEach((s) => s.revert())
      }
    },
    { scope: mainRef },
  )

  return (
    <main className="ordi-home" ref={mainRef}>
      {/* HERO */}
      <section className="ordi-hero">
        <div className="ordi-hero__poster">
          <div className="ordi-hero__meta">
            <MonoTag>EST. BANGKOK / 2025</MonoTag>
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
                ? "Fragrances. One small studio in Bangkok. Perfume for people who don't want to smell like everyone else and aren't quite sure what they do want to smell like."
                : 'สตูดิโอเล็กๆ ในกรุงเทพ น้ำหอมสำหรับคนที่ไม่อยากมีกลิ่นเหมือนใคร และยังไม่แน่ใจว่าตัวเองอยากมีกลิ่นแบบไหน'}
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
          'FRAGRANCES',
          'MADE BY HAND IN BANGKOK',
          'NICHE PERFUMERY',
          'EAU DE PARFUM',
          'CRUELTY-FREE',
          'OUT OF ORDINARY ONLY OUS',
        ]}
        speed={45}
      />

      {/* COLLECTION GRID */}
      <section className="ordi-section ordi-collection" data-reveal>
        <SectionHead
          kicker="↘ THE COLLECTION · N°01—N°05"
          title={
            <span>
              Fragrances,
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
                  : 'ทุกกลิ่นถูกวางองค์ประกอบและการบ่มในสตูดิโอย่านสุขุมวิทของเรา บ่มหกสิบวัน บรรจุในขนาดห้าสิบหรือสิบสองมิลลิลิตร'}
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
                  image={getProductImage(p.id)}
                  placeholder={`${p.name} — bottle on ${isDarkHue(p.hue) ? 'dark' : 'neutral'} backdrop`}
                  alt={`${p.name} ${p.number} — eau de parfum`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
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

      {/* PHIWFON — N°05 TEASE */}
      {skin && (
        <section className="ordi-skinscent" data-reveal>
          <div className="ordi-skinscent__grid">
            <div className="ordi-skinscent__media">
              <BottleSlot
                image={PhiwfonHero}
                placeholder="PHIWFON — moody close-up of skin / fabric"
                alt={
                  lang === 'en'
                    ? "Phiwfon — the scent of air that hasn't dried yet"
                    : 'ผิวฝน กลิ่นของอากาศที่ยังไม่แห้ง'
                }
                sizes="(max-width: 768px) 100vw, 680px"
                quality={92}
              />
              <div className="ordi-skinscent__chip">{t.coming_soon.toUpperCase()}</div>
            </div>
            <div className="ordi-skinscent__copy">
              <MonoTag>N°05 · NEW COLLECTION</MonoTag>
              <h2 className="ordi-display-lg">
                <em>{lang === 'en' ? 'Phiwfon' : 'ผิวฝน'}</em>.
              </h2>
              <p>
                {phiwfon
                  ? phiwfon.excerpt[lang]
                  : lang === 'en'
                  ? "A perfume that doesn't arrive. It is already there."
                  : 'น้ำหอมที่ไม่ได้มาถึง มันอยู่ที่นั่นแล้ว'}
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
                href="/journal/phiwfon-scent-of-air"
                className="ordi-btn ordi-btn--primary"
              >
                {t.cta.sold_out} →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* PRESS QUOTES */}
      <section className="ordi-press" data-reveal>
        <MonoTag>NOTES ABOUT US</MonoTag>
        <div className="ordi-press__grid">
          <blockquote>
            <p>
              {lang === 'en'
                ? "“The 'Frédéric Malle' of the Thai fragrance scene. True artistic creations at an incredibly accessible price.”"
                : '“ขอแต่งตั้งให้เป็น "Frédéric Malle แห่งวงการน้ำหอมไทย" นี่คือน้ำหอมที่เป็นชิ้นงานศิลปะ (Art piece) ในราคาหลักร้อย”'}
            </p>
            <cite>— Mike Scents</cite>
          </blockquote>
          <blockquote>
            <p>
              {lang === 'en'
                ? "“Wowed by every single scent. ORDI's creations are so sophisticated and intriguing a must-try.”"
                : '“ว้าวตั้งแต่กลิ่นแรกจนกลิ่นสุดท้าย ORDI ทำน้ำหอมออกมาได้มีชั้นเชิงและน่าค้นหามากครับ”'}
            </p>
            <cite>— Scented Story</cite>
          </blockquote>
          <blockquote>
            <p>
              {lang === 'en'
                ? '“A quality Thai brand for everyday use. Its unique scents are polite, elegant, yet deeply captivating.”'
                : '“แบรนด์ไทยคุณภาพ ใช้ทุกวันตัวกลิ่นหลายกลิ่นมีเอกลักษณ์แถมยังสุภาพแต่มีเสน่ห์มาก ๆ”'}
            </p>
            <cite>— Kannapas Phumiphatsiriyakorn</cite>
          </blockquote>
        </div>
      </section>

      {/* JOURNAL TEASE */}
      <section className="ordi-section" data-reveal>
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
            <Link className="ordi-jcard" key={j.id} href={`/journal/${j.slug}`}>
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
