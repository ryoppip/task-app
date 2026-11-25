import { useMemo } from "react";
import {
  countAchievedDays,
  getGrowth,
  type Growth,
} from "@/lib/domain/growth";
import {
  getLevelProgress,
  sumXp,
  sumXpOn,
  type LevelProgress,
} from "@/lib/domain/xp";
import { habitLogsQuery, xpTransactionsQuery } from "@/lib/query/queries";
import { useRepositoryQuery } from "./use-repository";
import { useToday } from "./use-today";

export interface GrowthSummary {
  growth: Growth;
  level: LevelProgress;
  totalXp: number;
  todayXp: number;
}

export function useGrowthSummary() {
  const today = useToday();
  const logs = useRepositoryQuery(habitLogsQuery);
  const transactions = useRepositoryQuery(xpTransactionsQuery);

  const summary = useMemo<GrowthSummary | null>(() => {
    if (!today || !logs.data || !transactions.data) return null;
    const totalXp = sumXp(transactions.data);
    return {
      growth: getGrowth(countAchievedDays(logs.data)),
      level: getLevelProgress(totalXp),
      totalXp,
      todayXp: sumXpOn(transactions.data, today),
    };
  }, [today, logs.data, transactions.data]);

  return { summary, error: logs.error ?? transactions.error };
}
