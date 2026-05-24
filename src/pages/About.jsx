import { useContext } from "react";
import { LanguageContext } from "../languages/LanguageContext";
import hero   from "../assets/hero.jpg";
import p1  from "../assets/p1.jpg";
import p2 from "../assets/p2.jpg";

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
    label:    "OUR STORY",
    title:    "Rooted in the Land.",
    titleItalic: "Honest to the Drop.",
    subtitle: "Zaytona was born from a simple belief: you deserve to know exactly where your olive oil comes from.",

    missionLabel: "OUR MISSION",
    missionTitle: "Transparency at Every Stage",
    missionDesc:  "Olive oil fraud is one of the most common food frauds in the world. Oils get blended, mislabeled, and sold without any real trace of their origin. We built Zaytona to fix that — a full tracking system that records every stage of the olive oil journey, from the moment olives are harvested to the bottle that arrives at your door.",

    valuesLabel: "WHAT WE STAND FOR",
    values: [
      { icon: "🌿", title: "Authenticity",   desc: "Every bottle is traced to a specific farm, harvest date, and production batch. No blending, no shortcuts." },
      { icon: "🔍", title: "Transparency",   desc: "We publish every production stage. Customers can track their oil's full journey before it even arrives." },
      { icon: "🤝", title: "Fair Farming",   desc: "We partner only with farms that treat their land and workers with respect. Quality starts at the root." },
      { icon: "📦", title: "Freshness",      desc: "Newer harvests mean fresher oil. We date every bottle clearly and price accordingly — honesty over marketing." },
    ],

    trackLabel: "HOW IT WORKS",
    trackTitle: "From Grove to Your Table",
    trackSteps: [
      { num: "01", title: "Harvest Recorded",   desc: "Farm owners log the harvest date, location, and olive variety into the Zaytona system." },
      { num: "02", title: "Production Tracked", desc: "Every press, filter, and bottling step is timestamped and linked to the batch." },
      { num: "03", title: "Order Confirmed",    desc: "When you order, your batch ID is assigned and the tracking begins." },
      { num: "04", title: "Delivered & Verified", desc: "You receive your oil with a full history — farm, harvest year, production date, and delivery record." },
    ],

    statsTitle: "By the Numbers",
    stats: [
      { value: "8+",   label: "Partner Farms" },
      { value: "100%", label: "Traceable Batches" },
      { value: "15+",  label: "Olive Oil Varieties" },
      { value: "2025", label: "Latest Harvest Available" },
    ],

    teamLabel: "THE PEOPLE BEHIND ZAYTONA",
    teamTitle: "Built by people who love good oil.",
    teamDesc:  "Zaytona is a team of developers, farmers, and food transparency advocates working together to bring honesty back to the olive oil market.",

    ctaTitle:  "Ready to taste the difference?",
    ctaDesc:   "Browse our products and trace your oil from farm to table.",
    ctaButton: "Explore Products",
    ctaButton2:"View Our Farms",
  },
  ar: {
    label:    "قصتنا",
    title:    "جذورنا في الأرض.",
    titleItalic: "وصادقون حتى آخر قطرة.",
    subtitle: "وُلدت زيتونة من قناعة بسيطة: أنت تستحق أن تعرف من أين يأتي زيت الزيتون الذي تشتريه.",

    // Mission
    missionLabel: "مهمتنا",
    missionTitle: "الشفافية في كل مرحلة",
    missionDesc:  "غش زيت الزيتون من أكثر عمليات الغش الغذائي شيوعاً في العالم. تُمزج الزيوت وتُعاد تسميتها وتُباع دون أي أثر حقيقي لمصدرها. بنينا زيتونة لنحلّ هذه المشكلة — منظومة تتبّع متكاملة ترصد كل مرحلة من رحلة زيت الزيتون، من لحظة قطف الزيتون حتى الزجاجة التي تصل إلى بابك.",

    valuesLabel: "ما نؤمن به",
    values: [
      { icon: "🌿", title: "الأصالة",     desc: "كل زجاجة مرتبطة بمزرعة محددة وتاريخ حصاد ودفعة إنتاج. لا مزج، لا اختصارات." },
      { icon: "🔍", title: "الشفافية",    desc: "ننشر كل مرحلة إنتاج. يستطيع العملاء تتبّع رحلة زيتهم الكاملة قبل أن يصلهم." },
      { icon: "🤝", title: "الزراعة العادلة", desc: "نتشارك فقط مع مزارع تحترم أرضها وعمالها. الجودة تبدأ من الجذور." },
      { icon: "📦", title: "الطزاجة",     desc: "الموسم الأحدث يعني زيتاً أطزج. نُدوّن تاريخ كل زجاجة بوضوح ونسعّر بأمانة." },
    ],

    trackLabel: "كيف يعمل النظام",
    trackTitle: "من البستان إلى مائدتك",
    trackSteps: [
      { num: "01", title: "تسجيل الحصاد",      desc: "يُدوّن أصحاب المزارع تاريخ الحصاد والموقع وصنف الزيتون في منظومة زيتونة." },
      { num: "02", title: "تتبّع الإنتاج",      desc: "كل مرحلة عصر وتصفية وتعبئة مُوثّقة بطابع زمني ومرتبطة بالدفعة." },
      { num: "03", title: "تأكيد الطلب",        desc: "عند طلبك، يُسنَد إليك رقم دفعة ويبدأ التتبّع فوراً." },
      { num: "04", title: "التسليم والتحقق",    desc: "تستلم زيتك مع السجل الكامل — المزرعة وموسم الحصاد وتاريخ الإنتاج والتوصيل." },
    ],

    statsTitle: "بالأرقام",
    stats: [
      { value: "+8",    label: "مزرعة شريكة" },
      { value: "100%",  label: "دفعات قابلة للتتبّع" },
      { value: "+15",   label: "صنف زيت زيتون" },
      { value: "2025",  label: "أحدث موسم متاح" },
    ],

    teamLabel: "الفريق خلف زيتونة",
    teamTitle: "بناه أناس يعشقون الزيت الجيد.",
    teamDesc:  "زيتونة فريق من المطوّرين والمزارعين والمدافعين عن شفافية الغذاء، يعملون معاً لإعادة الأمانة إلى سوق زيت الزيتون.",

    // CTA
    ctaTitle:  "مستعد لتذوّق الفرق؟",
    ctaDesc:   "تصفّح منتجاتنا وتتبّع زيتك من المزرعة إلى المائدة.",
    ctaButton: "استعرض المنتجات",
    ctaButton2:"شاهد مزارعنا",
  },
};

