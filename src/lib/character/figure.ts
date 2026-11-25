/**
 * キャラクターの体型を、変化量(0〜1)から SVG のパスに変換する。
 * 初期・30日・60日・90日の4つの体型を基準にして間を補間するため、
 * 1日ごとに少しずつ変わり、節目では必ず基準の体型になる。
 *
 * ポーズは両腕で力こぶを見せる立ち姿で、全段階で共通。
 */
import {
  curve,
  line,
  move,
  round,
  smoothClosedPath,
  type Point,
} from "./svg-path";

export const FIGURE_WIDTH = 300;
export const FIGURE_HEIGHT = 420;

const CENTER_X = FIGURE_WIDTH / 2;
const SHOULDER_Y = 136;
const BELT_TOP = 224;
const BELT_BOTTOM = 239;

type Keyframes = readonly [number, number, number, number];

/** 片側の寸法。左右対称なので右半分だけを定義する */
const BODY = {
  neck: [8.5, 11.5, 16, 21],
  trapRise: [0, 3, 8, 14],
  /** 中心から肩関節まで */
  joint: [27, 37, 48, 60],
  deltoid: [6.5, 12, 19, 27],
  armpit: [22, 32, 43, 54],
  lat: [20, 31, 44, 57],
  waist: [17, 21, 24.5, 28],
  hip: [19, 24, 28, 33],
  /** 肩関節から肘まで */
  upperArmLength: [42, 44, 46, 49],
  biceps: [3.8, 9.5, 18.5, 31],
  triceps: [4, 7.5, 13, 19],
  elbow: [4.4, 6.2, 8.5, 11],
  forearm: [4.2, 7.2, 11.2, 15.5],
  wrist: [3.4, 4.8, 6.4, 8.4],
  fist: [7.5, 8.8, 10.4, 12.4],
  thigh: [9, 14, 19, 25],
  knee: [6.5, 8.5, 10.5, 13],
  calf: [6, 9.5, 13.5, 18.5],
  ankle: [4.6, 5.6, 6.8, 8],
  /** 筋肉の陰影の濃さ */
  definition: [0, 0.4, 0.75, 1],
} as const satisfies Record<string, Keyframes>;

type Body = Record<keyof typeof BODY, number>;

