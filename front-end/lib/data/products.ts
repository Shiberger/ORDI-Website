import type { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'good-boy',
    name: 'GOOD BOY',
    number: 'N°01',
    tagline: {
      en: 'Fresh, clean, and endearing for the well-mannered.',
      th: 'สดชื่น สะอาด น่ารัก สำหรับที่มีเอเนอร์จี้เหลือล้น!',
    },
    family: {
      en: 'Citrus Gourmand · Soft Musk',
      th: 'ซิตรัส กูร์มองด์ · มัสก์นุ่ม',
    },
    story: {
      en: "A fresh, clean, and endearing fragrance, evoking feelings of innocence, reliability, and playful charm. It's the perfect everyday scent for the well-mannered individual.",
      th: 'กลิ่นหอมสดชื่น สะอาด และน่ารัก ปลุกความรู้สึกบริสุทธิ์ น่าเชื่อถือ และเสน่ห์ขี้เล่น เป็นกลิ่นประจำวันที่ลงตัว',
    },
    notes: {
      top: ['Yuzu'],
      heart: ['Sweet Banana', 'Milk'],
      base: ['Clean Musk', 'Soft Powder'],
    },
    sizes: [
      { ml: 50, price: 1390 },
      { ml: 12, price: 390 },
    ],
    status: 'available',
    hue: '#EFEAE0',
  },
  {
    id: 'hot-dilf',
    name: 'HOT DILF',
    number: 'N°02',
    tagline: {
      en: "He doesn't chase attention it follows him.",
      th: 'เขาไม่ต้องไล่ตามความสนใจ มันตามเขามาเอง',
    },
    family: {
      en: 'Dark Gourmand · Boozy Woody',
      th: 'กูร์มองด์เข้ม · วู้ดดี้บูซี่',
    },
    story: {
      en: "HOT DILF is the scent of a man who doesn't chase attention it follows him. Warm, boozy, and quietly dangerous, this fragrance captures the moment after midnight, when confidence speaks louder than words. Sweetness meets darkness, refined by experience and grounded by calm dominance.",
      th: 'HOT DILF คือกลิ่นของผู้ชายที่ไม่ต้องไล่ตามความสนใจ เพราะมันตามเขามาเอง อบอุ่น เข้ม และอันตรายอย่างเงียบสงบ น้ำหอมนี้จับช่วงเวลาหลังเที่ยงคืน เมื่อความมั่นใจดังกว่าคำพูด ความหวานปะทะกับความมืด ขัดเกลาด้วยประสบการณ์ และตั้งมั่นบนความเด่นชัดที่นิ่งสงบ',
    },
    notes: {
      top: ['Cognac'],
      heart: ['Dark Vanilla'],
      base: ['Smoky Wood', 'Warm Amber'],
    },
    sizes: [
      { ml: 50, price: 1390 },
      { ml: 12, price: 390 },
    ],
    status: 'available',
    hue: '#1A1612',
  },
  {
    id: 'sea-breeze',
    name: 'SEA BREEZE',
    number: 'N°03',
    tagline: {
      en: 'The moment love begins light, bright, possible.',
      th: 'ช่วงเวลาที่ความรักเพิ่งเริ่มต้น เบา สดใส เป็นไปได้',
    },
    family: {
      en: 'Floral Woody · Airy',
      th: 'ฟลอรัล วู้ดดี้ · โปร่งเบา',
    },
    story: {
      en: "The moment love is just beginning when everything looks bright, vivid, and full of possibility. Like walking through gentle waves at sunset, a soft breeze passing, white flowers drifting through the air. The heart is still light, and the word 'love' is still enough for everything. A relationship that doesn't yet carry weight — only intention, and sincere smiles toward one another.",
      th: 'คือช่วงเวลาที่ความรักเพิ่งเริ่มต้น ทุกอย่างดูสว่าง สดใส และเป็นไปได้เสมอ เหมือนการเดินเตะคลื่นริมทะเลในช่วงพระอาทิตย์ตก ลมพัดผ่านเบาๆ ดอกไม้สีขาวปลิวตามอากาศ หัวใจยังเบา และคำว่า "รัก" ยังเพียงพอสำหรับทุกอย่าง มันคือความสัมพันธ์ที่ยังไม่มีน้ำหนัก มีแค่ความตั้งใจ และรอยยิ้มที่จริงใจต่อกัน',
    },
    notes: {
      top: ['Mandarin', 'Pear'],
      heart: ['White Floral Accord', 'Soft Jasmine'],
      base: ['Soft Amberwood', 'Ultravanil'],
    },
    sizes: [
      { ml: 50, price: 1390 },
      { ml: 12, price: 390 },
    ],
    status: 'available',
    hue: '#D8DEE0',
  },
  {
    id: 'drowning-love',
    name: 'DROWNING LOVE',
    number: 'N°04',
    tagline: {
      en: 'Love that has fully matured the descent into deep water.',
      th: 'ความรักที่โตเต็มวัย การลงไปในน้ำลึก',
    },
    family: {
      en: 'Woody · Amber · Floral',
      th: 'วู้ดดี้ · แอมเบอร์ · ฟลอรัล',
    },
    story: {
      en: "Love that has fully matured. No longer a walk along the seashore it is the descent into deep waters. A love with duties, with responsibilities, with obstacles to face together. Sometimes it is heavy, sometimes it makes you feel as if you are drowning. But you still choose not to let go. And the longer you love, the deeper it becomes.",
      th: 'คือความรักที่โตเต็มวัย มันไม่ใช่การเดินเล่นริมทะเลอีกต่อไป แต่มันคือการลงไปในน้ำลึก ความรักที่มีหน้าที่ มีความรับผิดชอบ มีอุปสรรคที่ต้องเผชิญร่วมกัน บางครั้งมันหนัก บางครั้งมันทำให้คุณเหมือนกำลังจม แต่คุณยังเลือกที่จะไม่ปล่อยมือกัน และยิ่งรักนานเท่าไหร่ ยิ่งลึกมากขึ้นเท่านั้น',
    },
    notes: {
      top: ['Warm Wood', 'Subtle Sweet Glow'],
      heart: ['Sandalwood', 'Soft White Floral'],
      base: ['Tobacco', 'Amberwood', 'Ultravanil', 'Luminous Amber'],
    },
    sizes: [
      { ml: 50, price: 1390 },
      { ml: 12, price: 390 },
    ],
    status: 'available',
    hue: '#2A1A24',
  },
  {
    id: 'phiwfon',
    name: 'PHIWFON',
    number: 'N°05',
    tagline: {
      en: 'The scent that lingers after the rain stops.',
      th: 'กลิ่นที่ลอยอยู่หลังฝนหยุดตก',
    },
    family: {
      en: 'Atmospheric Musk · Skin Scent · Woody Musky',
      th: 'มัสก์บรรยากาศ · กลิ่นผิว · วู้ดดี้ มัสกี้',
    },
    story: {
      en: "Sometimes what makes us remember someone isn't their face, isn't their voice it is the faint scent that lingers after the rain has stopped. The scent of skin, of clothes, of humidity, and of the cool air in a room where the lights are still on. 'Phiwfon' was created from that feeling.",
      th: 'บางครั้งสิ่งที่ทำให้เราจดจำใครบางคนได้ ไม่ใช่ใบหน้า ไม่ใช่เสียง แต่เป็นกลิ่นจางๆ ที่ลอยอยู่หลังฝนหยุดตก กลิ่นของผิว เสื้อผ้า ความชื้น และอากาศเย็นในห้องที่ยังเปิดไฟทิ้งไว้ "ผิวฝน" ถูกสร้างขึ้นจากความรู้สึกนั้น',
    },
    notes: {
      top: ['Rain Air Accord', 'Cold Fabric Aldehyde'],
      heart: ['White Musk','Humid Cotton'],
      base: ['Oakmoss', 'Warm Skin Musk'],
    },
    sizes: [
      { ml: 50, price: 1390 },
      { ml: 12, price: 390 },
    ],
    status: 'coming-soon',
    hue: '#E8E0D6',
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductSlugs(): string[] {
  return products.map((p) => p.id)
}
