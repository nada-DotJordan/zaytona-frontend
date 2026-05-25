import { useState, useEffect } from "react";
import { COLORS } from "../styles/colors";
import { GoldLine, StatusBadge } from "../components/ui/Primitives";
import api from "../../api/api"; 

export default function Tracking() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    async function fetchTrackingLogs() {
      try {
        const res = await api.get("/admin/tracking"); 
        setBatches(res.data);
      } catch (err) {
        console.error("Failed to fetch live tracking data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTrackingLogs();
  }, []);

  async function runTracking() {
    const query = trackInput.trim();
    if (!query) {
      setTrackResult(null);
      return;
    }

    setSearching(true);
    try {
      const res = await api.get(`/admin/tracking/${query}`);
      setTrackResult(res.data);
    } catch (err) {
      console.error("Batch lookup error:", err);
      setTrackResult({ notFound: true, query });
    } finally {
      setSearching(false);
    }
  }

  return (
    <div>
      <GoldLine />

      <div className="za-card mb-3">
        <div className="za-card-header">
          <span className="za-card-title">
            <i className="bi bi-geo-alt me-1" /> Batch tracking live lookup
          </span>
        </div>
        <div className="za-card-body">
          <div className="d-flex gap-2">
            <input
              className="za-input"
              value={trackInput}
              onChange={(e) => setTrackInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runTracking()}
              placeholder="Enter 24-char Batch ID (e.g. 646f...)"
              style={{ flex: 1 }}
              disabled={searching}
            />
            <button className="za-btn za-btn-primary" onClick={runTracking} disabled={searching}>
              {searching ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  Locating...
                </>
              ) : (
                <>
                  <i className="bi bi-search" /> Track
                </>
              )}
            </button>
          </div>

          {trackResult && (
            <div style={{ marginTop: 14 }}>
              {trackResult.notFound ? (
                <div style={{ color: COLORS.textMuted, fontSize: 12.5, padding: 10 }}>
                  ⚠️ No olive oil batch or harvest record matches <strong>"{trackResult.query}"</strong>.
                </div>
              ) : (
                <div style={{ background: COLORS.warmWhite, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontWeight: 600, marginBottom: 10, color: COLORS.oliveDark, fontSize: "13px" }}>
                    📦 BATCH S/N: {(trackResult._id || trackResult.id || "").toUpperCase()}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12.5 }}>
                    <span style={{ color: COLORS.textMuted }}>Origin Farm: <strong style={{ color: COLORS.textDark }}>{trackResult.farmName || trackResult.farm || "—"}</strong></span>
                    <span>System Status: <StatusBadge status={trackResult.status} /></span>
                    <span style={{ color: COLORS.textMuted }}>Current Process: <strong style={{ color: COLORS.textDark }}>{trackResult.stage || "Harvested"}</strong></span>
                    <span style={{ color: COLORS.textMuted }}>Last Checked: <strong style={{ color: COLORS.textDark }}>{trackResult.updatedAt ? new Date(trackResult.updatedAt).toLocaleString() : trackResult.time || "—"}</strong></span>
                  </div>
                  {trackResult.notes && (
                    <div style={{ marginTop: 10, fontSize: 11.5, color: COLORS.textMuted, borderTop: `1px dashed ${COLORS.border}`, paddingTop: 8 }}>
                      <strong>Batch Notes:</strong> {trackResult.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="za-card">
        <div className="za-card-header">
          <span className="za-card-title">Recent supply chain activity</span>
        </div>
        
        {loading ? (
          <p style={{ color: COLORS.textMuted, padding: 20 }}>Retrieving olive production metrics from server...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="za-table">
              <thead>
                <tr>
                  <th style={{ width: "20%" }}>Batch ID</th>
                  <th style={{ width: "20%" }}>Origin Farm</th>
                  <th style={{ width: "22%" }}>Production Stage</th>
                  <th style={{ width: "15%" }}>Supervisor</th>
                  <th style={{ width: "13%" }}>Timestamp</th>
                  <th style={{ width: "10%" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((t) => {
                  const id = t._id || t.id;
                  const farmName = t.farmName || t.farm || "—";
                  const currentStage = t.stage || "Harvested";
                  const inspector = t.updatedBy || t.supervisor || "System";
                  const time = t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : t.time || "—";

                  return (
                    <tr key={id}>
                      <td className="za-order-id" style={{ fontSize: "11px" }}>{id.substring(id.length - 8).toUpperCase()}</td>
                      <td>{farmName}</td>
                      <td>{currentStage}</td>
                      <td style={{ color: COLORS.textMuted }}>{inspector}</td>
                      <td style={{ color: COLORS.textMuted, fontSize: "12px" }}>{time}</td>
                      <td><StatusBadge status={t.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {batches.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: COLORS.textMuted }}>
                No active supply chain logs found in the database.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}