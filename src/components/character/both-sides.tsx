import type { ReactNode } from "react";
import { FIGURE_WIDTH } from "@/lib/character/figure";

/** 右半身の内容を、左にも反転して描く */
export function BothSides({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform={`translate(${FIGURE_WIDTH} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}
