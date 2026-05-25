import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../styles/colors";
import { sectionTitles } from "../data/mockData";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ activeSection }) {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  const displayTitle = sectionTitles[activeSection] || "Management Panel";
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric",
  });

  const initials = user?.nameEn
    ? user.nameEn.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "AD";

  useEffect(() => {
    function handle(e) {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className="za-topbar">
      <div className="za-topbar-title">{displayTitle}</div>

      <div className="za-topbar-right">
        <span style={{ fontSize: 12, color: COLORS.textMuted }}>
          {formattedDate}
        </span>

        <button
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none",
            border: `1px solid ${COLORS.border || "#e2d9c5"}`,
            borderRadius: 7, padding: "5px 12px",
            fontSize: "0.78rem", color: COLORS.textMuted,
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = COLORS.oliveDark || "#2c3d1f";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.borderColor = COLORS.oliveDark || "#2c3d1f";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "none";
            e.currentTarget.style.color = COLORS.textMuted;
            e.currentTarget.style.borderColor = COLORS.border || "#e2d9c5";
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          View Site
        </button>

        <div ref={dropRef} style={{ position: "relative" }}>
          <button
            onClick={() => setDropOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "none", border: "none", cursor: "pointer",
              padding: "4px 6px", borderRadius: 8,
              transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "none"}
          >
            <div className="za-avatar-sm" style={{
              background: COLORS.oliveDark || "#2c3d1f",
              color: "#fff", fontWeight: 700,
              border: dropOpen ? `2px solid ${COLORS.gold || "#c8a84b"}` : "2px solid transparent",
              transition: "border-color 0.2s",
            }}>
              {initials}
            </div>
            <div style={{ textAlign: "left" }}>
              <p style={{ fontSize: "0.76rem", fontWeight: 600, color: COLORS.textDark || "#1c2910", margin: 0, lineHeight: 1.2 }}>
                {user?.nameEn || "Admin"}
              </p>
              <p style={{ fontSize: "0.66rem", color: COLORS.textMuted, margin: 0 }}>
                Administrator
              </p>
            </div>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.textMuted} strokeWidth="2.5"
              style={{ transform: dropOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {dropOpen && (
            <div style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 220, background: "#fff",
              borderRadius: 12, border: `1px solid #e2d9c5`,
              boxShadow: "0 8px 32px rgba(44,61,31,0.13)",
              overflow: "hidden", zIndex: 300,
            }}>
              <div style={{
                background: `linear-gradient(135deg, ${COLORS.oliveDark || "#2c3d1f"}, ${COLORS.oliveMid || "#3d5a27"})`,
                padding: "14px 16px",
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: COLORS.gold || "#c8a84b",
                  color: "#fff", fontWeight: 700, fontSize: "1rem",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 8, border: "2px solid rgba(255,255,255,0.3)",
                }}>
                  {initials}
                </div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: "0.84rem", margin: 0 }}>
                  {user?.nameEn || "Admin"}
                </p>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", margin: "2px 0 0" }}>
                  {user?.email}
                </p>
              </div>

              <div style={{ padding: "6px 0" }}>

                {/* Go to main site */}
                <DropItem
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                  label="View Main Site"
                  onClick={() => { setDropOpen(false); navigate("/"); }}
                />

                <DropItem
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>}
                  label="Browse Products"
                  onClick={() => { setDropOpen(false); navigate("/Products"); }}
                />

                <DropItem
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
                  label="Browse Farms"
                  onClick={() => { setDropOpen(false); navigate("/farms"); }}
                />

                <div style={{ height: 1, background: "#e2d9c5", margin: "6px 0" }} />

                <DropItem
                  icon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>}
                  label="Sign Out"
                  onClick={handleLogout}
                  red
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DropItem({ icon, label, onClick, red }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "8px 16px", background: hovered ? "#f5f0e8" : "none",
        border: "none", cursor: "pointer", fontSize: "0.8rem",
        color: red ? "#c0392b" : "#1c2910",
        textAlign: "left", fontFamily: "inherit",
        transition: "background 0.15s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}