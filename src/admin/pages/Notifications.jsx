import { useState, useEffect } from "react";
import { COLORS } from "../styles/colors";
import { GoldLine } from "../components/ui/Primitives";
import api from "../../api/api";

const RECIPIENTS = ["All customers", "Specific user", "Farm owners"];

const TYPES = ["order", "delivery", "cancellation", "promotion", "general"];

const TYPE_BADGE = {
  order:        "za-badge-blue",
  delivery:     "za-badge-green",
  cancellation: "za-badge-red",
  promotion:    "za-badge-amber",
  general:      "za-badge-olive",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [sending, setSending]             = useState(false);

  const [recipient,    setRecipient]    = useState(RECIPIENTS[0]);
  const [targetEmail,  setTargetEmail]  = useState("");
  const [type,         setType]         = useState(TYPES[0]);
  const [message,      setMessage]      = useState("");

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get("/notifications/all"); // ← Admin-only route
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch notification logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  async function handleSend(e) {
    e.preventDefault();

    if (!message.trim()) {
      alert("Please write a notification message first.");
      return;
    }
    if (recipient === "Specific user" && !targetEmail.trim()) {
      alert("Please provide the target customer's email.");
      return;
    }

    setSending(true);
    try {
      const res = await api.post("/notifications", {
        recipientType: recipient,
        targetEmail:   recipient === "Specific user" ? targetEmail.trim() : null,
        type,
        message:       message.trim(),
        messageAr:     message.trim(),
      });

      setNotifications((prev) => [res.data, ...prev]);
      setMessage("");
      setTargetEmail("");
      alert("Notification broadcasted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send notification.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <GoldLine />

      <div className="za-card mb-3">
        <div className="za-card-header">
          <span className="za-card-title">
            <i className="bi bi-send me-1" /> Send live notification
          </span>
        </div>
        <div className="za-card-body">
          <form onSubmit={handleSend}>
            <div className="row g-2 mb-2">
              <div className="col-md-6">
                <label className="za-label">Recipient Target</label>
                <select
                  className="za-input"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                >
                  {RECIPIENTS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="col-md-6">
                <label className="za-label">Notification Category</label>
                <select
                  className="za-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  style={{ textTransform: "capitalize" }}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {recipient === "Specific user" && (
              <div className="mb-2">
                <label className="za-label">Customer Email Address</label>
                <input
                  type="email"
                  className="za-input"
                  placeholder="e.g. customer@zaytona.com"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="mb-3">
              <label className="za-label">Message Content</label>
              <textarea
                className="za-input"
                rows="3"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type the announcement or update text here..."
              />
            </div>

            <button type="submit" className="za-btn za-btn-primary" disabled={sending}>
              <i className="bi bi-send-fill me-1" />
              {sending ? "Broadcasting..." : "Send Notification"}
            </button>
          </form>
        </div>
      </div>

      <div className="za-card">
        <div className="za-card-header">
          <span className="za-card-title">Recent notification logs</span>
          <span className="za-card-sub">Live Database Records</span>
        </div>
        <div className="za-card-body">
          {loading && (
            <p style={{ color: COLORS.textMuted, padding: 10 }}>Loading history...</p>
          )}

          {!loading && notifications.map((n, idx) => {
            const id             = n._id || n.id || idx;
            const timeAgo        = n.createdAt ? new Date(n.createdAt).toLocaleString() : "Just now";
            const recipientLabel = n.targetEmail
              ? `User (${n.targetEmail})`
              : n.recipientType || "All Customers";

            return (
              <div
                key={id}
                className={`za-notif-card ${!n.isRead ? "unread" : ""}`}
                style={{
                  padding: "12px 6px",
                  borderBottom: `1px solid ${COLORS.border || "#e2d9c5"}`,
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: COLORS.textDark }}>
                    Target: {recipientLabel}
                  </span>
                  <span style={{ fontSize: 11, color: COLORS.textMuted }}>{timeAgo}</span>
                </div>

                <div style={{ fontSize: 13, color: COLORS.textDark, marginBottom: 8 }}>
                  {n.message || n.messageAr}
                </div>

                <span
                  className={`za-badge ${TYPE_BADGE[n.type?.toLowerCase()] ?? "za-badge-olive"}`}
                  style={{ textTransform: "capitalize" }}
                >
                  {n.type || "general"}
                </span>
              </div>
            );
          })}

          {!loading && notifications.length === 0 && (
            <div style={{ textAlign: "center", padding: 20, color: COLORS.textMuted }}>
              No notification logs found in Zaytona database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}