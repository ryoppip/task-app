import { useCallback, useContext, useSyncExternalStore } from "react";
import { RepositoryContext } from "@/components/providers/repository-provider";
import {
  INITIAL_SNAPSHOT,
  type QueryDefinition,
  type QuerySnapshot,
} from "@/lib/query/query-store";

export function useRepository() {
  const value = useContext(RepositoryContext);
  if (!value) throw new Error("RepositoryProvider の内側で使ってください");
  return value;
}

/** query は再レンダーで変わらないよう、モジュール直下で定義したものを渡す */
export function useRepositoryQuery<T>(
  query: QueryDefinition<T>,
): QuerySnapshot<T> {
  const { queryStore } = useRepository();
  const subscribe = useCallback(
    (listener: () => void) => queryStore.subscribe(query, listener),
    [queryStore, query],
  );
  return useSyncExternalStore<QuerySnapshot<T>>(
    subscribe,
    () => queryStore.getSnapshot(query),
    () => INITIAL_SNAPSHOT,
  );
}
