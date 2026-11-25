interface ProgressBarProps {
  /** 0〜1 */
  value: number;
  label: string;
}

export function ProgressBar({ value, label }: ProgressBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-2.5 overflow-hidden rounded-full bg-line"
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-700"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
