import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../languages/LanguageContext";
import { FaLeaf, FaTruck, FaBox, FaFlask } from "react-icons/fa";
import { useProducts } from "../api/api";
import FeedbackSection from "../components/FeedbackSection";
import { useAuth } from "../context/AuthContext";

import Baraka from "../assets/Baraka.png";
import GVF from "../assets/GVF.png";
import tal from "../assets/tal.png";
import HOF from "../assets/hof.png";
import jabal from "../assets/jabal.jpg";
import b from "../assets/b.jpg";
import rawda from "../assets/rawda.jpg";
import p from "../assets/p.jpg";
import HERO_IMAGE from "../assets/heroo.jpg";

const IMG_MAP = {
  "Al-Baraka Farm": Baraka,
  "Green Valley Farm": GVF,
  "Tal Al-Zeitoun Farm": tal,
  "Haddad Organic Farm": HOF,
  "Jabal Al-Nar Farm": jabal,
  "Beit Al-Zeitoun Farm": b,
  "Al-Rawda Farm": rawda,
  "Safouri Heritage Farm": p,
};

const TEXT = {
  en: {
    heroLabel: "FROM FARM TO YOU",
    heroTitleLine1: "Real Olive Oil.",
    heroTitleLine2: "Nothing Hidden.",
    heroSubtitle:
      "No blending. No guessing. Full traceability from trusted farms — straight to your door.",
    heroButton: "Sign Up",
    howTitle: "How It Works",
    step1: { label: "From Our Farms", desc: "Carefully harvested olives from trusted farmers." },
    step2: { label: "Carefully Processed", desc: "Cold-pressed and quality-checked with care." },
    step3: { label: "Packaged with Care", desc: "Sealed for freshness and labeled with a unique code." },
    step4: { label: "To Your Table", desc: "Track every step until it reaches you." },
    productsTitle: "Our Partner Farms",
    productsSubtitle: "Our trusted farms — browse their oils, sizes, and pricing.",
    viewAll: "View All",
    viewMore: "View More",
    viewProduct: "View Products",
    sizesLabel: "Available sizes:",
    priceRangeLabel: "Price range:",
    loading: "Loading products...",
  },
  ar: {
    heroLabel: "من المزرعة إلى مائدتك",
    heroTitleLine1: "زيت زيتون حقيقي.",
    heroTitleLine2: "لا شيء مخفي.",
    heroSubtitle: "لا مزج. لا تخمين. تتبّع كامل من مزارع موثوقة — مباشرةً إلى بابك.",
    heroButton: "إنشاء حساب",
    howTitle: "كيف يعمل النظام",
    step1: { label: "من مزارعنا", desc: "زيتون محصود بعناية من مزارعين موثوقين." },
    step2: { label: "معالجة دقيقة", desc: "عصر بارد وفحص دقيق للجودة." },
    step3: { label: "تعبئة آمنة", desc: "مختوم للطازجية ومُعلَّم برمز فريد." },
    step4: { label: "إلى مائدتك", desc: "تتبّع كل خطوة حتى تصلك." },
    productsTitle: "مزارعنا الشريكة",
    productsSubtitle: "كل بطاقة تمثّل مزرعة موثوقة — تصفّح زيوتها وأحجامها وأسعارها.",
    viewAll: "عرض الكل",
    viewMore: "عرض المزيد",
    viewProduct: "عرض المنتجات",
    sizesLabel: "الأحجام المتاحة:",
    priceRangeLabel: "نطاق السعر:",
    loading: "جارٍ تحميل المنتجات...",
  },
};

const C = {
  oliveDark:  "#546B41",
  oliveMid:   "#3d5a27",
  oliveLight: "#99AD7A",
  cream:      "#DCCCAC",
  warmWhite:  "#FFF8EC",
  gold:       "#b89a4e",
  border:     "#ddd3b8",
  textDark:   "#1c2910",
  textMuted:  "#7a7a6e",
};

