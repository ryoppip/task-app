import { createLocalRepositories } from "./local/local-repositories";
import type { Repositories } from "./types";

/** データ層の実装を選ぶ唯一の場所。STEP 9 で Supabase 実装に切り替える */
export function createRepositories(): Repositories {
  return createLocalRepositories();
}
