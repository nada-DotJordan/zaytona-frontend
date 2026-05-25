import { useState, useEffect } from "react";
import { COLORS } from "../styles/colors";
import { dailyOrderData, activityFeed } from "../data/mockData"; 
import { GoldLine, MetricCard, BarRow } from "../components/ui/Primitives";
import api from "../../api/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardStats() {
      try {
        const res = await api.get("/admin/stats"); 
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard statistics:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardStats();
  }, []);

  return (
    <div>
      <GoldLine />

      {loading ? (
        <p style={{ color: COLORS.textMuted, padding: 20 }}>Loading platform analytics...</p>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <MetricCard 
                icon="bi-tree-fill" 
                label="Total Farms" 
                value={stats?.farms ?? 0} 
                delta="Registered Owners" 
                deltaDir="up" 
              />
            </div>
            <div className="col-md-3">
              <MetricCard 
                icon="bi-droplet-half" 
                label="Active Products" 
                value={stats?.products ?? 0} 
                delta="In Inventory" 
                deltaDir="up" 
              />
            </div>
            <div className="col-md-3">
              <MetricCard 
                icon="bi-bag-check" 
                label="Total Orders" 
                value={stats?.orders ?? 0} 
                delta="All Transactions" 
                deltaDir="up" 
              />
            </div>
            <div className="col-md-3">
              <MetricCard
                icon="bi-cash-coin"
                label="Total Revenue"
                value={`JOD ${(stats?.revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                delta="Live gross earnings"
                deltaDir="up"
                iconStyle={{ background: COLORS.goldLight, color: "#7a5a1a" }}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-md-6">
              <div className="za-card">
                <div className="za-card-header">
                  <span className="za-card-title">Daily orders — last 7 days</span>
                </div>
                <div className="za-card-body">
                  {dailyOrderData.map(([label, val]) => (
                    <BarRow key={label} label={label} val={val} max={22} />
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="za-card">
                <div className="za-card-header">
                  <span className="za-card-title">Recent activity</span>
                </div>
                <div className="za-card-body">
                  {activityFeed.map((a, i) => (
                    <div key={i} className="za-activity-item">
                      <div className={`za-dot ${a.dot}`} />
                      <div>
                        <div style={{ fontSize: 12.5, color: COLORS.textDark }}>{a.text}</div>
                        <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{a.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="za-card">
                <div className="za-card-header">
                  <span className="za-card-title">Orders by status</span>
                </div>
                <div className="za-card-body">
                  {[
                    ["Pending confirmation", "za-badge-amber", "6"],
                    ["Processing", "za-badge-blue", "9"],
                    ["Out for delivery", "za-badge-amber", "4"],
                    ["Delivered", "za-badge-green", stats?.orders ?? 0], 
                    ["Cancelled", "za-badge-red", "3"],
                  ].map(([label, cls, val]) => (
                    <div key={label} className="za-stat-row">
                      <span>{label}</span>
                      <span><span className={`za-badge ${cls}`}>{val}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="za-card">
                <div className="za-card-header">
                  <span className="za-card-title">Top products this week</span>
                </div>
                <div className="za-card-body">
                  {[
                    ["Organic Premium Jerrican 5L", "Live Tracker Active"],
                    ["Extra Virgin Glass 2L", "In High Demand"],
                    ["Jabal Ajloun Extra Virgin 3L", "Popular Choice"],
                    ["Zait Balqa Organic Tin 5L", "Steady Sales"],
                    ["Beit Ras Blend Bottle 2L", "Fresh Harvest"],
                  ].map(([name, val]) => (
                    <div key={name} className="za-stat-row">
                      <span>{name}</span>
                      <span style={{ fontSize: "12px", color: COLORS.textMuted }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}