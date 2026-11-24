import { Target } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "目標・タスク" };

export default function GoalsPage() {
  return (
    <>
      <PageHeader
        title="目標・タスク"
        description="目標と、そのためのタスクを整理します。"
      />
      <EmptyState
        icon={Target}
        title="目標・タスクは準備中です"
        description="目標とタスクの管理を STEP 7 で追加します。"
      />
    </>
  );
}
