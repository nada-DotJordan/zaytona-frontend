// src/admin/App.jsx
import { useState } from "react";
import { injectGlobalStyles } from "./styles/globalStyles";
import { useFarms } from "../api/api";

import Sidebar       from "./components/Sidebar";
import Topbar        from "./components/Topbar";
import Dashboard     from "./pages/Dashboard";
import Analytics     from "./pages/Analytics";
import Farms         from "./pages/Farms";
import Products      from "./pages/Products";
import Orders        from "./pages/Orders";
import Tracking      from "./pages/Tracking";
import Notifications from "./pages/Notifications";
import Customers     from "./pages/Customers";
import AdminReviews  from "./pages/AdminReviews"; // 1. استيراد صفحة التقييمات الجديدة ←

injectGlobalStyles();

export default function AdminApp() {
  const [active, setActive]          = useState("dashboard");
  const { farms, setFarms, loading } = useFarms();  // ← live from MongoDB

  const renderPage = () => {
    switch (active) {
      case "dashboard":     return <Dashboard />;
      case "analytics":     return <Analytics />;
      case "farms":         return <Farms farms={farms} setFarms={setFarms} />;
      case "products":      return <Products farms={farms} />;
      case "orders":        return <Orders />;
      case "tracking":      return <Tracking />;
      case "notifications": return <Notifications />;
      case "users":         return <Customers />;
      case "reviews":       return <AdminReviews />; // 2. إضافة الـ case الخاصة بالتقييمات ←
      default:              return <Dashboard />;
    }
  };

  return (
    <div className="za-layout">
      <Sidebar active={active} onNavigate={setActive} />
      <div className="za-main">
        <Topbar activeSection={active} />
        <div className="za-content">
          {loading ? (
            <p style={{ padding: 40, color: "#7a7a6e" }}>Loading...</p>
          ) : (
            renderPage()
          )}
        </div>
      </div>
    </div>
  );
}