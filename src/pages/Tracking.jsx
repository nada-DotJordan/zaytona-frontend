import { useState, useContext } from "react";
import { LanguageContext } from "../languages/LanguageContext";

import Baraka from "../assets/Baraka.png"; 
import GVF from "../assets/GVF.png";
import tal from "../assets/tal.png";
import HOF from "../assets/hof.png";
import jabal from "../assets/jabal.jpg";
import b from "../assets/b.jpg";
import rawda from "../assets/rawda.jpg";
import p from "../assets/p.jpg";
import hero from "../assets/hero.jpg";

const COLORS = {
  oliveDark:   "#2c3d1f",
  oliveMid:    "#3d5a27",
  oliveLight:  "#6b8f47",
  cream:       "#f5f0e8",
  warmWhite:   "#faf8f3",
  gold:        "#c8a84b",
  goldLight:   "#f0e4be",
  border:      "#e2d9c5",
  textDark:    "#1c2910",
  textMuted:   "#7a7a6e",
};

// إعدادات مراحل التتبع الخمسة
const STAGES = [
  { key: "harvest",   icon: "🫒", labelEn: "Harvest",   labelAr: "القطاف"    },
  { key: "pressing",  icon: "⚙️", labelEn: "Pressing",  labelAr: "العصر"     },
  { key: "filtering", icon: "🔬", labelEn: "Filtering & QC", labelAr: "التصفية وضمان الجودة" },
  { key: "packaging", icon: "📦", labelEn: "Packaging", labelAr: "التعبئة"   },
  { key: "ready",     icon: "✅", labelEn: "Ready",     labelAr: "جاهز للبيع" },
];

