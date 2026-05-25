import { useState, useEffect } from "react";
import api from "../api/api";

const TYPE_CONFIG = {
  order:        { icon: "bi-bag-check",       color: "#1a4f7a", bg: "#e6f2fb", label: "Order" },
  delivery:     { icon: "bi-truck",            color: "#2d6a4f", bg: "#e8f5ee", label: "Delivery" },
  cancellation: { icon: "bi-x-circle",         color: "#b54a4a", bg: "#fce8e8", label: "Cancelled" },
  promotion:    { icon: "bi-tag",              color: "#7a5a1a", bg: "#fdf6e3", label: "Promotion" },
  general:      { icon: "bi-bell",             color: "#5a5a5a", bg: "#f4f4f4", label: "General" },
};

const DEFAULT_TYPE = { icon: "bi-bell", color: "#5a5a5a", bg: "#f4f4f4", label: "General" };

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]             = useState(true);
  const [filter, setFilter]               = useState("all"); 

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await api.get("/notifications");
        setNotifications(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  async function markAsRead(id) {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  }

  async function markAllAsRead() {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => api.put(`/notifications/${n._id}/read`)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  const displayed = filter === "unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>
            <i className="bi bi-bell-fill" style={{ color: "#8a6c2a", marginRight: 8 }} />
            Notifications
            {unreadCount > 0 && (
              <span style={styles.unreadBadge}>{unreadCount}</span>
            )}
          </h2>
          <p style={styles.subtitle}>Stay updated with your orders and announcements</p>
        </div>

        {unreadCount > 0 && (
          <button style={styles.markAllBtn} onClick={markAllAsRead}>
            <i className="bi bi-check2-all me-1" />
            Mark all as read
          </button>
        )}
      </div>

      <div style={styles.tabs}>
        {["all", "unread"].map((tab) => (
          <button
            key={tab}
            style={{ ...styles.tab, ...(filter === tab ? styles.tabActive : {}) }}
            onClick={() => setFilter(tab)}
          >
            {tab === "all" ? "All" : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {loading && (
        <div style={styles.emptyState}>
          <div className="spinner-border spinner-border-sm" style={{ color: "#8a6c2a" }} />
          <p style={{ marginTop: 12, color: "#9a8c7a" }}>Loading notifications...</p>
        </div>
      )}

      {!loading && displayed.length === 0 && (
        <div style={styles.emptyState}>
          <i className="bi bi-bell-slash" style={{ fontSize: 40, color: "#c8b99a" }} />
          <p style={{ marginTop: 12, color: "#9a8c7a", fontSize: 14 }}>
            {filter === "unread" ? "No unread notifications" : "No notifications yet"}
          </p>
        </div>
      )}

      {!loading && displayed.length > 0 && (
        <div style={styles.list}>
          {displayed.map((n) => {
            const typeKey = n.type?.toLowerCase() || "general";
            const config  = TYPE_CONFIG[typeKey] || DEFAULT_TYPE;
            const time    = n.createdAt
              ? new Date(n.createdAt).toLocaleString("en-US", {
                  month: "short", day: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })
              : "Just now";

            return (
              <div
                key={n._id}
                style={{
                  ...styles.card,
                  background: n.isRead ? "#fff" : "#fdfaf4",
                  borderLeft: `4px solid ${n.isRead ? "#e8e0d0" : config.color}`,
                }}
                onClick={() => !n.isRead && markAsRead(n._id)}
              >
                <div style={{ ...styles.iconWrap, background: config.bg }}>
                  <i className={`bi ${config.icon}`} style={{ color: config.color, fontSize: 18 }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={styles.cardTop}>
                    <span style={{ ...styles.typeBadge, background: config.bg, color: config.color }}>
                      {config.label}
                    </span>
                    <span style={styles.time}>{time}</span>
                  </div>
                  <p style={{ ...styles.message, color: n.isRead ? "#9a8c7a" : "#2c2416" }}>
                    {n.message || n.messageAr || "New notification"}
                  </p>
                </div>

                {!n.isRead && <div style={styles.unreadDot} />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "32px 16px",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#2c2416",
    margin: 0,
    display: "flex",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#9a8c7a",
    margin: "4px 0 0",
  },
  unreadBadge: {
    background: "#8a6c2a",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 20,
    padding: "2px 8px",
    marginLeft: 8,
  },
  markAllBtn: {
    background: "transparent",
    border: "1px solid #c8b99a",
    borderRadius: 8,
    padding: "7px 14px",
    fontSize: 12.5,
    color: "#7a5a1a",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  tabs: {
    display: "flex",
    gap: 8,
    marginBottom: 20,
    borderBottom: "1px solid #e8e0d0",
    paddingBottom: 0,
  },
  tab: {
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    padding: "8px 16px",
    fontSize: 13,
    color: "#9a8c7a",
    cursor: "pointer",
    fontWeight: 500,
    marginBottom: -1,
    textTransform: "capitalize",
  },
  tabActive: {
    color: "#7a5a1a",
    borderBottom: "2px solid #8a6c2a",
    fontWeight: 700,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#9a8c7a",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "14px 16px",
    borderRadius: 12,
    border: "1px solid #e8e0d0",
    cursor: "pointer",
    transition: "box-shadow 0.15s",
    position: "relative",
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  typeBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: 20,
  },
  time: {
    fontSize: 11,
    color: "#b0a090",
    whiteSpace: "nowrap",
  },
  message: {
    fontSize: 13.5,
    lineHeight: 1.5,
    margin: 0,
    wordBreak: "break-word",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#8a6c2a",
    flexShrink: 0,
    marginTop: 6,
  },
};