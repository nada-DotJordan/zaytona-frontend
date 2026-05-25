import { useState, useEffect } from "react";
import { COLORS } from "../styles/colors";
import { GoldLine, MetricCard, BarRow } from "../components/ui/Primitives";
import api from "../../api/api"; 
export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get("/admin/analytics"); 
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics live data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const weeklySales = data?.weeklySales || [];
  const farmSales   = data?.farmSales || [];
  const sizeSales   = data?.sizeSales || [];

  const maxWeekly = weeklySales.length ? Math.max(...weeklySales.map(([, v]) => v)) : 100;
  const maxFarm   = farmSales.length ? Math.max(...farmSales.map(([, v]) => v)) : 100;
  const maxSize   = sizeSales.length ? Math.max(...sizeSales.map(([, v]) => v)) : 100;

  return (
    <div>
      <GoldLine />

      {loading ? (
        <p style={{ color: COLORS.textMuted, padding: 20 }}>Compiling database aggregation charts...</p>
      ) : (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <MetricCard 
                icon="bi-receipt" 
                label="Avg Order Value" 
                value={`JOD ${(data?.avgOrderValue || 0).toFixed(2)}`} 
                delta="Live Basket Average" 
                deltaDir="up" 
              />
            </div>
            <div className="col-md-3">
              <MetricCard 
                icon="bi-calendar-check" 
                label="Orders this month" 
                value={data?.ordersThisMonth || 0} 
                delta="Current Cycle" 
                deltaDir="up" 
              />
            </div>
            <div className="col-md-3">
              <MetricCard 
                icon="bi-person-check" 
                label="Registered Users" 
                value={data?.totalUsers || 0} 
                delta="Active Accounts" 
                deltaDir="up" 
              />
            </div>
            <div className="col-md-3">
              <MetricCard
                icon="bi-x-circle"
                label="Cancellation Rate"
                value={`${(data?.cancellationRate || 0).toFixed(1)}%`}
                delta="Target: < 5%"
                deltaDir="down"
                iconStyle={{ background: "#fce8e8", color: "#b54a4a" }}
              />
            </div>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-12">
              <div className="za-card">
                <div className="za-card-header">
                  <span className="za-card-title">Orders per week — this month</span>
                </div>
                <div className="za-card-body">
                  {weeklySales.map(([l, v]) => (
                    <BarRow key={l} label={l} val={v} max={maxWeekly} labelWidth="70px" />
                  ))}
                  {weeklySales.length === 0 && (
                    <p style={{ color: COLORS.textMuted, fontSize: 13 }}>No sales recorded this month yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="za-card">
                <div className="za-card-header">
                  <span className="za-card-title">Sales by farm (Live Production)</span>
                </div>
                <div className="za-card-body">
                  {farmSales.map(([l, v]) => (
                    <BarRow key={l} label={l} val={v} max={maxFarm} labelWidth="140px" />
                  ))}
                  {farmSales.length === 0 && (
                    <p style={{ color: COLORS.textMuted, fontSize: 13 }}>No farm sales aggregated yet.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="za-card">
                <div className="za-card-header">
                  <span className="za-card-title">Sales by bottle size (Minimum 2L)</span>
                </div>
                <div className="za-card-body">
                  {sizeSales.map(([l, v]) => (
                    <BarRow key={l} label={l} val={v} max={maxSize} />
                  ))}
                  {sizeSales.length === 0 && (
                    <p style={{ color: COLORS.textMuted, fontSize: 13 }}>No size variations sold yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}