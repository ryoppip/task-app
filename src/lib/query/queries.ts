import { defineQuery } from "./query-store";

export const profileQuery = defineQuery("profile", (repositories) =>
  repositories.profile.get(),
);

export const habitLogsQuery = defineQuery("habitLogs", (repositories) =>
  repositories.achievements.listLogs(),
);

export const xpTransactionsQuery = defineQuery(
  "xpTransactions",
  (repositories) => repositories.achievements.listXpTransactions(),
);
