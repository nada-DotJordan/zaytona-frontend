import { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { LanguageContext } from "../languages/LanguageContext";
import api from "../api/api";
import hero from "../assets/hero.jpg";

import Baraka from "../assets/Baraka.png";
import GVF   from "../assets/GVF.png";
import tal   from "../assets/tal.png";
import HOF   from "../assets/hof.png";
import jabal from "../assets/jabal.jpg";
import b     from "../assets/b.jpg";
import rawda from "../assets/rawda.jpg";
import p     from "../assets/p.jpg";

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

function getProductImg(product) {
  const farmNameEn = product.farmId?.nameEn || product.farm || "";
  return IMG_MAP[farmNameEn] || Baraka;
}

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

const STATUS_STYLE = {
  "pending":   { bg: "#fdf6b2", color: "#9f580a", label: "Pending"   },
  "confirmed": { bg: "#e1f5fe", color: "#0288d1", label: "Confirmed" },
  "shipped":   { bg: "#e8f0fe", color: "#1a56db", label: "Shipped"   },
  "delivered": { bg: "#def7ec", color: "#057a55", label: "Delivered" },
  "cancelled": { bg: "#fce8e8", color: "#b54a4a", label: "Cancelled" },
};

const TEXT = {
  en: {
    title: "Your Cart", subtitle: "Review your olive oil selection before checkout.",
    empty: "Your cart is empty.", browseCta: "Browse Products",
    remove: "Remove", subtotal: "Subtotal", shipping: "Shipping",
    free: "Free", total: "Total", checkout: "Place Order", harvest: "Harvest",
    trackTitle: "Track Your Orders", trackSub: "View your recent orders and their status",
    trackPlaceholder: "Search by Order ID...", trackBtn: "Search",
    notFound: "No order found for", jd: "JOD",
    recentOrders: "Your Recent Orders",
    shippingTitle: "Delivery Information",
    phone: "Phone Number *", altPhone: "Alternative Phone",
    address: "Delivery Address *", deliveryDate: "Preferred Delivery Date *",
    suitableTime: "Suitable Delivery Time *",
    anytime: "Anytime (09:00 AM – 06:00 PM)",
    morning: "Morning (09:00 AM – 12:00 PM)",
    afternoon: "Afternoon (12:00 PM – 04:00 PM)",
    evening: "Evening (04:00 PM – 07:00 PM)",
    processing: "Placing Order...",
    orderSuccess: "Order placed successfully! Scroll down to track it.",
    autoSaved: "✓ Auto-saved",
    orderSummary: "Order Summary",
    noOrders: "No orders yet.",
  },
  ar: {
    title: "سلة مشترياتك", subtitle: "راجع اختيارك من زيت الزيتون قبل إتمام الطلب.",
    empty: "سلتك فارغة.", browseCta: "تصفح المنتجات",
    remove: "حذف", subtotal: "المجموع الفرعي", shipping: "الشحن",
    free: "مجاني", total: "الإجمالي", checkout: "تأكيد الطلب", harvest: "موسم",
    trackTitle: "تتبع طلباتك", trackSub: "اعرض طلباتك الأخيرة وحالتها",
    trackPlaceholder: "ابحث برقم الطلب...", trackBtn: "بحث",
    notFound: "لم يُعثر على طلب بالرقم", jd: "دينار",
    recentOrders: "طلباتك الأخيرة",
    shippingTitle: "معلومات التوصيل",
    phone: "رقم الهاتف *", altPhone: "رقم بديل",
    address: "عنوان التوصيل *", deliveryDate: "تاريخ التوصيل المفضل *",
    suitableTime: "الوقت المناسب *",
    anytime: "أي وقت (09:00 صباحاً – 06:00 مساءً)",
    morning: "الصباح (09:00 – 12:00)",
    afternoon: "بعد الظهر (12:00 – 04:00)",
    evening: "المساء (04:00 – 07:00)",
    processing: "جاري إرسال الطلب...",
    orderSuccess: "تم إرسال طلبك بنجاح! انتقل للأسفل لتتبعه.",
    autoSaved: "✓ يتم الحفظ تلقائياً",
    orderSummary: "ملخص الطلب",
    noOrders: "لا توجد طلبات بعد.",
  },
};

const DELIVERY_KEY = "zaytona_delivery_info";

function StatusPill({ status }) {
  const s = STATUS_STYLE[status?.toLowerCase()] || { bg: "#fdf6b2", color: "#9f580a", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "inline-block" }}>
      {s.label}
    </span>
  );
}

