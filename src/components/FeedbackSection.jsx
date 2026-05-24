// src/components/FeedbackSection.jsx
import { useState, useContext } from "react";
import { LanguageContext } from "../languages/LanguageContext";
import { useReviews, postReview, useFarms } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const COLORS = {
  oliveDark:   "#2c3d1f", oliveMid:   "#3d5a27", oliveLight: "#6b8f47",
  cream:       "#f5f0e8", warmWhite:  "#faf8f3", gold:       "#c8a84b",
  border:      "#e2d9c5", textDark:   "#1c2910", textMuted:  "#7a7a6e",
  danger:      "#b94a48", dangerHover:"#963b39"
};

const TEXT = {
  en: {
    sectionLabel:  "CUSTOMER REVIEWS",
    sectionTitle:  "What Our Customers Say",
    sectionSub:    "Verified reviews from people who ordered and tracked their olive oil through Zaytona.",
    formTitle:     "Leave a Review",
    selectFarm:    "Select a Farm",
    lblRating:     "Your Rating",
    lblComment:    "Your Review",
    submitBtn:     "Post Review",
    submitting:    "Posting...",
    successMsg:    "Your review has been posted — thank you!",
    loginPrompt:   "Sign in to leave a review",
    signInBtn:     "Sign In",
    filterAll:     "All",
    noReviews:     "No reviews yet. Be the first to share your experience!",
    loadingText:   "Loading reviews...",
    avgLabel:      (n) => `${n} review${n !== 1 ? "s" : ""}`,
    commentMin:    "Please write at least 20 characters.",
    selectFarmErr: "Please select a farm.",
    ratingErr:     "Please select a rating.",
    loginToReview: "You need to be signed in to post a review.",
    deleteBtn:     "Delete Review",
    deleteAdminBtn:"Delete Review (Admin)",
    deleting:      "Deleting...",
  },
  ar: {
    sectionLabel:  "آراء العملاء",
    sectionTitle:  "ماذا يقول عملاؤنا",
    sectionSub:    "آراء موثقة من عملاء طلبوا وتتبعوا زيت الزيتون عبر زيتونة.",
    formTitle:     "اترك تقييمك",
    selectFarm:    "اختر المزرعة",
    lblRating:     "تقييمك",
    lblComment:    "رأيك",
    submitBtn:     "نشر التقييم",
    submitting:    "جارٍ النشر...",
    successMsg:    "تم نشر تقييمك — شكراً لك!",
    loginPrompt:   "سجّل دخولك لترك تقييم",
    signInBtn:     "تسجيل الدخول",
    filterAll:     "الكل",
    noReviews:     "لا توجد تقييمات بعد. كن أول من يشارك تجربته!",
    loadingText:   "جارٍ تحميل التقييمات...",
    avgLabel:      (n) => `${n} تقييم`,
    commentMin:    "يرجى كتابة 20 حرفاً على الأقل.",
    selectFarmErr: "يرجى اختيار المزرعة.",
    ratingErr:     "يرجى اختيار تقييم.",
    loginToReview: "يجب تسجيل الدخول لنشر تقييم.",
    deleteBtn:     "حذف التقييم",
    deleteAdminBtn:"حذف التقييم (مسؤول)",
    deleting:      "جارٍ الحذف...",
  },
};

// ── shared micro-styles ───────────────────────────────────────
const labelStyle = {
  display: "block", fontSize: "0.7rem", fontWeight: 700,
  color: COLORS.textMuted, textTransform: "uppercase",
  letterSpacing: "1px", marginBottom: 5,
};

const inputStyle = {
  width: "100%", border: `1.5px solid ${COLORS.border}`, borderRadius: 7,
  padding: "9px 12px", fontSize: "0.86rem", color: COLORS.textDark,
  background: "#fff", outline: "none", fontFamily: "inherit",
  boxSizing: "border-box",
};

function tabStyle(active) {
  return {
    fontSize: "0.74rem", padding: "5px 14px", borderRadius: 20, cursor: "pointer",
    border: `1px solid ${active ? COLORS.oliveDark : COLORS.border}`,
    background: active ? COLORS.oliveDark : "#fff",
    color: active ? "#fff" : COLORS.textMuted,
    fontWeight: active ? 700 : 400, transition: "all 0.15s",
  };
}