export interface Figure {
  /** 左右対称の部位(全身ぶんのパス) */
  torso: string;
  tank: string;
  belt: string;
  shorts: string;
  abs: string;
  /** 以下は右半身のパス。左は反転して描く */
  trapShade: string;
  collarbone: string;
  pecShade: string;
  pecLine: string;
  latShade: string;
  forearm: string;
  forearmShade: string;
  upperArm: string;
  tricepsShade: string;
  bicepsHighlight: string;
  deltoid: string;
  deltoidShade: string;
  deltoidHighlight: string;
  wristband: string;
  fist: { x: number; y: number; size: number };
  leg: string;
  quadShade: string;
  calfShade: string;
  shoe: string;
  shoeSole: string;
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

const x = (dx: number) => CENTER_X + dx;

/** 右半分の点(中心からの距離, y)を左右対称の点列にする */
function symmetric(half: readonly Point[]): Point[] {
  const right = half.map(([dx, y]): Point => [x(dx), y]);
  const left = half.map(([dx, y]): Point => [x(-dx), y]).reverse();
  return [...right, ...left];
}

function buildArm(b: Body) {
  const sx = x(b.joint);
  const ex = sx + b.upperArmLength;
  const ey = SHOULDER_Y + 3;
  const wx = ex - 4 - b.wrist * 0.5;
  const wristY = 88;
  /** 肩から肘へ t(0〜1)進んだ位置 */
  const along = (t: number) => sx + b.upperArmLength * t;

  return {
    upperArm: smoothClosedPath([
      [sx - b.deltoid * 0.4, SHOULDER_Y - b.deltoid * 0.5],
      [along(0.2), SHOULDER_Y - b.biceps * 0.62],
      [along(0.46), SHOULDER_Y - b.biceps],
      [along(0.72), SHOULDER_Y - b.biceps * 0.72],
      [ex - b.elbow * 0.4, ey - b.elbow],
      [ex + b.elbow, ey - 1],
      [ex, ey + b.elbow],
      [along(0.66), ey + b.triceps * 0.9],
      [along(0.32), ey + b.triceps * 1.1],
      [sx - b.deltoid * 0.3, ey + b.triceps * 0.75],
    ]),
    tricepsShade: [
      move([along(0.12), ey + b.triceps * 0.25]),
      curve([along(0.5), ey + b.triceps * 0.55], [ex - 2, ey + 1]),
      curve([ex - 2, ey + b.elbow * 0.8], [along(0.66), ey + b.triceps * 0.9]),
      curve(
        [along(0.4), ey + b.triceps * 1.2],
        [along(0.12), ey + b.triceps * 0.95],
      ),
      "Z",
    ].join(""),
    bicepsHighlight: smoothClosedPath([
      [along(0.3), SHOULDER_Y - b.biceps * 0.58],
      [along(0.46), SHOULDER_Y - b.biceps * 0.82],
      [along(0.64), SHOULDER_Y - b.biceps * 0.62],
      [along(0.46), SHOULDER_Y - b.biceps * 0.56],
    ]),
    forearm: smoothClosedPath([
      [ex + b.elbow, ey - 2],
      [ex + b.forearm, ey - 22],
      [wx + b.wrist + 1, wristY + 12],
      [wx + b.wrist, wristY - 6],
      [wx - b.wrist, wristY - 6],
      [wx - b.wrist - 1, wristY + 12],
      [ex - b.forearm * 0.95, ey - 22],
      [ex - b.elbow, ey - 2],
    ]),
    forearmShade: [
      move([ex + b.forearm * 0.15, ey - 8]),
      curve(
        [ex + b.forearm * 0.75, ey - 22],
        [wx + b.wrist * 0.45, wristY + 12],
      ),
    ].join(""),
    wristband: [
      move([wx - b.wrist - 1.5, wristY + 1]),
      line(
        [wx + b.wrist + 1.5, wristY + 1],
        [wx + b.wrist + 2.5, wristY + 11],
        [wx - b.wrist - 2.5, wristY + 11],
      ),
      "Z",
    ].join(""),
    fist: {
      x: round(wx - b.fist),
      y: round(wristY - b.fist * 1.75),
      size: round(b.fist * 2),
    },
    deltoid: smoothClosedPath([
      [sx - b.deltoid * 0.85, SHOULDER_Y - b.deltoid * 0.5],
      [sx, SHOULDER_Y - b.deltoid],
      [sx + b.deltoid * 0.85, SHOULDER_Y - b.deltoid * 0.45],
      [sx + b.deltoid, SHOULDER_Y + b.deltoid * 0.2],
      [sx + b.deltoid * 0.3, SHOULDER_Y + b.deltoid * 0.8],
      [sx - b.deltoid * 0.7, SHOULDER_Y + b.deltoid * 0.5],
    ]),
    deltoidShade: [
      move([sx + b.deltoid * 0.98, SHOULDER_Y - b.deltoid * 0.1]),
      curve(
        [sx + b.deltoid * 0.95, SHOULDER_Y + b.deltoid * 0.75],
        [sx + b.deltoid * 0.1, SHOULDER_Y + b.deltoid * 0.78],
      ),
      curve(
        [sx - b.deltoid * 0.4, SHOULDER_Y + b.deltoid * 0.75],
        [sx - b.deltoid * 0.75, SHOULDER_Y + b.deltoid * 0.35],
      ),
      curve(
        [sx + b.deltoid * 0.5, SHOULDER_Y + b.deltoid * 0.65],
        [sx + b.deltoid * 0.98, SHOULDER_Y - b.deltoid * 0.1],
      ),
      "Z",
    ].join(""),
    deltoidHighlight: smoothClosedPath([
      [sx - b.deltoid * 0.45, SHOULDER_Y - b.deltoid * 0.6],
      [sx, SHOULDER_Y - b.deltoid * 0.8],
      [sx + b.deltoid * 0.45, SHOULDER_Y - b.deltoid * 0.5],
      [sx, SHOULDER_Y - b.deltoid * 0.52],
    ]),
  };
}

function buildTorso(b: Body) {
  const strapInner = b.neck + (b.joint - b.neck) * 0.2 + 4;
  const strapOuter = strapInner + 8.5;
  const strapY = 122 - b.trapRise * 0.7;
  /** 背中の広がりから腰へ、まっすぐ絞っていく途中の幅 */
  const taper = b.waist + (b.lat - b.waist) * 0.42;

  const pecTop = 139;
  const pecBottom = 165 + b.definition * 6;

  const torso = smoothClosedPath(
    symmetric([
      [b.neck, 98],
      [b.neck, 112],
      [b.neck + (b.joint - b.neck) * 0.45, 123 - b.trapRise * 0.75],
      [b.joint, SHOULDER_Y - b.deltoid * 0.7],
      [b.armpit + 3, 149],
      [b.armpit, 160],
      [b.lat, 172],
      [taper, 200],
      [b.waist, BELT_TOP],
      [b.hip, 252],
    ]),
  );

  const side = (sign: 1 | -1) => {
    const point = (dx: number, y: number): Point => [x(dx * sign), y];
    return {
      strapInner: point(strapInner, strapY),
      strapOuter: point(strapOuter, strapY + 2),
      armholeControl: point(strapOuter, 168),
      armhole: point(b.lat * 0.94 + 1, 181),
      waistControl: point(taper + 0.5, 202),
      waist: point(b.waist + 1, BELT_TOP),
      hem: point(b.waist + 1, BELT_BOTTOM),
      neckControl: point(strapInner - 1, 169),
    };
  };
  const r = side(1);
  const l = side(-1);
  const tank = [
    move(r.strapInner),
    line(r.strapOuter),
    curve(r.armholeControl, r.armhole),
    curve(r.waistControl, r.waist),
    line(r.hem, l.hem, l.waist),
    curve(l.waistControl, l.armhole),
    curve(l.armholeControl, l.strapOuter),
    line(l.strapInner),
    curve(l.neckControl, [CENTER_X, 169]),
    curve(r.neckControl, r.strapInner),
    "Z",
  ].join("");

  return {
    torso,
    tank,
    belt: smoothClosedPath(
      symmetric([
        [0, BELT_TOP + 1],
        [b.waist + 2, BELT_TOP - 1],
        [b.waist + 3, BELT_BOTTOM],
        [0, BELT_BOTTOM + 2],
      ]),
    ),
    trapShade: [
      move([x(b.neck), 104]),
      curve(
        [x(b.neck + 2), 120],
        [x(b.neck + (b.joint - b.neck) * 0.45), 126 - b.trapRise * 0.6],
      ),
      curve([x(b.neck - 1), 124], [x(b.neck * 0.55), 126]),
      curve([x(b.neck * 0.8), 116], [x(b.neck), 104]),
      "Z",
    ].join(""),
    collarbone: [
      move([x(3), 133]),
      curve([x(b.joint * 0.4), 128], [x(b.joint * 0.8), 131]),
    ].join(""),
    /** 胸の下側の影。体とタンクトップの両方に重ねて描く */
    pecShade: [
      move([x(1.5), pecTop + 4]),
      curve([x(5), pecBottom - 6], [x(b.armpit * 0.48), pecBottom - 4]),
      curve([x(b.armpit * 0.9), pecBottom - 6], [x(b.armpit + 1), pecTop + 8]),
      curve(
        [x(b.armpit + 1), pecBottom + 3],
        [x(b.armpit * 0.48), pecBottom + 2],
      ),
      curve([x(4), pecBottom + 2], [x(1.5), pecTop + 4]),
      "Z",
    ].join(""),
    pecLine: [
      move([CENTER_X, pecTop]),
      line([CENTER_X, pecBottom - 4]),
    ].join(""),
    latShade: [
      move([x(b.armpit), 160]),
      curve([x(b.lat * 1.03), 168], [x(b.lat * 0.97), 178]),
      curve([x(b.lat * 0.86), 182], [x(b.armpit * 0.86), 168]),
      "Z",
    ].join(""),
    abs: [
      move([CENTER_X, pecBottom + 6]),
      line([CENTER_X, BELT_TOP - 2]),
      ...[190, 206].flatMap((y) => [
        move([x(-b.waist * 0.5), y - 1]),
        curve([x(-b.waist * 0.25), y + 2], [CENTER_X, y]),
        curve([x(b.waist * 0.25), y + 2], [x(b.waist * 0.5), y - 1]),
      ]),
    ].join(""),
  };
}

function buildLegs(b: Body) {
  // 太ももの内側どうしが触れない位置に置く
  const thighX = x(b.thigh + 2);
  const kneeX = x(b.thigh * 0.95 + 6);
  const ankleX = x(b.thigh * 0.9 + 9);

  const hemOuter = thighX + b.thigh + 4;
  const hemInner = Math.max(x(2.5), thighX - b.thigh + 1);
  const hipOuter = Math.max(x(b.hip + 2), thighX + b.thigh + 2);
  const mirror = (value: number) => FIGURE_WIDTH - value;

  const shoeLeft = ankleX - b.ankle - 3;
  const shoeRight = ankleX + b.ankle + 14;

  return {
    shorts: [
      move([x(b.waist + 2), BELT_BOTTOM - 4]),
      curve([hipOuter, 246], [hipOuter, 262]),
      line([hemOuter, 300], [hemInner, 303], [CENTER_X, 270]),
      line([mirror(hemInner), 303], [mirror(hemOuter), 300]),
      line([mirror(hipOuter), 262]),
      curve([mirror(hipOuter), 246], [x(-b.waist - 2), BELT_BOTTOM - 4]),
      "Z",
    ].join(""),
    leg: smoothClosedPath([
      [thighX - b.thigh * 0.8, 272],
      [thighX + b.thigh * 0.8, 272],
      [thighX + b.thigh + 1, 290],
      [kneeX + b.knee + b.thigh * 0.12, 318],
      [kneeX + b.knee, 334],
      [kneeX + b.calf + 1, 356],
      [ankleX + b.ankle, 388],
      [ankleX + b.ankle, 398],
      [ankleX - b.ankle, 398],
      [ankleX - b.ankle, 388],
      [kneeX - b.calf * 0.85, 358],
      [kneeX - b.knee, 334],
      [kneeX - b.knee - b.thigh * 0.14, 320],
      [thighX - b.thigh * 0.9, 290],
    ]),
    /** 膝上のしずく型の筋肉 */
    quadShade: [
      move([kneeX - b.knee * 0.9, 306]),
      curve([kneeX - b.knee * 0.5, 328], [kneeX, 326]),
      curve([kneeX + b.knee * 0.7, 328], [kneeX + b.knee, 308]),
    ].join(""),
    calfShade: [
      move([kneeX + b.calf * 0.25, 342]),
      curve(
        [kneeX + b.calf * 0.85, 358],
        [ankleX + b.ankle * 0.35, 378],
      ),
      curve([kneeX + b.calf * 0.35, 360], [kneeX + b.calf * 0.25, 342]),
      "Z",
    ].join(""),
    shoe: [
      move([shoeLeft + 1, 391]),
      line([ankleX + b.ankle + 2, 391]),
      curve([shoeRight, 396], [shoeRight, 407]),
      line([shoeLeft, 407]),
      "Z",
    ].join(""),
    shoeSole: [
      move([shoeLeft - 0.5, 404]),
      line([shoeRight + 0.5, 404], [shoeRight + 0.5, 408], [shoeLeft - 0.5, 408]),
      "Z",
    ].join(""),
  };
}

export function buildFigure(progress: number): Figure {
  const body = getBody(progress);
  return {
    ...buildTorso(body),
    ...buildArm(body),
    ...buildLegs(body),
    definition: round(body.definition),
  };
}
