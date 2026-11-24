"use client";

import { Ellipsis, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { isActivePath, PRIMARY_NAV, SECONDARY_NAV } from "@/lib/navigation";

const ITEM_CLASS =
  "flex h-16 w-full flex-col items-center justify-center gap-1 text-xs";

function itemColor(active: boolean): string {
  return active ? "font-semibold text-primary-strong" : "text-muted";
}

export function BottomNav() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isSecondaryActive = SECONDARY_NAV.some((item) =>
    isActivePath(pathname, item.href),
  );
  const closeMenu = () => dialogRef.current?.close();

  return (
    <>
      <nav
        aria-label="メインメニュー"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
      >
        <ul className="grid grid-cols-5">
          {PRIMARY_NAV.map(({ href, shortLabel, icon: Icon }) => {
            const active = isActivePath(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`${ITEM_CLASS} ${itemColor(active)}`}
                >
                  <Icon aria-hidden className="size-5" />
                  {shortLabel}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() => dialogRef.current?.showModal()}
              className={`${ITEM_CLASS} ${itemColor(isSecondaryActive)}`}
            >
              <Ellipsis aria-hidden className="size-5" />
              その他
            </button>
          </li>
        </ul>
      </nav>

      <dialog
        ref={dialogRef}
        aria-label="その他のメニュー"
        onClick={(event) => {
          // 背景部分のクリックは dialog 自身がターゲットになる
          if (event.target === event.currentTarget) closeMenu();
        }}
        className="mx-0 mt-auto mb-0 w-full max-w-none rounded-t-card bg-card text-foreground backdrop:bg-foreground/40 md:hidden"
      >
        <div className="px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <p className="px-2 font-semibold">その他</p>
            <button
              type="button"
              aria-label="閉じる"
              onClick={closeMenu}
              className="grid size-11 place-items-center rounded-control text-muted"
            >
              <X aria-hidden className="size-5" />
            </button>
          </div>
          <ul className="mt-2">
            {SECONDARY_NAV.map(({ href, label, icon: Icon }) => {
              const active = isActivePath(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-12 items-center gap-3 rounded-control px-2 ${
                      active ? "bg-secondary font-semibold" : ""
                    }`}
                  >
                    <Icon aria-hidden className="size-5" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </dialog>
    </>
  );
}
