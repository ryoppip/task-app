export type Point = readonly [x: number, y: number];

export const round = (value: number) => Math.round(value * 100) / 100;

const format = ([x, y]: Point) => `${round(x)} ${round(y)}`;

/** 点を通る滑らかな閉曲線(Catmull-Rom → ベジェ) */
export function smoothClosedPath(points: readonly Point[]): string {
  const at = (index: number): Point =>
    points[(index + points.length) % points.length] ?? [0, 0];
  const segments = points.map((_, index) => {
    const p0 = at(index - 1);
    const p1 = at(index);
    const p2 = at(index + 1);
    const p3 = at(index + 2);
    const control1: Point = [
      p1[0] + (p2[0] - p0[0]) / 6,
      p1[1] + (p2[1] - p0[1]) / 6,
    ];
    const control2: Point = [
      p2[0] - (p3[0] - p1[0]) / 6,
      p2[1] - (p3[1] - p1[1]) / 6,
    ];
    return `C${format(control1)} ${format(control2)} ${format(p2)}`;
  });
  return `M${format(at(0))}${segments.join("")}Z`;
}

export const move = (point: Point) => `M${format(point)}`;
export const line = (...points: Point[]) =>
  points.map((point) => `L${format(point)}`).join("");
export const curve = (control: Point, end: Point) =>
  `Q${format(control)} ${format(end)}`;
