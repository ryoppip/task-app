/**
 * キャラクターの体型を、変化量(0〜1)から SVG のパスに変換する。
 * 初期・30日・60日・90日の4つの体型を基準にして間を補間するため、
 * 1日ごとに少しずつ変わり、節目では必ず基準の体型になる。
 *
 * 体の骨格とポーズ(力こぶを見せる立ち姿)は全キャラクター共通で、
 * 頭・しっぽ・色だけがキャラクターごとに異なる。頭の大きさは変わらない。
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
export const FIGURE_HEIGHT = 360;

const CENTER_X = FIGURE_WIDTH / 2;
const SHOULDER_Y = 182;
const ELBOW_Y = 200;
const WRIST_Y = 166;
const WAIST_Y = 242;

type Keyframes = readonly [number, number, number, number];

/** 片側の寸法。左右対称なので右半分だけを定義する */
const BODY = {
  /** 中心から肩関節まで */
  joint: [17, 29, 42, 55],
  trap: [0, 4, 10, 17],
  deltoid: [6, 12, 19, 27],
  chest: [16, 29, 44, 58],
  waist: [12.5, 19, 25, 31],
  hip: [14, 20, 26, 32],
  /** 肩関節から肘まで */
  upperArmLength: [46, 46, 47, 50],
  biceps: [3.2, 9, 17.5, 29],
  triceps: [3.2, 7.5, 12.5, 18],
  elbow: [3.6, 6.5, 9, 12],
  forearm: [3.6, 8, 12.5, 17],
  wrist: [3.2, 5.5, 7.5, 9.5],
  fist: [8.5, 10, 11.5, 13.5],
  thigh: [6, 11, 17, 23],
  calf: [3.6, 7.5, 11.5, 16],
  ankle: [3.2, 5, 6.5, 8],
  /** 筋肉の輪郭の濃さ */
  definition: [0, 0.45, 0.8, 1],
  /** ガリガリ感(あばら骨・汗)の強さ */
  frailty: [1, 0.3, 0, 0],
} as const satisfies Record<string, Keyframes>;

type Body = Record<keyof typeof BODY, number>;

export interface Figure {
  /** 左右対称の部位(全身ぶんのパス) */
  torso: string;
  belly: string;
  pants: string;
  abs: string;
  ribs: string;
  /** 肩まわりの模様の範囲。胴体の形で切り抜いて使う */
  yoke: string;
  /** 以下は右半身のパス。左は反転して描く */
  pec: string;
  pecHighlight: string;
  forearm: string;
  upperArm: string;
  tricepsShade: string;
  bicepsHighlight: string;
  deltoid: string;
  deltoidHighlight: string;
  wristband: string;
  fist: { cx: number; cy: number; r: number };
  leg: string;
  calfLine: string;
  ankleX: number;
  footWidth: number;
  definition: number;
  frailty: number;
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
  const wx = ex + 7;
  /** 肩から肘へ t(0〜1)進んだ位置から、上下に dy ずらした点 */
  const along = (t: number, dy: number): Point => [
    sx + b.upperArmLength * t,
    SHOULDER_Y + (ELBOW_Y - SHOULDER_Y) * t + dy,
  ];

  return {
    upperArm: smoothClosedPath([
      [sx - b.deltoid * 0.4, SHOULDER_Y - b.deltoid * 0.4],
      along(0.22, -b.biceps * 0.6),
      along(0.5, -b.biceps),
      along(0.76, -b.biceps * 0.66),
      [ex + b.elbow * 0.3, ELBOW_Y - b.elbow],
      [ex + b.elbow, ELBOW_Y + 1],
      [ex - 1, ELBOW_Y + b.elbow],
      along(0.62, b.triceps),
      along(0.28, b.triceps * 1.05),
      [sx - b.deltoid * 0.3, SHOULDER_Y + b.triceps * 0.8],
    ]),
    tricepsShade: [
      move(along(0.15, b.triceps * 0.35)),
      curve(along(0.55, b.triceps * 0.6), [ex - 1, ELBOW_Y + b.elbow * 0.3]),
      curve([ex - 2, ELBOW_Y + b.elbow * 0.9], along(0.62, b.triceps * 0.94)),
      curve(along(0.4, b.triceps * 1.1), along(0.15, b.triceps * 0.8)),
      "Z",
    ].join(""),
    bicepsHighlight: smoothClosedPath([
      along(0.34, -b.biceps * 0.62),
      along(0.5, -b.biceps * 0.82),
      along(0.66, -b.biceps * 0.62),
      along(0.5, -b.biceps * 0.55),
    ]),
    forearm: smoothClosedPath([
      [ex + b.elbow, ELBOW_Y],
      [ex + 4 + b.forearm, ELBOW_Y - 15],
      [wx + b.wrist, WRIST_Y],
      [wx - b.wrist, WRIST_Y],
      [ex + 2 - b.forearm * 0.9, ELBOW_Y - 15],
      [ex - b.elbow, ELBOW_Y],
    ]),
    wristband: [
      move([wx - b.wrist - 1.5, WRIST_Y - 2]),
      line(
        [wx + b.wrist + 1.5, WRIST_Y - 2],
        [wx + b.wrist + 2.5, WRIST_Y + 6],
        [wx - b.wrist - 2.5, WRIST_Y + 6],
      ),
      "Z",
    ].join(""),
    fist: {
      cx: round(wx + 1),
      cy: round(WRIST_Y - b.fist * 0.75),
      r: round(b.fist),
    },
    deltoid: smoothClosedPath([
      [sx - b.deltoid * 0.8, SHOULDER_Y - b.deltoid * 0.5],
      [sx, SHOULDER_Y - b.deltoid],
      [sx + b.deltoid * 0.82, SHOULDER_Y - b.deltoid * 0.45],
      [sx + b.deltoid * 0.95, SHOULDER_Y + b.deltoid * 0.25],
      [sx + b.deltoid * 0.25, SHOULDER_Y + b.deltoid * 0.78],
      [sx - b.deltoid * 0.7, SHOULDER_Y + b.deltoid * 0.5],
    ]),
    deltoidHighlight: smoothClosedPath([
      [sx - b.deltoid * 0.4, SHOULDER_Y - b.deltoid * 0.58],
      [sx, SHOULDER_Y - b.deltoid * 0.8],
      [sx + b.deltoid * 0.45, SHOULDER_Y - b.deltoid * 0.48],
      [sx, SHOULDER_Y - b.deltoid * 0.5],
    ]),
  };
}

