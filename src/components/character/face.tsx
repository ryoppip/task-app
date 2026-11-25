import { BothSides } from "./both-sides";

/** 頭の表情に影響する体型の値 */
export interface Expression {
  definition: number;
}

interface FaceProps extends Expression {
  /** 中心から目までの距離 */
  eyeDx?: number;
  eyeY?: number;
  /** 目から眉までの距離 */
  browGap?: number;
  /** 中心から頬までの距離 */
  cheekDx?: number;
  cheekY?: number;
}

export const OUTLINE = "stroke-character-outline";
export const OUTLINE_PROPS = {
  strokeWidth: 3,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

const EYE_RX = 8;
const EYE_RY = 9.4;

/** 目・眉・頬。眉は、困り顔からキリッとした顔へ体型に合わせて変わる */
export function Face({
  eyeDx = 36,
  eyeY = 121,
  browGap = 17,
  cheekDx = 54,
  cheekY = 139,
  definition,
}: FaceProps) {
  const eyeX = 150 + eyeDx;
  const browY = eyeY - browGap;
  // 内側が上がると困り眉、下がるとキリッとした眉になる
  const tilt = -2.2 + definition * 3.8;

  return (
    <>
      <BothSides>
        <ellipse
          cx={150 + cheekDx}
          cy={cheekY}
          rx="10.5"
          ry="6.5"
          className="fill-character-cheek"
          opacity={0.7}
        />
        <ellipse
          cx={eyeX}
          cy={eyeY}
          rx={EYE_RX}
          ry={EYE_RY}
          className="fill-character-eye"
        />
        <path
          d={`M${eyeX - 4.5} ${browY + tilt}Q${eyeX} ${browY - 1.5} ${eyeX + 4.5} ${browY - tilt}`}
          className="fill-none stroke-character-eye"
          strokeWidth={2.6}
          strokeLinecap="round"
          opacity={0.75}
        />
      </BothSides>
      {/* つやは左右とも同じ向きにする */}
      {[150 - eyeDx, eyeX].map((cx) => (
        <g key={cx} className="fill-card">
          <circle cx={cx - 2.6} cy={eyeY - 3.6} r="3.1" />
          <circle cx={cx + 2.8} cy={eyeY + 3.6} r="1.6" />
        </g>
      ))}
    </>
  );
}

/** ω の形の口 */
export function MuzzleMouth({ y }: { y: number }) {
  return (
    <path
      d={`M142.5 ${y}Q142.5 ${y + 5} 146.5 ${y + 5}Q150 ${y + 5} 150 ${y}Q150 ${y + 5} 153.5 ${y + 5}Q157.5 ${y + 5} 157.5 ${y}`}
      className={`fill-none ${OUTLINE}`}
      {...OUTLINE_PROPS}
      strokeWidth={2.2}
    />
  );
}

export function Whiskers({ y }: { y: number }) {
  return (
    <BothSides>
      <path
        d={`M207 ${y}L223 ${y - 3}M207 ${y + 7}L222 ${y + 9}`}
        className={`fill-none ${OUTLINE}`}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </BothSides>
  );
}

/** しっぽに渡す、体の大きさ */
export interface TailProps {
  hip: number;
}