// ── البيانات الكاملة للمنتجات الـ 16 مع إصداراتها بدون السعر ──
const PRODUCTS_BASE = [
  {
    id: 1,
    nameEn: "Extra Virgin Olive Oil",     nameAr: "زيت زيتون بكر ممتاز",
    farmEn: "Al-Baraka Farm",             farmAr: "مزرعة البركة",
    farmIndex: 1, sizeL: "5L", img: Baraka, badge: "Best Seller",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-12" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-15" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-10" }
    ]
  },
  {
    id: 2,
    nameEn: "Extra Virgin Olive Oil",     nameAr: "زيت زيتون بكر ممتاز",
    farmEn: "Al-Baraka Farm",             farmAr: "مزرعة البركة",
    farmIndex: 1, sizeL: "10L", img: Baraka, badge: null,
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-14" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-18" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-12" }
    ]
  },
  {
    id: 3,
    nameEn: "Cold-Pressed Olive Oil",    nameAr: "زيت زيتون معصور على البارد",
    farmEn: "Green Valley Farm",          farmAr: "مزرعة الوادي الأخضر",
    farmIndex: 2, sizeL: "3L", img: GVF, badge: "New Harvest",
    versions: [
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-22" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-18" }
    ]
  },
  {
    id: 4,
    nameEn: "Cold-Pressed Olive Oil",    nameAr: "زيت زيتون معصور على البارد",
    farmEn: "Green Valley Farm",          farmAr: "مزرعة الوادي الأخضر",
    farmIndex: 2, sizeL: "15L", img: GVF, badge: null,
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-20" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-25" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-20" }
    ]
  },
  {
    id: 5,
    nameEn: "Premium Extra Virgin",       nameAr: "زيت بكر ممتاز فاخر",
    farmEn: "Tal Al-Zeitoun Farm",        farmAr: "مزرعة تل الزيتون",
    farmIndex: 3, sizeL: "5L", img: tal, badge: "Gift Size",
    versions: [
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-05" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-08" }
    ]
  },
  {
    id: 6,
    nameEn: "Premium Extra Virgin",       nameAr: "زيت بكر ممتاز فاخر",
    farmEn: "Tal Al-Zeitoun Farm",        farmAr: "مزرعة تل الزيتون",
    farmIndex: 3, sizeL: "10L", img: tal, badge: null,
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-06" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-10" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-14" }
    ]
  },
  {
    id: 7,
    nameEn: "Organic Certified Olive Oil", nameAr: "زيت زيتون عضوي معتمد",
    farmEn: "Haddad Organic Farm",        farmAr: "مزرعة حداد العضوية",
    farmIndex: 4, sizeL: "2L", img: HOF, badge: null,
    versions: [
      { year: 2022, label: "Harvest 2022", baseDate: "2022-11-01" },
      { year: 2023, label: "Harvest 2023", baseDate: "2023-11-03" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-11-05" }
    ]
  },
  {
    id: 8,
    nameEn: "Organic Certified Olive Oil", nameAr: "زيت زيتون عضوي معتمد",
    farmEn: "Haddad Organic Farm",        farmAr: "مزرعة حداد العضوية",
    farmIndex: 4, sizeL: "5L", img: HOF, badge: "Organic",
    versions: [
      { year: 2022, label: "Harvest 2022", baseDate: "2022-11-02" },
      { year: 2023, label: "Harvest 2023", baseDate: "2023-11-04" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-11-06" }
    ]
  },
  {
    id: 9,
    nameEn: "Organic Certified Olive Oil", nameAr: "زيت زيتون عضوي معتمد",
    farmEn: "Haddad Organic Farm",        farmAr: "مزرعة حداد العضوية",
    farmIndex: 4, sizeL: "10L", img: HOF, badge: null,
    versions: [
      { year: 2022, label: "Harvest 2022", baseDate: "2022-11-04" },
      { year: 2023, label: "Harvest 2023", baseDate: "2023-11-06" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-11-10" }
    ]
  },
  {
    id: 10,
    nameEn: "Wild Grove Olive Oil",       nameAr: "زيت زيتون البرية",
    farmEn: "Jabal Al-Nar Farm",          farmAr: "مزرعة جبل النار",
    farmIndex: 5, sizeL: "5L", img: jabal, badge: "Wild Harvest",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-25" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-28" }
    ]
  },
  {
    id: 11,
    nameEn: "Heritage Blend Olive Oil",   nameAr: "مزيج زيتون التراث الأصيل",
    farmEn: "Beit Al-Zeitoun Farm",       farmAr: "مزرعة بيت الزيتون",
    farmIndex: 6, sizeL: "5L", img: b, badge: "Heritage",
    versions: [
      { year: 2021, label: "Harvest 2021", baseDate: "2021-10-15" },
      { year: 2022, label: "Harvest 2022", baseDate: "2022-10-18" },
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-20" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-22" }
    ]
  },
  {
    id: 12,
    nameEn: "Heritage Blend Olive Oil",   nameAr: "مزيج زيتون التراث الأصيل",
    farmEn: "Beit Al-Zeitoun Farm",       farmAr: "مزرعة بيت الزيتون",
    farmIndex: 6, sizeL: "10L", img: b, badge: null,
    versions: [
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-26" },
      { year: 2025, label: "Harvest 2025", baseDate: "2025-10-29" }
    ]
  },
  {
    id: 13,
    nameEn: "Stone-Mill Olive Oil",       nameAr: "زيت معصرة الحجر التقليدية",
    farmEn: "Al-Rawda Farm",              farmAr: "مزرعة الروضة",
    farmIndex: 7, sizeL: "10L", img: rawda, badge: "Stone Mill",
    versions: [
      { year: 2022, label: "Harvest 2022", baseDate: "2022-11-05" },
      { year: 2023, label: "Harvest 2023", baseDate: "2023-11-08" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-11-12" }
    ]
  },
  {
    id: 14,
    nameEn: "Rumi Variety Olive Oil",     nameAr: "زيت زيتون صنف رومي عتيق",
    farmEn: "Safouri Heritage Farm",      farmAr: "مزرعة السافوري التراثية",
    farmIndex: 8, sizeL: "10L", img: p, badge: "Rare Variety",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-01" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-05" }
    ]
  },
  {
    id: 15,
    nameEn: "Rumi Variety Olive Oil",     nameAr: "زيت زيتون صنف رومي عتيق",
    farmEn: "Safouri Heritage Farm",      farmAr: "مزرعة السافوري التراثية",
    farmIndex: 8, sizeL: "20L", img: p, badge: null,
    versions: [
      { year: 2022, label: "Harvest 2022", baseDate: "2022-10-02" },
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-06" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-10" }
    ]
  },
  {
    id: 16,
    nameEn: "Nabali Baladi Olive Oil",    nameAr: "زيت زيتون نبالي بلدي",
    farmEn: "Safouri Heritage Farm",      farmAr: "مزرعة السافوري التراثية",
    farmIndex: 8, sizeL: "15L", img: p, badge: "Limited",
    versions: [
      { year: 2023, label: "Harvest 2023", baseDate: "2023-10-12" },
      { year: 2024, label: "Harvest 2024", baseDate: "2024-10-16" }
    ]
  }
];

