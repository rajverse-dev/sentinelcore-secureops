import React, { useState, useCallback, useRef } from "react";
import {
  LayoutDashboard,
  Server,
  ShieldAlert,
  Bug,
  ClipboardList,
  ShieldCheck,
  GitBranch,
  Cloud,
  Boxes,
  Cpu,
  MemoryStick,
  HardDrive,
  Network,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  LogOut,
  Radio,
} from "lucide-react";

// ============================================================
// PREMIUM DARK RED SOC THEME
// ============================================================
const T = {
  // Main background
  bgApp: "#090A0D",
  bgSidebar: "#0D0E12",

  // Cards
  bgCard: "#141519",
  bgCardAlt: "#1A1B20",

  // Borders
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.15)",

  // Premium red header
  headerFrom: "#8F1624",
  headerVia: "#68121C",
  headerTo: "#280B11",

  // Primary red accents
  accent: "#E5484D",
  accentSoft: "#FF6B6B",

  // Secondary burgundy
  burgundy: "#9F2638",
  burgundySoft: "#C43B50",

  // Text
  textPrimary: "#F5F5F6",
  textMuted: "#A0A3AA",
  textFaint: "#686C75",

  // Status
  green: "#35C47A",
  amber: "#E8A23A",
  red: "#F0444C",

  // Information - no blue
  info: "#B58CFF",
};

// ============================================================
// NAVIGATION
// ============================================================
const NAV_ITEMS = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "assets",
    label: "Assets",
    icon: Server,
  },
  {
    id: "incidents",
    label: "Incidents",
    icon: ShieldAlert,
  },
  {
    id: "vulnerabilities",
    label: "Vulnerabilities",
    icon: Bug,
  },
  {
    id: "audit",
    label: "Audit",
    icon: ClipboardList,
  },
  {
    id: "compliance",
    label: "Compliance",
    icon: ShieldCheck,
  },
  {
    id: "devsecops",
    label: "DevSecOps",
    icon: GitBranch,
  },
];

// ============================================================
// MOCK DATA
// ============================================================
const SUMMARY_DATA = [
  {
    label: "Assets Monitored",
    value: "2,847",
    sub: "Servers + Cloud",
    icon: Boxes,
    accent: T.info,
  },
  {
    label: "Uptime",
    value: "99.99%",
    sub: "SLA",
    icon: ShieldCheck,
    accent: T.green,
  },
  {
    label: "Alerts",
    value: "12",
    sub: "Active",
    icon: ShieldAlert,
    accent: T.amber,
  },
];

const SERVER_HEALTH = {
  total: 1247,
  healthy: 1235,
  warning: 10,
  critical: 2,
};

const CLOUD = {
  aws: 847,
  azure: 400,
};

const K8S = {
  clusters: 47,
  pods: 2847,
};

const METRICS = [
  {
    label: "CPU",
    value: 23,
    icon: Cpu,
  },
  {
    label: "Memory",
    value: 47,
    icon: MemoryStick,
  },
  {
    label: "Disk",
    value: 67,
    icon: HardDrive,
  },
  {
    label: "Network",
    value: 12,
    icon: Network,
  },
];

const ALERTS = [
  {
    id: "a1",
    host: "DB-SRV-12",
    detail: "CPU 94%",
    action: "Auto-scaled",
    status: "Resolved",
    level: "critical",
  },
  {
    id: "a2",
    host: "APP-SRV-47",
    detail: "Disk 91%",
    action: "Cleanup scheduled",
    status: "Pending",
    level: "warning",
  },
];

// ============================================================
// HELPERS
// ============================================================
function metricColor(value) {
  if (value >= 80) return T.red;
  if (value >= 60) return T.amber;
  return T.green;
}

// ============================================================
// PULSE LINE
// ============================================================
function PulseLine({
  color = T.accent,
  width = 120,
  height = 28,
}) {
  const mid = height / 2;

  const d = `
    M0,${mid}
    L${width * 0.18},${mid}
    L${width * 0.28},${mid - height * 0.35}
    L${width * 0.36},${mid + height * 0.45}
    L${width * 0.44},${mid - height * 0.75}
    L${width * 0.52},${mid + height * 0.2}
    L${width * 0.6},${mid}
    L${width},${mid}
  `;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d={d}
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
    </svg>
  );
}

