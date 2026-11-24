import { useCallback } from "react";
import type { Profile } from "@/lib/domain/types";
import { profileQuery } from "@/lib/query/queries";
import type { UpdateInput } from "@/lib/repositories/types";
import { useRepository, useRepositoryQuery } from "./use-repository";

export function useProfile() {
  const { repositories, queryStore } = useRepository();
  const { data: profile, error, isLoading } = useRepositoryQuery(profileQuery);

  const updateProfile = useCallback(
    async (patch: UpdateInput<Profile>) => {
      const updated = await repositories.profile.update(patch);
      queryStore.setData(profileQuery, updated);
    },
    [repositories, queryStore],
  );

  return { profile, error, isLoading, updateProfile };
}
