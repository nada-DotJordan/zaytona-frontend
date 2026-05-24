// src/admin/pages/Products.jsx
import { useState } from "react";
import { COLORS } from "../styles/colors";
import { useProducts } from "../../api/api";
import { GoldLine } from "../components/ui/Primitives";
import api from "../../api/api";

const EMPTY_FORM = { nameEn: "", nameAr: "", farmId: "", sizeL: "", price: "", batch: "", type: "" };
const OIL_TYPES  = ["Extra Virgin", "Virgin", "Cold Press", "Organic", "Traditional blend"];

function stockBadge(versions) {
  // Use latest version price as a proxy; you can add a qty field to schema later
  const price = versions?.[versions.length - 1]?.price ?? 0;
  if (price < 20) return "za-badge-red";
  if (price < 50) return "za-badge-amber";
  return "za-badge-green";
}

export default function Products({ farms }) {
  const { products, setProducts, loading } = useProducts();
  const [search, setSearch]       = useState("");
  const [farmFilter, setFarmFilter] = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const filtered = products.filter((p) => {
    const name = (p.nameEn || "").toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchFarm   = !farmFilter || p.farmId?._id === farmFilter || p.farmId === farmFilter;
    return matchSearch && matchFarm;
  });

  // ── 1. ADD PRODUCT ──
  async function handleAdd() {
    if (!form.nameEn || !form.farmId) {
      alert("Please fill product name and select a farm.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/products', {
        farmId:  form.farmId,
        nameEn:  form.nameEn,
        nameAr:  form.nameAr || form.nameEn,
        sizeL:   form.sizeL  || "—",
        badge:   form.type   || null, // تخزين نوع الزيت في البادج أو حقل مخصص
        versions: [{
          year:  new Date().getFullYear(),
          price: parseFloat(form.price) || 0,
          label: form.batch || `Harvest ${new Date().getFullYear()}`,
        }],
      });
      
      setProducts((prev) => [...prev, res.data]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to add product.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  // ── 2. DELETE PRODUCT ──
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      // تم تعديل الرابط ليتوافق مع الخيار الأول بالباك إند
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete product.");
      console.error(err);
    }
  }

  // ── 3. EDIT PRODUCT ──
  async function handleEdit(id) {
    const prod = products.find((x) => (x._id || x.id) === id);
    if (!prod) return;

    const nname  = window.prompt("Product name (EN):", prod.nameEn);
    if (nname === null) return; // إلغاء العملية إذا ضغط Cancel

    const nprice = window.prompt("Latest price (JOD):", prod.versions?.[prod.versions.length - 1]?.price ?? 0);
    if (nprice === null) return;

    try {
      const updatedVersions = [
        ...(prod.versions || []).slice(0, -1),
        { ...(prod.versions?.[prod.versions.length - 1] || {}), price: parseFloat(nprice) || 0 },
      ];

      // تم تعديل الرابط لضرب الـ Route الموحد للمنتجات
      const res = await api.put(`/products/${id}`, {
        ...prod, // إرسال بقية الداتا لضمان عدم ضياعها في الـ findByIdAndUpdate
        nameEn: nname,
        versions: updatedVersions,
      });

      setProducts((prev) =>
        prev.map((x) => ((x._id || x.id) === id ? { ...x, ...res.data } : x))
      );
    } catch (err) {
      alert(err.response?.data?.error || "Failed to update product.");
      console.error(err);
    }
  }

  return (
    <div>
      <GoldLine />

      {/* ── ADD FORM CARD ── */}
      <div className="za-card mb-3">
        <div className="za-card-header">
          <span className="za-card-title">
            <i className="bi bi-plus-circle me-1" /> Add new product
          </span>
          <button className="za-btn za-btn-sm" onClick={() => setShowForm((v) => !v)}>
            {showForm ? "Collapse" : "Expand"}
          </button>
        </div>

        {showForm && (
          <div className="za-card-body">
            <div className="row g-2 mb-2">
              <div className="col-md-6">
                <label className="za-label">Product name (English)</label>
                <input className="za-input" value={form.nameEn} onChange={set("nameEn")} placeholder="e.g. Extra Virgin Olive Oil" />
              </div>
              <div className="col-md-6">
                <label className="za-label">Product name (Arabic)</label>
                <input className="za-input" value={form.nameAr} onChange={set("nameAr")} placeholder="مثال: زيت زيتون بكر ممتاز" dir="rtl" />
              </div>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-md-6">
                <label className="za-label">Linked farm</label>
                <select className="za-input" value={form.farmId} onChange={set("farmId")}>
                  <option value="">Select farm</option>
                  {farms.map((f) => (
                    <option key={f._id || f.id} value={f._id || f.id}>
                      {f.nameEn || f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <label className="za-label">Size</label>
                <input className="za-input" value={form.sizeL} onChange={set("sizeL")} placeholder="e.g. 2L, 5L" />
              </div>
              <div className="col-md-3">
                <label className="za-label">Oil type</label>
                <select className="za-input" value={form.type} onChange={set("type")}>
                  <option value="">Select type</option>
                  {OIL_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-md-4">
                <label className="za-label">Price (JOD)</label>
                <input className="za-input" type="number" step="0.01" value={form.price} onChange={set("price")} placeholder="0.00" />
              </div>
              <div className="col-md-4">
                <label className="za-label">Batch / harvest label</label>
                <input className="za-input" value={form.batch} onChange={set("batch")} placeholder="e.g. Harvest 2025" />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="za-btn za-btn-primary" onClick={handleAdd} disabled={saving}>
                <i className="bi bi-plus-lg" /> {saving ? "Saving..." : "Add product"}
              </button>
              <button className="za-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* ── SEARCH + FARM FILTER ── */}
      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <div className="za-search-wrap">
            <i className="bi bi-search" />
            <input
              className="za-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
            />
          </div>
        </div>
        <div className="col-md-4">
          <select className="za-input" value={farmFilter} onChange={(e) => setFarmFilter(e.target.value)}>
            <option value="">All farms</option>
            {farms.map((f) => (
              <option key={f._id || f.id} value={f._id || f.id}>
                {f.nameEn || f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── LOADING ── */}
      {loading && <p style={{ color: COLORS.textMuted, padding: 20 }}>Loading products...</p>}

      {/* ── TABLE ── */}
      <div className="za-card">
        <div style={{ overflowX: "auto" }}>
          <table className="za-table">
            <thead>
              <tr>
                <th style={{ width: "28%" }}>Product</th>
                <th style={{ width: "20%" }}>Farm</th>
                <th style={{ width: "8%"  }}>Size</th>
                <th style={{ width: "10%" }}>Latest Price</th>
                <th style={{ width: "9%"  }}>Versions</th>
                <th style={{ width: "13%" }}>Badge</th>
                <th style={{ width: "12%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const id         = p._id || p.id;
                const farmName   = p.farmId?.nameEn || "—";
                const latestVer  = p.versions?.[p.versions.length - 1];

                return (
                  <tr key={id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{p.nameEn}</span>
                      <br />
                      <span style={{ fontSize: 11, color: COLORS.textMuted }}>{p.nameAr}</span>
                    </td>
                    <td style={{ color: COLORS.textMuted }}>{farmName}</td>
                    <td>{p.sizeL}</td>
                    <td style={{ fontWeight: 600 }}>
                      JOD {latestVer?.price?.toFixed(2) ?? "—"}
                    </td>
                    <td>
                      <span className={`za-badge ${stockBadge(p.versions)}`}>
                        {p.versions?.length ?? 0} years
                      </span>
                    </td>
                    <td style={{ color: COLORS.textMuted }}>
                      {p.badge || "—"}
                    </td>
                    <td>
                      <button className="za-btn za-btn-sm me-1" onClick={() => handleEdit(id)}>
                        <i className="bi bi-pencil" />
                      </button>
                      <button className="za-btn za-btn-sm za-btn-danger" onClick={() => handleDelete(id)}>
                        <i className="bi bi-trash" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}