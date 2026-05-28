import { useState, useContext } from "react";
import { LanguageContext } from "../languages/LanguageContext";

import Baraka from "../assets/Baraka.png";
import GVF   from "../assets/GVF.png";
import tal   from "../assets/tal.png";
import HOF   from "../assets/hof.png";
import jabal from "../assets/jabal.jpg";
import b     from "../assets/b.jpg";
import rawda from "../assets/rawda.jpg";
import p     from "../assets/p.jpg";
import hero  from "../assets/hero.jpg";

const COLORS = {
  oliveDark:  "#2c3d1f",
  oliveMid:   "#3d5a27",
  oliveLight: "#6b8f47",
  cream:      "#f5f0e8",
  warmWhite:  "#faf8f3",
  gold:       "#c8a84b",
  goldLight:  "#f0e4be",
  border:     "#e2d9c5",
  textDark:   "#1c2910",
  textMuted:  "#7a7a6e",
};

const STAGES = [
  {
    key: "harvest",
    iconEn: "🫒", labelEn: "Harvest",        labelAr: "القطاف",
    metricEn: null,
  },
  {
    key: "pressing",
    iconEn: "⚙️", labelEn: "Pressing",       labelAr: "العصر",
  },
  {
    key: "filtering",
    iconEn: "🔬", labelEn: "Filtering & QC", labelAr: "التصفية وضمان الجودة",
  },
  {
    key: "packaging",
    iconEn: "📦", labelEn: "Packaging",      labelAr: "التعبئة",
  },
  {
    key: "shipping",
    iconEn: "🚚", labelEn: "Shipping",       labelAr: "الشحن",
  },
];

const PRODUCTS = [
  {
    id: 1,
    nameEn: "Extra Virgin Olive Oil",      nameAr: "زيت زيتون بكر ممتاز",
    farmEn: "Al-Baraka Farm",              farmAr: "مزرعة البركة",
    sizeL: "5L", img: Baraka, badge: "Best Seller",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-12" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-15" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-10" },
    ],
  },
  {
    id: 2,
    nameEn: "Cold-Pressed Olive Oil",      nameAr: "زيت زيتون معصور على البارد",
    farmEn: "Green Valley Farm",           farmAr: "مزرعة الوادي الأخضر",
    sizeL: "3L", img: GVF, badge: "New Harvest",
    versions: [
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-22" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-18" },
    ],
  },
  {
    id: 3,
    nameEn: "Premium Extra Virgin",        nameAr: "زيت بكر ممتاز فاخر",
    farmEn: "Tal Al-Zeitoun Farm",         farmAr: "مزرعة تل الزيتون",
    sizeL: "5L", img: tal, badge: "Gift Size",
    versions: [
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-05" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-08" },
    ],
  },
  {
    id: 4,
    nameEn: "Organic Certified Olive Oil", nameAr: "زيت زيتون عضوي معتمد",
    farmEn: "Haddad Organic Farm",         farmAr: "مزرعة حداد العضوية",
    sizeL: "5L", img: HOF, badge: "Organic",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-11-04" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-11-06" },
    ],
  },
  {
    id: 5,
    nameEn: "Wild Grove Olive Oil",        nameAr: "زيت زيتون البرية",
    farmEn: "Jabal Al-Nar Farm",           farmAr: "مزرعة جبل النار",
    sizeL: "5L", img: jabal, badge: "Wild Harvest",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-25" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-28" },
    ],
  },
  {
    id: 6,
    nameEn: "Heritage Blend Olive Oil",    nameAr: "مزيج زيتون التراث الأصيل",
    farmEn: "Beit Al-Zeitoun Farm",        farmAr: "مزرعة بيت الزيتون",
    sizeL: "5L", img: b, badge: "Heritage",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-20" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-22" },
    ],
  },
  {
    id: 7,
    nameEn: "Stone-Mill Olive Oil",        nameAr: "زيت معصرة الحجر التقليدية",
    farmEn: "Al-Rawda Farm",               farmAr: "مزرعة الروضة",
    sizeL: "10L", img: rawda, badge: "Stone Mill",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-11-08" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-11-12" },
    ],
  },
  {
    id: 8,
    nameEn: "Rumi Variety Olive Oil",      nameAr: "زيت زيتون صنف رومي عتيق",
    farmEn: "Safouri Heritage Farm",       farmAr: "مزرعة الصفوري التراثية",
    sizeL: "10L", img: p, badge: "Rare Variety",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-01" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-05" },
    ],
  },
];

