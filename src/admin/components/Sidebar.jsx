import React from "react";
import { navItems } from "../data/mockData";

export default function Sidebar({ active, onNavigate }) {
  const safeNavItems = navItems || [];

  return (
    <aside className="za-sidebar">
      <div className="za-brand">
        <div className="za-brand-name">
          Zaytona | زيتونة 
        </div>
        <div className="za-brand-sub">Admin Panel</div>
      </div>

      {safeNavItems.map((group) => {
        if (!group || !group.items) return null;
        return (
          <div key={group.section}>
            <div className="za-nav-section">{group.section}</div>
            {group.items.map((item) => (
              <div
                key={item.id}
                className={`za-nav-item${active === item.id ? " active" : ""}`}
                onClick={() => onNavigate && onNavigate(item.id)}
              >
                <i className={`bi ${item.icon}`} />
                {item.label}
              </div>
            ))}
          </div>
        );
      })}

      <div className="za-sidebar-footer">Zaytona v1.0 · Jordan 🇯🇴</div>
    </aside>
  );
}