function Stars({ count, size = 18, interactive = false, onSelect }) {
  return (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          onClick={() => interactive && onSelect?.(n)}
          style={{
            fontSize: size, lineHeight: 1,
            color: n <= count ? COLORS.gold : COLORS.border,
            cursor: interactive ? "pointer" : "default",
            transition: "color 0.1s",
            userSelect: "none",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function FeedbackSection() {
  const { lang }    = useContext(LanguageContext);
  const { user }    = useAuth(); // يفترض أن الأوبجكت يحتوي على user.isAdmin أو user.role
  const navigate    = useNavigate();
  const t           = TEXT[lang];
  const isRtl       = lang === "ar";

  const { farms }                         = useFarms();
  const { reviews, setReviews, loading }  = useReviews();

  const [form, setForm]             = useState({ farmId: "", rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");
  const [filter, setFilter]         = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  // فحص صلاحية الآدمين البرمجية في الفرونت إند
  const isUserAdmin = user && (user.isAdmin === true || user.role === "admin");

  const filtered = filter === "all"
    ? reviews
    : reviews.filter((r) => r.farmId?._id === filter);

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  async function handleSubmit() {
    setError("");
    if (!user)                           { setError(t.loginToReview); return; }
    if (!form.farmId)                    { setError(t.selectFarmErr); return; }
    if (!form.rating)                    { setError(t.ratingErr);     return; }

    setSubmitting(true);
    try {
      const { data } = await postReview(form);
      setReviews((prev) => [data, ...prev]);
      setForm({ farmId: "", rating: 0, comment: "" });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(reviewId) {
    const confirmMsg = isUserAdmin 
      ? (lang === "en" ? "Admin: Are you sure you want to delete this review?" : "مسؤول: هل أنت متأكد من حذف هذا التقييم؟")
      : (lang === "en" ? "Are you sure you want to delete your review?" : "هل أنت متأكد من رغبتك في حذف تقييمك؟");

    if (!window.confirm(confirmMsg)) return;

    setDeletingId(reviewId);
    try {
      const token = localStorage.getItem("token"); 
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete review.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section style={{ padding: "80px 0" }} dir={isRtl ? "rtl" : "ltr"}>
      <div className="container">

        {/* Section Header */}
        <p style={{
          fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase",
          color: COLORS.oliveLight, fontWeight: 700, marginBottom: 8,
        }}>
          {t.sectionLabel}
        </p>
        <h2 style={{
          fontFamily: "Georgia, serif", fontSize: "2rem",
          color: COLORS.textDark, marginBottom: 8,
        }}>
          {t.sectionTitle}
        </h2>
        <p style={{ fontSize: "0.83rem", color: COLORS.textMuted, marginBottom: 40, maxWidth: 540 }}>
          {t.sectionSub}
        </p>

        <div className="row g-4">
          {/* LEFT: Form */}
          <div className="col-lg-4">
            <div style={{
              background: "#fff", border: `1px solid ${COLORS.border}`,
              borderRadius: 10, padding: 24, position: "sticky", top: 80,
            }}>
              <h5 style={{
                fontFamily: "Georgia, serif", color: COLORS.oliveDark,
                marginBottom: 20, fontSize: "0.95rem", fontWeight: 700,
              }}>
                {t.formTitle}
              </h5>

              {!user && (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <p style={{ fontSize: "0.84rem", color: COLORS.textMuted, marginBottom: 14 }}>
                    🔒 {t.loginPrompt}
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    style={{
                      background: COLORS.oliveDark, color: "#fff", border: "none",
                      padding: "10px 24px", borderRadius: 7,
                      fontSize: "0.84rem", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    {t.signInBtn}
                  </button>
                </div>
              )}

              {user && (
                <>
                  {success && (
                    <div style={{
                      background: "#def7ec", color: "#057a55",
                      border: "1px solid #9de9c8", borderRadius: 8,
                      padding: "10px 14px", marginBottom: 16, fontSize: "0.8rem",
                    }}>
                      ✓ {t.successMsg}
                    </div>
                  )}

                  {error && (
                    <div style={{
                      background: "#fdf0f0", color: "#b94a48",
                      border: "1px solid #f5c6c6", borderRadius: 8,
                      padding: "10px 14px", marginBottom: 16, fontSize: "0.8rem",
                    }}>
                      ⚠️ {error}
                    </div>
                  )}

                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>{t.selectFarm}</label>
                    <select
                      value={form.farmId}
                      onChange={(e) => setForm({ ...form, farmId: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">—</option>
                      {farms.map((f) => (
                        <option key={f._id} value={f._id}>
                          {lang === "en" ? f.nameEn : f.nameAr}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <label style={labelStyle}>{t.lblRating}</label>
                    <Stars
                      count={form.rating}
                      size={28}
                      interactive
                      onSelect={(n) => setForm({ ...form, rating: n })}
                    />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <label style={labelStyle}>{t.lblComment}</label>
                    <textarea
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      rows={4}
                      placeholder={lang === "en" ? "Tell others about the quality..." : "أخبر الآخرين عن الجودة..."}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 90 }}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      width: "100%", background: submitting ? COLORS.oliveLight : COLORS.oliveDark,
                      color: "#fff", border: "none", padding: "11px",
                      borderRadius: 7, fontSize: "0.88rem", fontWeight: 600,
                      cursor: submitting ? "not-allowed" : "pointer",
                    }}
                  >
                    {submitting ? t.submitting : t.submitBtn}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: List */}
          <div className="col-lg-8">
            {avg && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 700, color: COLORS.oliveDark }}>
                  {avg}
                </span>
                <div>
                  <Stars count={Math.round(avg)} size={16} />
                  <span style={{ fontSize: "0.74rem", color: COLORS.textMuted }}>
                    {" · "}{t.avgLabel(reviews.length)}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${COLORS.border}` }}>
              <button onClick={() => setFilter("all")} style={tabStyle(filter === "all")}>
                {t.filterAll}
              </button>
              {farms.map((f) => (
                <button key={f._id} onClick={() => setFilter(f._id)} style={tabStyle(filter === f._id)}>
                  {lang === "en" ? f.nameEn : f.nameAr}
                </button>
              ))}
            </div>

            {loading && <p style={{ color: COLORS.textMuted, fontSize: "0.84rem" }}>{t.loadingText}</p>}

            {!loading && filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "48px 0", color: COLORS.textMuted }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🫙</div>
                <p style={{ fontSize: "0.88rem" }}>{t.noReviews}</p>
              </div>
            )}

            {filtered.map((r) => {
              // شرط العرض المحدث: يظهر الزرار إذا كان المستخدم هو الـ Admin أو إذا كان صاحب التقييم نفسه
              const canDelete = isUserAdmin || (user && (r.userId === user._id || r.name === (user.nameEn || user.nameAr)));

              return (
                <div
                  key={r._id}
                  style={{
                    background: "#fff", border: `1px solid ${COLORS.border}`,
                    borderRadius: 10, padding: "18px 20px", marginBottom: 12,
                    display: "flex", flexDirection: "column", gap: 8
                  }}
                >
                  {/* Farm Badge */}
                  <p style={{
                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "1px",
                    textTransform: "uppercase", color: COLORS.oliveLight, margin: 0,
                  }}>
                    🌿 {lang === "en" ? r.farmId?.nameEn : r.farmId?.nameAr}
                  </p>

                  {/* Top Row: User Meta & Stars */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
                    <div>
                      <div style={{ fontFamily: "Georgia, serif", fontSize: "0.95rem", color: COLORS.oliveDark, fontWeight: 600 }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: COLORS.textMuted }}>
                        {new Date(r.createdAt).toLocaleDateString(lang === "ar" ? "ar-JO" : "en-GB", { month: "long", year: "numeric" })}
                      </div>
                    </div>
                    <Stars count={r.rating} size={15} />
                  </div>

                  {/* Comment Text */}
                  <p style={{ fontSize: "0.84rem", color: COLORS.textMuted, lineHeight: 1.75, margin: "4px 0 0 0" }}>
                    {r.comment}
                  </p>

                  {/* كبسة الحذف بالأسفل بناءً على الشروط الجديدة */}
                  {canDelete && (
                    <div style={{ display: "flex", justifyContent: isRtl ? "flex-start" : "flex-end", marginTop: 4 }}>
                      <button
                        onClick={() => handleDelete(r._id)}
                        disabled={deletingId === r._id}
                        style={{
                          background: "none", border: "none", 
                          color: isUserAdmin && !(user && (r.userId === user._id || r.name === (user.nameEn || user.nameAr))) ? "#d32f2f" : COLORS.danger,
                          fontSize: "0.76rem", fontWeight: "600",
                          cursor: deletingId === r._id ? "not-allowed" : "pointer",
                          padding: "4px 0", textDecoration: "underline",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={(e) => e.target.style.color = COLORS.dangerHover}
                        onMouseLeave={(e) => e.target.style.color = COLORS.danger}
                      >
                        {deletingId === r._id 
                          ? t.deleting 
                          : (isUserAdmin && r.userId !== user._id ? `🗑️ ${t.deleteAdminBtn}` : `🗑️ ${t.deleteBtn}`)
                        }
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}