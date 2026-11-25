import type { HabitLog } from "./types";

export type GrowthStage = 1 | 2 | 3 | 4;

export interface GrowthStageInfo {
  stage: GrowthStage;
  label: string;
  /** この段階になる累計達成日数 */
  minDays: number;
}

const FIRST_STAGE: GrowthStageInfo = { stage: 1, label: "細身", minDays: 0 };
const FINAL_STAGE: GrowthStageInfo = {
  stage: 4,
  label: "ゴリマッチョ",
  minDays: 90,
};

export const GROWTH_STAGES: readonly GrowthStageInfo[] = [
  FIRST_STAGE,
  { stage: 2, label: "引き締まった体", minDays: 30 },
  { stage: 3, label: "マッチョ", minDays: 60 },
  FINAL_STAGE,
];

export interface Growth {
  achievedDays: number;
  current: GrowthStageInfo;
  /** 最終段階なら null */
  next: GrowthStageInfo | null;
  daysToNext: number;
  /** 今の段階に入ってから次の段階までの進み具合(0〜1) */
  stageProgress: number;
  /** 体型の変化量(0 = 初期、1 = 最終段階)。達成日数に応じて連続的に変わる */
  bodyProgress: number;
}

/** 習慣を1つ以上達成した日の数。同じ日に複数達成しても1日と数える */
export function countAchievedDays(logs: Pick<HabitLog, "logDate">[]): number {
  return new Set(logs.map((log) => log.logDate)).size;
}

export function toBodyProgress(achievedDays: number): number {
  return Math.min(1, Math.max(0, achievedDays / FINAL_STAGE.minDays));
}

/** 成長段階の判定。基準を変えるときはこの関数と GROWTH_STAGES だけを直す */
export function getGrowth(achievedDays: number): Growth {
  const current =
    GROWTH_STAGES.findLast((stage) => achievedDays >= stage.minDays) ??
    FIRST_STAGE;
  const next =
    GROWTH_STAGES.find((stage) => achievedDays < stage.minDays) ?? null;

  return {
    achievedDays,
    current,
    next,
    daysToNext: next ? next.minDays - achievedDays : 0,
    stageProgress: next
      ? (achievedDays - current.minDays) / (next.minDays - current.minDays)
      : 1,
    bodyProgress: toBodyProgress(achievedDays),
  };
}
