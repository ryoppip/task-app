"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ALL_NAV, isActivePath } from "@/lib/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col overflow-y-auto border-r border-line bg-card px-4 py-6 md:flex">
      <Link
        href="/"
        className="rounded-control px-3 text-lg font-bold tracking-tight"
      >
        Habit Quest
      </Link>
      <nav aria-label="メインメニュー" className="mt-8">
        <ul className="space-y-1">
          {ALL_NAV.map(({ href, label, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex min-h-11 items-center gap-3 rounded-control px-3 text-sm transition-colors ${
                    active
                      ? "bg-secondary font-semibold"
                      : "text-muted hover:bg-background hover:text-foreground"
                  }`}
                >
                  <Icon aria-hidden className="size-5 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
