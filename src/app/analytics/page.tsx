import { ChartColumn } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "積み上げ・分析" };

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        title="積み上げ・分析"
        description="これまでの積み重ねを確認します。"
      />
      <EmptyState
        icon={ChartColumn}
        title="分析は準備中です"
        description="カレンダーと活動の推移を STEP 8 で追加します。"
      />
    </>
  );
}
