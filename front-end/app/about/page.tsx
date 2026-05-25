'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'
import { BottleSlot } from '@/components/ui/BottleSlot'

export default function AboutPage() {
  const { lang } = useApp()

  const values = [
    {
      n: '01',
      t: lang === 'en' ? 'Small batches, on purpose' : 'ผลิตเป็นล็อตเล็ก โดยตั้งใจ',
      b:
        lang === 'en'
          ? "We make 300 bottles at a time. Every label is signed by the person who filled it. If a batch isn't right, it doesn't leave the studio."
          : 'เราทำครั้งละ 300 ขวด ทุกฉลากเซ็นโดยคนที่บรรจุ หากล็อตไหนไม่ได้ มันจะไม่ออกจากสตูดิโอ',
    },
    {
      n: '02',
      t: lang === 'en' ? 'High concentration' : 'ความเข้มข้นสูง',
      b:
        lang === 'en'
          ? 'All ORDI scents are 18% extrait — eau de parfum, properly. They develop on the skin for ten to twelve hours, the way perfume is supposed to.'
          : 'ทุกกลิ่นของ ORDI มีความเข้มข้น 18% เอกซ์เทรต์ — โอเดอปาร์ฟัมอย่างถูกต้อง พัฒนาบนผิวสิบถึงสิบสองชั่วโมง ตามที่น้ำหอมควรจะเป็น',
    },
    {
      n: '03',
      t: lang === 'en' ? 'Quiet, on purpose' : 'เงียบ โดยตั้งใจ',
      b:
        lang === 'en'
          ? "We don't run sales. We don't do flash drops. We make five fragrances and a sixth is coming. That's the whole catalogue."
          : 'เราไม่ลดราคา ไม่ทำการตลาดเร่งด่วน เราทำห้ากลิ่นและกลิ่นที่หกกำลังจะมา นั่นคือทั้งหมดของแคตาล็อก',
    },
  ]

  const process = [
    {
      en: 'Composition',
      th: 'การประพันธ์',
      d: 'Two to three months on the bench. Iteration on glass strips, then on skin.',
    },
    {
      en: 'Maceration',
      th: 'การหมัก',
      d: 'Eight weeks in amber glass, in the dark, at studio temperature.',
    },
    {
      en: 'Filtration',
      th: 'การกรอง',
      d: 'Cold-filtered twice. The liquid clears and the personality stays.',
    },
    {
      en: 'Bottling',
      th: 'การบรรจุ',
      d: 'By hand, in batches of 300. Numbered, signed, dated.',
    },
  ]

  return (
    <main className="ordi-about">
      <section className="ordi-about__hero">
        <MonoTag>ABOUT · EST. 2024</MonoTag>
        <h1 className="ordi-display-xl">
          <span>
            We started <em>ORDI</em>
          </span>
          <span>because most perfume</span>
          <span>
            <em>tries too hard.</em>
          </span>
        </h1>
      </section>

      <section className="ordi-about__intro">
        <div className="ordi-about__intro-media">
          <BottleSlot placeholder="Studio interior — bench, beakers, light" />
        </div>
        <div className="ordi-about__intro-copy">
          <MonoTag>↘ THE STUDIO</MonoTag>
          <p className="ordi-about__lede">
            {lang === 'en'
              ? 'ORDI is a small Bangkok perfume house, run out of a one-room studio on Sukhumvit, by two people who used to do other things. We compose, macerate, age, bottle, label, and pack every order ourselves.'
              : 'ORDI คือบ้านน้ำหอมเล็กๆ ในกรุงเทพ ดำเนินการในสตูดิโอห้องเดียวบนถนนสุขุมวิท โดยสองคนที่เคยทำอย่างอื่น เราประพันธ์ หมัก บ่ม บรรจุ ติดฉลาก และส่งสินค้าทุกคำสั่งซื้อด้วยตัวเอง'}
          </p>
          <p>
            {lang === 'en'
              ? "The name comes from a quiet idea: that being out of the ordinary doesn't mean being loud. The best perfumes don't announce themselves. They wait."
              : 'ชื่อมาจากแนวคิดเงียบๆ ว่า การไม่ธรรมดาไม่ได้แปลว่าต้องเสียงดัง น้ำหอมที่ดีที่สุดไม่ประกาศตัวเอง พวกมันรอ'}
          </p>
        </div>
      </section>

      <section className="ordi-about__values">
        {values.map((v, i) => (
          <article key={i}>
            <MonoTag>N°{v.n}</MonoTag>
            <h3 className="ordi-display-sm">
              <em>{v.t}</em>
            </h3>
            <p>{v.b}</p>
          </article>
        ))}
      </section>

      <section className="ordi-about__process">
        <SectionHead
          kicker="↘ HOW WE WORK"
          title={
            <span>
              From the bench
              <br />
              to <em>your wrist</em>.
            </span>
          }
        />
        <ol className="ordi-process">
          {process.map((s, i) => (
            <li key={i}>
              <MonoTag>0{i + 1}</MonoTag>
              <div className="ordi-process__name">{lang === 'en' ? s.en : s.th}</div>
              <div className="ordi-process__desc">{s.d}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ordi-about__founders">
        <div className="ordi-about__founders-media">
          <BottleSlot placeholder="Two founders, casual editorial portrait" />
        </div>
        <div className="ordi-about__founders-copy">
          <MonoTag>↘ THE TWO OF US</MonoTag>
          <h2 className="ordi-display-md">
            <em>P. &amp; A.</em>
          </h2>
          <p>
            {lang === 'en'
              ? 'P. trained at an indie perfumery house in Grasse and came home to Bangkok in 2023. A. used to work in fashion. They share a one-room studio and a small black cat named Ous.'
              : 'P. ฝึกที่บ้านน้ำหอมอิสระในกราสและกลับมากรุงเทพในปี 2023 A. เคยทำงานในวงการแฟชั่น พวกเขาแบ่งสตูดิโอห้องเดียวและแมวดำตัวเล็กชื่อ Ous'}
          </p>
          <Link href="/journal" className="ordi-btn ordi-btn--ghost">
            Read the journal →
          </Link>
        </div>
      </section>
    </main>
  )
}
