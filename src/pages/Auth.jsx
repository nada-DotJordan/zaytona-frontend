import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LanguageContext } from "../languages/LanguageContext";
import hero from "../assets/hero.jpg";
import { login as loginUser, register as registerUser } from "../api/auth";
import { useAuth } from "../context/AuthContext";

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
  error:      "#b94a48",
};

const TEXT = {
  en: {
    tabLogin:    "Sign In",
    tabRegister: "Create Account",

    loginLabel:    "WELCOME BACK",
    loginTitle:    "Sign in to",
    loginItalic:   "Zaytona.",
    loginSubtitle: "Track your orders and verify your olive oil.",
    forgotPass:    "Forgot password?",
    submitLogin:   "Sign In",

    registerLabel:    "JOIN ZAYTONA",
    registerTitle:    "Create your",
    registerItalic:   "account.",
    registerSubtitle: "Track orders, verify authenticity, shop from trusted farms.",
    submitRegister:   "Create Account",
    terms:            "By signing up you agree to our",
    termsLink:        "Terms",
    and:              "&",
    privacyLink:      "Privacy Policy",

    fullName:            "Full Name",
    email:               "Email Address",
    password:            "Password",
    confirm:             "Confirm Password",
    namePlaceholder:     "Your full name",
    emailPlaceholder:    "you@example.com",
    passwordPlaceholder: "Min. 5 characters",
    confirmPlaceholder:  "Repeat your password",

    nameError:     "Full name is required.",
    emailError:    "Please enter a valid email.",
    passwordError: "Password is required.",
    confirmError:  "Passwords do not match.",

    loading:     "Please wait...",
    serverError: "Something went wrong. Please try again.",
  },
  ar: {
    tabLogin:    "تسجيل الدخول",
    tabRegister: "إنشاء حساب",

    loginLabel:    "مرحباً بعودتك",
    loginTitle:    "سجّل دخولك إلى",
    loginItalic:   "زيتونة.",
    loginSubtitle: "تتبّع طلباتك وتحقّق من زيتك.",
    forgotPass:    "نسيت كلمة المرور؟",
    submitLogin:   "تسجيل الدخول",

    registerLabel:    "انضم إلى زيتونة",
    registerTitle:    "أنشئ",
    registerItalic:   "حسابك.",
    registerSubtitle: "تتبّع طلباتك، تحقّق من الأصالة، تسوّق من مزارع موثوقة.",
    submitRegister:   "إنشاء الحساب",
    terms:            "بالتسجيل توافق على",
    termsLink:        "الشروط",
    and:              "و",
    privacyLink:      "سياسة الخصوصية",

    fullName:            "الاسم الكامل",
    email:               "البريد الإلكتروني",
    password:            "كلمة المرور",
    confirm:             "تأكيد كلمة المرور",
    namePlaceholder:     "اسمك الكامل",
    emailPlaceholder:    "example@email.com",
    passwordPlaceholder: "5 أحرف على الأقل",
    confirmPlaceholder:  "أعد كلمة المرور",

    nameError:     "الاسم الكامل مطلوب.",
    emailError:    "يرجى إدخال بريد إلكتروني صحيح.",
    passwordError: "كلمة المرور مطلوبة.",
    confirmError:  "كلمتا المرور غير متطابقتين.",

    loading:     "جاري المعالجة...",
    serverError: "حدث خطأ ما. يرجى المحاولة مجدداً.",
  },
};


function Field({ label, type, placeholder, value, onChange, onBlur, error, touched, showToggle, onToggle, isRtl }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 600, color: COLORS.textDark, marginBottom: 5 }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          style={{
            width: "100%",
            padding: showToggle ? "10px 42px 10px 14px" : "10px 14px",
            borderRadius: 7,
            border: `1.5px solid ${touched && error ? COLORS.error : COLORS.border}`,
            fontSize: "0.88rem",
            color: COLORS.textDark,
            background: "#fff",
            outline: "none",
            direction: isRtl ? "rtl" : "ltr",
            fontFamily: "inherit",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              fontSize: "0.95rem", color: COLORS.textMuted, padding: 0,
            }}
          >
            {type === "password" ? "👁️" : "🙈"}
          </button>
        )}
      </div>
      {touched && error && (
        <p style={{ fontSize: "0.7rem", color: COLORS.error, marginTop: 3, marginBottom: 0 }}>{error}</p>
      )}
    </div>
  );
}

