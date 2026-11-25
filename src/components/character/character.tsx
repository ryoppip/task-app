"use client";

import Image from "next/image";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { getCharacterName, type CharacterId } from "@/lib/character/characters";
import { FIGURE_HEIGHT, FIGURE_WIDTH } from "@/lib/character/figure";
import { getCharacterImage } from "@/lib/character/images";
import type { Growth } from "@/lib/domain/growth";
import { CharacterFigure } from "./character-figure";

interface CharacterProps {
  characterId: CharacterId;
  growth: Growth;
  className?: string;
}

/** 今の体型を表示する。達成日数が変わると、体型も滑らかに変わる */
export function Character({
  characterId,
  growth,
  className = "",
}: CharacterProps) {
  const bodyProgress = useAnimatedNumber(growth.bodyProgress);
  const { stage, label } = growth.current;
  const description = `${getCharacterName(characterId)}。第${stage}段階「${label}」の体型。累計達成${growth.achievedDays}日`;
  const image = getCharacterImage(characterId, stage);

  if (image) {
    return (
      <Image
        key={image}
        src={image}
        alt={description}
        width={FIGURE_WIDTH}
        height={FIGURE_HEIGHT}
        loading="eager"
        className={`animate-fade-in object-contain ${className}`}
      />
    );
  }
  return (
    <CharacterFigure
      characterId={characterId}
      bodyProgress={bodyProgress}
      label={description}
      className={className}
    />
  );
}
