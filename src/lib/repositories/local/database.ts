import type {
  Challenge,
  DailyReview,
  Exercise,
  Goal,
  Habit,
  HabitLog,
  Profile,
  Task,
  WorkoutLog,
  XpTransaction,
} from "@/lib/domain/types";
import { RepositoryError } from "../errors";

export const LOCAL_STORAGE_KEY = "habit-quest:db";
const SCHEMA_VERSION = 1;

export interface LocalDatabaseState {
  profile: Profile | null;
  habits: Habit[];
  habitLogs: HabitLog[];
  xpTransactions: XpTransaction[];
  challenges: Challenge[];
  goals: Goal[];
  tasks: Task[];
  exercises: Exercise[];
  workouts: WorkoutLog[];
  dailyReviews: DailyReview[];
}

export type StorageLike = Pick<Storage, "getItem" | "setItem">;

function createEmptyState(): LocalDatabaseState {
  return {
    profile: null,
    habits: [],
    habitLogs: [],
    xpTransactions: [],
    challenges: [],
    goals: [],
    tasks: [],
    exercises: [],
    workouts: [],
    dailyReviews: [],
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseState(raw: string): LocalDatabaseState {
  const parsed: unknown = JSON.parse(raw);
  if (!isRecord(parsed) || parsed.version !== SCHEMA_VERSION) {
    throw new Error("対応していないデータ形式です");
  }
  const stored = parsed.state;
  if (!isRecord(stored)) throw new Error("データ本体がありません");

  const state = createEmptyState();
  for (const [key, initial] of Object.entries(state)) {
    const value = stored[key];
    if (value === undefined) continue;
    const valid = Array.isArray(initial)
      ? Array.isArray(value)
      : value === null || isRecord(value);
    if (!valid) throw new Error(`${key} の形式が不正です`);
  }
  return { ...state, ...stored };
}

/**
 * 全データを1つのキーに保存する。
 * 読み込みから保存までを同期的に行うため、1回の write が1トランザクションになる。
 * 壊れたデータは読み込みで必ずエラーにし、上書きで失わないようにする。
 */
export class LocalDatabase {
  constructor(private readonly getStorage: () => StorageLike) {}

  read(): LocalDatabaseState {
    let raw: string | null;
    try {
      raw = this.getStorage().getItem(LOCAL_STORAGE_KEY);
    } catch (cause) {
      throw new RepositoryError(
        "storage_unavailable",
        "ブラウザの保存領域を利用できません。Cookie やサイトデータの設定を確認してください。",
        { cause },
      );
    }
    if (raw === null) return createEmptyState();
    try {
      return parseState(raw);
    } catch (cause) {
      throw new RepositoryError(
        "corrupted_data",
        "保存データを読み込めませんでした。データは上書きせずに残しています。",
        { cause },
      );
    }
  }

  /** mutate が例外を投げた場合は何も保存しない */
  write<T>(mutate: (state: LocalDatabaseState) => T): T {
    const state = this.read();
    const result = mutate(state);
    try {
      this.getStorage().setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({ version: SCHEMA_VERSION, state }),
      );
    } catch (cause) {
      throw new RepositoryError(
        "storage_full",
        "保存できませんでした。ブラウザの空き容量を確認してください。",
        { cause },
      );
    }
    return result;
  }
}
