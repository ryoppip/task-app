import { useMemo } from "react";
import {
  buildFigure,
  FIGURE_HEIGHT,
  FIGURE_WIDTH,
  type Figure,
} from "@/lib/character/figure";

interface CharacterFigureProps {
  /** 体型の変化量(0〜1) */
  bodyProgress: number;
  /** 読み上げ用の説明。省略時は装飾として扱う */
  label?: string;
  className?: string;
}

const LINE_CLASS = "fill-none stroke-character-shade";

function Limbs({ figure }: { figure: Figure }) {
  const { hand, definition } = figure;
  return (
    <>
      <path d={figure.leg} className="fill-character-skin" />
      <path
        d={figure.calfLine}
        className={LINE_CLASS}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={definition}
      />
      <path d={figure.shoe} className="fill-muted" />
      <ellipse {...hand} className="fill-character-skin" />
      <path d={figure.arm} className="fill-character-skin" />
      <path
        d={figure.armLine}
        className={LINE_CLASS}
        strokeWidth={1.2}
        strokeLinecap="round"
      />
      <g
        className={LINE_CLASS}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={definition}
      >
        <path d={figure.deltoidLine} />
        <path d={figure.bicepsLine} />
      </g>
    </>
  );
}

/** 顔と髪型は全段階で共通 */
function Head() {
  return (
    <g>
      <ellipse cx="97.5" cy="56" rx="4.5" ry="7" className="fill-character-skin" />
      <ellipse cx="142.5" cy="56" rx="4.5" ry="7" className="fill-character-skin" />
      <path
        d="M98 46C98 28 142 28 142 46V60C142 74 131 82 120 82C109 82 98 74 98 60Z"
        className="fill-character-skin"
      />
      <path
        d="M97 52C93 30 104 18 121 18C138 18 147 30 143 52C141 46 139 42 136 39C128 42 112 41 105 37C101 41 98 46 97 52Z"
        className="fill-foreground"
      />
      <g className="fill-foreground">
        <ellipse cx="111" cy="56" rx="2.2" ry="2.8" />
        <ellipse cx="129" cy="56" rx="2.2" ry="2.8" />
      </g>
      <g className="fill-none stroke-foreground" strokeLinecap="round">
        <path d="M106.5 49.5Q111 47.5 115 49" strokeWidth={1.8} />
        <path d="M125 49Q129 47.5 133.5 49.5" strokeWidth={1.8} />
        <path d="M114.5 70Q120 73.5 125.5 70" strokeWidth={1.6} />
      </g>
      <path
        d="M120 58L118.5 64H121"
        className={LINE_CLASS}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
}

export function CharacterFigure({
  bodyProgress,
  label,
  className = "",
}: CharacterFigureProps) {
  const figure = useMemo(() => buildFigure(bodyProgress), [bodyProgress]);
  const flip = `translate(${FIGURE_WIDTH} 0) scale(-1 1)`;

  return (
    <svg
      viewBox={`0 0 ${FIGURE_WIDTH} ${FIGURE_HEIGHT}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <ellipse cx="120" cy="387" rx="68" ry="7" className="fill-line" />
      <path d={figure.torso} className="fill-character-skin" />
      <g
        className={LINE_CLASS}
        strokeWidth={2}
        strokeLinecap="round"
        opacity={figure.definition}
      >
        <path d={figure.trap} />
        <path d={figure.trap} transform={flip} />
      </g>
      <path d={figure.tank} className="fill-primary" />
      <g
        className="fill-none stroke-primary-strong"
        strokeWidth={2}
        strokeLinecap="round"
      >
        <g opacity={figure.definition}>
          <path d={figure.pec} />
          <path d={figure.pec} transform={flip} />
        </g>
        <path d={figure.abs} opacity={figure.definition * 0.6} />
      </g>
      <Limbs figure={figure} />
      <g transform={flip}>
        <Limbs figure={figure} />
      </g>
      <path d={figure.shorts} className="fill-foreground" />
      <Head />
    </svg>
  );
}
