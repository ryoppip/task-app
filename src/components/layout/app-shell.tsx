import type { ReactNode } from "react";
import { BottomNav } from "./bottom-nav";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="min-h-dvh pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0 md:pl-60">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 md:px-10 md:py-10">
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}
