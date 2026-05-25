import { useContext, useState, useRef, useEffect } from "react";
import { LanguageContext } from "../languages/LanguageContext";
import { translations } from "../languages/translations";
import { NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const BRAND_EN = "Zaytona";
const BRAND_AR = "زيتونة";

const C = {
  navBg:      "#FFF8EC",
  oliveDark:  "#546B41",
  oliveMid:   "#3d5a27",
  oliveLight: "#99AD7A",
  cream:      "#DCCCAC",
  border:     "#e8e0cc",
  gold:       "#b89a4e",
  textDark:   "#1c2910",
  textMuted:  "#7a7a6e",
};

 if (!document.getElementById("zay-gfont")) {
  const l = document.createElement("link");
  l.id   = "zay-gfont";
  l.rel  = "stylesheet";
  l.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&display=swap";
  document.head.appendChild(l);
}

export default function Navbar() {
  const { lang, toggleLang } = useContext(LanguageContext);
  const { totalItems }       = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isRtl    = lang === "ar";

  const [dropOpen,     setDropOpen]     = useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [scrolled,     setScrolled]     = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchUnread() {
      try {
        const res  = await api.get("/notifications");
        const data = Array.isArray(res.data) ? res.data : [];
        setUnreadCount(data.filter((n) => !n.isRead).length);
      } catch {}
    }
    fetchUnread();
    const iv = setInterval(fetchUnread, 60000);
    return () => clearInterval(iv);
  }, [isAuthenticated]);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    ? user.nameEn.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const linkStyle = ({ isActive }) => ({
    textDecoration: "none",
    color:      isActive ? C.oliveDark : C.textDark,
    fontWeight: isActive ? 600 : 400,
    fontSize:   "0.87rem",
    letterSpacing: "0.01em",
    paddingBottom: 3,
    borderBottom: isActive ? `2px solid ${C.oliveDark}` : "2px solid transparent",
    transition: "color .15s, border-color .15s",
  });

  const iconBtn = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "6px 8px",
    borderRadius: 6,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: C.textDark,
    fontSize: 17,
    position: "relative",
    transition: "background .15s",
  };

  const badge = {
    position: "absolute",
    top: 2, right: 2,
    minWidth: 16, height: 16,
    borderRadius: 10,
    background: C.oliveDark,
    color: "#fff",
    fontSize: 9,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
    lineHeight: 1,
  };

  return (
    <nav style={{
      backgroundColor: C.navBg,
      borderBottom: `1px solid ${C.border}`,
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: scrolled ? "0 2px 16px rgba(84,107,65,.10)" : "none",
      transition: "box-shadow .2s",
    }}>
      <div className="container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 62,
        direction: isRtl ? "rtl" : "ltr",
      }}>

        <NavLink to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 8, height: 8, borderRadius: "50%",
            background: C.oliveDark, display: "inline-block", marginTop: 1,
          }} />
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 700,
            fontSize: "1.22rem",
            color: C.oliveDark,
            letterSpacing: "0.03em",
          }}>
            {isRtl ? BRAND_AR : BRAND_EN}
          </span>
        </NavLink>

        <div style={{ display: "flex", gap: 24 }}>
          <NavLink to="/"         style={linkStyle}>{translations[lang].home}</NavLink>
          <NavLink to="/Products" style={linkStyle}>{isRtl ? "المنتجات" : "Products"}</NavLink>
          <NavLink to="/farms"    style={linkStyle}>{translations[lang].farms}</NavLink>
          <NavLink to="/about"    style={linkStyle}>{translations[lang].about}</NavLink>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>

          {isAuthenticated ? (
            <>
              <button
                style={iconBtn}
                onClick={handleNotifClick}
                title="Notifications"
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0ece2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
              </button>

              <NavLink to="/cart" style={{ ...iconBtn, textDecoration: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0ece2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none"
                  stroke={C.textDark} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9"  cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                {totalItems > 0 && <span style={badge}>{totalItems}</span>}
              </NavLink>

              <div ref={dropRef} style={{ position: "relative", marginLeft: 4 }}>
                <button
                  onClick={() => setDropOpen((v) => !v)}
                  style={{
                    width: 34, height: 34,
                    borderRadius: "50%",
                    background: C.oliveDark,
                    border: `2px solid ${C.cream}`,
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    letterSpacing: "0.04em",
                    transition: "border-color .15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = C.gold)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.cream)}
                >
                  {initials}
                </button>

                {dropOpen && (
                  <div style={{
                    position: "absolute",
                    top: 42,
                    right: isRtl ? "auto" : 0,
                    left:  isRtl ? 0 : "auto",
                    background: "#fff",
                    border: `1px solid ${C.border}`,
                    borderRadius: 10,
                    width: 210,
                    boxShadow: "0 8px 24px rgba(0,0,0,.10)",
                    overflow: "hidden",
                    zIndex: 200,
                  }}>
                    {/* User info */}
                    <div style={{
                      padding: "14px 16px 12px",
                      borderBottom: `1px solid ${C.border}`,
                      background: "#fdfaf4",
                    }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5, color: C.textDark }}>
                        {user?.nameEn}
                      </p>
                      <p style={{ margin: "3px 0 0", fontSize: 11.5, color: C.textMuted }}>
                        {user?.email}
                      </p>
                    </div>

                    <button
                      onClick={() => { toggleLang(); setDropOpen(false); }}
                      style={{
                        width: "100%", textAlign: isRtl ? "right" : "left",
                        background: "none", border: "none",
                        padding: "11px 16px",
                        fontSize: 13, color: C.textDark,
                        cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                        borderBottom: `1px solid ${C.border}`,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf7ef")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <span>🌐</span>
                      {lang === "en" ? "العربية" : "English"}
                    </button>

                    <button
                      onClick={handleLogout}
                      style={{
                        width: "100%", textAlign: isRtl ? "right" : "left",
                        background: "none", border: "none",
                        padding: "11px 16px",
                        fontSize: 13, color: "#b33",
                        cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#fff5f5")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      {isRtl ? "تسجيل الخروج" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                style={{
                  background: C.oliveDark,
                  color: "#fff",
                  border: "none",
                  padding: "7px 18px",
                  borderRadius: 5,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  letterSpacing: "0.03em",
                  transition: "background .15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.oliveMid)}
                onMouseLeave={(e) => (e.currentTarget.style.background = C.oliveDark)}
              >
                {translations[lang].signin}
              </button>

              <button
                onClick={toggleLang}
                style={{
                  ...iconBtn,
                  fontSize: 13,
                  fontWeight: 600,
                  color: C.textMuted,
                  border: `1px solid ${C.border}`,
                  padding: "5px 10px",
                  borderRadius: 5,
                  marginLeft: 4,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0ece2")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                {lang === "en" ? "ع" : "EN"}
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}