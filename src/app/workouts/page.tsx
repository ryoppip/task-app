import { Dumbbell } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "筋トレ・ジム" };

export default function WorkoutsPage() {
  return (
    <>
      <PageHeader
        title="筋トレ・ジム"
        description="トレーニングの内容と重量の推移を記録します。"
      />
      <EmptyState
        icon={Dumbbell}
        title="筋トレの記録は準備中です"
        description="種目・重量・回数の記録を STEP 6 で追加します。"
      />
    </>
  );
}