export default function About() {
  const { lang } = useContext(LanguageContext);
  const t = TEXT[lang];
  const isRtl = lang === "ar";

  return (
    <div style={{ background: COLORS.warmWhite }}>

      <div style={{
        background: `linear-gradient(rgba(30,50,20,0.82), rgba(30,50,20,0.82)), url(${hero}) center/cover no-repeat`,
        padding: "70px 0 50px",
        textAlign: "center",
      }}>
        <p style={{ fontSize: "0.68rem", letterSpacing: "3.5px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 14 }}>
          {t.label}
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 5vw, 3.2rem)", color: "#fff", lineHeight: 1.2, marginBottom: 18 }}>
          {t.title}<br />
          <em style={{ fontStyle: "italic", color: COLORS.gold }}>{t.titleItalic}</em>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
          {t.subtitle}
        </p>
      </div>


      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container">
          <div className="row align-items-center g-5">

            <div className={`col-md-5 ${isRtl ? "order-md-2" : ""}`}>
              <img
                src={p1}
                alt="olive grove"
                style={{ width: "100%", borderRadius: 12, objectFit: "cover", height: 380 }}
              />
            </div>

            <div className={`col-md-7 ${isRtl ? "order-md-1" : ""}`}>
              <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.oliveLight, fontWeight: 700, marginBottom: 12 }}>
                {t.missionLabel}
              </p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: COLORS.textDark, marginBottom: 20, lineHeight: 1.3 }}>
                {t.missionTitle}
              </h2>
              <p style={{ fontSize: "0.95rem", color: COLORS.textMuted, lineHeight: 1.85 }}>
                {t.missionDesc}
              </p>
            </div>

          </div>
        </div>
      </section>

      <section style={{ padding: "80px 0", background: COLORS.warmWhite }}>
        <div className="container">
          <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.oliveLight, fontWeight: 700, marginBottom: 12, textAlign: "center" }}>
            {t.valuesLabel}
          </p>
          <div className="row g-4 mt-1">
            {t.values.map((v, i) => (
              <div className="col-sm-6 col-md-3" key={i}>
                <div style={{
                  background: "#fff",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "1.8rem 1.4rem",
                  height: "100%",
                }}>
                  <div style={{ fontSize: "2rem", marginBottom: 14 }}>{v.icon}</div>
                  <h5 style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: COLORS.textDark, marginBottom: 8 }}>
                    {v.title}
                  </h5>
                  <p style={{ fontSize: "0.82rem", color: COLORS.textMuted, lineHeight: 1.75, margin: 0 }}>
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section style={{ padding: "80px 0", background: COLORS.oliveDark }}>
        <div className="container">
          <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 12, textAlign: "center" }}>
            {t.trackLabel}
          </p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "#fff", textAlign: "center", marginBottom: 48 }}>
            {t.trackTitle}
          </h2>
          <div className="row g-4">
            {t.trackSteps.map((step, i) => (
              <div className="col-sm-6 col-md-3" key={i}>
                <div style={{ textAlign: "center", padding: "0 8px" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    border: `1.5px solid rgba(200,168,75,0.4)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 16px",
                  }}>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: "1rem", color: COLORS.gold }}>
                      {step.num}
                    </span>
                  </div>
                  <h6 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#fff", marginBottom: 8 }}>
                    {step.title}
                  </h6>
                  <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section style={{ padding: "70px 0", background: COLORS.cream }}>
        <div className="container">
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.6rem", color: COLORS.textDark, textAlign: "center", marginBottom: 48 }}>
            {t.statsTitle}
          </h2>
          <div className="row g-4 text-center">
            {t.stats.map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div style={{
                  background: "#fff",
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 12,
                  padding: "2rem 1rem",
                }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "2.4rem", fontWeight: 700, color: COLORS.oliveDark, margin: 0, lineHeight: 1 }}>
                    {s.value}
                  </p>
                  <p style={{ fontSize: "0.78rem", color: COLORS.textMuted, marginTop: 8, marginBottom: 0 }}>
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section style={{ padding: "80px 0", background: "#fff" }}>
        <div className="container">
          <div className="row align-items-center g-5">

            {/* Text */}
            <div className="col-md-6">
              <p style={{ fontSize: "0.68rem", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.oliveLight, fontWeight: 700, marginBottom: 12 }}>
                {t.teamLabel}
              </p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: COLORS.textDark, marginBottom: 16, lineHeight: 1.35 }}>
                {t.teamTitle}
              </h2>
              <p style={{ fontSize: "0.92rem", color: COLORS.textMuted, lineHeight: 1.85 }}>
                {t.teamDesc}
              </p>
            </div>

            {/* Image grid */}
            <div className={`col-md-5 ${isRtl ? "order-md-2" : ""}`}>
              <img
                src={p2}
                alt="olive grove"
                style={{ width: "100%", borderRadius: 12, objectFit: "cover", height: 380 }}
              />
            </div>
          </div>
        </div>
      </section>


      <section style={{
        background: `linear-gradient(rgba(28,41,16,0.90), rgba(28,41,16,0.90)), url(${hero}) center/cover no-repeat`,
        padding: "80px 0",
        textAlign: "center",
      }}>
        <div className="container">
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: "#fff", marginBottom: 14 }}>
            {t.ctaTitle}
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.92rem", marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
            {t.ctaDesc}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/products" style={{
              background: COLORS.oliveLight,
              color: "#fff",
              padding: "13px 28px",
              borderRadius: 6,
              fontSize: "0.88rem",
              fontWeight: 600,
              textDecoration: "none",
            }}>
              {t.ctaButton}
            </a>
            <a href="/farms" style={{
              background: "transparent",
              color: "#fff",
              border: "1.5px solid rgba(255,255,255,0.4)",
              padding: "13px 28px",
              borderRadius: 6,
              fontSize: "0.88rem",
              fontWeight: 600,
              textDecoration: "none",
            }}>
              {t.ctaButton2}
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}