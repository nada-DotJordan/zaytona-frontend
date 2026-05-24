// src/admin/pages/AdminReviews.jsx
import { useState, useEffect } from "react";
import { COLORS } from "../styles/colors";
import { GoldLine, MetricCard } from "../components/ui/Primitives";
import api from "../../api/api"; // الـ axios instance تبعك

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // 1. جلب التقييمات الحقيقية من السيرفر فور تحميل الصفحة
  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await api.get("/reviews"); // نفس الـ route اللي بيجيب كل التقييمات
        setReviews(res.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  // 2. دالة الحذف الخاصة بالمسؤول (Admin Delete)
  async function handleDelete(id) {
    if (!window.confirm("Admin: Are you sure you want to permanently delete this review?")) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to delete review.");
      console.error(err);
    }
  }

  // 3. فلترة التقييمات بناءً على البحث (باسم المستخدم أو اسم المزرعة أو نص التعليق)
  const filtered = reviews.filter((r) => {
    const username = (r.name || "").toLowerCase();
    const comment = (r.comment || "").toLowerCase();
    const farmName = (r.farmId?.nameEn || r.farmId?.nameAr || "").toLowerCase();
    const query = search.toLowerCase();

    return username.includes(query) || comment.includes(query) || farmName.includes(query);
  });

  // حساب الحسبية للإحصائيات السريعة فوق
  const totalReviews = reviews.length;
  const avgRating = totalReviews 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) 
    : "0.0";

  return (
    <div>
      <GoldLine />

      {/* ── KPI METRICS ── */}
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <MetricCard icon="bi-chat-left-text-fill" label="Total Reviews" value={totalReviews} />
        </div>
        <div className="col-md-6">
          <MetricCard 
            icon="bi-star-fill" 
            label="Average Rating" 
            value={`${avgRating} / 5.0`} 
            iconStyle={{ background: COLORS.goldLight, color: "#7a5a1a" }}
          />
        </div>
      </div>

      {/* ── SEARCH BAR ── */}
      <div className="mb-3">
        <div className="za-search-wrap">
          <i className="bi bi-search" />
          <input
            className="za-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, farm, or review content..."
          />
        </div>
      </div>

      {/* ── LOADING STATE ── */}
      {loading && <p style={{ color: COLORS.textMuted, padding: 20 }}>Loading reviews...</p>}

      {/* ── REVIEWS LIST/TABLE ── */}
      {!loading && (
        <div className="za-card">
          <div style={{ overflowX: "auto" }}>
            <table className="za-table">
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>Customer</th>
                  <th style={{ width: "20%" }}>Farm</th>
                  <th style={{ width: "15%" }}>Rating</th>
                  <th style={{ width: "35%" }}>Review Comment</th>
                  <th style={{ width: "10%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r._id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{r.name}</span>
                      <div style={{ fontSize: "11px", color: COLORS.textMuted }}>
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td style={{ color: COLORS.oliveMid, fontWeight: 500 }}>
                      🌿 {r.farmId?.nameEn || "—"}
                    </td>
                    <td>
                      <span style={{ color: COLORS.gold, fontWeight: "bold" }}>
                        {"★".repeat(r.rating)}
                        <span style={{ color: "#e2d9c5" }}>{"★".repeat(5 - r.rating)}</span>
                      </span>
                    </td>
                    <td>
                      <p style={{ margin: 0, fontSize: "0.85rem", color: COLORS.textDark, whiteSpace: "normal", wordBreak: "break-word" }}>
                        "{r.comment}"
                      </p>
                    </td>
                    <td>
                      <button 
                        className="za-btn za-btn-sm za-btn-danger"
                        onClick={() => handleDelete(r._id)}
                        title="Delete Review"
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "30px", color: COLORS.textMuted }}>
                No reviews found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}