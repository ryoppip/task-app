/**
 * キャラクターの体型を、変化量(0〜1)から SVG のパスに変換する。
 * 初期・30日・60日・90日の4つの体型を基準にして間を補間するため、
 * 1日ごとに少しずつ変わり、節目では必ず基準の体型になる。
 *
 * 体の骨格とポーズ(力こぶを見せる立ち姿)は全キャラクター共通で、
 * 頭・しっぽ・色だけがキャラクターごとに異なる。頭の大きさは変わらない。
 * スタートの体型は2種類あり、最終段階ではどちらも同じ体型になる。
 */
import type { BodyType } from "./characters";
import {
  curve,
  line,
  move,
  round,
  smoothClosedPath,
  type Point,
} from "./svg-path";

export const FIGURE_WIDTH = 300;
export const FIGURE_HEIGHT = 310;

const CENTER_X = FIGURE_WIDTH / 2;
const SHOULDER_Y = 190;
const ELBOW_Y = 206;
const WRIST_Y = 182;
const WAIST_Y = 246;
export const FOOT_Y = 290;

type Keyframes = readonly [number, number, number, number];

const SLIM = {
  /** 中心から肩関節まで */
  joint: [18, 28, 39, 50],
  trap: [0, 3, 8, 13],
  deltoid: [7, 11, 17, 23],
  chest: [18, 29, 41, 52],
  belly: [16, 24, 32, 39],
  waist: [16, 22, 27, 31],
  hip: [17, 22, 27, 31],
  /** 肩関節から肘まで */
  upperArmLength: [42, 40, 40, 41],
  biceps: [3.8, 9, 16, 25],
  triceps: [3.8, 7.5, 12, 16],
  elbow: [4.2, 6.5, 9, 11.5],
  forearm: [4.2, 8, 12, 16],
  wrist: [4, 5.5, 7.5, 9.5],
  fist: [9.5, 10.5, 12, 13.5],
  thigh: [7.5, 12, 17, 21.5],
  calf: [5, 8, 11.5, 15],
  ankle: [4.5, 5.5, 7, 8.5],
  /** 筋肉の輪郭の濃さ */
  definition: [0, 0.4, 0.75, 1],
  /** ガリガリ感(あばら骨)の強さ */
  frailty: [1, 0.3, 0, 0],
  /** ぽってり感(おなか)の強さ */
  softness: [0, 0, 0, 0],
} as const satisfies Record<string, Keyframes>;

type Body = Record<keyof typeof SLIM, number>;

const CHUBBY: Record<keyof Body, Keyframes> = {
  joint: [35, 37, 42, 50],
  trap: [2, 4, 8, 13],
  deltoid: [12, 14, 18, 23],
  chest: [45, 44, 47, 52],
  belly: [63, 53, 43, 39],
  waist: [63, 49, 36, 31],
  hip: [52, 42, 35, 31],
  upperArmLength: [39, 39, 40, 41],
  biceps: [8, 11, 17, 25],
  triceps: [11, 11, 13, 16],
  elbow: [8.5, 9, 10, 11.5],
  forearm: [9, 10, 12.5, 16],
  wrist: [7.5, 7.8, 8.5, 9.5],
  fist: [11.5, 12, 12.6, 13.5],
  thigh: [23, 20, 19.5, 21.5],
  calf: [15, 13.5, 13.2, 15],
  ankle: [10, 9, 8.6, 8.5],
  definition: [0, 0.25, 0.7, 1],
  frailty: [0, 0, 0, 0],
  softness: [1, 0.55, 0.1, 0],
};

const BODIES: Record<BodyType, Record<keyof Body, Keyframes>> = {
  slim: SLIM,
  chubby: CHUBBY,
};

export interface Figure {
  /** 左右対称の部位(全身ぶんのパス) */
  torso: string;
  belly: string;
  /** 肩まわりの模様の範囲。胴体の形で切り抜いて使う */
  yoke: string;
  pants: string;
  abs: string;
  ribs: string;
  navel: string;
  /** 以下は右半身のパス。左は反転して描く */
  pec: string;
  forearm: string;
  upperArm: string;
  tricepsShade: string;
  bicepsHighlight: string;
  deltoid: string;
  deltoidHighlight: string;
  wristband: string;
  fist: { cx: number; cy: number; r: number };
  leg: string;
  ankleX: number;
  footWidth: number;
  hip: number;
  definition: number;
  frailty: number;
  softness: number;
}

function interpolate(keyframes: Keyframes, progress: number): number {
  const position = Math.min(1, Math.max(0, progress)) * 3;
  const index = Math.min(2, Math.floor(position));
  const from = keyframes[index] ?? keyframes[0];
  const to = keyframes[index + 1] ?? from;
  return from + (to - from) * (position - index);
}

