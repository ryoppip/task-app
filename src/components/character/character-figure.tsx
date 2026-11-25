import { useId, useMemo, type ComponentType } from "react";
import type { BodyType, CharacterId } from "@/lib/character/characters";
import {
  buildFigure,
  FIGURE_HEIGHT,
  FIGURE_WIDTH,
  type Figure,
} from "@/lib/character/figure";
import {
  KiwiHead,
  PenguinHead,
  ShimaenagaHead,
  ShimaenagaTail,
} from "./bird-heads";
import { BothSides } from "./both-sides";
import {
  OUTLINE,
  OUTLINE_PROPS,
  type Expression,
  type TailProps,
} from "./face";
import { BirdFoot, PawFoot, type FootProps } from "./feet";
import {
  CatHead,
  CatTail,
  HamsterHead,
  OtterHead,
  OtterTail,
  PandaHead,
  RabbitHead,
  RabbitTail,
} from "./mammal-heads";

interface CharacterParts {
  Head: ComponentType<Expression>;
  Foot: ComponentType<FootProps>;
  Tail?: ComponentType<TailProps>;
  /** 肩まわりを腕と同じ色にする */
  hasYoke?: boolean;
}

const PARTS: Record<CharacterId, CharacterParts> = {
  shimaenaga: { Head: ShimaenagaHead, Foot: BirdFoot, Tail: ShimaenagaTail },
  kiwi: { Head: KiwiHead, Foot: BirdFoot },
  penguin: { Head: PenguinHead, Foot: BirdFoot },
  hamster: { Head: HamsterHead, Foot: PawFoot },
  cat: { Head: CatHead, Foot: PawFoot, Tail: CatTail },
  panda: { Head: PandaHead, Foot: PawFoot, hasYoke: true },
  rabbit: { Head: RabbitHead, Foot: PawFoot, Tail: RabbitTail },
  otter: { Head: OtterHead, Foot: PawFoot, Tail: OtterTail },
};

const DETAIL_LINE = `fill-none ${OUTLINE}`;

function Torso({ figure, hasYoke }: { figure: Figure; hasYoke: boolean }) {
  const clipId = useId();

  return (
    <>
      <clipPath id={clipId}>
        <path d={figure.torso} />
      </clipPath>
      <path
        d={figure.torso}
        className={`fill-character-body ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path d={figure.belly} className="fill-character-belly" />
      {hasYoke && (
        <path
          d={figure.yoke}
          clipPath={`url(#${clipId})`}
          className="fill-character-arm"
        />
      )}
      <g
        className={DETAIL_LINE}
        {...OUTLINE_PROPS}
        strokeWidth={2.2}
        opacity={figure.definition * 0.7}
      >
        <BothSides>
          <path d={figure.pec} />
        </BothSides>
        <path d={figure.abs} opacity={0.8} />
      </g>
      <g className={DETAIL_LINE} strokeWidth={2} strokeLinecap="round">
        <path d={figure.ribs} opacity={figure.frailty * 0.5} />
        <path d={figure.navel} opacity={figure.softness * 0.7} />
      </g>
    </>
  );
}

function Arm({ figure }: { figure: Figure }) {
  const { fist, definition } = figure;
  const limb = `fill-character-arm ${OUTLINE}`;

  return (
    <>
      <path d={figure.forearm} className={limb} {...OUTLINE_PROPS} />
      <path d={figure.upperArm} className={limb} {...OUTLINE_PROPS} />
      <g opacity={definition}>
        <path
          d={figure.tricepsShade}
          className="fill-character-outline"
          opacity={0.16}
        />
        <path d={figure.bicepsHighlight} className="fill-card" opacity={0.5} />
      </g>
      <circle {...fist} className={limb} {...OUTLINE_PROPS} />
      <path
        d={`M${fist.cx - fist.r * 0.33} ${fist.cy - fist.r * 0.5}v${fist.r * 0.5}M${fist.cx + fist.r * 0.33} ${fist.cy - fist.r * 0.5}v${fist.r * 0.5}`}
        className={DETAIL_LINE}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d={figure.wristband}
        className={`fill-character-accent ${OUTLINE}`}
        {...OUTLINE_PROPS}
        strokeWidth={2}
      />
    </>
  );
}

/** 肩の筋肉。育つにつれて、体の手前に現れる */
function Deltoid({ figure }: { figure: Figure }) {
  return (
    <g opacity={Math.min(1, figure.definition * 4)}>
      <path
        d={figure.deltoid}
        className={`fill-character-arm ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d={figure.deltoidHighlight}
        className="fill-card"
        opacity={0.5}
      />
    </g>
  );
}

function Leg({
  figure,
  Foot,
}: {
  figure: Figure;
  Foot: CharacterParts["Foot"];
}) {
  return (
    <>
      <path
        d={figure.leg}
        className={`fill-character-leg ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <Foot x={figure.ankleX} width={figure.footWidth} />
    </>
  );
}

/** がんばり始めの汗と、仕上がったときのきらめき */
function Effects({ definition, frailty, softness }: Figure) {
  return (
    <>
      <path
        d="M231 58Q239 71 235 77Q231 81 227 77Q223 71 231 58Z"
        className="fill-character-sweat"
        opacity={Math.max(frailty, softness)}
      />
      <path
        d="M258 112l3.5 8.5 8.5 3.5-8.5 3.5-3.5 8.5-3.5-8.5-8.5-3.5 8.5-3.5ZM44 84l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"
        className="fill-character-spark"
        opacity={Math.max(0, (definition - 0.8) / 0.2)}
      />
    </>
  );
}

interface CharacterFigureProps {
  characterId: CharacterId;
  bodyType: BodyType;
  /** 体型の変化量(0〜1) */
  bodyProgress: number;
  /** 読み上げ用の説明。省略時は装飾として扱う */
  label?: string;
  className?: string;
}

export function CharacterFigure({
  characterId,
  bodyType,
  bodyProgress,
  label,
  className = "",
}: CharacterFigureProps) {
  const figure = useMemo(
    () => buildFigure(bodyProgress, bodyType),
    [bodyProgress, bodyType],
  );
  const { Head, Foot, Tail, hasYoke = false } = PARTS[characterId];

  return (
    <svg
      viewBox={`0 0 ${FIGURE_WIDTH} ${FIGURE_HEIGHT}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-character={characterId}
      data-body-type={bodyType}
      className={className}
    >
      <ellipse cx="150" cy="297" rx="74" ry="7" className="fill-line" />
      {Tail && <Tail hip={figure.hip} />}
      <BothSides>
        <Leg figure={figure} Foot={Foot} />
      </BothSides>
      <BothSides>
        <Arm figure={figure} />
      </BothSides>
      <Torso figure={figure} hasYoke={hasYoke} />
      <path
        d={figure.pants}
        className={`fill-character-accent ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <BothSides>
        <Deltoid figure={figure} />
      </BothSides>
      <Head definition={figure.definition} />
      <Effects {...figure} />
    </svg>
  );
}
