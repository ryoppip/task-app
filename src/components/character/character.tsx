"use client";

import Image from "next/image";
import { useAnimatedNumber } from "@/hooks/use-animated-number";
import { FIGURE_HEIGHT, FIGURE_WIDTH } from "@/lib/character/figure";
import { getCharacterImage } from "@/lib/character/images";
import type { Growth } from "@/lib/domain/growth";
import { CharacterFigure } from "./character-figure";

interface CharacterProps {
  growth: Growth;
  className?: string;
}

/** 今の体型を表示する。達成日数が変わると、体型も滑らかに変わる */
export function Character({ growth, className = "" }: CharacterProps) {
  const bodyProgress = useAnimatedNumber(growth.bodyProgress);
  const { stage, label } = growth.current;
  const description = `第${stage}段階「${label}」の体型。累計達成${growth.achievedDays}日`;
  const image = getCharacterImage(stage);

  if (image) {
    return (
      <Image
        key={stage}
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
      bodyProgress={bodyProgress}
      label={description}
      className={className}
    />
  );
}
