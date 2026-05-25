'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'
import { cn } from '@/lib/utils'

type FaqItemProps = { q: string; a: string; idx: number }

function FaqItem({ q, a, idx }: FaqItemProps) {
  const [open, setOpen] = useState(idx === 0)
  return (
    <details
      className="ordi-faq__item"
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
    >
      <summary>
        <MonoTag>Q.0{idx + 1}</MonoTag>
        <span>{q}</span>
        <span className="ordi-faq__plus">{open ? '−' : '+'}</span>
      </summary>
      <p>{a}</p>
    </details>
  )
}

export default function MembershipPage() {
  const { lang } = useApp()

  const tiers = [
    {
      name: 'Ordinary',
      sub: lang === 'en' ? 'Free · everyone' : 'ฟรี · ทุกคน',
      desc:
        lang === 'en'
          ? 'Sign up. Sample card with every order. Quiet newsletter.'
          : 'สมัคร · การ์ดทดลองทุกออเดอร์ · จดหมายข่าวเงียบๆ',
      benefits: [
        lang === 'en' ? 'Sample card included' : 'การ์ดทดลองในทุกออเดอร์',
        lang === 'en' ? 'Early access — 24 hours' : 'เข้าถึงก่อน 24 ชั่วโมง',
        lang === 'en' ? 'Birthday note' : 'บัตรอวยพรวันเกิด',
      ],
      featured: false,
    },
    {
      name: 'Ous',
      sub: lang === 'en' ? 'After 3 orders' : 'หลัง 3 ออเดอร์',
      desc:
        lang === 'en'
          ? 'A small thank-you, a louder sample card, complimentary engraving.'
          : 'ขอบคุณเล็กๆ การ์ดทดลองที่ใหญ่ขึ้น และการสลักชื่อฟรี',
      benefits: [
        lang === 'en' ? 'Free engraving on the bottle' : 'สลักชื่อบนขวดฟรี',
        lang === 'en' ? 'Free shipping over 1,500 THB' : 'ส่งฟรีเมื่อสั่งซื้อ 1,500 บาทขึ้นไป',
        lang === 'en' ? 'Five-card sample box per year' : 'กล่องทดลองห้าการ์ดต่อปี',
        lang === 'en' ? 'Invite to studio open days' : 'เชิญเข้าวันเปิดสตูดิโอ',
      ],
      featured: true,
    },
    {
      name: 'Out of Ordinary',
      sub: lang === 'en' ? 'By invitation' : 'ตามคำเชิญ',
      desc:
        lang === 'en'
          ? "Our top 50 customers. The first bottle of every new release, hand-delivered if you're in Bangkok."
          : 'ลูกค้า 50 อันดับแรกของเรา ขวดแรกของทุกการเปิดตัวใหม่ ส่งด้วยมือถ้าคุณอยู่ในกรุงเทพ',
      benefits: [
        lang === 'en' ? 'Bottle N°001 of every new release' : 'ขวดหมายเลข 001 ของทุกการเปิดตัว',
        lang === 'en' ? 'One-on-one consultation, twice a year' : 'ปรึกษาส่วนตัวปีละสองครั้ง',
        lang === 'en' ? 'Bespoke fragrance, every two years' : 'น้ำหอมเฉพาะตัว ทุกสองปี',
        lang === 'en' ? 'Hand delivery in Bangkok' : 'ส่งด้วยมือในกรุงเทพ',
      ],
      featured: false,
    },
  ]

  const faqs = [
    {
      q: lang === 'en' ? 'Is there a fee?' : 'มีค่าธรรมเนียมไหม?',
      a:
        lang === 'en'
          ? 'No. Membership is free and automatic from your first order.'
          : 'ไม่มี สมาชิกฟรีและอัตโนมัติตั้งแต่ออเดอร์แรก',
    },
    {
      q: lang === 'en' ? 'Do you do discounts?' : 'ลดราคาไหม?',
      a:
        lang === 'en'
          ? "No. We price our fragrances fairly to begin with. We'd rather give you a sample card."
          : 'ไม่ เราตั้งราคาน้ำหอมอย่างเป็นธรรมตั้งแต่ต้น เราอยากให้การ์ดทดลองมากกว่า',
    },
    {
      q: lang === 'en' ? 'How do I become Out of Ordinary?' : 'จะเป็น Out of Ordinary ได้อย่างไร?',
      a:
        lang === 'en'
          ? "By invitation, after a year of consistent orders. We'll write to you. Don't ask."
          : 'โดยคำเชิญ หลังจากสั่งซื้ออย่างต่อเนื่องเป็นเวลาหนึ่งปี เราจะเขียนถึงคุณ อย่าถาม',
    },
    {
      q: lang === 'en' ? 'Can I gift my benefits?' : 'โอนสิทธิประโยชน์ได้ไหม?',
      a:
        lang === 'en'
          ? 'Engravings and bespoke slots, yes. Just tell us when you order.'
          : 'การสลักและสล็อตเฉพาะตัว ได้ แค่บอกเราตอนสั่งซื้อ',
    },
  ]

  return (
    <main className="ordi-member">
      <header className="ordi-member__hero">
        <MonoTag>↘ MEMBERSHIP · ORDI / OUS</MonoTag>
        <h1 className="ordi-display-xl">
          <span>
            Three <em>tiers</em>.
          </span>
          <span>No points. No discounts.</span>
          <span>
            Just <em>better fragrance</em>.
          </span>
        </h1>
        <p className="ordi-member__lede">
          {lang === 'en'
            ? "We don't think loyalty should cost money. Our membership is automatic — the more you order, the more we recognize you, in small and quiet ways."
            : 'เราไม่คิดว่าความภักดีควรเสียเงิน สมาชิกของเราเป็นอัตโนมัติ — ยิ่งคุณสั่งซื้อมาก เราก็ยิ่งจำคุณได้ ในวิธีเล็กและเงียบ'}
        </p>
      </header>

      <section className="ordi-tiers">
        {tiers.map((tier, i) => (
          <article
            className={cn('ordi-tier-card', tier.featured && 'is-featured')}
            key={i}
          >
            <header>
              <MonoTag>
                0{i + 1}
                {tier.featured && ' · CURRENT'}
              </MonoTag>
              <h2 className="ordi-display-md">
                <em>{tier.name}</em>
              </h2>
              <span className="ordi-tier-card__sub">{tier.sub}</span>
            </header>
            <p>{tier.desc}</p>
            <ul>
              {tier.benefits.map((b, j) => (
                <li key={j}>
                  <span className="ordi-tier-card__bullet">∙</span>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href="/account"
              className={cn(
                'ordi-btn',
                tier.featured ? 'ordi-btn--primary' : 'ordi-btn--ghost',
                'ordi-btn--full'
              )}
            >
              {tier.featured
                ? lang === 'en'
                  ? 'Your current tier'
                  : 'ระดับของคุณ'
                : lang === 'en'
                  ? 'How to reach'
                  : 'วิธีเลื่อนระดับ'}{' '}
              →
            </Link>
          </article>
        ))}
      </section>

      <section className="ordi-member__faq">
        <SectionHead
          kicker="↘ COMMON QUESTIONS"
          title={
            <span>
              <em>Honestly</em>,<br />
              what's the catch?
            </span>
          }
        />
        <div className="ordi-faq">
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} idx={i} />
          ))}
        </div>
      </section>
    </main>
  )
}
