import { Card } from "@/components/ui/card";

interface EmptySectionProps {
  title: string;
  message: string;
  note: string;
}

/** データがまだないときの、ホームの各欄の表示 */
export function EmptySection({ title, message, note }: EmptySectionProps) {
  return (
    <Card title={title}>
      <p className="text-sm">{message}</p>
      <p className="mt-1 text-sm text-muted">{note}</p>
    </Card>
  );
}
