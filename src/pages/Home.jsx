import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../languages/LanguageContext";
import { FaLeaf, FaTruck, FaBox, FaFlask } from "react-icons/fa";
import { useProducts } from "../api/api";
import FeedbackSection from "../components/FeedbackSection";
import { useAuth } from "../auth/AuthContext";

import Baraka    from "../assets/Baraka.png";
import GVF       from "../assets/GVF.png";
import tal       from "../assets/tal.png";
import HOF       from "../assets/hof.png";
import jabal     from "../assets/jabal.jpg";
import b         from "../assets/b.jpg";
import rawda     from "../assets/rawda.jpg";
import p         from "../assets/p.jpg";
import HERO_IMAGE from "../assets/heroo.jpg";

const IMG_MAP = {
  "Al-Baraka Farm":        Baraka,
  "Green Valley Farm":     GVF,
  "Tal Al-Zeitoun Farm":   tal,
  "Haddad Organic Farm":   HOF,
  "Jabal Al-Nar Farm":     jabal,
  "Beit Al-Zeitoun Farm":  b,
  "Al-Rawda Farm":         rawda,
  "Safouri Heritage Farm": p,
};

const TEXT = {
  en: {
    heroLabel:       "FROM FARM TO YOU",
    heroTitleLine1:  "Real Olive Oil.",
    heroTitleLine2:  "Nothing Hidden.",
    heroSubtitle:    "No blending. No guessing. Full traceability from trusted farms — straight to your door.",
    heroButton:      "Sign Up",

    howTitle: "How It Works",
    step1: { label: "From Our Farms",      desc: "Carefully harvested olives from trusted farmers." },
    step2: { label: "Carefully Processed", desc: "Cold-pressed and quality-checked with care." },
    step3: { label: "Packaged with Care",  desc: "Sealed for freshness and labeled with a unique code." },
    step4: { label: "To Your Table",       desc: "Track every step until it reaches you." },

    productsTitle:    "Our Partner Farms",
    productsSubtitle: "Our trusted farms — browse their oils, sizes, and pricing.",
    viewAll:          "View All",
    viewMore:         "View More",
    viewProduct:      "View Products",
    sizesLabel:       "Available sizes:",
    priceRangeLabel:  "Price range:",
    loading:          "Loading products...",

    aboutTitle:   "About Us",
    aboutDesc:    "We are committed to providing high-quality olive oil with full transparency and honesty.",
    aboutLink:    "Learn more →",
    farmsTitle:   "Our Farms",
    farmsDesc:    "We collaborate with trusted farms that share our passion for quality and sustainability.",
    farmsLink:    "See our farms →",
    contactTitle: "Contact Us",
    contactEmail: "info@zaytona.com",
    contactPhone: "+962 6 000 0000",
    contactLink:  "Get in touch →",
    privacy:      "Privacy Policy",
    terms:        "Terms of Service",
    rights:       "© 2026 Zaytona. All rights reserved.",
  },
  ar: {
    heroLabel:       "من المزرعة إلى مائدتك",
    heroTitleLine1:  "زيت زيتون حقيقي.",
    heroTitleLine2:  "لا شيء مخفي.",
    heroSubtitle:    "لا مزج. لا تخمين. تتبّع كامل من مزارع موثوقة — مباشرةً إلى بابك.",
    heroButton:      "إنشاء حساب",

    howTitle: "كيف يعمل النظام",
    step1: { label: "من مزارعنا",   desc: "زيتون محصود بعناية من مزارعين موثوقين." },
    step2: { label: "معالجة دقيقة", desc: "عصر بارد وفحص دقيق للجودة." },
    step3: { label: "تعبئة آمنة",   desc: "مختوم للطازجية ومُعلَّم برمز فريد." },
    step4: { label: "إلى مائدتك",   desc: "تتبّع كل خطوة حتى تصلك." },

    productsTitle:    "مزارعنا الشريكة",
    productsSubtitle: "كل بطاقة تمثّل مزرعة موثوقة — تصفّح زيوتها وأحجامها وأسعارها.",
    viewAll:          "عرض الكل",
    viewMore:         "عرض المزيد",
    viewProduct:      "عرض المنتجات",
    sizesLabel:       "الأحجام المتاحة:",
    priceRangeLabel:  "نطاق السعر:",
    loading:          "جارٍ تحميل المنتجات...",

    aboutTitle:   "من نحن",
    aboutDesc:    "نلتزم بتقديم زيت زيتون عالي الجودة بشفافية تامة وأمانة.",
    aboutLink:    "اعرف أكثر ←",
    farmsTitle:   "مزارعنا",
    farmsDesc:    "نتعاون مع مزارع موثوقة تشاركنا شغفنا بالجودة والاستدامة.",
    farmsLink:    "شاهد مزارعنا ←",
    contactTitle: "تواصل معنا",
    contactEmail: "info@zaytona.com",
    contactPhone: "٩٦٢ ٦ ٠٠٠ ٠٠٠٠+",
    contactLink:  "تواصل الآن ←",
    privacy:      "سياسة الخصوصية",
    terms:        "شروط الخدمة",
    rights:       "© ٢٠٢٦ زيتونة. جميع الحقوق محفوظة.",
  },
};

