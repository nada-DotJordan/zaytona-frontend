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

const COLORS = {
  oliveDark: "#2c3d1f",
  oliveMid: "#3d5a27",
  oliveLight: "#6b8f47",
  cream: "#f5f0e8",
  warmWhite: "#faf8f3",
  gold: "#c8a84b",
  border: "#e2d9c5",
  textDark: "#1c2910",
  textMuted: "#7a7a6e",
};

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

  return (
    <div dir={isRtl ? "rtl" : "ltr"}>

      {/* ── HERO ── */}
      <section
        style={{
          background: `linear-gradient(rgba(30,50,20,0.75), rgba(30,50,20,0.75)), url(${HERO_IMAGE}) center/cover no-repeat`,
          minHeight: "88vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">

              <p style={{ color: "#c8a84b" }}>{t.heroLabel}</p>

              <h1 style={{ color: "#fff" }}>
                {t.heroTitleLine1}
                <br />
                <span style={{ color: "#c8a84b" }}>{t.heroTitleLine2}</span>
              </h1>

              <p style={{ color: "rgba(255,255,255,0.7)" }}>
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
                    cursor: "pointer",
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
      <section style={{ padding: "80px 0", background: COLORS.warmWhite }}>
        <div className="container text-center">
          <h2>{t.howTitle}</h2>

          <div className="row mt-4">
            {steps.map((step, i) => {
              const Icon = icons[i];
              return (
                <div key={i} className="col-md-3">
                  <Icon size={30} color={COLORS.oliveMid} />
                  <h5>{step.label}</h5>
                  <p>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">

          <h2>{t.productsTitle}</h2>
          <p>{t.productsSubtitle}</p>

          {loading && <p>{t.loading}</p>}

          <div className="row">
            {displayProducts.map((prod) => {
              const farmNameEn = prod.farmId?.nameEn || "";
              const img = IMG_MAP[farmNameEn] || Baraka;

              return (
                <div key={prod._id} className="col-md-3">
                  <div style={{ border: "1px solid #ddd", padding: 10 }}>
                    <img src={img} alt="" style={{ width: "100%" }} />
                    <h6>{lang === "en" ? prod.nameEn : prod.nameAr}</h6>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={() => navigate("/Products")}>
            {t.viewMore}
          </button>

        </div>
      </section>

      <FeedbackSection />

    </div>
  );
}