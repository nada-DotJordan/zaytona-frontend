import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../languages/LanguageContext";
import { useFarms, useProducts } from "../api/api";

import f1   from "../assets/f1.png";
import f2   from "../assets/f2.jpg";
import f3   from "../assets/f3.jpg";
import f4   from "../assets/f4.jpg";
import f5   from "../assets/f5.jpg";
import f6   from "../assets/f6.jpg";
import f7   from "../assets/f7.jpg";
import f8   from "../assets/f8.jpg";
import hero from "../assets/hero.jpg";

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

const FARM_EXTRA_EN = {
  "Al-Baraka Farm": {
    img: f1, tag: "Best Seller Oils", tagColor: COLORS.gold,
    location: "Ajloun, Northern Jordan",
    description: "Nestled in the green hills of Ajloun, Al-Baraka Farm has been cultivating olives for over 80 years. Known for its extra virgin oils with a rich, fruity flavor and low acidity — a family tradition passed down through three generations.",
    highlights: ["80+ Years Experience", "Extra Virgin Certified", "3 Generations"],
    email: "info@albaraka-farm.jo", phone: "+962 2 100 0001",
  },
  "Green Valley Farm": {
    img: f2, tag: "Cold-Pressed", tagColor: COLORS.oliveLight,
    location: "Irbid, Northern Jordan",
    description: "Located in the fertile valleys of Irbid, Green Valley Farm specializes in cold-pressed olive oil that retains maximum nutrients and flavor. Their modern pressing facility ensures zero heat exposure throughout the extraction process.",
    highlights: ["Cold-Press Only", "Modern Facility", "High Polyphenols"],
    email: "contact@greenvalley.jo", phone: "+962 2 100 0002",
  },
  "Tal Al-Zeitoun Farm": {
    img: f3, tag: "Gift Size Available", tagColor: "#8b6914",
    location: "Jerash, Central Jordan",
    description: "Perched on the ancient hills of Jerash near Roman ruins, Tal Al-Zeitoun Farm grows olive trees that are centuries old. Their premium extra virgin oil carries a distinct peppery finish unique to the region's terroir.",
    highlights: ["Ancient Olive Trees", "Peppery Finish", "Historic Terroir"],
    email: "hello@talzeitoun.jo", phone: "+962 2 100 0003",
  },
  "Haddad Organic Farm": {
    img: f4, tag: "Certified Organic", tagColor: COLORS.oliveMid,
    location: "Salt, Central Jordan",
    description: "Haddad Organic Farm is Jordan's leading organic olive producer, certified by international standards. No pesticides, no chemicals — just pure, natural olive oil from trees tended with care and respect for the land.",
    highlights: ["Organic Certified", "No Pesticides", "Internationally Verified"],
    email: "organic@haddadfarm.jo", phone: "+962 5 100 0004",
  },
  "Jabal Al-Nar Farm": {
    img: f5, tag: "Wild Harvest", tagColor: "#7a5c2e",
    location: "Karak, Southern Jordan",
    description: "High in the mountains of Karak, Jabal Al-Nar Farm harvests wild olive groves that grow without irrigation or intervention. The result is a bold, intensely flavored oil prized by chefs and olive oil connoisseurs alike.",
    highlights: ["Wild Grove", "Mountain Altitude", "Intense Flavor"],
    email: "info@jabalnar.jo", phone: "+962 3 100 0005",
  },
  "Beit Al-Zeitoun Farm": {
    img: f6, tag: "Heritage Blend", tagColor: "#8b4513",
    location: "Madaba, Central Jordan",
    description: "Beit Al-Zeitoun, meaning 'House of the Olive', is a heritage farm in Madaba that blends multiple olive varieties to create a balanced, complex oil. Their multi-year harvest selection lets customers choose their preferred intensity.",
    highlights: ["Multi-Variety Blend", "4 Harvest Years", "Complex Profile"],
    email: "beit@zeitounfarm.jo", phone: "+962 5 100 0006",
  },
  "Al-Rawda Farm": {
    img: f7, tag: "Stone Mill", tagColor: "#555",
    location: "Balqa, Central Jordan",
    description: "Al-Rawda Farm uses a traditional stone mill — one of the few remaining in Jordan — to press their olives the old way. The slow stone grinding preserves aromatic compounds lost in modern centrifuge presses.",
    highlights: ["Stone Mill Press", "Traditional Method", "Aromatic Rich"],
    email: "press@alrawda.jo", phone: "+962 5 100 0007",
  },
  "Safouri Heritage Farm": {
    img: f8, tag: "Rare Varieties", tagColor: "#9b2335",
    location: "Ajloun, Northern Jordan",
    description: "Safouri Heritage Farm is dedicated to preserving rare Palestinian olive varieties — Rumi and Nabali Baladi — that are disappearing from the region. Each bottle is a piece of living agricultural history.",
    highlights: ["Rumi Variety", "Nabali Baladi", "Preservation Mission"],
    email: "heritage@safouri.jo", phone: "+962 2 100 0008",
  },
};

