'use client'

import Link from 'next/link'
import type { StaticImageData } from 'next/image'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { BottleSlot } from '@/components/ui/BottleSlot'
import type { JournalEntry } from '@/types/product'
import Jrn000 from '@/assets/journal/jrn-000.png'
import Jrn001 from '@/assets/journal/jrn-001.png'
import Jrn002 from '@/assets/journal/jrn-002.png'
import Jrn003 from '@/assets/journal/jrn-003.png'

const heroImageBySlug: Record<string, StaticImageData> = {
  'ordi-perfume-for-ordinary-people': Jrn000,
  'good-boy-hot-dilf-two-versions-of-warmth': Jrn001,
  'two-ways-of-feeling-close': Jrn002,
  'cloud-fon-scent-of-air': Jrn003,
}

type Props = { entry: JournalEntry; related: JournalEntry[] }

export function JournalArticle({ entry, related }: Props) {
  const { lang } = useApp()
  const splitParagraphs = (text: string) =>
    text
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
  const paragraphs = splitParagraphs(entry.body[lang])
  const paragraphs2 = entry.body2 ? splitParagraphs(entry.body2[lang]) : []

  return (
    <main className="ordi-jpost">
      <nav className="ordi-jpost__crumbs">
        <Link href="/journal">
          <MonoTag>↖ BACK TO JOURNAL</MonoTag>
        </Link>
      </nav>

      <header className="ordi-jpost__head">
        <MonoTag>
          {entry.number} · {entry.date} · {entry.readtime}
        </MonoTag>
        <h1 className="ordi-display-lg">{entry.title[lang]}</h1>
      </header>

      <div className="ordi-jpost__media">
        <BottleSlot
          placeholder={`${entry.number} — editorial photograph`}
          image={heroImageBySlug[entry.slug]}
          alt={entry.title[lang]}
          sizes="(max-width: 768px) 100vw, 1100px"
          quality={90}
          priority
        />
      </div>

      <article className="ordi-jpost__body">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </article>

      {paragraphs2.length > 0 && (
        <article className="ordi-jpost__body">
          {paragraphs2.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
      )}

      {related.length > 0 && (
        <section className="ordi-jpost__related">
          <MonoTag>↘ MORE FROM THE JOURNAL</MonoTag>
          <div className="ordi-jpost__related-list">
            {related.map((r) => (
              <Link href={`/journal/${r.slug}`} key={r.id} className="ordi-jcard ordi-jcard--list">
                <div className="ordi-jcard__meta">
                  <MonoTag>{r.number}</MonoTag>
                  <span>{r.date}</span>
                  <span>{r.readtime}</span>
                </div>
                <h3 className="ordi-jcard__title">{r.title[lang]}</h3>
                <p>{r.excerpt[lang]}</p>
                <MonoTag>↗ READ</MonoTag>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
