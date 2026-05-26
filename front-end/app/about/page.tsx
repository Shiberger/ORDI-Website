'use client'

import Link from 'next/link'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'
import { BottleSlot } from '@/components/ui/BottleSlot'
import ArkaPortrait from '@/assets/co-founder/Arka.jpg'
import PlaiPortrait from '@/assets/co-founder/Plai.jpg'
import YutPortrait from '@/assets/co-founder/Warayus.jpg'
import DiskPortrait from '@/assets/co-founder/Disk.jpg'
import AmpereoPortrait from '@/assets/co-founder/Ampereo.jpg'
import SakdaPortrait from '@/assets/co-founder/Sakda.jpg'
import StudioLocation from '@/assets/location-ordi.png'

export default function AboutPage() {
  const { lang } = useApp()

  const values = [
    {
      n: '01',
      t: lang === 'en' ? 'Small batches, on purpose' : 'ผลิตเป็นล็อตเล็ก โดยตั้งใจ',
      b:
        lang === 'en'
          ? "We make a small batches at a time. Every bottle is signed by the person who filled it. If a batch isn't right, it doesn't leave the studio."
          : 'เราทำครั้งละน้อยเพื่อที่จะได้ควบคุมคุณภาพอย่างใกล้ชิด ทุก ๆ ขวดล้วนผ่านการตรวจอย่างพิธีพิถันโดยคนที่บรรจุขวดนั้น ๆ ถ้าผลิตภัณฑ์ไม่ดีพอ มันจะไม่ออกจากสตูดิโอ',
    },
    {
      n: '02',
      t: lang === 'en' ? 'High concentration' : 'ความเข้มข้นสูง',
      b:
        lang === 'en'
          ? 'All ORDI scents are 20% extrait — eau de parfum, properly. They develop on the skin for ten to twelve hours, the way perfume is supposed to.'
          : 'ทุกกลิ่นของ ORDI มีความเข้มข้น 20% เอกซ์เทรต์ — โอเดอปาร์ฟัมอย่างถูกต้อง พัฒนาบนผิวสิบถึงสิบสองชั่วโมง ตามที่น้ำหอมควรจะเป็น',
    },
    {
      n: '03',
      t: lang === 'en' ? 'Quiet, on purpose' : 'แพชชั่นจากความมุ่งมั่น',
      b:
        lang === 'en'
          ? 'We take our time crafting each fragrance with care, never rushing the process. Every product is refined again and again until we are truly confident that it is the best scent we could possibly create.'
          : 'เราตั้งใจทำแต่ละกลิ่นออกมาให้ดีที่สุดแบบไม่เร่งรีบ เราจะพัฒนาผลิตภัณฑ์ของเราจนกว่าเราจะมั่นใจได้ว่านี้คือกลิ่นที่ดีที่สุดที่',
    },
  ]

  const cofounders = [
    {
      name: 'Hannarong Kaewkiriya',
      nickname: 'Arka',
      role_en: 'Perfumer',
      role_th: 'นักปรุงน้ำหอม',
      portrait: 'Arka — perfumer, casual editorial portrait',
      image: ArkaPortrait,
      bio_en:
        'For Arka, fragrance is an atmosphere — something deeply tied to memory and a specific moment in time. It is the scent that lingers in remembrance, the scent of someone you were once speaking to. That fascination became the foundation for creating fragrances with layered dimensions that unfold differently on each individual’s skin. At ORDI, Arka leads the entire olfactive direction of the house.',
      bio_th:
        'สำหรับตัวอาก้าเอง มองน้ำหอมคือ "บรรยากาศ" ที่น่าจดจำในช่วงเวลาหนึ่งมันคีอกลิ่นในความทรงจำ กลิ่นของคน ๆ นึงที่เรากำลังพูดคุยด้วยสิ่งนี้คือสิ่งที่ทำให้เกิดความหลงใหล กลายเป็นการสร้างสรรค์กลิ่นที่มี Layer ที่แตกต่างกันเมื่อฉีดลงบนผิวของคนแต่ละคน ภายใน ORDI อาก้าดูแลทิศทางด้านกลิ่นทั้งหมดของแบรนด์',
    },
    {
      name: 'Apisak Puakvisut',
      nickname: 'Plai',
      role_en: 'Product & Operations Manager',
      role_th: 'ผู้จัดการผลิตภัณฑ์และปฏิบัติการ',
      portrait: 'Plai — operations, casual editorial portrait',
      image: PlaiPortrait,
      bio_en:
        'Plai oversees the operational rhythm behind ORDI. From sourcing materials to production timelines, he ensures every release moves with precision and consistency while preserving the studio’s small-batch philosophy.',
      bio_th:
        'ปลายดูแลจังหวะการทำงานเบื้องหลังของ ORDI ตั้งแต่วัตถุดิบ กระบวนการผลิต ไปจนถึงการจัดการแต่ละล็อต ทำให้ทุกการเปิดตัวดำเนินไปอย่างแม่นยำและสม่ำเสมอ โดยยังคงรักษาแนวคิดการผลิตแบบ small batch ของสตูดิโอไว้',
    },
    {
      name: 'Warayus Lakpeat',
      nickname: 'Yut',
      role_en: 'Creative Director',
      role_th: 'ครีเอทีฟไดเรกเตอร์',
      portrait: 'Yut — creative director, casual editorial portrait',
      image: YutPortrait,
      bio_en:
        'Yut shapes the visual and emotional language of ORDI. Influenced by cinema, contemporary fashion imagery, and landscape, he builds a world where scent, texture, and atmosphere exist as one continuous experience.',
      bio_th:
        'ยุสเป็นคนที่จัดการวิธีการใช้ภาษาทางภาพและอารมณ์ของ ORDI ภาพยนต์ แฟชั่น บรรยากาศของเมือง และภูมิสถาปัตยกรรม ก่อนนำทั้งหมดมาสร้างโลกที่กลิ่น พื้นผิว และอารมณ์เชื่อมต่อกันเป็นประสบการณ์เดียว',
    },
    {
      name: 'Disk Phorames',
      nickname: 'Disk',
      role_en: 'Brand & Marketing Strategist',
      role_th: 'นักวางกลยุทธ์แบรนด์และการตลาด',
      portrait: 'Disk — strategist, casual editorial portrait',
      image: DiskPortrait,
      bio_en:
        'Disk focuses on the long-term identity of ORDI within modern perfumery. His approach combines cultural awareness, brand positioning, and storytelling to shape how the house is perceived both locally and internationally.',
      bio_th:
        'ดิสดูแลทิศทาง ORDI ในโลกน้ำหอม ผสานความเข้าใจด้านวัฒนธรรม การวางตำแหน่งแบรนด์ และการเล่าเรื่อง เพื่อกำหนดภาพจำของ ORDI ทั้งในระดับท้องถิ่นและสากล',
    },
    {
      name: 'Pongdanai Thaipitak',
      nickname: 'Ampereo',
      role_en: 'Brand Communications',
      role_th: 'สื่อสารแบรนด์',
      portrait: 'Ampereo — brand communications, casual editorial portrait',
      image: AmpereoPortrait,
      bio_en:
        'Ampereo translates the atmosphere of ORDI into words, imagery, and conversation. Through carefully considered communication, he ensures the voice of the brand remains intimate, understated, and recognisable across every platform.',
      bio_th:
        'แอมแปร์โร่ทำหน้าที่ถ่ายทอดบรรยากาศของ ORDI ผ่านคำพูด ภาพ และการสื่อสารในรูปแบบต่าง ๆ ดูแลให้เสียงของแบรนด์ยังคงความใกล้ชิด เรียบง่าย และมีเอกลักษณ์ในทุกช่องทาง',
    },
  ]

  const process = [
    {
      en: 'Composition',
      th: 'องค์ประกอบ',
      d_en: 'Two to three months on the bench. Iteration on glass strips, then on skin.',
      d_th: 'เราพัฒนากลิ่นอยู่หลายเดือน ลองซ้ำแล้วซ้ำอีกทั้งบนกระดาษเทสต์และบนผิวจริง จนกว่าจะได้กลิ่นที่ลงตัวที่สุด',
    },
    {
      en: 'Maceration',
      th: 'การบ่ม',
      d_en: 'Eight weeks in amber glass, in the dark, at studio temperature.',
      d_th: 'แปดสัปดาห์ในขวดแก้วสีอำพัน ในที่มืด ที่อุณหภูมิห้องสตูดิโอ',
    },
    {
      en: 'Filtration',
      th: 'การกรอง',
      d_en: 'Twice cold-filtered. Pure in appearance, uncompromised in character.',
      d_th: 'เรากรองมันอย่างพิถีพิถันสองรอบ เหลือไว้แค่ความใส และคาแรกเตอร์ที่ชัดเจน',
    },
    {
      en: 'Bottling',
      th: 'การบรรจุ',
      d_en: 'By hand, small batches. Every bottle is carefully checked for quality.',
      d_th: 'บรรจุด้วยมือทีละขวด ตรวจเช็คคุณภาพอย่างละเอียดในทุกขวด',
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
          <BottleSlot
            placeholder="Studio interior — bench, beakers, light"
            image={StudioLocation}
            alt="ORDI studio — Sukhumvit, Bangkok"
          />
        </div>
        <div className="ordi-about__intro-copy">
          <MonoTag>↘ THE STUDIO</MonoTag>
          <p className="ordi-about__lede">
            {lang === 'en'
              ? 'ORDI is a small Bangkok perfume house, run out of a one-room studio on Sukhumvit, by team who used to do other things. We compose, macerate, age, bottle, label, and pack every order ourselves.'
              : 'ORDI คือบ้านน้ำหอมเล็กๆ ในกรุงเทพ ดำเนินการในสตูดิโอห้องเดียวบนถนนสุขุมวิท ทีมของเราช่วยกันเราดูองค์ประกอบของกลิ่น การเลือกใช้ วิธีการบ่ม และบรรจุอย่างพิถีพิถัน และส่งสินค้าทุกคำสั่งซื้อด้วยตัวเอง'}
          </p>
          <p>
            {lang === 'en'
              ? "ORDI comes from the idea that we are all ordinary people, each carrying something extraordinary within us. Everyone has their own character, their own quiet light. You do not have to be loud to be remembered."
              : 'ชื่อมาจากแนวคิดที่ว่าพวกเราเป็นเพียงคนธรรมดาที่ล้วนมีความไม่ธรรมดาอยู่ในตัวแต่ละคน แต่ละคนมีคาแรคเตอร์ที่แตกต่างกันออกไปมีแสงของตัวเองไม่จำเป็นต้องดังเพื่อจะได้เป็นที่จดจำ น้ำหอมที่ดีที่สุดก็เช่นกัน พวกเขาไม่จำเป็นต้องประกาศตัวเอง พวกเขารอคอยที่จะถูกค้นพบและจดจำในแบบของพวกเขาเอง'}
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
              <div className="ordi-process__desc">{lang === 'en' ? s.d_en : s.d_th}</div>
            </li>
          ))}
        </ol>
      </section>

      <div className="ordi-about__journal-cta">
        <Link href="/journal" className="ordi-btn ordi-btn--ghost">
          Read the journal →
        </Link>
      </div>

      <section className="ordi-about__team">
        <SectionHead
          kicker="↘ THE TEAM"
          title={
            <span>
              Five people, <br />
              <em>one studio</em>.
            </span>
          }
        />

        {cofounders.map((c, i) => (
          <article
            key={i}
            className={`ordi-about__founders ordi-about__founders--${i % 2 === 0 ? 'left' : 'right'}`}
          >
            <div className="ordi-about__founders-media">
              <BottleSlot placeholder={c.portrait} image={c.image} alt={`${c.nickname} — ${c.name}`} />
            </div>
            <div className="ordi-about__founders-copy">
              <MonoTag>
                ↘ N°0{i + 1} · {lang === 'en' ? c.role_en : c.role_th}
              </MonoTag>
              <h2 className="ordi-display-md">
                <em>&lsquo;{c.nickname}&rsquo;</em>
              </h2>
              <p className="ordi-about__founders-name">{c.name}</p>
              <p>{lang === 'en' ? c.bio_en : c.bio_th}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="ordi-about__thanks">
        <SectionHead
          kicker="↘ SPECIAL THANKS"
          title={
            <span>
              With <em>gratitude</em>.
            </span>
          }
        />
        <article className="ordi-about__founders ordi-about__founders--left">
          <div className="ordi-about__founders-media">
            <BottleSlot
              placeholder="DA — perfume consultant, casual editorial portrait"
              image={SakdaPortrait}
              alt="DA — Sakda Promsorn"
            />
          </div>
          <div className="ordi-about__founders-copy">
            <MonoTag>
              ↘ {lang === 'en' ? 'PERFUME CONSULTANT' : 'ที่ปรึกษาด้านน้ำหอม'}
            </MonoTag>
            <h2 className="ordi-display-md">
              <em>&lsquo;DA&rsquo;</em>
            </h2>
            <p className="ordi-about__founders-name">Sakda Promsorn</p>
            <p>
              {lang === 'en'
                ? 'One of the finest perfume consultants we know, working out of La Palatte and Vive Perfume. DA has guided ORDI from the first blotter to the last bottle — with a good nose, an honest ear, and a generosity we owe a great deal to.'
                : 'หนึ่งในที่ปรึกษาด้านน้ำหอมที่ดีที่สุดที่เรารู้จัก ทำงานอยู่ที่ La Palatte และ Vive Perfume คุณดาคอยให้คำปรึกษากับ ORDI ตั้งแต่กระดาษเทสต์แผ่นแรกจนถึงขวดสุดท้าย ด้วยจมูกที่ดี หูที่ตรงไปตรงมา และความเอื้อเฟื้อที่เราเป็นหนี้บุญคุณอย่างยิ่ง'}
            </p>
          </div>
        </article>
      </section>
    </main>
  )
}
