import type { GrowthStage } from "@/lib/domain/growth";
import type { CharacterId } from "./characters";

/** next.config.ts がビルド時に調べた PNG 素材(例: "kiwi/stage-1.png,...") */
const AVAILABLE_IMAGES = (process.env.CHARACTER_IMAGES ?? "").split(",");

/** PNG 素材があればそのパス、なければ null(SVG で描く) */
export function getCharacterImage(
  characterId: CharacterId,
  stage: GrowthStage,
): string | null {
  const path = `${characterId}/stage-${stage}.png`;
  return AVAILABLE_IMAGES.includes(path) ? `/character/${path}` : null;
}
