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

const PAYMENT_METHODS = [
  { id: "cash", iconEn: "💵", labelEn: "Cash on Delivery", labelAr: "الدفع عند الاستلام", descEn: "Pay when your order arrives",       descAr: "ادفع عند وصول الطلب"       },
  { id: "cliq", iconEn: "⚡", labelEn: "CliQ",             labelAr: "كليك",               descEn: "Instant bank transfer via CliQ",   descAr: "تحويل فوري عبر كليك"       },
  { id: "card", iconEn: "💳", labelEn: "Credit / Debit Card", labelAr: "بطاقة ائتمان / مدين", descEn: "Visa, Mastercard",            descAr: "فيزا، ماستركارد"            },
];

const SHIPPING_FEE = 3.00;
const TAX_FEE      = 2.60;

const TEXT = {
  en: {
    title: "Your Cart", subtitle: "Review your olive oil selection before checkout.",
    empty: "Your cart is empty.", browseCta: "Browse Products",
    remove: "Remove", subtotal: "Subtotal",
    shippingFee: "Delivery Fee", tax: "Tax",
    total: "Total", checkout: "Place Order", harvest: "Harvest",
    trackTitle: "Track Your Orders", trackSub: "View your recent orders and their status",
    trackPlaceholder: "Search by Order ID...", jd: "JOD",
    recentOrders: "Your Recent Orders",
    shippingTitle: "Delivery Information",
    phone: "Phone Number *", altPhone: "Alternative Phone",
    address: "Delivery Address *", deliveryDate: "Preferred Delivery Date *",
    suitableTime: "Suitable Delivery Time *",
    anytime:   "Anytime (09:00 AM – 06:00 PM)",
    morning:   "Morning (09:00 AM – 12:00 PM)",
    afternoon: "Afternoon (12:00 PM – 04:00 PM)",
    evening:   "Evening (04:00 PM – 07:00 PM)",
    processing: "Placing Order...",
    orderSuccess: "Order placed successfully! Scroll down to track it.",
    autoSaved: "✓ Auto-saved", orderSummary: "Order Summary", noOrders: "No orders yet.",
    paymentTitle: "Payment Method",
    cliqAlias: "CliQ Alias / IBAN *", cliqAliasPlaceholder: "e.g. yourname@bank",
    cardNumber: "Card Number *", cardExpiry: "Expiry Date *", cardCvv: "CVV *", cardName: "Name on Card *",
    cliqNote: "Enter your CliQ alias to confirm your transfer.",
    cashNote: "You will pay in cash when the order is delivered to your door.",
    cancelOrder: "Cancel", cancelConfirm: "Cancel this order?", cancelError: "Could not cancel the order.",
    paymentLabel: "Payment",
  },
  ar: {
    title: "سلة مشترياتك", subtitle: "راجع اختيارك من زيت الزيتون قبل إتمام الطلب.",
    empty: "سلتك فارغة.", browseCta: "تصفح المنتجات",
    remove: "حذف", subtotal: "المجموع الفرعي",
    shippingFee: "رسوم التوصيل", tax: "الضريبة",
    total: "الإجمالي", checkout: "تأكيد الطلب", harvest: "موسم",
    trackTitle: "تتبع طلباتك", trackSub: "اعرض طلباتك الأخيرة وحالتها",
    trackPlaceholder: "ابحث برقم الطلب...", jd: "دينار",
    recentOrders: "طلباتك الأخيرة",
    shippingTitle: "معلومات التوصيل",
    phone: "رقم الهاتف *", altPhone: "رقم بديل",
    address: "عنوان التوصيل *", deliveryDate: "تاريخ التوصيل المفضل *",
    suitableTime: "الوقت المناسب *",
    anytime:   "أي وقت (09:00 صباحاً – 06:00 مساءً)",
    morning:   "الصباح (09:00 – 12:00)",
    afternoon: "بعد الظهر (12:00 – 04:00)",
    evening:   "المساء (04:00 – 07:00)",
    processing: "جاري إرسال الطلب...",
    orderSuccess: "تم إرسال طلبك بنجاح! انتقل للأسفل لتتبعه.",
    autoSaved: "✓ يتم الحفظ تلقائياً", orderSummary: "ملخص الطلب", noOrders: "لا توجد طلبات بعد.",
    paymentTitle: "طريقة الدفع",
    cliqAlias: "رقم كليك / IBAN *", cliqAliasPlaceholder: "مثال: yourname@bank",
    cardNumber: "رقم البطاقة *", cardExpiry: "تاريخ الانتهاء *", cardCvv: "CVV *", cardName: "الاسم على البطاقة *",
    cliqNote: "أدخل رقم كليك الخاص بك لتأكيد التحويل.",
    cashNote: "ستدفع نقداً عند استلام الطلب على بابك.",
    cancelOrder: "إلغاء", cancelConfirm: "هل تريد إلغاء هذا الطلب؟", cancelError: "تعذّر إلغاء الطلب.",
    paymentLabel: "طريقة الدفع",
  },
};

