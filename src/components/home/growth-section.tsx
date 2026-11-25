"use client";

import Link from "next/link";
import { Character } from "@/components/character/character";
import { GrowthStageList } from "@/components/character/growth-stage-list";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGrowthSummary, type GrowthSummary } from "@/hooks/use-growth-summary";
import { useProfile } from "@/hooks/use-profile";
import type { CharacterId } from "@/lib/character/characters";
import { toErrorMessage } from "@/lib/repositories/errors";

export function GrowthSection() {
  const { profile, error: profileError } = useProfile();
  const { summary, error: summaryError } = useGrowthSummary();
  const error = profileError ?? summaryError;

  return (
    <Card>
      {summary && profile ? (
        <GrowthContent summary={summary} characterId={profile.characterId} />
      ) : error ? (
        <p role="alert" className="text-sm text-danger">
          {toErrorMessage(error)}
        </p>
      ) : (
        <p className="grid min-h-96 place-items-center text-sm text-muted">
          読み込み中…
        </p>
      )}
    </Card>
  );
}

interface GrowthContentProps {
  summary: GrowthSummary;
  characterId: CharacterId;
}

function GrowthContent({ summary, characterId }: GrowthContentProps) {
  const { growth, level, totalXp, todayXp } = summary;

  return (
    <>
      <div className="grid items-center gap-6 sm:grid-cols-[18rem_1fr] sm:gap-8">
        <div className="text-center">
          <Character
            characterId={characterId}
            growth={growth}
            className="mx-auto h-80 w-auto max-w-full"
          />
          <Link
            href="/characters"
            className="inline-flex min-h-11 items-center rounded-control px-3 text-sm text-primary-strong underline-offset-4 hover:underline"
          >
            キャラクターを変える
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted">第{growth.current.stage}段階</p>
            <h2 className="text-2xl font-bold">{growth.current.label}</h2>
            <p className="mt-1 text-sm text-muted">
              習慣を達成した日{" "}
              <span className="text-lg font-bold text-foreground">
                {growth.achievedDays}
              </span>{" "}
              日
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm">
              {growth.next ? (
                <>
                  あと <b>{growth.daysToNext}日</b> で「{growth.next.label}」
                </>
              ) : (
                "最終段階に到達しました"
              )}
            </p>
            <ProgressBar
              value={growth.stageProgress}
              label="次の成長段階までの進捗"
            />
          </div>

          <div className="space-y-2 border-t border-line pt-6">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold">Lv. {level.level}</p>
              <p className="text-sm text-muted">
                次のレベルまで {level.xpToNextLevel.toLocaleString("ja-JP")} XP
              </p>
            </div>
            <ProgressBar
              value={level.progress}
              label="次のレベルまでの進捗"
            />
            <dl className="flex gap-8 pt-2 text-sm">
              <div>
                <dt className="text-muted">累計</dt>
                <dd className="font-semibold">
                  {totalXp.toLocaleString("ja-JP")} XP
                </dd>
              </div>
              <div>
                <dt className="text-muted">今日</dt>
                <dd className="font-semibold">
                  {todayXp.toLocaleString("ja-JP")} XP
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <details className="mt-6 border-t border-line pt-4">
        <summary className="rounded-control py-2 text-sm font-medium">
          成長の段階を見る
        </summary>
        <GrowthStageList
          characterId={characterId}
          currentStage={growth.current.stage}
        />
      </details>
    </>
  );
}