// ============================================================
// TOAST
// ============================================================
function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-lg px-4 py-3 text-sm"
          style={{
            background: "rgba(26,27,32,0.96)",
            backdropFilter: "blur(12px)",
            border: `1px solid ${T.borderStrong}`,
            color: T.textPrimary,
            boxShadow:
              "0 16px 40px rgba(0,0,0,0.55), 0 0 24px rgba(229,72,77,0.08)",
            animation: "toastIn 0.2s ease-out",
          }}
        >
          <div className="flex items-start gap-2">
            <Radio
              size={14}
              style={{
                color: T.accentSoft,
                marginTop: 2,
                flexShrink: 0,
              }}
            />

            <span>{toast.message}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// HEADER
// ============================================================
function Header({ onLogout }) {
  return (
    <header
      className="relative flex items-center justify-between px-6 py-4 flex-shrink-0 overflow-hidden"
      style={{
        background: `linear-gradient(
          115deg,
          ${T.headerFrom} 0%,
          ${T.headerVia} 55%,
          ${T.headerTo} 100%
        )`,
        borderBottom: "1px solid rgba(0,0,0,0.5)",
      }}
    >
      {/* Red ambient glow */}
      <div
        className="pointer-events-none absolute -top-24 left-1/3 w-72 h-72 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,107,0.20), transparent 70%)",
          filter: "blur(12px)",
        }}
      />

      <div className="flex items-center gap-3 relative">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 relative"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.20)",
            boxShadow: "0 0 25px rgba(229,72,77,0.30)",
          }}
        >
          <ShieldCheck size={19} color="#fff" />
        </div>

        <div>
          <h1 className="text-white font-semibold text-base leading-tight tracking-tight">
            SentinelCore{" "}
            <span
              style={{
                color: T.accentSoft,
                fontWeight: 700,
              }}
            >
              SecureOps
            </span>
          </h1>

          <p
            className="text-xs leading-tight"
            style={{
              color: "rgba(255,255,255,0.68)",
            }}
          >
            Milestone 1 · Infrastructure Monitoring
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <div className="hidden lg:block opacity-90">
          <PulseLine
            color="rgba(255,255,255,0.82)"
            width={100}
            height={24}
          />
        </div>

        <div
          className="hidden sm:flex items-center gap-2 pl-4"
          style={{
            borderLeft: "1px solid rgba(255,255,255,0.18)",
          }}
        >
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
          >
            SA
          </div>

          <span className="text-sm text-white/90">
            Security Admin
          </span>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 text-sm text-white/90 hover:text-white transition-colors px-2.5 py-1.5 rounded-md hover:bg-white/10"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      {/* Scanning red accent */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden">
        <div
          style={{
            width: "40%",
            height: "100%",
            background:
              "linear-gradient(90deg, transparent, #FF6B6B, transparent)",
            animation: "scan 3.5s ease-in-out infinite",
          }}
        />
      </div>
    </header>
  );
}

