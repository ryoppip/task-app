import { useId, useMemo, type ComponentType } from "react";
import type { CharacterId } from "@/lib/character/characters";
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
import { OUTLINE, OUTLINE_PROPS, type Expression } from "./face";
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
  Tail?: ComponentType;
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

const MUSCLE_LINE = `fill-none ${OUTLINE}`;

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
      <g opacity={figure.definition}>
        <BothSides>
          <path
            d={figure.pecHighlight}
            className="fill-card"
            opacity={0.45}
          />
          <path
            d={figure.pec}
            className={MUSCLE_LINE}
            {...OUTLINE_PROPS}
            opacity={0.8}
          />
        </BothSides>
        <path
          d={figure.abs}
          className={MUSCLE_LINE}
          {...OUTLINE_PROPS}
          strokeWidth={2}
          opacity={0.7}
        />
      </g>
      <path
        d={figure.ribs}
        className={MUSCLE_LINE}
        strokeWidth={1.8}
        strokeLinecap="round"
        opacity={figure.frailty * 0.65}
      />
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
          opacity={0.18}
        />
        <path
          d={figure.bicepsHighlight}
          className="fill-card"
          opacity={0.45}
        />
      </g>
      <path d={figure.deltoid} className={limb} {...OUTLINE_PROPS} />
      <path
        d={figure.deltoidHighlight}
        className="fill-card"
        opacity={definition * 0.45}
      />
      <circle {...fist} className={limb} {...OUTLINE_PROPS} />
      <path
        d={`M${fist.cx - fist.r * 0.35} ${fist.cy - fist.r * 0.55}v${fist.r * 0.6}M${fist.cx + fist.r * 0.35} ${fist.cy - fist.r * 0.55}v${fist.r * 0.6}`}
        className={MUSCLE_LINE}
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
      <path
        d={figure.calfLine}
        className={MUSCLE_LINE}
        {...OUTLINE_PROPS}
        strokeWidth={2}
        opacity={figure.definition * 0.7}
      />
      <Foot x={figure.ankleX} width={figure.footWidth} />
    </>
  );
}

/** ガリガリのときの汗と、仕上がったときのきらめき */
function Effects({ definition, frailty }: Expression) {
  return (
    <>
      <path
        d="M222 62Q230 75 226 81Q222 85 218 81Q214 75 222 62Z"
        className="fill-character-sweat"
        opacity={frailty}
      />
      <path
        d="M248 92l3.5 8.5 8.5 3.5-8.5 3.5-3.5 8.5-3.5-8.5-8.5-3.5 8.5-3.5ZM52 72l3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"
        className="fill-character-spark"
        opacity={Math.max(0, (definition - 0.8) / 0.2)}
      />
    </>
  );
}

interface CharacterFigureProps {
  characterId: CharacterId;
  /** 体型の変化量(0〜1) */
  bodyProgress: number;
  /** 読み上げ用の説明。省略時は装飾として扱う */
  label?: string;
  className?: string;
}

export function CharacterFigure({
  characterId,
  bodyProgress,
  label,
  className = "",
}: CharacterFigureProps) {
  const figure = useMemo(() => buildFigure(bodyProgress), [bodyProgress]);
  const { Head, Foot, Tail, hasYoke = false } = PARTS[characterId];
  const expression: Expression = {
    definition: figure.definition,
    frailty: figure.frailty,
  };

  return (
    <svg
      viewBox={`0 0 ${FIGURE_WIDTH} ${FIGURE_HEIGHT}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      data-character={characterId}
      className={className}
    >
      <ellipse cx="150" cy="341" rx="72" ry="7" className="fill-line" />
      {Tail && <Tail />}
      <BothSides>
        <Leg figure={figure} Foot={Foot} />
      </BothSides>
      <Torso figure={figure} hasYoke={hasYoke} />
      <path
        d={figure.pants}
        className={`fill-character-accent ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <BothSides>
        <Arm figure={figure} />
      </BothSides>
      <Head {...expression} />
      <Effects {...expression} />
    </svg>
  );
}
