import { BothSides } from "./both-sides";
import {
  Face,
  MuzzleMouth,
  OUTLINE,
  OUTLINE_PROPS,
  Whiskers,
  type Expression,
  type TailProps,
} from "./face";

const SHAPE = `fill-character-body ${OUTLINE}`;

/** 頬がふくらんだ、もちのような頭 */
function MochiHead() {
  return (
    <path
      d="M150 46C190 46 215 70 221 106C228 145 201 169 150 169C99 169 72 145 79 106C85 70 110 46 150 46Z"
      className={SHAPE}
      {...OUTLINE_PROPS}
    />
  );
}

function Nose({ y }: { y: number }) {
  return (
    <path
      d={`M145.5 ${y}Q150 ${y - 2.5} 154.5 ${y}Q153.5 ${y + 4} 150 ${y + 5}Q146.5 ${y + 4} 145.5 ${y}Z`}
      className="fill-character-beak"
    />
  );
}

function Tooth({ y }: { y: number }) {
  return (
    <rect
      x="146.5"
      y={y}
      width="7"
      height="6.5"
      rx="2"
      className={`fill-card ${OUTLINE}`}
      strokeWidth={1.6}
    />
  );
}

export function HamsterHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <circle cx="200" cy="61" r="18" className={SHAPE} {...OUTLINE_PROPS} />
        <circle cx="200" cy="62" r="10" className="fill-character-cheek" />
      </BothSides>
      <path
        d="M150 46C189 46 211 66 216 98C234 116 232 152 204 162C186 170 114 170 96 162C68 152 66 116 84 98C89 66 111 46 150 46Z"
        className={SHAPE}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 100C160 122 188 110 211 126C222 146 208 160 190 163C172 165 128 165 110 163C92 160 78 146 89 126C112 110 140 122 150 100Z"
        className="fill-character-mark"
      />
      <Face {...expression} cheekDx={56} cheekY={141} />
      <Nose y={128} />
      <Tooth y={138} />
      <MuzzleMouth y={134} />
    </>
  );
}

export function CatHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <path
          d="M172 54Q187 33 201 28Q207 26 209 33Q217 58 215 88Z"
          className={SHAPE}
          {...OUTLINE_PROPS}
        />
        <path
          d="M187 57Q194 47 201 43Q206 58 206 74Z"
          className="fill-character-cheek"
        />
      </BothSides>
      <MochiHead />
      <path
        d="M150 52V66M137 54L139 65M163 54L161 65"
        className="fill-none stroke-character-mark"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <ellipse
        cx="150"
        cy="140"
        rx="23"
        ry="16"
        className="fill-character-belly"
      />
      <Face {...expression} />
      <Nose y={130} />
      <MuzzleMouth y={136} />
      <Whiskers y={128} />
    </>
  );
}

export function PandaHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <circle
          cx="204"
          cy="61"
          r="19"
          className={`fill-character-mark ${OUTLINE}`}
          {...OUTLINE_PROPS}
        />
      </BothSides>
      <MochiHead />
      <BothSides>
        <ellipse
          cx="187"
          cy="122"
          rx="15"
          ry="18.5"
          transform="rotate(-32 187 122)"
          className="fill-character-mark"
        />
      </BothSides>
      <Face {...expression} eyeDx={35} browGap={26} cheekDx={55} cheekY={146} />
      <Nose y={129} />
      <MuzzleMouth y={135} />
    </>
  );
}

export function RabbitHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <path
          d="M163 62C154 30 161 5 176 4C193 3 198 34 190 66Z"
          className={SHAPE}
          {...OUTLINE_PROPS}
        />
        <path
          d="M171 56C166 34 169 15 176 14C185 14 187 36 182 56Z"
          className="fill-character-mark"
        />
      </BothSides>
      <MochiHead />
      <Face {...expression} />
      <Nose y={128} />
      <Tooth y={138} />
      <MuzzleMouth y={134} />
    </>
  );
}

export function OtterHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <circle cx="212" cy="80" r="12.5" className={SHAPE} {...OUTLINE_PROPS} />
        <circle cx="212" cy="81" r="6" className="fill-character-mark" />
      </BothSides>
      <MochiHead />
      <path
        d="M150 119C176 115 206 124 210 143C208 160 180 165 150 165C120 165 92 160 90 143C94 124 124 115 150 119Z"
        className="fill-character-mark"
      />
      <Face {...expression} eyeY={115} cheekY={135} />
      <path
        d="M140 126Q150 119 160 126Q159 134 150 136Q141 134 140 126Z"
        className="fill-character-beak"
      />
      <MuzzleMouth y={138} />
      <Whiskers y={139} />
    </>
  );
}

const CAT_TAIL = "M138 258Q88 270 76 246Q70 228 84 220";

export function CatTail() {
  return (
    <>
      <path
        d={CAT_TAIL}
        className={`fill-none ${OUTLINE}`}
        strokeWidth={20}
        strokeLinecap="round"
      />
      <path
        d={CAT_TAIL}
        className="fill-none stroke-character-body"
        strokeWidth={14}
        strokeLinecap="round"
      />
    </>
  );
}

export function OtterTail() {
  return (
    <path
      d="M142 246Q112 276 70 282Q60 280 64 270Q94 258 122 232Z"
      className={SHAPE}
      {...OUTLINE_PROPS}
    />
  );
}

export function RabbitTail({ hip }: TailProps) {
  return (
    <circle
      cx={150 - hip - 3}
      cy="256"
      r="11"
      className={`fill-character-belly ${OUTLINE}`}
      {...OUTLINE_PROPS}
    />
  );
}