// ============================================================
// SIDEBAR
// ============================================================
function Sidebar({ active, onSelect }) {
  return (
    <aside
      className="w-56 flex-shrink-0 flex-col py-4 hidden md:flex relative"
      style={{
        background: T.bgSidebar,
        borderRight: `1px solid ${T.border}`,
      }}
    >
      <div
        className="px-4 pb-4 mb-2"
        style={{
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <span
          className="text-[11px] font-semibold tracking-[0.15em]"
          style={{
            color: T.textFaint,
          }}
        >
          MAIN NAVIGATION
        </span>
      </div>

      <nav className="flex flex-col gap-1 px-2">
        {NAV_ITEMS.map((item, index) => {
          const isActive = item.id === active;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all text-left relative"
              style={{
                background: isActive
                  ? "linear-gradient(90deg, rgba(229,72,77,0.20), rgba(229,72,77,0.035))"
                  : "transparent",

                color: isActive
                  ? "#FFFFFF"
                  : T.textMuted,

                fontWeight: isActive ? 600 : 500,

                boxShadow: isActive
                  ? "inset 0 0 0 1px rgba(255,107,107,0.12)"
                  : "none",

                animation: `fadeIn 0.35s ease-out ${
                  index * 0.04
                }s both`,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background =
                    "rgba(229,72,77,0.055)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background =
                    "transparent";
                }
              }}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full"
                  style={{
                    background: T.accentSoft,
                    boxShadow: `0 0 9px ${T.accentSoft}`,
                  }}
                />
              )}

              <Icon
                size={16}
                style={{
                  color: isActive
                    ? T.accentSoft
                    : undefined,
                }}
              />

              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto px-4 pt-4">
        <div
          className="rounded-lg px-3 py-3 relative overflow-hidden"
          style={{
            background: T.bgCard,
            border: `1px solid ${T.border}`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                background: T.green,
                boxShadow:
                  `0 0 0 3px rgba(53,196,122,0.15), ` +
                  `0 0 8px ${T.green}`,
              }}
            />

            <span
              className="text-xs font-medium"
              style={{
                color: T.textPrimary,
              }}
            >
              All systems nominal
            </span>
          </div>

          <PulseLine
            color={T.green}
            width={172}
            height={22}
          />

          <span
            className="text-[11px] block mt-1"
            style={{
              color: T.textFaint,
            }}
          >
            Last sync: just now
          </span>
        </div>
      </div>
    </aside>
  );
}

// ============================================================
// SUMMARY CARD
// ============================================================
function SummaryCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  index,
}) {
  return (
    <div
      className="rounded-xl p-5 flex-1 min-w-[200px] relative overflow-hidden group transition-transform"
      style={{
        background: `linear-gradient(
          160deg,
          ${T.bgCard},
          ${T.bgCardAlt}
        )`,
        border: `1px solid ${T.border}`,
        animation: `fadeUp 0.4s ease-out ${
          index * 0.08
        }s both`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-2px)";

        e.currentTarget.style.borderColor =
          `${accent}55`;

        e.currentTarget.style.boxShadow =
          `0 12px 28px rgba(0,0,0,0.35),
           0 0 0 1px ${accent}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0)";

        e.currentTarget.style.borderColor =
          T.border;

        e.currentTarget.style.boxShadow =
          "none";
      }}
    >
      <div
        className="absolute -top-8 -right-8 w-28 h-28 rounded-full opacity-[0.12]"
        style={{
          background: accent,
          filter: "blur(7px)",
        }}
      />

      <div className="flex items-start justify-between relative">
        <div>
          <p
            className="text-xs font-medium mb-2"
            style={{
              color: T.textMuted,
            }}
          >
            {label}
          </p>

          <p
            className="text-[28px] font-bold font-mono tracking-tight"
            style={{
              backgroundImage: `linear-gradient(
                135deg,
                ${T.textPrimary},
                ${accent}
              )`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {value}
          </p>

          <p
            className="text-xs mt-1"
            style={{
              color: T.textFaint,
            }}
          >
            {sub}
          </p>
        </div>

        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: `${accent}1c`,
            border: `1px solid ${accent}40`,
            boxShadow: `0 0 16px ${accent}18`,
          }}
        >
          <Icon
            size={17}
            style={{
              color: accent,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// STAT ROW
// ============================================================
function StatRow({ label, value, dot }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        {dot && (
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: dot,
              boxShadow: `0 0 6px ${dot}`,
            }}
          />
        )}

        <span
          className="text-sm"
          style={{
            color: T.textMuted,
          }}
        >
          {label}
        </span>
      </div>

      <span
        className="text-sm font-mono font-medium"
        style={{
          color: T.textPrimary,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ============================================================
// METRIC BAR
// ============================================================
function MetricBar({
  label,
  value,
  icon: Icon,
}) {
  const color = metricColor(value);

  return (
    <div className="mb-3.5 last:mb-0">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5">
          <Icon
            size={13}
            style={{
              color: T.textFaint,
            }}
          />

          <span
            className="text-xs"
            style={{
              color: T.textMuted,
            }}
          >
            {label}
          </span>
        </div>

        <span
          className="text-xs font-mono font-semibold"
          style={{
            color: T.textPrimary,
          }}
        >
          {value}%
        </span>
      </div>

      <div
        className="h-1.5 rounded-full w-full overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.055)",
        }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${value}%`,
            background:
              `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 8px ${color}55`,
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// ALERT ROW
// ============================================================
function AlertRow({ alert }) {
  const levelColor =
    alert.level === "critical"
      ? T.red
      : T.amber;

  const LevelIcon =
    alert.level === "critical"
      ? XCircle
      : AlertTriangle;

  const resolved =
    alert.status === "Resolved";

  return (
    <div
      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg relative overflow-hidden transition-colors"
      style={{
        background: T.bgCard,
        border: `1px solid ${T.border}`,
        borderLeft:
          `2px solid ${levelColor}`,
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <LevelIcon
          size={15}
          style={{
            color: levelColor,
            flexShrink: 0,
          }}
        />

        <div className="min-w-0">
          <p
            className="text-sm font-mono truncate"
            style={{
              color: T.textPrimary,
            }}
          >
            {alert.host}{" "}
            <span
              style={{
                color: T.textMuted,
              }}
            >
              · {alert.detail}
            </span>
          </p>

          <p
            className="text-xs"
            style={{
              color: T.textFaint,
            }}
          >
            {alert.action}
          </p>
        </div>
      </div>

      <span
        className="text-[11px] font-medium px-2 py-1 rounded-full flex-shrink-0"
        style={{
          color: resolved
            ? T.green
            : T.amber,

          background: resolved
            ? "rgba(53,196,122,0.10)"
            : "rgba(232,162,58,0.10)",

          border:
            `1px solid ${
              resolved
                ? "rgba(53,196,122,0.28)"
                : "rgba(232,162,58,0.28)"
            }`,
        }}
      >
        {alert.status}
      </span>
    </div>
  );
}

// ============================================================
// ACTION BUTTON
// ============================================================
function ActionButton({
  children,
  variant = "secondary",
  onClick,
}) {
  const primary =
    variant === "primary";

  return (
    <button
      onClick={onClick}
      className="text-sm font-medium px-4 py-2 rounded-md transition-all active:scale-[0.97]"
      style={{
        background: primary
          ? `linear-gradient(
              135deg,
              ${T.headerFrom},
              ${T.headerVia}
            )`
          : "transparent",

        color: primary
          ? "#FFFFFF"
          : T.textPrimary,

        border: primary
          ? "1px solid rgba(255,107,107,0.35)"
          : `1px solid ${T.borderStrong}`,

        boxShadow: primary
          ? "0 4px 18px rgba(229,72,77,0.22)"
          : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background =
          primary
            ? `linear-gradient(
                135deg,
                #A91D2D,
                #74121F
              )`
            : "rgba(229,72,77,0.07)";

        e.currentTarget.style.transform =
          "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background =
          primary
            ? `linear-gradient(
                135deg,
                ${T.headerFrom},
                ${T.headerVia}
              )`
            : "transparent";

        e.currentTarget.style.transform =
          "translateY(0)";
      }}
    >
      {children}
    </button>
  );
}

// ============================================================
// INFRASTRUCTURE HEALTH
// ============================================================
function InfrastructureHealth({
  onAction,
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: T.bgCard,
        border:
          `1px solid ${T.border}`,
        boxShadow:
          "0 20px 48px rgba(0,0,0,0.35)",
        animation:
          "fadeUp 0.45s ease-out 0.24s both",
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{
          borderBottom:
            `1px solid ${T.border}`,
        }}
      >
        <div className="flex items-center gap-2">
          <Server
            size={16}
            style={{
              color: T.accentSoft,
            }}
          />

          <h2
            className="text-sm font-semibold tracking-tight"
            style={{
              color: T.textPrimary,
            }}
          >
            Asset Service — Infrastructure Health
          </h2>
        </div>

        <span
          className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
          style={{
            color: T.green,
            background:
              "rgba(53,196,122,0.10)",
            border:
              "1px solid rgba(53,196,122,0.28)",
          }}
        >
          <span className="relative flex w-1.5 h-1.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{
                background: T.green,
              }}
            />

            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{
                background: T.green,
              }}
            />
          </span>

          LIVE
        </span>
      </div>

      {/* Main Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Servers */}
        <div
          className="rounded-lg p-4"
          style={{
            background: T.bgCardAlt,
            border:
              `1px solid ${T.border}`,
          }}
        >
          <p
            className="text-xs font-semibold mb-1 tracking-wide"
            style={{
              color: T.textFaint,
            }}
          >
            SERVERS
          </p>

          <p
            className="text-xl font-mono font-semibold mb-2"
            style={{
              color: T.textPrimary,
            }}
          >
            {SERVER_HEALTH.total.toLocaleString()}
          </p>

          <StatRow
            label="Healthy"
            value={SERVER_HEALTH.healthy.toLocaleString()}
            dot={T.green}
          />

          <StatRow
            label="Warning"
            value={SERVER_HEALTH.warning}
            dot={T.amber}
          />

          <StatRow
            label="Critical"
            value={SERVER_HEALTH.critical}
            dot={T.red}
          />
        </div>

        {/* Cloud */}
        <div
          className="rounded-lg p-4"
          style={{
            background: T.bgCardAlt,
            border:
              `1px solid ${T.border}`,
          }}
        >
          <p
            className="text-xs font-semibold mb-1 flex items-center gap-1.5 tracking-wide"
            style={{
              color: T.textFaint,
            }}
          >
            <Cloud size={12} />
            CLOUD
          </p>

          <StatRow
            label="AWS"
            value={CLOUD.aws.toLocaleString()}
            dot={T.amber}
          />

          <StatRow
            label="Azure"
            value={CLOUD.azure.toLocaleString()}
            dot={T.info}
          />

          <div
            className="my-3"
            style={{
              borderTop:
                `1px solid ${T.border}`,
            }}
          />

          <p
            className="text-xs font-semibold mb-1 flex items-center gap-1.5 tracking-wide"
            style={{
              color: T.textFaint,
            }}
          >
            <Boxes size={12} />
            KUBERNETES
          </p>

          <StatRow
            label="Clusters"
            value={K8S.clusters}
          />

          <StatRow
            label="Pods"
            value={K8S.pods.toLocaleString()}
          />
        </div>

        {/* Infrastructure Metrics */}
        <div
          className="rounded-lg p-4"
          style={{
            background: T.bgCardAlt,
            border:
              `1px solid ${T.border}`,
          }}
        >
          <p
            className="text-xs font-semibold mb-3 tracking-wide"
            style={{
              color: T.textFaint,
            }}
          >
            INFRASTRUCTURE METRICS
          </p>

          {METRICS.map((metric) => (
            <MetricBar
              key={metric.label}
              {...metric}
            />
          ))}
        </div>

        {/* Alerts */}
        <div
          className="rounded-lg p-4 flex flex-col"
          style={{
            background: T.bgCardAlt,
            border:
              `1px solid ${T.border}`,
          }}
        >
          <p
            className="text-xs font-semibold mb-3 tracking-wide"
            style={{
              color: T.textFaint,
            }}
          >
            ALERTS
          </p>

          <div className="flex flex-col gap-2">
            {ALERTS.map((alert) => (
              <AlertRow
                key={alert.id}
                alert={alert}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Uptime */}
      <div
        className="mx-5 mb-5 rounded-lg px-4 py-3 flex items-center gap-3"
        style={{
          background:
            "rgba(53,196,122,0.07)",
          border:
            "1px solid rgba(53,196,122,0.22)",
        }}
      >
        <CheckCircle2
          size={18}
          style={{
            color: T.green,
            flexShrink: 0,
          }}
        />

        <p
          className="text-sm"
          style={{
            color: T.textPrimary,
          }}
        >
          <span className="font-mono font-semibold">
            99.99%
          </span>{" "}
          uptime{" "}
          <span
            style={{
              color: T.textFaint,
            }}
          >
            ·
          </span>{" "}
          0 outages{" "}
          <span
            style={{
              color: T.textFaint,
            }}
          >
            ·
          </span>{" "}
          SLA met
        </p>
      </div>

      {/* Actions */}
      <div
        className="flex flex-wrap items-center gap-3 px-5 py-4"
        style={{
          borderTop:
            `1px solid ${T.border}`,
        }}
      >
        <ActionButton
          variant="primary"
          onClick={() =>
            onAction(
              "Asset inventory will be available here."
            )
          }
        >
          View Assets
        </ActionButton>

        <ActionButton
          onClick={() =>
            onAction(
              "Auto-scaling triggered for DB-SRV-12."
            )
          }
        >
          Scale
        </ActionButton>

        <ActionButton
          onClick={() =>
            onAction(
              "Investigation started for the selected alert."
            )
          }
        >
          Investigate
        </ActionButton>
      </div>
    </div>
  );
}

// ============================================================
// MAIN DASHBOARD
// ============================================================
export default function Dashboard() {
  const [active, setActive] =
    useState("dashboard");

  const [toasts, setToasts] =
    useState([]);

  const toastId =
    useRef(0);

  const pushToast = useCallback(
    (message) => {
      const id =
        toastId.current++;

      setToasts((current) => [
        ...current,
        {
          id,
          message,
        },
      ]);

      setTimeout(() => {
        setToasts((current) =>
          current.filter(
            (toast) =>
              toast.id !== id
          )
        );
      }, 3200);
    },
    []
  );

  const handleNav = useCallback(
    (id) => {
      setActive(id);

      if (id !== "dashboard") {
        const item =
          NAV_ITEMS.find(
            (nav) =>
              nav.id === id
          );

        pushToast(
          `${item.label} module is coming in a later milestone.`
        );

        setTimeout(() => {
          setActive("dashboard");
        }, 50);
      }
    },
    [pushToast]
  );

  return (
    <div
      className="w-full h-screen flex overflow-hidden relative"
      style={{
        background: T.bgApp,
        fontFamily:
          "Inter, system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ========================================================
          ANIMATIONS
      ======================================================== */}
      <style>{`
        @keyframes toastIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes scan {
          0% {
            transform: translateX(-120%);
          }

          100% {
            transform: translateX(320%);
          }
        }
      `}</style>

      {/* ========================================================
          BACKGROUND GRID
      ======================================================== */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.42]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",

          backgroundSize:
            "42px 42px",

          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",

          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
        }}
      />

      {/* ========================================================
          RED AMBIENT GLOW
      ======================================================== */}
      <div
        className="pointer-events-none absolute -top-40 right-0 w-[520px] h-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(229,72,77,0.12), transparent 70%)",
          filter: "blur(22px)",
        }}
      />

      {/* ========================================================
          SIDEBAR
      ======================================================== */}
      <Sidebar
        active={active}
        onSelect={handleNav}
      />

      {/* ========================================================
          CONTENT AREA
      ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        <Header
          onLogout={() =>
            pushToast(
              "You have been logged out."
            )
          }
        />

        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 relative">
          <div className="max-w-[1400px] mx-auto">

            {/* Page Heading */}
            <div
              className="mb-5 flex items-end justify-between flex-wrap gap-2"
              style={{
                animation:
                  "fadeUp 0.4s ease-out both",
              }}
            >
              <div>
                <h2
                  className="text-lg font-semibold tracking-tight"
                  style={{
                    color: T.textPrimary,
                  }}
                >
                  Servers, Cloud, Network Health
                </h2>

                <p
                  className="text-sm"
                  style={{
                    color: T.textFaint,
                  }}
                >
                  Real-time infrastructure posture across all monitored environments
                </p>
              </div>

              <div
                className="hidden sm:flex items-center gap-2 text-xs"
                style={{
                  color: T.textFaint,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: T.accent,
                    boxShadow:
                      `0 0 7px ${T.accent}`,
                  }}
                />

                Auto-refreshing
              </div>
            </div>

            {/* Summary Cards */}
            <div className="flex flex-wrap gap-4 mb-5">
              {SUMMARY_DATA.map(
                (summary, index) => (
                  <SummaryCard
                    key={summary.label}
                    {...summary}
                    index={index}
                  />
                )
              )}
            </div>

            {/* Infrastructure Health */}
            <InfrastructureHealth
              onAction={pushToast}
            />
          </div>
        </main>
      </div>

      {/* Toasts */}
      <ToastStack
        toasts={toasts}
      />
    </div>
  );
}