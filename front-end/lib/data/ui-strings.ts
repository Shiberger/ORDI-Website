import type { Lang } from '@/types/product'

export type UIStrings = {
  brand_short: string
  brand_full: string
  origin: string
  nav: { shop: string; journal: string; about: string; account: string; cart: string }
  cta: {
    shop_all: string
    add_to_cart: string
    sold_out: string
    view_product: string
    checkout: string
    continue: string
    place_order: string
    sign_in: string
    sign_up: string
    wishlist: string
    wishlisted: string
  }
  product: {
    notes_title: string
    top: string
    heart: string
    base: string
    select_size: string
    included: string
    ships: string
    family: string
    story: string
  }
  coming_soon: string
  sold_out: string
  empty_cart: string
  cart_title: string
  subtotal: string
  shipping: string
  currency: string
  remove: string
  qty: string
}

export const uiStrings: Record<Lang, UIStrings> = {
  en: {
    brand_short: 'ORDI',
    brand_full: 'OUT OF ORDINARY ONLY OUS',
    origin: 'Made in Bangkok, Thailand',
    nav: { shop: 'Shop', journal: 'Journal', about: 'About', account: 'Account', cart: 'Cart' },
    cta: {
      shop_all: 'Shop the collection',
      add_to_cart: 'Add to cart',
      sold_out: 'Notify me',
      view_product: 'View',
      checkout: 'Proceed to checkout',
      continue: 'Continue',
      place_order: 'Place order',
      sign_in: 'Sign in',
      sign_up: 'Become a member',
      wishlist: 'Save to wishlist',
      wishlisted: 'Saved',
    },
    product: {
      notes_title: 'Olfactive Pyramid',
      top: 'Top',
      heart: 'Heart',
      base: 'Base',
      select_size: 'Select size',
      included: 'Includes complimentary sample card',
      ships: 'Ships within 2 business days from Bangkok',
      family: 'Fragrance family',
      story: 'Note from the perfumer',
    },
    coming_soon: 'Coming soon',
    sold_out: 'Sold out',
    empty_cart: 'Your cart is empty.',
    cart_title: 'Cart',
    subtotal: 'Subtotal',
    shipping: 'Shipping calculated at checkout',
    currency: 'THB',
    remove: 'Remove',
    qty: 'Qty',
  },
  th: {
    brand_short: 'ORDI',
    brand_full: 'OUT OF ORDINARY ONLY OUS',
    origin: 'ผลิตในกรุงเทพมหานคร ประเทศไทย',
    nav: { shop: 'สินค้า', journal: 'บันทึก', about: 'เกี่ยวกับเรา', account: 'บัญชี', cart: 'ตะกร้า' },
    cta: {
      shop_all: 'ดูคอลเลกชั่นทั้งหมด',
      add_to_cart: 'เพิ่มลงตะกร้า',
      sold_out: 'แจ้งเตือนเมื่อมีสินค้า',
      view_product: 'ดูสินค้า',
      checkout: 'ดำเนินการชำระเงิน',
      continue: 'ดำเนินการต่อ',
      place_order: 'ยืนยันคำสั่งซื้อ',
      sign_in: 'เข้าสู่ระบบ',
      sign_up: 'สมัครสมาชิก',
      wishlist: 'บันทึกลงรายการโปรด',
      wishlisted: 'บันทึกแล้ว',
    },
    product: {
      notes_title: 'พีรามิดกลิ่น',
      top: 'กลิ่นแรก',
      heart: 'กลิ่นกลาง',
      base: 'กลิ่นปลาย',
      select_size: 'เลือกขนาด',
      included: 'แถมการ์ดทดลองกลิ่นฟรี',
      ships: 'จัดส่งภายใน 2 วันทำการจากกรุงเทพ',
      family: 'ตระกูลกลิ่น',
      story: 'บันทึกจากนักปรุง',
    },
    coming_soon: 'เร็วๆ นี้',
    sold_out: 'สินค้าหมด',
    empty_cart: 'ตะกร้าของคุณว่างเปล่า',
    cart_title: 'ตะกร้า',
    subtotal: 'ยอดรวม',
    shipping: 'ค่าจัดส่งจะคำนวณในขั้นตอนชำระเงิน',
    currency: 'บาท',
    remove: 'ลบ',
    qty: 'จำนวน',
  },
}
