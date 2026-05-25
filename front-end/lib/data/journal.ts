import type { JournalEntry } from '@/types/product'

export const journal: JournalEntry[] = [
  {
    id: 'j01',
    number: 'JRN.001',
    date: '2026.04.18',
    title: {
      en: 'On smelling like nothing in particular',
      th: 'ว่าด้วยการมีกลิ่นที่ไม่เฉพาะเจาะจง',
    },
    excerpt: {
      en: 'We started ORDI because most perfume tries too hard. The best compliment is being asked: what is that — and not being sure how to answer.',
      th: 'เราเริ่ม ORDI เพราะน้ำหอมส่วนใหญ่พยายามมากเกินไป คำชมที่ดีที่สุดคือการถูกถามว่า: นั่นกลิ่นอะไร — และไม่แน่ใจว่าจะตอบอย่างไร',
    },
    readtime: '4 min',
  },
  {
    id: 'j02',
    number: 'JRN.002',
    date: '2026.03.02',
    title: {
      en: 'The making of SEA BREEZE',
      th: 'เบื้องหลังการสร้าง SEA BREEZE',
    },
    excerpt: {
      en: 'Eleven trips to Krabi. Two kilos of seaweed. One particular morning where the air was so still it felt rude to breathe it in.',
      th: 'เดินทางไปกระบี่สิบเอ็ดครั้ง สาหร่ายสองกิโล และเช้าวันหนึ่งที่อากาศนิ่งจนรู้สึกผิดที่จะหายใจ',
    },
    readtime: '7 min',
  },
  {
    id: 'j03',
    number: 'JRN.003',
    date: '2026.01.27',
    title: {
      en: 'A short history of being told you smell good',
      th: 'ประวัติศาสตร์อันสั้นของการถูกบอกว่ามีกลิ่นหอม',
    },
    excerpt: {
      en: "There's a difference between smelling expensive and smelling like yourself. We're interested in the second one.",
      th: 'มีความแตกต่างระหว่างกลิ่นแพงกับกลิ่นที่เป็นตัวคุณเอง เราสนใจอย่างหลัง',
    },
    readtime: '5 min',
  },
]
