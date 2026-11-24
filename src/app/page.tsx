import { House } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="ホーム"
        description="毎日の積み重ねが、自分を変える。"
      />
      <EmptyState
        icon={House}
        title="ホームは準備中です"
        description="キャラクターと今日の習慣を STEP 2 で追加します。"
      />
    </>
  );
}