const FARM_EXTRA_AR = {
  "Al-Baraka Farm": {
    img: f1, tag: "الأكثر مبيعاً", tagColor: COLORS.gold,
    location: "عجلون، شمال الأردن",
    description: "تقع مزرعة البركة في التلال الخضراء لعجلون، وتزرع الزيتون منذ أكثر من 80 عاماً. تُعرف بزيتها البكر الممتاز ذي النكهة الغنية والحموضة المنخفضة — تقليد عائلي توارثته ثلاثة أجيال.",
    highlights: ["أكثر من 80 عاماً", "زيت بكر معتمد", "3 أجيال"],
    email: "info@albaraka-farm.jo", phone: "+962 2 100 0001",
  },
  "Green Valley Farm": {
    img: f2, tag: "عصر بارد", tagColor: COLORS.oliveLight,
    location: "إربد، شمال الأردن",
    description: "تقع في أودية إربد الخصبة، وتتخصص في زيت الزيتون المعصور بارداً للحفاظ على أقصى قدر من العناصر الغذائية والنكهة. منشأتهم الحديثة تضمن عدم تعرض الزيت لأي حرارة أثناء الاستخلاص.",
    highlights: ["عصر بارد فقط", "منشأة حديثة", "غني بالبوليفينول"],
    email: "contact@greenvalley.jo", phone: "+962 2 100 0002",
  },
  "Tal Al-Zeitoun Farm": {
    img: f3, tag: "حجم الهدايا متاح", tagColor: "#8b6914",
    location: "جرش، وسط الأردن",
    description: "تقع على تلال جرش الأثرية بالقرب من الأطلال الرومانية، وتحتضن أشجار زيتون عمرها قرون. يتميز زيتها الفاخر بطعم حار مميز فريد لتربة المنطقة.",
    highlights: ["أشجار زيتون معمّرة", "طعم حار مميز", "تربة تاريخية"],
    email: "hello@talzeitoun.jo", phone: "+962 2 100 0003",
  },
  "Haddad Organic Farm": {
    img: f4, tag: "عضوي معتمد", tagColor: COLORS.oliveMid,
    location: "السلط، وسط الأردن",
    description: "مزرعة حداد العضوية هي الرائدة في إنتاج الزيتون العضوي بالأردن، معتمدة وفق معايير دولية. بدون مبيدات، بدون مواد كيميائية — فقط زيت زيتون نقي طبيعي.",
    highlights: ["معتمد عضوياً", "بدون مبيدات", "معتمد دولياً"],
    email: "organic@haddadfarm.jo", phone: "+962 5 100 0004",
  },
  "Jabal Al-Nar Farm": {
    img: f5, tag: "حصاد بري", tagColor: "#7a5c2e",
    location: "الكرك، جنوب الأردن",
    description: "في جبال الكرك، تحصد مزرعة جبل النار بساتين زيتون برية تنمو دون ري أو تدخل. النتيجة زيت جريء وذو نكهة مكثفة يقدّره الطهاة وعشاق زيت الزيتون.",
    highlights: ["بستان بري", "ارتفاع جبلي", "نكهة مكثفة"],
    email: "info@jabalnar.jo", phone: "+962 3 100 0005",
  },
  "Beit Al-Zeitoun Farm": {
    img: f6, tag: "مزيج تراثي", tagColor: "#8b4513",
    location: "مادبا، وسط الأردن",
    description: "بيت الزيتون مزرعة تراثية في مادبا تمزج أصناف زيتون متعددة لإنتاج زيت متوازن ومركّب. يتيح اختيار موسم الحصاد للعملاء تحديد شدة النكهة المفضلة لديهم.",
    highlights: ["مزيج متعدد الأصناف", "4 مواسم حصاد", "ملف نكهة مركّب"],
    email: "beit@zeitounfarm.jo", phone: "+962 5 100 0006",
  },
  "Al-Rawda Farm": {
    img: f7, tag: "حجر الرحى", tagColor: "#555",
    location: "البلقاء، وسط الأردن",
    description: "تستخدم مزرعة الروضة رحى حجرية تقليدية — من القليل الباقية في الأردن — لعصر الزيتون بالطريقة القديمة. الطحن الحجري البطيء يحافظ على المركبات العطرية التي تضيع في العصارات الحديثة.",
    highlights: ["عصر بالحجر", "طريقة تقليدية", "غني بالعطريات"],
    email: "press@alrawda.jo", phone: "+962 5 100 0007",
  },
  "Safouri Heritage Farm": {
    img: f8, tag: "أصناف نادرة", tagColor: "#9b2335",
    location: "عجلون، شمال الأردن",
    description: "تكرّس مزرعة الصفوري التراثية جهودها للحفاظ على أصناف الزيتون الفلسطينية النادرة — الرومي والنبالي البلدي — التي تختفي من المنطقة. كل زجاجة قطعة من التاريخ الزراعي الحي.",
    highlights: ["صنف الرومي", "النبالي البلدي", "مهمة الحفاظ"],
    email: "heritage@safouri.jo", phone: "+962 2 100 0008",
  },
};


