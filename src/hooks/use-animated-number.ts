import { useEffect, useRef, useState } from "react";

const DURATION_MS = 900;

const easeOut = (ratio: number) => 1 - (1 - ratio) ** 3;

/** target が変わると、今の値から滑らかに近づく。初回はアニメーションしない */
export function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    const from = currentRef.current;
    if (from === target) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const startedAt = performance.now();
    let frame = 0;

    const step = (now: number) => {
      const elapsed = Math.max(0, now - startedAt) / DURATION_MS;
      const ratio = reduceMotion ? 1 : Math.min(1, elapsed);
      const next =
        ratio === 1 ? target : from + (target - from) * easeOut(ratio);
      currentRef.current = next;
      setValue(next);
      if (ratio < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
}
