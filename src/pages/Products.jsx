import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LanguageContext } from "../languages/LanguageContext";
import { useProducts, useFarms } from "../api/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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
  border:     "#e2d9c5",
  textDark:   "#1c2910",
  textMuted:  "#7a7a6e",
};

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
    pageTitle:     "Our Marketplace",
    pageSubtitle:  "Directly sourcing authentic extra virgin olive oils from historic olive presses across Jordan.",
    harvest:       "Select Harvest",
    fresher:       "Newest batches are premium rated",
    from:          "From",
    jd:            "JD",
    addToCart:     "Add to Cart",
    added:         "✓ Added!",
    loginToAdd:    "Sign in to Add",
    filterAll:     "All Farms",
    loading:       "Loading products...",
    noResults:     "No products found.",
    productsFound: (n) => `${n} product${n !== 1 ? "s" : ""} found matching your selection`,
  },
  ar: {
    pageTitle:     "سوق المنتجات",
    pageSubtitle:  "نوفر لك زيت الزيتون البكر الممتاز مباشرة من المعاصر التاريخية والمزارع الشريكة في الأردن.",
    harvest:       "اختر موسم الحصاد",
    fresher:       "المواسم الأحدث أعلى تقييماً جودة",
    from:          "من",
    jd:            "دينار",
    addToCart:     "إضافة للسلة",
    added:         "✓ تمت الإضافة!",
    loginToAdd:    "سجّل دخولك للإضافة",
    filterAll:     "كل المزارع",
    loading:       "جارٍ التحميل...",
    noResults:     "لا توجد منتجات.",
    productsFound: (n) => `تم العثور على ${n} من المنتجات المطابقة لخيارك`,
  },
};

function badgeColor(badge) {
  if (!badge) return null;
  const map = {
    "Best Seller":    { bg: "#c8a84b",   color: "#fff" },
    "الأكثر مبيعاً": { bg: "#c8a84b",   color: "#fff" },
    "New Harvest":    { bg: "#6b8f47",   color: "#fff" },
    "موسم جديد":      { bg: "#6b8f47",   color: "#fff" },
    "Organic":        { bg: "#3d5a27",   color: "#fff" },
    "عضوي":           { bg: "#3d5a27",   color: "#fff" },
    "Wild Harvest":   { bg: "#7a5c2e",   color: "#fff" },
    "حصاد بري":       { bg: "#7a5c2e",   color: "#fff" },
    "Heritage":       { bg: "#8b4513",   color: "#fff" },
    "تراثي":          { bg: "#8b4513",   color: "#fff" },
    "Stone Mill":     { bg: "#555",      color: "#fff" },
    "حجر الرحى":      { bg: "#555",      color: "#fff" },
    "Rare Variety":   { bg: "#9b2335",   color: "#fff" },
    "صنف نادر":       { bg: "#9b2335",   color: "#fff" },
    "Limited":        { bg: "#1c2910",   color: "#c8a84b" },
    "محدود":          { bg: "#1c2910",   color: "#c8a84b" },
    "Gift Size":      { bg: "#c8a84b22", color: "#7a5c2e" },
    "حجم الهدايا":    { bg: "#c8a84b22", color: "#7a5c2e" },
  };
  return map[badge] || { bg: COLORS.border, color: COLORS.textDark };
}

