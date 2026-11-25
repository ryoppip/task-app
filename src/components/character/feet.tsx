import { OUTLINE, OUTLINE_PROPS } from "./face";

export interface FootProps {
  /** 足首の中心 */
  x: number;
  width: number;
}

/** 鳥の足(3本指) */
export function BirdFoot({ x, width }: FootProps) {
  return (
    <path
      d={`M${x - 4} 329Q${x - width} 332 ${x - width} 339Q${x - width * 0.5} 342 ${x - 3} 338Q${x} 344 ${x + 4} 338Q${x + width * 0.6} 342 ${x + width} 339Q${x + width} 332 ${x + 4} 329Z`}
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
        cx={x + 2}
        cy="335"
        rx={width}
        ry="7.5"
        className={`fill-character-leg ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d={`M${x - 1} 336v5M${x + 6} 336v5`}
        className={`fill-none ${OUTLINE}`}
        strokeWidth={1.6}
        strokeLinecap="round"
      />
    </>
  );
}
