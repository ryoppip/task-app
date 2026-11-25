import { FOOT_Y } from "@/lib/character/figure";
import { OUTLINE, OUTLINE_PROPS } from "./face";

export interface FootProps {
  /** 足首の中心 */
  x: number;
  width: number;
}

/** 鳥の足(3本指) */
export function BirdFoot({ x, width }: FootProps) {
  const top = FOOT_Y - 5;
  const toe = FOOT_Y + 5;
  return (
    <path
      d={`M${x - 4} ${top}Q${x - width} ${top + 3} ${x - width} ${toe}Q${x - width * 0.5} ${toe + 3} ${x - 3} ${toe - 1}Q${x} ${toe + 5} ${x + 4} ${toe - 1}Q${x + width * 0.6} ${toe + 3} ${x + width} ${toe}Q${x + width} ${top + 3} ${x + 4} ${top}Z`}
      className={`fill-character-leg ${OUTLINE}`}
      {...OUTLINE_PROPS}
    />
  );
}

/** 哺乳類の足 */
export function PawFoot({ x, width }: FootProps) {
  return (
    <>
      <ellipse
        cx={x + 1}
        cy={FOOT_Y}
        rx={width}
        ry="8"
        className={`fill-character-leg ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d={`M${x - 3} ${FOOT_Y + 2}v4.5M${x + 5} ${FOOT_Y + 2}v4.5`}
        className={`fill-none ${OUTLINE}`}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </>
  );
}
