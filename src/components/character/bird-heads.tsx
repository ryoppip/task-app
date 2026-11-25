import { Face, OUTLINE, OUTLINE_PROPS, type Expression } from "./face";

export function ShimaenagaHead(expression: Expression) {
  return (
    <>
      <path
        d="M150 44C156 41 160 40 162 43C190 46 214 70 215 104C218 108 217 113 214 116C208 146 182 160 150 160C118 160 92 146 86 116C83 113 82 108 85 104C86 70 110 46 138 43C141 40 145 41 150 44Z"
        className={`fill-character-body ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M143 44Q145 37 150 35Q149 40 152 43Q155 38 159 38Q156 42 157 45"
        className={`fill-character-body ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <Face
        eyeDx={31}
        eyeY={104}
        eyeSize={7.2}
        cheekDx={42}
        cheekY={121}
        {...expression}
      />
      <path
        d="M144.5 111Q150 107 155.5 111L150 120Z"
        className="fill-character-beak"
      />
    </>
  );
}

export function KiwiHead(expression: Expression) {
  return (
    <>
      <path
        d="M150 50C186 50 211 74 211 106C211 139 186 159 150 159C114 159 89 139 89 106C89 74 114 50 150 50Z"
        className={`fill-character-body ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M142 51Q138 41 131 38M150 50Q150 39 147 33M158 51Q162 42 169 40"
        className={`fill-none ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M126 72l-3 8M139 66l-2 8M163 66l2 8M176 73l3 8M106 104l-1 8M109 124l1 8M194 104l1 8M191 125l-1 8M128 143l1 7M172 144l-1 7"
        className="fill-none stroke-character-mark"
        strokeWidth={2.4}
        strokeLinecap="round"
      />
      <Face eyeDx={27} eyeY={98} cheekDx={39} cheekY={115} {...expression} />
      <path
        d="M138 113Q150 103 162 113Q178 132 204 150Q209 155 202 155Q170 148 146 128Q138 121 138 113Z"
        className={`fill-character-beak ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 122Q172 141 198 151"
        className={`fill-none ${OUTLINE}`}
        strokeWidth={1.6}
        strokeLinecap="round"
        opacity={0.6}
      />
    </>
  );
}

export function PenguinHead(expression: Expression) {
  return (
    <>
      <path
        d="M150 47C188 47 213 72 213 106C213 140 187 159 150 159C113 159 87 140 87 106C87 72 112 47 150 47Z"
        className={`fill-character-body ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <path
        d="M150 84C158 68 182 66 192 84C204 108 196 154 150 154C104 154 96 108 108 84C118 66 142 68 150 84Z"
        className="fill-character-mark"
      />
      <path
        d="M146 48Q143 39 137 37M152 47Q154 38 160 36"
        className={`fill-none ${OUTLINE}`}
        {...OUTLINE_PROPS}
      />
      <Face eyeDx={25} eyeY={104} cheekDx={35} cheekY={122} {...expression} />
      <path
        d="M137 115Q150 105 163 115Q158 127 150 127Q142 127 137 115Z"
        className={`fill-character-beak ${OUTLINE}`}
        {...OUTLINE_PROPS}
        strokeWidth={2.2}
      />
      <path
        d="M140 116.5Q150 120 160 116.5"
        className={`fill-none ${OUTLINE}`}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </>
  );
}

/** シマエナガの長い尾 */
export function ShimaenagaTail() {
  return (
    <path
      d="M140 250Q112 288 76 304Q70 300 74 294Q100 270 128 236Z"
      className={`fill-character-mark ${OUTLINE}`}
      {...OUTLINE_PROPS}
    />
  );
}
