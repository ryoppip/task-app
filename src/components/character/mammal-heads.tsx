import { BothSides } from "./both-sides";
import {
  Face,
  MuzzleMouth,
  OUTLINE,
  OUTLINE_PROPS,
  Whiskers,
  type Expression,
} from "./face";

const ROUND_HEAD =
  "M150 50C188 50 214 74 214 108C214 141 188 159 150 159C112 159 86 141 86 108C86 74 112 50 150 50Z";

function HeadShape() {
  return (
    <path
      d={ROUND_HEAD}
      className={`fill-character-body ${OUTLINE}`}
      {...OUTLINE_PROPS}
    />
  );
}

function Nose({ y }: { y: number }) {
  return (
    <path
      d={`M145 ${y}Q150 ${y - 3} 155 ${y}Q154 ${y + 5} 150 ${y + 6}Q146 ${y + 5} 145 ${y}Z`}
      className="fill-character-beak"
    />
  );
}

export function HamsterHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <circle
          cx="194"
          cy="63"
          r="17"
          className={`fill-character-body ${OUTLINE}`}
          {...OUTLINE_PROPS}
        />
        <circle cx="194" cy="64" r="9" className="fill-character-cheek" />
      </BothSides>
      <path
        d="M150 50C186 50 208 70 212 98C224 112 220 142 200 152C184 160 168 160 150 160C132 160 116 160 100 152C80 142 76 112 88 98C92 70 114 50 150 50Z"
        className={`fill-character-body ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 88C158 106 178 102 198 116C210 130 200 148 186 152C174 157 126 157 114 152C100 148 90 130 102 116C122 102 142 106 150 88Z"
        className="fill-character-mark"
      />
      <path
        d="M150 52L150 72"
        className="stroke-character-outline"
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.35}
      />
      <Face eyeDx={29} eyeY={100} cheekDx={46} cheekY={122} {...expression} />
      <Nose y={110} />
      <rect
        x="145.5"
        y="122"
        width="9"
        height="8"
        rx="1.5"
        className={`fill-card ${OUTLINE}`}
        strokeWidth={1.6}
      />
      <MuzzleMouth y={117} />
    </>
  );
}

export function CatHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <path
          d="M170 58L203 30Q211 60 208 88Z"
          className={`fill-character-body ${OUTLINE}`}
          {...OUTLINE_PROPS}
        />
        <path d="M183 60L199 44Q203 60 202 74Z" className="fill-character-cheek" />
      </BothSides>
      <HeadShape />
      <path
        d="M150 54V72M137 56L139 69M163 56L161 69"
        className="stroke-character-mark"
        strokeWidth={5}
        strokeLinecap="round"
      />
      <BothSides>
        <path
          d="M210 100L196 102M208 118L195 117"
          className="stroke-character-mark"
          strokeWidth={4.5}
          strokeLinecap="round"
        />
      </BothSides>
      <ellipse cx="150" cy="128" rx="27" ry="19" className="fill-character-belly" />
      <Face eyeDx={28} eyeY={102} eyeSize={7.2} cheekDx={39} cheekY={121} {...expression} />
      <Nose y={114} />
      <MuzzleMouth y={121} />
      <Whiskers y={129} />
    </>
  );
}

export function PandaHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <circle
          cx="197"
          cy="62"
          r="18"
          className={`fill-character-mark ${OUTLINE}`}
          {...OUTLINE_PROPS}
        />
      </BothSides>
      <HeadShape />
      <BothSides>
        <ellipse
          cx="178"
          cy="104"
          rx="14.5"
          ry="18.5"
          transform="rotate(-28 178 104)"
          className="fill-character-mark"
        />
        {/* 黒い模様の上でも目が見えるように、白い縁を付ける */}
        <circle cx="176" cy="103" r="9" className="fill-card" />
      </BothSides>
      <Face eyeDx={26} eyeY={103} browGap={27} cheekDx={42} cheekY={127} {...expression} />
      <Nose y={118} />
      <MuzzleMouth y={125} />
    </>
  );
}

export function RabbitHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <path
          d="M160 64C154 34 160 6 173 5C188 4 193 34 184 66Z"
          className={`fill-character-body ${OUTLINE}`}
          {...OUTLINE_PROPS}
        />
        <path
          d="M167 60C163 36 167 16 173 15C181 15 183 36 178 60Z"
          className="fill-character-mark"
        />
      </BothSides>
      <HeadShape />
      <Face eyeDx={29} eyeY={102} eyeSize={7.2} cheekDx={40} cheekY={121} {...expression} />
      <Nose y={113} />
      <rect
        x="146"
        y="125"
        width="8"
        height="8"
        rx="1.5"
        className={`fill-card ${OUTLINE}`}
        strokeWidth={1.6}
      />
      <MuzzleMouth y={120} />
    </>
  );
}

export function OtterHead(expression: Expression) {
  return (
    <>
      <BothSides>
        <circle
          cx="206"
          cy="78"
          r="12"
          className={`fill-character-body ${OUTLINE}`}
          {...OUTLINE_PROPS}
        />
        <circle cx="206" cy="79" r="5.5" className="fill-character-mark" />
      </BothSides>
      <HeadShape />
      <path
        d="M150 98C170 98 196 108 200 126C200 146 176 156 150 156C124 156 100 146 100 126C104 108 130 98 150 98Z"
        className="fill-character-mark"
      />
      <Face eyeDx={31} eyeY={96} cheekDx={42} cheekY={120} {...expression} />
      <path
        d="M138 108Q150 101 162 108Q161 118 150 120Q139 118 138 108Z"
        className="fill-character-beak"
      />
      <MuzzleMouth y={123} />
      <Whiskers y={130} />
    </>
  );
}

export function CatTail() {
  return (
    <>
      <path
        d="M140 258Q92 276 84 250Q80 232 92 226"
        className={`fill-none ${OUTLINE}`}
        strokeWidth={17}
        strokeLinecap="round"
      />
      <path
        d="M140 258Q92 276 84 250Q80 232 92 226"
        className="fill-none stroke-character-body"
        strokeWidth={12}
        strokeLinecap="round"
      />
    </>
  );
}

export function OtterTail() {
  return (
    <path
      d="M146 246Q122 290 84 310Q74 312 75 302Q96 272 124 242Z"
      className={`fill-character-body ${OUTLINE}`}
      {...OUTLINE_PROPS}
    />
  );
}

export function RabbitTail() {
  return (
    <circle
      cx="133"
      cy="258"
      r="13"
      className={`fill-character-belly ${OUTLINE}`}
      {...OUTLINE_PROPS}
    />
  );
}
