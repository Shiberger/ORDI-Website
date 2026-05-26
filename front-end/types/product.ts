export type Lang = 'en' | 'th'

export type Bilingual = { en: string; th: string }

export type ProductStatus = 'available' | 'coming-soon' | 'sold-out'

export type ProductSize = {
  ml: number
  price: number
}

export type ProductNotes = {
  top: string[]
  heart: string[]
  base: string[]
}

export type Product = {
  id: string
  name: string
  number: string
  tagline: Bilingual
  family: Bilingual
  story: Bilingual
  notes: ProductNotes
  sizes: ProductSize[]
  status: ProductStatus
  hue: string
}

export type JournalEntry = {
  id: string
  slug: string
  number: string
  date: string
  title: Bilingual
  excerpt: Bilingual
  body: Bilingual
  body2?: Bilingual
  readtime: string
}
