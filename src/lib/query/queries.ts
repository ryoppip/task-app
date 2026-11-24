import { defineQuery } from "./query-store";

export const profileQuery = defineQuery("profile", (repositories) =>
  repositories.profile.get(),
);
