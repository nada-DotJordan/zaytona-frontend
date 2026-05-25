import { useContext, useState, useRef, useEffect } from "react";
import { LanguageContext } from "../languages/LanguageContext";
import { translations } from "../languages/translations";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const BRAND_EN = "Zaytona";
const BRAND_AR = "زيتونة";

const NAV_BG = "#FFF8EC";
const ACTIVE_COLOR = "#546B41";
const BTN_COLOR = "#546B41";

const COLORS = {
  oliveDark: "#2c3d1f",
  oliveMid: "#3d5a27",
  oliveLight: "#6b8f47",
  cream: "#f5f0e8",
  border: "#e2d9c5",
  gold: "#c8a84b",
  textMuted: "#7a7a6e",
};

export default function Navbar() {
  const { lang, toggleLang } = useContext(LanguageContext);
  const { totalItems } = useCart();

  const { user, isAuthenticated, logout } = useAuth();

  const navigate = useNavigate();
  const isRtl = lang === "ar";

  const [dropOpen, setDropOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropRef = useRef(null);

  // ── Notifications ──
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchUnread() {
      try {
        const res = await api.get("/notifications");
        const data = Array.isArray(res.data) ? res.data : [];
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Notification error:", err);
      }
    }

    fetchUnread();
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    setDropOpen(false);
    logout();
    navigate("/");
  }

  function handleNotifClick() {
    setUnreadCount(0);
    navigate("/notifications");
  }

  const initials = user?.nameEn
    ? user.nameEn
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? ACTIVE_COLOR : "#1c2910",
    fontWeight: isActive ? "600" : "400",
    borderBottom: isActive
      ? `2px solid ${ACTIVE_COLOR}`
      : "2px solid transparent",
    paddingBottom: "3px",
    fontSize: "0.88rem",
  });

  return (
    <nav
      style={{
        backgroundColor: NAV_BG,
        borderBottom: "1px solid #e8e0cc",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 62,
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        <NavLink
          to="/"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <span style={{ fontWeight: 700, color: ACTIVE_COLOR }}>
            {isRtl ? BRAND_AR : BRAND_EN}
          </span>
        </NavLink>

        {/* ── NAV LINKS ── */}
        <div style={{ display: "flex", gap: 20 }}>
          <NavLink to="/" style={linkStyle}>
            {translations[lang].home}
          </NavLink>
          <NavLink to="/Products" style={linkStyle}>
            {isRtl ? "المنتجات" : "Products"}
          </NavLink>
          <NavLink to="/farms" style={linkStyle}>
            {translations[lang].farms}
          </NavLink>
          <NavLink to="/about" style={linkStyle}>
            {translations[lang].about}
          </NavLink>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button onClick={handleNotifClick}>
                🔔 {unreadCount > 0 && unreadCount}
              </button>

              {/* Cart */}
              <NavLink to="/cart">
                🛒 {totalItems > 0 && totalItems}
              </NavLink>

              {/* Profile */}
              <div ref={dropRef} style={{ position: "relative" }}>
                <button onClick={() => setDropOpen(!dropOpen)}>
                  {initials}
                </button>

                {dropOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      right: 0,
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      width: 200,
                    }}
                  >
                    <div style={{ padding: 10 }}>
                      <p>{user?.nameEn}</p>
                      <p style={{ fontSize: 12 }}>{user?.email}</p>
                    </div>

                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Login */}
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: BTN_COLOR,
                  color: "#fff",
                  border: "none",
                  padding: "7px 15px",
                  borderRadius: 6,
                }}
              >
                {translations[lang].signin}
              </button>

              {/* Language */}
              <button onClick={toggleLang}>🌐</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}