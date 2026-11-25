import { useId, useMemo, type ReactNode } from "react";
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

/** 右半身の内容を、左にも反転して描く */
function BothSides({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <g transform={`translate(${FIGURE_WIDTH} 0) scale(-1 1)`}>{children}</g>
    </>
  );
}

function Leg({ figure }: { figure: Figure }) {
  return (
    <>
      <path d={figure.leg} className="fill-character-skin" />
      <g opacity={figure.definition}>
        <path
          d={figure.quadShade}
          className="fill-none stroke-character-shade"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
        <path d={figure.calfShade} className="fill-character-shade" />
      </g>
      <path d={figure.shoe} className="fill-primary-strong" />
      <path d={figure.shoeSole} className="fill-foreground" />
    </>
  );
}

function Arm({ figure }: { figure: Figure }) {
  const { fist, definition } = figure;
  const fingerX = (ratio: number) => fist.x + fist.size * ratio;

  return (
    <>
      <path d={figure.forearm} className="fill-character-skin" />
      <path
        d={figure.forearmShade}
        className="fill-none stroke-character-shade"
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={definition}
      />
      <path d={figure.upperArm} className="fill-character-skin" />
      <g opacity={definition}>
        <path d={figure.tricepsShade} className="fill-character-shade" />
        <path d={figure.bicepsHighlight} className="fill-character-light" />
      </g>
      <path d={figure.deltoid} className="fill-character-skin" />
      <g opacity={definition}>
        <path d={figure.deltoidShade} className="fill-character-shade" />
        <path d={figure.deltoidHighlight} className="fill-character-light" />
      </g>

      <rect
        x={fist.x}
        y={fist.y}
        width={fist.size}
        height={fist.size * 0.92}
        rx={fist.size * 0.34}
        className="fill-character-skin"
      />
      <path
        d={[0.28, 0.5, 0.72]
          .map(
            (ratio) =>
              `M${fingerX(ratio)} ${fist.y + fist.size * 0.12}v${fist.size * 0.32}`,
          )
          .join("")}
        className="fill-none stroke-character-shade"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <path
        d={`M${fingerX(0.12)} ${fist.y + fist.size * 0.6}h${fist.size * 0.56}`}
        className="fill-none stroke-character-shade"
        strokeWidth={1.6}
        strokeLinecap="round"
      />
      <path d={figure.wristband} className="fill-primary" />
    </>
  );
}

function Torso({ figure }: { figure: Figure }) {
  const tankClipId = useId();
  const { definition } = figure;

  return (
    <>
      <clipPath id={tankClipId}>
        <path d={figure.tank} />
      </clipPath>
      <path d={figure.torso} className="fill-character-skin" />
      <g opacity={definition}>
        <BothSides>
          <path d={figure.trapShade} className="fill-character-shade" />
          <path d={figure.latShade} className="fill-character-shade" />
          <path d={figure.pecShade} className="fill-character-shade" />
        </BothSides>
        <path
          d={figure.pecLine}
          className="fill-none stroke-character-shade"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </g>
      <g
        className="fill-none stroke-character-shade"
        strokeWidth={1.6}
        strokeLinecap="round"
      >
        <BothSides>
          <path d={figure.collarbone} />
        </BothSides>
      </g>

      <path d={figure.tank} className="fill-primary" />
      <g clipPath={`url(#${tankClipId})`} opacity={definition}>
        <BothSides>
          <path
            d={figure.pecShade}
            className="fill-primary-strong"
            opacity={0.75}
          />
        </BothSides>
        <path
          d={figure.abs}
          className="fill-none stroke-primary-strong"
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      </g>
    </>
  );
}

/** トレーニングベルト */
function Belt({ path }: { path: string }) {
  return (
    <>
      <path d={path} className="fill-character-belt" />
      <rect
        x="141"
        y="225"
        width="18"
        height="14"
        rx="2.5"
        className="fill-none stroke-secondary"
        strokeWidth={2.5}
      />
      <path d="M150 232H157" className="stroke-secondary" strokeWidth={2.5} />
    </>
  );
}

/** 顔と髪型は全段階で共通 */
function Head() {
  return (
    <g>
      <BothSides>
        <ellipse
          cx="174.5"
          cy="80"
          rx="4.5"
          ry="7"
          className="fill-character-skin"
        />
      </BothSides>
      <path
        d="M127 58H173V84C173 95 168 102 162 106C156 110 144 110 138 106C132 102 127 95 127 84Z"
        className="fill-character-skin"
      />
      <path
        d="M125.5 76C123 56 128 42 139 40L143 36L149 39L156 35L160 39.5C172 42 177 56 174.5 76L170.5 70V62H129.5V70Z"
        className="fill-foreground"
      />
      <path
        d="M125.5 57Q150 51 174.5 57V66.5Q150 60.5 125.5 66.5Z"
        className="fill-primary"
      />
      <BothSides>
        <path
          d="M155 76L166 74.5"
          className="stroke-foreground"
          strokeWidth={3.6}
          strokeLinecap="round"
        />
        <ellipse
          cx="160"
          cy="82.5"
          rx="2.3"
          ry="2.8"
          className="fill-foreground"
        />
      </BothSides>
      <path
        d="M150 83L148 91H151.5"
        className="fill-none stroke-character-shade"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M141.5 96.5Q151 101 159 95.5Q157 103.5 150 103.5Q144 103.5 141.5 96.5Z"
        className="fill-card stroke-foreground"
        strokeWidth={1.6}
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

  return (
    <svg
      viewBox={`0 0 ${FIGURE_WIDTH} ${FIGURE_HEIGHT}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    >
      <ellipse cx="150" cy="408" rx="82" ry="7" className="fill-line" />
      <BothSides>
        <Leg figure={figure} />
      </BothSides>
      <Torso figure={figure} />
      <path d={figure.shorts} className="fill-foreground" />
      <Belt path={figure.belt} />
      <BothSides>
        <Arm figure={figure} />
      </BothSides>
      <Head />
    </svg>
  );
}
