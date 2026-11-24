import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { RepositoryProvider } from "@/components/providers/repository-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Habit Quest", template: "%s | Habit Quest" },
  description: "毎日の積み重ねが、自分を変える。習慣と成長の記録アプリ。",
};

export const viewport: Viewport = {
  themeColor: "#FAF9F6",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <RepositoryProvider>
          <AppShell>{children}</AppShell>
        </RepositoryProvider>
      </body>
    </html>
  );
}
