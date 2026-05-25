import { useContext } from "react";
import { LanguageContext } from "../languages/LanguageContext";
import hero from "../assets/hero.jpg";

const COLORS = {
  oliveDark:  "#2c3d1f",
  oliveMid:   "#3d5a27",
  oliveLight: "#6b8f47",
  cream:      "#f5f0e8",
  warmWhite:  "#faf8f3",
  gold:       "#c8a84b",
  border:     "#e2d9c5",
  textDark:   "#1c2910",
  textMuted:  "#7a7a6e",
};

const TEXT = {
  en: {
    heroLabel: "ZAYTONA",
    title:     "Privacy Policy",
    subtitle:  "Your trust matters to us. Here's how we handle your data.",
    updated:   "Last updated: May 2026",
    sections: [
      {
        title: "1. Information We Collect",
        body:  "We collect information you provide when creating an account, placing orders, or contacting us. This includes your name, email address, phone number, and delivery address. We also collect usage data such as pages visited and products viewed to improve your experience.",
      },
      {
        title: "2. How We Use Your Information",
        body:  "We use your information to process and fulfill your orders, send you order updates and tracking information, improve our platform and services, and communicate with you about new products or offers (only with your consent).",
      },
      {
        title: "3. Data Sharing",
        body:  "We do not sell or rent your personal data to third parties. We may share your information with delivery partners solely for the purpose of fulfilling your order, and with payment processors to handle transactions securely.",
      },
      {
        title: "4. Data Security",
        body:  "We implement industry-standard security measures including encrypted connections (HTTPS), hashed passwords, and secure database storage. While no system is 100% secure, we take every reasonable precaution to protect your data.",
      },
      {
        title: "5. Cookies",
        body:  "We use essential cookies to keep you signed in and remember your cart. We do not use advertising or tracking cookies. You can disable cookies in your browser settings, though some features may not function correctly.",
      },
      {
        title: "6. Your Rights",
        body:  "You have the right to access, correct, or delete your personal data at any time. To exercise these rights, contact us at info@zaytona.com. We will respond within 7 business days.",
      },
      {
        title: "7. Changes to This Policy",
        body:  "We may update this policy from time to time. We will notify you of significant changes via email or a notice on our platform. Continued use of Zaytona after changes constitutes acceptance of the updated policy.",
      },
      {
        title: "8. Contact",
        body:  "For any privacy-related questions, reach us at info@zaytona.com or call +962 797 792 805.",
      },
    ],
  },
  ar: {
    heroLabel: "زيتونة",
    title:     "سياسة الخصوصية",
    subtitle:  "ثقتك تهمنا. إليك كيف نتعامل مع بياناتك.",
    updated:   "آخر تحديث: مايو ٢٠٢٦",
    sections: [
      {
        title: "١. المعلومات التي نجمعها",
        body:  "نجمع المعلومات التي تقدمها عند إنشاء حساب أو تقديم طلب أو التواصل معنا، وتشمل اسمك وبريدك الإلكتروني ورقم هاتفك وعنوان التوصيل. كما نجمع بيانات الاستخدام مثل الصفحات التي تزورها والمنتجات التي تتصفحها لتحسين تجربتك.",
      },
      {
        title: "٢. كيف نستخدم معلوماتك",
        body:  "نستخدم معلوماتك لمعالجة طلباتك وتنفيذها، وإرسال تحديثات الطلب ومعلومات التتبع، وتحسين منصتنا وخدماتنا، والتواصل معك بشأن المنتجات أو العروض الجديدة (بموافقتك فقط).",
      },
      {
        title: "٣. مشاركة البيانات",
        body:  "نحن لا نبيع بياناتك الشخصية أو نؤجرها لأطراف ثالثة. قد نشارك معلوماتك مع شركاء التوصيل لتنفيذ طلبك فقط، ومع معالجي الدفع لإتمام المعاملات بأمان.",
      },
      {
        title: "٤. أمان البيانات",
        body:  "نطبق معايير أمان متوافقة مع المعايير الصناعية، تشمل الاتصالات المشفرة (HTTPS) وكلمات المرور المشفرة والتخزين الآمن في قاعدة البيانات. رغم أنه لا يوجد نظام آمن بنسبة 100٪، فإننا نتخذ كل احتياط معقول لحماية بياناتك.",
      },
      {
        title: "٥. ملفات تعريف الارتباط (Cookies)",
        body:  "نستخدم ملفات تعريف الارتباط الأساسية لإبقائك مسجلاً للدخول وتذكر سلة مشترياتك. لا نستخدم ملفات تعريف الارتباط الإعلانية أو التتبعية. يمكنك تعطيلها من إعدادات متصفحك، وإن كان ذلك قد يؤثر على بعض الميزات.",
      },
      {
        title: "٦. حقوقك",
        body:  "لك الحق في الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها في أي وقت. للقيام بذلك، تواصل معنا عبر info@zaytona.com وسنرد في غضون ٧ أيام عمل.",
      },
      {
        title: "٧. التغييرات على هذه السياسة",
        body:  "قد نحدث هذه السياسة من وقت لآخر. سنعلمك بالتغييرات الجوهرية عبر البريد الإلكتروني أو إشعار على المنصة. استمرارك في استخدام زيتونة بعد التغييرات يعني قبولك للسياسة المحدثة.",
      },
      {
        title: "٨. التواصل",
        body:  "لأي أسئلة تتعلق بالخصوصية، تواصل معنا على info@zaytona.com أو اتصل على +962 797 792 805.",
      },
    ],
  },
};

