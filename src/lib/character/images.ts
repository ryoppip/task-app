import type { GrowthStage } from "@/lib/domain/growth";

/** next.config.ts がビルド時に調べた、PNG 素材がある段階(例: "1,2") */
const AVAILABLE_STAGES = (process.env.CHARACTER_PNG_STAGES ?? "").split(",");

/** PNG 素材があればそのパス、なければ null(SVG で描く) */
export function getCharacterImage(stage: GrowthStage): string | null {
  return AVAILABLE_STAGES.includes(String(stage))
    ? `/character/stage-${stage}.png`
    : null;
}
