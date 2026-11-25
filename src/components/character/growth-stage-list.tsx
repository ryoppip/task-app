import Image from "next/image";
import type { BodyType, CharacterId } from "@/lib/character/characters";
import { FIGURE_HEIGHT, FIGURE_WIDTH } from "@/lib/character/figure";
import { getCharacterImage } from "@/lib/character/images";
import {
  GROWTH_STAGES,
  toBodyProgress,
  type GrowthStage,
} from "@/lib/domain/growth";
import { CharacterFigure } from "./character-figure";

const FIGURE_CLASS = "mx-auto h-36 w-auto max-w-full object-contain sm:h-44";

interface GrowthStageListProps {
  characterId: CharacterId;
  bodyType: BodyType;
  currentStage: GrowthStage | null;
}

/** 4つの節目の体型を並べて表示する */
export function GrowthStageList({
  characterId,
  bodyType,
  currentStage,
}: GrowthStageListProps) {
  return (
    <ol className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {GROWTH_STAGES.map(({ stage, labels, minDays }) => {
        const isCurrent = stage === currentStage;
        const image = getCharacterImage(characterId, bodyType, stage);
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
                characterId={characterId}
                bodyType={bodyType}
                bodyProgress={toBodyProgress(minDays)}
                className={FIGURE_CLASS}
              />
            )}
            <p className="mt-2 text-sm font-semibold">{labels[bodyType]}</p>
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