function generateStages(baseDateStr, version) {
  const b = new Date(baseDateStr);
  const d1 = new Date(b);
  const d2 = new Date(b); d2.setHours(d2.getHours() + 7);
  const d3 = new Date(b); d3.setDate(d3.getDate() + 1);
  const d4 = new Date(b); d4.setDate(d4.getDate() + 3);

  return {
    harvest: {
      date: d1.toISOString().split("T")[0], time: "06:00",
      en: `Premium harvest for ${version.label}. Handpicked with extreme care at early morning hours.`,
      ar: `قطاف يدوي ممتاز لإصدار (${version.label}) في ساعات الصباح الباكر.`,
      metrics: null,
    },
    pressing: {
      date: d2.toISOString().split("T")[0], time: "13:30",
      en: "Cold extraction executed below 24°C within the same day of harvesting.",
      ar: "تم العصر البارد تحت 24 درجة مئوية في نفس يوم القطف.",
      metrics: [{ labelEn: "Temperature", labelAr: "الحرارة", value: "< 24°C" }, { labelEn: "Method", labelAr: "الطريقة", value: "Cold Press" }],
    },
    filtering: {
      date: d3.toISOString().split("T")[0], time: "09:00",
      en: "Natural filtration completed. Laboratory check: Acidity registered at 0.21%.",
      ar: "اكتملت التصفية الطبيعية. نسبة حموضة: 0.21%.",
      metrics: [{ labelEn: "Acidity", labelAr: "الحموضة", value: "0.21%" }, { labelEn: "Polyphenols", labelAr: "البوليفينول", value: "320 mg/kg" }],
    },
    packaging: {
      date: d4.toISOString().split("T")[0], time: "11:00",
      en: "Safely bottled and sealed into protective food-grade containers.",
      ar: "تمت التعبئة والإغلاق في عبوات آمنة ومطابقة للمعايير الغذائية.",
      metrics: null,
    },
    shipping: {
      date: null, time: null,
      en: "Ready to ship within 48 hours of order confirmation. Your order will be carefully packed and dispatched to your door.",
      ar: "جاهز للشحن خلال 48 ساعة من تأكيد الطلب. سيتم تعبئة طلبك بعناية وإرساله إلى باب منزلك.",
      metrics: [{ labelEn: "Dispatch", labelAr: "الإرسال", value: "Within 48h" }, { labelEn: "Coverage", labelAr: "التغطية", value: "All Jordan" }],
    },
  };
}

