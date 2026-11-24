import { ListChecks } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "習慣" };

export default function HabitsPage() {
  return (
    <>
      <PageHeader
        title="習慣"
        description="続けたい習慣を登録して、毎日の達成を記録します。"
      />
      <EmptyState
        icon={ListChecks}
        title="習慣の管理は準備中です"
        description="登録・編集・達成チェックを STEP 3 で追加します。"
      />
    </>
  );
}
