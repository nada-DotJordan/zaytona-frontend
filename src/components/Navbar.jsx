import { useContext, useState, useRef, useEffect } from "react";
import { LanguageContext } from "../languages/LanguageContext";
import { translations } from "../languages/translations";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const BRAND_EN     = "Zaytona";
const BRAND_AR     = "زيتونة";
const NAV_BG       = "#FFF8EC";
const ACTIVE_COLOR = "#546B41";
const BTN_COLOR    = "#546B41";
const COLORS = {
  oliveDark:  "#2c3d1f",
  oliveMid:   "#3d5a27",
  oliveLight: "#6b8f47",
  cream:      "#f5f0e8",
  border:     "#e2d9c5",
  textDark:   "#1c2910",
  textMuted:  "#7a7a6e",
  gold:       "#c8a84b",
};

export default function Navbar() {
  const { lang, toggleLang } = useContext(LanguageContext);
  const { totalItems }       = useCart();
  const { user, logout }     = useAuth();
  const navigate             = useNavigate();
  const isLoggedIn           = !!user;
  const isRtl                = lang === "ar";

  const [dropOpen, setDropOpen]         = useState(false);
  const [unreadCount, setUnreadCount]   = useState(0);
  const dropRef                         = useRef(null);

  // ── جلب عدد الإشعارات الغير مقروءة ──
  useEffect(() => {
    if (!isLoggedIn) return;

    async function fetchUnread() {
      try {
        const res = await api.get("/notifications");
        const data = Array.isArray(res.data) ? res.data : [];
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch (err) {
        console.error("Failed to fetch notifications count:", err);
      }
    }

    fetchUnread();

    // تحديث العداد كل 60 ثانية تلقائياً
    const interval = setInterval(fetchUnread, 60000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color: isActive ? ACTIVE_COLOR : "#1c2910",
    fontWeight: isActive ? "600" : "400",
    borderBottom: isActive ? `2px solid ${ACTIVE_COLOR}` : "2px solid transparent",
    paddingBottom: "3px",
    fontSize: "0.88rem",
    whiteSpace: "nowrap",
    transition: "color 0.2s, border-color 0.2s",
  });

  function handleLogout() {
    setDropOpen(false);
    logout();
    navigate("/");
  }

  // لما يضغط على زر الإشعارات — يروح للصفحة ويصفّر العداد
  function handleNotifClick() {
    setUnreadCount(0);
    navigate("/notifications");
  }

  const initials = user?.nameEn
    ? user.nameEn.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <nav style={{
      backgroundColor: NAV_BG,
      borderBottom: "1px solid #e8e0cc",
      position: "sticky", top: 0, zIndex: 100,
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        height: 62,
        direction: isRtl ? "rtl" : "ltr",
      }}>

        {/* ── LOGO ── */}
        <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="18" fill="#3d5a27" />
            <path d="M18 8c0 0-8 5-8 12a8 8 0 0016 0c0-7-8-12-8-12z" fill="#6b8f47" />
            <path d="M18 8v20" stroke="#c8a84b" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.2rem", color: ACTIVE_COLOR }}>
            {isRtl ? BRAND_AR : BRAND_EN}
          </span>
        </NavLink>

        {/* ── NAV LINKS ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <NavLink to="/" end style={linkStyle}>{translations[lang].home}</NavLink>
          <NavLink to="/Products" style={linkStyle}>{isRtl ? "المنتجات" : "Products"}</NavLink>
          <NavLink to="/farms" style={linkStyle}>{translations[lang].farms}</NavLink>
          <NavLink to="/about" style={linkStyle}>{translations[lang].about}</NavLink>
          <NavLink to="/tracking" style={linkStyle}>{isRtl ? "رحلة الزيت" : "Oil Journey"}</NavLink>
        </div>

        {/* ── RIGHT ACTIONS ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>

          {isLoggedIn ? (
            <>
              {/* ── NOTIFICATIONS BELL ── */}
              <button
                onClick={handleNotifClick}
                title={isRtl ? "الإشعارات" : "Notifications"}
                style={{
                  position: "relative",
                  background: "none",
                  border: `1.5px solid ${COLORS.border}`,
                  borderRadius: 8,
                  width: 36, height: 36,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                  color: COLORS.oliveDark,
                  transition: "border-color 0.2s",
                }}
              >
                {/* Bell icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke={COLORS.oliveDark} strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>

                {/* عداد الإشعارات الغير مقروءة */}
                {unreadCount > 0 && (
                  <span style={{
                    position: "absolute",
                    top: -5, right: -5,
                    background: "#c0392b",
                    color: "#fff",
                    fontSize: "0.58rem",
                    fontWeight: 800,
                    minWidth: 17, height: 17,
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "0 3px",
                    border: "2px solid #FFF8EC",
                  }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* ── CART ── */}
              <NavLink to="/cart" style={{ textDecoration: "none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  border: `1.5px solid ${BTN_COLOR}`, borderRadius: 7,
                  padding: "6px 12px", color: BTN_COLOR,
                  fontWeight: 600, fontSize: "0.84rem",
                  cursor: "pointer", position: "relative", background: "none",
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={BTN_COLOR} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {isRtl ? "السلة" : "Cart"}
                  {totalItems > 0 && (
                    <span style={{
                      position: "absolute", top: -7, right: -7,
                      background: COLORS.gold, color: "#fff",
                      fontSize: "0.58rem", fontWeight: 800,
                      width: 17, height: 17, borderRadius: "50%",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </div>
              </NavLink>

              {/* ── PROFILE DROPDOWN ── */}
              <div ref={dropRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen(o => !o)}
                  style={{
                    width: 36, height: 36,
                    borderRadius: "50%",
                    background: COLORS.oliveDark,
                    border: `2px solid ${dropOpen ? COLORS.gold : "transparent"}`,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "border-color 0.2s",
                    flexShrink: 0,
                  }}
                >
                  {initials}
                </button>

                {dropOpen && (
                  <div style={{
                    position: "absolute",
                    top: "calc(100% + 10px)",
                    right: isRtl ? "auto" : 0,
                    left: isRtl ? 0 : "auto",
                    width: 260,
                    background: "#fff",
                    borderRadius: 12,
                    border: `1px solid ${COLORS.border}`,
                    boxShadow: "0 8px 32px rgba(44,61,31,0.13)",
                    overflow: "hidden",
                    zIndex: 200,
                  }}>

                    {/* Profile header */}
                    <div style={{
                      background: `linear-gradient(135deg, ${COLORS.oliveDark}, ${COLORS.oliveMid})`,
                      padding: "20px 16px 16px",
                      textAlign: "center",
                    }}>
                      <div style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: COLORS.gold,
                        color: "#fff", fontWeight: 700, fontSize: "1.3rem",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 10px",
                        border: "3px solid rgba(255,255,255,0.3)",
                      }}>
                        {initials}
                      </div>
                      <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", margin: 0 }}>
                        {user.nameEn}
                      </p>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem", margin: "2px 0 0" }}>
                        {user.email}
                      </p>
                      {user.role === "admin" && (
                        <span style={{
                          display: "inline-block", marginTop: 6,
                          background: COLORS.gold, color: "#fff",
                          fontSize: "0.58rem", fontWeight: 700,
                          padding: "2px 8px", borderRadius: 20,
                          letterSpacing: "1px", textTransform: "uppercase",
                        }}>
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Menu items */}
                    <div style={{ padding: "8px 0" }}>

                      {/* Notifications في الـ dropdown أيضاً مع العداد */}
                      <button
                        onClick={() => { setDropOpen(false); handleNotifClick(); }}
                        style={menuItemStyle}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                          stroke={COLORS.textMuted} strokeWidth="2"
                          strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        <span>{isRtl ? "الإشعارات" : "Notifications"}</span>
                        {unreadCount > 0 && (
                          <span style={{
                            marginLeft: "auto",
                            background: "#c0392b",
                            color: "#fff", fontSize: "0.62rem", fontWeight: 700,
                            padding: "1px 7px", borderRadius: 20,
                          }}>
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      {/* Cart */}
                      <button
                        onClick={() => { setDropOpen(false); navigate("/cart"); }}
                        style={menuItemStyle}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                        <span>{isRtl ? "السلة" : "My Cart"}</span>
                        {totalItems > 0 && (
                          <span style={{
                            marginLeft: "auto", background: COLORS.gold,
                            color: "#fff", fontSize: "0.62rem", fontWeight: 700,
                            padding: "1px 7px", borderRadius: 20,
                          }}>
                            {totalItems}
                          </span>
                        )}
                      </button>

                      {user.role === "admin" && (
                        <button
                          onClick={() => { setDropOpen(false); navigate("/admin"); }}
                          style={menuItemStyle}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                          </svg>
                          <span>{isRtl ? "لوحة الإدارة" : "Admin Panel"}</span>
                        </button>
                      )}

                      <div style={{ height: 1, background: COLORS.border, margin: "6px 0" }} />

                      {/* Language toggle */}
                      <button
                        onClick={() => { toggleLang(); setDropOpen(false); }}
                        style={menuItemStyle}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="2" y1="12" x2="22" y2="12"/>
                          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                        </svg>
                        <span>{isRtl ? "English" : "العربية"}</span>
                      </button>

                      {/* Sign Out */}
                      <button
                        onClick={handleLogout}
                        style={{ ...menuItemStyle, color: "#c0392b" }}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>{isRtl ? "تسجيل الخروج" : "Sign Out"}</span>
                      </button>

                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  backgroundColor: BTN_COLOR, color: "#fff",
                  border: "none", borderRadius: 7,
                  padding: "7px 18px", fontSize: "0.88rem",
                  fontWeight: 600, cursor: "pointer",
                }}
              >
                {translations[lang].signin}
              </button>

              <button
                onClick={toggleLang}
                style={{
                  background: "none", border: `1px solid #ccc`,
                  borderRadius: 7, padding: "6px 12px",
                  fontSize: "0.82rem", cursor: "pointer",
                  color: "#555", fontWeight: 600,
                }}
              >
                {isRtl ? "EN" : "AR"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

const menuItemStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 16px",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "0.83rem",
  color: "#1c2910",
  textAlign: "left",
  transition: "background 0.15s",
  fontFamily: "inherit",
};