function getBody(progress: number, bodyType: BodyType): Body {
  const entries = Object.entries(BODIES[bodyType]).map(([key, keyframes]) => [
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
      along(0.22, -b.biceps * 0.62),
      along(0.5, -b.biceps),
      along(0.76, -b.biceps * 0.7),
      [ex + b.elbow * 0.3, ELBOW_Y - b.elbow],
      [ex + b.elbow, ELBOW_Y + 1],
      [ex - 1, ELBOW_Y + b.elbow],
      along(0.6, b.triceps),
      along(0.28, b.triceps * 1.05),
      [sx - b.deltoid * 0.3, SHOULDER_Y + b.triceps * 0.8],
    ]),
    tricepsShade: [
      move(along(0.15, b.triceps * 0.4)),
      curve(along(0.55, b.triceps * 0.65), [ex - 1, ELBOW_Y + b.elbow * 0.3]),
      curve([ex - 2, ELBOW_Y + b.elbow * 0.9], along(0.6, b.triceps * 0.94)),
      curve(along(0.4, b.triceps * 1.1), along(0.15, b.triceps * 0.8)),
      "Z",
    ].join(""),
    bicepsHighlight: smoothClosedPath([
      along(0.36, -b.biceps * 0.64),
      along(0.5, -b.biceps * 0.82),
      along(0.66, -b.biceps * 0.64),
      along(0.5, -b.biceps * 0.56),
    ]),
    forearm: smoothClosedPath([
      [ex + b.elbow, ELBOW_Y],
      [ex + 4 + b.forearm, ELBOW_Y - 12],
      [wx + b.wrist, WRIST_Y],
      [wx - b.wrist, WRIST_Y],
      [ex + 2 - b.forearm * 0.9, ELBOW_Y - 12],
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
      cy: round(WRIST_Y - b.fist * 0.78),
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
      [sx - b.deltoid * 0.35, SHOULDER_Y - b.deltoid * 0.58],
      [sx + b.deltoid * 0.05, SHOULDER_Y - b.deltoid * 0.8],
      [sx + b.deltoid * 0.45, SHOULDER_Y - b.deltoid * 0.48],
      [sx + b.deltoid * 0.05, SHOULDER_Y - b.deltoid * 0.5],
    ]),
  };
}

function buildTorso(b: Body) {
  const pecBottom = 213;

  return {
    torso: smoothClosedPath(
      symmetric([
        [10, 158],
        [b.joint * 0.55 + 3, 178 - b.trap],
        [b.joint, SHOULDER_Y - b.deltoid * 0.6],
        [b.chest, 206],
        [b.belly, 228],
        [b.waist, WAIST_Y],
        [b.hip, 260],
        [b.hip * 0.55, 268],
      ]),
    ),
    belly: smoothClosedPath(
      symmetric([
        [b.joint * 0.3 + 2, 172],
        [b.chest * 0.7, 199],
        [b.belly * 0.76, 226],
        [b.waist * 0.78, WAIST_Y],
        [b.waist * 0.5, 266],
      ]),
    ),
    yoke: [
      move([x(-70), 150]),
      line([x(70), 150], [x(70), 198]),
      curve([CENTER_X, 184], [x(-70), 198]),
      "Z",
    ].join(""),
    pec: [
      move([CENTER_X, 194]),
      line([CENTER_X, pecBottom - 3]),
      curve(
        [x(b.chest * 0.42), pecBottom + 7],
        [x(b.chest * 0.78), pecBottom - 8],
      ),
    ].join(""),
    abs: [
      move([CENTER_X, pecBottom + 5]),
      line([CENTER_X, WAIST_Y - 3]),
      ...[225, 235].flatMap((y) => [
        move([x(-b.waist * 0.5), y - 1]),
        curve([x(-b.waist * 0.25), y + 2], [CENTER_X, y]),
        curve([x(b.waist * 0.25), y + 2], [x(b.waist * 0.5), y - 1]),
      ]),
    ].join(""),
    ribs: [204, 212, 220]
      .flatMap((y) =>
        ([-1, 1] as const).flatMap((sign) => [
          move([x(b.chest * 0.8 * sign), y + 4]),
          curve([x(b.chest * 0.62 * sign), y], [x(b.chest * 0.35 * sign), y]),
        ]),
      )
      .join(""),
    navel: [
      move([x(-3.5), 236]),
      curve([CENTER_X, 240.5], [x(3.5), 236]),
    ].join(""),
    hip: round(b.hip),
  };
}

function buildLegs(b: Body) {
  // 太ももの内側どうしが触れない位置に置く
  const thighX = x(b.thigh + 2);
  const shinX = thighX + 1;

  const hemOuter = thighX + b.thigh + 2.5;
  const hemInner = Math.max(x(1.5), thighX - b.thigh);
  const hipOuter = Math.max(x(b.hip + 4), thighX + b.thigh + 2);
  const mirror = (value: number) => FIGURE_WIDTH - value;
  // おなかがズボンに少し乗るように、上端を下げる
  const sag = 5 + b.softness * 16;

  return {
    pants: [
      move([x(b.waist + 1), WAIST_Y]),
      curve([hipOuter + 1, 252], [hipOuter, 262]),
      line([hemOuter, 273], [hemInner, 275], [CENTER_X, 269]),
      line([mirror(hemInner), 275], [mirror(hemOuter), 273]),
      line([mirror(hipOuter), 262]),
      curve([mirror(hipOuter) - 1, 252], [x(-b.waist - 1), WAIST_Y]),
      curve([CENTER_X, WAIST_Y + sag], [x(b.waist + 1), WAIST_Y]),
      "Z",
    ].join(""),
    leg: smoothClosedPath([
      [thighX - b.thigh * 0.8, 262],
      [thighX + b.thigh * 0.8, 262],
      [thighX + b.thigh * 0.96, 272],
      [shinX + b.calf, 280],
      [shinX + b.ankle, 290],
      [shinX - b.ankle, 290],
      [shinX - b.calf * 0.9, 280],
      [thighX - b.thigh * 0.85, 272],
    ]),
    ankleX: round(shinX),
    footWidth: round(b.ankle + 8),
  };
}

export function buildFigure(progress: number, bodyType: BodyType): Figure {
  const body = getBody(progress, bodyType);
  return {
    ...buildTorso(body),
    ...buildArm(body),
    ...buildLegs(body),
    definition: round(body.definition),
    frailty: round(body.frailty),
    softness: round(body.softness),
  };
}
