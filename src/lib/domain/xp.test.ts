import { describe, expect, it } from "vitest";
import { getLevelProgress, sumXp, sumXpOn } from "./xp";

const transactions = [
  { logDate: "2026-11-24", amount: 50 },
  { logDate: "2026-11-25", amount: 30 },
  { logDate: "2026-11-25", amount: 10 },
  { logDate: "2026-11-25", amount: -30 },
];

describe("XP の集計", () => {
  it("取消を含めて合計する", () => {
    expect(sumXp([])).toBe(0);
    expect(sumXp(transactions)).toBe(60);
  });

  it("対象日の分だけ合計する", () => {
    expect(sumXpOn(transactions, "2026-11-25")).toBe(10);
    expect(sumXpOn(transactions, "2026-11-26")).toBe(0);
  });
});

describe("getLevelProgress", () => {
  it.each([
    [0, 1, 1000],
    [999, 1, 1],
    [1000, 2, 1000],
    [2500, 3, 500],
  ])("%iXP はレベル%i、次まで%iXP", (xp, level, xpToNextLevel) => {
    expect(getLevelProgress(xp)).toMatchObject({ level, xpToNextLevel });
  });

  it("レベル内の進み具合を返す", () => {
    expect(getLevelProgress(1250)).toMatchObject({
      xpInLevel: 250,
      progress: 0.25,
    });
  });
});
