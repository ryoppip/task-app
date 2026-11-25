import {
  DEFAULT_BODY_TYPE,
  DEFAULT_CHARACTER_ID,
} from "@/lib/character/characters";
import { isDateKey, toDateKey, type DateKey } from "@/lib/date/date-key";
import type {
  Challenge,
  Entity,
  Goal,
  Habit,
  HabitLog,
  Profile,
  Task,
} from "@/lib/domain/types";
import { RepositoryError } from "../errors";
import type { CrudRepository, Repositories } from "../types";
import { createId } from "./create-id";
import {
  LOCAL_STORAGE_KEY,
  LocalDatabase,
  type LocalDatabaseState,
  type StorageLike,
} from "./database";

interface LocalRepositoryOptions {
  getStorage?: () => StorageLike;
  now?: () => Date;
}

interface CrudCollections {
  habits: Habit;
  challenges: Challenge;
  goals: Goal;
  tasks: Task;
}

function notFound(): RepositoryError {
  return new RepositoryError("not_found", "対象のデータが見つかりません。");
}

export function createLocalRepositories({
  getStorage = () => window.localStorage,
  now = () => new Date(),
}: LocalRepositoryOptions = {}): Repositories {
  const db = new LocalDatabase(getStorage);
  const timestamp = () => now().toISOString();

  function createEntity(): Entity {
    const createdAt = timestamp();
    return { id: createId(), createdAt, updatedAt: createdAt };
  }

  function patchEntity<T extends Entity>(
    collection: T[],
    id: string,
    patch: Partial<T>,
  ): T {
    const index = collection.findIndex((item) => item.id === id);
    const current = collection[index];
    if (!current) throw notFound();
    const updated: T = { ...current, ...patch, updatedAt: timestamp() };
    collection[index] = updated;
    return updated;
  }

  function createCrud<K extends keyof CrudCollections>(
    key: K,
    onRemove?: (state: LocalDatabaseState, id: string) => void,
  ): CrudRepository<CrudCollections[K]> {
    type T = CrudCollections[K];
    // キーと要素型の対応は CrudCollections が保証する
    const select = (state: LocalDatabaseState) => state[key] as unknown as T[];
    return {
      async list() {
        return select(db.read());
      },
      async create(input) {
        return db.write((state) => {
          const entity = { ...input, ...createEntity() } as unknown as T;
          select(state).push(entity);
          return entity;
        });
      },
      async update(id, patch) {
        return db.write((state) =>
          patchEntity<T>(select(state), id, patch as Partial<T>),
        );
      },
      async remove(id) {
        db.write((state) => {
          const collection = select(state);
          const index = collection.findIndex((item) => item.id === id);
          if (index === -1) throw notFound();
          collection.splice(index, 1);
          onRemove?.(state, id);
        });
      },
    };
  }

  function ensureProfile(state: LocalDatabaseState): Profile {
    state.profile ??= {
      ...createEntity(),
      displayName: "",
      characterId: DEFAULT_CHARACTER_ID,
      bodyType: DEFAULT_BODY_TYPE,
    };
    return state.profile;
  }

  function assertLoggableDate(date: DateKey): void {
    if (!isDateKey(date)) {
      throw new RepositoryError("invalid_input", "日付の形式が正しくありません。");
    }
    if (date > toDateKey(now())) {
      throw new RepositoryError("invalid_input", "未来の日付は達成にできません。");
    }
  }

  const habits = createCrud("habits");

  return {
    profile: {
      async get() {
        return db.read().profile ?? db.write(ensureProfile);
      },
      async update(patch) {
        return db.write((state) => {
          const updated: Profile = {
            ...ensureProfile(state),
            ...patch,
            updatedAt: timestamp(),
          };
          state.profile = updated;
          return updated;
        });
      },
    },

    habits: {
      list: () => habits.list(),
      create: (input) => habits.create({ ...input, archivedAt: null }),
      update: (id, patch) => habits.update(id, patch),
      async archive(id) {
        return db.write((state) =>
          patchEntity(state.habits, id, { archivedAt: timestamp() }),
        );
      },
    },

    achievements: {
      async listLogs() {
        return db.read().habitLogs;
      },
      async listXpTransactions() {
        return db.read().xpTransactions;
      },
      async complete({ habitId, logDate }) {
        assertLoggableDate(logDate);
        return db.write((state) => {
          const existing = state.habitLogs.find(
            (log) => log.habitId === habitId && log.logDate === logDate,
          );
          if (existing) return existing;

          const habit = state.habits.find((item) => item.id === habitId);
          if (!habit) throw notFound();
          if (habit.archivedAt !== null) {
            throw new RepositoryError(
              "invalid_input",
              "削除した習慣は達成にできません。",
            );
          }

          const createdAt = timestamp();
          const log: HabitLog = {
            id: createId(),
            habitId,
            logDate,
            xpAwarded: habit.xp,
            createdAt,
          };
          state.habitLogs.push(log);
          state.xpTransactions.push({
            id: createId(),
            habitId,
            logDate,
            kind: "earn",
            amount: log.xpAwarded,
            createdAt,
          });
          return log;
        });
      },
      async cancel({ habitId, logDate }) {
        return db.write((state) => {
          const index = state.habitLogs.findIndex(
            (log) => log.habitId === habitId && log.logDate === logDate,
          );
          const log = state.habitLogs[index];
          if (!log) return null;

          state.habitLogs.splice(index, 1);
          state.xpTransactions.push({
            id: createId(),
            habitId,
            logDate,
            kind: "revoke",
            amount: 0 - log.xpAwarded,
            createdAt: timestamp(),
          });
          return log;
        });
      },
    },

    challenges: createCrud("challenges"),
    goals: createCrud("goals", (state, goalId) => {
      for (const task of state.tasks) {
        if (task.goalId === goalId) task.goalId = null;
      }
    }),
    tasks: createCrud("tasks"),

    dailyReviews: {
      async list() {
        return db.read().dailyReviews;
      },
      async save(input) {
        return db.write((state) => {
          const existing = state.dailyReviews.find(
            (review) => review.reviewDate === input.reviewDate,
          );
          if (existing) {
            return patchEntity(state.dailyReviews, existing.id, input);
          }
          const review = { ...input, ...createEntity() };
          state.dailyReviews.push(review);
          return review;
        });
      },
      async remove(id) {
        db.write((state) => {
          const index = state.dailyReviews.findIndex((item) => item.id === id);
          if (index === -1) throw notFound();
          state.dailyReviews.splice(index, 1);
        });
      },
    },

    subscribeExternalChanges(listener) {
      const handleStorage = (event: StorageEvent) => {
        // key が null なのは全消去(clear)のとき
        if (event.key === LOCAL_STORAGE_KEY || event.key === null) listener();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
  };
}
