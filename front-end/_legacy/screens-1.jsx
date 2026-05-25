// ORDI - All screens
const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

// ============================================================
// HOME
// ============================================================
function HomeScreen() {
  const { go, t, lang } = useApp();
  const products = window.ORDI_DATA.products;
  const featured = products.slice(0, 4);
  const skin = products.find(p => p.id === "skin-scent");

  return (
    <main className="ordi-home">

      {/* HERO — text-only poster */}
      <section className="ordi-hero">
        <div className="ordi-hero__poster">
          <div className="ordi-hero__meta">
            <MonoTag>EST. BANGKOK / 2024</MonoTag>
            <MonoTag>VOL. 05 · {new Date().toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase()}</MonoTag>
          </div>

          <h1 className="ordi-hero__title">
            <span className="ordi-hero__line ordi-hero__line--1">Out of</span>
            <span className="ordi-hero__line ordi-hero__line--2"><em>Ordinary</em></span>
            <span className="ordi-hero__line ordi-hero__line--3">Only Ous.</span>
          </h1>

          <div className="ordi-hero__bottom">
            <p className="ordi-hero__lede">
              {lang === "en"
                ? "Five fragrances. One small studio in Bangkok. Perfume for people who don't want to smell like everyone else — and aren't quite sure what they do want to smell like."
                : "ห้ากลิ่น สตูดิโอเล็กๆ ในกรุงเทพ น้ำหอมสำหรับคนที่ไม่อยากมีกลิ่นเหมือนใคร — และยังไม่แน่ใจว่าตัวเองอยากมีกลิ่นแบบไหน"
              }
            </p>
            <div className="ordi-hero__cta">
              <button className="ordi-btn ordi-btn--primary" onClick={() => go("shop")}>{t.cta.shop_all} →</button>
              <button className="ordi-btn ordi-btn--ghost" onClick={() => go("about")}>The studio</button>
            </div>
          </div>

          <div className="ordi-hero__foot">
            <MonoTag>↓ scroll · the collection</MonoTag>
            <MonoTag>{t.origin.toUpperCase()}</MonoTag>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <Marquee items={[
        "FIVE FRAGRANCES", "MADE BY HAND IN BANGKOK", "NICHE PERFUMERY",
        "EAU DE PARFUM 18%", "VEGAN · CRUELTY-FREE", "OUT OF ORDINARY ONLY OUS"
      ]} speed={45}/>

      {/* COLLECTION GRID */}
      <section className="ordi-section ordi-collection">
        <SectionHead
          kicker="↘ THE COLLECTION · N°01—N°05"
          title={<span>Five fragrances,<br/>one for each <em>version</em><br/>of you.</span>}
          right={
            <div className="ordi-secthead__right-inner">
              <p>
                {lang === "en"
                  ? "Each scent is composed and macerated in our Sukhumvit studio. Aged sixty days. Bottled in fifty milliliters or twelve."
                  : "ทุกกลิ่นถูกประพันธ์และหมักในสตูดิโอย่านสุขุมวิทของเรา บ่มหกสิบวัน บรรจุในขนาดห้าสิบหรือสิบสองมิลลิลิตร"}
              </p>
              <button className="ordi-btn ordi-btn--ghost" onClick={() => go("shop")}>{t.cta.shop_all} →</button>
            </div>
          }
        />
        <div className="ordi-collection__grid">
          {featured.map((p, i) => (
            <article className="ordi-pcard" key={p.id} onClick={() => go("product", { id: p.id })}>
              <div className="ordi-pcard__media" style={{ background: p.hue }}>
                <image-slot
                  id={`home-card-${p.id}`}
                  shape="rect"
                  placeholder={`${p.name} — bottle on ${p.hue === "#1A1612" || p.hue === "#2A1A24" ? "dark" : "neutral"} backdrop`}
                  style={{ width: "100%", height: "100%" }}
                ></image-slot>
                <div className="ordi-pcard__num">{p.number}</div>
              </div>
              <div className="ordi-pcard__meta">
                <div className="ordi-pcard__top">
                  <h3 className="ordi-pcard__name">{p.name}</h3>
                  <div className="ordi-pcard__price">{formatPrice(p.sizes[0].price)} {t.currency}</div>
                </div>
                <p className="ordi-pcard__tagline"><em>{p.tagline[lang]}</em></p>
                <div className="ordi-pcard__notes">
                  {[...p.notes.top, ...p.notes.heart].slice(0, 3).map((n, j) => (
                    <span key={j}>{n}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SKIN SCENT TEASE */}
      <section className="ordi-skinscent">
        <div className="ordi-skinscent__grid">
          <div className="ordi-skinscent__media">
            <image-slot
              id="skinscent-tease"
              shape="rect"
              placeholder="SKIN SCENT — moody close-up of skin / fabric"
              style={{ width: "100%", height: "100%" }}
            ></image-slot>
            <div className="ordi-skinscent__chip">{t.coming_soon.toUpperCase()}</div>
          </div>
          <div className="ordi-skinscent__copy">
            <MonoTag>N°05 · NEW COLLECTION</MonoTag>
            <h2 className="ordi-display-lg">Skin <em>Scent.</em></h2>
            <p>
              {lang === "en"
                ? "A perfume that doesn't arrive. It is already there. The fifth in our collection — designed to live underneath, almost beneath, the people who get close enough."
                : "น้ำหอมที่ไม่ได้มาถึง มันอยู่ที่นั่นแล้ว กลิ่นที่ห้าในคอลเลกชั่น — ออกแบบมาให้อยู่ใต้ผิว เกือบใต้ ของคนที่เข้ามาใกล้พอ"}
            </p>
            <div className="ordi-skinscent__notes">
              <div><MonoTag>{t.product.top}</MonoTag>{skin.notes.top.join(" · ")}</div>
              <div><MonoTag>{t.product.heart}</MonoTag>{skin.notes.heart.join(" · ")}</div>
              <div><MonoTag>{t.product.base}</MonoTag>{skin.notes.base.join(" · ")}</div>
            </div>
            <button className="ordi-btn ordi-btn--primary" onClick={() => go("product", { id: "skin-scent" })}>
              {t.cta.sold_out} →
            </button>
          </div>
        </div>
      </section>

      {/* PRESS QUOTES */}
      <section className="ordi-press">
        <MonoTag>NOTES ABOUT US</MonoTag>
        <div className="ordi-press__grid">
          <blockquote>
            <p>{lang === "en" ? "“Bangkok's most quietly confident new perfume house.”" : "“บ้านน้ำหอมหน้าใหม่ของกรุงเทพที่มั่นใจอย่างเงียบๆ ที่สุด”"}</p>
            <cite>— A SMALL MAGAZINE</cite>
          </blockquote>
          <blockquote>
            <p>{lang === "en" ? "“The kind of fragrance you keep on the nightstand and won't tell anyone the name of.”" : "“น้ำหอมที่เก็บไว้ที่หัวเตียงและไม่บอกใครว่ามันชื่ออะไร”"}</p>
            <cite>— W. C., LOYAL CUSTOMER</cite>
          </blockquote>
          <blockquote>
            <p>{lang === "en" ? "“GOOD BOY ruined every other clean fragrance for me. Sorry to all of them.”" : "“GOOD BOY ทำให้กลิ่นสะอาดอื่นๆ ใช้ไม่ได้แล้ว ขอโทษทุกขวด”"}</p>
            <cite>— TIKTOK COMMENT, ★★★★★</cite>
          </blockquote>
        </div>
      </section>

      {/* JOURNAL TEASE */}
      <section className="ordi-section">
        <SectionHead
          kicker="↘ JOURNAL"
          title={<span>Slowly, <em>about smelling</em>.</span>}
          right={<button className="ordi-btn ordi-btn--ghost" onClick={() => go("journal")}>Read all entries →</button>}
        />
        <div className="ordi-journal__grid ordi-journal__grid--home">
          {window.ORDI_DATA.journal.slice(0, 3).map(j => (
            <article className="ordi-jcard" key={j.id} onClick={() => go("journal")}>
              <div className="ordi-jcard__meta">
                <MonoTag>{j.number}</MonoTag>
                <span>{j.date}</span>
              </div>
              <h3 className="ordi-jcard__title">{j.title[lang]}</h3>
              <p>{j.excerpt[lang]}</p>
              <MonoTag>↗ READ · {j.readtime}</MonoTag>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

// ============================================================
// SHOP
// ============================================================
function ShopScreen() {
  const { go, t, lang } = useApp();
  const products = window.ORDI_DATA.products;
  const [filter, setFilter] = useStateS("all");
  const [hover, setHover] = useStateS(null);

  return (
    <main className="ordi-shop">
      <header className="ordi-shop__head">
        <div>
          <MonoTag>THE COLLECTION</MonoTag>
          <h1 className="ordi-display-lg">All <em>fragrances</em>.</h1>
        </div>
        <div className="ordi-shop__filters">
          {[
            { id: "all", label: lang === "en" ? "All" : "ทั้งหมด" },
            { id: "available", label: lang === "en" ? "In stock" : "พร้อมส่ง" },
            { id: "coming-soon", label: t.coming_soon },
          ].map(f => (
            <button
              key={f.id}
              className={cls("ordi-shop__filter", filter === f.id && "is-active")}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <table className="ordi-shop__table">
        <thead>
          <tr>
            <th style={{ width: "60px" }}>N°</th>
            <th>{lang === "en" ? "Fragrance" : "น้ำหอม"}</th>
            <th>{t.product.family}</th>
            <th>{lang === "en" ? "Heart notes" : "กลิ่นกลาง"}</th>
            <th style={{ textAlign: "right" }}>{lang === "en" ? "From" : "เริ่มต้น"}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.filter(p => filter === "all" || p.status === filter).map(p => (
            <tr
              key={p.id}
              className={cls("ordi-shop__row", p.status === "coming-soon" && "is-soon", hover === p.id && "is-hover")}
              onMouseEnter={() => setHover(p.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => go("product", { id: p.id })}
            >
              <td className="ordi-shop__cell-num">{p.number}</td>
              <td>
                <div className="ordi-shop__name">{p.name}</div>
                <div className="ordi-shop__taglinerow"><em>{p.tagline[lang]}</em></div>
              </td>
              <td className="ordi-shop__family">{p.family[lang]}</td>
              <td className="ordi-shop__notes">{p.notes.heart.join(" · ")}</td>
              <td className="ordi-shop__price">{formatPrice(p.sizes[1].price)} {t.currency}</td>
              <td className="ordi-shop__cta">
                {p.status === "coming-soon" ? (
                  <span className="ordi-mono-tag">{t.coming_soon.toUpperCase()} →</span>
                ) : (
                  <span className="ordi-mono-tag">VIEW →</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

// ============================================================
// PRODUCT DETAIL
// ============================================================
function ProductScreen({ id }) {
  const { go, t, lang, addToCart, wishlist, toggleWishlist } = useApp();
  const products = window.ORDI_DATA.products;
  const p = products.find(x => x.id === id) || products[0];
  const [size, setSize] = useStateS(p.sizes[0].ml);
  const [hoverNote, setHoverNote] = useStateS(null);
  const selectedSize = p.sizes.find(s => s.ml === size);
  const saved = wishlist.includes(p.id);
  const isSoon = p.status === "coming-soon";
  const isDark = p.hue === "#1A1612" || p.hue === "#2A1A24";

  const others = products.filter(x => x.id !== p.id).slice(0, 3);

  return (
    <main className="ordi-product">
      <div className="ordi-product__crumbs">
        <button onClick={() => go("home")}>Home</button> /
        <button onClick={() => go("shop")}>Shop</button> /
        <span>{p.name}</span>
      </div>

      <section className="ordi-product__top">
        <div className="ordi-product__media" style={{ background: p.hue }}>
          <image-slot
            id={`product-main-${p.id}`}
            shape="rect"
            placeholder={`${p.name} — large editorial bottle shot`}
            style={{ width: "100%", height: "100%" }}
          ></image-slot>
          <div className={cls("ordi-product__media-num", isDark && "is-dark")}>{p.number}</div>
          <div className={cls("ordi-product__media-corner", isDark && "is-dark")}>
            <MonoTag>50 ML · EAU DE PARFUM</MonoTag>
            <MonoTag>{t.origin.toUpperCase()}</MonoTag>
          </div>
        </div>

        <div className="ordi-product__panel">
          <div className="ordi-product__head">
            <MonoTag>{p.number} · {p.family[lang]}</MonoTag>
            {isSoon && <MonoTag className="is-soon">{t.coming_soon.toUpperCase()}</MonoTag>}
          </div>
          <h1 className="ordi-product__name">{p.name}</h1>
          <p className="ordi-product__tagline"><em>{p.tagline[lang]}</em></p>

          <div className="ordi-product__story">
            <MonoTag>↘ {t.product.story}</MonoTag>
            <p>{p.story[lang]}</p>
          </div>

          <div className="ordi-product__sizes">
            <MonoTag>{t.product.select_size}</MonoTag>
            <div className="ordi-product__sizebtns">
              {p.sizes.map(s => (
                <button
                  key={s.ml}
                  className={cls("ordi-sizebtn", size === s.ml && "is-active")}
                  onClick={() => setSize(s.ml)}
                >
                  <div className="ordi-sizebtn__ml">{s.ml} ml</div>
                  <div className="ordi-sizebtn__price">{formatPrice(s.price)} {t.currency}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="ordi-product__actions">
            <button
              className="ordi-btn ordi-btn--primary ordi-btn--lg"
              onClick={() => !isSoon && addToCart(p.id, size)}
              disabled={isSoon}
            >
              {isSoon ? t.cta.sold_out : t.cta.add_to_cart} — {formatPrice(selectedSize.price)} {t.currency}
            </button>
            <button
              className={cls("ordi-btn ordi-btn--icon", saved && "is-saved")}
              onClick={() => toggleWishlist(p.id)}
              title={saved ? t.cta.wishlisted : t.cta.wishlist}
            >
              {saved ? "♥" : "♡"}
            </button>
          </div>

          <ul className="ordi-product__perks">
            <li><MonoTag>✓</MonoTag>{t.product.included}</li>
            <li><MonoTag>✓</MonoTag>{t.product.ships}</li>
            <li><MonoTag>✓</MonoTag>{lang === "en" ? "Hand-bottled · numbered batch" : "บรรจุด้วยมือ · ระบุหมายเลขล็อต"}</li>
          </ul>
        </div>
      </section>

      {/* Pyramid */}
      <section className="ordi-pyramid">
        <header className="ordi-pyramid__head">
          <MonoTag>↘ {t.product.notes_title.toUpperCase()}</MonoTag>
          <h2 className="ordi-display-md"><em>How it</em> unfolds.</h2>
        </header>
        <div className="ordi-pyramid__grid">
          {[
            { key: "top", label: t.product.top, notes: p.notes.top, desc: lang === "en" ? "The first impression — what you smell when the spray lands." : "ความประทับใจแรก — กลิ่นที่คุณได้รับเมื่อสเปรย์ลงสู่ผิว" },
            { key: "heart", label: t.product.heart, notes: p.notes.heart, desc: lang === "en" ? "The character. What people notice across the table." : "ตัวตนของกลิ่น สิ่งที่คนสังเกตเห็นข้ามโต๊ะ" },
            { key: "base", label: t.product.base, notes: p.notes.base, desc: lang === "en" ? "What stays on the pillow. The reason they ask." : "สิ่งที่ติดบนหมอน เหตุผลที่พวกเขาถาม" }
          ].map((layer, i) => (
            <div
              className={cls("ordi-pyramid__layer", hoverNote === layer.key && "is-hover")}
              key={layer.key}
              onMouseEnter={() => setHoverNote(layer.key)}
              onMouseLeave={() => setHoverNote(null)}
            >
              <div className="ordi-pyramid__layerhead">
                <MonoTag>0{i+1}</MonoTag>
                <h3>{layer.label}</h3>
              </div>
              <ul className="ordi-pyramid__notes">
                {layer.notes.map((n, j) => (
                  <li key={j} className="ordi-pyramid__note">
                    <span className="ordi-pyramid__notebullet">∙</span>
                    {n}
                  </li>
                ))}
              </ul>
              <p className="ordi-pyramid__desc">{layer.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Companion */}
      <section className="ordi-section ordi-companion">
        <SectionHead
          kicker="↘ ALSO IN THE COLLECTION"
          title={<span>Other<br/><em>versions</em> of you.</span>}
          right={<button className="ordi-btn ordi-btn--ghost" onClick={() => go("shop")}>See all five →</button>}
        />
        <div className="ordi-companion__grid">
          {others.map(o => (
            <article className="ordi-pcard" key={o.id} onClick={() => go("product", { id: o.id })}>
              <div className="ordi-pcard__media" style={{ background: o.hue }}>
                <image-slot id={`comp-${o.id}-${p.id}`} shape="rect" placeholder={o.name} style={{ width: "100%", height: "100%" }}></image-slot>
                <div className="ordi-pcard__num">{o.number}</div>
              </div>
              <div className="ordi-pcard__meta">
                <div className="ordi-pcard__top">
                  <h3 className="ordi-pcard__name">{o.name}</h3>
                  <div className="ordi-pcard__price">{formatPrice(o.sizes[0].price)} {t.currency}</div>
                </div>
                <p className="ordi-pcard__tagline"><em>{o.tagline[lang]}</em></p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

Object.assign(window, { HomeScreen, ShopScreen, ProductScreen });
