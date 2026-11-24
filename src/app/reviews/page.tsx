import { BookOpen } from "lucide-react";
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "振り返り" };

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        title="振り返り"
        description="1日の終わりに、できたことを書き留めます。"
      />
      <EmptyState
        icon={BookOpen}
        title="振り返りは準備中です"
        description="日々の振り返りの記録を STEP 8 で追加します。"
      />
    </>
  );
}
