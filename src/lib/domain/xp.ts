import type { DateKey } from "@/lib/date/date-key";
import type { XpTransaction } from "./types";

export const XP_PER_LEVEL = 1000;

export interface LevelProgress {
  level: number;
  /** 今のレベルに入ってから獲得した XP */
  xpInLevel: number;
  xpToNextLevel: number;
  /** 0〜1 */
  progress: number;
}

/** 累計 XP。取消分(負の値)を含む履歴の合計を正とする */
export function sumXp(transactions: Pick<XpTransaction, "amount">[]): number {
  return transactions.reduce((total, item) => total + item.amount, 0);
}

export function sumXpOn(
  transactions: Pick<XpTransaction, "amount" | "logDate">[],
  date: DateKey,
): number {
  return sumXp(transactions.filter((item) => item.logDate === date));
}

export function getLevelProgress(totalXp: number): LevelProgress {
  const xp = Math.max(0, totalXp);
  const xpInLevel = xp % XP_PER_LEVEL;
  return {
    level: Math.floor(xp / XP_PER_LEVEL) + 1,
    xpInLevel,
    xpToNextLevel: XP_PER_LEVEL - xpInLevel,
    progress: xpInLevel / XP_PER_LEVEL,
  };
}
