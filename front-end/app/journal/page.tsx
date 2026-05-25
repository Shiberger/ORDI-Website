'use client'

import { useApp } from '@/lib/context/AppContext'
import { journal } from '@/lib/data/journal'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'
import { BottleSlot } from '@/components/ui/BottleSlot'

const archive = [
  {
    n: 'JRN.004',
    d: '2025.11.14',
    t: { en: "Why we don't do limited editions", th: 'ทำไมเราไม่ทำลิมิเต็ดอิดิชั่น' },
  },
  {
    n: 'JRN.005',
    d: '2025.09.02',
    t: { en: 'Three perfumes I wore for ten years', th: 'น้ำหอมสามขวดที่ฉันใส่มาสิบปี' },
  },
  {
    n: 'JRN.006',
    d: '2025.07.21',
    t: { en: 'On the smell of long flights', th: 'ว่าด้วยกลิ่นของเที่ยวบินยาว' },
  },
  {
    n: 'JRN.007',
    d: '2025.05.05',
    t: { en: 'Our first 100 customers', th: 'ลูกค้าร้อยคนแรกของเรา' },
  },
] as const

export default function JournalPage() {
  const { lang } = useApp()
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
      <div className="ordi-journal__feature">
        <div className="ordi-journal__feature-media">
          <BottleSlot placeholder="Feature article — moody editorial photograph" />
        </div>
        <div className="ordi-journal__feature-copy">
          <MonoTag>
            {feature.number} · {feature.date}
          </MonoTag>
          <h2 className="ordi-display-md">{feature.title[lang]}</h2>
          <p>{feature.excerpt[lang]}</p>
          <MonoTag>↗ READ · {feature.readtime}</MonoTag>
        </div>
      </div>

      <div className="ordi-journal__list">
        {journal.slice(1).map((j) => (
          <article className="ordi-jcard ordi-jcard--list" key={j.id}>
            <div className="ordi-jcard__meta">
              <MonoTag>{j.number}</MonoTag>
              <span>{j.date}</span>
              <span>{j.readtime}</span>
            </div>
            <h3 className="ordi-jcard__title">{j.title[lang]}</h3>
            <p>{j.excerpt[lang]}</p>
            <MonoTag>↗ READ</MonoTag>
          </article>
        ))}
      </div>

      <section className="ordi-journal__archive">
        <SectionHead
          kicker="↘ ARCHIVE"
          title={
            <span>
              <em>Older</em> entries.
            </span>
          }
        />
        <ul className="ordi-archive">
          {archive.map((a, i) => (
            <li key={i}>
              <MonoTag>{a.n}</MonoTag>
              <span className="ordi-archive__t">{a.t[lang]}</span>
              <span className="ordi-archive__d">{a.d}</span>
              <span className="ordi-archive__arrow">→</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