export default function Privacy() {
  const { lang } = useContext(LanguageContext);
  const t        = TEXT[lang];
  const isRtl    = lang === "ar";

  return (
    <div style={{ background: COLORS.warmWhite, minHeight: "100vh" }} dir={isRtl ? "rtl" : "ltr"}>

      {/* HERO */}
      <div style={{
        background: `linear-gradient(rgba(30,50,20,0.82), rgba(30,50,20,0.82)), url(${hero}) center/cover no-repeat`,
        padding: "70px 0 50px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.7rem", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 10 }}>
          {t.heroLabel}
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.8rem, 4vw, 3rem)", color: "#fff", marginBottom: 14 }}>
          {t.title}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.9rem", maxWidth: 520, margin: "0 auto" }}>
          {t.subtitle}
        </p>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "52px 24px 80px" }}>

        <p style={{ fontSize: "0.78rem", color: COLORS.textMuted, marginBottom: 36, fontStyle: "italic" }}>
          {t.updated}
        </p>

        {t.sections.map((s, i) => (
          <div key={i} style={{ marginBottom: 36 }}>
            <h3 style={{
              fontFamily: "Georgia, serif",
              fontSize: "1.05rem",
              color: COLORS.oliveDark,
              marginBottom: 10,
              paddingBottom: 8,
              borderBottom: `1px solid ${COLORS.border}`,
            }}>
              {s.title}
            </h3>
            <p style={{
              fontSize: "0.88rem",
              color: COLORS.textMuted,
              lineHeight: 1.85,
              margin: 0,
            }}>
              {s.body}
            </p>
          </div>
        ))}

        <div style={{
          background: COLORS.cream,
          border: `1px solid ${COLORS.border}`,
          borderRadius: 12,
          padding: "20px 24px",
          marginTop: 20,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}>
          <span style={{ fontSize: "1.5rem" }}>🫒</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.88rem", color: COLORS.oliveDark, margin: 0 }}>
              {lang === "en" ? "Questions about your data?" : "أسئلة حول بياناتك؟"}
            </p>
            <a href="mailto:info@zaytona.com" style={{ fontSize: "0.82rem", color: COLORS.oliveMid, textDecoration: "none" }}>
              info@zaytona.com
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}