import type { DateKey } from "@/lib/date/date-key";
import type {
  Challenge,
  DailyReview,
  Entity,
  Exercise,
  Goal,
  Habit,
  HabitLog,
  HabitLogSource,
  Profile,
  Task,
  WorkoutLog,
  XpTransaction,
} from "@/lib/domain/types";

/** 保存側が決める項目を除いた、作成時の入力 */
export type CreateInput<T extends Entity> = Omit<T, keyof Entity>;
export type UpdateInput<T extends Entity> = Partial<CreateInput<T>>;

export interface CrudRepository<T extends Entity> {
  list(): Promise<T[]>;
  create(input: CreateInput<T>): Promise<T>;
  update(id: string, patch: UpdateInput<T>): Promise<T>;
  remove(id: string): Promise<void>;
}

export interface ProfileRepository {
  /** 未作成なら初期値で作成して返す */
  get(): Promise<Profile>;
  update(patch: UpdateInput<Profile>): Promise<Profile>;
}

/** 記録と XP 履歴を残すため、習慣の物理削除は提供しない */
export interface HabitRepository {
  /** アーカイブ済みも含む */
  list(): Promise<Habit[]>;
  create(input: Omit<CreateInput<Habit>, "archivedAt">): Promise<Habit>;
  update(
    id: string,
    patch: Omit<UpdateInput<Habit>, "archivedAt">,
  ): Promise<Habit>;
  archive(id: string): Promise<Habit>;
}

export interface CompleteHabitInput {
  habitId: string;
  logDate: DateKey;
  source: HabitLogSource;
}

export interface CancelHabitInput {
  habitId: string;
  logDate: DateKey;
  /** 指定すると、その方法で達成した記録だけを取り消す */
  onlySource?: HabitLogSource;
}

/**
 * 達成記録と XP 履歴は必ず一緒に更新する。
 * 達成・取消はどちらも冪等で、繰り返しても XP は二重に増減しない。
 */
export interface AchievementRepository {
  listLogs(): Promise<HabitLog[]>;
  listXpTransactions(): Promise<XpTransaction[]>;
  complete(input: CompleteHabitInput): Promise<HabitLog>;
  /** 取り消した記録を返す。対象がなければ null */
  cancel(input: CancelHabitInput): Promise<HabitLog | null>;
}

export interface DailyReviewRepository {
  list(): Promise<DailyReview[]>;
  /** 同じ日の振り返りがあれば上書きする(1日1件) */
  save(input: CreateInput<DailyReview>): Promise<DailyReview>;
  remove(id: string): Promise<void>;
}

/** UI が依存する唯一のデータアクセス口。実装は local / supabase で差し替える */
export interface Repositories {
  profile: ProfileRepository;
  habits: HabitRepository;
  achievements: AchievementRepository;
  challenges: CrudRepository<Challenge>;
  goals: CrudRepository<Goal>;
  tasks: CrudRepository<Task>;
  exercises: CrudRepository<Exercise>;
  workouts: CrudRepository<WorkoutLog>;
  dailyReviews: DailyReviewRepository;
  /** 別タブなど、この画面の外で起きた変更を購読する。戻り値で解除 */
  subscribeExternalChanges(listener: () => void): () => void;
}
