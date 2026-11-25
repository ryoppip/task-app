import Image from "next/image";
import { FIGURE_HEIGHT, FIGURE_WIDTH } from "@/lib/character/figure";
import { getCharacterImage } from "@/lib/character/images";
import {
  GROWTH_STAGES,
  toBodyProgress,
  type GrowthStage,
} from "@/lib/domain/growth";
import { CharacterFigure } from "./character-figure";

const FIGURE_CLASS = "mx-auto h-40 w-auto object-contain sm:h-52";

/** 4つの節目の体型を並べて表示する */
export function GrowthStageList({
  currentStage,
}: {
  currentStage: GrowthStage;
}) {
  return (
    <ol className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {GROWTH_STAGES.map(({ stage, label, minDays }) => {
        const isCurrent = stage === currentStage;
        const image = getCharacterImage(stage);
        return (
          <li
            key={stage}
            aria-current={isCurrent ? "step" : undefined}
            className={`rounded-control px-2 py-4 text-center ${
              isCurrent ? "bg-secondary" : "bg-background"
            }`}
          >
            {image ? (
              <Image
                src={image}
                alt=""
                width={FIGURE_WIDTH}
                height={FIGURE_HEIGHT}
                className={FIGURE_CLASS}
              />
            ) : (
              <CharacterFigure
                bodyProgress={toBodyProgress(minDays)}
                className={FIGURE_CLASS}
              />
            )}
            <p className="mt-2 text-sm font-semibold">{label}</p>
            <p className="text-xs text-muted">
              {minDays === 0 ? "スタート" : `${minDays}日〜`}
              {isCurrent && "(今ここ)"}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
