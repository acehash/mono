"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页" },
  { href: "/records", label: "流水" },
  { href: "/stats", label: "统计" },
];

export default function TopNav() {
  const pathname = usePathname();

  if (pathname === "/login") return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 safe-top bg-paper/90 backdrop-blur-md border-b-0">
      {/* Notebook header line */}
      <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-paper-line opacity-60" />

      <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="text-title tracking-tight font-semibold text-ink"
        >
          Mono
        </Link>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative px-3.5 py-2 text-caption font-medium transition-colors duration-150 ${
                  active
                    ? "text-ink sketch-underline"
                    : "text-ink-faint hover:text-ink-light"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
