import { describe, expect, it } from "vitest";
import { countAchievedDays, getGrowth } from "./growth";

describe("countAchievedDays", () => {
  it("同じ日に複数達成しても1日と数える", () => {
    expect(countAchievedDays([])).toBe(0);
    expect(
      countAchievedDays([
        { logDate: "2026-11-24" },
        { logDate: "2026-11-25" },
        { logDate: "2026-11-25" },
      ]),
    ).toBe(2);
  });

  it("間が空いても日数は減らない", () => {
    expect(
      countAchievedDays([{ logDate: "2026-01-01" }, { logDate: "2026-11-25" }]),
    ).toBe(2);
  });
});

describe("getGrowth", () => {
  it.each([
    [0, 1],
    [29, 1],
    [30, 2],
    [59, 2],
    [60, 3],
    [89, 3],
    [90, 4],
    [500, 4],
  ])("累計%i日は第%i段階", (days, stage) => {
    expect(getGrowth(days).current.stage).toBe(stage);
  });

  it("次の段階までの日数と進み具合を返す", () => {
    expect(getGrowth(0)).toMatchObject({ daysToNext: 30, stageProgress: 0 });
    expect(getGrowth(45)).toMatchObject({ daysToNext: 15, stageProgress: 0.5 });
    expect(getGrowth(89).daysToNext).toBe(1);
  });

  it("最終段階では次がない", () => {
    expect(getGrowth(90)).toMatchObject({
      next: null,
      daysToNext: 0,
      stageProgress: 1,
    });
  });

  it("体型は1日ごとに変わり、0〜1に収まる", () => {
    for (let days = 1; days <= 90; days += 1) {
      expect(getGrowth(days).bodyProgress).toBeGreaterThan(
        getGrowth(days - 1).bodyProgress,
      );
    }
    expect(getGrowth(0).bodyProgress).toBe(0);
    expect(getGrowth(90).bodyProgress).toBe(1);
    expect(getGrowth(365).bodyProgress).toBe(1);
  });
});