const COLORS = {
  oliveDark:  "#2c3d1f",
  oliveMid:   "#3d5a27",
  oliveLight: "#6b8f47",
  cream:      "#f5f0e8",
  warmWhite:  "#faf8f3",
  gold:       "#c8a84b",
  border:     "#e2d9c5",
  textDark:   "#1c2910",
  textMuted:  "#7a7a6e",
};

export default function Home() {
  const { lang }              = useContext(LanguageContext);
  const navigate              = useNavigate();
  const t                     = TEXT[lang];
  const { products, loading } = useProducts();
  const steps                 = [t.step1, t.step2, t.step3, t.step4];
  const icons                 = [FaLeaf, FaFlask, FaBox, FaTruck];
  const isRtl                 = lang === "ar";
  const { isAuthenticated } = useContext(AuthContext);

  const displayProducts = products.slice(0, 4);

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>

      {/* ── HERO ── */}
      <section style={{
        background: `linear-gradient(rgba(30,50,20,0.75), rgba(30,50,20,0.75)), url(${HERO_IMAGE}) center/cover no-repeat`,
        minHeight: "88vh",
        display: "flex",
        alignItems: "center",
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <p style={{ fontSize: "0.72rem", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 600, marginBottom: 10 }}>
                {t.heroLabel}
              </p>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.4rem)", color: "#fff", lineHeight: 1.2, marginBottom: "1.25rem" }}>
                {t.heroTitleLine1}
                <br />
                <em style={{ fontStyle: "italic", color: COLORS.gold }}>{t.heroTitleLine2}</em>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem" }}>
                {t.heroSubtitle}
              </p>
              {!isAuthenticated && (
                <button
                  onClick={() => navigate("/register")}
                  style={{ 
                    background: COLORS.oliveLight, 
                    border: "none", 
                    color: "#fff", 
                    padding: "13px 28px", 
                    borderRadius: 6, 
                    fontSize: "0.9rem", 
                    fontWeight: 500, 
                    cursor: "pointer" 
                  }}
                >
                  {t.heroButton}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: COLORS.warmWhite, padding: "100px 0" }}>
        <div className="container">
          <h2 className="text-center mb-5" style={{ fontFamily: "Georgia, serif", fontSize: "2.2rem", color: COLORS.textDark }}>
            {t.howTitle}
          </h2>
          <div className="row justify-content-center align-items-start">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <React.Fragment key={i}>
                  <div className="col-6 col-md-2 text-center mb-4">
                    <div style={{ width: 90, height: 90, borderRadius: "50%", border: `2px solid ${COLORS.border}`, background: COLORS.cream, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                      <Icon size={36} color={COLORS.oliveMid} />
                    </div>
                    <h6 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 8, color: COLORS.textDark }}>{step.label}</h6>
                    <p style={{ fontSize: "0.82rem", color: COLORS.textMuted, lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="col-md-1 d-none d-md-flex align-items-start justify-content-center" style={{ paddingTop: 52 }}>
                      <span style={{ color: COLORS.border, fontSize: "1.6rem" }}>
                        {isRtl ? "←" : "→"}
                      </span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section style={{ background: "#fff", padding: "80px 0" }} id="products">
        <div className="container">

          <div className="d-flex justify-content-between align-items-end mb-2">
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: COLORS.textDark, margin: 0 }}>
              {t.productsTitle}
            </h2>
            <button
              onClick={() => navigate("/Products")}
              style={{ background: "none", border: "none", color: COLORS.oliveMid, fontSize: "0.85rem", fontWeight: 500, borderBottom: `1px solid ${COLORS.oliveMid}`, cursor: "pointer", padding: 0 }}
            >
              {t.viewAll}
            </button>
          </div>

          <p style={{ fontSize: "0.83rem", color: COLORS.textMuted, marginBottom: "1.8rem" }}>
            {t.productsSubtitle}
          </p>

          {loading && (
            <p style={{ textAlign: "center", color: COLORS.textMuted, padding: "40px 0" }}>{t.loading}</p>
          )}

          <div className="row g-3">
            {displayProducts.map((prod) => {
              const farmNameEn = prod.farmId?.nameEn || "";
              const farmName   = lang === "en" ? prod.farmId?.nameEn : prod.farmId?.nameAr;
              const prodName   = lang === "en" ? prod.nameEn : prod.nameAr;
              const img        = IMG_MAP[farmNameEn] || Baraka;
              const minPrice   = prod.versions?.[0]?.price ?? 0;
              const maxPrice   = prod.versions?.[prod.versions.length - 1]?.price ?? 0;

              return (
                <div className="col-6 col-md-3" key={prod._id}>
                  <div style={{ background: "#fff", borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.border}`, height: "100%", display: "flex", flexDirection: "column" }}>
                    <img src={img} alt={prodName} style={{ width: "100%", height: 180, objectFit: "cover" }} />
                    <div style={{ padding: "1rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: COLORS.oliveLight, marginBottom: 4 }}>
                        🌿 {farmName}
                      </p>
                      <h5 style={{ fontWeight: 600, fontSize: "0.92rem", marginBottom: 10, color: COLORS.textDark }}>
                        {prodName}
                      </h5>
                      <hr style={{ borderColor: COLORS.border, margin: "0 0 10px" }} />
                      <p style={{ fontSize: "0.72rem", color: COLORS.textMuted, marginBottom: 4, fontWeight: 600 }}>{t.sizesLabel}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                        <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: 20, border: `1px solid ${COLORS.border}`, color: COLORS.oliveMid, background: COLORS.cream }}>
                          {prod.sizeL}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.72rem", color: COLORS.textMuted, marginBottom: 2, fontWeight: 600 }}>{t.priceRangeLabel}</p>
                      <p style={{ fontSize: "0.82rem", color: COLORS.textMuted, marginBottom: 6 }}>
                        {minPrice} – {maxPrice} JD
                      </p>
                      <p style={{ fontWeight: 700, fontSize: "1.05rem", color: COLORS.oliveDark, marginBottom: "0.9rem", marginTop: "auto" }}>
                        {lang === "en" ? `From ${minPrice} JD` : `من ${minPrice} دينار`}
                      </p>
                      <button
                        onClick={() => navigate("/Products")}
                        style={{ width: "100%", background: COLORS.oliveDark, color: "#fff", border: "none", padding: "9px", borderRadius: 5, fontSize: "0.82rem", cursor: "pointer" }}
                      >
                        {t.viewProduct}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/Products")}
              style={{ background: "transparent", border: `1.5px solid ${COLORS.oliveDark}`, color: COLORS.oliveDark, padding: "11px 32px", borderRadius: 6, fontSize: "0.88rem", cursor: "pointer" }}
            >
              {t.viewMore}
            </button>
          </div>

        </div>
      </section>

      <div style={{ background: COLORS.warmWhite }}>
        <FeedbackSection />
      </div>

    </div>
  );
}