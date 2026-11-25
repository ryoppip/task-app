import { describe, expect, it } from "vitest";
import { buildFigure, FIGURE_HEIGHT, FIGURE_WIDTH } from "./figure";

function coordinates(path: string): number[] {
  return (path.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);
}

describe("buildFigure", () => {
  it("どの日数でも、座標が画面内に収まる", () => {
    for (let days = 0; days <= 90; days += 1) {
      const figure = buildFigure(days / 90);
      for (const path of [
        figure.torso,
        figure.upperArm,
        figure.forearm,
        figure.leg,
        figure.shoe,
      ]) {
        const values = coordinates(path);
        expect(values.length).toBeGreaterThan(0);
        values.forEach((value, index) => {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(
            index % 2 === 0 ? FIGURE_WIDTH : FIGURE_HEIGHT,
          );
        });
      }
    }
  });

  it("1日ごとに形が変わる", () => {
    for (let days = 1; days <= 90; days += 1) {
      const before = buildFigure((days - 1) / 90);
      const after = buildFigure(days / 90);
      expect(after.upperArm).not.toBe(before.upperArm);
      expect(after.torso).not.toBe(before.torso);
    }
  });

  it("範囲外の値は両端の体型になる", () => {
    expect(buildFigure(-1)).toEqual(buildFigure(0));
    expect(buildFigure(2)).toEqual(buildFigure(1));
  });
});
