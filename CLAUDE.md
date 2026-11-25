# CLAUDE.md

このファイルは、このリポジトリで作業する Claude Code への指示です。

## プロジェクト概要

- 名称: Habit Quest(習慣・目標・成長記録を一元管理する Web アプリ)
- 技術: Next.js(App Router)/ React / TypeScript(strict)/ Tailwind CSS v4 / Vitest。Supabase は STEP 9、Recharts は使う STEP で導入
- 中心となる体験: 習慣を記録するほど、細身のキャラクターが筋肉質に成長していく様子を見せる
- 対象外: 筋トレ・ジム記録(種目・重量・回数など)。筋トレも、ほかと同じ1つの習慣として扱う
- 進め方: STEP 1〜10 の順に実装し(STEP 5 のキャラクター成長は STEP 2 に統合、STEP 6 の筋トレ・ジム記録は欠番)、各 STEP の完了ごとに報告してユーザーの確認を待つ

Next.js は学習データと仕様が異なる場合がある。詳細は @AGENTS.md を参照。

## コマンド

| 用途 | コマンド |
|---|---|
| セットアップ | `npm install` |
| 開発サーバー | `npm run dev` |
| ビルド | `npm run build` |
| 型チェック | `npm run typecheck` |
| Lint | `npm run lint` |
| テスト | `npm test`(`npx vitest` の直接実行は、パスが小文字の `c:` だと失敗する) |

## 構成

- `src/app/`: ルーティング。画面の中身は `src/components/` に置く
- `src/components/`: `layout` / `ui`(汎用部品)/ 機能別
- `src/hooks/`: UI とデータ層をつなぐ
- `src/lib/domain/`: 型と純粋な計算ロジック(単体テスト必須)
- `src/lib/repositories/`: データアクセス。UI は `types.ts` のインターフェースだけに依存し、実装の選択は `index.ts` に限定する
- `src/lib/query/`: 取得結果の共有と楽観的更新

## 設計上の決まりごと

- `any` を使わない
- 日付は Asia/Tokyo 基準の `YYYY-MM-DD`。`src/lib/date/date-key.ts` の関数を使い、`Date` の日付計算を直接書かない
- 色は `src/app/globals.css` のトークンだけを使う(Tailwind の既定パレットは無効)。文字とボタンの緑は `primary-strong`、図形は `primary`
- 累計 XP は `xpTransactions` の合計を正とする。達成・取消は必ず `repositories.achievements` を通す
- キャラクターの体型は、習慣を1つ以上達成した日の累計で決まる(0日→90日で連続的に変化、30・60・90日が段階の節目)。判定は `src/lib/domain/growth.ts`、体型の描画は `src/lib/character/figure.ts` にまとめる
- `public/character/stage-1.png`〜`stage-4.png` を置くと、その段階は SVG より優先される(要再ビルド)
- ゲーム要素を増やしすぎず、「必ず習慣になる」と保証する文言は使わない

## Git 運用ルール

**コードを変更するたびに、コミットして GitHub にプッシュすること。** ユーザーへの都度確認は不要。

### 手順

1. 変更が動作することを確認する(テスト・Lint・ビルドがあれば実行する)
2. `git status` と `git diff` で、意図しない変更が含まれていないか確認する
3. 関係するファイルだけをステージしてコミットする
4. 現在のブランチを `git push` する(初回は `git push -u origin <ブランチ名>`)
5. プッシュの結果をユーザーに報告する

「変更するたび」とは、1 つの依頼や機能など、意味のあるまとまりごとを指す。1 ファイルの編集ごとではない。複数の独立した変更は、コミットを分ける。

### ブランチ

- 特に指示がなければ `main` に直接コミットしてプッシュしてよい
- ユーザーがブランチや PR を指定した場合はそれに従う

### コミットメッセージ

- 日本語で、何をなぜ変えたかを簡潔に書く
- 先頭に種別を付ける: `feat:` 機能追加 / `fix:` 不具合修正 / `refactor:` 整理 / `docs:` 文書 / `test:` テスト / `chore:` その他
- 例: `feat: タスクの期限設定を追加`

### 禁止事項

- `.env`、API キー、パスワードなどの秘密情報をコミットしない
- `node_modules/` などの依存パッケージやビルド生成物をコミットしない(`.gitignore` に追加する)
- ユーザーの明示的な指示なしに、強制プッシュ(`--force`)、`git reset --hard`、プッシュ済み履歴の書き換えをしない
- `--no-verify` でフックを回避しない

### うまくいかないとき

- テストやビルドが失敗したら、直してからプッシュする。直せない場合はプッシュせずユーザーに報告する
- リモートが先行していてプッシュが拒否されたら、`git pull --rebase` で取り込んでから再度プッシュする。競合の解決に判断が必要な場合はユーザーに確認する
- リポジトリやリモート(`origin`)が未設定、または認証エラーの場合は、勝手にリポジトリを作成せずユーザーに報告する
