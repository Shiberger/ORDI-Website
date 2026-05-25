// ORDI - More screens: Cart, Checkout, About, Journal, Account, Membership

// ============================================================
// CART (full page version, vs drawer)
// ============================================================
function CartScreen() {
  const { cart, subtotal, setQty, removeFromCart, t, go, lang } = useApp();
  const products = window.ORDI_DATA.products;

  return (
    <main className="ordi-cartpage">
      <header className="ordi-cartpage__head">
        <MonoTag>↘ CART</MonoTag>
        <h1 className="ordi-display-lg">Your <em>order</em>.</h1>
      </header>
      {cart.length === 0 ? (
        <div className="ordi-cartpage__empty">
          <p>{t.empty_cart}</p>
          <button className="ordi-btn ordi-btn--primary" onClick={() => go("shop")}>{t.cta.shop_all} →</button>
        </div>
      ) : (
        <div className="ordi-cartpage__grid">
          <div>
            {cart.map((it, i) => {
              const p = products.find(x => x.id === it.id);
              const s = p.sizes.find(x => x.ml === it.size);
              return (
                <div className="ordi-cartrow" key={i}>
                  <div className="ordi-cartrow__media" style={{ background: p.hue }}>
                    <span>{p.number}</span>
                  </div>
                  <div className="ordi-cartrow__meta">
                    <div className="ordi-cartrow__name">{p.name}</div>
                    <div className="ordi-cartrow__sub"><em>{p.tagline[lang]}</em></div>
                    <MonoTag>{it.size}ml · EAU DE PARFUM</MonoTag>
                  </div>
                  <div className="ordi-cartrow__qty">
                    <button onClick={() => setQty(it.id, it.size, it.qty - 1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(it.id, it.size, it.qty + 1)}>+</button>
                  </div>
                  <div className="ordi-cartrow__price">{formatPrice(s.price * it.qty)} {t.currency}</div>
                  <button className="ordi-cartrow__remove" onClick={() => removeFromCart(it.id, it.size)}>✕</button>
                </div>
              );
            })}
          </div>
          <aside className="ordi-cartpage__summary">
            <MonoTag>↘ SUMMARY</MonoTag>
            <div className="ordi-summary__row"><span>{t.subtotal}</span><span>{formatPrice(subtotal)} {t.currency}</span></div>
            <div className="ordi-summary__row"><span>{lang === "en" ? "Shipping" : "ค่าจัดส่ง"}</span><span>{lang === "en" ? "Calculated next" : "คำนวณถัดไป"}</span></div>
            <div className="ordi-summary__row ordi-summary__row--total"><span>{lang === "en" ? "Total" : "รวม"}</span><span>{formatPrice(subtotal)} {t.currency}</span></div>
            <button className="ordi-btn ordi-btn--primary ordi-btn--full" onClick={() => go("checkout")}>{t.cta.checkout} →</button>
            <ul className="ordi-summary__perks">
              <li>✦ {t.product.included}</li>
              <li>✦ {t.product.ships}</li>
              <li>✦ {lang === "en" ? "30-day return on unopened" : "คืนได้ภายใน 30 วันสำหรับสินค้าที่ยังไม่เปิด"}</li>
            </ul>
          </aside>
        </div>
      )}
    </main>
  );
}

// ============================================================
// CHECKOUT
// ============================================================
function CheckoutScreen() {
  const { cart, subtotal, t, go, lang } = useApp();
  const products = window.ORDI_DATA.products;
  const [step, setStep] = useStateS(1);
  const [done, setDone] = useStateS(false);
  const [form, setForm] = useStateS({
    email: "", first: "", last: "", address: "", city: "Bangkok",
    postcode: "", phone: "", method: "thai-post", payment: "card"
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const ship = form.method === "kerry" ? 80 : form.method === "thai-post" ? 50 : 0;
  const total = subtotal + ship;

  if (done) {
    return (
      <main className="ordi-checkout ordi-checkout--done">
        <div className="ordi-thanks">
          <MonoTag>ORDER · ORDI-{String(Math.floor(Math.random() * 90000) + 10000)}</MonoTag>
          <h1 className="ordi-display-lg">{lang === "en" ? <span>Thank <em>you</em>.</span> : <span><em>ขอบคุณ</em>.</span>}</h1>
          <p>{lang === "en"
            ? "We'll hand-bottle your order in the studio this week. A confirmation is on its way to your inbox."
            : "เราจะบรรจุคำสั่งซื้อของคุณด้วยมือในสตูดิโอภายในสัปดาห์นี้ อีเมลยืนยันกำลังจะส่งถึง"}</p>
          <div className="ordi-thanks__meta">
            <div><MonoTag>EST. ARRIVAL</MonoTag>{lang === "en" ? "3–5 business days" : "3–5 วันทำการ"}</div>
            <div><MonoTag>FROM</MonoTag>Sukhumvit Studio, Bangkok</div>
          </div>
          <button className="ordi-btn ordi-btn--ghost" onClick={() => go("home")}>← Back to ORDI</button>
        </div>
      </main>
    );
  }

  return (
    <main className="ordi-checkout">
      <header className="ordi-checkout__head">
        <MonoTag>↘ CHECKOUT</MonoTag>
        <h1 className="ordi-display-lg">Almost <em>yours</em>.</h1>
        <ol className="ordi-checkout__steps">
          {["Contact", lang === "en" ? "Shipping" : "การจัดส่ง", lang === "en" ? "Payment" : "การชำระเงิน"].map((s, i) => (
            <li key={i} className={cls(step === i+1 && "is-active", step > i+1 && "is-done")}>
              <span>0{i+1}</span><span>{s}</span>
            </li>
          ))}
        </ol>
      </header>

      <div className="ordi-checkout__grid">
        <div className="ordi-checkout__form">
          {step === 1 && (
            <section className="ordi-formstep">
              <h2>01 — Contact</h2>
              <label><span>{lang === "en" ? "Email" : "อีเมล"}</span><input value={form.email} onChange={e => upd("email", e.target.value)} placeholder="you@email"/></label>
              <div className="ordi-form-row">
                <label><span>{lang === "en" ? "First name" : "ชื่อ"}</span><input value={form.first} onChange={e => upd("first", e.target.value)} /></label>
                <label><span>{lang === "en" ? "Last name" : "นามสกุล"}</span><input value={form.last} onChange={e => upd("last", e.target.value)} /></label>
              </div>
              <label><span>{lang === "en" ? "Phone" : "โทรศัพท์"}</span><input value={form.phone} onChange={e => upd("phone", e.target.value)} placeholder="+66"/></label>
              <button className="ordi-btn ordi-btn--primary" onClick={() => setStep(2)}>{t.cta.continue} →</button>
            </section>
          )}
          {step === 2 && (
            <section className="ordi-formstep">
              <h2>02 — {lang === "en" ? "Shipping" : "การจัดส่ง"}</h2>
              <label><span>{lang === "en" ? "Address" : "ที่อยู่"}</span><input value={form.address} onChange={e => upd("address", e.target.value)} /></label>
              <div className="ordi-form-row">
                <label><span>{lang === "en" ? "City" : "เมือง"}</span><input value={form.city} onChange={e => upd("city", e.target.value)} /></label>
                <label><span>{lang === "en" ? "Postcode" : "รหัสไปรษณีย์"}</span><input value={form.postcode} onChange={e => upd("postcode", e.target.value)} /></label>
              </div>
              <fieldset className="ordi-radiogroup">
                <legend>{lang === "en" ? "Carrier" : "ผู้ให้บริการ"}</legend>
                {[
                  { id: "thai-post", label: "Thai Post · 50 THB · 3-5 days" },
                  { id: "kerry", label: "Kerry Express · 80 THB · 1-2 days" },
                  { id: "pickup", label: lang === "en" ? "Studio pickup · Free · Sukhumvit" : "รับที่สตูดิโอ · ฟรี · สุขุมวิท" },
                ].map(o => (
                  <label key={o.id} className={cls("ordi-radio", form.method === o.id && "is-checked")}>
                    <input type="radio" name="method" checked={form.method === o.id} onChange={() => upd("method", o.id)} />
                    <span className="ordi-radio__dot"></span>
                    <span>{o.label}</span>
                  </label>
                ))}
              </fieldset>
              <div className="ordi-formstep__actions">
                <button className="ordi-btn ordi-btn--ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="ordi-btn ordi-btn--primary" onClick={() => setStep(3)}>{t.cta.continue} →</button>
              </div>
            </section>
          )}
          {step === 3 && (
            <section className="ordi-formstep">
              <h2>03 — {lang === "en" ? "Payment" : "การชำระเงิน"}</h2>
              <fieldset className="ordi-radiogroup">
                {[
                  { id: "card", label: lang === "en" ? "Credit / debit card" : "บัตรเครดิต / เดบิต" },
                  { id: "promptpay", label: "PromptPay QR" },
                  { id: "transfer", label: lang === "en" ? "Bank transfer (SCB · Kasikorn)" : "โอนผ่านธนาคาร (SCB · กสิกร)" },
                ].map(o => (
                  <label key={o.id} className={cls("ordi-radio", form.payment === o.id && "is-checked")}>
                    <input type="radio" name="payment" checked={form.payment === o.id} onChange={() => upd("payment", o.id)} />
                    <span className="ordi-radio__dot"></span>
                    <span>{o.label}</span>
                  </label>
                ))}
              </fieldset>
              {form.payment === "card" && (
                <React.Fragment>
                  <label><span>{lang === "en" ? "Card number" : "หมายเลขบัตร"}</span><input placeholder="•••• •••• •••• ••••" /></label>
                  <div className="ordi-form-row">
                    <label><span>MM / YY</span><input placeholder="MM / YY" /></label>
                    <label><span>CVC</span><input placeholder="•••" /></label>
                  </div>
                </React.Fragment>
              )}
              {form.payment === "promptpay" && (
                <div className="ordi-pay-promptpay">
                  <div className="ordi-pay-qr">
                    <div className="ordi-pay-qr__inner"></div>
                  </div>
                  <p>{lang === "en" ? "Scan with any Thai banking app. Your order will be released once we see the transfer." : "สแกนด้วยแอปธนาคารใดก็ได้ คำสั่งซื้อจะถูกปล่อยเมื่อเราเห็นการโอน"}</p>
                </div>
              )}
              <div className="ordi-formstep__actions">
                <button className="ordi-btn ordi-btn--ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="ordi-btn ordi-btn--primary" onClick={() => setDone(true)}>{t.cta.place_order} — {formatPrice(total)} {t.currency}</button>
              </div>
            </section>
          )}
        </div>

        <aside className="ordi-checkout__summary">
          <MonoTag>↘ {lang === "en" ? "Your order" : "คำสั่งซื้อของคุณ"}</MonoTag>
          {cart.length === 0 && <p style={{ opacity: 0.6 }}>{t.empty_cart}</p>}
          {cart.map((it, i) => {
            const p = products.find(x => x.id === it.id);
            const s = p.sizes.find(x => x.ml === it.size);
            return (
              <div className="ordi-checkout__item" key={i}>
                <div className="ordi-checkout__thumb" style={{ background: p.hue }}>
                  <span>{p.number}</span>
                  <span className="ordi-checkout__thumbqty">{it.qty}</span>
                </div>
                <div className="ordi-checkout__itemmeta">
                  <div>{p.name}</div>
                  <MonoTag>{it.size}ml</MonoTag>
                </div>
                <div className="ordi-checkout__itemprice">{formatPrice(s.price * it.qty)} {t.currency}</div>
              </div>
            );
          })}
          <div className="ordi-summary__row"><span>{t.subtotal}</span><span>{formatPrice(subtotal)} {t.currency}</span></div>
          <div className="ordi-summary__row"><span>{lang === "en" ? "Shipping" : "จัดส่ง"}</span><span>{ship === 0 ? (lang === "en" ? "Free" : "ฟรี") : `${ship} ${t.currency}`}</span></div>
          <div className="ordi-summary__row ordi-summary__row--total"><span>{lang === "en" ? "Total" : "รวม"}</span><span>{formatPrice(total)} {t.currency}</span></div>
        </aside>
      </div>
    </main>
  );
}

// ============================================================
// ABOUT
// ============================================================
function AboutScreen() {
  const { lang, go, t } = useApp();
  return (
    <main className="ordi-about">
      <section className="ordi-about__hero">
        <MonoTag>ABOUT · EST. 2024</MonoTag>
        <h1 className="ordi-display-xl">
          <span>We started <em>ORDI</em></span>
          <span>because most perfume</span>
          <span><em>tries too hard.</em></span>
        </h1>
      </section>

      <section className="ordi-about__intro">
        <div className="ordi-about__intro-media">
          <image-slot id="about-intro" shape="rect" placeholder="Studio interior — bench, beakers, light" style={{ width: "100%", height: "100%" }}></image-slot>
        </div>
        <div className="ordi-about__intro-copy">
          <MonoTag>↘ THE STUDIO</MonoTag>
          <p className="ordi-about__lede">
            {lang === "en"
              ? "ORDI is a small Bangkok perfume house, run out of a one-room studio on Sukhumvit, by two people who used to do other things. We compose, macerate, age, bottle, label, and pack every order ourselves."
              : "ORDI คือบ้านน้ำหอมเล็กๆ ในกรุงเทพ ดำเนินการในสตูดิโอห้องเดียวบนถนนสุขุมวิท โดยสองคนที่เคยทำอย่างอื่น เราประพันธ์ หมัก บ่ม บรรจุ ติดฉลาก และส่งสินค้าทุกคำสั่งซื้อด้วยตัวเอง"}
          </p>
          <p>
            {lang === "en"
              ? "The name comes from a quiet idea: that being out of the ordinary doesn't mean being loud. The best perfumes don't announce themselves. They wait."
              : "ชื่อมาจากแนวคิดเงียบๆ ว่า การไม่ธรรมดาไม่ได้แปลว่าต้องเสียงดัง น้ำหอมที่ดีที่สุดไม่ประกาศตัวเอง พวกมันรอ"}
          </p>
        </div>
      </section>

      <section className="ordi-about__values">
        {[
          { n: "01", t: lang === "en" ? "Small batches, on purpose" : "ผลิตเป็นล็อตเล็ก โดยตั้งใจ",
            b: lang === "en" ? "We make 300 bottles at a time. Every label is signed by the person who filled it. If a batch isn't right, it doesn't leave the studio." : "เราทำครั้งละ 300 ขวด ทุกฉลากเซ็นโดยคนที่บรรจุ หากล็อตไหนไม่ได้ มันจะไม่ออกจากสตูดิโอ" },
          { n: "02", t: lang === "en" ? "High concentration" : "ความเข้มข้นสูง",
            b: lang === "en" ? "All ORDI scents are 18% extrait — eau de parfum, properly. They develop on the skin for ten to twelve hours, the way perfume is supposed to." : "ทุกกลิ่นของ ORDI มีความเข้มข้น 18% เอกซ์เทรต์ — โอเดอปาร์ฟัมอย่างถูกต้อง พัฒนาบนผิวสิบถึงสิบสองชั่วโมง ตามที่น้ำหอมควรจะเป็น" },
          { n: "03", t: lang === "en" ? "Quiet, on purpose" : "เงียบ โดยตั้งใจ",
            b: lang === "en" ? "We don't run sales. We don't do flash drops. We make five fragrances and a sixth is coming. That's the whole catalogue." : "เราไม่ลดราคา ไม่ทำการตลาดเร่งด่วน เราทำห้ากลิ่นและกลิ่นที่หกกำลังจะมา นั่นคือทั้งหมดของแคตาล็อก" }
        ].map((v, i) => (
          <article key={i}>
            <MonoTag>N°{v.n}</MonoTag>
            <h3 className="ordi-display-sm"><em>{v.t}</em></h3>
            <p>{v.b}</p>
          </article>
        ))}
      </section>

      <section className="ordi-about__process">
        <SectionHead
          kicker="↘ HOW WE WORK"
          title={<span>From the bench<br/>to <em>your wrist</em>.</span>}
        />
        <ol className="ordi-process">
          {[
            { en: "Composition", th: "การประพันธ์", d: "Two to three months on the bench. Iteration on glass strips, then on skin." },
            { en: "Maceration", th: "การหมัก", d: "Eight weeks in amber glass, in the dark, at studio temperature." },
            { en: "Filtration", th: "การกรอง", d: "Cold-filtered twice. The liquid clears and the personality stays." },
            { en: "Bottling", th: "การบรรจุ", d: "By hand, in batches of 300. Numbered, signed, dated." }
          ].map((s, i) => (
            <li key={i}>
              <MonoTag>0{i+1}</MonoTag>
              <div className="ordi-process__name">{lang === "en" ? s.en : s.th}</div>
              <div className="ordi-process__desc">{s.d}</div>
            </li>
          ))}
        </ol>
      </section>

      <section className="ordi-about__founders">
        <div className="ordi-about__founders-media">
          <image-slot id="about-founders" shape="rect" placeholder="Two founders, casual editorial portrait" style={{ width: "100%", height: "100%" }}></image-slot>
        </div>
        <div className="ordi-about__founders-copy">
          <MonoTag>↘ THE TWO OF US</MonoTag>
          <h2 className="ordi-display-md"><em>P. & A.</em></h2>
          <p>{lang === "en"
            ? "P. trained at an indie perfumery house in Grasse and came home to Bangkok in 2023. A. used to work in fashion. They share a one-room studio and a small black cat named Ous."
            : "P. ฝึกที่บ้านน้ำหอมอิสระในกราสและกลับมากรุงเทพในปี 2023 A. เคยทำงานในวงการแฟชั่น พวกเขาแบ่งสตูดิโอห้องเดียวและแมวดำตัวเล็กชื่อ Ous"}</p>
          <button className="ordi-btn ordi-btn--ghost" onClick={() => go("journal")}>Read the journal →</button>
        </div>
      </section>
    </main>
  );
}

// ============================================================
// JOURNAL
// ============================================================
function JournalScreen() {
  const { lang } = useApp();
  return (
    <main className="ordi-journal">
      <header className="ordi-journal__head">
        <MonoTag>↘ JOURNAL · NOTES FROM THE STUDIO</MonoTag>
        <h1 className="ordi-display-xl">{lang === "en" ? <span>Slowly,<br/><em>about</em><br/>smelling.</span> : <span>ช้าๆ<br/><em>เกี่ยวกับ</em><br/>การได้กลิ่น</span>}</h1>
      </header>
      <div className="ordi-journal__feature">
        <div className="ordi-journal__feature-media">
          <image-slot id="jrn-feature" shape="rect" placeholder="Feature article — moody editorial photograph" style={{ width: "100%", height: "100%" }}></image-slot>
        </div>
        <div className="ordi-journal__feature-copy">
          <MonoTag>{window.ORDI_DATA.journal[0].number} · {window.ORDI_DATA.journal[0].date}</MonoTag>
          <h2 className="ordi-display-md">{window.ORDI_DATA.journal[0].title[lang]}</h2>
          <p>{window.ORDI_DATA.journal[0].excerpt[lang]}</p>
          <MonoTag>↗ READ · {window.ORDI_DATA.journal[0].readtime}</MonoTag>
        </div>
      </div>

      <div className="ordi-journal__list">
        {window.ORDI_DATA.journal.slice(1).map(j => (
          <article className="ordi-jcard ordi-jcard--list" key={j.id}>
            <div className="ordi-jcard__meta">
              <MonoTag>{j.number}</MonoTag>
              <span>{j.date}</span>
              <span>{j.readtime}</span>
            </div>
            <h3 className="ordi-jcard__title">{j.title[lang]}</h3>
            <p>{j.excerpt[lang]}</p>
            <MonoTag>↗ READ</MonoTag>
          </article>
        ))}
      </div>

      <section className="ordi-journal__archive">
        <SectionHead kicker="↘ ARCHIVE" title={<span><em>Older</em> entries.</span>}/>
        <ul className="ordi-archive">
          {[
            { n: "JRN.004", d: "2025.11.14", t: { en: "Why we don't do limited editions", th: "ทำไมเราไม่ทำลิมิเต็ดอิดิชั่น" } },
            { n: "JRN.005", d: "2025.09.02", t: { en: "Three perfumes I wore for ten years", th: "น้ำหอมสามขวดที่ฉันใส่มาสิบปี" } },
            { n: "JRN.006", d: "2025.07.21", t: { en: "On the smell of long flights", th: "ว่าด้วยกลิ่นของเที่ยวบินยาว" } },
            { n: "JRN.007", d: "2025.05.05", t: { en: "Our first 100 customers", th: "ลูกค้าร้อยคนแรกของเรา" } }
          ].map((a, i) => (
            <li key={i}>
              <MonoTag>{a.n}</MonoTag>
              <span className="ordi-archive__t">{a.t[lang]}</span>
              <span className="ordi-archive__d">{a.d}</span>
              <span className="ordi-archive__arrow">→</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

// ============================================================
// ACCOUNT (login)
// ============================================================
function AccountScreen() {
  const { go, lang, t } = useApp();
  const [mode, setMode] = useStateS("sign-in");
  const [signed, setSigned] = useStateS(false);

  if (signed) {
    return (
      <main className="ordi-account">
        <header className="ordi-account__signed-head">
          <div>
            <MonoTag>MEMBER · ORDI-M-1289</MonoTag>
            <h1 className="ordi-display-lg">{lang === "en" ? <span>Welcome back, <em>P</em>.</span> : <span>ยินดีต้อนรับกลับมา <em>P</em></span>}</h1>
          </div>
          <button className="ordi-btn ordi-btn--ghost" onClick={() => setSigned(false)}>{lang === "en" ? "Sign out" : "ออกจากระบบ"}</button>
        </header>
        <div className="ordi-account__signed-grid">
          <article className="ordi-acard">
            <MonoTag>↘ ORDERS</MonoTag>
            <h2 className="ordi-display-sm">Recent</h2>
            <ul className="ordi-orderlist">
              <li><span>ORDI-48201</span><span>GOOD BOY 50ml</span><span>{lang === "en" ? "Delivered" : "ส่งแล้ว"}</span><span>1,890</span></li>
              <li><span>ORDI-47889</span><span>SEA BREEZE 12ml</span><span>{lang === "en" ? "In transit" : "กำลังจัดส่ง"}</span><span>690</span></li>
              <li><span>ORDI-47012</span><span>DROWNING LOVE 50ml</span><span>{lang === "en" ? "Delivered" : "ส่งแล้ว"}</span><span>1,890</span></li>
            </ul>
          </article>
          <article className="ordi-acard">
            <MonoTag>↘ WISHLIST</MonoTag>
            <h2 className="ordi-display-sm">Saved</h2>
            <ul className="ordi-orderlist">
              <li><span>N°02</span><span>HOT DILF 50ml</span><span>—</span><span>1,890</span></li>
              <li><span>N°05</span><span>SKIN SCENT 50ml</span><span>{t.coming_soon.toUpperCase()}</span><span>2,190</span></li>
            </ul>
          </article>
          <article className="ordi-acard ordi-acard--member">
            <MonoTag>↘ MEMBERSHIP</MonoTag>
            <div className="ordi-tier">
              <span>TIER</span>
              <h2 className="ordi-display-lg"><em>Ous</em></h2>
              <span>2 of 3 orders to next tier</span>
            </div>
            <div className="ordi-tier__bar"><div style={{ width: "66%" }}></div></div>
            <button className="ordi-btn ordi-btn--ghost ordi-btn--sm" onClick={() => go("membership")}>View benefits →</button>
          </article>
          <article className="ordi-acard">
            <MonoTag>↘ ADDRESSES</MonoTag>
            <div className="ordi-addr">
              <div>P. Sukhumvit</div>
              <div>61/2 Sukhumvit Soi 31</div>
              <div>Wattana, Bangkok 10110</div>
              <div>+66 8• ••• ••••</div>
            </div>
          </article>
        </div>
      </main>
    );
  }

  return (
    <main className="ordi-account">
      <div className="ordi-auth">
        <div className="ordi-auth__media">
          <image-slot id="auth-art" shape="rect" placeholder="Quiet still life — bottle, paper" style={{ width: "100%", height: "100%" }}></image-slot>
          <div className="ordi-auth__caption">
            <MonoTag>NOT REQUIRED TO SHOP</MonoTag>
            <p><em>Members</em> receive a sample card with every order and quiet access to new collections.</p>
          </div>
        </div>
        <div className="ordi-auth__form">
          <div className="ordi-auth__tabs">
            <button className={cls(mode === "sign-in" && "is-active")} onClick={() => setMode("sign-in")}>{t.cta.sign_in}</button>
            <button className={cls(mode === "sign-up" && "is-active")} onClick={() => setMode("sign-up")}>{t.cta.sign_up}</button>
          </div>
          <h1 className="ordi-display-md">
            {mode === "sign-in"
              ? (lang === "en" ? <span>Welcome <em>back</em>.</span> : <span><em>ยินดีต้อนรับ</em>กลับมา</span>)
              : (lang === "en" ? <span>Become <em>Ous</em>.</span> : <span>เป็น <em>Ous</em></span>)
            }
          </h1>
          {mode === "sign-up" && (
            <div className="ordi-form-row">
              <label><span>{lang === "en" ? "First name" : "ชื่อ"}</span><input /></label>
              <label><span>{lang === "en" ? "Last name" : "นามสกุล"}</span><input /></label>
            </div>
          )}
          <label><span>{lang === "en" ? "Email" : "อีเมล"}</span><input placeholder="you@email"/></label>
          <label><span>{lang === "en" ? "Password" : "รหัสผ่าน"}</span><input type="password" placeholder="••••••••"/></label>
          <button className="ordi-btn ordi-btn--primary ordi-btn--full" onClick={() => setSigned(true)}>
            {mode === "sign-in" ? t.cta.sign_in : t.cta.sign_up} →
          </button>
          {mode === "sign-in" && <a className="ordi-auth__forgot">{lang === "en" ? "Forgot password?" : "ลืมรหัสผ่าน?"}</a>}
          <div className="ordi-auth__or"><span>{lang === "en" ? "or" : "หรือ"}</span></div>
          <button className="ordi-btn ordi-btn--ghost ordi-btn--full">Continue with Google</button>
          <button className="ordi-btn ordi-btn--ghost ordi-btn--full">Continue with LINE</button>
        </div>
      </div>
    </main>
  );
}

// ============================================================
// MEMBERSHIP
// ============================================================
function MembershipScreen() {
  const { go, lang, t } = useApp();
  const tiers = [
    {
      name: "Ordinary",
      sub: lang === "en" ? "Free · everyone" : "ฟรี · ทุกคน",
      desc: lang === "en" ? "Sign up. Sample card with every order. Quiet newsletter." : "สมัคร · การ์ดทดลองทุกออเดอร์ · จดหมายข่าวเงียบๆ",
      benefits: [
        lang === "en" ? "Sample card included" : "การ์ดทดลองในทุกออเดอร์",
        lang === "en" ? "Early access — 24 hours" : "เข้าถึงก่อน 24 ชั่วโมง",
        lang === "en" ? "Birthday note" : "บัตรอวยพรวันเกิด"
      ]
    },
    {
      name: "Ous",
      sub: lang === "en" ? "After 3 orders" : "หลัง 3 ออเดอร์",
      desc: lang === "en" ? "A small thank-you, a louder sample card, complimentary engraving." : "ขอบคุณเล็กๆ การ์ดทดลองที่ใหญ่ขึ้น และการสลักชื่อฟรี",
      benefits: [
        lang === "en" ? "Free engraving on the bottle" : "สลักชื่อบนขวดฟรี",
        lang === "en" ? "Free shipping over 1,500 THB" : "ส่งฟรีเมื่อสั่งซื้อ 1,500 บาทขึ้นไป",
        lang === "en" ? "Five-card sample box per year" : "กล่องทดลองห้าการ์ดต่อปี",
        lang === "en" ? "Invite to studio open days" : "เชิญเข้าวันเปิดสตูดิโอ"
      ],
      featured: true
    },
    {
      name: "Out of Ordinary",
      sub: lang === "en" ? "By invitation" : "ตามคำเชิญ",
      desc: lang === "en" ? "Our top 50 customers. The first bottle of every new release, hand-delivered if you're in Bangkok." : "ลูกค้า 50 อันดับแรกของเรา ขวดแรกของทุกการเปิดตัวใหม่ ส่งด้วยมือถ้าคุณอยู่ในกรุงเทพ",
      benefits: [
        lang === "en" ? "Bottle N°001 of every new release" : "ขวดหมายเลข 001 ของทุกการเปิดตัว",
        lang === "en" ? "One-on-one consultation, twice a year" : "ปรึกษาส่วนตัวปีละสองครั้ง",
        lang === "en" ? "Bespoke fragrance, every two years" : "น้ำหอมเฉพาะตัว ทุกสองปี",
        lang === "en" ? "Hand delivery in Bangkok" : "ส่งด้วยมือในกรุงเทพ"
      ]
    }
  ];

  return (
    <main className="ordi-member">
      <header className="ordi-member__hero">
        <MonoTag>↘ MEMBERSHIP · ORDI / OUS</MonoTag>
        <h1 className="ordi-display-xl">
          <span>Three <em>tiers</em>.</span>
          <span>No points. No discounts.</span>
          <span>Just <em>better fragrance</em>.</span>
        </h1>
        <p className="ordi-member__lede">
          {lang === "en"
            ? "We don't think loyalty should cost money. Our membership is automatic — the more you order, the more we recognize you, in small and quiet ways."
            : "เราไม่คิดว่าความภักดีควรเสียเงิน สมาชิกของเราเป็นอัตโนมัติ — ยิ่งคุณสั่งซื้อมาก เราก็ยิ่งจำคุณได้ ในวิธีเล็กและเงียบ"}
        </p>
      </header>

      <section className="ordi-tiers">
        {tiers.map((tier, i) => (
          <article className={cls("ordi-tier-card", tier.featured && "is-featured")} key={i}>
            <header>
              <MonoTag>0{i+1}{tier.featured && " · CURRENT"}</MonoTag>
              <h2 className="ordi-display-md"><em>{tier.name}</em></h2>
              <span className="ordi-tier-card__sub">{tier.sub}</span>
            </header>
            <p>{tier.desc}</p>
            <ul>
              {tier.benefits.map((b, j) => (
                <li key={j}><span className="ordi-tier-card__bullet">∙</span>{b}</li>
              ))}
            </ul>
            <button
              className={cls("ordi-btn", tier.featured ? "ordi-btn--primary" : "ordi-btn--ghost", "ordi-btn--full")}
              onClick={() => go("account")}
            >
              {tier.featured ? (lang === "en" ? "Your current tier" : "ระดับของคุณ") : (lang === "en" ? "How to reach" : "วิธีเลื่อนระดับ")} →
            </button>
          </article>
        ))}
      </section>

      <section className="ordi-member__faq">
        <SectionHead kicker="↘ COMMON QUESTIONS" title={<span><em>Honestly</em>,<br/>what's the catch?</span>}/>
        <div className="ordi-faq">
          {[
            { q: lang === "en" ? "Is there a fee?" : "มีค่าธรรมเนียมไหม?", a: lang === "en" ? "No. Membership is free and automatic from your first order." : "ไม่มี สมาชิกฟรีและอัตโนมัติตั้งแต่ออเดอร์แรก" },
            { q: lang === "en" ? "Do you do discounts?" : "ลดราคาไหม?", a: lang === "en" ? "No. We price our fragrances fairly to begin with. We'd rather give you a sample card." : "ไม่ เราตั้งราคาน้ำหอมอย่างเป็นธรรมตั้งแต่ต้น เราอยากให้การ์ดทดลองมากกว่า" },
            { q: lang === "en" ? "How do I become Out of Ordinary?" : "จะเป็น Out of Ordinary ได้อย่างไร?", a: lang === "en" ? "By invitation, after a year of consistent orders. We'll write to you. Don't ask." : "โดยคำเชิญ หลังจากสั่งซื้ออย่างต่อเนื่องเป็นเวลาหนึ่งปี เราจะเขียนถึงคุณ อย่าถาม" },
            { q: lang === "en" ? "Can I gift my benefits?" : "โอนสิทธิประโยชน์ได้ไหม?", a: lang === "en" ? "Engravings and bespoke slots, yes. Just tell us when you order." : "การสลักและสล็อตเฉพาะตัว ได้ แค่บอกเราตอนสั่งซื้อ" }
          ].map((f, i) => <FaqItem key={i} q={f.q} a={f.a} idx={i}/>)}
        </div>
      </section>
    </main>
  );
}

function FaqItem({ q, a, idx }) {
  const [open, setOpen] = useStateS(idx === 0);
  return (
    <details className="ordi-faq__item" open={open} onToggle={e => setOpen(e.currentTarget.open)}>
      <summary>
        <MonoTag>Q.0{idx+1}</MonoTag>
        <span>{q}</span>
        <span className="ordi-faq__plus">{open ? "−" : "+"}</span>
      </summary>
      <p>{a}</p>
    </details>
  );
}

Object.assign(window, { CartScreen, CheckoutScreen, AboutScreen, JournalScreen, AccountScreen, MembershipScreen });