function generateTrackingStages(baseDateStr, versionInfo) {
  const baseDate = new Date(baseDateStr);
  
  const d1 = new Date(baseDate);
  const d2 = new Date(baseDate); d2.setHours(d2.getHours() + 7);
  const d3 = new Date(baseDate); d3.setDate(d3.getDate() + 1);
  const d4 = new Date(baseDate); d4.setDate(d4.getDate() + 3);
  const d5 = new Date(baseDate); d5.setDate(d5.getDate() + 5);

  return {
    harvest: {
      date: d1.toISOString().split('T')[0], time: "06:00",
      notes: `Premium harvest for ${versionInfo.label}. Handpicked with extreme care at early morning hours.`,
      notesAr: `قطاف يدوي ممتاز ومختار خصيصاً لإصدار (${versionInfo.label}) في ساعات الصباح الباكر وبأعلى جودة.`
    },
    pressing: {
      date: d2.toISOString().split('T')[0], time: "13:30",
      notes: `Cold extraction executed below 24°C within the same day of harvesting.`,
      notesAr: `تم العصر البارد الفائق تحت درجة حرارة 24 مئوية في نفس يوم القطف لضمان الحفاظ على الخواص الطبيعية.`
    },
    filtering: {
      date: d3.toISOString().split('T')[0], time: "09:00",
      notes: `Natural filtration completed. Laboratory check: Acidity registered at 0.21%.`,
      notesAr: `اكتملت مرحلة التصفية الطبيعية. الفحص المخبري لهذه الدفعة يظهر نسبة حموضة مثالية بلغت 0.21%.`
    },
    packaging: {
      date: d4.toISOString().split('T')[0], time: "11:00",
      notes: `Safely bottled and sealed into protective food-grade containers.`,
      notesAr: `تمت التعبئة والإغلاق المحكم بنجاح في عبوات آمنة ومطابقة لأعلى المعايير الغذائية.`
    },
    ready: {
      date: d5.toISOString().split('T')[0], time: "08:00",
      notes: `Passed final quality assurance checks. Released for customers logistics distribution.`,
      notesAr: `تم اجتياز الفحص النهائي لضمان الجودة بنجاح، الدفعة الآن معتمدة وجاهزة للتوصيل والبيع النهائي.`
    }
  };
}

function formatDate(dateStr, lang) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(lang === "ar" ? "ar-JO" : "en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
}

const TEXT = {
  en: {
    title: "Oil Journey Timeline",
    subtitle: "Trace every drop — from tree to table. Select a specific product and choose its manufacturing cycle version directly inside the card.",
    filterFarm: "Filter by Farm",
    all: "All Farms",
    versionLabel: "Select Version:",
    noResult: "No production profiles match your current criteria."
  },
  ar: {
    title: "تتبع مسار ورحلة الزيت",
    subtitle: "تتبع كل قطرة زيت من الشجرة إلى المائدة مباشرة. تصفح المنتجات واختر إصدار وسنة التصنيع من داخل كرت المنتج نفسه لعرض تتبعه ودورته الإنتاجية.",
    filterFarm: "تصفية حسب المزرعة",
    all: "جميع المزارع",
    versionLabel: "اختر الإصدار:",
    noResult: "لا توجد منتجات مطابقة للمزرعة المحددة."
  },
};

function StageCard({ stage, data, lang, isLast }) {
  const isAr = lang === "ar";
  return (
    <div style={{ display: "flex", gap: 0, position: "relative" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 48, flexShrink: 0 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: COLORS.oliveDark, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", zIndex: 1, boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}>
          {stage.icon}
        </div>
        {!isLast && <div style={{ width: 2, flex: 1, minHeight: 28, background: COLORS.border, margin: "4px 0" }} />}
      </div>

      <div style={{ flex: 1, marginBottom: isLast ? 0 : 12, marginLeft: isAr ? 0 : 12, marginRight: isAr ? 12 : 0, paddingBottom: isLast ? 0 : 16 }}>
        <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "12px 14px" }}>
          <div style={{ fontWeight: 800, fontSize: "0.88rem", color: COLORS.oliveDark, marginBottom: 4 }}>
            {isAr ? stage.labelAr : stage.labelEn}
          </div>
          <div style={{ display: "flex", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: "0.72rem", color: COLORS.textMuted }}>📅 {formatDate(data.date, lang)}</span>
            <span style={{ fontSize: "0.72rem", color: COLORS.textMuted }}>🕐 {data.time}</span>
          </div>
          <p style={{
            fontSize: "0.78rem", color: COLORS.textDark, lineHeight: 1.5, margin: 0,
            background: COLORS.warmWhite, borderRadius: 6, padding: "6px 10px",
            borderLeft: isAr ? "none" : `3px solid ${COLORS.gold}`, borderRight: isAr ? `3px solid ${COLORS.gold}` : "none",
          }}>
            {isAr ? data.notesAr : data.notes}
          </p>
        </div>
      </div>
    </div>
  );
}

