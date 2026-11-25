import type { DateKey, Weekday } from "@/lib/date/date-key";

/** ISO 8601 の日時文字列 */
export type Timestamp = string;

export interface Entity {
  id: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Category =
  | "fitness"
  | "learning"
  | "work"
  | "reading"
  | "life"
  | "other";

export type Frequency =
  | { type: "daily" }
  | { type: "weekdays"; days: Weekday[] }
  | { type: "weekly"; times: number };

export interface Target {
  value: number;
  unit: "minutes" | "count";
}

export interface Profile extends Entity {
  displayName: string;
}

export interface Habit extends Entity {
  name: string;
  category: Category;
  xp: number;
  frequency: Frequency;
  target: Target | null;
  /** Lucide のアイコン名 */
  icon: string;
  archivedAt: Timestamp | null;
}

export interface HabitLog {
  id: string;
  habitId: string;
  logDate: DateKey;
  /** 付与時点の XP。習慣の設定を後で変えても変わらない */
  xpAwarded: number;
  createdAt: Timestamp;
}

export interface XpTransaction {
  id: string;
  habitId: string;
  logDate: DateKey;
  kind: "earn" | "revoke";
  /** earn は0以上、revoke は0以下。合計が累計 XP になる */
  amount: number;
  createdAt: Timestamp;
}

export type ChallengeDuration = 30 | 60 | 90;

export interface ChallengePause {
  startDate: DateKey;
  /** 再開した日(この日は停止に含まない)。null なら停止中 */
  resumeDate: DateKey | null;
}

/** 状態(進行中・一時停止・完了・終了)は保存せず、日付から導出する */
export interface Challenge extends Entity {
  name: string;
  description: string;
  startDate: DateKey;
  durationDays: ChallengeDuration;
  habitIds: string[];
  target: Target | null;
  frequency: Frequency;
  pauses: ChallengePause[];
  /** 途中で終了した日。null なら終了していない */
  endedOn: DateKey | null;
}

export interface Goal extends Entity {
  name: string;
  description: string;
  category: Category;
  startDate: DateKey;
  dueDate: DateKey | null;
  /** 0〜100。関連タスクがない場合に使う手入力の進捗率 */
  manualProgress: number;
}

export type TaskPriority = "high" | "medium" | "low";

export interface Task extends Entity {
  name: string;
  description: string;
  dueDate: DateKey | null;
  priority: TaskPriority;
  goalId: string | null;
  completedAt: Timestamp | null;
}

export interface DailyReview extends Entity {
  reviewDate: DateKey;
  accomplishments: string;
  impression: string;
  tomorrow: string;
  memo: string;
}
