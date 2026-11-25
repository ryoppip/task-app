import { useSyncExternalStore } from "react";
import { toDateKey, type DateKey } from "@/lib/date/date-key";

const CHECK_INTERVAL_MS = 30_000;

function subscribe(listener: () => void): () => void {
  const timer = setInterval(listener, CHECK_INTERVAL_MS);
  document.addEventListener("visibilitychange", listener);
  return () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", listener);
  };
}

/**
 * 東京の今日の日付。開いたまま日付が変わっても追従する。
 * ビルド時の日付が混ざらないよう、サーバー側では null になる。
 */
export function useToday(): DateKey | null {
  return useSyncExternalStore<DateKey | null>(
    subscribe,
    () => toDateKey(new Date()),
    () => null,
  );
}