function formatDate(dateStr, lang) {
  if (!dateStr) return lang === "ar" ? "عند تأكيد الطلب" : "Upon order confirmation";
  return new Date(dateStr).toLocaleDateString(lang === "ar" ? "ar-JO" : "en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

const TEXT = {
  en: {
    title: "Oil Journey Timeline",
    subtitle: "Trace every drop — from tree to table. Select a product and a harvest year to explore its full production journey.",
    filterFarm: "Filter by Farm",
    all: "All Farms",
    versionLabel: "Select Version:",
    noResult: "No products match your selection.",
    verified: "Verified",
    date: "Date", time: "Time",
    shippingNote: "Ready to ship",
  },
  ar: {
    title: "تتبع مسار رحلة الزيت",
    subtitle: "تتبع كل قطرة زيت من الشجرة إلى المائدة. اختر منتجاً وسنة حصاد لاستعراض رحلته الإنتاجية الكاملة.",
    filterFarm: "تصفية حسب المزرعة",
    all: "جميع المزارع",
    versionLabel: "اختر الإصدار:",
    noResult: "لا توجد منتجات مطابقة.",
    verified: "موثق",
    date: "التاريخ", time: "الوقت",
    shippingNote: "جاهز للشحن",
  },
};

function SplitCard({ product, lang }) {
  const isAr = lang === "ar";
  const t = TEXT[lang];
  const [activeStage, setActiveStage] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(0);

  const version = product.versions[selectedIdx];
  const stages  = generateStages(version.baseDate, version);
  const current = STAGES[activeStage];
  const data    = stages[current.key];

  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 14,
      overflow: "hidden",
      marginBottom: 20,
    }}>
      <div style={{
        padding: "14px 18px",
        display: "flex", alignItems: "center", gap: 14,
        borderBottom: `1px solid ${COLORS.border}`,
        background: COLORS.cream,
        flexWrap: "wrap",
      }}>
        <img src={product.img} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", border: `1px solid ${COLORS.border}`, flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "0.65rem", fontWeight: 700, color: COLORS.oliveLight, textTransform: "uppercase", marginBottom: 2 }}>
            🌿 {isAr ? product.farmAr : product.farmEn} · {product.sizeL}
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.95rem", color: COLORS.textDark }}>
            {isAr ? product.nameAr : product.nameEn}
            {product.badge && (
              <span style={{ background: COLORS.goldLight, color: "#7a5c2e", fontSize: "0.6rem", padding: "2px 8px", borderRadius: 20, marginInlineStart: 8, fontWeight: 700 }}>
                {product.badge}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 600, color: COLORS.textMuted }}>{t.versionLabel}</span>
          <select
            value={selectedIdx}
            onChange={e => { setSelectedIdx(Number(e.target.value)); setActiveStage(0); }}
            style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "4px 8px", fontSize: "0.72rem", color: COLORS.textDark, background: "#fff", cursor: "pointer", outline: "none" }}
          >
            {product.versions.map((v, i) => <option key={i} value={i}>{v.label}</option>)}
          </select>
          <span style={{ background: "#def7ec", color: "#057a55", fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>
            ✓ {t.verified}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "180px 1fr" }}>

        {/* Left sidebar */}
        <div style={{ borderInlineEnd: `1px solid ${COLORS.border}`, background: COLORS.warmWhite }}>
          {STAGES.map((s, i) => {
            const isDone   = i < activeStage;
            const isActive = i === activeStage;
            return (
              <div
                key={s.key}
                onClick={() => setActiveStage(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", cursor: "pointer",
                  borderInlineStart: isActive ? `3px solid ${COLORS.oliveDark}` : "3px solid transparent",
                  background: isActive ? "#fff" : "transparent",
                  transition: "all 0.15s",
                }}
              >
                <div style={{
                  width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.72rem", fontWeight: 700,
                  background: isDone ? COLORS.oliveDark : isActive ? COLORS.oliveMid : COLORS.cream,
                  color: isDone || isActive ? "#fff" : COLORS.textMuted,
                  border: `1px solid ${isDone || isActive ? "transparent" : COLORS.border}`,
                }}>
                  {isDone ? "✓" : i + 1}
                </div>
                <span style={{
                  fontSize: "0.75rem",
                  color: isActive ? COLORS.textDark : COLORS.textMuted,
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {isAr ? s.labelAr : s.labelEn}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: current.key === "shipping" ? COLORS.gold : COLORS.oliveLight, flexShrink: 0 }} />
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: COLORS.textDark }}>
              {isAr ? current.labelAr : current.labelEn}
            </span>
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
            <span style={{ fontSize: "0.72rem", color: COLORS.textMuted }}>
              📅 {formatDate(data.date, lang)}
            </span>
            {data.time && (
              <span style={{ fontSize: "0.72rem", color: COLORS.textMuted }}>
                🕐 {data.time}
              </span>
            )}
          </div>

          {current.key === "shipping" ? (
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.oliveDark}, ${COLORS.oliveMid})`,
              borderRadius: 10, padding: "14px 16px", marginBottom: 14,
            }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.gold, marginBottom: 6 }}>
                🚚 {isAr ? "جاهز للشحن خلال 48 ساعة" : "Ready to ship within 48 hours"}
              </div>
              <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
                {isAr ? data.ar : data.en}
              </div>
            </div>
          ) : (
            <div style={{
              fontSize: "0.8rem", color: COLORS.textDark, lineHeight: 1.6,
              background: COLORS.warmWhite, borderRadius: 8, padding: "10px 14px",
              borderInlineStart: `3px solid ${COLORS.gold}`,
              marginBottom: 14,
            }}>
              {isAr ? data.ar : data.en}
            </div>
          )}

          {data.metrics && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {data.metrics.map((m, i) => (
                <div key={i} style={{ background: COLORS.cream, borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ fontSize: "0.65rem", color: COLORS.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {isAr ? m.labelAr : m.labelEn}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: COLORS.oliveDark }}>{m.value}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
            {activeStage > 0 && (
              <button
                onClick={() => setActiveStage(i => i - 1)}
                style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 14px", fontSize: "0.75rem", cursor: "pointer", color: COLORS.textMuted }}
              >
                {isAr ? "← السابق" : "← Prev"}
              </button>
            )}
            {activeStage < STAGES.length - 1 && (
              <button
                onClick={() => setActiveStage(i => i + 1)}
                style={{ background: COLORS.oliveDark, border: "none", borderRadius: 6, padding: "6px 14px", fontSize: "0.75rem", cursor: "pointer", color: "#fff", fontWeight: 600 }}
              >
                {isAr ? "التالي →" : "Next →"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OilTracking() {
  const { lang } = useContext(LanguageContext);
  const t   = TEXT[lang];
  const isAr = lang === "ar";

  const farmOptions = [...new Set(PRODUCTS.map(p => isAr ? p.farmAr : p.farmEn))];
  const [selectedFarm, setSelectedFarm] = useState("all");

  const filtered = PRODUCTS.filter(p =>
    selectedFarm === "all" || (isAr ? p.farmAr : p.farmEn) === selectedFarm
  );

  return (
    <div style={{ background: COLORS.warmWhite, minHeight: "100vh" }} dir={isAr ? "rtl" : "ltr"}>

      <div style={{
        background: `linear-gradient(rgba(30,50,20,0.82), rgba(30,50,20,0.82)), url(${hero}) center/cover no-repeat`,
        padding: "70px 0 50px", textAlign: "center",
      }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 10 }}>
          ZAYTONA
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#fff", marginBottom: 14 }}>
          {t.title}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", maxWidth: 520, margin: "0 auto" }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 80px" }}>

        <div style={{ display: "flex", gap: 16, marginBottom: 24, padding: "14px 18px", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <label style={{ fontSize: "0.65rem", fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase" }}>{t.filterFarm}</label>
            <select
              value={selectedFarm}
              onChange={e => setSelectedFarm(e.target.value)}
              style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 10px", fontSize: "0.8rem", color: COLORS.textDark, background: COLORS.warmWhite, cursor: "pointer", outline: "none", minWidth: 200 }}
            >
              <option value="all">{t.all}</option>
              {farmOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textMuted, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
            🫙 {t.noResult}
          </div>
        ) : (
          filtered.map(product => (
            <SplitCard key={product.id} product={product} lang={lang} />
          ))
        )}
      </div>
    </div>
  );
}