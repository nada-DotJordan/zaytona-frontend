
import { COLORS } from "./colors";

export function injectGlobalStyles() {
  const appendLink = (href) => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  };

  appendLink(
    "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap"
  );
  appendLink(
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
  );
  appendLink(
    "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
  );

  if (document.getElementById("za-global-styles")) return; // already injected
  const style = document.createElement("style");
  style.id = "za-global-styles";
  style.textContent = `
    * { box-sizing: border-box; }
    body {
      font-family: 'DM Sans', sans-serif;
      background: ${COLORS.warmWhite};
      color: ${COLORS.textDark};
      margin: 0;
    }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }

    /* ── LAYOUT ── */
    .za-layout { display: flex; min-height: 100vh; }

    /* ── SIDEBAR ── */
    .za-sidebar {
      width: 240px; min-width: 240px;
      background: ${COLORS.oliveDark};
      display: flex; flex-direction: column;
      position: sticky; top: 0; height: 100vh;
      overflow-y: auto; z-index: 100;
    }
    .za-brand { padding: 24px 20px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .za-brand-name { font-family: 'Playfair Display', serif; font-size: 20px; color: #fff; letter-spacing: 0.5px; line-height: 1.1; }
    .za-brand-ar { color: ${COLORS.gold}; font-size: 16px; margin-left: 6px; }
    .za-brand-sub { font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-top: 4px; }
    .za-nav-section { font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: rgba(255,255,255,0.28); padding: 18px 20px 6px; }
    .za-nav-item {
      display: flex; align-items: center; gap: 10px; padding: 10px 20px;
      font-size: 13px; font-weight: 400; color: rgba(255,255,255,0.55);
      cursor: pointer; transition: all 0.18s; border-left: 2px solid transparent;
      user-select: none;
    }
    .za-nav-item i { font-size: 16px; flex-shrink: 0; }
    .za-nav-item:hover { background: rgba(255,255,255,0.06); color: rgba(255,255,255,0.9); }
    .za-nav-item.active { background: rgba(200,168,75,0.12); color: ${COLORS.gold}; border-left-color: ${COLORS.gold}; font-weight: 500; }
    .za-sidebar-footer { margin-top: auto; padding: 16px 20px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: rgba(255,255,255,0.28); }

    /* ── TOPBAR ── */
    .za-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
    .za-topbar {
      background: #fff; border-bottom: 1px solid ${COLORS.border};
      padding: 0 28px; height: 56px;
      display: flex; align-items: center; justify-content: space-between;
      position: sticky; top: 0; z-index: 50;
    }
    .za-topbar-title { font-family: 'Playfair Display', serif; font-size: 18px; color: ${COLORS.oliveDark}; font-weight: 500; }
    .za-topbar-right { display: flex; align-items: center; gap: 12px; }
    .za-avatar-sm {
      width: 34px; height: 34px; border-radius: 50%;
      background: ${COLORS.oliveDark}; color: ${COLORS.gold};
      font-size: 12px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .za-content { padding: 24px 28px 48px; }

    /* ── METRIC ── */
    .za-metric { background: #fff; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 18px 20px; transition: box-shadow 0.2s; }
    .za-metric:hover { box-shadow: 0 4px 20px rgba(44,61,31,0.08); }
    .za-metric-icon { width: 40px; height: 40px; border-radius: 10px; background: ${COLORS.cream}; display: flex; align-items: center; justify-content: center; font-size: 18px; color: ${COLORS.oliveMid}; margin-bottom: 12px; }
    .za-metric-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: ${COLORS.textMuted}; margin-bottom: 4px; }
    .za-metric-val { font-family: 'Playfair Display', serif; font-size: 28px; color: ${COLORS.textDark}; line-height: 1; margin-bottom: 6px; }
    .za-metric-delta { font-size: 11px; display: flex; align-items: center; gap: 4px; }
    .za-metric-delta.up { color: ${COLORS.oliveLight}; }
    .za-metric-delta.down { color: #b54a4a; }

    /* ── CARD ── */
    .za-card { background: #fff; border: 1px solid ${COLORS.border}; border-radius: 12px; overflow: hidden; }
    .za-card-header { padding: 16px 20px; border-bottom: 1px solid ${COLORS.border}; display: flex; align-items: center; justify-content: space-between; }
    .za-card-title { font-size: 13px; font-weight: 600; color: ${COLORS.textDark}; letter-spacing: 0.2px; }
    .za-card-sub { font-size: 11px; color: ${COLORS.textMuted}; }
    .za-card-body { padding: 20px; }

    /* ── BUTTONS ── */
    .za-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; font-size: 12px; font-weight: 500; font-family: 'DM Sans', sans-serif; border-radius: 8px; border: 1px solid ${COLORS.border}; background: #fff; color: ${COLORS.textDark}; cursor: pointer; transition: all 0.15s; }
    .za-btn:hover { background: ${COLORS.cream}; border-color: ${COLORS.oliveLight}; }
    .za-btn-primary { background: ${COLORS.oliveDark}; color: #fff; border-color: ${COLORS.oliveDark}; }
    .za-btn-primary:hover { background: ${COLORS.oliveMid}; border-color: ${COLORS.oliveMid}; }
    .za-btn-danger { background: #fff5f5; color: #b54a4a; border-color: #f0c0c0; }
    .za-btn-danger:hover { background: #fee; }
    .za-btn-sm { padding: 5px 10px; font-size: 11px; }

    /* ── BADGES ── */
    .za-badge { display: inline-flex; align-items: center; padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 500; }
    .za-badge-green  { background: #e8f5e0; color: #2d5a0f; }
    .za-badge-amber  { background: #fef3dc; color: #7a4a0a; }
    .za-badge-red    { background: #fce8e8; color: #8b2222; }
    .za-badge-blue   { background: #e6f2fb; color: #1a4f7a; }
    .za-badge-olive  { background: ${COLORS.cream}; color: ${COLORS.oliveMid}; }

    /* ── TABLE ── */
    .za-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    .za-table th { text-align: left; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: ${COLORS.textMuted}; padding: 0 16px 10px; border-bottom: 1px solid ${COLORS.border}; }
    .za-table td { padding: 11px 16px; border-bottom: 1px solid ${COLORS.border}; color: ${COLORS.textDark}; vertical-align: middle; }
    .za-table tr:last-child td { border-bottom: none; }
    .za-table tr:hover td { background: ${COLORS.warmWhite}; }

    /* ── FORM ── */
    .za-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px; color: ${COLORS.textMuted}; margin-bottom: 5px; display: block; }
    .za-input { width: 100%; font-size: 13px; font-family: 'DM Sans', sans-serif; padding: 8px 12px; border: 1px solid ${COLORS.border}; border-radius: 8px; background: ${COLORS.warmWhite}; color: ${COLORS.textDark}; transition: border-color 0.15s; }
    .za-input:focus { outline: none; border-color: ${COLORS.oliveLight}; background: #fff; }
    textarea.za-input { resize: vertical; min-height: 64px; }

    /* ── MISC ── */
    .za-avatar { width: 36px; height: 36px; border-radius: 50%; background: ${COLORS.cream}; color: ${COLORS.oliveMid}; font-size: 12px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; border: 1.5px solid ${COLORS.border}; }
    .za-bar-row { display: flex; align-items: center; gap: 10px; font-size: 12px; margin-bottom: 8px; }
    .za-bar-label { width: 80px; color: ${COLORS.textMuted}; font-size: 11px; flex-shrink: 0; text-align: right; }
    .za-bar-track { flex: 1; height: 8px; background: ${COLORS.cream}; border-radius: 4px; overflow: hidden; }
    .za-bar-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, ${COLORS.oliveMid}, ${COLORS.oliveLight}); transition: width 0.6s cubic-bezier(.25,.8,.25,1); }
    .za-bar-val { width: 30px; text-align: right; color: ${COLORS.textMuted}; font-size: 11px; font-weight: 500; }
    .za-activity-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; border-bottom: 1px solid ${COLORS.border}; }
    .za-activity-item:last-child { border: none; }
    .za-dot { width: 8px; height: 8px; border-radius: 50%; background: ${COLORS.oliveLight}; margin-top: 5px; flex-shrink: 0; }
    .za-dot-amber { background: #d4900a; }
    .za-dot-red   { background: #b54a4a; }
    .za-farm-card { background: #fff; border: 1px solid ${COLORS.border}; border-radius: 12px; padding: 18px; transition: box-shadow 0.2s; }
    .za-farm-card:hover { box-shadow: 0 4px 20px rgba(44,61,31,0.09); }
    .za-farm-initials { width: 44px; height: 44px; border-radius: 12px; background: ${COLORS.oliveDark}; color: ${COLORS.gold}; font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .za-stat-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid ${COLORS.border}; font-size: 12.5px; }
    .za-stat-row:last-child { border: none; }
    .za-stat-row span:first-child { color: ${COLORS.textMuted}; }
    .za-stat-row span:last-child { font-weight: 500; }
    .za-search-wrap { position: relative; }
    .za-search-wrap i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: ${COLORS.textMuted}; font-size: 14px; pointer-events: none; }
    .za-search-wrap .za-input { padding-left: 34px; }
    .za-notif-card { border: 1px solid ${COLORS.border}; border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; background: #fff; }
    .za-notif-card.unread { background: ${COLORS.warmWhite}; border-left: 3px solid ${COLORS.gold}; }
    .za-order-id { color: ${COLORS.oliveMid}; font-weight: 600; font-size: 12px; }
    .za-gold-line { height: 2px; background: linear-gradient(90deg, ${COLORS.gold}, transparent); border-radius: 2px; margin-bottom: 20px; }
  `;
  document.head.appendChild(style);
}