function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#fdf0f0",
      border: `1px solid ${COLORS.error}`,
      borderRadius: 7,
      padding: "10px 14px",
      marginBottom: 18,
      fontSize: "0.8rem",
      color: COLORS.error,
      fontWeight: 500,
    }}>
      ⚠️ {message}
    </div>
  );
}

export default function Auth() {
  const { lang }      = useContext(LanguageContext);
  const navigate      = useNavigate();
  const { saveUser }  = useAuth();         
  const t             = TEXT[lang];
  const isRtl         = lang === "ar";

  const [mode, setMode] = useState("login");

  const [login, setLogin]               = useState({ email: "", password: "" });
  const [showLP, setShowLP]             = useState(false);
  const [loginErr, setLoginErr]         = useState({});
  const [loginTouched, setLoginTouched] = useState({});
  const [loginServer, setLoginServer]   = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [reg, setReg]               = useState({ name: "", email: "", password: "", confirm: "" });
  const [showRP, setShowRP]         = useState(false);
  const [showRC, setShowRC]         = useState(false);
  const [regErr, setRegErr]         = useState({});
  const [regTouched, setRegTouched] = useState({});
  const [regServer, setRegServer]   = useState("");
  const [regLoading, setRegLoading] = useState(false);

  function switchTo(m) {
    setMode(m);
    setLoginTouched({}); setLoginErr({}); setLoginServer("");
    setRegTouched({});   setRegErr({});   setRegServer("");
  }

  function validateLogin(f = login) {
    const e = {};
    if (!f.email || !/\S+@\S+\.\S+/.test(f.email)) e.email    = t.emailError;
    if (!f.password)                                 e.password = t.passwordError;  
    return e;
  }

  function handleLoginBlur(field) {
    setLoginTouched(p => ({ ...p, [field]: true }));
    setLoginErr(validateLogin());
  }

  function handleLoginChange(field, value) {
    const updated = { ...login, [field]: value };
    setLogin(updated);
    if (loginTouched[field]) setLoginErr(validateLogin(updated));
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const errs = validateLogin();
    setLoginTouched({ email: true, password: true });
    setLoginErr(errs);
    if (Object.keys(errs).length) return;

    try {
      setLoginLoading(true);
      setLoginServer("");

      const userData = await loginUser(login.email, login.password);
      saveUser(userData);

      if (userData.role === "admin")      navigate("/admin");
      else if (userData.role === "farm_owner") navigate("/farms");
      else                                navigate("/");

    } catch (err) {
      const msg = err.response?.data?.message || t.serverError;
      setLoginServer(msg);
    } finally {
      setLoginLoading(false);
    }
  }

  function validateReg(f = reg) {
    const e = {};
    if (!f.name.trim())                             e.name     = t.nameError;
    if (!f.email || !/\S+@\S+\.\S+/.test(f.email)) e.email    = t.emailError;
    if (!f.password || f.password.length < 5)       e.password = t.passwordError;
    if (f.confirm !== f.password)                   e.confirm  = t.confirmError;
    return e;
  }

  function handleRegBlur(field) {
    setRegTouched(p => ({ ...p, [field]: true }));
    setRegErr(validateReg());
  }

  function handleRegChange(field, value) {
    const updated = { ...reg, [field]: value };
    setReg(updated);
    if (regTouched[field]) setRegErr(validateReg(updated));
  }

  async function handleRegSubmit(e) {
    e.preventDefault();
    const errs = validateReg();
    setRegTouched({ name: true, email: true, password: true, confirm: true });
    setRegErr(errs);
    if (Object.keys(errs).length) return;

    try {
      setRegLoading(true);
      setRegServer("");

      const userData = await registerUser({   
        nameEn:   reg.name,
        email:    reg.email,
        password: reg.password,
      });

      saveUser(userData);                   
      navigate("/");

    } catch (err) {
      const msg = err.response?.data?.message || t.serverError;
      setRegServer(msg);
    } finally {
      setRegLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.warmWhite }}>

      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "48px 36px",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          <p style={{ fontSize: "0.65rem", letterSpacing: "3px", textTransform: "uppercase", color: COLORS.oliveLight, fontWeight: 700, marginBottom: 24 }}>
            🌿 ZAYTONA
          </p>

          <div style={{
            display: "flex",
            background: COLORS.cream,
            borderRadius: 10,
            padding: 4,
            marginBottom: 32,
            border: `1px solid ${COLORS.border}`,
          }}>
            {["login", "register"].map((m) => {
              const isActive = mode === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchTo(m)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 7,
                    border: "none",
                    background: isActive ? COLORS.oliveDark : "transparent",
                    color: isActive ? "#fff" : COLORS.textMuted,
                    fontSize: "0.84rem",
                    fontWeight: isActive ? 700 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {m === "login" ? t.tabLogin : t.tabRegister}
                </button>
              );
            })}
          </div>

          {mode === "login" && (
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.oliveLight, fontWeight: 700, marginBottom: 10 }}>
                {t.loginLabel}
              </p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", color: COLORS.textDark, marginBottom: 6, lineHeight: 1.2 }}>
                {t.loginTitle} <em style={{ fontStyle: "italic", color: COLORS.gold }}>{t.loginItalic}</em>
              </h2>
              <p style={{ fontSize: "0.82rem", color: COLORS.textMuted, marginBottom: 28, lineHeight: 1.6 }}>
                {t.loginSubtitle}
              </p>

              <ErrorBanner message={loginServer} />

              <form onSubmit={handleLoginSubmit} noValidate>
                <Field
                  label={t.email}
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={login.email}
                  onChange={e => handleLoginChange("email", e.target.value)}
                  onBlur={() => handleLoginBlur("email")}
                  error={loginErr.email}
                  touched={loginTouched.email}
                  isRtl={isRtl}
                />
                <Field
                  label={t.password}
                  type={showLP ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={login.password}
                  onChange={e => handleLoginChange("password", e.target.value)}
                  onBlur={() => handleLoginBlur("password")}
                  error={loginErr.password}
                  touched={loginTouched.password}
                  showToggle
                  onToggle={() => setShowLP(!showLP)}
                  isRtl={isRtl}
                />

                <div style={{ textAlign: isRtl ? "left" : "right", marginTop: -8, marginBottom: 24 }}>
                  <a href="#" style={{ fontSize: "0.74rem", color: COLORS.oliveMid, textDecoration: "none" }}>
                    {t.forgotPass}
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    width: "100%", background: loginLoading ? COLORS.oliveLight : COLORS.oliveDark,
                    color: "#fff", border: "none", padding: "12px", borderRadius: 7,
                    fontSize: "0.9rem", fontWeight: 700, cursor: loginLoading ? "not-allowed" : "pointer",
                    marginBottom: 20, transition: "background 0.2s",
                  }}
                >
                  {loginLoading ? t.loading : t.submitLogin}
                </button>
              </form>
            </div>
          )}

          {mode === "register" && (
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2.5px", textTransform: "uppercase", color: COLORS.oliveLight, fontWeight: 700, marginBottom: 10 }}>
                {t.registerLabel}
              </p>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.8rem", color: COLORS.textDark, marginBottom: 6, lineHeight: 1.2 }}>
                {t.registerTitle} <em style={{ fontStyle: "italic", color: COLORS.gold }}>{t.registerItalic}</em>
              </h2>
              <p style={{ fontSize: "0.82rem", color: COLORS.textMuted, marginBottom: 22, lineHeight: 1.6 }}>
                {t.registerSubtitle}
              </p>

              <ErrorBanner message={regServer} />

              <form onSubmit={handleRegSubmit} noValidate>
                <Field
                  label={t.fullName}
                  type="text"
                  placeholder={t.namePlaceholder}
                  value={reg.name}
                  onChange={e => handleRegChange("name", e.target.value)}
                  onBlur={() => handleRegBlur("name")}
                  error={regErr.name}
                  touched={regTouched.name}
                  isRtl={isRtl}
                />
                <Field
                  label={t.email}
                  type="email"
                  placeholder={t.emailPlaceholder}
                  value={reg.email}
                  onChange={e => handleRegChange("email", e.target.value)}
                  onBlur={() => handleRegBlur("email")}
                  error={regErr.email}
                  touched={regTouched.email}
                  isRtl={isRtl}
                />
                <Field
                  label={t.password}
                  type={showRP ? "text" : "password"}
                  placeholder={t.passwordPlaceholder}
                  value={reg.password}
                  onChange={e => handleRegChange("password", e.target.value)}
                  onBlur={() => handleRegBlur("password")}
                  error={regErr.password}
                  touched={regTouched.password}
                  showToggle
                  onToggle={() => setShowRP(!showRP)}
                  isRtl={isRtl}
                />
                <Field
                  label={t.confirm}
                  type={showRC ? "text" : "password"}
                  placeholder={t.confirmPlaceholder}
                  value={reg.confirm}
                  onChange={e => handleRegChange("confirm", e.target.value)}
                  onBlur={() => handleRegBlur("confirm")}
                  error={regErr.confirm}
                  touched={regTouched.confirm}
                  showToggle
                  onToggle={() => setShowRC(!showRC)}
                  isRtl={isRtl}
                />

                <button
                  type="submit"
                  disabled={regLoading}
                  style={{
                    width: "100%", background: regLoading ? COLORS.oliveLight : COLORS.oliveDark,
                    color: "#fff", border: "none", padding: "12px", borderRadius: 7,
                    fontSize: "0.9rem", fontWeight: 700, cursor: regLoading ? "not-allowed" : "pointer",
                    marginTop: 8, marginBottom: 12, transition: "background 0.2s",
                  }}
                >
                  {regLoading ? t.loading : t.submitRegister}
                </button>

                <p style={{ fontSize: "0.7rem", color: COLORS.textMuted, textAlign: "center", lineHeight: 1.6, marginBottom: 16 }}>
                  {t.terms}{" "}
                  <a href="#" style={{ color: COLORS.oliveMid, textDecoration: "none" }}>{t.termsLink}</a>
                  {" "}{t.and}{" "}
                  <a href="#" style={{ color: COLORS.oliveMid, textDecoration: "none" }}>{t.privacyLink}</a>.
                </p>
              </form>
            </div>
          )}

        </div>
      </div>

      <div
        className="d-none d-md-flex"
        style={{
          flex: 1,
          background: `linear-gradient(rgba(28,41,16,0.80), rgba(28,41,16,0.80)), url(${hero}) center/cover no-repeat`,
          flexDirection: "column",
          justifyContent: mode === "login" ? "flex-end" : "center",
          padding: "56px 52px",
          transition: "justify-content 0.3s",
        }}
      >
        <p style={{ fontSize: "0.65rem", letterSpacing: "3.5px", textTransform: "uppercase", color: COLORS.gold, fontWeight: 700, marginBottom: 14 }}>
          ZAYTONA
        </p>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "2rem", color: "#fff", marginBottom: 14, lineHeight: 1.3 }}>
          {mode === "login" ? (
            <>Real Olive Oil.<br /><em style={{ fontStyle: "italic", color: COLORS.gold }}>Nothing Hidden.</em></>
          ) : (
            <>Know your oil.<br /><em style={{ fontStyle: "italic", color: COLORS.gold }}>Trust every drop.</em></>
          )}
        </h2>
        <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.8, maxWidth: 340, marginBottom: 36 }}>
          {mode === "login"
            ? "Every bottle you order is fully traceable — from the farm and harvest year, to the press and your door."
            : "Join Zaytona and get access to fully traceable olive oil — verified from farm to your table."
          }
        </p>

        {mode === "register" && (
          <div>
            {[
              "✔  Full order tracking",
              "✔  Harvest year & farm verified",
              "✔  Bilingual Arabic / English",
              "✔  Delivery status updates",
            ].map((item, i) => (
              <p key={i} style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.6)", marginBottom: 8 }}>{item}</p>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}