const styles = {
  /* Hero */
  hero: {
    position: "relative",
    minHeight: "88vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
  },
  heroBg: {
    position: "absolute", inset: 0,
    backgroundSize: "cover", backgroundPosition: "center",
    filter: "brightness(0.45)",
    zIndex: 0,
  },
  heroOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(135deg, rgba(44,61,31,0.55) 0%, rgba(20,30,10,0.3) 100%)",
    zIndex: 1,
  },
  heroContent: { position: "relative", zIndex: 2 },

  heroLabel: {
    letterSpacing: "0.28em",
    fontSize: 11,
    fontWeight: 700,
    color: C.gold,
    textTransform: "uppercase",
    marginBottom: 16,
  },
  heroH1: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(2.6rem, 6vw, 4.4rem)",
    fontWeight: 700,
    lineHeight: 1.12,
    color: "#fff",
    marginBottom: 20,
  },
  heroAccent: { color: C.gold },
  heroSub: {
    fontSize: 16,
    color: "rgba(255,255,255,0.72)",
    maxWidth: 480,
    lineHeight: 1.65,
    marginBottom: 34,
  },
  heroCta: {
    display: "inline-flex", alignItems: "center", gap: 10,
    background: C.oliveDark,
    border: `1.5px solid ${C.gold}`,
    color: "#fff",
    padding: "13px 30px",
    borderRadius: 4,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "0.06em",
    cursor: "pointer",
    transition: "background .2s",
    textDecoration: "none",
  },

  divider: {
    width: 44, height: 2,
    background: C.gold,
    margin: "0 auto 28px",
    borderRadius: 2,
  },

  how: {
    padding: "88px 0",
    background: C.warmWhite,
    borderTop: `1px solid ${C.border}`,
    borderBottom: `1px solid ${C.border}`,
  },
  howTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)",
    fontWeight: 700,
    color: C.oliveDark,
    marginBottom: 8,
  },
  howSub: { fontSize: 14, color: C.textMuted, marginBottom: 52 },

  stepCard: {
    background: "#fff",
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "32px 24px 28px",
    height: "100%",
    transition: "box-shadow .2s, transform .2s",
    cursor: "default",
  },
  stepIcon: {
    width: 52, height: 52,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: "50%",
    background: `${C.oliveDark}14`,
    marginBottom: 18,
  },
  stepNum: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.2em",
    color: C.gold, textTransform: "uppercase", marginBottom: 8,
  },
  stepLabel: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 18, fontWeight: 700, color: C.oliveDark, marginBottom: 8,
  },
  stepDesc: { fontSize: 13.5, color: C.textMuted, lineHeight: 1.6 },

  /* Products */
  products: { padding: "88px 0", background: "#fff" },
  sectionTitle: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: "clamp(1.7rem, 3.5vw, 2.4rem)",
    fontWeight: 700,
    color: C.oliveDark,
    marginBottom: 8,
  },
  sectionSub: { fontSize: 14, color: C.textMuted, marginBottom: 48 },

  farmCard: {
    background: C.warmWhite,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    overflow: "hidden",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "box-shadow .25s, transform .25s",
    cursor: "pointer",
  },
  farmImgWrap: { position: "relative", paddingTop: "62%", overflow: "hidden" },
  farmImg: {
    position: "absolute", inset: 0,
    width: "100%", height: "100%",
    objectFit: "cover",
    transition: "transform .4s",
  },
  farmBadge: {
    position: "absolute", top: 10, right: 10,
    background: C.oliveDark,
    color: C.gold,
    fontSize: 9, fontWeight: 700, letterSpacing: "0.18em",
    padding: "4px 9px", borderRadius: 3, textTransform: "uppercase",
  },
  farmBody: { padding: "18px 18px 20px", flex: 1, display: "flex", flexDirection: "column" },
  farmName: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontSize: 17, fontWeight: 700, color: C.oliveDark, marginBottom: 6,
  },
  farmSizes: { fontSize: 12, color: C.textMuted, marginBottom: 14, flex: 1 },
  farmBtn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    background: "transparent",
    border: `1.5px solid ${C.oliveDark}`,
    color: C.oliveDark,
    padding: "7px 16px",
    borderRadius: 4,
    fontSize: 12, fontWeight: 600,
    cursor: "pointer",
    transition: "background .2s, color .2s",
    alignSelf: "flex-start",
  },

  viewMoreBtn: {
    display: "inline-flex", alignItems: "center", gap: 8,
    marginTop: 40,
    background: C.oliveDark,
    border: `1.5px solid ${C.oliveDark}`,
    color: "#fff",
    padding: "12px 28px",
    borderRadius: 4,
    fontSize: 13, fontWeight: 600, letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "background .2s",
  },
};

if (!document.getElementById("zay-gfont")) {
  const l = document.createElement("link");
  l.id = "zay-gfont";
  l.rel = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&display=swap";
  document.head.appendChild(l);
}

