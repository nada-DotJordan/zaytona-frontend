import { useState, useEffect } from "react";
import { COLORS } from "../styles/colors";
import { GoldLine, MetricCard, initials } from "../components/ui/Primitives";
import api from "../../api/api";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await api.get("/admin/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers from database:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  const filtered = customers.filter((u) => {
    const name  = (u.nameEn || u.nameAr || "").toLowerCase();
    const email = (u.email  || "").toLowerCase();
    const query = search.toLowerCase();
    return name.includes(query) || email.includes(query);
  });

  const totalCustomers = customers.length;

  const newThisMonth = customers.filter((u) => {
    if (!u.createdAt) return false;
    const joined = new Date(u.createdAt);
    const now    = new Date();
    return (
      joined.getMonth()    === now.getMonth() &&
      joined.getFullYear() === now.getFullYear()
    );
  }).length;

  return (
    <div>
      <GoldLine />

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <MetricCard icon="bi-people-fill" label="Total customers" value={totalCustomers} />
        </div>
        <div className="col-md-4">
          <MetricCard icon="bi-person-plus" label="New this month" value={newThisMonth} />
        </div>
        <div className="col-md-4">
          <MetricCard
            icon="bi-activity"
            label="Active Accounts"
            value={totalCustomers}
            iconStyle={{ background: COLORS.goldLight, color: "#7a5a1a" }}
          />
        </div>
      </div>

      <div className="mb-3">
        <div className="za-search-wrap">
          <i className="bi bi-search" />
          <input
            className="za-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
          />
        </div>
      </div>

      {loading && (
        <p style={{ color: COLORS.textMuted, padding: 20 }}>Loading customers database...</p>
      )}

      {!loading && (
        <div className="za-card">
          <div style={{ overflowX: "auto" }}>
            <table className="za-table">
              <thead>
                <tr>
                  <th style={{ width: "35%" }}>Name</th>
                  <th style={{ width: "35%" }}>Email</th>
                  <th style={{ width: "20%" }}>Joined Date</th>
                  <th style={{ width: "10%" }}>Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const id         = u._id || u.id;
                  const displayName = u.nameEn || u.nameAr || "Unknown User";
                  const joinedDate  = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "—";

                  return (
                    <tr key={id}>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="za-avatar">{initials(displayName)}</div>
                          {displayName}
                        </div>
                      </td>
                      <td style={{ color: COLORS.textMuted }}>{u.email}</td>
                      <td style={{ color: COLORS.textMuted }}>{joinedDate}</td>
                      <td>
                        <span className="za-badge za-badge-green">
                          {u.role || "customer"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: COLORS.textMuted }}>
                No registered customers found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}