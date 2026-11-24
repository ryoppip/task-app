export type RepositoryErrorCode =
  | "not_found"
  | "invalid_input"
  | "storage_unavailable"
  | "storage_full"
  | "corrupted_data";

/** message はそのまま画面に表示できる日本語にする */
export class RepositoryError extends Error {
  constructor(
    readonly code: RepositoryErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "RepositoryError";
  }
}

export function toErrorMessage(error: unknown): string {
  return error instanceof RepositoryError
    ? error.message
    : "処理に失敗しました。時間をおいてもう一度お試しください。";
}