export default function Home() {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();
  const t = TEXT[lang];
  const { products, loading } = useProducts();
  const { isAuthenticated } = useAuth();

  const isRtl = lang === "ar";
  const steps = [t.step1, t.step2, t.step3, t.step4];
  const icons = [FaLeaf, FaFlask, FaBox, FaTruck];
  const displayProducts = products.slice(0, 4);

  function getSizes(prod) {
    if (prod.sizeL) return prod.sizeL;
    return prod.versions?.map((v) => v.label).filter(Boolean).join(", ") || "—";
  }

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>

      <section style={styles.hero}>
        <div
          style={{ ...styles.heroBg, backgroundImage: `url(${HERO_IMAGE})` }}
        />
        <div style={styles.heroOverlay} />

        <div className="container" style={styles.heroContent}>
          <div className="row">
            <div className="col-lg-7 col-xl-6">

              <p style={styles.heroLabel}>{t.heroLabel}</p>

              <h1 style={styles.heroH1}>
                {t.heroTitleLine1}<br />
                <span style={styles.heroAccent}>{t.heroTitleLine2}</span>
              </h1>

              <p style={styles.heroSub}>{t.heroSubtitle}</p>

              {!isAuthenticated && (
                <button
                  style={styles.heroCta}
                  onClick={() => navigate("/register")}
                  onMouseEnter={(e) => (e.currentTarget.style.background = C.oliveLight)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = C.oliveDark)}
                >
                  {t.heroButton}
                  <span style={{ fontSize: 18, lineHeight: 1 }}>→</span>
                </button>
              )}

            </div>
          </div>
        </div>
      </section>

      <section style={styles.how}>
        <div className="container text-center">
          <h2 style={styles.howTitle}>{t.howTitle}</h2>
          <div style={styles.divider} />
          <p style={styles.howSub}></p>

          <div className="row g-4 mt-1 justify-content-center">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div key={i} className="col-sm-6 col-md-3">
                  <div
                    style={styles.stepCard}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 8px 28px rgba(84,107,65,.13)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                    }}
                  >
                    <div style={styles.stepIcon}>
                      <Icon size={22} color={C.oliveDark} />
                    </div>
                    <p style={styles.stepNum}>0{i + 1}</p>
                    <h5 style={styles.stepLabel}>{step.label}</h5>
                    <p style={styles.stepDesc}>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section style={styles.products}>
        <div className="container">

          <h2 style={styles.sectionTitle}>{t.productsTitle}</h2>
          <div style={{ ...styles.divider, margin: "0 0 14px" }} />
          <p style={styles.sectionSub}>{t.productsSubtitle}</p>

          {loading && (
            <p style={{ color: C.textMuted }}>{t.loading}</p>
          )}

          <div className="row g-4">
            {displayProducts.map((prod) => {
              const farmNameEn = prod.farmId?.nameEn || "";
              const img        = IMG_MAP[farmNameEn] || Baraka;
              const displayName = lang === "en" ? (prod.nameEn || farmNameEn) : (prod.nameAr || farmNameEn);

              return (
                <div key={prod._id} className="col-sm-6 col-md-3">
                  <div
                    style={styles.farmCard}
                    onClick={() => navigate("/Products")}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 12px 36px rgba(84,107,65,.14)";
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.querySelector("img").style.transform = "scale(1.06)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.querySelector("img").style.transform = "scale(1)";
                    }}
                  >
                    <div style={styles.farmImgWrap}>
                      <img src={img} alt={displayName} style={styles.farmImg} />
                      <span style={styles.farmBadge}>Verified Farm</span>
                    </div>

                    {/* Body */}
                    <div style={styles.farmBody}>
                      <h6 style={styles.farmName}>{displayName}</h6>
                      <p style={styles.farmSizes}>
                        <span style={{ color: C.gold, fontWeight: 600 }}>{t.sizesLabel} </span>
                        {getSizes(prod)}
                      </p>
                      <button
                        style={styles.farmBtn}
                        onClick={(e) => { e.stopPropagation(); navigate("/Products"); }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = C.oliveDark;
                          e.currentTarget.style.color = "#fff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = C.oliveDark;
                        }}
                      >
                        {t.viewProduct} →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              style={styles.viewMoreBtn}
              onClick={() => navigate("/Products")}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.oliveLight)}
              onMouseLeave={(e) => (e.currentTarget.style.background = C.oliveDark)}
            >
              {t.viewMore} →
            </button>
          </div>

        </div>
      </section>

      <FeedbackSection />

    </div>
  );
}