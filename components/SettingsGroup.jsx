"use client";

import { ChevronRight } from "lucide-react";

export default function SettingsGroup({ title, children }) {
  return (
    <div className="mb-5 animate-slide-up">
      {title && (
        <h3
          className="text-xs font-bold uppercase tracking-wider px-1 mb-2"
          style={{ color: "var(--text-tertiary)" }}
        >
          {title}
        </h3>
      )}
      <div
        className="card overflow-hidden divide-y"
        style={{ borderColor: "var(--glass-border)" }}
      >
        {children}
      </div>
    </div>
  );
}

export function SettingsItem({
  icon,
  label,
  value,
  onClick,
  danger,
  toggle,
  checked,
  onToggle,
}) {
  if (toggle) {
    return (
      <div
        className="flex items-center justify-between px-4 py-3.5"
        style={{ borderColor: "var(--border-light)" }}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-lg">{icon}</span>}
          <span
            className="text-sm font-medium"
            style={{ color: danger ? "#E55C5C" : "var(--text-primary)" }}
          >
            {label}
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            onChange={(e) => onToggle?.(e.target.checked)}
          />
          <div
            className="w-10 h-6 rounded-full peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200"
            style={{
              background: checked ? "var(--primary)" : "var(--border)",
              afterBackground: "white",
            }}
          >
            <div
              className="absolute top-0.5 rounded-full h-5 w-5 transition-all duration-200 bg-white shadow-sm"
              style={{ left: checked ? "18px" : "2px" }}
            />
          </div>
        </label>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between px-4 py-3.5 w-full text-left hover:bg-black/[0.02] transition-colors"
    >
      <div className="flex items-center gap-3">
        {icon && <span className="text-lg">{icon}</span>}
        <span
          className="text-sm font-medium"
          style={{ color: danger ? "#E55C5C" : "var(--text-primary)" }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {value && (
          <span className="text-xs" style={{ color: "var(--text-tertiary)" }}>
            {value}
          </span>
        )}
        <ChevronRight size={16} style={{ color: "var(--text-tertiary)" }} />
      </div>
    </button>
  );
}
