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
    title:     "Terms of Service",
    subtitle:  "Please read these terms carefully before using Zaytona.",
    updated:   "Last updated: May 2026",
    sections: [
      {
        title: "1. Acceptance of Terms",
        body:  "By accessing or using Zaytona, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. We reserve the right to update these terms at any time.",
      },
      {
        title: "2. Use of the Platform",
        body:  "Zaytona is an olive oil marketplace connecting customers with trusted farms. You may use our platform for personal, non-commercial purposes only. You agree not to misuse our services, attempt unauthorized access, or engage in any activity that disrupts the platform.",
      },
      {
        title: "3. Account Responsibility",
        body:  "You are responsible for maintaining the confidentiality of your account credentials. Any activity that occurs under your account is your responsibility. Please notify us immediately at info@zaytona.com if you suspect unauthorized use of your account.",
      },
      {
        title: "4. Orders & Payments",
        body:  "All orders are subject to availability. Prices are displayed in Jordanian Dinars (JD) and include applicable taxes. We reserve the right to cancel orders in cases of pricing errors or stock issues, with a full refund issued promptly.",
      },
      {
        title: "5. Delivery",
        body:  "We aim to deliver all orders within 3–5 business days within Jordan. Delivery times may vary based on your location and product availability. Zaytona is not liable for delays caused by circumstances beyond our control.",
      },
      {
        title: "6. Returns & Refunds",
        body:  "If your order arrives damaged or incorrect, please contact us within 48 hours of delivery. We will arrange a replacement or full refund. Opened products cannot be returned unless there is a quality issue.",
      },
      {
        title: "7. Product Accuracy",
        body:  "We strive to ensure all product information — including farm origin, harvest year, and pricing — is accurate and up to date. However, we cannot guarantee that all details are error-free at all times.",
      },
      {
        title: "8. Intellectual Property",
        body:  "All content on Zaytona, including logos, text, images, and design, is owned by Zaytona or its content partners and is protected by applicable intellectual property laws. You may not reproduce or distribute our content without written permission.",
      },
      {
        title: "9. Limitation of Liability",
        body:  "Zaytona is not liable for indirect, incidental, or consequential damages arising from your use of the platform. Our liability is limited to the amount paid for the specific order in question.",
      },
      {
        title: "10. Governing Law",
        body:  "These terms are governed by the laws of the Hashemite Kingdom of Jordan. Any disputes shall be resolved in the courts of Amman, Jordan.",
      },
      {
        title: "11. Contact",
        body:  "For questions about these terms, contact us at info@zaytona.com or call +962 797 792 805.",
      },
    ],
  },
  ar: {
    heroLabel: "زيتونة",
    title:     "شروط الخدمة",
    subtitle:  "يرجى قراءة هذه الشروط بعناية قبل استخدام زيتونة.",
    updated:   "آخر تحديث: مايو ٢٠٢٦",
    sections: [
      {
        title: "١. قبول الشروط",
        body:  "بالوصول إلى زيتونة أو استخدامها، فإنك توافق على الالتزام بشروط الخدمة هذه. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام منصتنا. نحتفظ بحق تحديث هذه الشروط في أي وقت.",
      },
      {
        title: "٢. استخدام المنصة",
        body:  "زيتونة هي سوق لزيت الزيتون يربط العملاء بالمزارع الموثوقة. يمكنك استخدام منصتنا للأغراض الشخصية غير التجارية فقط. توافق على عدم إساءة استخدام خدماتنا أو محاولة الوصول غير المصرح به أو الانخراط في أي نشاط يعطل المنصة.",
      },
      {
        title: "٣. مسؤولية الحساب",
        body:  "أنت مسؤول عن الحفاظ على سرية بيانات حسابك. أي نشاط يحدث تحت حسابك هو مسؤوليتك. يرجى إخطارنا فوراً على info@zaytona.com إذا اشتبهت في استخدام غير مصرح به لحسابك.",
      },
      {
        title: "٤. الطلبات والمدفوعات",
        body:  "جميع الطلبات خاضعة للتوفر. الأسعار معروضة بالدينار الأردني وتشمل الضرائب المعمول بها. نحتفظ بحق إلغاء الطلبات في حالات أخطاء التسعير أو مشكلات المخزون، مع استرداد كامل المبلغ فوراً.",
      },
      {
        title: "٥. التوصيل",
        body:  "نهدف إلى توصيل جميع الطلبات خلال ٣-٥ أيام عمل داخل الأردن. قد تختلف مواعيد التوصيل حسب موقعك وتوفر المنتج. زيتونة غير مسؤولة عن التأخيرات الناجمة عن ظروف خارجة عن إرادتنا.",
      },
      {
        title: "٦. الإرجاع والاسترداد",
        body:  "إذا وصل طلبك تالفاً أو غير صحيح، يرجى التواصل معنا خلال ٤٨ ساعة من التوصيل. سنرتب لاستبداله أو استرداد المبلغ كاملاً. لا يمكن إرجاع المنتجات المفتوحة إلا في حالة وجود مشكلة في الجودة.",
      },
      {
        title: "٧. دقة المنتجات",
        body:  "نسعى لضمان دقة جميع معلومات المنتج — بما في ذلك مصدر المزرعة وموسم الحصاد والأسعار — وتحديثها. ومع ذلك، لا نستطيع ضمان خلوها من الأخطاء في جميع الأوقات.",
      },
      {
        title: "٨. الملكية الفكرية",
        body:  "جميع المحتويات على زيتونة، بما في ذلك الشعارات والنصوص والصور والتصميم، مملوكة لزيتونة أو شركاء المحتوى ومحمية بقوانين الملكية الفكرية المعمول بها. لا يجوز لك استنساخ أو توزيع محتوانا دون إذن كتابي.",
      },
      {
        title: "٩. تحديد المسؤولية",
        body:  "زيتونة غير مسؤولة عن الأضرار غير المباشرة أو العرضية أو التبعية الناجمة عن استخدامك للمنصة. تقتصر مسؤوليتنا على المبلغ المدفوع للطلب المحدد المعني.",
      },
      {
        title: "١٠. القانون الحاكم",
        body:  "تخضع هذه الشروط لقوانين المملكة الأردنية الهاشمية. تُحسم أي نزاعات في محاكم عمّان، الأردن.",
      },
      {
        title: "١١. التواصل",
        body:  "لأي أسئلة حول هذه الشروط، تواصل معنا على info@zaytona.com أو اتصل على +962 797 792 805.",
      },
    ],
  },
};

export default function Terms() {
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

      {/* CONTENT */}
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

        {/* Contact box */}
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
          <span style={{ fontSize: "1.5rem" }}>📜</span>
          <div>
            <p style={{ fontWeight: 700, fontSize: "0.88rem", color: COLORS.oliveDark, margin: 0 }}>
              {lang === "en" ? "Questions about our terms?" : "أسئلة حول شروطنا؟"}
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