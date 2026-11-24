import { describe, expect, it, vi } from "vitest";
import { createLocalRepositories } from "@/lib/repositories/local/local-repositories";
import { defineQuery, QueryStore } from "./query-store";

const repositories = createLocalRepositories({
  getStorage: () => ({ getItem: () => null, setItem: () => undefined }),
});

describe("QueryStore", () => {
  it("購読時に取得し、結果を共有する", async () => {
    const fetch = vi.fn(async () => 1);
    const query = defineQuery("q", fetch);
    const store = new QueryStore(repositories);
    store.subscribe(query, () => undefined);
    store.subscribe(query, () => undefined);
    await vi.waitFor(() => expect(store.getSnapshot(query).data).toBe(1));
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("進行中の取得は楽観的更新を上書きしない", async () => {
    let resolve: (value: string) => void = () => undefined;
    const query = defineQuery(
      "q",
      () =>
        new Promise<string>((done) => {
          resolve = done;
        }),
    );
    const store = new QueryStore(repositories);
    store.subscribe(query, () => undefined);
    store.setData(query, "optimistic");
    resolve("stale");
    await new Promise((done) => setTimeout(done, 0));
    expect(store.getSnapshot(query).data).toBe("optimistic");
  });

  it("失敗後に再取得すると回復する", async () => {
    let shouldFail = true;
    const query = defineQuery("q", async () => {
      if (shouldFail) throw new Error("失敗");
      return "ok";
    });
    const store = new QueryStore(repositories);
    store.subscribe(query, () => undefined);
    await vi.waitFor(() =>
      expect(store.getSnapshot(query).error).toBeInstanceOf(Error),
    );
    shouldFail = false;
    await store.invalidate([query]);
    expect(store.getSnapshot(query)).toMatchObject({ data: "ok", error: null });
  });
});
