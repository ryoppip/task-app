import { existsSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// public/character/stage-N.png を置くと、その段階は SVG より優先される(要再ビルド)
const characterPngStages = [1, 2, 3, 4].filter((stage) =>
  existsSync(join(process.cwd(), "public", "character", `stage-${stage}.png`)),
);

const nextConfig: NextConfig = {
  env: {
    CHARACTER_PNG_STAGES: characterPngStages.join(","),
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
