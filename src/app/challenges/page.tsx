import { Flag } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "チャレンジ" };

export default function ChallengesPage() {
  return (
    <>
      <PageHeader
        title="チャレンジ"
        description="30日・60日・90日の目標期間で習慣に取り組みます。"
      />
      <EmptyState
        icon={Flag}
        title="チャレンジは準備中です"
        description="期間の設定と進捗の表示を STEP 4 で追加します。"
      />
    </>
  );
}
