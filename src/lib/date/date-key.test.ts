import { describe, expect, it } from "vitest";
import {
  addDays,
  diffDays,
  eachDay,
  getWeekday,
  isDateKey,
  startOfWeek,
  toDateKey,
} from "./date-key";

describe("toDateKey", () => {
  it("東京の0時で日付が切り替わる", () => {
    expect(toDateKey(new Date("2026-11-24T14:59:59.999Z"))).toBe("2026-11-24");
    expect(toDateKey(new Date("2026-11-24T15:00:00.000Z"))).toBe("2026-11-25");
  });

  it("年をまたぐ", () => {
    expect(toDateKey(new Date("2026-12-31T15:00:00.000Z"))).toBe("2027-01-01");
  });
});

describe("日付の計算", () => {
  it("月末・うるう日をまたいで加算できる", () => {
    expect(addDays("2026-11-30", 1)).toBe("2026-12-01");
    expect(addDays("2028-02-28", 1)).toBe("2028-02-29");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("日数の差を返す", () => {
    expect(diffDays("2026-11-25", "2026-11-25")).toBe(0);
    expect(diffDays("2026-11-25", "2027-02-23")).toBe(90);
    expect(diffDays("2026-11-25", "2026-11-24")).toBe(-1);
  });

  it("曜日と月曜始まりの週の初日を返す", () => {
    expect(getWeekday("2026-11-25")).toBe(3);
    expect(startOfWeek("2026-11-25")).toBe("2026-11-23");
    expect(startOfWeek("2026-11-23")).toBe("2026-11-23");
    expect(startOfWeek("2026-11-29")).toBe("2026-11-23");
  });

  it("両端を含む日付の列を返し、逆順なら空になる", () => {
    expect(eachDay("2026-11-30", "2026-12-01")).toEqual([
      "2026-11-30",
      "2026-12-01",
    ]);
    expect(eachDay("2026-12-01", "2026-11-30")).toEqual([]);
  });

  it("不正な日付を拒否する", () => {
    expect(isDateKey("2026-02-29")).toBe(false);
    expect(isDateKey("2026-1-1")).toBe(false);
    expect(isDateKey("2026-11-25")).toBe(true);
    expect(() => addDays("invalid", 1)).toThrow(RangeError);
  });
});
