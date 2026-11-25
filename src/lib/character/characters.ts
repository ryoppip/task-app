export const CHARACTERS = [
  { id: "shimaenaga", name: "シマエナガ", description: "まっしろ、まんまる" },
  { id: "kiwi", name: "キウイ", description: "長いくちばしがじまん" },
  { id: "penguin", name: "ペンギン", description: "よちよち歩きの努力家" },
  { id: "hamster", name: "ハムスター", description: "ほおぶくろにやる気" },
  { id: "cat", name: "ネコ", description: "気まぐれだけど負けずぎらい" },
  { id: "panda", name: "パンダ", description: "のんびりこつこつ" },
  { id: "rabbit", name: "ウサギ", description: "一歩ずつぴょんぴょん" },
  { id: "otter", name: "カワウソ", description: "毎日あそぶように続ける" },
] as const;

export type CharacterId = (typeof CHARACTERS)[number]["id"];

export const DEFAULT_CHARACTER_ID: CharacterId = "shimaenaga";

/** スタートの体型 */
export const BODY_TYPES = [
  { id: "slim", name: "ガリガリから" },
  { id: "chubby", name: "ぽってりから" },
] as const;

export type BodyType = (typeof BODY_TYPES)[number]["id"];

export const DEFAULT_BODY_TYPE: BodyType = "slim";

export function isBodyType(value: unknown): value is BodyType {
  return BODY_TYPES.some((bodyType) => bodyType.id === value);
}

export function isCharacterId(value: unknown): value is CharacterId {
  return CHARACTERS.some((character) => character.id === value);
}

export function getCharacterName(id: CharacterId): string {
  return CHARACTERS.find((character) => character.id === id)?.name ?? "";
}
