import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useContext, useEffect } from "react";
import { LanguageContext } from "./languages/LanguageContext";
import { CartProvider } from "./context/CartContext";
import Navbar        from "./components/Navbar";
import Footer        from "./components/Footer";
import Home          from "./pages/Home";
import Products      from "./pages/Products";
import Farms         from "./pages/Farms";
import About         from "./pages/About";
import Auth          from "./pages/Auth";
import Admin         from "./admin/App";
import Cart          from "./pages/Cart";
import Tracking      from "./pages/Tracking";
import Privacy       from "./pages/Privacy";
import Terms         from "./pages/Terms";
import Notifications from "./pages/Notificationspage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Layout() {
  const { lang } = useContext(LanguageContext);
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith("/admin");

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <ScrollToTop />
      {!isAdmin && <Navbar />}

      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/Products"      element={<Products />} />
        <Route path="/farms"         element={<Farms />} />
        <Route path="/about"         element={<About />} />
        <Route path="/login"         element={<Auth />} />
        <Route path="/register"      element={<Auth />} />
        <Route path="/admin/*"       element={<Admin />} />
        <Route path="/cart"          element={<Cart />} />
        <Route path="/tracking"      element={<Tracking />} />
        <Route path="/privacy"       element={<Privacy />} />
        <Route path="/terms"         element={<Terms />} />
        <Route path="/notifications" element={<Notifications />} />
      </Routes>

      {!isAdmin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <Router>
          <Layout />
        </Router>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;