const DELIVERY_KEY = "zaytona_delivery_info";
const PAYMENT_KEY  = "zaytona_payment_info";

/* ── StatusPill ── */
function StatusPill({ status }) {
  const s = STATUS_STYLE[status?.toLowerCase()] || { bg: "#fdf6b2", color: "#9f580a", label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, display: "inline-block" }}>
      {s.label}
    </span>
  );
}

/* ── TrackingSection ── */
function TrackingSection({ t, isRTL, trackingRef, highlightId }) {
  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [query, setQuery]           = useState("");
  const [cancelling, setCancelling] = useState(null);

  function fetchOrders() {
    setLoading(true);
    api.get("/orders/my")
      .then(r => { setOrders(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }
  useEffect(() => { fetchOrders(); }, [highlightId]);

  async function cancelOrder(orderId) {
    if (!window.confirm(t.cancelConfirm)) return;
    setCancelling(orderId);
    try {
      await api.put(`/orders/${orderId}/cancel`);
      fetchOrders();
    } catch {
      alert(t.cancelError);
    } finally {
      setCancelling(null);
    }
  }

  const filtered = query.trim()
    ? orders.filter(o => o._id.toLowerCase().includes(query.toLowerCase()))
    : orders;

  return (
    <div ref={trackingRef} style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
      <div style={{ background: COLORS.oliveDark, padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: "1.1rem" }}>📍</span>
        <div>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>{t.trackTitle}</div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{t.trackSub}</div>
        </div>
      </div>
      <div style={{ padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={t.trackPlaceholder}
            style={{ flex: 1, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "9px 14px", fontSize: "0.85rem", outline: "none", color: COLORS.textDark, background: COLORS.warmWhite }} />
          <button onClick={fetchOrders} style={{ background: COLORS.oliveMid, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>↻</button>
        </div>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, color: COLORS.textMuted, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 10 }}>{t.recentOrders}</div>
        {loading ? (
          <p style={{ color: COLORS.textMuted, fontSize: "0.82rem", textAlign: "center", padding: 20 }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: COLORS.textMuted, fontSize: "0.82rem", textAlign: "center", padding: 20 }}>{t.noOrders}</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${COLORS.border}` }}>
                  {["Order ID", "Items", "Total", "Status", ""].map((h, i) => (
                    <th key={i} style={{ textAlign: isRTL ? "right" : "left", padding: "6px 10px", color: COLORS.textMuted, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const isNew        = order._id === highlightId;
                  const isPending    = order.status?.toLowerCase() === "pending";
                  const isCancelling = cancelling === order._id;
                  const itemCount    = order.items?.reduce((s, i) => s + i.qty, 0) || 0;
                  const total        = order.items?.reduce((s, i) => s + i.price * i.qty, 0) || 0;
                  return (
                    <tr key={order._id} style={{ borderBottom: `1px solid ${COLORS.border}`, background: isNew ? "#f0fdf4" : "transparent", transition: "background 0.3s" }}>
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: COLORS.oliveDark, fontFamily: "monospace" }}>
                        #{order._id.slice(-8).toUpperCase()}
                        {isNew && <span style={{ marginLeft: 6, fontSize: "0.6rem", background: COLORS.oliveLight, color: "#fff", padding: "1px 6px", borderRadius: 10, fontFamily: "sans-serif" }}>NEW</span>}
                      </td>
                      <td style={{ padding: "10px 10px", color: COLORS.textMuted }}>{itemCount} {isRTL ? "منتج" : "item(s)"}</td>
                      <td style={{ padding: "10px 10px", fontWeight: 700, color: COLORS.textDark }}>{total.toFixed(2)} {isRTL ? "د.أ" : "JOD"}</td>
                      <td style={{ padding: "10px 10px" }}><StatusPill status={order.status} /></td>
                      <td style={{ padding: "10px 10px" }}>
                        {isPending && (
                          <button onClick={() => cancelOrder(order._id)} disabled={isCancelling}
                            style={{ background: "none", border: "1px solid #c0392b", color: "#c0392b", borderRadius: 6, padding: "3px 10px", fontSize: "0.68rem", fontWeight: 700, cursor: isCancelling ? "not-allowed" : "pointer", opacity: isCancelling ? 0.5 : 1, whiteSpace: "nowrap" }}>
                            {isCancelling ? "..." : t.cancelOrder}
                          </button>
                        )}
                      </td>
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

/* ── PaymentSection ── */
function PaymentSection({ t, isRTL, paymentInfo, setPaymentInfo }) {
  const { method, cliqAlias, cardNumber, cardExpiry, cardCvv, cardName } = paymentInfo;
  function set(field, value) { setPaymentInfo(prev => ({ ...prev, [field]: value })); }
  function handleCardNumber(val) {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    set("cardNumber", digits.match(/.{1,4}/g)?.join(" ") || digits);
  }
  function handleExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    set("cardExpiry", digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits);
  }

  return (
    <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18, height: "100%", boxSizing: "border-box" }}>
      <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.9rem", color: COLORS.oliveDark, marginBottom: 14, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 8 }}>
        💳 {t.paymentTitle}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        {PAYMENT_METHODS.map(pm => {
          const isSelected = method === pm.id;
          return (
            <button key={pm.id} onClick={() => set("method", pm.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 9, border: isSelected ? `2px solid ${COLORS.oliveDark}` : `1.5px solid ${COLORS.border}`, background: isSelected ? "#f4f8f0" : "#fff", cursor: "pointer", textAlign: isRTL ? "right" : "left", transition: "border .15s, background .15s", width: "100%" }}>
              <span style={{ width: 16, height: 16, borderRadius: "50%", flexShrink: 0, border: `2px solid ${isSelected ? COLORS.oliveDark : COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {isSelected && <span style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.oliveDark, display: "block" }} />}
              </span>
              <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{pm.iconEn}</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontWeight: 700, fontSize: "0.82rem", color: COLORS.textDark }}>{isRTL ? pm.labelAr : pm.labelEn}</span>
                <span style={{ fontSize: "0.72rem", color: COLORS.textMuted }}>{isRTL ? pm.descAr : pm.descEn}</span>
              </span>
            </button>
          );
        })}
      </div>
      {method === "cash" && (
        <div style={{ background: "#f4f8f0", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "10px 14px", fontSize: "0.78rem", color: COLORS.oliveDark, lineHeight: 1.6 }}>
          💵 {t.cashNote}
        </div>
      )}
      {method === "cliq" && (
        <div>
          <p style={{ fontSize: "0.75rem", color: COLORS.textMuted, marginBottom: 10, lineHeight: 1.6 }}>⚡ {t.cliqNote}</p>
          <label style={labelStyle}>{t.cliqAlias}</label>
          <input style={inputStyle} placeholder={t.cliqAliasPlaceholder} value={cliqAlias} onChange={e => set("cliqAlias", e.target.value)} />
        </div>
      )}
      {method === "card" && (
        <div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>{t.cardName}</label>
            <input style={inputStyle} placeholder="John Doe" value={cardName} onChange={e => set("cardName", e.target.value)} />
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={labelStyle}>{t.cardNumber}</label>
            <input style={{ ...inputStyle, fontFamily: "monospace", letterSpacing: "0.1em" }} placeholder="1234 5678 9012 3456" value={cardNumber} onChange={e => handleCardNumber(e.target.value)} inputMode="numeric" />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={labelStyle}>{t.cardExpiry}</label>
              <input style={{ ...inputStyle, fontFamily: "monospace" }} placeholder="MM/YY" value={cardExpiry} onChange={e => handleExpiry(e.target.value)} inputMode="numeric" />
            </div>
            <div>
              <label style={labelStyle}>{t.cardCvv}</label>
              <input style={{ ...inputStyle, fontFamily: "monospace" }} placeholder="123" value={cardCvv} onChange={e => set("cardCvv", e.target.value.replace(/\D/g,"").slice(0,4))} inputMode="numeric" type="password" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ Main Cart ══ */
export default function Cart() {
  const { lang } = useContext(LanguageContext);
  const { items, removeFromCart, updateQty, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const t        = TEXT[lang];
  const isRTL    = lang === "ar";

  const trackingRef                     = useRef(null);
  const [lastOrderId, setLastOrderId]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [deliveryInfo, setDeliveryInfo] = useState(() => {
    try {
      const saved = localStorage.getItem(DELIVERY_KEY);
      return saved ? JSON.parse(saved) : { phone: "", altPhone: "", address: "", deliveryDate: "", suitableTime: "Anytime" };
    } catch { return { phone: "", altPhone: "", address: "", deliveryDate: "", suitableTime: "Anytime" }; }
  });
  useEffect(() => { localStorage.setItem(DELIVERY_KEY, JSON.stringify(deliveryInfo)); }, [deliveryInfo]);

  const [paymentInfo, setPaymentInfo] = useState(() => {
    try {
      const saved  = localStorage.getItem(PAYMENT_KEY);
      const parsed = saved ? JSON.parse(saved) : {};
      return { method: parsed.method || "cash", cliqAlias: parsed.cliqAlias || "", cardNumber: "", cardExpiry: "", cardCvv: "", cardName: parsed.cardName || "" };
    } catch { return { method: "cash", cliqAlias: "", cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "" }; }
  });
  useEffect(() => {
    const { method, cliqAlias, cardName } = paymentInfo;
    localStorage.setItem(PAYMENT_KEY, JSON.stringify({ method, cliqAlias, cardName }));
  }, [paymentInfo]);

  function updateField(field, value) { setDeliveryInfo(prev => ({ ...prev, [field]: value })); }

  const grandTotal = totalPrice + SHIPPING_FEE + TAX_FEE;

  async function handleCheckout() {
    const { phone, address, deliveryDate } = deliveryInfo;
    if (!phone.trim() || !address.trim() || !deliveryDate) {
      alert(isRTL ? "يرجى تعبئة الحقول المطلوبة!" : "Please fill in all required fields.");
      return;
    }
    if (paymentInfo.method === "cliq" && !paymentInfo.cliqAlias.trim()) {
      alert(isRTL ? "يرجى إدخال رقم كليك." : "Please enter your CliQ alias.");
      return;
    }
    if (paymentInfo.method === "card" && (!paymentInfo.cardName.trim() || !paymentInfo.cardNumber.trim() || !paymentInfo.cardExpiry.trim() || !paymentInfo.cardCvv.trim())) {
      alert(isRTL ? "يرجى تعبئة جميع بيانات البطاقة." : "Please fill in all card details.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        items: items.map(i => ({ productId: i.product._id || i.product.id, year: Number(i.version.year), qty: Number(i.qty), price: Number(i.version.price) })),
        status: "pending",
        paymentMethod: paymentInfo.method,
        deliveryStatus: `Address: ${address} | Phone: ${phone} | AltPhone: ${deliveryInfo.altPhone || "N/A"} | Date: ${deliveryDate} | Time: ${deliveryInfo.suitableTime} | Payment: ${paymentInfo.method} | Total: ${grandTotal.toFixed(2)} JOD`,
      };
      const res = await api.post("/orders", payload);
      clearCart();
      setOrderSuccess(true);
      setLastOrderId(res.data._id);
      setTimeout(() => { trackingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 400);
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

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Success */}
        {orderSuccess && (
          <div style={{ background: "#def7ec", border: "1px solid #057a55", borderRadius: 10, padding: "14px 20px", marginBottom: 24, fontSize: "0.88rem", color: "#057a55", fontWeight: 600 }}>
            ✅ {t.orderSuccess}
          </div>
        )}

        {/* Empty */}
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
          <>
            {/* ── ROW 1: Cart items (full width) ── */}
            <div style={{ marginBottom: 24 }}>
              {items.map(({ product, version, qty }) => {
                const img  = getProductImg(product);
                const name = product.nameEn || product.name || "";
                const farm = product.farmId?.nameEn || product.farm || "";
                const size = product.sizeL || product.size || "";
                return (
                  <div key={`${product._id || product.id}-${version.year}`} style={{ display: "flex", gap: 14, background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 12, overflow: "hidden", marginBottom: 12 }}>
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

            {/* ── ROW 2: Delivery | Payment جنب بعض (50/50) ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

              {/* Delivery */}
              <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 18 }}>
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
                    <label style={labelStyle}>{label}</label>
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
                  <label style={labelStyle}>{t.suitableTime}</label>
                  <select style={inputStyle} value={deliveryInfo.suitableTime} onChange={e => updateField("suitableTime", e.target.value)}>
                    <option value="Anytime">{t.anytime}</option>
                    <option value="Morning">{t.morning}</option>
                    <option value="Afternoon">{t.afternoon}</option>
                    <option value="Evening">{t.evening}</option>
                  </select>
                </div>
              </div>

              {/* Payment */}
              <PaymentSection t={t} isRTL={isRTL} paymentInfo={paymentInfo} setPaymentInfo={setPaymentInfo} />

            </div>

            {/* ── ROW 3: Order Summary — نفس عرض الاثنين فوق ── */}
            <div style={{ background: "#fff", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: "20px 24px" }}>

              <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "0.95rem", color: COLORS.oliveDark, marginBottom: 16, borderBottom: `1px solid ${COLORS.border}`, paddingBottom: 10 }}>
                {t.orderSummary}
              </div>

              {/* الأرقام في صف واحد */}
              <div style={{ display: "flex", gap: 0, marginBottom: 16, background: COLORS.warmWhite, borderRadius: 10, border: `1px solid ${COLORS.border}`, overflow: "hidden" }}>
                {[
                  { label: t.subtotal,    value: `${totalPrice.toFixed(2)} ${t.jd}`,      icon: "🛒" },
                  { label: t.shippingFee, value: `${SHIPPING_FEE.toFixed(2)} ${t.jd}`,    icon: "🚚" },
                  { label: t.tax,         value: `${TAX_FEE.toFixed(2)} ${t.jd}`,         icon: "🧾" },
                  { label: t.paymentLabel, value: PAYMENT_METHODS.find(m => m.id === paymentInfo.method)?.[isRTL ? "labelAr" : "labelEn"] || "", icon: "💳" },
                ].map((item, i, arr) => (
                  <div key={i} style={{
                    flex: 1, padding: "14px 16px",
                    borderRight: i < arr.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: "1rem", marginBottom: 4 }}>{item.icon}</div>
                    <div style={{ fontSize: "0.68rem", color: COLORS.textMuted, fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: COLORS.textDark }}>{item.value}</div>
                  </div>
                ))}
              </div>

              {/* Total + Button */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: "0.88rem", color: COLORS.textMuted, fontWeight: 600 }}>{t.total}</span>
                  <span style={{ fontSize: "1.8rem", fontWeight: 800, color: COLORS.oliveDark, lineHeight: 1 }}>
                    {grandTotal.toFixed(2)}
                  </span>
                  <span style={{ fontSize: "0.9rem", color: COLORS.oliveMid, fontWeight: 700 }}>{t.jd}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", color: "#7a5c2e", background: COLORS.goldLight, border: `1px solid ${COLORS.gold}44`, borderRadius: 8, padding: "7px 12px" }}>
                    🫒 {isRTL ? "معصور بالبرد · شحن خلال 48 ساعة" : "Cold-pressed · Ships within 48 hours"}
                  </span>
                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    style={{
                      background: COLORS.oliveDark, color: "#fff", border: "none",
                      borderRadius: 8, padding: "13px 44px",
                      fontSize: "0.95rem", fontWeight: 700,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting ? 0.7 : 1,
                      transition: "opacity .15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {isSubmitting ? t.processing : `${t.checkout} →`}
                  </button>
                </div>
              </div>

            </div>
          </>
        )}

        {/* Tracking */}
        <div style={{ marginTop: 48 }}>
          <TrackingSection t={t} isRTL={isRTL} trackingRef={trackingRef} highlightId={lastOrderId} />
        </div>
      </div>
    </div>
  );
}

const qtyBtn = {
  width: 28, height: 28, borderRadius: "50%",
  border: "1px solid #e2d9c5", background: "#fff",
  color: "#2c3d1f", fontWeight: 700, fontSize: "1rem",
  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
};

const inputStyle = {
  width: "100%", padding: "7px 10px", fontSize: "0.82rem",
  borderRadius: 6, border: "1px solid #e2d9c5",
  outline: "none", background: "#faf8f3", color: "#1c2910",
  fontFamily: "inherit", boxSizing: "border-box",
};

const labelStyle = {
  display: "block", fontSize: "0.75rem", fontWeight: 600,
  marginBottom: 4, color: "#1c2910",
};