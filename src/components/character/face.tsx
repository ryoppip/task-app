import { BothSides } from "./both-sides";

/** 頭の表情に影響する体型の値 */
export interface Expression {
  definition: number;
  frailty: number;
}

interface FaceProps extends Expression {
  /** 中心から目までの距離 */
  eyeDx: number;
  eyeY: number;
  eyeSize?: number;
  /** 目から眉までの距離 */
  browGap?: number;
  /** 中心から頬までの距離 */
  cheekDx: number;
  cheekY: number;
}

export const OUTLINE = "stroke-character-outline";
export const OUTLINE_PROPS = {
  strokeWidth: 2.6,
  strokeLinejoin: "round",
  strokeLinecap: "round",
} as const;

/** 目・眉・頬。眉は、困り顔からキリッとした顔へ体型に合わせて変わる */
export function Face({
  eyeDx,
  eyeY,
  eyeSize = 6.8,
  browGap = 15.5,
  cheekDx,
  cheekY,
  definition,
}: FaceProps) {
  const eyeX = 150 + eyeDx;
  const browY = eyeY - browGap;
  // 内側が上がると困り眉、下がるとキリッとした眉になる
  const tilt = -3.2 + definition * 5;

  return (
    <BothSides>
      <ellipse
        cx={150 + cheekDx}
        cy={cheekY}
        rx="9"
        ry="6"
        className="fill-character-cheek"
        opacity={0.75}
      />
      <ellipse
        cx={eyeX}
        cy={eyeY}
        rx={eyeSize}
        ry={eyeSize * 1.12}
        className="fill-character-eye"
      />
      <circle
        cx={eyeX - eyeSize * 0.3}
        cy={eyeY - eyeSize * 0.4}
        r={eyeSize * 0.36}
        className="fill-card"
      />
      <path
        d={`M${eyeX - 5.5} ${browY + tilt}L${eyeX + 5.5} ${browY - tilt}`}
        className="stroke-character-eye"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </BothSides>
  );
}

/** ω の形の口 */
export function MuzzleMouth({ y }: { y: number }) {
  return (
    <path
      d={`M141 ${y}Q141 ${y + 6} 146 ${y + 6}Q150 ${y + 6} 150 ${y}Q150 ${y + 6} 154 ${y + 6}Q159 ${y + 6} 159 ${y}`}
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
        d={`M190 ${y}L207 ${y - 4}M190 ${y + 7}L207 ${y + 8}`}
        className={`fill-none ${OUTLINE}`}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </BothSides>
  );
}
