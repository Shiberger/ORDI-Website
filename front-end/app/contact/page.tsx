'use client'

import { useApp } from '@/lib/context/AppContext'
import { MonoTag } from '@/components/ui/MonoTag'
import { SectionHead } from '@/components/ui/SectionHead'

type Channel = {
  n: string
  name: string
  handle: string
  href: string
  desc: string
  external: boolean
}

export default function ContactPage() {
  const { lang, t } = useApp()

  const channels: Channel[] = [
    {
      n: '01',
      name: 'Instagram',
      handle: '@ordi.bkk',
      href: 'https://www.instagram.com/ordi.bkk/',
      desc: t.contact.channel_ig_desc,
      external: true,
    },
    {
      n: '02',
      name: 'TikTok',
      handle: '@ordi.bkk',
      href: 'https://www.tiktok.com/@ordi.bkk',
      desc: t.contact.channel_tiktok_desc,
      external: true,
    },
    {
      n: '03',
      name: 'Shopee',
      handle: 'ordi.bkk',
      href: 'https://shopee.co.th/ordi.bkk?categoryId=100630&entryPoint=ShopByPDP&itemId=52406738196',
      desc: t.contact.channel_shopee_desc,
      external: true,
    },
    {
      n: '04',
      name: 'Email',
      handle: 'outofordinary.official@gmail.com',
      href: 'mailto:outofordinary.official@gmail.com',
      desc: t.contact.channel_email_desc,
      external: false,
    },
  ]

  const [l1, l2, l3] = t.contact.title_lines

  return (
    <main className="ordi-contact">
      <header className="ordi-contact__hero">
        <MonoTag>{t.contact.kicker}</MonoTag>
        <h1 className="ordi-display-xl">
          <span>{l1}</span>
          <span>
            <em>{l2}</em>
          </span>
          <span>{l3}</span>
        </h1>
        <p className="ordi-contact__lede">{t.contact.lede}</p>
      </header>

      <section className="ordi-contact__channels">
        <SectionHead
          kicker={t.contact.channels_kicker}
          title={
            <span>
              {lang === 'en' ? 'Four ways to ' : 'สี่ช่องทาง'}
              <em>{lang === 'en' ? 'reach us' : 'ติดต่อเรา'}</em>.
            </span>
          }
        />
        <ul className="ordi-contact__grid">
          {channels.map((c) => (
            <li key={c.n} className="ordi-contact__card">
              <MonoTag>N°{c.n}</MonoTag>
              <h3 className="ordi-display-sm">
                <em>{c.name}</em>
              </h3>
              <p className="ordi-contact__handle">{c.handle}</p>
              <p className="ordi-contact__desc">{c.desc}</p>
              <a
                href={c.href}
                target={c.external ? '_blank' : undefined}
                rel={c.external ? 'noopener noreferrer' : undefined}
                className="ordi-btn ordi-btn--ghost ordi-btn--full"
              >
                {t.contact.open_label} {c.name} →
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="ordi-contact__studio">
        <div className="ordi-contact__studio-copy">
          <MonoTag>{t.contact.studio_kicker}</MonoTag>
          <h2 className="ordi-display-md">
            <em>{t.contact.studio_title}</em>
          </h2>
          <p>{t.contact.studio_body}</p>
          <dl className="ordi-contact__meta">
            <div>
              <dt>{t.contact.studio_hours_label}</dt>
              <dd>{t.contact.studio_hours}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <a href="mailto:outofordinary.official@gmail.com">
                  outofordinary.official@gmail.com
                </a>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </main>
  )
}
