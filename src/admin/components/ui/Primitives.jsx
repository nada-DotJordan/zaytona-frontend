import { COLORS } from "../../styles/colors";

export function GoldLine() {
  return <div className="za-gold-line" />;
}

const STATUS_CLASS = {
  Pending:           "za-badge-amber",
  Processing:        "za-badge-blue",
  "Out for delivery":"za-badge-amber",
  Delivered:         "za-badge-green",
  Cancelled:         "za-badge-red",
  Shipping:          "za-badge-blue",
  Packaged:          "za-badge-green",
  Production:        "za-badge-amber",
  Harvest:           "za-badge-olive",
};

export function StatusBadge({ status }) {
  return (
    <span className={`za-badge ${STATUS_CLASS[status] ?? "za-badge-blue"}`}>
      {status}
    </span>
  );
}

export function BarRow({ label, val, max, labelWidth = "80px" }) {
  return (
    <div className="za-bar-row">
      <span className="za-bar-label" style={{ width: labelWidth }}>
        {label}
      </span>
      <div className="za-bar-track">
        <div
          className="za-bar-fill"
          style={{ width: `${Math.round((val / max) * 100)}%` }}
        />
      </div>
      <span className="za-bar-val">{val}</span>
    </div>
  );
}

export function MetricCard({ icon, label, value, delta, deltaDir, iconStyle }) {
  return (
    <div className="za-metric">
      <div className="za-metric-icon" style={iconStyle}>
        <i className={`bi ${icon}`} />
      </div>
      <div className="za-metric-label">{label}</div>
      <div className="za-metric-val">{value}</div>
      {delta && (
        <div className={`za-metric-delta ${deltaDir}`}>
          <i className={`bi bi-arrow-${deltaDir === "up" ? "up" : "down"}-short`} />
          {delta}
        </div>
      )}
    </div>
  );
}

export function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}