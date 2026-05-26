import type { Lang } from '@/types/product'

export type UIStrings = {
  brand_short: string
  brand_full: string
  origin: string
  nav: { shop: string; journal: string; about: string; contact: string; account: string; cart: string }
  contact: {
    kicker: string
    title_lines: [string, string, string]
    lede: string
    channels_kicker: string
    studio_kicker: string
    studio_title: string
    studio_body: string
    studio_hours_label: string
    studio_hours: string
    open_label: string
    channel_ig_desc: string
    channel_tiktok_desc: string
    channel_shopee_desc: string
    channel_email_desc: string
  }
  cta: {
    shop_all: string
    add_to_cart: string
    shop_online: string
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
    nav: { shop: 'Shop', journal: 'Journal', about: 'About', contact: 'Contact', account: 'Account', cart: 'Cart' },
    cta: {
      shop_all: 'Shop the collection',
      add_to_cart: 'Add to cart',
      shop_online: 'Shopping Online',
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
    contact: {
      kicker: '↘ CONTACT · ORDI ATELIER',
      title_lines: ['Talk to us', 'where you', 'already are.'],
      lede:
        "We answer most messages within a day. For orders, fragrance questions, or anything else — pick the channel you already use.",
      channels_kicker: '↘ CHANNELS',
      studio_kicker: '↘ THE STUDIO',
      studio_title: 'Bangkok, Thailand',
      studio_body:
        'A one-room studio on Sukhumvit. We work by appointment only — drop us a line first and we will arrange a quiet visit.',
      studio_hours_label: 'Hours',
      studio_hours: 'Mon–Sat · 11:00–19:00 (ICT)',
      open_label: 'Open',
      channel_ig_desc: 'Behind-the-bench moments, new releases, and quiet press notes.',
      channel_tiktok_desc: 'Short films from the studio and the way each scent moves on skin.',
      channel_shopee_desc: 'Order through our official Shopee storefront. Ships across Thailand.',
      channel_email_desc: 'For wholesale, press, collaborations, and anything that needs a longer reply.',
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
    nav: { shop: 'สินค้า', journal: 'บันทึก', about: 'เกี่ยวกับเรา', contact: 'ติดต่อ', account: 'บัญชี', cart: 'ตะกร้า' },
    cta: {
      shop_all: 'ดูคอลเลกชั่นทั้งหมด',
      add_to_cart: 'เพิ่มลงตะกร้า',
      shop_online: 'ช้อปออนไลน์',
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
    contact: {
      kicker: '↘ ติดต่อ · ORDI ATELIER',
      title_lines: ['คุยกับเรา', 'ผ่านช่องทาง', 'ที่คุณคุ้นเคย'],
      lede:
        'เราตอบข้อความส่วนใหญ่ภายในหนึ่งวัน ไม่ว่าจะสอบถามเรื่องสั่งซื้อ กลิ่น หรือเรื่องอื่น ๆ เลือกช่องทางที่คุณสะดวกได้เลย',
      channels_kicker: '↘ ช่องทางติดต่อ',
      studio_kicker: '↘ สตูดิโอ',
      studio_title: 'กรุงเทพมหานคร ประเทศไทย',
      studio_body:
        'สตูดิโอห้องเดียวบนถนนสุขุมวิท เราเปิดเฉพาะการนัดหมายล่วงหน้า ทักหาเราก่อนแล้วเรานัดวันให้คุณมาเยี่ยมแบบเงียบ ๆ',
      studio_hours_label: 'เวลาทำการ',
      studio_hours: 'จันทร์–เสาร์ · 11:00–19:00 น.',
      open_label: 'เปิด',
      channel_ig_desc: 'บรรยากาศหลังโต๊ะปรุง ภาพคอลเลกชั่นใหม่ และบันทึกเล็ก ๆ จากสตูดิโอ',
      channel_tiktok_desc: 'คลิปสั้นจากสตูดิโอ และวิธีที่แต่ละกลิ่นเคลื่อนตัวบนผิว',
      channel_shopee_desc: 'สั่งซื้อผ่านร้านค้าทางการของเราบน Shopee จัดส่งทั่วประเทศไทย',
      channel_email_desc: 'สำหรับการขายส่ง สื่อมวลชน คอลแลบ และเรื่องที่ต้องการคำตอบยาว ๆ',
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
