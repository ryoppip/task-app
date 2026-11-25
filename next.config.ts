import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

// public/character/<キャラクターID>/<体型>/stage-N.png を置くと、SVG より優先される(要再ビルド)
const imageRoot = join(process.cwd(), "public", "character");
const characterImages = existsSync(imageRoot)
  ? readdirSync(imageRoot, { recursive: true, encoding: "utf8" })
      .map((path) => path.replaceAll("\\", "/"))
      .filter((path) => /^[a-z]+\/[a-z]+\/stage-[1-4]\.png$/.test(path))
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
