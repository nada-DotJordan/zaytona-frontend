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
  const [search, setSearch]       = useState("");
  const [govFilter, setGovFilter] = useState("");
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  // ✅ Edit modal state
  const [editingFarm, setEditingFarm] = useState(null); // holds the farm being edited
  const [editForm, setEditForm]       = useState({});
  const [editSaving, setEditSaving]   = useState(false);

  const set     = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setEdit = (key) => (e) => setEditForm((f) => ({ ...f, [key]: e.target.value }));

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

  async function handleAdd() {
    if (!form.name || !form.farmname) {
      alert("Please fill owner name and farm name.");
      return;
    }
    setSaving(true);
    try {
      const res = await api.post("/farms", {
        nameEn:     form.farmname,
        nameAr:     form.farmname,
        owner:      form.name,
        phone:      form.phone      || "—",
        email:      form.email      || "—",
        nationalId: form.nationalId || "—",
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

  // ✅ Open edit modal pre-filled with farm data
  function openEdit(farm) {
    setEditingFarm(farm);
    setEditForm({
      nameEn:     farm.nameEn || farm.name || "",
      nameAr:     farm.nameAr || "",
      owner:      farm.owner      || "",
      phone:      farm.phone      || "",
      email:      farm.email      || "",
      nationalId: farm.nationalId || "",
      gov:        farm.gov        || "",
      addr:       farm.addr       || "",
      gps:        farm.gps        || "",
      size:       farm.size       || "",
      trees:      farm.trees      || "",
      method:     farm.method     || "Organic",
      notes:      farm.notes      || "",
    });
  }

  // ✅ Submit edit
  async function handleEditSave() {
    if (!editingFarm) return;
    const id = editingFarm._id || editingFarm.id;
    setEditSaving(true);
    try {
      const res = await api.put(`/farms/${id}`, {
        nameEn:     editForm.nameEn,
        nameAr:     editForm.nameAr,
        owner:      editForm.owner,
        phone:      editForm.phone,
        email:      editForm.email,
        nationalId: editForm.nationalId,
        gov:        editForm.gov,
        addr:       editForm.addr,
        gps:        editForm.gps,
        size:       Number(editForm.size)  || 0,
        trees:      Number(editForm.trees) || 0,
        method:     editForm.method,
        notes:      editForm.notes,
      });
      // ✅ Merge updated data back into farms list
      setFarms((prev) =>
        prev.map((f) => (f._id || f.id) === id ? { ...f, ...res.data } : f)
      );
      setEditingFarm(null);
    } catch (err) {
      alert("Failed to update farm.");
      console.error(err);
    } finally {
      setEditSaving(false);
    }
  }

  const methodBadge = { Organic: "za-badge-green", Traditional: "za-badge-olive", Mixed: "za-badge-amber" };

  return (
    <div>
      <GoldLine />

      {/* ── ADD FARM FORM ── */}
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
                <textarea className="za-input" value={form.notes} onChange={set("notes")} placeholder="Certifications, seasonal notes..." style={{ minHeight: 38 }} />
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

      {/* ── SEARCH & FILTER ── */}
      <div className="row g-2 mb-3">
        <div className="col-md-8">
          <div className="za-search-wrap">
            <i className="bi bi-search" />
            <input className="za-input" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search farms by name or owner..." />
          </div>
        </div>
        <div className="col-md-4">
          <select className="za-input" value={govFilter} onChange={(e) => setGovFilter(e.target.value)}>
            <option value="">All governorates</option>
            {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {/* ── FARM CARDS ── */}
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
                  <button className="za-btn za-btn-sm" onClick={() => openEdit(f)}>
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

      {/* ✅ EDIT MODAL */}
      {editingFarm && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.45)",
          zIndex: 1000,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setEditingFarm(null); }}
        >
          <div style={{
            background: "#fff", borderRadius: 14,
            width: "100%", maxWidth: 640,
            maxHeight: "90vh", overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}>
            {/* Modal header */}
            <div style={{
              background: `linear-gradient(135deg, ${COLORS.oliveDark}, ${COLORS.oliveMid})`,
              padding: "16px 20px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderRadius: "14px 14px 0 0",
            }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem" }}>
                ✏️ Edit Farm — {editingFarm.nameEn || editingFarm.name}
              </span>
              <button onClick={() => setEditingFarm(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: "1.2rem", cursor: "pointer", lineHeight: 1 }}>✕</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: 20 }}>
              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <label className="za-label">Farm name (EN)</label>
                  <input className="za-input" value={editForm.nameEn} onChange={setEdit("nameEn")} />
                </div>
                <div className="col-md-6">
                  <label className="za-label">Farm name (AR)</label>
                  <input className="za-input" value={editForm.nameAr} onChange={setEdit("nameAr")} dir="rtl" />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <label className="za-label">Owner full name</label>
                  <input className="za-input" value={editForm.owner} onChange={setEdit("owner")} />
                </div>
                <div className="col-md-6">
                  <label className="za-label">National ID</label>
                  <input className="za-input" value={editForm.nationalId} onChange={setEdit("nationalId")} />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-6">
                  <label className="za-label">Phone</label>
                  <input className="za-input" value={editForm.phone} onChange={setEdit("phone")} />
                </div>
                <div className="col-md-6">
                  <label className="za-label">Email</label>
                  <input className="za-input" type="email" value={editForm.email} onChange={setEdit("email")} />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-4">
                  <label className="za-label">Governorate</label>
                  <select className="za-input" value={editForm.gov} onChange={setEdit("gov")}>
                    <option value="">Select</option>
                    {GOVERNORATES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="za-label">Detailed address</label>
                  <input className="za-input" value={editForm.addr} onChange={setEdit("addr")} />
                </div>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-md-4">
                  <label className="za-label">GPS coordinates</label>
                  <input className="za-input" value={editForm.gps} onChange={setEdit("gps")} placeholder="32.3254, 35.7418" />
                </div>
                <div className="col-md-4">
                  <label className="za-label">Farm size (dunums)</label>
                  <input className="za-input" type="number" value={editForm.size} onChange={setEdit("size")} />
                </div>
                <div className="col-md-4">
                  <label className="za-label">Olive tree count</label>
                  <input className="za-input" type="number" value={editForm.trees} onChange={setEdit("trees")} />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-md-4">
                  <label className="za-label">Farming method</label>
                  <select className="za-input" value={editForm.method} onChange={setEdit("method")}>
                    <option>Organic</option>
                    <option>Traditional</option>
                    <option>Mixed</option>
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="za-label">Notes</label>
                  <textarea className="za-input" value={editForm.notes} onChange={setEdit("notes")} style={{ minHeight: 38 }} />
                </div>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button className="za-btn" onClick={() => setEditingFarm(null)}>Cancel</button>
                <button className="za-btn za-btn-primary" onClick={handleEditSave} disabled={editSaving}>
                  <i className="bi bi-check-lg" /> {editSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}