function buildTorso(b: Body) {
  const taper = b.waist + (b.chest - b.waist) * 0.45;
  const pecBottom = 208 + b.definition * 2;

  return {
    torso: smoothClosedPath(
      symmetric([
        [9, 146],
        [b.joint * 0.55 + 3, 168 - b.trap],
        [b.joint, SHOULDER_Y - b.deltoid * 0.6],
        [b.chest, 198],
        [taper, 222],
        [b.waist, WAIST_Y],
        [b.hip, 260],
      ]),
    ),
    belly: smoothClosedPath(
      symmetric([
        [b.joint * 0.3 + 2, 164],
        [b.chest * 0.72, 190],
        [b.chest * 0.68, 206],
        [b.waist * 0.74, WAIST_Y],
        [b.waist * 0.5, 262],
      ]),
    ),
    pec: [
      move([CENTER_X, 184]),
      line([CENTER_X, pecBottom - 3]),
      curve(
        [x(b.chest * 0.42), pecBottom + 7],
        [x(b.chest * 0.8), pecBottom - 8],
      ),
    ].join(""),
    pecHighlight: smoothClosedPath([
      [x(b.chest * 0.2), 190],
      [x(b.chest * 0.42), 186],
      [x(b.chest * 0.62), 191],
      [x(b.chest * 0.42), 193],
    ]),
    abs: [
      move([CENTER_X, pecBottom + 4]),
      line([CENTER_X, WAIST_Y]),
      ...[221, 232].flatMap((y) => [
        move([x(-b.waist * 0.55), y - 1]),
        curve([x(-b.waist * 0.28), y + 2], [CENTER_X, y]),
        curve([x(b.waist * 0.28), y + 2], [x(b.waist * 0.55), y - 1]),
      ]),
    ].join(""),
    ribs: [197, 206, 215]
      .flatMap((y) =>
        ([-1, 1] as const).flatMap((sign) => [
          move([x(b.chest * 0.8 * sign), y + 4]),
          curve([x(b.chest * 0.62 * sign), y], [x(b.chest * 0.3 * sign), y]),
        ]),
      )
      .join(""),
    yoke: [
      move([x(-70), 140]),
      line([x(70), 140], [x(70), 190]),
      curve([CENTER_X, 176], [x(-70), 190]),
      "Z",
    ].join(""),
  };
}

function buildLegs(b: Body) {
  // 太ももの内側どうしが触れない位置に置く
  const thighX = x(b.thigh + 2);
  const shinX = thighX + 1.5;
  const knee = b.calf * 0.78 + 0.6;

  const hemOuter = thighX + b.thigh + 2.5;
  const hemInner = Math.max(x(1.5), thighX - b.thigh);
  const hipOuter = Math.max(x(b.hip + 1.5), thighX + b.thigh + 1);
  const mirror = (value: number) => FIGURE_WIDTH - value;

  return {
    pants: [
      move([x(b.waist + 1.5), WAIST_Y + 3]),
      curve([hipOuter, 250], [hipOuter, 262]),
      line([hemOuter, 280], [hemInner, 282], [CENTER_X, 272]),
      line([mirror(hemInner), 282], [mirror(hemOuter), 280]),
      line([mirror(hipOuter), 262]),
      curve([mirror(hipOuter), 250], [x(-b.waist - 1.5), WAIST_Y + 3]),
      "Z",
    ].join(""),
    leg: smoothClosedPath([
      [thighX - b.thigh * 0.8, 266],
      [thighX + b.thigh * 0.8, 266],
      [thighX + b.thigh, 282],
      [shinX + knee, 297],
      [shinX + b.calf, 311],
      [shinX + b.ankle, 332],
      [shinX - b.ankle, 332],
      [shinX - b.calf * 0.88, 312],
      [shinX - knee, 297],
      [thighX - b.thigh * 0.85, 282],
    ]),
    calfLine: [
      move([shinX + b.calf * 0.2, 304]),
      curve([shinX + b.calf * 0.6, 313], [shinX + b.calf * 0.15, 321]),
    ].join(""),
    ankleX: round(shinX),
    footWidth: round(b.ankle + 8),
  };
}

export function buildFigure(progress: number): Figure {
  const body = getBody(progress);
  return {
    ...buildTorso(body),
    ...buildArm(body),
    ...buildLegs(body),
    definition: round(body.definition),
    frailty: round(body.frailty),
  };
}
