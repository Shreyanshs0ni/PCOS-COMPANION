"use client";

import { Home, Clock, PlusCircle, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { name: "Today", href: "/today", icon: Home },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Check-in", href: "/checkin", icon: PlusCircle, center: true },
  { name: "Insights", href: "/insights", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 w-full max-w-md flex items-end justify-around z-50"
      style={{
        background: "var(--bg-nav)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-light)",
        paddingBottom: "calc(8px + env(safe-area-inset-bottom, 0px))",
        paddingTop: "8px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        if (tab.center) {
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className="flex flex-col items-center -mt-5 transition-transform duration-200 active:scale-95"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, var(--primary), var(--primary-dark))"
                    : "linear-gradient(135deg, var(--primary-light), var(--primary))",
                  boxShadow: "0 6px 20px rgba(139, 126, 200, 0.35)",
                  transform: isActive ? "scale(1.08)" : "scale(1)",
                }}
              >
                <Icon size={24} color="white" strokeWidth={2} />
              </div>
              <span
                className="text-[9px] font-bold uppercase tracking-wider mt-1"
                style={{ color: isActive ? "var(--primary)" : "var(--text-tertiary)" }}
              >
                {tab.name}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={tab.name}
            href={tab.href}
            className="flex flex-col items-center gap-1 py-1 px-3 transition-all duration-200 active:scale-95"
          >
            <div
              className="p-1.5 rounded-xl transition-all duration-200"
              style={{
                background: isActive ? "var(--primary-50)" : "transparent",
              }}
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? "var(--primary)" : "var(--text-tertiary)" }}
              />
            </div>
            <span
              className="text-[9px] font-semibold uppercase tracking-wider"
              style={{ color: isActive ? "var(--primary)" : "var(--text-tertiary)" }}
            >
              {tab.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
