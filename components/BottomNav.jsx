"use client";

import { Home, PlusCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Log", href: "/log", icon: PlusCircle },
    { name: "Cycle", href: "/cycle", icon: Calendar }
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 flex justify-around p-3 shadow-[0_-4px_15px_rgba(0,0,0,0.03)] z-50 rounded-t-xl transition-all">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={clsx(
              "flex flex-col items-center gap-1 transition-all duration-300 ease-out",
              isActive ? "text-blue-600 scale-110 font-semibold" : "text-gray-400 hover:text-gray-600 scale-100"
            )}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[10px] uppercase tracking-wider">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
