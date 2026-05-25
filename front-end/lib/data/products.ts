import type { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'good-boy',
    name: 'GOOD BOY',
    number: 'N°01',
    tagline: {
      en: 'The morning after, still warm.',
      th: 'เช้าวันถัดมา ยังคงอบอุ่น',
    },
    family: {
      en: 'Clean · Musk · Solar',
      th: 'สะอาด · มัสก์ · แดดอ่อน',
    },
    story: {
      en: 'A scent that lingers on a borrowed white shirt — soap on skin, the soft afterthought of vanilla. He smells like he means it.',
      th: 'กลิ่นที่ติดอยู่บนเสื้อเชิ้ตขาวยืมใส่ — สบู่บนผิว ความหวานของวานิลลาที่ตามมาเบาๆ เขามีกลิ่นเหมือนตั้งใจ',
    },
    notes: {
      top: ['Bergamot', 'Pink Pepper', 'Aldehyde'],
      heart: ['White Musk', 'Cashmeran', 'Iris'],
      base: ['Vanilla', 'Sandalwood', 'Cedar'],
    },
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 12, price: 690 },
    ],
    status: 'available',
    hue: '#EFEAE0',
  },
  {
    id: 'hot-dilf',
    name: 'HOT DILF',
    number: 'N°02',
    tagline: {
      en: 'An older man in a leather coat.',
      th: 'ชายในเสื้อหนัง',
    },
    family: {
      en: 'Smoke · Leather · Tobacco',
      th: 'ควัน · หนัง · ยาสูบ',
    },
    story: {
      en: "Smoke from a cigarette he didn't ask permission to light. Worn leather, expensive bourbon, the residual heat of a long afternoon.",
      th: 'ควันบุหรี่ที่เขาจุดโดยไม่ขออนุญาต หนังที่สึก เบอร์เบินราคาแพง และความร้อนที่หลงเหลือจากบ่ายที่ยาวนาน',
    },
    notes: {
      top: ['Black Pepper', 'Bergamot', 'Saffron'],
      heart: ['Leather', 'Tobacco Absolute', 'Oud'],
      base: ['Amber', 'Cedarwood', 'Labdanum'],
    },
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 12, price: 690 },
    ],
    status: 'available',
    hue: '#1A1612',
  },
  {
    id: 'sea-breeze',
    name: 'SEA BREEZE',
    number: 'N°03',
    tagline: {
      en: 'Salt on the inside of your wrist.',
      th: 'เกลือบนข้อมือด้านใน',
    },
    family: {
      en: 'Aquatic · Mineral · Ambergris',
      th: 'น้ำ · แร่ธาตุ · แอมเบอร์กริส',
    },
    story: {
      en: 'Krabi at six in the morning. The tide pulling back, a towel on warm stone, the air heavy with salt and something almost human.',
      th: 'กระบี่หกโมงเช้า น้ำลด ผ้าเช็ดตัวบนหินอุ่น อากาศหนักไปด้วยเกลือและบางอย่างที่ใกล้เคียงกับมนุษย์',
    },
    notes: {
      top: ['Calone', 'Bergamot', 'Sea Salt'],
      heart: ['Ambergris', 'Marine Accord', 'Lotus'],
      base: ['Driftwood', 'White Musk', 'Vetiver'],
    },
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 12, price: 690 },
    ],
    status: 'available',
    hue: '#D8DEE0',
  },
  {
    id: 'drowning-love',
    name: 'DROWNING LOVE',
    number: 'N°04',
    tagline: {
      en: 'Flowers left on the bedside.',
      th: 'ดอกไม้บนหัวเตียง',
    },
    family: {
      en: 'Floral · Incense · Indolic',
      th: 'ดอกไม้ · กำยาน · อินโดลิก',
    },
    story: {
      en: 'Tuberose that has gone too far. Black incense, a damp velvet curtain, the kind of obsession that ruins the carpet.',
      th: 'ตูเบโรสที่มากเกินไป กำยานสีดำ ม่านกำมะหยี่ชื้น ความหมกมุ่นที่ทำให้พรมเสียหาย',
    },
    notes: {
      top: ['Blackcurrant', 'Pink Pepper', 'Bergamot'],
      heart: ['Tuberose', 'Jasmine Sambac', 'Iris'],
      base: ['Incense', 'Patchouli', 'Benzoin'],
    },
    sizes: [
      { ml: 50, price: 1890 },
      { ml: 12, price: 690 },
    ],
    status: 'available',
    hue: '#2A1A24',
  },
  {
    id: 'skin-scent',
    name: 'SKIN SCENT',
    number: 'N°05',
    tagline: {
      en: 'You, but slightly louder.',
      th: 'คุณ ในเวอร์ชั่นเสียงดังขึ้นนิดนึง',
    },
    family: {
      en: 'Musk · Iris · Milk',
      th: 'มัสก์ · ไอริส · นม',
    },
    story: {
      en: "The new collection. A scent that doesn't arrive — it's already there. Worn close, almost imperceptible, but for the people who get close enough.",
      th: 'คอลเลกชั่นใหม่ กลิ่นที่ไม่ได้มาถึง — มันอยู่ที่นั่นแล้ว สวมใส่ใกล้ตัว แทบไม่รู้สึก แต่สำหรับคนที่เข้ามาใกล้พอ',
    },
    notes: {
      top: ['Ambrette Seed', 'Aldehyde C-14', 'Bergamot'],
      heart: ['Iris Pallida', 'Milk Accord', 'Heliotrope'],
      base: ['White Musk', 'Suede', 'Sandalwood'],
    },
    sizes: [
      { ml: 50, price: 2190 },
      { ml: 12, price: 790 },
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
