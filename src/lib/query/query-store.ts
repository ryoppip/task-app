import type { Repositories } from "@/lib/repositories/types";

export interface QueryDefinition<T> {
  key: string;
  fetch: (repositories: Repositories) => Promise<T>;
}

export function defineQuery<T>(
  key: string,
  fetch: QueryDefinition<T>["fetch"],
): QueryDefinition<T> {
  return { key, fetch };
}

export interface QuerySnapshot<T> {
  data: T | undefined;
  error: unknown;
  isLoading: boolean;
}

export const INITIAL_SNAPSHOT: QuerySnapshot<never> = {
  data: undefined,
  error: null,
  isLoading: true,
};

interface Entry {
  query: QueryDefinition<unknown>;
  snapshot: QuerySnapshot<unknown>;
  listeners: Set<() => void>;
  /** 最新の要求だけを反映するための番号 */
  version: number;
  isFresh: boolean;
}

/** 画面間で取得結果を共有する小さなキャッシュ */
export class QueryStore {
  private readonly entries = new Map<string, Entry>();

  constructor(private readonly repositories: Repositories) {}

  getSnapshot<T>(query: QueryDefinition<T>): QuerySnapshot<T> {
    const entry = this.entries.get(query.key);
    // 1つの key は1つの QueryDefinition に対応する
    return entry ? (entry.snapshot as QuerySnapshot<T>) : INITIAL_SNAPSHOT;
  }

  subscribe<T>(query: QueryDefinition<T>, listener: () => void): () => void {
    const entry = this.ensureEntry(query);
    entry.listeners.add(listener);
    if (!entry.isFresh) void this.load(entry);
    return () => entry.listeners.delete(listener);
  }

  /** 楽観的更新。進行中の古い取得結果では上書きされない */
  setData<T>(query: QueryDefinition<T>, data: T): void {
    const entry = this.ensureEntry(query);
    entry.version += 1;
    entry.isFresh = true;
    this.publish(entry, { data, error: null, isLoading: false });
  }

  /** 対象を再取得する。省略時はすべて */
  async invalidate(queries?: { key: string }[]): Promise<void> {
    const keys = queries?.map((query) => query.key);
    const targets = [...this.entries.values()].filter(
      (entry) => !keys || keys.includes(entry.query.key),
    );
    await Promise.all(
      targets.map((entry) => {
        entry.isFresh = false;
        return entry.listeners.size > 0 ? this.load(entry) : undefined;
      }),
    );
  }

  private ensureEntry<T>(query: QueryDefinition<T>): Entry {
    let entry = this.entries.get(query.key);
    if (!entry) {
      entry = {
        query,
        snapshot: INITIAL_SNAPSHOT,
        listeners: new Set(),
        version: 0,
        isFresh: false,
      };
      this.entries.set(query.key, entry);
    }
    return entry;
  }

  private async load(entry: Entry): Promise<void> {
    entry.isFresh = true;
    entry.version += 1;
    const version = entry.version;
    try {
      const data = await entry.query.fetch(this.repositories);
      if (version !== entry.version) return;
      this.publish(entry, { data, error: null, isLoading: false });
    } catch (error) {
      if (version !== entry.version) return;
      entry.isFresh = false;
      this.publish(entry, {
        data: entry.snapshot.data,
        error,
        isLoading: false,
      });
    }
  }

  private publish(entry: Entry, snapshot: QuerySnapshot<unknown>): void {
    entry.snapshot = snapshot;
    for (const listener of entry.listeners) listener();
  }
}