const TEXT = {
  en: {
    heroLabel:     "OUR PARTNER FARMS",
    heroTitle:     "Where Every Drop Begins",
    heroSubtitle:  "Eight trusted farms across Jordan, each with a unique story, location, and flavor.",
    productsBtn:   "View Farm Products",
    productsCount: (n) => `${n} product${n !== 1 ? "s" : ""}`,
    location:      "Location",
    highlights:    "Highlights",
    totalFarms:    "8 Partner Farms",
    totalDesc:     "Across 6 governorates of Jordan",
    totalProducts: "Products",
    acrossFarms:   "Across all farms",
    loading:       "Loading farms...",
  },
  ar: {
    heroLabel:     "مزارعنا الشريكة",
    heroTitle:     "من هنا تبدأ كل قطرة",
    heroSubtitle:  "ثماني مزارع موثوقة في أرجاء الأردن، كل منها بقصة وموقع ونكهة فريدة.",
    productsBtn:   "عرض منتجات المزرعة",
    productsCount: (n) => `${n} منتج`,
    location:      "الموقع",
    highlights:    "المميزات",
    totalFarms:    "٨ مزارع شريكة",
    totalDesc:     "في ٦ محافظات أردنية",
    totalProducts: "منتج",
    acrossFarms:   "في جميع المزارع",
    loading:       "جارٍ التحميل...",
  },
};

