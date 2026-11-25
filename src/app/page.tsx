import { EmptySection } from "@/components/home/empty-section";
import { GrowthSection } from "@/components/home/growth-section";
import { PageHeader } from "@/components/layout/page-header";

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="ホーム"
        description="毎日の積み重ねが、自分を変える。"
      />
      <div className="space-y-5">
        <GrowthSection />
        <div className="grid gap-5 md:grid-cols-2">
          <EmptySection
            title="今日の習慣"
            message="まだ習慣がありません。"
            note="習慣の登録と達成チェックを STEP 3 で追加します。"
          />
          <EmptySection
            title="チャレンジ"
            message="進行中のチャレンジはありません。"
            note="30日・60日・90日のチャレンジを STEP 4 で追加します。"
          />
        </div>
      </div>
    </>
  );
}
