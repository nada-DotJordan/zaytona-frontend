import { useContext } from "react";
import { LanguageContext } from "../languages/LanguageContext";
import { NavLink } from "react-router-dom";

const COLORS = {
  oliveDark: "#2c3d1f",
  oliveMid:  "#3d5a27",
};

const TEXT = {
  en: {
    aboutTitle:   "About Us",
    aboutDesc:    "We are committed to providing high-quality olive oil with full transparency and honesty.",
    aboutLink:    "Learn more →",
    farmsTitle:   "Our Farms",
    farmsDesc:    "We collaborate with trusted farms that share our passion for quality and sustainability.",
    farmsLink:    "See our farms →",
    contactTitle: "Contact Us",
    contactEmail: "info@zaytona.com",
    contactPhone: "0797792805",
    contactLink:  "Get in touch →",
    privacy:      "Privacy Policy",
    terms:        "Terms of Service",
    rights:       "© 2026 Zaytona. All rights reserved.",
  },
  ar: {
    aboutTitle:   "من نحن",
    aboutDesc:    "نلتزم بتقديم زيت زيتون عالي الجودة بشفافية تامة وأمانة.",
    aboutLink:    "اعرف أكثر ←",
    farmsTitle:   "مزارعنا",
    farmsDesc:    "نتعاون مع مزارع موثوقة تشاركنا شغفنا بالجودة والاستدامة.",
    farmsLink:    "شاهد مزارعنا ←",
    contactTitle: "تواصل معنا",
    contactEmail: "info@zaytona.com",
    contactPhone: "0797792805",
    contactLink:  "تواصل الآن ←",
    privacy:      "سياسة الخصوصية",
    terms:        "شروط الخدمة",
    rights:       "© ٢٠٢٦ زيتونة. جميع الحقوق محفوظة.",
  },
};

const footerLink = {
  fontSize: "0.82rem",
  color: "rgba(255,255,255,0.6)",
  textDecoration: "none",
};

export default function Footer() {
  const { lang } = useContext(LanguageContext);
  const t = TEXT[lang];

  return (
    <footer style={{ background: COLORS.oliveDark, padding: "60px 0 30px" }}>
      <div className="container">
        <div className="row g-4">

          {/* About */}
          <div className="col-md-4">
            <h5 style={{ fontFamily: "Georgia, serif", color: "#fff", marginBottom: 10 }}>{t.aboutTitle}</h5>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{t.aboutDesc}</p>
            <NavLink to="/about" style={footerLink}>{t.aboutLink}</NavLink>
          </div>

          {/* Farms */}
          <div className="col-md-4">
            <h5 style={{ fontFamily: "Georgia, serif", color: "#fff", marginBottom: 10 }}>{t.farmsTitle}</h5>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>{t.farmsDesc}</p>
            <NavLink to="/farms" style={footerLink}>{t.farmsLink}</NavLink>
          </div>

          {/* Contact */}
          <div className="col-md-4">
            <h5 style={{ fontFamily: "Georgia, serif", color: "#fff", marginBottom: 10 }}>{t.contactTitle}</h5>
            <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.8 }}>
              Email: {t.contactEmail}<br />
              Phone: {t.contactPhone}
            </p>
            <a href={`mailto:${t.contactEmail}`} style={footerLink}>{t.contactLink}</a>
          </div>

        </div>

        {/* Bottom bar */}
        <hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "30px 0 20px" }} />
        <div className="d-flex justify-content-between flex-wrap gap-2">
          <span style={{ fontSize: "0.76rem", color: "rgba(255,255,255,0.45)" }}>{t.rights}</span>
          <div className="d-flex gap-3">
            <NavLink to="/privacy" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{t.privacy}</NavLink>
            <NavLink to="/terms"   style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{t.terms}</NavLink>
          </div>
        </div>

      </div>
    </footer>
  );
}