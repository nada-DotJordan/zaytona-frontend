// src/admin/pages/Orders.jsx
import { useState, useEffect,useContext } from "react";
import { COLORS } from "../styles/colors";
import { LanguageContext } from "../../languages/LanguageContext";
import { GoldLine, MetricCard, StatusBadge, initials } from "../components/ui/Primitives";
import api from "../../api/api"; // الـ axios instance المربوط بالباك إند

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const { lang } = useContext(LanguageContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await api.get("/orders"); 
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch live orders. Check if your user is marked as isAdmin in DB:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  async function handleStatusChange(orderId, newStatus) {
    try {
      // تحديد الـ stage المناسب بناءً على الحالة لتغذية الـ trackingHistory في الباك إند
      let stageDescription = "Order Updated";
      if (newStatus === "confirmed") stageDescription = "Order Confirmed & Preparing";
      if (newStatus === "shipped") stageDescription = "Handed over to delivery agent";
      if (newStatus === "delivered") stageDescription = "Successfully delivered to customer";
      if (newStatus === "cancelled") stageDescription = "Cancelled by management";

      const res = await api.put(`/orders/${orderId}/status`, { 
        status: newStatus,
        stage: stageDescription 
      });
      
      setOrders((prev) =>
        prev.map((o) => ((o._id || o.id) === orderId ? { ...o, status: res.data.status } : o))
      );
    } catch (err) {
      alert("Failed to update order status.");
      console.error(err);
    }
  }

  const filtered = orders.filter((o) => {
    const orderId = o._id || o.id || "";
    const customerName = o.customerId 
  ? (lang === 'ar' ? o.customerId.nameAr : o.customerId.nameEn) 
  : "Guest";
    
    return (
      (customerName.toLowerCase().includes(search.toLowerCase()) ||
        orderId.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || o.status === statusFilter)
    );
  });

  // 4. حساب الإحصائيات من الأحرف الصغيرة المتوافقة مع قاعدة البيانات الحية
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const confirmedOrders = orders.filter((o) => o.status === "confirmed").length;
  const totalOrdersToday = orders.filter((o) => {
    if (!o.createdAt) return false;
    return new Date(o.createdAt).toDateString() === new Date().toDateString();
  }).length;

  return (
    <div>
      <GoldLine />

      <div className="row g-3 mb-3">
        <div className="col-md-4">
          <MetricCard icon="bi-bag-plus" label="New orders today" value={totalOrdersToday} />
        </div>
        <div className="col-md-4">
          <MetricCard
            icon="bi-hourglass-split"
            label="Pending Action"
            value={pendingOrders}
            iconStyle={{ background: COLORS.goldLight, color: "#7a5a1a" }}
          />
        </div>
        <div className="col-md-4">
          <MetricCard
            icon="bi-check2-circle"
            label="Confirmed Orders"
            value={confirmedOrders}
            iconStyle={{ background: "#e6f2fb", color: "#1a4f7a" }}
          />
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-7">
          <div className="za-search-wrap">
            <i className="bi bi-search" />
            <input
              className="za-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, order ID..."
            />
          </div>
        </div>
        <div className="col-md-3">
          <select className="za-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ textTransform: "capitalize" }}>
            <option value="">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p style={{ color: COLORS.textMuted, padding: 20 }}>Loading orders ledger from server...</p>}

      {/* ── ORDERS TABLE ── */}
      {!loading && (
        <div className="za-card">
          <div style={{ overflowX: "auto" }}>
            <table className="za-table">
              <thead>
                <tr>
                  <th style={{ width: "15%" }}>Order ID</th>
                  <th style={{ width: "20%" }}>Customer</th>
                  <th style={{ width: "25%" }}>Products Summary</th>
                  <th style={{ width: "12%" }}>Total Amount</th>
                  <th style={{ width: "13%" }}>Order Date</th>
                  <th style={{ width: "15%" }}>Status</th>
                  <th style={{ width: "15%" }}>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const id = o._id || o.id;
                  const customerName = o.customerId?.name || o.customerName || "Guest User";
                  const formattedDate = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "—";
                  
                  const productsSummary = o.items && o.items.length > 0
                    ? o.items.map(item => {
                        const name = item.productId?.name || "Zaytona Product";
                        return `${name} (x${item.qty})`;
                      }).join(", ")
                    : "No items";

                  let calculatedTotal = 0;
                  if (o.items && o.items.length > 0) {
                    calculatedTotal = o.items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
                  }
                  const totalAmount = calculatedTotal > 0 ? `${calculatedTotal.toFixed(2)} JOD` : "—";

                  return (
                    <tr key={id}>
                      <td className="za-order-id" style={{ fontSize: "11px", fontFamily: "monospace" }}>
                        {id ? id.substring(id.length - 8).toUpperCase() : "—"}
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="za-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>
                            {initials(customerName)}
                          </div>
                          {customerName}
                        </div>
                      </td>
                      <td style={{ color: COLORS.textMuted, fontSize: 12 }}>{productsSummary}</td>
                      <td style={{ fontWeight: 600, color: COLORS.textDark }}>{totalAmount}</td>
                      <td style={{ color: COLORS.textMuted, fontSize: 12 }}>{formattedDate}</td>
                      <td>
                        <StatusBadge status={o.status || "pending"} />
                      </td>
                      <td>
                        <select 
                          className="za-input p-1" 
                          style={{ fontSize: "11px", height: "auto", minWidth: "110px", textTransform: "capitalize" }}
                          value={o.status || "pending"}
                          onChange={(e) => handleStatusChange(id, e.target.value)}
                        >
                          {STATUSES.map(st => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: COLORS.textMuted }}>
                No active orders found matching the criteria.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}