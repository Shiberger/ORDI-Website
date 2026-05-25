// ORDI - Shared components and utilities
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ============================================================
// AppContext: global state for cart, wishlist, language, screen
// ============================================================
const AppContext = createContext(null);

function AppProvider({ children }) {
  const [screen, setScreen] = useState({ name: "home", params: {} });
  const [cart, setCart] = useState([]);  // [{ id, size, qty }]
  const [wishlist, setWishlist] = useState([]);  // [id]
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [transitionKey, setTransitionKey] = useState(0);

  const go = (name, params = {}) => {
    setScreen({ name, params });
    setTransitionKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const addToCart = (id, size) => {
    setCart(prev => {
      const idx = prev.findIndex(it => it.id === id && it.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { id, size, qty: 1 }];
    });
    setDrawerOpen(true);
  };

  const setQty = (id, size, qty) => {
    setCart(prev => prev
      .map(it => it.id === id && it.size === size ? { ...it, qty } : it)
      .filter(it => it.qty > 0)
    );
  };

  const removeFromCart = (id, size) => {
    setCart(prev => prev.filter(it => !(it.id === id && it.size === size)));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const cartCount = cart.reduce((n, it) => n + it.qty, 0);

  const subtotal = cart.reduce((sum, it) => {
    const p = window.ORDI_DATA.products.find(x => x.id === it.id);
    if (!p) return sum;
    const s = p.sizes.find(x => x.ml === it.size);
    return sum + (s ? s.price * it.qty : 0);
  }, 0);

  const t = window.ORDI_DATA.ui[lang];

  const value = {
    screen, go, transitionKey,
    cart, addToCart, setQty, removeFromCart, cartCount, subtotal,
    wishlist, toggleWishlist,
    drawerOpen, setDrawerOpen,
    lang, setLang, t
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

const useApp = () => useContext(AppContext);

// ============================================================
// Utility
// ============================================================
function formatPrice(n) {
  return n.toLocaleString("en-US");
}

function cls(...args) {
  return args.filter(Boolean).join(" ");
}

// ============================================================
// Nav
// ============================================================
function Nav() {
  const { go, cartCount, setDrawerOpen, t, screen } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "shop", label: t.nav.shop },
    { id: "journal", label: t.nav.journal },
    { id: "about", label: t.nav.about },
    { id: "account", label: t.nav.account },
  ];

  return (
    <header className={cls("ordi-nav", scrolled && "ordi-nav--scrolled")}>
      <div className="ordi-nav__inner">
        <div className="ordi-nav__left">
          <button className="ordi-nav__brand" onClick={() => go("home")}>
            <span className="ordi-nav__brand-mark ordi-wordmark">
              <span className="ordi-wordmark__o">O</span>RDI
            </span>
            <span className="ordi-nav__brand-full">OUT OF ORDINARY ONLY OUS</span>
          </button>
        </div>
        <nav className="ordi-nav__center">
          {links.map(l => (
            <button
              key={l.id}
              className={cls("ordi-nav__link", screen.name === l.id && "is-active")}
              onClick={() => go(l.id)}
            >
              {l.label}
            </button>
          ))}
        </nav>
        <div className="ordi-nav__right">
          <button className="ordi-nav__cart" onClick={() => setDrawerOpen(true)}>
            <span>{t.nav.cart}</span>
            <span className="ordi-nav__cart-count">[{String(cartCount).padStart(2, "0")}]</span>
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================================
// Footer
// ============================================================
function Footer() {
  const { go, t, lang } = useApp();
  return (
    <footer className="ordi-footer">
      <div className="ordi-footer__top">
        <div className="ordi-footer__brand">
          <div className="ordi-footer__brandmark ordi-wordmark">
            <span className="ordi-wordmark__o">O</span>RDI
          </div>
          <div className="ordi-footer__brandsub">{t.brand_full}</div>
        </div>
        <div className="ordi-footer__cols">
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Shop</div>
            <button onClick={() => go("shop")}>All fragrances</button>
            <button onClick={() => go("shop")}>50 ml</button>
            <button onClick={() => go("shop")}>12 ml travel</button>
            <button onClick={() => go("shop")}>Discovery set</button>
          </div>
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Company</div>
            <button onClick={() => go("about")}>About</button>
            <button onClick={() => go("journal")}>Journal</button>
            <button onClick={() => go("membership")}>Membership</button>
            <a>Contact</a>
          </div>
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Care</div>
            <a>Shipping</a>
            <a>Returns</a>
            <a>How to wear</a>
            <a>FAQ</a>
          </div>
          <div className="ordi-footer__col">
            <div className="ordi-footer__h">Newsletter</div>
            <div className="ordi-footer__news">
              <input placeholder="your@email" />
              <button>→</button>
            </div>
            <div className="ordi-footer__newssub">Slow updates. Never daily.</div>
          </div>
        </div>
      </div>
      <div className="ordi-footer__bottom">
        <div>© ORDI ATELIER {new Date().getFullYear()}</div>
        <div className="ordi-footer__origin">{t.origin}</div>
        <div>EN · TH · {lang === "en" ? "Showing English" : "กำลังแสดงภาษาไทย"}</div>
      </div>
    </footer>
  );
}

// ============================================================
// Bottle (image slot) with reveal/hover
// ============================================================
function Bottle({ product, size = "md", shape = "rect" }) {
  const dims = {
    sm: { w: 180, h: 240 },
    md: { w: 280, h: 380 },
    lg: { w: 420, h: 560 },
    xl: { w: 560, h: 720 },
    hero: { w: 720, h: 900 },
  }[size];

  return (
    <div className="ordi-bottle" style={{ width: dims.w, height: dims.h, "--bottle-hue": product.hue }}>
      <image-slot
        id={`bottle-${product.id}-${size}`}
        shape={shape}
        placeholder={`${product.name} — drop bottle photo`}
        style={{ width: "100%", height: "100%" }}
      ></image-slot>
      <div className="ordi-bottle__tag">
        <span>{product.number}</span>
        <span>·</span>
        <span>{product.name}</span>
      </div>
    </div>
  );
}

// ============================================================
// Cart drawer
// ============================================================
function CartDrawer() {
  const { drawerOpen, setDrawerOpen, cart, subtotal, setQty, removeFromCart, t, go } = useApp();
  const products = window.ORDI_DATA.products;

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <React.Fragment>
      <div
        className={cls("ordi-drawer__scrim", drawerOpen && "is-open")}
        onClick={() => setDrawerOpen(false)}
      ></div>
      <aside className={cls("ordi-drawer", drawerOpen && "is-open")}>
        <header className="ordi-drawer__head">
          <div className="ordi-drawer__title">
            <span className="ordi-mono-tag">⌁</span>
            <span>{t.cart_title}</span>
            <span className="ordi-drawer__count">({cart.reduce((n, it) => n + it.qty, 0)})</span>
          </div>
          <button className="ordi-drawer__close" onClick={() => setDrawerOpen(false)}>Close ✕</button>
        </header>
        <div className="ordi-drawer__body">
          {cart.length === 0 ? (
            <div className="ordi-drawer__empty">
              <div className="ordi-display-sm">{t.empty_cart}</div>
              <button className="ordi-btn ordi-btn--ghost" onClick={() => { setDrawerOpen(false); go("shop"); }}>
                {t.cta.shop_all} →
              </button>
            </div>
          ) : cart.map((it, i) => {
            const p = products.find(x => x.id === it.id);
            if (!p) return null;
            const s = p.sizes.find(x => x.ml === it.size);
            return (
              <article className="ordi-drawer__item" key={`${it.id}-${it.size}-${i}`}>
                <div
                  className="ordi-drawer__thumb"
                  style={{ background: p.hue, color: p.hue === "#1A1612" || p.hue === "#2A1A24" ? "#fff" : "#0A0A0A" }}
                >
                  <div className="ordi-drawer__thumb-num">{p.number}</div>
                  <div className="ordi-drawer__thumb-name">{p.name}</div>
                </div>
                <div className="ordi-drawer__meta">
                  <div className="ordi-drawer__row1">
                    <div className="ordi-drawer__name">{p.name}</div>
                    <button className="ordi-drawer__remove" onClick={() => removeFromCart(it.id, it.size)}>{t.remove}</button>
                  </div>
                  <div className="ordi-drawer__row2">
                    <span className="ordi-mono-tag">{it.size}ml</span>
                    <span className="ordi-mono-tag">{formatPrice(s.price)} {t.currency}</span>
                  </div>
                  <div className="ordi-drawer__qty">
                    <button onClick={() => setQty(it.id, it.size, it.qty - 1)}>−</button>
                    <span>{it.qty}</span>
                    <button onClick={() => setQty(it.id, it.size, it.qty + 1)}>+</button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        {cart.length > 0 && (
          <footer className="ordi-drawer__foot">
            <div className="ordi-drawer__sub">
              <span>{t.subtotal}</span>
              <span className="ordi-drawer__subtotal">{formatPrice(subtotal)} {t.currency}</span>
            </div>
            <div className="ordi-drawer__shipnote">{t.shipping}</div>
            <button
              className="ordi-btn ordi-btn--primary ordi-btn--full"
              onClick={() => { setDrawerOpen(false); go("checkout"); }}
            >
              {t.cta.checkout} →
            </button>
          </footer>
        )}
      </aside>
    </React.Fragment>
  );
}

// ============================================================
// Small reusable bits
// ============================================================
function MonoTag({ children, className }) {
  return <span className={cls("ordi-mono-tag", className)}>{children}</span>;
}

function SectionHead({ kicker, title, right }) {
  return (
    <header className="ordi-secthead">
      <div className="ordi-secthead__left">
        <MonoTag>{kicker}</MonoTag>
        <h2 className="ordi-display-md">{title}</h2>
      </div>
      {right && <div className="ordi-secthead__right">{right}</div>}
    </header>
  );
}

function Marquee({ items, speed = 50 }) {
  const all = [...items, ...items, ...items];
  return (
    <div className="ordi-marquee">
      <div className="ordi-marquee__track" style={{ animationDuration: `${speed}s` }}>
        {all.map((it, i) => (
          <span key={i} className="ordi-marquee__item">
            <span className="ordi-marquee__star">✦</span>
            <span>{it}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// expose
Object.assign(window, {
  AppContext, AppProvider, useApp,
  Nav, Footer, Bottle, CartDrawer,
  MonoTag, SectionHead, Marquee,
  formatPrice, cls,
});
