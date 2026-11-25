/**
 * キャラクターの体型を、変化量(0〜1)から SVG のパスに変換する。
 * 初期・30日・60日・90日の4つの体型を基準にして間を補間するため、
 * 1日ごとに少しずつ変わり、節目では必ず基準の体型になる。
 */

export const FIGURE_WIDTH = 240;
export const FIGURE_HEIGHT = 400;

const CENTER_X = FIGURE_WIDTH / 2;

type Keyframes = readonly [number, number, number, number];

/** 片側の寸法。左右対称なので右半分だけを定義する */
const BODY = {
  neck: [7.5, 9.5, 13, 17],
  trapRise: [0, 2, 6, 11],
  shoulder: [33, 45, 61, 79],
  armpit: [22, 30, 40, 50],
  lat: [20, 30, 43, 57],
  waist: [17, 21, 25, 29],
  hip: [19, 22.5, 26.5, 31],
  deltoid: [6.5, 10, 15.5, 21.5],
  upperArm: [4.5, 7.8, 13, 19],
  elbow: [4.4, 6, 8.4, 10.6],
  forearm: [4.3, 6.8, 10.2, 14],
  wrist: [3.4, 4.6, 6, 7.4],
  hand: [6, 6.6, 7.4, 8.2],
  /** 肩から肘、肘から手首への外側への開き */
  armSpread: [3, 5, 9, 14],
  forearmSpread: [1, 1.5, 2.5, 3.5],
  thigh: [9, 13, 17, 22],
  knee: [6.5, 8, 9.8, 11.8],
  calf: [6.2, 9, 12.4, 16.5],
  ankle: [4.6, 5.2, 6, 6.8],
  /** 筋肉の輪郭線の濃さ */
  definition: [0, 0.35, 0.7, 1],
} as const satisfies Record<string, Keyframes>;

type Body = Record<keyof typeof BODY, number>;
type Point = readonly [x: number, y: number];

export interface Figure {
  /** 左右対称の部位(全身ぶんのパス) */
  torso: string;
  tank: string;
  shorts: string;
  abs: string;
  /** 右半身のパス。左は反転して描く */
  arm: string;
  /** 胴体との境目を示す、腕の内側の線 */
  armLine: string;
  leg: string;
  shoe: string;
  pec: string;
  trap: string;
  deltoidLine: string;
  bicepsLine: string;
  calfLine: string;
  hand: { cx: number; cy: number; rx: number; ry: number };
  definition: number;
}

function interpolate(keyframes: Keyframes, progress: number): number {
  const position = Math.min(1, Math.max(0, progress)) * 3;
  const index = Math.min(2, Math.floor(position));
  const from = keyframes[index] ?? keyframes[0];
  const to = keyframes[index + 1] ?? from;
  return from + (to - from) * (position - index);
}

function getBody(progress: number): Body {
  const entries = Object.entries(BODY).map(([key, keyframes]) => [
    key,
    interpolate(keyframes, progress),
  ]);
  return Object.fromEntries(entries) as Body;
}

const round = (value: number) => Math.round(value * 100) / 100;
const format = ([x, y]: Point) => `${round(x)} ${round(y)}`;