function FarmCard({ farm, productCount, t, lang, onViewProducts }) {
  const extraMap = lang === "en" ? FARM_EXTRA_EN : FARM_EXTRA_AR;
  const extra    = extraMap[farm.nameEn] || {};

  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 14,
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
        transition: "box-shadow 0.25s, transform 0.25s",
        minHeight: 200,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 8px 32px rgba(44,61,31,0.13)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div style={{ width: 220, minWidth: 220, position: "relative", flexShrink: 0 }}>
        <img
          src={extra.img}
          alt={lang === "en" ? farm.nameEn : farm.nameAr}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {extra.tag && (
          <span style={{
            position: "absolute",
            bottom: 12,
            left:  lang === "ar" ? "auto" : 12,
            right: lang === "ar" ? 12    : "auto",
            background: extra.tagColor,
            color: "#fff",
            fontSize: "0.6rem",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: 20,
            letterSpacing: "0.6px",
            textTransform: "uppercase",
          }}>
            {extra.tag}
          </span>
        )}
      </div>

      <div style={{
        padding: "1.4rem 1.6rem",
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>

        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
            <h4 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.15rem", color: COLORS.textDark, margin: 0 }}>
              {lang === "en" ? farm.nameEn : farm.nameAr}
            </h4>
            <span style={{
              fontSize: "0.68rem",
              background: COLORS.cream,
              border: `1px solid ${COLORS.border}`,
              color: COLORS.oliveMid,
              borderRadius: 20,
              padding: "3px 10px",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}>
              🫙 {t.productsCount(productCount)}
            </span>
          </div>

          <p style={{ fontSize: "0.75rem", color: COLORS.gold, fontWeight: 600, marginBottom: 10, letterSpacing: "0.5px" }}>
            📍 {extra.location}
          </p>

          <p style={{ fontSize: "0.83rem", color: COLORS.textMuted, lineHeight: 1.75, margin: "0 0 14px" }}>
            {extra.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 4 }}>
            {(extra.highlights || []).map((h, i) => (
              <span key={i} style={{
                fontSize: "0.68rem",
                padding: "3px 10px",
                borderRadius: 20,
                border: `1px solid ${COLORS.border}`,
                color: COLORS.oliveMid,
                background: COLORS.warmWhite,
                fontWeight: 500,
              }}>
                ✓ {h}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 14, flexWrap: "wrap" }}>
          <a href={`mailto:${extra.email}`} style={{ fontSize: "0.75rem", color: COLORS.textMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
            ✉️ {extra.email}
          </a>
          <a href={`tel:${extra.phone}`} style={{ fontSize: "0.75rem", color: COLORS.textMuted, textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
            📞 {extra.phone}
          </a>
        </div>

        <div style={{ marginTop: 16 }}>
          <button
            onClick={() => onViewProducts(farm._id)}
            style={{
              background: COLORS.oliveDark,
              color: "#fff",
              border: "none",
              padding: "10px 24px",
              borderRadius: 6,
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.oliveMid)}
            onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.oliveDark)}
          >
            {t.productsBtn} →
          </button>
        </div>

      </div>
    </div>
  );
}

export default function Farms() {
  const { lang } = useContext(LanguageContext);
  const navigate = useNavigate();

  const { farms, loading: farmsLoading }       = useFarms();
  const { products, loading: productsLoading } = useProducts();

  const t       = TEXT[lang];
  const loading = farmsLoading || productsLoading;

  function productCount(farmId) {
    return products.filter((p) => p.farmId?._id === farmId).length;
  }

  const totalProductCount = products.length;

  function handleViewProducts(farmId) {
    navigate("/Products", { state: { farmId } });
  }

  return (
    <div style={{ background: COLORS.warmWhite, minHeight: "100vh" }}>

      <div style={{
        background: `linear-gradient(rgba(30,50,20,0.80), rgba(30,50,20,0.80)), url(${hero}) center/cover no-repeat`,
        padding: "70px 0 50px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 10 }}>
          {t.heroLabel}
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#fff", marginBottom: 14 }}>
          {t.heroTitle}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", maxWidth: 500, margin: "0 auto 28px" }}>
          {t.heroSubtitle}
        </p>

        <div style={{
          display: "inline-flex",
          gap: 0,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 10,
          overflow: "hidden",
        }}>
          <div style={{ padding: "12px 28px", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
            <p style={{ fontSize: "1.3rem", fontWeight: 800, color: COLORS.gold, margin: 0 }}>
              {loading ? "—" : `${farms.length} ${lang === "en" ? "Farms" : "مزارع"}`}
            </p>
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>{t.totalDesc}</p>
          </div>
          <div style={{ padding: "12px 28px" }}>
            <p style={{ fontSize: "1.3rem", fontWeight: 800, color: COLORS.gold, margin: 0 }}>
              {loading ? "—" : `${totalProductCount} ${t.totalProducts}`}
            </p>
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.55)", margin: 0 }}>{t.acrossFarms}</p>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 52, paddingBottom: 80 }}>

        {loading && (
          <p style={{ textAlign: "center", color: COLORS.textMuted }}>{t.loading}</p>
        )}

        {farms.map((farm) => (
          <FarmCard
            key={farm._id}
            farm={farm}
            productCount={productCount(farm._id)}
            t={t}
            lang={lang}
            onViewProducts={handleViewProducts}
          />
        ))}
      </div>

    </div>
  );
}