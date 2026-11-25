import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// public/character/<キャラクターID>/stage-N.png を置くと、SVG より優先される(要再ビルド)
const imageRoot = join(process.cwd(), "public", "character");
const characterImages = existsSync(imageRoot)
  ? readdirSync(imageRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap(({ name }) =>
        [1, 2, 3, 4]
          .map((stage) => `${name}/stage-${stage}.png`)
          .filter((path) => existsSync(join(imageRoot, path))),
      )
  : [];

const nextConfig: NextConfig = {
  env: {
    CHARACTER_IMAGES: characterImages.join(","),
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
