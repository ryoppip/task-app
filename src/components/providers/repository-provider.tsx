"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import { QueryStore } from "@/lib/query/query-store";
import { createRepositories } from "@/lib/repositories";
import type { Repositories } from "@/lib/repositories/types";

interface RepositoryContextValue {
  repositories: Repositories;
  queryStore: QueryStore;
}

export const RepositoryContext = createContext<RepositoryContextValue | null>(
  null,
);

export function RepositoryProvider({ children }: { children: ReactNode }) {
  const [value] = useState<RepositoryContextValue>(() => {
    const repositories = createRepositories();
    return { repositories, queryStore: new QueryStore(repositories) };
  });

  useEffect(
    () =>
      value.repositories.subscribeExternalChanges(() => {
        void value.queryStore.invalidate();
      }),
    [value],
  );

  return <RepositoryContext value={value}>{children}</RepositoryContext>;
}