function ProductCard({ prod, lang, t }) {
  const { addToCart }      = useCart();
  const { isAuthenticated } = useAuth();
  const navigate            = useNavigate();

  const versions      = prod.versions || [];
  const latestVersion = versions[versions.length - 1];
  const [selectedVersion, setSelectedVersion] = useState(latestVersion);
  const [justAdded, setJustAdded]             = useState(false);

  const img         = IMG_MAP[prod.farmId?.nameEn] || Baraka;
  const bc          = badgeColor(prod.badge);
  const farmName    = lang === "en" ? prod.farmId?.nameEn : prod.farmId?.nameAr;
  const productName = lang === "en" ? prod.nameEn         : prod.nameAr;

  const badgePositionStyle = lang === "ar"
    ? { top: 10, right: 10 }
    : { top: 10, left: 10 };

  function handleAdd() {
  addToCart(prod, selectedVersion);
  setJustAdded(true);
  setTimeout(() => setJustAdded(false), 1400);
}
    addToCart(prod, selectedVersion);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  const btnLabel = justAdded ? t.added : t.addToCart;


  const btnBackground = !isAuthenticated
    ? COLORS.textMuted
    : justAdded
      ? COLORS.oliveLight
      : COLORS.oliveDark;

  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        border: `1px solid ${COLORS.border}`,
        marginBottom: 16,
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(44,61,31,0.10)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
    >
      <div style={{ width: 160, minWidth: 160, position: "relative", flexShrink: 0 }}>
        <img
          src={img}
          alt={productName}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {prod.badge && bc && (
          <span style={{
            position: "absolute",
            ...badgePositionStyle,
            background: bc.bg,
            color: bc.color,
            fontSize: "0.62rem",
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 20,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>
            {prod.badge}
          </span>
        )}
      </div>

      <div style={{ padding: "1rem 1.2rem", flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: COLORS.oliveLight, letterSpacing: "1px", textTransform: "uppercase" }}>
              🌿 {farmName}
            </span>
            <span style={{ fontSize: "0.68rem", color: COLORS.textMuted, background: COLORS.cream, border: `1px solid ${COLORS.border}`, borderRadius: 20, padding: "1px 8px" }}>
              {prod.sizeL}
            </span>
          </div>

          <h5 style={{ fontFamily: "Georgia, serif", fontWeight: 600, fontSize: "1rem", color: COLORS.textDark, margin: "0 0 10px" }}>
            {productName}
          </h5>

          <p style={{ fontSize: "0.7rem", color: COLORS.textMuted, fontWeight: 600, marginBottom: 6 }}>
            {t.harvest} —{" "}
            <span style={{ fontSize: "0.65rem", color: COLORS.gold }}>⚡ {t.fresher}</span>
          </p>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {versions.map((v) => {
              const isSelected = v.year === selectedVersion?.year;
              const isNewest   = v.year === latestVersion?.year;
              return (
                <button
                  key={v.year}
                  onClick={() => setSelectedVersion(v)}
                  style={{
                    fontSize: "0.72rem",
                    padding: "4px 12px",
                    borderRadius: 20,
                    border: isSelected ? `1.5px solid ${COLORS.oliveMid}` : `1px solid ${COLORS.border}`,
                    background: isSelected ? COLORS.oliveMid : "#fff",
                    color: isSelected ? "#fff" : COLORS.textMuted,
                    cursor: "pointer",
                    fontWeight: isSelected ? 700 : 400,
                    position: "relative",
                  }}
                >
                  {v.year}
                  {isNewest && (
                    <span style={{
                      position: "absolute", top: -6, right: -4,
                      background: COLORS.gold, color: "#fff",
                      fontSize: "0.5rem", borderRadius: 6, padding: "1px 4px", fontWeight: 700,
                    }}>NEW</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 14, flexWrap: "wrap", gap: 8 }}>
          <div>
            <span style={{ fontSize: "0.72rem", color: COLORS.textMuted }}>{t.from} </span>
            <span style={{ fontSize: "1.3rem", fontWeight: 800, color: COLORS.oliveDark }}>
              {selectedVersion?.price?.toFixed(2)}
            </span>
            <span style={{ fontSize: "0.8rem", color: COLORS.oliveMid, fontWeight: 600 }}> {t.jd}</span>
          </div>
          <button
            onClick={handleAdd}
            style={{
              background: btnBackground,
              color: "#fff",
              border: "none",
              padding: "9px 22px",
              borderRadius: 6,
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.25s",
              minWidth: 130,
            }}
          >
            {btnLabel}
          </button>
        </div>

      </div>
    </div>
  );
}

export default function Products() {
  const { lang }    = useContext(LanguageContext);
  const { farms, loading: farmsLoading }       = useFarms();
  const { products, loading: productsLoading } = useProducts();

  const t       = TEXT[lang];
  const loading = farmsLoading || productsLoading;

  const location         = useLocation();
  const initialFarmId    = location.state?.farmId ?? "";
  const [activeFarmId, setActiveFarmId] = useState(initialFarmId);

  const filtered = activeFarmId
    ? products.filter((p) => p.farmId?._id === activeFarmId)
    : products;

  return (
    <div style={{ background: COLORS.warmWhite, minHeight: "100vh" }}>

      <div style={{
        background: `linear-gradient(rgba(30,50,20,0.82), rgba(30,50,20,0.82)), url(${hero}) center/cover no-repeat`,
        padding: "70px 0 50px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 10 }}>
          ZAYTONA
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#fff", marginBottom: 14 }}>
          {t.pageTitle}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", maxWidth: 520, margin: "0 auto" }}>
          {t.pageSubtitle}
        </p>
      </div>

      <div className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>

        {!farmsLoading && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            marginBottom: 36, paddingBottom: 20,
            borderBottom: `1px solid ${COLORS.border}`,
          }}>
            <button
              onClick={() => setActiveFarmId("")}
              style={{
                fontSize: "0.78rem", padding: "7px 16px", borderRadius: 24,
                border: activeFarmId === "" ? `1.5px solid ${COLORS.oliveDark}` : `1px solid ${COLORS.border}`,
                background: activeFarmId === "" ? COLORS.oliveDark : "#fff",
                color: activeFarmId === "" ? "#fff" : COLORS.textMuted,
                cursor: "pointer", fontWeight: activeFarmId === "" ? 700 : 400,
                transition: "all 0.15s",
              }}
            >
              {t.filterAll}
            </button>

            {farms.map((f) => {
              const isActive = f._id === activeFarmId;
              return (
                <button
                  key={f._id}
                  onClick={() => setActiveFarmId(f._id)}
                  style={{
                    fontSize: "0.78rem", padding: "7px 16px", borderRadius: 24,
                    border: isActive ? `1.5px solid ${COLORS.oliveDark}` : `1px solid ${COLORS.border}`,
                    background: isActive ? COLORS.oliveDark : "#fff",
                    color: isActive ? "#fff" : COLORS.textMuted,
                    cursor: "pointer", fontWeight: isActive ? 700 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {lang === "en" ? f.nameEn : f.nameAr}
                </button>
              );
            })}
          </div>
        )}

        {loading && (
          <p style={{ textAlign: "center", color: COLORS.textMuted }}>{t.loading}</p>
        )}

        {!loading && (
          <p style={{ fontSize: "0.78rem", color: COLORS.textMuted, marginBottom: 20 }}>
            {t.productsFound(filtered.length)}
          </p>
        )}

        <div>
          {filtered.map((prod) => (
            <ProductCard
              key={prod._id}
              prod={prod}
              lang={lang}
              t={t}
            />
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <p style={{ textAlign: "center", color: COLORS.textMuted }}>{t.noResults}</p>
        )}

      </div>
    </div>
  );
}