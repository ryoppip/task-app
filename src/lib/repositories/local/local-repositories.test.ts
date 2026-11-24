import { beforeEach, describe, expect, it } from "vitest";
import type { Repositories } from "../types";
import { LOCAL_STORAGE_KEY, type StorageLike } from "./database";
import { createLocalRepositories } from "./local-repositories";

const TODAY = "2026-11-25";

function createMemoryStorage() {
  const data = new Map<string, string>();
  const storage: StorageLike = {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => void data.set(key, value),
  };
  return { data, storage };
}

let data: Map<string, string>;
let storage: StorageLike;
let repos: Repositories;

function open(): Repositories {
  return createLocalRepositories({
    getStorage: () => storage,
    now: () => new Date("2026-11-25T03:00:00.000Z"),
  });
}

async function totalXp(): Promise<number> {
  const transactions = await repos.achievements.listXpTransactions();
  return transactions.reduce((sum, item) => sum + item.amount, 0);
}

function createHabit(xp = 50) {
  return repos.habits.create({
    name: "筋トレ",
    category: "fitness",
    xp,
    frequency: { type: "daily" },
    target: null,
    icon: "dumbbell",
  });
}

beforeEach(() => {
  ({ data, storage } = createMemoryStorage());
  repos = open();
});

describe("保存", () => {
  it("開き直してもデータが残る", async () => {
    await repos.profile.update({ displayName: "テスト" });
    const habit = await createHabit();
    repos = open();
    expect((await repos.profile.get()).displayName).toBe("テスト");
    expect(await repos.habits.list()).toEqual([habit]);
  });

  it("壊れたデータを上書きしない", async () => {
    data.set(LOCAL_STORAGE_KEY, "{broken");
    await expect(repos.profile.get()).rejects.toMatchObject({
      code: "corrupted_data",
    });
    await expect(createHabit()).rejects.toMatchObject({
      code: "corrupted_data",
    });
    expect(data.get(LOCAL_STORAGE_KEY)).toBe("{broken");
  });

  it("書き込みに失敗したらエラーにする", async () => {
    storage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    await expect(createHabit()).rejects.toMatchObject({ code: "storage_full" });
  });

  it("存在しないデータの更新・削除はエラーにする", async () => {
    await expect(repos.goals.remove("none")).rejects.toMatchObject({
      code: "not_found",
    });
    await expect(
      repos.tasks.update("none", { name: "x" }),
    ).rejects.toMatchObject({ code: "not_found" });
  });
});

describe("達成と XP", () => {
  it("同じ日に2回達成しても XP は1回分", async () => {
    const { id } = await createHabit();
    const key = { habitId: id, logDate: TODAY };
    const first = await repos.achievements.complete({
      ...key,
      source: "manual",
    });
    const second = await repos.achievements.complete({
      ...key,
      source: "workout",
    });
    expect(second).toEqual(first);
    expect(await repos.achievements.listLogs()).toHaveLength(1);
    expect(await totalXp()).toBe(50);
  });

  it("取り消すと XP も戻り、二重に取り消しても減らない", async () => {
    const { id } = await createHabit();
    const key = { habitId: id, logDate: TODAY };
    await repos.achievements.complete({ ...key, source: "manual" });
    await repos.achievements.cancel(key);
    expect(await repos.achievements.cancel(key)).toBeNull();
    expect(await totalXp()).toBe(0);
    const transactions = await repos.achievements.listXpTransactions();
    expect(transactions.map((item) => item.kind)).toEqual(["earn", "revoke"]);
  });

  it("XP 設定を変えても、過去の獲得分と取消額は変わらない", async () => {
    const { id } = await createHabit(50);
    const key = { habitId: id, logDate: TODAY };
    await repos.achievements.complete({ ...key, source: "manual" });
    await repos.habits.update(id, { xp: 999 });
    expect(await totalXp()).toBe(50);
    await repos.achievements.cancel(key);
    expect(await totalXp()).toBe(0);
  });

  it("onlySource が違う記録は取り消さない", async () => {
    const { id } = await createHabit();
    const key = { habitId: id, logDate: TODAY };
    await repos.achievements.complete({ ...key, source: "manual" });
    expect(
      await repos.achievements.cancel({ ...key, onlySource: "workout" }),
    ).toBeNull();
    expect(await totalXp()).toBe(50);
  });

  it("未来日・不正な日付・アーカイブ済みの習慣は達成できない", async () => {
    const { id } = await createHabit();
    const complete = (logDate: string) =>
      repos.achievements.complete({ habitId: id, logDate, source: "manual" });
    await expect(complete("2026-11-26")).rejects.toMatchObject({
      code: "invalid_input",
    });
    await expect(complete("2026-02-30")).rejects.toMatchObject({
      code: "invalid_input",
    });
    await repos.habits.archive(id);
    await expect(complete(TODAY)).rejects.toMatchObject({
      code: "invalid_input",
    });
    expect(await totalXp()).toBe(0);
  });

  it("アーカイブしても過去の記録と XP は残る", async () => {
    const { id } = await createHabit();
    await repos.achievements.complete({
      habitId: id,
      logDate: TODAY,
      source: "manual",
    });
    await repos.habits.archive(id);
    expect(await repos.achievements.listLogs()).toHaveLength(1);
    expect(await totalXp()).toBe(50);
  });
});

describe("関連データ", () => {
  it("目標を削除するとタスクの紐づけだけ外れる", async () => {
    const goal = await repos.goals.create({
      name: "目標",
      description: "",
      category: "work",
      startDate: TODAY,
      dueDate: null,
      manualProgress: 0,
    });
    await repos.tasks.create({
      name: "タスク",
      description: "",
      dueDate: null,
      priority: "medium",
      goalId: goal.id,
      completedAt: null,
    });
    await repos.goals.remove(goal.id);
    expect((await repos.tasks.list())[0]?.goalId).toBeNull();
  });

  it("記録がある種目は削除できない", async () => {
    const exercise = await repos.exercises.create({ name: "ベンチプレス" });
    await repos.workouts.create({
      workoutDate: TODAY,
      exerciseId: exercise.id,
      weightKg: 60,
      reps: 10,
      sets: 3,
      memo: "",
    });
    await expect(repos.exercises.remove(exercise.id)).rejects.toMatchObject({
      code: "invalid_input",
    });
    expect(await repos.exercises.list()).toHaveLength(1);
  });

  it("振り返りは1日1件で上書きされる", async () => {
    const base = {
      reviewDate: TODAY,
      accomplishments: "",
      impression: "",
      tomorrow: "",
      memo: "",
    };
    const first = await repos.dailyReviews.save({ ...base, memo: "1回目" });
    const second = await repos.dailyReviews.save({ ...base, memo: "2回目" });
    expect(second.id).toBe(first.id);
    expect(await repos.dailyReviews.list()).toEqual([second]);
  });
});
