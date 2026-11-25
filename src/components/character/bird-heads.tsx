import { Face, OUTLINE, OUTLINE_PROPS, type Expression } from "./face";

const SHAPE = `fill-character-body ${OUTLINE}`;

export function ShimaenagaHead(expression: Expression) {
  return (
    <>
      <path
        d="M141 44Q143 35 149 32Q148 38 151 42Q155 36 161 36Q157 40 158 46"
        className={SHAPE}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 42C194 42 224 74 225 112C226 149 197 170 150 170C103 170 74 149 75 112C76 74 106 42 150 42Z"
        className={SHAPE}
        {...OUTLINE_PROPS}
      />
      <Face {...expression} />
      <path
        d="M144 127Q150 122.5 156 127Q155 132 150 135Q145 132 144 127Z"
        className="fill-character-beak"
      />
    </>
  );
}

export function KiwiHead(expression: Expression) {
  return (
    <>
      <path
        d="M141 46Q137 35 129 33M150 44Q151 32 147 27M159 46Q163 36 171 35"
        className={`fill-none ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 43C191 43 219 71 222 108C225 146 197 169 150 169C103 169 75 146 78 108C81 71 109 43 150 43Z"
        className={SHAPE}
        {...OUTLINE_PROPS}
      />
      <path
        d="M122 68l-3 8M140 60l-1 8M160 60l1 8M178 68l3 8M97 96l-2 8M203 96l2 8"
        className="fill-none stroke-character-mark"
        strokeWidth={3}
        strokeLinecap="round"
      />
      <Face {...expression} />
      <path
        d="M140 131Q150 121 160 131Q159 151 152 174Q150 178 148 174Q141 151 140 131Z"
        className={`fill-character-beak ${OUTLINE}`}
        {...OUTLINE_PROPS}
        strokeWidth={2.4}
      />
    </>
  );
}

export function PenguinHead(expression: Expression) {
  return (
    <>
      <path
        d="M145 45Q142 35 135 33M152 44Q154 34 161 32"
        className={`fill-none ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 43C191 43 219 71 222 108C225 146 197 169 150 169C103 169 75 146 78 108C81 71 109 43 150 43Z"
        className={SHAPE}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 93C160 73 197 75 208 104C217 136 194 164 150 164C106 164 83 136 92 104C103 75 140 73 150 93Z"
        className="fill-character-mark"
      />
      <Face {...expression} cheekDx={50} />
      <path
        d="M140 131Q150 122 160 131Q157 140 150 140Q143 140 140 131Z"
        className={`fill-character-beak ${OUTLINE}`}
        {...OUTLINE_PROPS}
        strokeWidth={2.2}
      />
    </>
  );
}

/** シマエナガの長い尾 */
export function ShimaenagaTail() {
  return (
    <path
      d="M138 248Q104 264 66 268Q60 263 65 257Q102 246 132 226Z"
      className={`fill-character-mark ${OUTLINE}`}
      {...OUTLINE_PROPS}
    />
  );
}