function TrackingSection({ t, isRTL, trackingRef, highlightId }) {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery]     = useState("");

  function fetchOrders() {
    setLoading(true);
    api.get("/orders/my")
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }

  useEffect(() => { fetchOrders(); }, [highlightId]); 

  const filtered = query.trim()
    ? orders.filter(o => o._id.toLowerCase().includes(query.toLowerCase()))
    : orders;

  return (
    <div ref={trackingRef} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ background: COLORS.oliveDark, padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "1.1rem" }}>📍</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{t.trackTitle}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{t.trackSub}</div>
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t.trackPlaceholder}
            style={{ flex: 1, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 14px", fontSize: "0.85rem", outline: "none", color: COLORS.textDark, background: COLORS.warmWhite }}
          />
          <button onClick={fetchOrders} style={{ background: COLORS.oliveMid, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>
            ↻
          </button>
        </div>

        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: COLORS.textMuted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>
          {t.recentOrders}
        </div>

        {loading ? (
          <p style={{ color: COLORS.textMuted, fontSize: "0.82rem", textAlign: "center", padding: 20 }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: COLORS.textMuted, fontSize: "0.82rem", textAlign: "center", padding: 20 }}>{t.noOrders}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  {["Order ID", "Items", "Total", "Status"].map(h => (
                    <th key={h} style={{ textAlign: isRTL ? "right" : "left", padding: "6px 10px", color: COLORS.textMuted, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const isNew = order._id === highlightId;
                  const itemCount = order.items?.reduce((s, i) => s + i.qty, 0) || 0;
                  const total = order.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;
                  return (
                    <tr key={order._id}
                      style={{
                        borderBottom: `1px solid ${COLORS.border}`,
                        background: isNew ? "#f0fdf4" : "transparent",
                        transition: "background 0.3s",
                      }}
                    >
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: COLORS.oliveDark, fontFamily: "monospace" }}>
                        #{order._id.slice(-8).toUpperCase()}
                        {isNew && <span style={{ marginLeft: 6, fontSize: "0.6rem", background: COLORS.oliveLight, color: "#fff", padding: "1px 6px", borderRadius: 10, fontFamily: "sans-serif" }}>NEW</span>}
                      </td>
                      <td style={{ padding: "10px 10px", color: COLORS.textMuted }}>{itemCount} {isRTL ? "منتج" : "item(s)"}</td>
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: COLORS.textDark }}>{total.toFixed(2)} {isRTL ? "د.أ" : "JOD"}</td>
                      <td style={{ padding: "10px 10px" }}><StatusPill status={order.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Cart() {
  const { lang }   = useContext(LanguageContext);
  const { items, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const navigate   = useNavigate();
  const t          = TEXT[lang];
  const isRTL      = lang === "ar";

  const trackingRef   = useRef(null);
  const [lastOrderId, setLastOrderId]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(DELIVERY_KEY);
      return saved ? JSON.parse(saved) : { phone: "", altPhone: "", address: "", deliveryDate: "", suitableTime: "Anytime" };
    } catch { return { phone: "", altPhone: "", address: "", deliveryDate: "", suitableTime: "Anytime" }; }
  });

  useEffect(() => {
    localStorage.setItem(DELIVERY_KEY, JSON.stringify(deliveryInfo));
  }, [deliveryInfo]);

  function updateField(field, value) {
    setDeliveryInfo(prev => ({ ...prev, [field]: value }));
  }

  async function handleCheckout() {
    const { phone, address, deliveryDate } = deliveryInfo;
    if (!phone.trim() || !address.trim() || !deliveryDate) {
      alert(isRTL ? "يرجى تعبئة الحقول المطلوبة!" : "Please fill in all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        items: items.map(i => ({
          productId: i.product._id || i.product.id,
          year:  Number(i.version.year),
          qty:   Number(i.qty),
          price: Number(i.version.price),
        })),
        status: "pending",
        deliveryStatus: `Address: ${address} | Phone: ${phone} | AltPhone: ${deliveryInfo.altPhone || "N/A"} | Date: ${deliveryDate} | Time: ${deliveryInfo.suitableTime}`,
      };

      const res = await api.post("/orders", payload);
      const newId = res.data._id;

      clearCart();
      setOrderSuccess(true);
      setLastOrderId(newId);

      setTimeout(() => {
        trackingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);

    } catch (err) {
      alert(err.response?.data?.message || (isRTL ? "حدث خطأ." : "Something went wrong."));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div style={{ background: COLORS.warmWhite, minHeight: "100vh" }} dir={isRTL ? "rtl" : "ltr"}>

      {/* HERO */}
      <div style={{ background: `linear-gradient(rgba(30,50,20,0.82), rgba(30,50,20,0.82)), url(${hero}) center/cover no-repeat`, padding: "70px 0 50px", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 10 }}>ZAYTONA</p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#fff", marginBottom: 14 }}>{t.title}</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", maxWidth: 520, margin: "0 auto" }}>{t.subtitle}</p>
      </div>

      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 80px" }}>

        {orderSuccess && (
          <div style={{ background: "#def7ec", border: "1px solid #057a55", borderRadius: 10, padding: "14px 20px", marginBottom: 24, fontSize: "0.88rem", color: "#057a55", fontWeight: 600 }}>
            ✅ {t.orderSuccess}
          </div>
        )}

        {items.length === 0 && !orderSuccess && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🫙</div>
            <p style={{ color: COLORS.textMuted, fontSize: "1rem", marginBottom: 24 }}>{t.empty}</p>
            <button onClick={() => navigate("/Products")} style={{ background: COLORS.oliveDark, color: "#fff", border: "none", borderRadius: 8, padding: "11px 28px", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}>
              {t.browseCta}
            </button>
          </div>
        )}

        {items.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>

            <div>
              {items.map(({ product, version, qty }) => {
                const img  = getProductImg(product); // 
                const name = product.nameEn || product.name || "";
                const farm = product.farmId?.nameEn || product.farm || "";
                const size = product.sizeL || product.size || "";
                return (
                  <div key={`${product._id || product.id}-${version.year}`} style={{ display: "flex", gap: 14, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
                    <img src={img} alt={name} style={{ width: 110, height: 110, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: "12px 14px 12px 0", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: "0.68rem", color: COLORS.oliveLight, fontWeight: 700, textTransform: "uppercase" }}>🌿 {farm}</div>
                        <div style={{ fontFamily: "Georgia, serif", fontWeight: 600, fontSize: "0.95rem", color: COLORS.textDark, marginTop: 3 }}>{name}</div>
                        <div style={{ fontSize: "0.72rem", color: COLORS.textMuted, marginTop: 2 }}>{size} · {t.harvest} {version.year}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => updateQty(product._id || product.id, version.year, qty - 1)} style={qtyBtn}>−</button>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, minWidth: 20, textAlign: "center" }}>{qty}</span>
                          <button onClick={() => updateQty(product._id || product.id, version.year, qty + 1)} style={qtyBtn}>+</button>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <span style={{ fontWeight: 800, fontSize: "1.05rem", color: COLORS.oliveDark }}>
                            {(version.price * qty).toFixed(2)} <span style={{ fontSize: "0.75rem", fontWeight: 500 }}>{t.jd}</span>
                          </span>
                          <button onClick={() => removeFromCart(product._id || product.id, version.year)} style={{ background: "none", border: "none", color: "#c0392b", fontSize: "0.72rem", cursor: "pointer", fontWeight: 600 }}>
                            ✕ {t.remove}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ position: "sticky", top: 20 }}>

              <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18, marginBottom: 16 }}>
                <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.9rem", color: COLORS.oliveDark, marginBottom: 12, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>📋 {t.shippingTitle}</span>
                  <span style={{ fontSize: "0.65rem", color: COLORS.oliveLight, fontWeight: 500 }}>{t.autoSaved}</span>
                </div>

                {[
                  { label: t.phone,        field: "phone",        type: "tel",      placeholder: "079XXXXXXXX" },
                  { label: t.altPhone,     field: "altPhone",     type: "tel",      placeholder: isRTL ? "اختياري" : "Optional" },
                  { label: t.address,      field: "address",      type: "textarea", placeholder: isRTL ? "المدينة، الحي، الشارع..." : "City, Area, Street..." },
                  { label: t.deliveryDate, field: "deliveryDate", type: "date",     placeholder: "" },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} style={{ marginBottom: 10 }}>
                    <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: 4, color: COLORS.textDark }}>{label}</label>
                    {type === "textarea" ? (
                      <textarea rows={2} style={inputStyle} placeholder={placeholder} value={deliveryInfo[field]} onChange={e => updateField(field, e.target.value)} />
                    ) : (
                      <input type={type} style={inputStyle} placeholder={placeholder}
                        min={type === "date" ? new Date().toISOString().split("T")[0] : undefined}
                        value={deliveryInfo[field]} onChange={e => updateField(field, e.target.value)} />
                    )}
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, marginBottom: 4, color: COLORS.textDark }}>{t.suitableTime}</label>
                  <select style={inputStyle} value={deliveryInfo.suitableTime} onChange={e => updateField("suitableTime", e.target.value)}>
                    <option value="Anytime">{t.anytime}</option>
                    <option value="Morning">{t.morning}</option>
                    <option value="Afternoon">{t.afternoon}</option>
                    <option value="Evening">{t.evening}</option>
                  </select>
                </div>
              </div>

              <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 22, marginBottom: 16 }}>
                <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1rem", color: COLORS.oliveDark, marginBottom: 14, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 10 }}>
                  {t.orderSummary}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: COLORS.textMuted, marginBottom: 10 }}>
                  <span>{t.subtotal}</span><span style={{ color: COLORS.textDark, fontWeight: 500 }}>{totalPrice.toFixed(2)} {t.jd}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: COLORS.textMuted, marginBottom: 10 }}>
                  <span>{t.shipping}</span><span style={{ color: COLORS.textDark, fontWeight: 500 }}>{t.free}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginTop: 4, fontWeight: 800, fontSize: "1rem", color: COLORS.oliveDark }}>
                  <span>{t.total}</span><span>{totalPrice.toFixed(2)} {t.jd}</span>
                </div>
                <button onClick={handleCheckout} disabled={isSubmitting} style={{
                  width: "100%", marginTop: 18, background: COLORS.oliveDark, color: "#fff",
                  border: "none", borderRadius: 8, padding: "12px", fontSize: "0.9rem",
                  fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1,
                }}>
                  {isSubmitting ? t.processing : `${t.checkout} →`}
                </button>
              </div>

              <div style={{ background: COLORS.goldLight, border: `1px solid ${COLORS.gold}44`, borderRadius: 10, padding: "12px 16px", fontSize: "0.75rem", color: "#7a5c2e", lineHeight: 1.6 }}>
                🫒 {isRTL ? "جميع الزيوت معصورة بالبرد وتُشحن خلال 48 ساعة." : "All oils are cold-pressed and shipped within 48 hours of your order."}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 48 }}>
          <TrackingSection t={t} isRTL={isRTL} trackingRef={trackingRef} highlightId={lastOrderId} />
        </div>
      </div>
    </div>
  );
}

const qtyBtn = {
  width: 28, height: 28, borderRadius: "50%",
  border: `1px solid #e2d9c5`, background: "#fff",
  color: "#2c3d1f", fontWeight: 700, fontSize: "1rem",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
};

const inputStyle = {
  width: "100%", padding: "7px 10px", fontSize: "0.82rem",
  borderRadius: 6, border: `1px solid #e2d9c5`,
  outline: "none", background: "#faf8f3", color: "#1c2910",
  fontFamily: "inherit", boxSizing: "border-box",
};