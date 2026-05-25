// ORDI product data & bilingual copy
window.ORDI_DATA = (function() {

  const products = [
    {
      id: "good-boy",
      name: "GOOD BOY",
      number: "N°01",
      tagline: { en: "The morning after, still warm.", th: "เช้าวันถัดมา ยังคงอบอุ่น" },
      family: { en: "Clean · Musk · Solar", th: "สะอาด · มัสก์ · แดดอ่อน" },
      story: {
        en: "A scent that lingers on a borrowed white shirt — soap on skin, the soft afterthought of vanilla. He smells like he means it.",
        th: "กลิ่นที่ติดอยู่บนเสื้อเชิ้ตขาวยืมใส่ — สบู่บนผิว ความหวานของวานิลลาที่ตามมาเบาๆ เขามีกลิ่นเหมือนตั้งใจ"
      },
      notes: {
        top: [ "Bergamot", "Pink Pepper", "Aldehyde" ],
        heart: [ "White Musk", "Cashmeran", "Iris" ],
        base: [ "Vanilla", "Sandalwood", "Cedar" ]
      },
      sizes: [
        { ml: 50, price: 1890 },
        { ml: 12, price: 690 }
      ],
      status: "available",
      hue: "#EFEAE0"
    },
    {
      id: "hot-dilf",
      name: "HOT DILF",
      number: "N°02",
      tagline: { en: "An older man in a leather coat.", th: "ชายในเสื้อหนัง" },
      family: { en: "Smoke · Leather · Tobacco", th: "ควัน · หนัง · ยาสูบ" },
      story: {
        en: "Smoke from a cigarette he didn't ask permission to light. Worn leather, expensive bourbon, the residual heat of a long afternoon.",
        th: "ควันบุหรี่ที่เขาจุดโดยไม่ขออนุญาต หนังที่สึก เบอร์เบินราคาแพง และความร้อนที่หลงเหลือจากบ่ายที่ยาวนาน"
      },
      notes: {
        top: [ "Black Pepper", "Bergamot", "Saffron" ],
        heart: [ "Leather", "Tobacco Absolute", "Oud" ],
        base: [ "Amber", "Cedarwood", "Labdanum" ]
      },
      sizes: [
        { ml: 50, price: 1890 },
        { ml: 12, price: 690 }
      ],
      status: "available",
      hue: "#1A1612"
    },
    {
      id: "sea-breeze",
      name: "SEA BREEZE",
      number: "N°03",
      tagline: { en: "Salt on the inside of your wrist.", th: "เกลือบนข้อมือด้านใน" },
      family: { en: "Aquatic · Mineral · Ambergris", th: "น้ำ · แร่ธาตุ · แอมเบอร์กริส" },
      story: {
        en: "Krabi at six in the morning. The tide pulling back, a towel on warm stone, the air heavy with salt and something almost human.",
        th: "กระบี่หกโมงเช้า น้ำลด ผ้าเช็ดตัวบนหินอุ่น อากาศหนักไปด้วยเกลือและบางอย่างที่ใกล้เคียงกับมนุษย์"
      },
      notes: {
        top: [ "Calone", "Bergamot", "Sea Salt" ],
        heart: [ "Ambergris", "Marine Accord", "Lotus" ],
        base: [ "Driftwood", "White Musk", "Vetiver" ]
      },
      sizes: [
        { ml: 50, price: 1890 },
        { ml: 12, price: 690 }
      ],
      status: "available",
      hue: "#D8DEE0"
    },
    {
      id: "drowning-love",
      name: "DROWNING LOVE",
      number: "N°04",
      tagline: { en: "Flowers left on the bedside.", th: "ดอกไม้บนหัวเตียง" },
      family: { en: "Floral · Incense · Indolic", th: "ดอกไม้ · กำยาน · อินโดลิก" },
      story: {
        en: "Tuberose that has gone too far. Black incense, a damp velvet curtain, the kind of obsession that ruins the carpet.",
        th: "ตูเบโรสที่มากเกินไป กำยานสีดำ ม่านกำมะหยี่ชื้น ความหมกมุ่นที่ทำให้พรมเสียหาย"
      },
      notes: {
        top: [ "Blackcurrant", "Pink Pepper", "Bergamot" ],
        heart: [ "Tuberose", "Jasmine Sambac", "Iris" ],
        base: [ "Incense", "Patchouli", "Benzoin" ]
      },
      sizes: [
        { ml: 50, price: 1890 },
        { ml: 12, price: 690 }
      ],
      status: "available",
      hue: "#2A1A24"
    },
    {
      id: "skin-scent",
      name: "SKIN SCENT",
      number: "N°05",
      tagline: { en: "You, but slightly louder.", th: "คุณ ในเวอร์ชั่นเสียงดังขึ้นนิดนึง" },
      family: { en: "Musk · Iris · Milk", th: "มัสก์ · ไอริส · นม" },
      story: {
        en: "The new collection. A scent that doesn't arrive — it's already there. Worn close, almost imperceptible, but for the people who get close enough.",
        th: "คอลเลกชั่นใหม่ กลิ่นที่ไม่ได้มาถึง — มันอยู่ที่นั่นแล้ว สวมใส่ใกล้ตัว แทบไม่รู้สึก แต่สำหรับคนที่เข้ามาใกล้พอ"
      },
      notes: {
        top: [ "Ambrette Seed", "Aldehyde C-14", "Bergamot" ],
        heart: [ "Iris Pallida", "Milk Accord", "Heliotrope" ],
        base: [ "White Musk", "Suede", "Sandalwood" ]
      },
      sizes: [
        { ml: 50, price: 2190 },
        { ml: 12, price: 790 }
      ],
      status: "coming-soon",
      hue: "#E8E0D6"
    }
  ];

  const ui = {
    en: {
      brand_short: "ORDI",
      brand_full: "OUT OF ORDINARY ONLY OUS",
      origin: "Made in Bangkok, Thailand",
      nav: { shop: "Shop", journal: "Journal", about: "About", account: "Account", cart: "Cart" },
      cta: {
        shop_all: "Shop the collection",
        add_to_cart: "Add to cart",
        sold_out: "Notify me",
        view_product: "View",
        checkout: "Proceed to checkout",
        continue: "Continue",
        place_order: "Place order",
        sign_in: "Sign in",
        sign_up: "Become a member",
        wishlist: "Save to wishlist",
        wishlisted: "Saved"
      },
      product: {
        notes_title: "Olfactive Pyramid",
        top: "Top",
        heart: "Heart",
        base: "Base",
        select_size: "Select size",
        included: "Includes complimentary sample card",
        ships: "Ships within 2 business days from Bangkok",
        family: "Fragrance family",
        story: "Note from the perfumer"
      },
      coming_soon: "Coming soon",
      sold_out: "Sold out",
      empty_cart: "Your cart is empty.",
      cart_title: "Cart",
      subtotal: "Subtotal",
      shipping: "Shipping calculated at checkout",
      currency: "THB",
      remove: "Remove",
      qty: "Qty"
    },
    th: {
      brand_short: "ORDI",
      brand_full: "OUT OF ORDINARY ONLY OUS",
      origin: "ผลิตในกรุงเทพมหานคร ประเทศไทย",
      nav: { shop: "สินค้า", journal: "บันทึก", about: "เกี่ยวกับเรา", account: "บัญชี", cart: "ตะกร้า" },
      cta: {
        shop_all: "ดูคอลเลกชั่นทั้งหมด",
        add_to_cart: "เพิ่มลงตะกร้า",
        sold_out: "แจ้งเตือนเมื่อมีสินค้า",
        view_product: "ดูสินค้า",
        checkout: "ดำเนินการชำระเงิน",
        continue: "ดำเนินการต่อ",
        place_order: "ยืนยันคำสั่งซื้อ",
        sign_in: "เข้าสู่ระบบ",
        sign_up: "สมัครสมาชิก",
        wishlist: "บันทึกลงรายการโปรด",
        wishlisted: "บันทึกแล้ว"
      },
      product: {
        notes_title: "พีรามิดกลิ่น",
        top: "กลิ่นแรก",
        heart: "กลิ่นกลาง",
        base: "กลิ่นปลาย",
        select_size: "เลือกขนาด",
        included: "แถมการ์ดทดลองกลิ่นฟรี",
        ships: "จัดส่งภายใน 2 วันทำการจากกรุงเทพ",
        family: "ตระกูลกลิ่น",
        story: "บันทึกจากนักปรุง"
      },
      coming_soon: "เร็วๆ นี้",
      sold_out: "สินค้าหมด",
      empty_cart: "ตะกร้าของคุณว่างเปล่า",
      cart_title: "ตะกร้า",
      subtotal: "ยอดรวม",
      shipping: "ค่าจัดส่งจะคำนวณในขั้นตอนชำระเงิน",
      currency: "บาท",
      remove: "ลบ",
      qty: "จำนวน"
    }
  };

  const journal = [
    {
      id: "j01",
      number: "JRN.001",
      date: "2026.04.18",
      title: { en: "On smelling like nothing in particular", th: "ว่าด้วยการมีกลิ่นที่ไม่เฉพาะเจาะจง" },
      excerpt: {
        en: "We started ORDI because most perfume tries too hard. The best compliment is being asked: what is that — and not being sure how to answer.",
        th: "เราเริ่ม ORDI เพราะน้ำหอมส่วนใหญ่พยายามมากเกินไป คำชมที่ดีที่สุดคือการถูกถามว่า: นั่นกลิ่นอะไร — และไม่แน่ใจว่าจะตอบอย่างไร"
      },
      readtime: "4 min"
    },
    {
      id: "j02",
      number: "JRN.002",
      date: "2026.03.02",
      title: { en: "The making of SEA BREEZE", th: "เบื้องหลังการสร้าง SEA BREEZE" },
      excerpt: {
        en: "Eleven trips to Krabi. Two kilos of seaweed. One particular morning where the air was so still it felt rude to breathe it in.",
        th: "เดินทางไปกระบี่สิบเอ็ดครั้ง สาหร่ายสองกิโล และเช้าวันหนึ่งที่อากาศนิ่งจนรู้สึกผิดที่จะหายใจ"
      },
      readtime: "7 min"
    },
    {
      id: "j03",
      number: "JRN.003",
      date: "2026.01.27",
      title: { en: "A short history of being told you smell good", th: "ประวัติศาสตร์อันสั้นของการถูกบอกว่ามีกลิ่นหอม" },
      excerpt: {
        en: "There's a difference between smelling expensive and smelling like yourself. We're interested in the second one.",
        th: "มีความแตกต่างระหว่างกลิ่นแพงกับกลิ่นที่เป็นตัวคุณเอง เราสนใจอย่างหลัง"
      },
      readtime: "5 min"
    }
  ];

  return { products, ui, journal };
})();
