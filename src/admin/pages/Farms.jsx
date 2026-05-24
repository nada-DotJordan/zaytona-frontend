// src/admin/pages/Farms.jsx
import { useState } from "react";
import { COLORS } from "../styles/colors";
import { GOVERNORATES } from "../data/mockData";
import { GoldLine, initials } from "../components/ui/Primitives";
import api from "../../api/api";

const EMPTY_FORM = {
  name: "", farmname: "", phone: "", email: "", nationalId: "",
  gov: "", addr: "", gps: "", size: "", trees: "", method: "", notes: "",
};

export default function Farms({ farms, setFarms }) {
  const [search, setSearch]     = useState("");
  const [govFilter, setGovFilter] = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // Filter the farms list for display (farms come from MongoDB via props)
  const filtered = farms.filter((f) => {
    const name  = f.nameEn || f.name || "";
    const owner = f.owner  || "";
    const gov   = f.gov    || "";
    return (
      (name.toLowerCase().includes(search.toLowerCase()) ||
       owner.toLowerCase().includes(search.toLowerCase())) &&
      (!govFilter || gov === govFilter)
    );
  });

  // 1. إضافة مزرعة حقيقية مع إرسال الـ National ID للداتابيز
  async function handleAdd() {
    if (!form.name || !form.farmname) {
      alert("Please fill owner name and farm name.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/farms', {
        nameEn:     form.farmname,
        nameAr:     form.farmname,   
        owner:      form.name,
        phone:      form.phone      || "—",
        email:      form.email      || "—",
        nationalId: form.nationalId || "—", // ← تم إصلاح الربط هنا ليخزن بالباك إند
        gov:        form.gov        || "—",
        addr:       form.addr       || "—",
        gps:        form.gps        || "—",
        size:       Number(form.size)  || 0,
        trees:      Number(form.trees) || 0,
        method:     form.method     || "Organic",
        notes:      form.notes      || "",
      });
      setFarms((prev) => [...prev, res.data]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      alert("Failed to add farm. Check the console.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // 2. حذف المزرعة نهائياً من الـ Live MongoDB
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this farm from Zaytona database?")) return;
    try {
      await api.delete(`/farms/${id}`);
      setFarms((prev) => prev.filter((f) => (f._id || f.id) !== id));
    } catch (err) {
      alert("Failed to delete farm.");
      console.error(err);
    }
  }

  // 3. تعديل المزرعة بشكل مرن (Prompt منسق ومحدّث على السيرفر)
  async function handleEdit(id) {
    const farm = farms.find((x) => (x._id || x.id) === id);
    if (!farm) return;
    
    const nname = window.prompt("Update Farm Name (EN):", farm.nameEn || farm.name);
    if (nname === null) return; // إلغاء العملية
    
    const nphone = window.prompt("Update Owner Phone:", farm.phone || "");
    const naddr  = window.prompt("Update Detailed Address:", farm.addr || "");
    
    try {
      const res = await api.put(`/farms/${id}`, {
        nameEn: nname,
        phone:  nphone ?? farm.phone,
        addr:   naddr ?? farm.addr,
      });
      setFarms((prev) =>
        prev.map((x) => ((x._id || x.id) === id ? { ...x, ...res.data } : x))
      );
    } catch (err) {
      alert("Failed to update farm data.");
      console.error(err);
    }
  }

  const methodBadge = { Organic: "za-badge-green", Traditional: "za-badge-olive", Mixed: "za-badge-amber" };

  return (
    <div>
      <GoldLine />

      {/* ── ADD FORM CARD ── */}
      <div className="za-card mb-3">
        <div className="za-card-header">
          <span className="za-card-title">
            <i className="bi bi-plus-circle me-1" /> Add new farm
          </span>
          <button className="za-btn za-btn-sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Collapse" : "Expand"}
          </button>
        </div>

        {showForm && (
          <div className="za-card-body">
            <div className="row g-2 mb-2">
              <div className="col-md-6">
                <label className="za-label">Owner full name</label>
                <input className="za-input" value={form.name} onChange={set("name")} placeholder="e.g. Ahmad Khalil" />
              </div>
              <div className="col-md-6">
                <label className="za-label">Farm name</label>
                <input className="za-input" value={form.farmname} onChange={set("farmname")} placeholder="e.g. Al Rawabi Farm" />
              </div>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-md-4">
                <label className="za-label">Phone</label>
                <input className="za-input" value={form.phone} onChange={set("phone")} placeholder="+962 7x xxx xxxx" />
              </div>
              <div className="col-md-4">
                <label className="za-label">Email</label>
                <input className="za-input" type="email" value={form.email} onChange={set("email")} placeholder="owner@email.com" />
              </div>
              <div className="col-md-4">
                <label className="za-label">National ID</label>
                <input className="za-input" value={form.nationalId} onChange={set("nationalId")} placeholder="ID number" />
              </div>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-md-4">
                <label className="za-label">Governorate</label>
                <select className="za-input" value={form.gov} onChange={set("gov")}>
                  <option value="">Select governorate</option>
                  {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="col-md-8">
                <label className="za-label">Detailed address</label>
                <input className="za-input" value={form.addr} onChange={set("addr")} placeholder="Village / area / street" />
              </div>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-md-4">
                <label className="za-label">GPS coordinates</label>
                <input className="za-input" value={form.gps} onChange={set("gps")} placeholder="32.3254, 35.7418" />
              </div>
              <div className="col-md-4">
                <label className="za-label">Farm size (dunums)</label>
                <input className="za-input" type="number" value={form.size} onChange={set("size")} placeholder="40" />
              </div>
              <div className="col-md-4">
                <label className="za-label">Olive tree count</label>
                <input className="za-input" type="number" value={form.trees} onChange={set("trees")} placeholder="500" />
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="za-label">Farming method</label>
                <select className="za-input" value={form.method} onChange={set("method")}>
                  <option value="">Select method</option>
                  <option>Organic</option>
                  <option>Traditional</option>
                  <option>Mixed</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="za-label">Notes</label>
                <textarea
                  className="za-input"
                  value={form.notes}
                  onChange={set("notes")}
                  placeholder="Certifications, seasonal notes..."
                  style={{ minHeight: 38 }}
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="za-btn za-btn-primary" onClick={handleAdd} disabled={saving}>
                <i className="bi bi-plus-lg" /> {saving ? "Saving..." : "Add farm"}
              </button>
              <button className="za-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* ── SEARCH + FILTER ── */}
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <div className="za-search-wrap">
            <i className="bi bi-search" />
            <input
              className="za-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search farms by name or owner..."
            />
          </div>
        </div>
        <div className="col-md-4">
          <select className="za-input" value={govFilter} onChange={(e) => setGovFilter(e.target.value)}>
            <option value="">All governorates</option>
            {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* ── FARM CARDS GRID ── */}
      <div className="row g-3">
        {filtered.map((f) => {
          const id     = f._id || f.id;
          const name   = f.nameEn || f.name || "—";
          const owner  = f.owner  || "—";
          const method = f.method || "Organic";

          return (
            <div key={id} className="col-md-6">
              <div className="za-farm-card">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <div className="za-farm-initials">{initials(owner)}</div>
                  <div className="flex-grow-1">
                    <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.textDark }}>{name}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>
                      <i className="bi bi-geo-alt" /> {f.gov || "—"}
                    </div>
                  </div>
                  <span className={`za-badge ${methodBadge[method] ?? "za-badge-olive"}`}>{method}</span>
                </div>

                <div style={{ fontSize: 12, paddingBottom: 10, borderBottom: `1px solid ${COLORS.border}`, marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: COLORS.textDark, marginBottom: 2 }}>{owner}</div>
                  <div style={{ color: COLORS.textMuted }}>📞 {f.phone || "—"}</div>
                  <div style={{ color: COLORS.textMuted }}>✉️ {f.email || "—"}</div>
                  <div style={{ color: COLORS.textMuted, fontSize: "11px" }}>🪪 National ID: {f.nationalId || "—"}</div>
                </div>

                <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 6 }}>
                  <i className="bi bi-signpost" /> {f.addr || "—"}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 11, color: COLORS.textMuted, marginBottom: 8 }}>
                  <span><i className="bi bi-tree" /> {f.trees || 0} trees</span>
                  <span><i className="bi bi-arrows-angle-expand" /> {f.size || 0} dunums</span>
                  <span><i className="bi bi-compass" /> {f.gps || "—"}</span>
                </div>

                {f.notes && (
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontStyle: "italic", background: COLORS.warmWhite, borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
                    {f.notes}
                  </div>
                )}

                <div className="d-flex gap-2 pt-2" style={{ borderTop: `1px solid ${COLORS.border}` }}>
                  <button className="za-btn za-btn-sm" onClick={() => handleEdit(id)}>
                    <i className="bi bi-pencil" /> Edit
                  </button>
                  <button className="za-btn za-btn-sm za-btn-danger" onClick={() => handleDelete(id)}>
                    <i className="bi bi-trash" /> Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: COLORS.textMuted }}>
            No farms match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}