// Windows でドライブ文字が小文字(c:)のまま起動すると vitest が二重に読み込まれて失敗する。
// 実際の表記にそろえたパスから起動して防ぐ。
import { spawnSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { join } from "node:path";

const root = realpathSync.native(join(import.meta.dirname, ".."));
const { status } = spawnSync(
  process.execPath,
  [join(root, "node_modules/vitest/vitest.mjs"), ...process.argv.slice(2)],
  { cwd: root, stdio: "inherit" },
);
process.exit(status ?? 1);
