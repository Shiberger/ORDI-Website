'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { BottleSlot } from '@/components/ui/BottleSlot'
import FeatureImage from '@/assets/journal/cloud-fon_feature_article.webp'

export default function JournalPage() {
  const { lang, journal } = useApp()
  const feature = journal[0]
  return (
    <main className="ordi-journal">
      <header className="ordi-journal__head">
        <MonoTag>↘ JOURNAL · NOTES FROM THE STUDIO</MonoTag>
        <h1 className="ordi-display-xl">
          {lang === 'en' ? (
            <span>
              Slowly,
              <br />
              <em>about</em>
              <br />
              smelling.
            </span>
          ) : (
            <span>
              ช้าๆ
              <br />
              <em>เกี่ยวกับ</em>
              <br />
              การได้กลิ่น
            </span>
          )}
        </h1>
      </header>
      <Link href={`/journal/${feature.slug}`} className="ordi-journal__feature">
        <div className="ordi-journal__feature-media">
          <BottleSlot
            placeholder="Feature article"
            image={FeatureImage}
            alt={feature.title[lang]}
            sizes="(max-width: 768px) 100vw, 760px"
            quality={90}
          />
        </div>
        <div className="ordi-journal__feature-copy">
          <MonoTag>
            {feature.number} · {feature.date}
          </MonoTag>
          <h2 className="ordi-display-md">{feature.title[lang]}</h2>
          <p>{feature.excerpt[lang]}</p>
          <MonoTag>↗ READ · {feature.readtime}</MonoTag>
        </div>
      </Link>

      <div className="ordi-journal__list">
        {journal.slice(1).map((j) => (
          <Link href={`/journal/${j.slug}`} className="ordi-jcard ordi-jcard--list" key={j.id}>
            <div className="ordi-jcard__meta">
              <MonoTag>{j.number}</MonoTag>
              <span>{j.date}</span>
              <span>{j.readtime}</span>
            </div>
            <h3 className="ordi-jcard__title">{j.title[lang]}</h3>
            <p>{j.excerpt[lang]}</p>
            <MonoTag>↗ READ</MonoTag>
          </Link>
        ))}
      </div>
    </main>
  )
}