/** 点を通る滑らかな閉曲線(Catmull-Rom → ベジェ) */
function smoothClosedPath(points: readonly Point[]): string {
  const at = (index: number): Point =>
    points[(index + points.length) % points.length] ?? [0, 0];
  const segments = points.map((_, index) => {
    const [p0, p1, p2, p3] = [-1, 0, 1, 2].map((offset) => at(index + offset));
    if (!p0 || !p1 || !p2 || !p3) return "";
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

/** 右半分の点(中心からの距離, y)を左右対称の閉曲線にする */
function symmetric(half: readonly Point[]): Point[] {
  const right = half.map(([dx, y]): Point => [CENTER_X + dx, y]);
  const left = half.map(([dx, y]): Point => [CENTER_X - dx, y]).reverse();
  return [...right, ...left];
}

export function buildFigure(progress: number): Figure {
  const b = getBody(progress);
  const x = (dx: number) => CENTER_X + dx;

  // 腕の軸。肩の外端が shoulder に一致するように置く
  const shoulderX = x(b.shoulder - b.deltoid);
  const elbowX = shoulderX + b.armSpread;
  const wristX = elbowX + b.forearmSpread;
  const upperAxis = (y: number) =>
    shoulderX + (elbowX - shoulderX) * ((y - 112) / 74);

  // 脚の軸。太ももの内側どうしが触れない位置に置く
  const thighX = x(b.thigh + 1.5);
  const kneeX = x(b.thigh * 0.92 + 3);
  const ankleX = x(b.thigh * 0.85 + 4.5);

  const strapInner = b.neck + 5;
  const strapOuter = strapInner + 7 + b.neck * 0.3;
  const hipY = 226;

  const arm = smoothClosedPath([
    [shoulderX - b.deltoid * 0.35, 101],
    [shoulderX + b.deltoid * 0.55, 103.5],
    [shoulderX + b.deltoid, 117],
    [upperAxis(136) + b.upperArm * 0.98, 136],
    [upperAxis(158) + b.upperArm, 158],
    [elbowX + b.elbow, 185],
    [elbowX + b.forearm, 202],
    [wristX + b.wrist, 233],
    [wristX - b.wrist, 233],
    [elbowX - b.forearm * 0.85, 204],
    [elbowX - b.elbow, 185],
    [upperAxis(160) - b.upperArm, 160],
    [upperAxis(140) - b.upperArm * 0.9, 140],
    [shoulderX - b.deltoid * 0.8, 120],
  ]);

  const armLine = [
    `M${format([shoulderX - b.deltoid * 0.8, 122])}`,
    `Q${format([upperAxis(140) - b.upperArm * 0.95, 138])} ${format([upperAxis(160) - b.upperArm, 160])}`,
    `Q${format([upperAxis(174) - b.upperArm * 0.95, 174])} ${format([elbowX - b.elbow, 185])}`,
  ].join("");

  const torso = smoothClosedPath(
    symmetric([
      [b.neck, 70],
      [b.neck, 88],
      [b.neck + (b.shoulder - b.neck) * 0.35, 98 - b.trapRise * 0.6],
      [b.shoulder - b.deltoid, 102],
      [b.armpit + 3, 124],
      [b.armpit, 140],
      [b.lat, 160],
      [b.waist, 200],
      [b.hip, hipY],
    ]),
  );

  const tankHalf = (side: 1 | -1) => {
    const px = (dx: number) => x(dx * side);
    return {
      strapInner: [px(strapInner), 96 - b.trapRise * 0.4] as Point,
      strapOuter: [px(strapOuter), 98 - b.trapRise * 0.25] as Point,
      armholeControl: [px(strapOuter + 1), 130] as Point,
      armpit: [px(b.armpit + 1), 141] as Point,
      latControl: [px(b.lat + 3.5), 163] as Point,
      waist: [px(b.waist + 1), 200] as Point,
      hip: [px(b.hip + 1), hipY] as Point,
      neckControl: [px(strapInner - 1), 122] as Point,
    };
  };
  const r = tankHalf(1);
  const l = tankHalf(-1);
  const tank = [
    `M${format(r.strapInner)}L${format(r.strapOuter)}`,
    `Q${format(r.armholeControl)} ${format(r.armpit)}`,
    `Q${format(r.latControl)} ${format(r.waist)}L${format(r.hip)}`,
    `L${format(l.hip)}L${format(l.waist)}`,
    `Q${format(l.latControl)} ${format(l.armpit)}`,
    `Q${format(l.armholeControl)} ${format(l.strapOuter)}`,
    `L${format(l.strapInner)}`,
    `Q${format(l.neckControl)} ${format([CENTER_X, 122])}`,
    `Q${format(r.neckControl)} ${format(r.strapInner)}Z`,
  ].join("");

  const hemOuter = kneeX + b.thigh * 0.92 + 4;
  const hemInner = Math.max(CENTER_X + 2, kneeX - b.thigh * 0.92 - 2);
  const hipOuter = Math.max(x(b.hip + 2), thighX + b.thigh + 2);
  const mirror = (value: number) => FIGURE_WIDTH - value;
  const shorts = [
    `M${format([x(b.waist + 2), 216])}`,
    `Q${format([hipOuter, 226])} ${format([hipOuter, 244])}`,
    `L${format([hemOuter, 288])}L${format([hemInner, 290])}`,
    `L${format([CENTER_X, 252])}`,
    `L${format([mirror(hemInner), 290])}L${format([mirror(hemOuter), 288])}`,
    `L${format([mirror(hipOuter), 244])}`,
    `Q${format([mirror(hipOuter), 226])} ${format([x(-b.waist - 2), 216])}Z`,
  ].join("");

  const leg = smoothClosedPath([
    [thighX - b.thigh, 240],
    [thighX + b.thigh, 240],
    [thighX + b.thigh * 0.95, 272],
    [kneeX + b.knee, 306],
    [kneeX + b.calf, 328],
    [ankleX + b.ankle, 364],
    [ankleX + b.ankle, 376],
    [ankleX - b.ankle, 376],
    [ankleX - b.ankle, 364],
    [kneeX - b.calf * 0.9, 330],
    [kneeX - b.knee, 306],
    [thighX - b.thigh * 0.85, 272],
  ]);

  const shoe = [
    `M${format([ankleX - b.ankle - 2, 372])}`,
    `L${format([ankleX + b.ankle + 1, 372])}`,
    `Q${format([ankleX + b.ankle + 13, 376])} ${format([ankleX + b.ankle + 13, 386])}`,
    `L${format([ankleX - b.ankle - 3, 386])}Z`,
  ].join("");

  const pecBottom = 147 + b.definition * 3;
  const pec = [
    `M${format([CENTER_X + 2, pecBottom - 3])}`,
    `Q${format([x(b.armpit * 0.5), pecBottom + 6])} ${format([x(b.armpit - 3), pecBottom - 7])}`,
  ].join("");

  const trap = [
    `M${format([x(b.neck + 1), 92])}`,
    `Q${format([x(b.neck + 5), 101])} ${format([x(b.neck + 13), 105])}`,
  ].join("");

  const deltoidLine = [
    `M${format([shoulderX - b.deltoid * 0.55, 128])}`,
    `Q${format([shoulderX + b.deltoid * 0.15, 140])} ${format([upperAxis(133) + b.upperArm * 0.75, 133])}`,
  ].join("");

  const bicepsLine = [
    `M${format([upperAxis(150) + b.upperArm * 0.1, 148])}`,
    `Q${format([upperAxis(164) + b.upperArm * 0.5, 164])} ${format([elbowX - b.elbow * 0.3, 178])}`,
  ].join("");

  const calfLine = [
    `M${format([kneeX + b.calf * 0.25, 318])}`,
    `Q${format([kneeX + b.calf * 0.6, 332])} ${format([kneeX + b.calf * 0.2, 344])}`,
  ].join("");

  const abs = [
    `M${format([CENTER_X, pecBottom + 2])}L${format([CENTER_X, 208])}`,
    ...[170, 187].map(
      (y) =>
        `M${format([x(-b.waist * 0.42), y])}L${format([x(b.waist * 0.42), y])}`,
    ),
  ].join("");

  return {
    torso,
    tank,
    shorts,
    abs,
    arm,
    armLine,
    leg,
    shoe,
    pec,
    trap,
    deltoidLine,
    bicepsLine,
    calfLine,
    hand: {
      cx: round(wristX + 0.5),
      cy: 240,
      rx: round(b.hand),
      ry: round(b.hand * 1.5),
    },
    definition: round(b.definition),
  };
}