function JourneyCard({ product, lang }) {
  const [open, setOpen] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const isAr = lang === "ar";
  const t = TEXT[lang];

  const currentVersion = product.versions[selectedIdx] || product.versions[0];
  
  const trackingStages = generateTrackingStages(currentVersion.baseDate, currentVersion);

  return (
    <div style={{
      background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12,
      overflow: "hidden", marginBottom: 18, boxShadow: "0 2px 5px rgba(0,0,0,0.01)"
    }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, background: open ? COLORS.cream : "#fff", transition: "background 0.2s", flexWrap: "wrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flex: "1 1 300px" }}>
          <img src={product.img} alt="" style={{ width: 55, height: 55, borderRadius: 8, objectFit: "cover", border: `1px solid ${COLORS.border}` }} />
          <div>
            <div style={{ fontSize: "0.68rem", fontWeight: 700, color: COLORS.oliveLight, marginBottom: 2 }}>
              🌿 {isAr ? product.farmAr : product.farmEn} · {isAr ? "الحجم:" : "Size:"} {product.sizeL}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: COLORS.textDark, marginBottom: 6 }}>
              {isAr ? product.nameAr : product.nameEn} 
              {product.badge && <span style={{ background: COLORS.goldLight, color: "#7a5c2e", fontSize: "0.65rem", padding: "2px 6px", borderRadius: 4, marginLeft: isAr ? 0 : 8, marginRight: isAr ? 8 : 0, fontWeight: 700 }}>{product.badge}</span>}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }} onClick={(e) => e.stopPropagation()}>
              <span style={{ fontSize: "0.72rem", fontWeight: 600, color: COLORS.textMuted }}>{t.versionLabel}</span>
              <select
                value={selectedIdx}
                onChange={(e) => setSelectedIdx(Number(e.target.value))}
                style={{
                  border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "3px 6px",
                  fontSize: "0.72rem", color: COLORS.textDark, background: COLORS.warmWhite, cursor: "pointer", outline: "none"
                }}
              >
                {product.versions.map((v, index) => (
                  <option key={index} value={index}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div 
          onClick={() => setOpen(o => !o)}
          style={{ display: "flex", alignItems: "center", gap: 16, cursor: "pointer", userSelect: "none" }}
        >
          <span style={{
            background: "#def7ec", color: "#057a55", fontSize: "0.68rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20
          }}>
            ✓ {isAr ? "موثق" : "Verified"}
          </span>
          <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: COLORS.textMuted, fontSize: "0.75rem" }}>▼</span>
        </div>
      </div>

      {open && (
        <div style={{ padding: "18px 20px", borderTop: `1px solid ${COLORS.border}`, background: COLORS.warmWhite + "44" }}>
          {STAGES.map((stage, i) => (
            <StageCard
              key={stage.key}
              stage={stage}
              data={trackingStages[stage.key]}
              lang={lang}
              isLast={i === STAGES.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OilTracking() {
  const { lang } = useContext(LanguageContext);
  const t = TEXT[lang];
  const isAr = lang === "ar";

  const farmOptions = [...new Set(PRODUCTS_BASE.map(p => isAr ? p.farmAr : p.farmEn))];
  const [selectedFarm, setSelectedFarm] = useState("all");

  const filteredProducts = PRODUCTS_BASE.filter(p => {
    return selectedFarm === "all" || (isAr ? p.farmAr : p.farmEn) === selectedFarm;
  });

  return (
    <div style={{ background: COLORS.warmWhite, minHeight: "100vh" }} dir={isAr ? "rtl" : "ltr"}>
      {/* بنر الهيرو */}
      <div style={{
  background: `linear-gradient(rgba(30,50,20,0.82), rgba(30,50,20,0.82)), url(${hero}) center/cover no-repeat`,
  padding: "70px 0 50px",
  textAlign: "center",
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
      <div style={{ maxWidth: 850, margin: "0 auto", padding: "30px 20px 80px" }}>
        
        {/* فلتر المزارع السريع */}
        <div style={{ display: "flex", gap: 16, marginBottom: 24, padding: "14px 18px", background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            <label style={{ fontSize: "0.65rem", fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase" }}>{t.filterFarm}</label>
            <select
              value={selectedFarm}
              onChange={e => setSelectedFarm(e.target.value)}
              style={{ border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "6px 10px", fontSize: "0.8rem", color: COLORS.textDark, background: COLORS.warmWhite, cursor: "pointer", outline: "none", maxWidth: "260px" }}
            >
              <option value="all">{t.all}</option>
              {farmOptions.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>

        {/* قائمة المنتجات الـ 16 كاملة */}
        {filteredProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textMuted, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 10 }}>
            🫙 {t.noResult}
          </div>
        ) : (
          filteredProducts.map(product => (
            <JourneyCard key={product.id} product={product} lang={lang} />
          ))
        )}
      </div>
    </div>
  );
}